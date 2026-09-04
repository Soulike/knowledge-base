import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { GitHubIssueRepository } from "./github-issues.ts";

function repository(fetchImplementation: typeof fetch) {
  return new GitHubIssueRepository({
    apiUrl: "https://api.github.test",
    fetch: fetchImplementation,
    owner: "Soulike",
    repo: "knowledge-base",
    token: "test-token",
  });
}

function jsonResponse(value: unknown): Response {
  return new Response(JSON.stringify(value), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}

describe("GitHubIssueRepository", () => {
  it("rejects malformed external issue data before constructing a domain issue", async () => {
    const github = repository(async () =>
      jsonResponse([
        {
          body: "body",
          labels: null,
          number: 42,
          state: "open",
          title: "title",
          user: { login: "github-actions[bot]" },
        },
      ]),
    );

    await assert.rejects(
      () => github.listOpenIssues(["automated-verification"]),
      /GitHub issue adapter: issue labels must be an array/u,
    );
  });

  it("creates a finding issue through the repository boundary", async () => {
    let request: RequestInit | undefined;
    const github = repository(async (_input, init) => {
      request = init;
      return jsonResponse({
        body: "body",
        labels: ["automated-verification", "modification-required"],
        number: 42,
        state: "open",
        title: "title",
        user: { login: "github-actions[bot]" },
      });
    });

    assert.deepEqual(
      await github.createIssue({
        assignees: ["Soulike"],
        body: "body",
        labels: ["automated-verification", "modification-required"],
        title: "title",
      }),
      {
        authorLogin: "github-actions[bot]",
        body: "body",
        labels: ["automated-verification", "modification-required"],
        number: "42",
        pullRequest: false,
        state: "open",
        title: "title",
      },
    );
    assert.equal(request?.method, "POST");
    assert.deepEqual(JSON.parse(String(request?.body)), {
      assignees: ["Soulike"],
      body: "body",
      labels: ["automated-verification", "modification-required"],
      title: "title",
    });
  });
});
