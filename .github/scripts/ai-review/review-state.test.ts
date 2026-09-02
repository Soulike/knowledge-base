import assert from "node:assert/strict";
import test from "node:test";

import { parseReviewBody } from "./review-state.ts";

const headSha = "a".repeat(40);

function reviewBody(visibleVerdict: "approved" | "needs-change"): string {
  const high = visibleVerdict === "needs-change" ? 1 : 0;
  return `## AI review

- **Model:** \`grok-4.6\`
- **Verdict:** \`${visibleVerdict}\`
- **Findings:** high: ${high}, medium: 0, low: 1, nit: 0
- **Reviewed head:** \`${headSha}\`

## Findings not posted inline

- **[low] docs/example.md — Clarify the contract**

<!-- gh-aw-agentic-workflow: AI review, engine: copilot, version: latest, model: grok-4.6, id: 1234, workflow_id: ai-review, run: https://github.com/Soulike/knowledge-base/actions/runs/1234 -->`;
}

test("parses one consistent visible verdict and gh-aw attribution", () => {
  assert.deepEqual(parseReviewBody(reviewBody("approved")), {
    attribution: {
      runId: 1234,
      runUrl: "https://github.com/Soulike/knowledge-base/actions/runs/1234",
      workflowId: "ai-review",
      workflowName: "AI review",
    },
    bodyOnlyCounts: { high: 0, low: 1, medium: 0, nit: 0 },
    counts: { high: 0, low: 1, medium: 0, nit: 0 },
    model: "grok-4.6",
    reviewedHeadSha: headSha,
    verdict: "approved",
  });
});

test("rejects a verdict inconsistent with the visible severity counts", () => {
  assert.equal(
    parseReviewBody(reviewBody("approved").replace("high: 0", "high: 1")),
    null,
  );
  assert.equal(
    parseReviewBody(reviewBody("needs-change").replace("high: 1", "high: 0")),
    null,
  );
});

test("rejects missing or duplicate verdict fields", () => {
  assert.equal(
    parseReviewBody(
      reviewBody("approved").replace("- **Verdict:** `approved`\n", ""),
    ),
    null,
  );
  assert.equal(
    parseReviewBody(`${reviewBody("approved")}\n- **Verdict:** \`approved\``),
    null,
  );
});

test("rejects missing, empty, or duplicate model fields", () => {
  assert.equal(
    parseReviewBody(
      reviewBody("approved").replace("- **Model:** `grok-4.6`\n", ""),
    ),
    null,
  );
  assert.equal(
    parseReviewBody(reviewBody("approved").replace("grok-4.6", "")),
    null,
  );
  assert.equal(
    parseReviewBody(`${reviewBody("approved")}\n- **Model:** \`gpt-5.6-luna\``),
    null,
  );
});

test("rejects duplicate or incomplete framework attribution", () => {
  const marker = reviewBody("approved").match(/<!--[^>]*-->/u)?.[0] ?? "";
  assert.equal(parseReviewBody(`${reviewBody("approved")}\n${marker}`), null);
  assert.equal(
    parseReviewBody(
      reviewBody("approved").replace(", workflow_id: ai-review", ""),
    ),
    null,
  );
});

test("rejects a body-only finding omitted from visible counts", () => {
  assert.equal(
    parseReviewBody(reviewBody("approved").replace("low: 1", "low: 0")),
    null,
  );
});
