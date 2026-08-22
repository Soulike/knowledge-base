import assert from "node:assert/strict";
import test from "node:test";

import { parseReviewRunMarker, reviewRunMarker } from "./review-state.ts";

const headSha = "a".repeat(40);

function reviewBody(
  visibleVerdict: "approved" | "needs-change",
  markerVerdict: "approved" | "needs-change" = visibleVerdict,
): string {
  return `## AI review

- **Model:** \`gpt-5.6-sol\`
- **Verdict:** \`${visibleVerdict}\`

${reviewRunMarker(markerVerdict, headSha, 1234, 2)}`;
}

test("parses one consistent visible verdict and run marker", () => {
  assert.deepEqual(parseReviewRunMarker(reviewBody("approved")), {
    headSha,
    runAttempt: 2,
    runId: 1234,
    verdict: "approved",
  });
});

test("rejects a hidden verdict that conflicts with the visible verdict", () => {
  assert.equal(
    parseReviewRunMarker(reviewBody("approved", "needs-change")),
    null,
  );
});

test("rejects missing or duplicate verdict fields", () => {
  assert.equal(
    parseReviewRunMarker(reviewRunMarker("approved", headSha, 1234, 2)),
    null,
  );
  assert.equal(
    parseReviewRunMarker(
      `${reviewBody("approved")}\n- **Verdict:** \`approved\``,
    ),
    null,
  );
});

test("rejects missing, empty, or duplicate model fields", () => {
  assert.equal(
    parseReviewRunMarker(
      reviewBody("approved").replace("- **Model:** `gpt-5.6-sol`\n", ""),
    ),
    null,
  );
  assert.equal(
    parseReviewRunMarker(reviewBody("approved").replace("gpt-5.6-sol", "")),
    null,
  );
  assert.equal(
    parseReviewRunMarker(
      `${reviewBody("approved")}\n- **Model:** \`gpt-5.6-luna\``,
    ),
    null,
  );
});

test("rejects duplicate run markers", () => {
  const marker = reviewRunMarker("approved", headSha, 1234, 2);

  assert.equal(
    parseReviewRunMarker(`${reviewBody("approved")}\n${marker}`),
    null,
  );
});
