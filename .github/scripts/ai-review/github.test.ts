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

test("parses review-thread ownership and REST comment identity", async (t) => {
  mockFetch(t, async () => {
    return new Response(
      JSON.stringify({
        data: {
          repository: {
            pullRequest: {
              reviewThreads: {
                nodes: [
                  {
                    comments: {
                      nodes: [
                        {
                          author: { login: "github-actions[bot]" },
                          body: "AI finding",
                          databaseId: 321,
                        },
                      ],
                    },
                    id: "PRRT_example",
                    isResolved: false,
                  },
                ],
                pageInfo: { endCursor: null, hasNextPage: false },
              },
            },
          },
        },
      }),
      { status: 200 },
    );
  });
  const client = new GitHubClient("token", "owner/repository");

  const threads = await client.listReviewThreads(42);

  assert.deepEqual(threads, [
    {
      comments: [
        {
          authorLogin: "github-actions[bot]",
          body: "AI finding",
          databaseId: 321,
        },
      ],
      id: "PRRT_example",
      isResolved: false,
    },
  ]);
});

test("accepts submitted reviews with an empty body", async (t) => {
  mockFetch(t, async () => {
    return new Response(
      JSON.stringify([
        { body: "", id: 11, user: { login: "github-actions[bot]" } },
      ]),
      { status: 200 },
    );
  });
  const client = new GitHubClient("token", "owner/repository");

  const reviews = await client.listReviews(42);

  assert.equal(reviews[0]?.body, "");
});

test("replies to the original review comment through the pull-request API", async (t) => {
  let capturedUrl = "";
  let capturedRequest: RequestInit | undefined;
  mockFetch(t, async (input, request) => {
    capturedUrl = String(input);
    capturedRequest = request;
    return new Response(JSON.stringify({ id: 99 }), { status: 201 });
  });
  const client = new GitHubClient("token", "owner/repository");

  await client.replyToReviewComment(42, 321, "Verified fixed.");

  assert.equal(
    capturedUrl,
    "https://api.github.com/repos/owner/repository/pulls/42/comments/321/replies",
  );
  assert.equal(capturedRequest?.method, "POST");
  assert.deepEqual(JSON.parse(String(capturedRequest?.body)), {
    body: "Verified fixed.",
  });
});
