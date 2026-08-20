import assert from "node:assert/strict";
import test from "node:test";

import type { Finding, ReviewOutput } from "./review-output.ts";
import {
  AI_REVIEW_AUTHOR,
  findingComment,
  findingFingerprint,
  hasResolutionRunMarker,
  hasReviewRunMarker,
  planPublication,
  resolutionRunMarker,
  reviewRunMarker,
  type ReviewThread,
} from "./review-state.ts";

function finding(severity: Finding["severity"] = "medium"): Finding {
  return {
    body: "The route points to a file that does not exist.",
    line: 12,
    path: "README.md",
    severity,
    side: "RIGHT",
    title: "Use the canonical route",
  };
}

function aiThread(id: string, item: Finding, isResolved = false): ReviewThread {
  return {
    comments: [
      {
        authorLogin: AI_REVIEW_AUTHOR,
        body: findingComment(item),
        databaseId: 101,
      },
    ],
    id,
    isResolved,
  };
}

function output(
  findings: Finding[],
  threadAssessments: ReviewOutput["threadAssessments"] = [],
): ReviewOutput {
  return {
    findings,
    headSha: "a".repeat(40),
    summary: "Review summary.",
    threadAssessments,
  };
}

test("deduplicates an unresolved AI-owned finding", () => {
  const item = finding("medium");
  const plan = planPublication(output([item]), [aiThread("PRRT_one", item)]);

  assert.deepEqual(plan.newFindings, []);
  assert.equal(
    plan.openCarriedFindings[0]?.fingerprint,
    findingFingerprint(item),
  );
  assert.equal(plan.verdict, "needs-change");
});

test("low and nit findings remain comments without selecting need change", () => {
  const plan = planPublication(output([finding("low"), finding("nit")]), []);

  assert.equal(plan.newFindings.length, 2);
  assert.equal(plan.verdict, "approved");
});

test("a fixed AI-owned thread no longer affects the verdict", () => {
  const item = finding("high");
  const plan = planPublication(
    output(
      [],
      [
        {
          rationale: "The broken route was replaced.",
          status: "fixed",
          threadId: "PRRT_fixed",
        },
      ],
    ),
    [aiThread("PRRT_fixed", item)],
  );

  assert.deepEqual(plan.fixedThreads, [
    {
      id: "PRRT_fixed",
      rationale: "The broken route was replaced.",
      replyToCommentId: 101,
    },
  ]);
  assert.equal(plan.verdict, "approved");
});

test("refuses to resolve a human-owned thread", () => {
  const thread: ReviewThread = {
    comments: [
      {
        authorLogin: "maintainer",
        body: findingComment(finding()),
        databaseId: 102,
      },
    ],
    id: "PRRT_human",
    isResolved: false,
  };

  assert.throws(
    () =>
      planPublication(
        output(
          [],
          [
            {
              rationale: "Looks fixed.",
              status: "fixed",
              threadId: "PRRT_human",
            },
          ],
        ),
        [thread],
      ),
    /not an AI-owned finding/u,
  );
});

test("allows a resolved finding to be reported again when reintroduced", () => {
  const item = finding("medium");
  const plan = planPublication(output([item]), [
    aiThread("PRRT_resolved", item, true),
  ]);

  assert.deepEqual(plan.newFindings, [item]);
  assert.equal(plan.verdict, "needs-change");
});

test("does not revive a resolved finding when retrying an already-published run", () => {
  const item = finding("high");
  const plan = planPublication(
    output([item]),
    [aiThread("PRRT_published", item, true)],
    { includeNewFindings: false },
  );

  assert.deepEqual(plan.newFindings, []);
  assert.equal(plan.verdict, "approved");
});

test("identifies only the exact workflow run marker", () => {
  const head = "a".repeat(40);
  const body = `${reviewRunMarker(1234, head)}\nReview body`;

  assert.equal(hasReviewRunMarker(body, 1234, head), true);
  assert.equal(hasReviewRunMarker(body, 1235, head), false);
  assert.equal(hasReviewRunMarker(null, 1234, head), false);
});

test("identifies a resolution reply from the current workflow run", () => {
  const thread = aiThread("PRRT_resolution", finding());
  thread.comments.push({
    authorLogin: AI_REVIEW_AUTHOR,
    body: `${resolutionRunMarker(1234, thread.id)}\nFixed in the current head.`,
    databaseId: 103,
  });

  assert.equal(hasResolutionRunMarker(thread, 1234), true);
  assert.equal(hasResolutionRunMarker(thread, 1235), false);
});
