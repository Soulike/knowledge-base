const SHA_PATTERN = /^[0-9a-f]{40}$/u;
const REPOSITORY_PATTERN = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u;

export type ReviewConfig = {
  baseSha: string;
  expectedHeadSha: string;
  prNumber: number;
  prUrl: string;
  repository: string;
  runAttempt: number;
  runId: number;
};

export const reviewEventActions = [
  "closed",
  "converted_to_draft",
  "opened",
  "ready_for_review",
  "reopened",
  "synchronize",
] as const;

export const trustedAuthorAssociations = [
  "OWNER",
  "MEMBER",
  "COLLABORATOR",
] as const;

export type ReviewJobResult = "cancelled" | "failure" | "skipped" | "success";

export type ReviewEventContext = {
  action: (typeof reviewEventActions)[number];
  agentJobResult: ReviewJobResult;
  authorAssociation: string;
  isDraft: boolean;
  safeOutputsJobResult: ReviewJobResult;
};

function required(environment: NodeJS.ProcessEnv, name: string): string {
  const value = environment[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

function positiveInteger(value: string, name: string): number {
  if (!/^[1-9][0-9]*$/u.test(value)) {
    throw new Error(`${name} must be a positive integer.`);
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) {
    throw new Error(`${name} exceeds the supported integer range.`);
  }
  return parsed;
}

function sha(value: string, name: string): string {
  if (!SHA_PATTERN.test(value)) {
    throw new Error(`${name} must be a lowercase 40-character Git SHA.`);
  }
  return value;
}

function jobResult(
  environment: NodeJS.ProcessEnv,
  name: string,
): ReviewJobResult {
  const value = required(environment, name);
  if (
    !(["cancelled", "failure", "skipped", "success"] as const).includes(
      value as ReviewJobResult,
    )
  ) {
    throw new Error(`${name} must be cancelled, failure, skipped, or success.`);
  }
  return value as ReviewJobResult;
}

export function readReviewConfig(
  environment: NodeJS.ProcessEnv = process.env,
): ReviewConfig {
  const repository = required(environment, "AI_REVIEW_REPOSITORY");
  if (!REPOSITORY_PATTERN.test(repository)) {
    throw new Error("AI_REVIEW_REPOSITORY must use the owner/name form.");
  }

  const prNumber = positiveInteger(
    required(environment, "AI_REVIEW_PR_NUMBER"),
    "AI_REVIEW_PR_NUMBER",
  );

  const prUrl = required(environment, "AI_REVIEW_PR_URL");
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(prUrl);
  } catch {
    throw new Error("AI_REVIEW_PR_URL must be an absolute URL.");
  }
  if (parsedUrl.protocol !== "https:" || parsedUrl.hostname !== "github.com") {
    throw new Error("AI_REVIEW_PR_URL must be an HTTPS github.com URL.");
  }
  const expectedPath = `/${repository}/pull/${prNumber}`.toLowerCase();
  if (
    parsedUrl.pathname.replace(/\/$/u, "").toLowerCase() !== expectedPath ||
    parsedUrl.username ||
    parsedUrl.password ||
    parsedUrl.port ||
    parsedUrl.search ||
    parsedUrl.hash
  ) {
    throw new Error(
      "AI_REVIEW_PR_URL must identify AI_REVIEW_PR_NUMBER in AI_REVIEW_REPOSITORY.",
    );
  }

  return {
    baseSha: sha(
      required(environment, "AI_REVIEW_BASE_SHA"),
      "AI_REVIEW_BASE_SHA",
    ),
    expectedHeadSha: sha(
      required(environment, "AI_REVIEW_HEAD_SHA"),
      "AI_REVIEW_HEAD_SHA",
    ),
    prNumber,
    prUrl,
    repository,
    runAttempt: positiveInteger(
      required(environment, "GITHUB_RUN_ATTEMPT"),
      "GITHUB_RUN_ATTEMPT",
    ),
    runId: positiveInteger(
      required(environment, "GITHUB_RUN_ID"),
      "GITHUB_RUN_ID",
    ),
  };
}

export function readReviewEvent(
  environment: NodeJS.ProcessEnv = process.env,
): ReviewEventContext {
  const action = required(environment, "AI_REVIEW_EVENT_ACTION");
  if (!reviewEventActions.includes(action as ReviewEventContext["action"])) {
    throw new Error(
      `AI_REVIEW_EVENT_ACTION must be one of: ${reviewEventActions.join(", ")}.`,
    );
  }
  const draft = required(environment, "AI_REVIEW_PR_DRAFT");
  if (draft !== "true" && draft !== "false") {
    throw new Error("AI_REVIEW_PR_DRAFT must be true or false.");
  }
  return {
    action: action as ReviewEventContext["action"],
    agentJobResult: jobResult(environment, "AI_REVIEW_AGENT_RESULT"),
    authorAssociation: required(environment, "AI_REVIEW_AUTHOR_ASSOCIATION"),
    isDraft: draft === "true",
    safeOutputsJobResult: jobResult(
      environment,
      "AI_REVIEW_SAFE_OUTPUTS_RESULT",
    ),
  };
}

export function isTrustedAuthorAssociation(value: string): boolean {
  return trustedAuthorAssociations.includes(
    value as (typeof trustedAuthorAssociations)[number],
  );
}
