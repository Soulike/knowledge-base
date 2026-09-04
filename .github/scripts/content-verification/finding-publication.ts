import type {
  FindingClassification,
  VerificationFinding,
} from "./finding-events.ts";
import type { VerificationManifest } from "./manifest.ts";
import type { VerificationScope } from "./scope.ts";

const WORKFLOW_IDS = {
  "evergreen-knowledge": "verify-evergreen-knowledge",
  "maintained-agent-content": "verify-maintained-agent-content",
  "time-sensitive-knowledge": "verify-time-sensitive-knowledge",
} as const satisfies Record<VerificationScope, string>;

const SCOPE_NAMES = {
  "evergreen-knowledge": "evergreen Knowledge",
  "maintained-agent-content": "maintained Agent content",
  "time-sensitive-knowledge": "time-sensitive Knowledge",
} as const satisfies Record<VerificationScope, string>;

const CLASSIFICATION_NAMES = {
  "modification-required": "modification required",
  "verification-inconclusive": "verification inconclusive",
} as const satisfies Record<FindingClassification, string>;

type FindingRecord = {
  classification: FindingClassification;
  relatedTargets: string[];
  revision: string;
  scope: VerificationScope;
  target: string;
  version: 1;
  workflow: string;
};

export type FindingIssue = {
  authorLogin: string;
  body: string;
  labels: string[];
  number: string;
  pullRequest: boolean;
  state: "closed" | "open";
  title: string;
};

export type FindingIssueRepository = {
  createIssue(input: {
    assignees: string[];
    body: string;
    labels: string[];
    title: string;
  }): Promise<FindingIssue>;
  listOpenIssues(labels: string[]): Promise<FindingIssue[]>;
};

export type FindingPublicationContext = {
  runUrl: string;
};

export type FindingPublicationResult = {
  created: FindingIssue[];
  suppressed: Array<{
    findingId: string;
    issueNumber: string;
    reason: "publication_race";
  }>;
};

function removeControlCharacters(value: string): string {
  return [...value]
    .filter((character) => {
      const codePoint = character.codePointAt(0) ?? 0;
      return character === "\n" || character === "\t" || codePoint >= 32;
    })
    .filter((character) => character.codePointAt(0) !== 127)
    .join("");
}

