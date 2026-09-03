import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { GitHubConfirmationIssueRepository } from "./github-confirmation-issues.ts";

function repository(fetchImplementation: typeof fetch) {
  return new GitHubConfirmationIssueRepository({
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

describe("GitHubConfirmationIssueRepository", () => {
  it("rejects malformed external issue data before constructing a domain issue", async () => {
    const github = repository(async () =>
      jsonResponse({
        body: "body",
        html_url: "https://github.com/Soulike/knowledge-base/issues/42",
        labels: null,
        number: 42,
        state: "open",
        title: "title",
        user: { login: "github-actions[bot]" },
      }),
    );

    await assert.rejects(
      () => github.getIssue("42"),
      /GitHub confirmation issue adapter: issue labels must be an array/u,
    );
  });

  it("authenticates a comment's repository issue relationship from validated data", async () => {
    const github = repository(async () =>
      jsonResponse({
        author_association: "OWNER",
        body: "No change is needed; verify after the next model update.",
        html_url:
          "https://github.com/Soulike/knowledge-base/issues/42#issuecomment-9001",
        id: 9001,
        issue_url:
          "https://api.github.test/repos/Soulike/knowledge-base/issues/42",
      }),
    );

    assert.deepEqual(await github.getComment("9001"), {
      authorAssociation: "OWNER",
      body: "No change is needed; verify after the next model update.",
      htmlUrl:
        "https://github.com/Soulike/knowledge-base/issues/42#issuecomment-9001",
      id: "9001",
      issueNumber: "42",
    });
  });
});
