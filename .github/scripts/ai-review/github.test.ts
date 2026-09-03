import assert from "node:assert/strict";
import test from "node:test";

import { GitHubClient } from "./github.ts";

function mockFetch(t: test.TestContext, implementation: typeof fetch): void {
  const original = globalThis.fetch;
  globalThis.fetch = implementation;
  t.after(() => {
    globalThis.fetch = original;
  });
}

function jsonResponse(value: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(value), { ...init, headers });
}

test("maps pull-request identity through the Octokit REST endpoint", async (t) => {
  let capturedUrl = "";
  mockFetch(t, async (input) => {
    capturedUrl = String(input);
    return jsonResponse(
      {
        base: { sha: "a".repeat(40) },
        head: { sha: "b".repeat(40) },
        html_url: "https://github.com/owner/repository/pull/42",
        labels: [{ name: "AI Approved" }, { name: "documentation" }],
        number: 42,
        state: "open",
      },
      { status: 200 },
    );
  });
  const client = new GitHubClient("token", "owner/repository");

  const pullRequest = await client.getPullRequest(42);

  assert.equal(
    capturedUrl,
    "https://api.github.com/repos/owner/repository/pulls/42",
  );
  assert.deepEqual(pullRequest, {
    baseSha: "a".repeat(40),
    headSha: "b".repeat(40),
    htmlUrl: "https://github.com/owner/repository/pull/42",
    labels: ["AI Approved", "documentation"],
    number: 42,
    state: "open",
  });
});

test("uses Octokit pagination and preserves submitted review identity", async (t) => {
  let requestCount = 0;
  mockFetch(t, async () => {
    requestCount += 1;
    if (requestCount === 1) {
      return jsonResponse(
        [
          {
            body: "",
            commit_id: "b".repeat(40),
            id: 11,
            state: "COMMENTED",
            submitted_at: "2026-09-02T10:00:30Z",
            user: { login: "github-actions[bot]" },
          },
        ],
        {
          headers: {
            Link: '<https://api.github.com/repositories/1/pulls/42/reviews?page=2>; rel="next"',
          },
          status: 200,
        },
      );
    }
    return jsonResponse(
      [
        {
          body: null,
          commit_id: "c".repeat(40),
          id: 12,
          state: "DISMISSED",
          submitted_at: "2026-09-02T09:00:00Z",
          user: null,
        },
      ],
      { status: 200 },
    );
  });
  const client = new GitHubClient("token", "owner/repository");

  const reviews = await client.listReviews(42);

  assert.equal(requestCount, 2);
  assert.deepEqual(reviews, [
    {
      authorLogin: "github-actions[bot]",
      body: "",
      commitSha: "b".repeat(40),
      id: 11,
      state: "COMMENTED",
      submittedAt: "2026-09-02T10:00:30Z",
    },
    {
      authorLogin: null,
      body: null,
      commitSha: "c".repeat(40),
      id: 12,
      state: "DISMISSED",
      submittedAt: "2026-09-02T09:00:00Z",
    },
  ]);
});

test("reads the exact run-attempt jobs used to authenticate publication", async (t) => {
  let capturedUrl = "";
  mockFetch(t, async (input) => {
    capturedUrl = String(input);
    return jsonResponse(
      {
        jobs: [
          {
            completed_at: "2026-09-02T10:01:00Z",
            conclusion: "success",
            id: 77,
            name: "safe_outputs",
            started_at: "2026-09-02T10:00:00Z",
            status: "completed",
          },
        ],
        total_count: 1,
      },
      { status: 200 },
    );
  });
  const client = new GitHubClient("token", "owner/repository");

  const jobs = await client.listRunAttemptJobs(1234, 2);

  assert.equal(
    capturedUrl,
    "https://api.github.com/repos/owner/repository/actions/runs/1234/attempts/2/jobs?per_page=100",
  );
  assert.deepEqual(jobs, [
    {
      completedAt: "2026-09-02T10:01:00Z",
      conclusion: "success",
      id: 77,
      name: "safe_outputs",
      startedAt: "2026-09-02T10:00:00Z",
      status: "completed",
    },
  ]);
});

test("paginates inline review comments and preserves their review identity", async (t) => {
  let requestCount = 0;
  mockFetch(t, async () => {
    requestCount += 1;
    if (requestCount === 1) {
      return jsonResponse(
        [
          {
            body: "**[high] Unsafe change**",
            id: 501,
            pull_request_review_id: 99,
          },
        ],
        {
          headers: {
            Link: '<https://api.github.com/repositories/1/pulls/42/comments?page=2>; rel="next"',
          },
          status: 200,
        },
      );
    }
    return jsonResponse(
      [
        {
          body: "**[low] Clarify this**",
          id: 502,
          pull_request_review_id: 100,
        },
      ],
      { status: 200 },
    );
  });
  const client = new GitHubClient("token", "owner/repository");

  assert.deepEqual(await client.listReviewComments(42), [
    { body: "**[high] Unsafe change**", id: 501, reviewId: 99 },
    { body: "**[low] Clarify this**", id: 502, reviewId: 100 },
  ]);
  assert.equal(requestCount, 2);
});

test("adds a verdict label with the issues endpoint", async (t) => {
  let capturedRequest: RequestInit | undefined;
  let capturedUrl = "";
  mockFetch(t, async (input, request) => {
    capturedUrl = String(input);
    capturedRequest = request;
    return jsonResponse([], { status: 200 });
  });
  const client = new GitHubClient("token", "owner/repository");

  await client.addLabel(42, "AI Approved");

  assert.equal(
    capturedUrl,
    "https://api.github.com/repos/owner/repository/issues/42/labels",
  );
  assert.equal(capturedRequest?.method, "POST");
  assert.deepEqual(JSON.parse(String(capturedRequest?.body)), {
    labels: ["AI Approved"],
  });
});

test("treats a missing verdict label as already removed", async (t) => {
  mockFetch(t, async () => {
    return jsonResponse({ message: "Label does not exist" }, { status: 404 });
  });
  const client = new GitHubClient("token", "owner/repository");

  await assert.doesNotReject(client.removeLabel(42, "AI Need Change"));
});