function safeIssueText(value: string): string {
  return removeControlCharacters(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replace(/@(?=[\p{L}\p{N}_-])/gu, "@\u200b");
}

function quotedIssueText(value: string): string {
  return safeIssueText(value)
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
}

function record(
  manifest: VerificationManifest,
  finding: VerificationFinding,
): FindingRecord {
  return {
    classification: finding.classification,
    relatedTargets: [...finding.relatedTargetIds].sort(),
    revision: manifest.revision,
    scope: manifest.scope,
    target: finding.targetId,
    version: 1,
    workflow: WORKFLOW_IDS[manifest.scope],
  };
}

function marker(value: FindingRecord): string {
  return `<!-- content-verification-finding: ${JSON.stringify(value)} -->`;
}

function parseMarker(body: string): FindingRecord | undefined {
  const match = /^<!-- content-verification-finding: (\{[^\n]+\}) -->/u.exec(
    body,
  );
  if (!match?.[1]) {
    return undefined;
  }
  let value: unknown;
  try {
    value = JSON.parse(match[1]) as unknown;
  } catch {
    return undefined;
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined;
  }
  const candidate = value as Record<string, unknown>;
  if (
    candidate.version !== 1 ||
    typeof candidate.workflow !== "string" ||
    typeof candidate.scope !== "string" ||
    typeof candidate.target !== "string" ||
    typeof candidate.revision !== "string" ||
    !Array.isArray(candidate.relatedTargets) ||
    candidate.relatedTargets.some((target) => typeof target !== "string") ||
    (candidate.classification !== "modification-required" &&
      candidate.classification !== "verification-inconclusive")
  ) {
    return undefined;
  }
  if (!(candidate.scope in WORKFLOW_IDS)) {
    return undefined;
  }
  return candidate as FindingRecord;
}

function labels(finding: VerificationFinding): string[] {
  return finding.classification === "modification-required"
    ? ["automated-verification", "modification-required"]
    : ["automated-verification", "ready-for-human"];
}

function issueTitle(
  manifest: VerificationManifest,
  finding: VerificationFinding,
): string {
  return `[${SCOPE_NAMES[manifest.scope]} ${CLASSIFICATION_NAMES[finding.classification]}] ${safeIssueText(finding.targetId)}`.slice(
    0,
    256,
  );
}

function issueBody(
  manifest: VerificationManifest,
  finding: VerificationFinding,
  context: FindingPublicationContext,
): string {
  const relatedTargets = finding.relatedTargetIds.length
    ? [...finding.relatedTargetIds]
        .sort()
        .map((targetId) => `- \`${safeIssueText(targetId)}\``)
        .join("\n")
    : "None.";
  const maintainerResponse =
    finding.classification === "modification-required"
      ? "Apply the smallest coherent correction described by the finding across the primary and related targets, preserve the behavior that remains necessary, validate the affected responsibility as a whole, and close this issue when the repository contains one current account."
      : "Determine whether the finding requires a content change. If no change is needed, record the evidence and the condition that would require revalidation before closing the issue; otherwise make the coherent content change and then close it.";
  return `${marker(record(manifest, finding))}

# Content verification finding

- Classification: ${finding.classification}
- Scope: ${SCOPE_NAMES[manifest.scope]}
- Primary target: \`${safeIssueText(finding.targetId)}\`
- Revision: \`${manifest.revision}\`
- Run: [${context.runUrl}](${context.runUrl})

## Related targets

${relatedTargets}

## Finding

${quotedIssueText(finding.finding)}

## Maintainer response

${maintainerResponse}`;
}

function sameRecord(left: FindingRecord, right: FindingRecord): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function comparableBody(body: string): string {
  return body.replace(
    /^- Run: \[[^\]]+\]\(https:\/\/github\.com\/[^\s)]+\/actions\/runs\/\d+\)$/mu,
    "- Run: <workflow run>",
  );
}

async function findExactOpenIssue(
  repository: FindingIssueRepository,
  findingLabels: string[],
  expectedRecord: FindingRecord,
  title: string,
  body: string,
): Promise<FindingIssue | undefined> {
  const issues = await repository.listOpenIssues(findingLabels);
  return issues.find((issue) => {
    const existingRecord = parseMarker(issue.body);
    const existingLabels = new Set(issue.labels);
    return (
      issue.state === "open" &&
      !issue.pullRequest &&
      issue.authorLogin === "github-actions[bot]" &&
      findingLabels.every((label) => existingLabels.has(label)) &&
      issue.title === title &&
      existingRecord !== undefined &&
      sameRecord(existingRecord, expectedRecord) &&
      comparableBody(issue.body) === comparableBody(body)
    );
  });
}

export async function publishVerificationFindings(
  manifest: VerificationManifest,
  findings: readonly VerificationFinding[],
  context: FindingPublicationContext,
  repository: FindingIssueRepository,
): Promise<FindingPublicationResult> {
  const result: FindingPublicationResult = { created: [], suppressed: [] };
  for (const finding of findings) {
    const findingLabels = labels(finding);
    const expectedRecord = record(manifest, finding);
    const title = issueTitle(manifest, finding);
    const body = issueBody(manifest, finding, context);
    const duplicate = await findExactOpenIssue(
      repository,
      findingLabels,
      expectedRecord,
      title,
      body,
    );
    if (duplicate) {
      result.suppressed.push({
        findingId: finding.findingId,
        issueNumber: duplicate.number,
        reason: "publication_race",
      });
      continue;
    }
    result.created.push(
      await repository.createIssue({
        assignees: ["Soulike"],
        body,
        labels: findingLabels,
        title,
      }),
    );
  }
  return result;
}
