import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { parseExecutionFailureReport } from "./failure-report.ts";

describe("parseExecutionFailureReport", () => {
  it("keeps the stable failure reason separate from runtime diagnostics", () => {
    assert.deepEqual(
      parseExecutionFailureReport(
        JSON.stringify({
          diagnostics: "Copilot CLI: 1.0.81",
          message: "Copilot failed.",
          revision: "a".repeat(40),
          scope: "time-sensitive-knowledge",
        }),
      ),
      {
        diagnostics: "Copilot CLI: 1.0.81",
        message: "Copilot failed.",
      },
    );
  });

  it("uses a stable fallback for an unreadable artifact", () => {
    assert.deepEqual(parseExecutionFailureReport("not-json"), {
      message: "The verifier failed without a readable failure report.",
    });
  });
});
