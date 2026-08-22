import { createHash } from "node:crypto";

import type { GitHubIssue, IssuePublisher, NewIssue } from "./github.ts";
import type { VerificationOutput, VerificationUnitResult } from "./output.ts";
import type { VerificationScope } from "./targets.ts";

const AUTOMATION_AUTHOR = "github-actions[bot]";
const GITHUB_BODY_MAXIMUM_LENGTH = 65_536;
const BODY_TRUNCATION_SUFFIX =
  "\n\n---\n\nThis report was truncated because GitHub limits issue and comment bodies to 65,536 characters.\n";

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

type PublicationPlan =
  | {
      body: string;
      issue: NewIssue;
      kind: "create";
      units: VerificationUnitResult[];
    }
  | {
      body: string;
      issueNumber: number;
      kind: "comment";
      units: VerificationUnitResult[];
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

function subjectHash(subject: string): string {
  return createHash("sha256").update(subject).digest("hex");
}

function publicationMarker(
  subject: string,
  context: PublicationContext,
): string {
  return `<!-- content-verification:v1 run=${context.runId} scope=${context.scope} revision=${context.revision} subject=${subjectHash(subject)} -->`;
}

function boundedBody(body: string): string {
  if (body.length <= GITHUB_BODY_MAXIMUM_LENGTH) {
    return body;
  }
  const prefixLength =
    GITHUB_BODY_MAXIMUM_LENGTH - BODY_TRUNCATION_SUFFIX.length;
  return `${body.slice(0, prefixLength)}${BODY_TRUNCATION_SUFFIX}`;
}

function bodyFor(
  unit: VerificationUnitResult,
  context: PublicationContext,
): string {
  const sections = [
    publicationMarker(`unit:${unit.id}`, context),
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

function bodyForUnits(
  units: VerificationUnitResult[],
  context: PublicationContext,
): string {
  return units.map((unit) => bodyFor(unit, context)).join("\n---\n\n");
}

function namesUnit(issue: GitHubIssue, unitId: string): boolean {
  return issue.title.includes(unitId) || issue.body.includes(unitId);
}

function containsTrustedMarker(
  entries: Array<{ author: string | null; body: string }>,
  marker: string,
): boolean {
  return entries.some(
    (entry) =>
      entry.author === AUTOMATION_AUTHOR && entry.body.includes(marker),
  );
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

async function preparePublicationPlans(
  actionable: VerificationUnitResult[],
  context: PublicationContext,
  publisher: IssuePublisher,
): Promise<PublicationPlan[]> {
  const openIssues = await publisher.listOpenIssues();
  const unpublished = actionable.filter(
    (unit) =>
      !containsTrustedMarker(
        openIssues.filter((issue) => issue.open && !issue.pullRequest),
        publicationMarker(`unit:${unit.id}`, context),
      ),
  );
  const commentGroups = new Map<number, VerificationUnitResult[]>();
  const createUnits: VerificationUnitResult[] = [];
  const issueCache = new Map<number, GitHubIssue | undefined>();

  for (const unit of unpublished) {
    if (unit.matchingIssueNumber === null) {
      createUnits.push(unit);
      continue;
    }
    let existing = issueCache.get(unit.matchingIssueNumber);
    if (!issueCache.has(unit.matchingIssueNumber)) {
      existing = await publisher.get(unit.matchingIssueNumber);
      issueCache.set(unit.matchingIssueNumber, existing);
    }
    if (
      existing?.open === true &&
      !existing.pullRequest &&
      namesUnit(existing, unit.id)
    ) {
      const group = commentGroups.get(existing.number) ?? [];
      group.push(unit);
      commentGroups.set(existing.number, group);
    } else {
      createUnits.push(unit);
    }
  }

  const plans: PublicationPlan[] = [];
  for (const [issueNumber, units] of commentGroups) {
    const comments = await publisher.listIssueComments(issueNumber);
    const remaining = units.filter(
      (unit) =>
        !containsTrustedMarker(
          comments,
          publicationMarker(`unit:${unit.id}`, context),
        ),
    );
    if (remaining.length > 0) {
      plans.push({
        body: bodyForUnits(remaining, context),
        issueNumber,
        kind: "comment",
        units: remaining,
      });
    }
  }

  for (const unit of createUnits) {
    const body = bodyFor(unit, context);
    plans.push({
      body,
      issue: {
        assignee: context.assignee,
        body,
        labels: [
          labels.automation.name,
          unit.status === "modification-required"
            ? labels.modification.name
            : labels.failure.name,
        ],
        title: titleFor(unit),
      },
      kind: "create",
      units: [unit],
    });
  }
  return plans;
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

  const plans = await preparePublicationPlans(actionable, context, publisher);
  const oversized = plans.find(
    ({ body }) => body.length > GITHUB_BODY_MAXIMUM_LENGTH,
  );
  if (oversized !== undefined) {
    const unitIds = oversized.units
      .map((unit) => JSON.stringify(unit.id.slice(0, 200)))
      .join(", ");
    return await publishExecutionFailure(
      `The rendered publication body for ${oversized.units.length === 1 ? "unit" : "units"} ${unitIds} contains ${oversized.body.length} characters, exceeding GitHub's ${GITHUB_BODY_MAXIMUM_LENGTH}-character limit. No actionable results were published.`,
      context,
      publisher,
    );
  }
  if (plans.length === 0) {
    return result;
  }

  await ensureLabels(publisher);
  for (const plan of plans) {
    if (plan.kind === "comment") {
      await publisher.comment(plan.issueNumber, plan.body);
      result.updated.push(plan.issueNumber);
    } else {
      result.created.push(await publisher.create(plan.issue));
    }
  }
  return result;
}

export async function publishExecutionFailure(
  message: string,
  context: PublicationContext,
  publisher: IssuePublisher,
): Promise<PublicationResult> {
  const titlePrefix = `Content verification workflow failed: ${context.scope}: `;
  const title = `${titlePrefix}${message.replace(/\s+/gu, " ").trim()}`.slice(
    0,
    256,
  );
  const marker = publicationMarker(`execution-failure:${title}`, context);
  const body = boundedBody(
    `${[
      marker,
      `The \`${safeMarkdown(context.scope)}\` verifier could not produce a complete, validated result for revision [\`${context.revision.slice(0, 12)}\`](https://github.com/${context.repository}/commit/${context.revision}).`,
      `## Failure\n\n${safeMarkdown(message)}`,
      `[Open workflow run](${runUrl(context)})`,
    ].join("\n\n")}\n`,
  );
  const openIssues = await publisher.listOpenIssues();
  if (
    containsTrustedMarker(
      openIssues.filter((issue) => issue.open && !issue.pullRequest),
      marker,
    )
  ) {
    return { created: [], requiresFailure: true, updated: [] };
  }

  const existing = openIssues.find(
    (issue) => issue.open && !issue.pullRequest && issue.title === title,
  );
  if (existing !== undefined) {
    const comments = await publisher.listIssueComments(existing.number);
    if (containsTrustedMarker(comments, marker)) {
      return { created: [], requiresFailure: true, updated: [] };
    }
    await ensureLabels(publisher);
    await publisher.comment(existing.number, body);
    return { created: [], requiresFailure: true, updated: [existing.number] };
  }

  await ensureLabels(publisher);
  const issueNumber = await publisher.create({
    assignee: context.assignee,
    body,
    labels: [labels.automation.name, labels.failure.name],
    title,
  });
  return { created: [issueNumber], requiresFailure: true, updated: [] };
}
