import assert from "node:assert/strict";
import test from "node:test";

import {
  copilotEffortArguments,
  isTrustedAuthorAssociation,
  readReviewConfig,
  readReviewEvent,
} from "./config.ts";

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

test("reads a supported pull-request lifecycle event", () => {
  assert.deepEqual(
    readReviewEvent({
      AI_REVIEW_AUTHOR_ASSOCIATION: "MEMBER",
      AI_REVIEW_EVENT_ACTION: "synchronize",
      AI_REVIEW_JOB_RESULT: "success",
      AI_REVIEW_PR_DRAFT: "false",
    }),
    {
      action: "synchronize",
      authorAssociation: "MEMBER",
      isDraft: false,
      reviewJobResult: "success",
    },
  );
});

test("rejects an unsupported lifecycle action or job result", () => {
  const event = {
    AI_REVIEW_AUTHOR_ASSOCIATION: "MEMBER",
    AI_REVIEW_EVENT_ACTION: "edited",
    AI_REVIEW_JOB_RESULT: "success",
    AI_REVIEW_PR_DRAFT: "false",
  };
  assert.throws(() => readReviewEvent(event), /must be one of/u);
  assert.throws(
    () =>
      readReviewEvent({
        ...event,
        AI_REVIEW_EVENT_ACTION: "opened",
        AI_REVIEW_JOB_RESULT: "neutral",
      }),
    /cancelled, failure, skipped, or success/u,
  );
});

test("allows only owner, member, and collaborator authors", () => {
  assert.equal(isTrustedAuthorAssociation("OWNER"), true);
  assert.equal(isTrustedAuthorAssociation("MEMBER"), true);
  assert.equal(isTrustedAuthorAssociation("COLLABORATOR"), true);
  assert.equal(isTrustedAuthorAssociation("CONTRIBUTOR"), false);
});
