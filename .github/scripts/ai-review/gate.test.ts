import assert from "node:assert/strict";
import test from "node:test";

import {
  enforceReviewGate,
  verifyPublishedReview,
  type ReviewGateContext,
} from "./review-gate.ts";

const baseSha = "a".repeat(40);
const headSha = "b".repeat(40);
const identity = {
  baseSha,
  expectedHeadSha: headSha,
  prNumber: 42,
  repository: "Soulike/knowledge-base",
  runAttempt: 2,
  runId: 1234,
};

function pullRequest(overrides: Record<string, unknown> = {}) {
  return {
    baseSha,
    headSha,
    htmlUrl: "https://github.com/Soulike/knowledge-base/pull/42",
    number: 42,
    state: "open",
    ...overrides,
  };
}

function review(
  verdict: "approved" | "needs-change",
  overrides: Record<string, unknown> = {},
) {
  return {
    authorLogin: "github-actions[bot]",
    body: `- **Model:** \`grok-4.6\`
- **Verdict:** \`${verdict}\`
- **Findings:** high: ${verdict === "needs-change" ? 1 : 0}, medium: 0, low: 0, nit: 0
- **Reviewed head:** \`${headSha}\`

## Findings not posted inline

None.

<!-- gh-aw-agentic-workflow: AI review, engine: copilot, version: latest, model: grok-4.6, id: 1234, workflow_id: ai-review, run: https://github.com/Soulike/knowledge-base/actions/runs/1234 -->`,
    commitSha: headSha,
    id: 99,
    state: "COMMENTED",
    submittedAt: "2026-09-02T10:00:30Z",
    ...overrides,
  };
}

function comments(verdict: "approved" | "needs-change", reviewId = 99) {
  return verdict === "needs-change"
    ? [
        {
          body: "**[high] Unsafe change**\n\nCorrect the behavior.",
          id: 501,
          reviewId,
        },
      ]
    : [];
}

function jobs(overrides: Record<string, unknown> = {}) {
  return [
    {
      completedAt: "2026-09-02T10:01:00Z",
      conclusion: "success",
      id: 77,
      name: "safe_outputs",
      startedAt: "2026-09-02T10:00:00Z",
      status: "completed",
      ...overrides,
    },
  ];
}

test("accepts an approved COMMENT review for this run attempt and head", () => {
  assert.equal(
    verifyPublishedReview(
      identity,
      pullRequest(),
      [review("approved")],
      comments("approved"),
      jobs(),
    ),
    "approved",
  );
});

test("returns needs-change from authenticated visible findings", () => {
  assert.equal(
    verifyPublishedReview(
      identity,
      pullRequest(),
      [review("needs-change")],
      comments("needs-change"),
      jobs(),
    ),
    "needs-change",
  );
});

test("rejects inline findings omitted from the visible counts", () => {
  assert.throws(
    () =>
      verifyPublishedReview(
        identity,
        pullRequest(),
        [review("approved")],
        comments("needs-change"),
        jobs(),
      ),
    /finding counts/u,
  );
});

test("ignores reviews from another run while selecting the current review", () => {
  assert.equal(
    verifyPublishedReview(
      identity,
      pullRequest(),
      [
        review("needs-change", {
          body: review("needs-change").body.replace("id: 1234", "id: 1000"),
          id: 98,
          submittedAt: "2026-09-02T09:00:00Z",
        }),
        review("approved"),
      ],
      comments("approved"),
      jobs(),
    ),
    "approved",
  );
});

test("ignores a malformed review from an earlier attempt before validating current counts", () => {
  assert.equal(
    verifyPublishedReview(
      identity,
      pullRequest(),
      [
        review("approved", {
          id: 98,
          submittedAt: "2026-09-02T09:00:00Z",
        }),
        review("approved"),
      ],
      [
        {
          body: "**[high] Stale malformed count**",
          id: 500,
          reviewId: 98,
        },
      ],
      jobs(),
    ),
    "approved",
  );
});

test("fails closed when the current run publishes more than one review", () => {
  assert.throws(
    () =>
      verifyPublishedReview(
        identity,
        pullRequest(),
        [review("approved", { id: 98 }), review("approved", { id: 99 })],
        comments("approved"),
        jobs(),
      ),
    /exactly one COMMENT review/u,
  );
});

