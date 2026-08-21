import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { copilotEffortArguments, readVerificationConfig } from "./config.ts";

const baseEnvironment: NodeJS.ProcessEnv = {
  CONTENT_VERIFICATION_OUTPUT_DIRECTORY: "/tmp/content-verification",
  CONTENT_VERIFICATION_REPOSITORY: "Soulike/knowledge-base",
  CONTENT_VERIFICATION_REVISION: "a".repeat(40),
  CONTENT_VERIFICATION_RUN_ATTEMPT: "1",
  CONTENT_VERIFICATION_RUN_ID: "42",
  CONTENT_VERIFICATION_SCOPE: "time-sensitive-knowledge",
  GITHUB_WORKSPACE: "/workspace",
};

describe("readVerificationConfig", () => {
  it("uses auto defaults", () => {
    const config = readVerificationConfig(baseEnvironment);

    assert.equal(config.model, "auto");
    assert.equal(config.reasoningEffort, "auto");
    assert.equal(config.scope, "time-sensitive-knowledge");
  });

  it("rejects an unsupported scope", () => {
    assert.throws(
      () =>
        readVerificationConfig({
          ...baseEnvironment,
          CONTENT_VERIFICATION_SCOPE: "all-content",
        }),
      /scope must be one of/u,
    );
  });

  it("rejects an invalid revision", () => {
    assert.throws(
      () =>
        readVerificationConfig({
          ...baseEnvironment,
          CONTENT_VERIFICATION_REVISION: "main",
        }),
      /40-character Git SHA/u,
    );
  });
});

describe("copilotEffortArguments", () => {
  it("omits auto and passes an explicit effort", () => {
    assert.deepEqual(copilotEffortArguments("auto"), []);
    assert.deepEqual(copilotEffortArguments("high"), [
      "--reasoning-effort",
      "high",
    ]);
  });
});
