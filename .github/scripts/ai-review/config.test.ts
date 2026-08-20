import assert from "node:assert/strict";
import test from "node:test";

import { copilotEffortArguments, readReviewConfig } from "./config.ts";

const validEnvironment: NodeJS.ProcessEnv = {
  AI_REVIEW_BASE_SHA: "a".repeat(40),
  AI_REVIEW_HEAD_SHA: "b".repeat(40),
  AI_REVIEW_MODEL: "auto",
  AI_REVIEW_PR_NUMBER: "42",
  AI_REVIEW_PR_URL: "https://github.com/Soulike/knowledge-base/pull/42",
  AI_REVIEW_REASONING_EFFORT: "auto",
  AI_REVIEW_REPOSITORY: "Soulike/knowledge-base",
  AI_REVIEW_RUN_ATTEMPT: "1",
  AI_REVIEW_RUN_ID: "1234",
  AI_REVIEW_TOOLING_SHA: "c".repeat(40),
  GITHUB_WORKSPACE: "/workspace/knowledge-base",
};

test("defaults model and reasoning effort to auto", () => {
  const environment = { ...validEnvironment };
  delete environment.AI_REVIEW_MODEL;
  delete environment.AI_REVIEW_REASONING_EFFORT;

  const config = readReviewConfig(environment);

  assert.equal(config.model, "auto");
  assert.equal(config.reasoningEffort, "auto");
  assert.deepEqual(copilotEffortArguments(config.reasoningEffort), []);
});

test("passes an explicit supported reasoning effort", () => {
  const config = readReviewConfig({
    ...validEnvironment,
    AI_REVIEW_REASONING_EFFORT: "xhigh",
  });

  assert.deepEqual(copilotEffortArguments(config.reasoningEffort), [
    "--reasoning-effort",
    "xhigh",
  ]);
});

test("rejects an unsupported reasoning effort before invoking Copilot", () => {
  assert.throws(
    () =>
      readReviewConfig({
        ...validEnvironment,
        AI_REVIEW_REASONING_EFFORT: "extreme",
      }),
    /must be one of/u,
  );
});

test("rejects malformed event identity", () => {
  assert.throws(
    () =>
      readReviewConfig({
        ...validEnvironment,
        AI_REVIEW_HEAD_SHA: "$(git push)",
      }),
    /40-character Git SHA/u,
  );
  assert.throws(
    () =>
      readReviewConfig({
        ...validEnvironment,
        AI_REVIEW_PR_NUMBER: "42; echo unsafe",
      }),
    /positive integer/u,
  );
});

test("binds the pull-request URL to the configured repository and number", () => {
  assert.throws(
    () =>
      readReviewConfig({
        ...validEnvironment,
        AI_REVIEW_PR_URL: "https://github.com/other/repository/pull/42",
      }),
    /must identify AI_REVIEW_PR_NUMBER/u,
  );
  assert.throws(
    () =>
      readReviewConfig({
        ...validEnvironment,
        AI_REVIEW_PR_URL:
          "https://github.com/Soulike/knowledge-base/pull/42?unexpected=true",
      }),
    /must identify AI_REVIEW_PR_NUMBER/u,
  );
});
