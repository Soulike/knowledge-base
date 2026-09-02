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
      jobs(),
    ),
    "needs-change",
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
      () => verifyPublishedReview(identity, pullRequest(), [candidate], jobs()),
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
        jobs(),
      ),
    /current run attempt/u,
  );
});

class FakeGitHubClient {
  readonly labels = new Set<string>(["AI Approved", "AI Need Change"]);
  readonly pulls: ReturnType<typeof pullRequest>[];
  readonly reviews: ReturnType<typeof review>[];
  jobReads = 0;
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

  async listRunAttemptJobs(): Promise<ReturnType<typeof jobs>> {
    this.jobReads += 1;
    return jobs();
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
    agentJobResult: "success" as const,
    authorAssociation: "MEMBER",
    isDraft: false,
    safeOutputsJobResult: "success" as const,
    ...overrides,
  };
}

test("applies only AI Approved after authenticating an approved review", async () => {
  const client = new FakeGitHubClient(
    [pullRequest(), pullRequest()],
    [review("approved")],
  );

  assert.equal(await enforceReviewGate(client, gateContext()), "approved");
  assert.deepEqual([...client.labels], ["AI Approved"]);
  assert.equal(client.reviewReads, 2);
  assert.equal(client.jobReads, 2);
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

test("clears verdict labels when the Agent or safe-output job fails", async (t) => {
  for (const context of [
    { agentJobResult: "failure" as const },
    { safeOutputsJobResult: "failure" as const },
  ]) {
    await t.test(JSON.stringify(context), async () => {
      const client = new FakeGitHubClient([], []);
      await assert.rejects(enforceReviewGate(client, gateContext(context)));
      assert.deepEqual([...client.labels], []);
      assert.equal(client.pullRequestReads, 0);
    });
  }
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
  assert.equal(
    await enforceReviewGate(client, gateContext({ action: "closed" as const })),
    "not-applicable",
  );
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
