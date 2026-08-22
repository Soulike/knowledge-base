import type { GitHubIssue, IssuePublisher, NewIssue } from "./github.ts";
import type { VerificationOutput, VerificationUnitResult } from "./output.ts";
import type { VerificationScope } from "./targets.ts";

const labels = {
  automation: {
    color: "5319E7",
    description: "Created by scheduled content verification",
    name: "automated-verification",
  },
  failure: {
    color: "B60205",
    description: "Automated verification could not complete",
    name: "verification-failed",
  },
  modification: {
    color: "D93F0B",
    description: "Verified content requires modification",
    name: "modification-required",
  },
} as const;

export type PublicationContext = {
  assignee: string;
  repository: string;
  revision: string;
  runAttempt: number;
  runId: number;
  scope: VerificationScope;
};

export type PublicationResult = {
  created: number[];
  requiresFailure: boolean;
  updated: number[];
};

function safeMarkdown(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("@", "@\u200b");
}

function titleFor(unit: VerificationUnitResult): string {
  const prefix =
    unit.status === "modification-required"
      ? "Content verification: update"
      : "Content verification failed:";
  return `${prefix} ${unit.id}`.slice(0, 256);
}

function runUrl(context: PublicationContext): string {
  return `https://github.com/${context.repository}/actions/runs/${context.runId}/attempts/${context.runAttempt}`;
}

function list(items: string[]): string {
  return items.map((item) => `- ${safeMarkdown(item)}`).join("\n");
}

function evidence(unit: VerificationUnitResult): string {
  return unit.evidence
    .map(
      (item) =>
        `- **${safeMarkdown(item.source)}** — ${safeMarkdown(item.description)}`,
    )
    .join("\n");
}

function bodyFor(
  unit: VerificationUnitResult,
  context: PublicationContext,
): string {
  const sections = [
    `Automated \`${safeMarkdown(context.scope)}\` verification found an actionable result for \`${safeMarkdown(unit.id)}\` at revision [\`${context.revision.slice(0, 12)}\`](https://github.com/${context.repository}/commit/${context.revision}).`,
    `## Summary\n\n${safeMarkdown(unit.summary)}`,
    `## Evidence\n\n${evidence(unit)}`,
  ];
  if (unit.status === "modification-required") {
    sections.push(
      `## Required modifications\n\n${list(unit.requiredChanges)}`,
      `## Acceptance criteria\n\n${list(unit.acceptanceCriteria)}`,
    );
  } else {
    sections.push(
      `## Verification failure\n\n${safeMarkdown(unit.failure ?? "Unknown failure.")}`,
    );
  }
  sections.push(`[Open workflow run](${runUrl(context)})`);
  return `${sections.join("\n\n")}\n`;
}

function namesUnit(issue: GitHubIssue, unitId: string): boolean {
  return issue.title.includes(unitId) || issue.body.includes(unitId);
}

async function ensureLabels(publisher: IssuePublisher): Promise<void> {
  await publisher.ensureLabel(
    labels.automation.name,
    labels.automation.color,
    labels.automation.description,
  );
  await publisher.ensureLabel(
    labels.modification.name,
    labels.modification.color,
    labels.modification.description,
  );
  await publisher.ensureLabel(
    labels.failure.name,
    labels.failure.color,
    labels.failure.description,
  );
}

async function publishUnit(
  unit: VerificationUnitResult,
  context: PublicationContext,
  publisher: IssuePublisher,
): Promise<{ created?: number; updated?: number }> {
  const body = bodyFor(unit, context);
  if (unit.matchingIssueNumber !== null) {
    const existing = await publisher.get(unit.matchingIssueNumber);
    if (
      existing?.open === true &&
      !existing.pullRequest &&
      namesUnit(existing, unit.id)
    ) {
      await publisher.comment(existing.number, body);
      return { updated: existing.number };
    }
  }

  const issue: NewIssue = {
    assignee: context.assignee,
    body,
    labels: [
      labels.automation.name,
      unit.status === "modification-required"
        ? labels.modification.name
        : labels.failure.name,
    ],
    title: titleFor(unit),
  };
  return { created: await publisher.create(issue) };
}

export async function publishVerification(
  output: VerificationOutput,
  context: PublicationContext,
  publisher: IssuePublisher,
): Promise<PublicationResult> {
  const actionable = output.units.filter((unit) => unit.status !== "current");
  const result: PublicationResult = {
    created: [],
    requiresFailure: actionable.some(
      (unit) => unit.status === "verification-failed",
    ),
    updated: [],
  };
  if (actionable.length === 0) {
    return result;
  }

  await ensureLabels(publisher);
  for (const unit of actionable) {
    const published = await publishUnit(unit, context, publisher);
    if (published.created !== undefined) {
      result.created.push(published.created);
    }
    if (published.updated !== undefined) {
      result.updated.push(published.updated);
    }
  }
  return result;
}

export async function publishExecutionFailure(
  message: string,
  context: PublicationContext,
  publisher: IssuePublisher,
): Promise<PublicationResult> {
  await ensureLabels(publisher);
  const titlePrefix = `Content verification workflow failed: ${context.scope}: `;
  const title = `${titlePrefix}${message.replace(/\s+/gu, " ").trim()}`.slice(
    0,
    256,
  );
  const body = [
    `The \`${safeMarkdown(context.scope)}\` verifier could not produce a complete, validated result for revision [\`${context.revision.slice(0, 12)}\`](https://github.com/${context.repository}/commit/${context.revision}).`,
    `## Failure\n\n${safeMarkdown(message)}`,
    `[Open workflow run](${runUrl(context)})`,
  ].join("\n\n");
  const existing = await publisher.findOpenByExactTitle(title);
  if (existing !== undefined) {
    await publisher.comment(existing.number, body);
    return { created: [], requiresFailure: true, updated: [existing.number] };
  }
  const issueNumber = await publisher.create({
    assignee: context.assignee,
    body: `${body}\n`,
    labels: [labels.automation.name, labels.failure.name],
    title,
  });
  return { created: [issueNumber], requiresFailure: true, updated: [] };
}
