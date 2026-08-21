import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { GitHubIssue, IssuePublisher, NewIssue } from "./github.ts";
import type { VerificationOutput } from "./output.ts";
import {
  publishExecutionFailure,
  publishVerification,
  type PublicationContext,
} from "./publication.ts";

class FakePublisher implements IssuePublisher {
  comments: Array<{ body: string; issueNumber: number }> = [];
  created: NewIssue[] = [];
  ensuredLabels: string[] = [];
  issues = new Map<number, GitHubIssue>();

  async comment(issueNumber: number, body: string): Promise<void> {
    this.comments.push({ body, issueNumber });
  }

  async create(issue: NewIssue): Promise<number> {
    this.created.push(issue);
    return 100 + this.created.length;
  }

  async ensureLabel(name: string): Promise<void> {
    this.ensuredLabels.push(name);
  }

  async findOpenByExactTitle(title: string): Promise<GitHubIssue | undefined> {
    return [...this.issues.values()].find(
      (issue) => issue.open && !issue.pullRequest && issue.title === title,
    );
  }

  async get(issueNumber: number): Promise<GitHubIssue | undefined> {
    return this.issues.get(issueNumber);
  }
}

const context: PublicationContext = {
  assignee: "Soulike",
  repository: "Soulike/knowledge-base",
  revision: "a".repeat(40),
  runAttempt: 1,
  runId: 42,
  scope: "time-sensitive-knowledge",
};

function output(
  status: "current" | "modification-required" | "verification-failed",
  matchingIssueNumber: number | null = null,
): VerificationOutput {
  return {
    revision: context.revision,
    scope: context.scope,
    summary: "Complete.",
    units: [
      {
        acceptanceCriteria:
          status === "modification-required" ? ["Correct claim."] : [],
        evidence: [{ description: "Evidence.", source: "source" }],
        failure:
          status === "verification-failed" ? "Source unavailable." : null,
        id: "knowledge/example.md",
        matchingIssueNumber,
        requiredChanges:
          status === "modification-required" ? ["Update claim."] : [],
        status,
        summary: "Result.",
      },
    ],
  };
}

describe("publishVerification", () => {
  it("does not mutate issues for current content", async () => {
    const publisher = new FakePublisher();

    const result = await publishVerification(
      output("current"),
      context,
      publisher,
    );

    assert.deepEqual(result, {
      created: [],
      requiresFailure: false,
      updated: [],
    });
    assert.equal(publisher.ensuredLabels.length, 0);
  });

  it("creates one assigned and labeled issue for a required modification", async () => {
    const publisher = new FakePublisher();

    const result = await publishVerification(
      output("modification-required"),
      context,
      publisher,
    );

    assert.deepEqual(result.created, [101]);
    assert.equal(result.requiresFailure, false);
    assert.equal(publisher.created[0]?.assignee, "Soulike");
    assert.deepEqual(publisher.created[0]?.labels, [
      "automated-verification",
      "modification-required",
    ]);
  });

  it("comments on the open issue selected by the reviewer", async () => {
    const publisher = new FakePublisher();
    publisher.issues.set(12, {
      number: 12,
      open: true,
      pullRequest: false,
      title: "Existing issue",
    });

    const result = await publishVerification(
      output("modification-required", 12),
      context,
      publisher,
    );

    assert.deepEqual(result.updated, [12]);
    assert.equal(publisher.created.length, 0);
    assert.equal(publisher.comments[0]?.issueNumber, 12);
  });

  it("creates a new issue when the selected issue is no longer open", async () => {
    const publisher = new FakePublisher();
    publisher.issues.set(12, {
      number: 12,
      open: false,
      pullRequest: false,
      title: "Closed issue",
    });

    const result = await publishVerification(
      output("verification-failed", 12),
      context,
      publisher,
    );

    assert.deepEqual(result.created, [101]);
    assert.equal(result.requiresFailure, true);
  });
});

describe("publishExecutionFailure", () => {
  it("updates an open issue with the exact operational-failure title", async () => {
    const publisher = new FakePublisher();
    publisher.issues.set(8, {
      number: 8,
      open: true,
      pullRequest: false,
      title:
        "Content verification workflow failed: time-sensitive-knowledge: Copilot failed.",
    });

    const result = await publishExecutionFailure(
      "Copilot failed.",
      context,
      publisher,
    );

    assert.deepEqual(result.updated, [8]);
    assert.equal(publisher.created.length, 0);
  });
});
