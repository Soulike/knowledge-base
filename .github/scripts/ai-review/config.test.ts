import assert from "node:assert/strict";
import test from "node:test";

import {
  isTrustedAuthorAssociation,
  readReviewConfig,
  readReviewEvent,
} from "./config.ts";

const validEnvironment: NodeJS.ProcessEnv = {
  AI_REVIEW_BASE_SHA: "a".repeat(40),
  AI_REVIEW_HEAD_SHA: "b".repeat(40),
  AI_REVIEW_PR_NUMBER: "42",
  AI_REVIEW_PR_URL: "https://github.com/Soulike/knowledge-base/pull/42",
  AI_REVIEW_REPOSITORY: "Soulike/knowledge-base",
  GITHUB_RUN_ATTEMPT: "1",
  GITHUB_RUN_ID: "1234",
};

test("reads the trusted gate identity without legacy runner configuration", () => {
  assert.deepEqual(readReviewConfig(validEnvironment), {
    baseSha: "a".repeat(40),
    expectedHeadSha: "b".repeat(40),
    prNumber: 42,
    prUrl: "https://github.com/Soulike/knowledge-base/pull/42",
    repository: "Soulike/knowledge-base",
    runAttempt: 1,
    runId: 1234,
  });
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
      AI_REVIEW_AGENT_RESULT: "success",
      AI_REVIEW_AUTHOR_ASSOCIATION: "MEMBER",
      AI_REVIEW_EVENT_ACTION: "synchronize",
      AI_REVIEW_PR_DRAFT: "false",
      AI_REVIEW_SAFE_OUTPUTS_RESULT: "success",
    }),
    {
      action: "synchronize",
      agentJobResult: "success",
      authorAssociation: "MEMBER",
      isDraft: false,
      safeOutputsJobResult: "success",
    },
  );
});

test("rejects an unsupported lifecycle action or job result", () => {
  const event = {
    AI_REVIEW_AGENT_RESULT: "success",
    AI_REVIEW_AUTHOR_ASSOCIATION: "MEMBER",
    AI_REVIEW_EVENT_ACTION: "edited",
    AI_REVIEW_PR_DRAFT: "false",
    AI_REVIEW_SAFE_OUTPUTS_RESULT: "success",
  };
  assert.throws(() => readReviewEvent(event), /must be one of/u);
  assert.throws(
    () =>
      readReviewEvent({
        ...event,
        AI_REVIEW_EVENT_ACTION: "opened",
        AI_REVIEW_SAFE_OUTPUTS_RESULT: "neutral",
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
