const SHA_PATTERN = /^[0-9a-f]{40}$/u;
const REPOSITORY_PATTERN = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u;
const MODEL_PATTERN = /^[A-Za-z0-9._:/-]+$/u;

export const reasoningEfforts = [
  "auto",
  "none",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
] as const;

export type ReasoningEffort = (typeof reasoningEfforts)[number];

export type ReviewConfig = {
  baseSha: string;
  expectedHeadSha: string;
  model: string;
  prNumber: number;
  prUrl: string;
  reasoningEffort: ReasoningEffort;
  repository: string;
  runAttempt: number;
  runId: number;
  toolingSha: string;
  workspace: string;
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

export function readReviewConfig(
  environment: NodeJS.ProcessEnv = process.env,
): ReviewConfig {
  const model = environment.AI_REVIEW_MODEL?.trim() || "auto";
  if (!MODEL_PATTERN.test(model)) {
    throw new Error(
      "AI_REVIEW_MODEL may contain only letters, numbers, '.', '_', ':', '/', and '-'.",
    );
  }

  const reasoningEffort =
    environment.AI_REVIEW_REASONING_EFFORT?.trim() || "auto";
  if (!reasoningEfforts.includes(reasoningEffort as ReasoningEffort)) {
    throw new Error(
      `AI_REVIEW_REASONING_EFFORT must be one of: ${reasoningEfforts.join(", ")}.`,
    );
  }

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
    model,
    prNumber,
    prUrl,
    reasoningEffort: reasoningEffort as ReasoningEffort,
    repository,
    runAttempt: positiveInteger(
      required(environment, "AI_REVIEW_RUN_ATTEMPT"),
      "AI_REVIEW_RUN_ATTEMPT",
    ),
    runId: positiveInteger(
      required(environment, "AI_REVIEW_RUN_ID"),
      "AI_REVIEW_RUN_ID",
    ),
    toolingSha: sha(
      required(environment, "AI_REVIEW_TOOLING_SHA"),
      "AI_REVIEW_TOOLING_SHA",
    ),
    workspace: required(environment, "GITHUB_WORKSPACE"),
  };
}

export function copilotEffortArguments(effort: ReasoningEffort): string[] {
  return effort === "auto" ? [] : ["--reasoning-effort", effort];
}
