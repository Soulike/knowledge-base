import { resolve } from "node:path";

import { parseVerificationScope, type VerificationScope } from "./targets.ts";

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

export type VerificationConfig = {
  model: string;
  outputDirectory: string;
  reasoningEffort: ReasoningEffort;
  repository: string;
  revision: string;
  runAttempt: number;
  runId: number;
  scope: VerificationScope;
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

export function readVerificationConfig(
  environment: NodeJS.ProcessEnv = process.env,
): VerificationConfig {
  const model = environment.CONTENT_VERIFICATION_MODEL?.trim() || "auto";
  if (!MODEL_PATTERN.test(model)) {
    throw new Error(
      "CONTENT_VERIFICATION_MODEL may contain only letters, numbers, '.', '_', ':', '/', and '-'.",
    );
  }

  const reasoningEffort =
    environment.CONTENT_VERIFICATION_REASONING_EFFORT?.trim() || "auto";
  if (!reasoningEfforts.includes(reasoningEffort as ReasoningEffort)) {
    throw new Error(
      `CONTENT_VERIFICATION_REASONING_EFFORT must be one of: ${reasoningEfforts.join(", ")}.`,
    );
  }

  const repository = required(environment, "CONTENT_VERIFICATION_REPOSITORY");
  if (!REPOSITORY_PATTERN.test(repository)) {
    throw new Error(
      "CONTENT_VERIFICATION_REPOSITORY must use the owner/name form.",
    );
  }

  return {
    model,
    outputDirectory: resolve(
      required(environment, "CONTENT_VERIFICATION_OUTPUT_DIRECTORY"),
    ),
    reasoningEffort: reasoningEffort as ReasoningEffort,
    repository,
    revision: sha(
      required(environment, "CONTENT_VERIFICATION_REVISION"),
      "CONTENT_VERIFICATION_REVISION",
    ),
    runAttempt: positiveInteger(
      required(environment, "CONTENT_VERIFICATION_RUN_ATTEMPT"),
      "CONTENT_VERIFICATION_RUN_ATTEMPT",
    ),
    runId: positiveInteger(
      required(environment, "CONTENT_VERIFICATION_RUN_ID"),
      "CONTENT_VERIFICATION_RUN_ID",
    ),
    scope: parseVerificationScope(
      required(environment, "CONTENT_VERIFICATION_SCOPE"),
    ),
    workspace: resolve(required(environment, "GITHUB_WORKSPACE")),
  };
}

export function copilotEffortArguments(effort: ReasoningEffort): string[] {
  return effort === "auto" ? [] : ["--reasoning-effort", effort];
}
