import assert from "node:assert/strict";
import test from "node:test";

import { parseReviewOutput } from "./review-output.ts";

const headSha = "a".repeat(40);

function validOutput(): Record<string, unknown> {
  return {
    findings: [
      {
        body: "The generated route is broken; use the canonical target.",
        line: 12,
        path: "README.md",
        severity: "medium",
        side: "RIGHT",
        title: "Repair the broken route",
      },
    ],
    headSha,
    summary: "Found one actionable issue.",
    threadAssessments: [
      {
        rationale: "The current head removes the failing command.",
        status: "fixed",
        threadId: "PRRT_abc123",
      },
    ],
  };
}

test("accepts the exact model-output contract", () => {
  const parsed = parseReviewOutput(JSON.stringify(validOutput()), headSha);

  assert.equal(parsed.findings[0]?.severity, "medium");
  assert.equal(parsed.threadAssessments[0]?.status, "fixed");
});

test("rejects Markdown-wrapped JSON rather than guessing at output", () => {
  assert.throws(
    () =>
      parseReviewOutput(
        `\`\`\`json\n${JSON.stringify(validOutput())}\n\`\`\``,
        headSha,
      ),
    /not valid JSON/u,
  );
});

test("rejects output for a stale head", () => {
  assert.throws(
    () => parseReviewOutput(JSON.stringify(validOutput()), "b".repeat(40)),
    /expected pull-request head/u,
  );
});

test("rejects non-normalized or absolute finding paths", () => {
  for (const path of [
    "../README.md",
    "/README.md",
    "docs//guide.md",
    "docs\\guide.md",
  ]) {
    const output = validOutput();
    (output.findings as Array<Record<string, unknown>>)[0]!.path = path;
    assert.throws(
      () => parseReviewOutput(JSON.stringify(output), headSha),
      /normalized relative repository path/u,
    );
  }
});

test("rejects duplicate thread assessments", () => {
  const output = validOutput();
  (output.threadAssessments as unknown[]).push(
    (output.threadAssessments as unknown[])[0],
  );

  assert.throws(
    () => parseReviewOutput(JSON.stringify(output), headSha),
    /repeats PRRT_abc123/u,
  );
});
