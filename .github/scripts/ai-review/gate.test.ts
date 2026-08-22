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
    body: `- **Model:** \`gpt-5.6-sol\`
- **Verdict:** \`${verdict}\`

<!-- knowledge-base-ai-review verdict=${verdict} head=${headSha} run-id=1234 run-attempt=2 -->`,
    commitSha: headSha,
    id: 99,
    state: "COMMENTED",
    ...overrides,
  };
}

test("accepts an approved COMMENT review for this run and head", () => {
  const verdict = verifyPublishedReview(identity, pullRequest(), [
    review("approved"),
  ]);

  assert.equal(verdict, "approved");
});

test("returns needs-change from an authenticated review marker", () => {
  const verdict = verifyPublishedReview(identity, pullRequest(), [
    review("needs-change"),
  ]);

  assert.equal(verdict, "needs-change");
});

test("ignores reviews from another run while selecting the current review", () => {
  const verdict = verifyPublishedReview(identity, pullRequest(), [
    review("needs-change", {
      body: `<!-- knowledge-base-ai-review verdict=needs-change head=${headSha} run-id=1000 run-attempt=1 -->`,
      id: 98,
    }),
    review("approved"),
  ]);

  assert.equal(verdict, "approved");
});

test("fails closed when the current run publishes more than one review", () => {
  assert.throws(
    () =>
      verifyPublishedReview(identity, pullRequest(), [
        review("approved", { id: 98 }),
        review("approved", { id: 99 }),
      ]),
    /exactly one COMMENT review/u,
  );
});

test("rejects a marker on the wrong commit or review state", () => {
  assert.throws(
    () =>
      verifyPublishedReview(identity, pullRequest(), [
        review("approved", { commitSha: "c".repeat(40) }),
      ]),
    /exactly one COMMENT review/u,
  );
  assert.throws(
    () =>
      verifyPublishedReview(identity, pullRequest(), [
        review("approved", { state: "APPROVED" }),
      ]),
    /exactly one COMMENT review/u,
  );
});

test("rejects a review after the pull request changes", () => {
  assert.throws(
    () =>
      verifyPublishedReview(
        identity,
        pullRequest({ headSha: "c".repeat(40) }),
        [review("approved")],
      ),
    /Pull request changed during review/u,
  );
});

class FakeGitHubClient {
  readonly labels = new Set<string>(["AI Approved", "AI Need Change"]);
  readonly pulls: ReturnType<typeof pullRequest>[];
  readonly reviews: ReturnType<typeof review>[];
  pullRequestReads = 0;
  reviewReads = 0;

  constructor(
    pulls: ReturnType<typeof pullRequest>[],
    reviews: ReturnType<typeof review>[],
  ) {
    this.pulls = pulls;
    this.reviews = reviews;
  }

  async getPullRequest(): Promise<ReturnType<typeof pullRequest>> {
    const value = this.pulls[this.pullRequestReads];
    this.pullRequestReads += 1;
    if (!value) {
      throw new Error("Unexpected pull-request read.");
    }
    return value;
  }

  async listReviews(): Promise<ReturnType<typeof review>[]> {
    this.reviewReads += 1;
    return this.reviews;
  }

  async removeLabel(_prNumber: number, label: string): Promise<void> {
    this.labels.delete(label);
  }

  async addLabel(_prNumber: number, label: string): Promise<void> {
    this.labels.add(label);
  }
}

function gateContext(
  overrides: Partial<ReviewGateContext> = {},
): ReviewGateContext {
  return {
    ...identity,
    action: "synchronize" as const,
    authorAssociation: "MEMBER",
    isDraft: false,
    reviewJobResult: "success" as const,
    ...overrides,
  };
}

test("applies only AI Approved after authenticating an approved review", async () => {
  const client = new FakeGitHubClient(
    [pullRequest(), pullRequest()],
    [review("approved")],
  );

  const result = await enforceReviewGate(client, gateContext());

  assert.equal(result, "approved");
  assert.deepEqual([...client.labels], ["AI Approved"]);
  assert.equal(client.reviewReads, 2);
});

test("preserves AI Need Change while failing the gate", async () => {
  const client = new FakeGitHubClient(
    [pullRequest(), pullRequest()],
    [review("needs-change")],
  );

  await assert.rejects(
    enforceReviewGate(client, gateContext()),
    /requires changes/u,
  );

  assert.deepEqual([...client.labels], ["AI Need Change"]);
});

test("clears verdict labels when the review job fails", async () => {
  const client = new FakeGitHubClient([], []);

  await assert.rejects(
    enforceReviewGate(
      client,
      gateContext({ reviewJobResult: "failure" as const }),
    ),
    /did not succeed/u,
  );

  assert.deepEqual([...client.labels], []);
  assert.equal(client.pullRequestReads, 0);
});

test("clears verdict labels and fails the gate for a draft", async (t) => {
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

      assert.deepEqual([...client.labels], []);
      assert.equal(client.pullRequestReads, 0);
    });
  }
});

test("clears verdict labels without requiring a review after close", async () => {
  const client = new FakeGitHubClient([], []);

  const result = await enforceReviewGate(
    client,
    gateContext({ action: "closed" as const }),
  );

  assert.equal(result, "not-applicable");
  assert.deepEqual([...client.labels], []);
  assert.equal(client.pullRequestReads, 0);
});

test("removes a newly applied verdict if the head changes during gating", async () => {
  const client = new FakeGitHubClient(
    [pullRequest(), pullRequest({ headSha: "c".repeat(40) })],
    [review("approved")],
  );

  await assert.rejects(
    enforceReviewGate(client, gateContext()),
    /Pull request changed during review/u,
  );

  assert.deepEqual([...client.labels], []);
});