test("rejects a marker on the wrong commit or review state", () => {
  for (const candidate of [
    review("approved", { commitSha: "c".repeat(40) }),
    review("approved", { state: "APPROVED" }),
  ]) {
    assert.throws(
      () =>
        verifyPublishedReview(
          identity,
          pullRequest(),
          [candidate],
          comments("approved"),
          jobs(),
        ),
      /exactly one COMMENT review/u,
    );
  }
});

test("rejects a review after the pull request changes", () => {
  assert.throws(
    () =>
      verifyPublishedReview(
        identity,
        pullRequest({ headSha: "c".repeat(40) }),
        [review("approved")],
        comments("approved"),
        jobs(),
      ),
    /Pull request changed during review/u,
  );
});

test("rejects a review that predates the current run attempt", () => {
  assert.throws(
    () =>
      verifyPublishedReview(
        identity,
        pullRequest(),
        [review("approved", { submittedAt: "2026-09-02T09:59:59Z" })],
        comments("approved"),
        jobs(),
      ),
    /current run attempt/u,
  );
});

class FakeGitHubClient {
  readonly pulls: ReturnType<typeof pullRequest>[];
  readonly reviewComments: ReturnType<typeof comments>;
  readonly reviews: ReturnType<typeof review>[];
  jobReads = 0;
  pullRequestReads = 0;
  reviewCommentReads = 0;
  reviewReads = 0;

  constructor(
    pulls: ReturnType<typeof pullRequest>[],
    reviews: ReturnType<typeof review>[],
    reviewComments: ReturnType<typeof comments> = comments("approved"),
  ) {
    this.pulls = pulls;
    this.reviews = reviews;
    this.reviewComments = reviewComments;
  }

  async getPullRequest(): Promise<ReturnType<typeof pullRequest>> {
    const value = this.pulls[this.pullRequestReads];
    this.pullRequestReads += 1;
    if (!value) {
      throw new Error("Unexpected pull-request read.");
    }
    return value;
  }

  async listReviewComments(): Promise<ReturnType<typeof comments>> {
    this.reviewCommentReads += 1;
    return this.reviewComments;
  }

  async listReviews(): Promise<ReturnType<typeof review>[]> {
    this.reviewReads += 1;
    return this.reviews;
  }

  async listRunAttemptJobs(): Promise<ReturnType<typeof jobs>> {
    this.jobReads += 1;
    return jobs();
  }
}

function gateContext(
  overrides: Partial<ReviewGateContext> = {},
): ReviewGateContext {
  return {
    ...identity,
    action: "synchronize" as const,
    agentJobResult: "success" as const,
    authorAssociation: "MEMBER",
    isDraft: false,
    safeOutputsJobResult: "success" as const,
    ...overrides,
  };
}

test("approves an authenticated review without mutating the pull request", async () => {
  const client = new FakeGitHubClient([pullRequest()], [review("approved")]);

  assert.equal(await enforceReviewGate(client, gateContext()), "approved");
  assert.equal(client.pullRequestReads, 1);
  assert.equal(client.reviewReads, 1);
  assert.equal(client.reviewCommentReads, 1);
  assert.equal(client.jobReads, 1);
});

test("fails the gate for an authenticated needs-change review", async () => {
  const client = new FakeGitHubClient(
    [pullRequest()],
    [review("needs-change")],
    comments("needs-change"),
  );

  await assert.rejects(
    enforceReviewGate(client, gateContext()),
    /requires changes/u,
  );
});

test("fails without reading reviews when the Agent or safe-output job fails", async (t) => {
  for (const context of [
    { agentJobResult: "failure" as const },
    { safeOutputsJobResult: "failure" as const },
  ]) {
    await t.test(JSON.stringify(context), async () => {
      const client = new FakeGitHubClient([], []);
      await assert.rejects(enforceReviewGate(client, gateContext(context)));
      assert.equal(client.pullRequestReads, 0);
      assert.equal(client.reviewReads, 0);
    });
  }
});

test("fails without reading reviews for a draft", async (t) => {
  for (const context of [
    { action: "opened" as const, isDraft: true },
    { action: "converted_to_draft" as const, isDraft: true },
  ]) {
    await t.test(context.action, async () => {
      const client = new FakeGitHubClient([], []);
      await assert.rejects(
        enforceReviewGate(client, gateContext(context)),
        /draft pull request/u,
      );
      assert.equal(client.pullRequestReads, 0);
      assert.equal(client.reviewReads, 0);
    });
  }
});
