import {
  parseAgenticVerificationOutput,
  type VerificationInconclusiveDecision,
} from "./agentic-gate.ts";
import type { VerificationManifest } from "./manifest.ts";
import type { VerificationScope } from "./scope.ts";

const CONFIRMATION_LABELS = [
  "automated-verification",
  "ready-for-human",
] as const;
const CONFIRMATION_AUTHOR = "github-actions[bot]";

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

type ConfirmationRecord = {
  revision: string;
  scope: VerificationScope;
  target: string;
  version: 1;
  workflow: string;
};

export type ConfirmationIssue = {
  authorLogin: string;
  body: string;
  htmlUrl: string;
  labels: string[];
  number: string;
  pullRequest: boolean;
  state: "closed" | "open";
  title: string;
};

export type ConfirmationIssueComment = {
  authorAssociation?: string;
  body: string;
  htmlUrl: string;
  id: string;
  issueNumber: string;
};

export type ConfirmationIssueRepository = {
  createIssue(input: {
    assignees: string[];
    body: string;
    labels: string[];
    title: string;
  }): Promise<ConfirmationIssue>;
  getComment(commentId: string): Promise<ConfirmationIssueComment>;
  getIssue(issueNumber: string): Promise<ConfirmationIssue>;
  listOpenIssues(labels: string[]): Promise<ConfirmationIssue[]>;
};

export type InconclusivePublicationContext = {
  owner: string;
  repo: string;
  runUrl: string;
  staged: boolean;
};

export type InconclusivePublicationResult = {
  created: ConfirmationIssue[];
  suppressed: Array<{
    issueNumber: string;
    reason:
      | "matching_open_issue"
      | "publication_race"
      | "staged"
      | "trusted_collaborator_disposition";
    targetId: string;
  }>;
};

function fail(message: string): never {
  throw new Error(`Inconclusive verification publisher: ${message}`);
}

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
    .replace(/<!--[\s\S]*?-->/gu, "")
    .replace(/@(?=[\p{L}\p{N}_-])/gu, "@\u200b");
}

function quotedIssueText(value: string): string {
  return safeIssueText(value)
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
}

function marker(record: ConfirmationRecord): string {
  return `<!-- content-verification-confirmation: ${JSON.stringify(record)} -->`;
}

function parseMarker(body: string): ConfirmationRecord | undefined {
  const match =
    /^<!-- content-verification-confirmation: (\{[^\n]+\}) -->/u.exec(body);
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
  const record = value as Record<string, unknown>;
  if (
    record.version !== 1 ||
    typeof record.workflow !== "string" ||
    typeof record.scope !== "string" ||
    typeof record.target !== "string" ||
    typeof record.revision !== "string"
  ) {
    return undefined;
  }
  if (!(record.scope in WORKFLOW_IDS)) {
    return undefined;
  }
  return record as ConfirmationRecord;
}

function confirmationRecord(
  manifest: VerificationManifest,
  targetId: string,
): ConfirmationRecord {
  return {
    revision: manifest.revision,
    scope: manifest.scope,
    target: targetId,
    version: 1,
    workflow: WORKFLOW_IDS[manifest.scope],
  };
}

function issueTitle(
  manifest: VerificationManifest,
  decision: VerificationInconclusiveDecision,
): string {
  return `${issueTitlePrefix(manifest.scope, decision.targetId)}${safeIssueText(decision.summary)}`.slice(
    0,
    256,
  );
}

function issueTitlePrefix(scope: VerificationScope, targetId: string): string {
  return `[${SCOPE_NAMES[scope]} verification inconclusive] ${safeIssueText(targetId)}: `;
}

function issueBody(
  manifest: VerificationManifest,
  decision: Extract<
    VerificationInconclusiveDecision,
    { action: "create_issue" }
  >,
  context: InconclusivePublicationContext,
): string {
  const related = decision.relatedIssueNumbers.length
    ? `\n\n## Related history\n\n${decision.relatedIssueNumbers
        .map(
          (number) =>
            `- https://github.com/${context.owner}/${context.repo}/issues/${number}`,
        )
        .join("\n")}`
    : "";
  return `${marker(confirmationRecord(manifest, decision.targetId))}

# Verification inconclusive

- Scope: ${SCOPE_NAMES[manifest.scope]}
- Target: \`${safeIssueText(decision.targetId)}\`
- Revision: \`${manifest.revision}\`
- Run: [${context.runUrl}](${context.runUrl})

## Finding

### ${safeIssueText(decision.summary)}

${quotedIssueText(decision.finding)}

## Evidence checked

${quotedIssueText(decision.evidenceChecked)}${related}

## Maintainer response

Resolve this confirmation issue in one of two ways:

1. If no content modification is needed, reply with how the information was obtained, why that makes it valid, and when it must be verified again. The trigger may be a date or another observable event. Then close the issue.
2. Otherwise, modify or delete the questioned content and then close the issue. The changed repository revision becomes the next verification subject; this path does not create a historical no-change disposition.

Future Agents may rely on a no-change reply only when this issue is closed and the reply author is an OWNER, MEMBER, or COLLABORATOR. Ambiguous, conflicting, or inapplicable history requires a new confirmation issue.`;
}

