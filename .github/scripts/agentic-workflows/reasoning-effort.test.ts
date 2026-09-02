import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { requireReasoningEffort } from "./reasoning-effort.ts";

describe("requireReasoningEffort", () => {
  it("accepts only concrete Copilot reasoning efforts", () => {
    for (const effort of [
      "none",
      "minimal",
      "low",
      "medium",
      "high",
      "xhigh",
      "max",
    ]) {
      assert.equal(requireReasoningEffort(effort), effort);
    }
  });

  it("rejects missing, auto, and unknown values before inference", () => {
    for (const effort of [undefined, "", "  ", "auto", "extreme"]) {
      assert.throws(
        () => requireReasoningEffort(effort),
        /must be configured to one of/u,
      );
    }
  });
});