function sameBinding(
  manifest: VerificationManifest,
  targetId: string,
  issue: ConfirmationIssue,
): boolean {
  const record = parseMarker(issue.body);
  const labels = new Set(issue.labels);
  const titlePrefix = issueTitlePrefix(manifest.scope, targetId).slice(0, 256);
  return (
    !issue.pullRequest &&
    issue.authorLogin === CONFIRMATION_AUTHOR &&
    CONFIRMATION_LABELS.every((label) => labels.has(label)) &&
    issue.title.startsWith(titlePrefix) &&
    record?.scope === manifest.scope &&
    record.workflow === WORKFLOW_IDS[manifest.scope] &&
    record.target === targetId
  );
}

function comparableBody(body: string): string {
  return body.replace(
    /^- Run: \[[^\]]+\]\(https:\/\/github\.com\/[^\s)]+\/actions\/runs\/\d+\)$/mu,
    "- Run: <workflow run>",
  );
}

async function findExactOpenIssue(
  repository: ConfirmationIssueRepository,
  manifest: VerificationManifest,
  decision: Extract<
    VerificationInconclusiveDecision,
    { action: "create_issue" }
  >,
  context: InconclusivePublicationContext,
  title: string,
  body: string,
): Promise<ConfirmationIssue | undefined> {
  const issues = await repository.listOpenIssues([...CONFIRMATION_LABELS]);
  return issues.find(
    (issue) =>
      issue.state === "open" &&
      issue.title === title &&
      sameBinding(manifest, decision.targetId, issue) &&
      comparableBody(issue.body) === comparableBody(body),
  );
}

export async function applyVerificationInconclusiveDecisions(
  manifest: VerificationManifest,
  outputValue: unknown,
  context: InconclusivePublicationContext,
  repository: ConfirmationIssueRepository,
): Promise<InconclusivePublicationResult> {
  const output = parseAgenticVerificationOutput(manifest, outputValue);
  const result: InconclusivePublicationResult = {
    created: [],
    suppressed: [],
  };
  const authenticatedSuppressions = new Map<
    VerificationInconclusiveDecision,
    InconclusivePublicationResult["suppressed"][number]
  >();

  for (const decision of output.inconclusiveDecisions) {
    if (decision.action === "create_issue") {
      for (const issueNumber of decision.relatedIssueNumbers) {
        const issue = await repository.getIssue(issueNumber);
        if (!sameBinding(manifest, decision.targetId, issue)) {
          fail(
            `related issue #${issueNumber} is not an authenticated confirmation issue for '${decision.targetId}'.`,
          );
        }
      }
      continue;
    }

    const issue = await repository.getIssue(decision.issueNumber);
    if (!sameBinding(manifest, decision.targetId, issue)) {
      fail(
        `issue #${decision.issueNumber} is not an authenticated confirmation issue for '${decision.targetId}'.`,
      );
    }
    if (decision.reason === "matching_open_issue") {
      if (issue.state !== "open") {
        fail(`matching issue #${decision.issueNumber} is not open.`);
      }
      authenticatedSuppressions.set(decision, {
        issueNumber: decision.issueNumber,
        reason: "matching_open_issue",
        targetId: decision.targetId,
      });
      continue;
    }
    if (issue.state !== "closed") {
      fail(`disposition issue #${decision.issueNumber} is not closed.`);
    }
    if (!decision.commentId) {
      fail("trusted collaborator disposition is missing its comment id.");
    }
    const comment = await repository.getComment(decision.commentId);
    if (
      comment.id !== decision.commentId ||
      comment.issueNumber !== decision.issueNumber
    ) {
      fail(
        `comment ${decision.commentId} does not belong to issue #${decision.issueNumber}.`,
      );
    }
    if (!comment.body.trim()) {
      fail(`comment ${decision.commentId} has no disposition text.`);
    }
    if (
      !new Set(["OWNER", "MEMBER", "COLLABORATOR"]).has(
        comment.authorAssociation ?? "",
      )
    ) {
      fail(`comment ${decision.commentId} is not from a trusted collaborator.`);
    }
    authenticatedSuppressions.set(decision, {
      issueNumber: decision.issueNumber,
      reason: "trusted_collaborator_disposition",
      targetId: decision.targetId,
    });
  }

  for (const decision of output.inconclusiveDecisions) {
    if (decision.action === "do_not_create_issue") {
      const suppression = authenticatedSuppressions.get(decision);
      if (!suppression) {
        fail("authenticated no-issue decision was lost before publication.");
      }
      result.suppressed.push(suppression);
      continue;
    }
    const title = issueTitle(manifest, decision);
    const body = issueBody(manifest, decision, context);
    const duplicate = await findExactOpenIssue(
      repository,
      manifest,
      decision,
      context,
      title,
      body,
    );
    if (duplicate) {
      result.suppressed.push({
        issueNumber: duplicate.number,
        reason: "publication_race",
        targetId: decision.targetId,
      });
      continue;
    }
    if (context.staged) {
      result.suppressed.push({
        issueNumber: "staged",
        reason: "staged",
        targetId: decision.targetId,
      });
      continue;
    }
    result.created.push(
      await repository.createIssue({
        assignees: ["Soulike"],
        body,
        labels: [...CONFIRMATION_LABELS],
        title,
      }),
    );
  }
  return result;
}
