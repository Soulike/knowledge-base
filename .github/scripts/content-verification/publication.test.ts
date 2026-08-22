import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type {
  GitHubIssue,
  GitHubIssueComment,
  IssuePublisher,
  NewIssue,
} from "./github.ts";
import type { VerificationOutput, VerificationUnitResult } from "./output.ts";
import {
  publishExecutionFailure,
  publishVerification,
  type PublicationContext,
} from "./publication.ts";

class FakePublisher implements IssuePublisher {
  comments: Array<{ body: string; issueNumber: number }> = [];
  createCalls = 0;
  created: NewIssue[] = [];
  ensuredLabels: string[] = [];
  failCreateCall: number | null = null;
  issueComments = new Map<number, GitHubIssueComment[]>();
  issues = new Map<number, GitHubIssue>();

  async comment(issueNumber: number, body: string): Promise<void> {
    this.comments.push({ body, issueNumber });
    const comments = this.issueComments.get(issueNumber) ?? [];
    comments.push({ author: "github-actions[bot]", body });
    this.issueComments.set(issueNumber, comments);
  }

  async create(issue: NewIssue): Promise<number> {
    this.createCalls += 1;
    if (this.createCalls === this.failCreateCall) {
      throw new Error("Injected issue creation failure.");
    }
    this.created.push(issue);
    const issueNumber = 100 + this.createCalls;
    this.issues.set(issueNumber, {
      author: "github-actions[bot]",
      body: issue.body,
      number: issueNumber,
      open: true,
      pullRequest: false,
      title: issue.title,
    });
    return issueNumber;
  }

  async ensureLabel(name: string): Promise<void> {
    this.ensuredLabels.push(name);
  }

  async get(issueNumber: number): Promise<GitHubIssue | undefined> {
    return this.issues.get(issueNumber);
  }

  async listIssueComments(issueNumber: number): Promise<GitHubIssueComment[]> {
    return this.issueComments.get(issueNumber) ?? [];
  }

  async listOpenIssues(): Promise<GitHubIssue[]> {
    return [...this.issues.values()].filter((issue) => issue.open);
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

function unit(
  id: string,
  status: "current" | "modification-required" | "verification-failed",
  matchingIssueNumber: number | null = null,
): VerificationUnitResult {
  return {
    acceptanceCriteria:
      status === "modification-required" ? ["Correct claim."] : [],
    evidence: [{ description: "Evidence.", source: "source" }],
    failure: status === "verification-failed" ? "Source unavailable." : null,
    id,
    matchingIssueNumber,
    requiredChanges:
      status === "modification-required" ? ["Update claim."] : [],
    status,
    summary: "Result.",
  };
}

function outputWithUnits(units: VerificationUnitResult[]): VerificationOutput {
  return {
    revision: context.revision,
    scope: context.scope,
    summary: "Complete.",
    units,
  };
}

function output(
  status: "current" | "modification-required" | "verification-failed",
  matchingIssueNumber: number | null = null,
): VerificationOutput {
  return outputWithUnits([
    unit("knowledge/example.md", status, matchingIssueNumber),
  ]);
}

function existingIssue(number: number, title: string, body = ""): GitHubIssue {
  return {
    author: "Soulike",
    body,
    number,
    open: true,
    pullRequest: false,
    title,
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
    publisher.issues.set(
      12,
      existingIssue(12, "Existing issue for knowledge/example.md"),
    );

    const result = await publishVerification(
      output("modification-required", 12),
      context,
      publisher,
    );

    assert.deepEqual(result.updated, [12]);
    assert.equal(publisher.created.length, 0);
    assert.equal(publisher.comments[0]?.issueNumber, 12);
  });

  it("groups units that share one matching issue into one comment", async () => {
    const publisher = new FakePublisher();
    publisher.issues.set(
      12,
      existingIssue(
        12,
        "Shared content verification issue",
        "Affects knowledge/a.md and knowledge/b.md.",
      ),
    );

    const result = await publishVerification(
      outputWithUnits([
        unit("knowledge/a.md", "modification-required", 12),
        unit("knowledge/b.md", "verification-failed", 12),
      ]),
      context,
      publisher,
    );

    assert.deepEqual(result.updated, [12]);
    assert.equal(publisher.comments.length, 1);
    assert.match(publisher.comments[0]?.body ?? "", /knowledge\/a\.md/u);
    assert.match(publisher.comments[0]?.body ?? "", /knowledge\/b\.md/u);
  });

  it("comments when the selected issue body names the reviewed unit", async () => {
    const publisher = new FakePublisher();
    publisher.issues.set(
      12,
      existingIssue(
        12,
        "Existing verification issue",
        "This failure affects knowledge/example.md.",
      ),
    );

    const result = await publishVerification(
      output("modification-required", 12),
      context,
      publisher,
    );

    assert.deepEqual(result.updated, [12]);
    assert.equal(publisher.created.length, 0);
    assert.equal(publisher.comments[0]?.issueNumber, 12);
  });

  it("creates a new issue when the selected issue names another unit", async () => {
    const publisher = new FakePublisher();
    publisher.issues.set(
      12,
      existingIssue(
        12,
        "Existing verification issue",
        "This failure affects knowledge/other.md.",
      ),
    );

    const result = await publishVerification(
      output("modification-required", 12),
      context,
      publisher,
    );

    assert.deepEqual(result.created, [101]);
    assert.deepEqual(publisher.comments, []);
  });

  it("creates a new issue when the selected issue is no longer open", async () => {
    const publisher = new FakePublisher();
    const closed = existingIssue(12, "Closed issue for knowledge/example.md");
    closed.open = false;
    publisher.issues.set(12, closed);

    const result = await publishVerification(
      output("verification-failed", 12),
      context,
      publisher,
    );

    assert.deepEqual(result.created, [101]);
    assert.equal(result.requiresFailure, true);
  });

  it("resumes after partial publication without repeating completed mutations", async () => {
    const publisher = new FakePublisher();
    publisher.issues.set(
      12,
      existingIssue(12, "Existing issue for knowledge/commented.md"),
    );
    publisher.failCreateCall = 2;
    const verification = outputWithUnits([
      unit("knowledge/commented.md", "modification-required", 12),
      unit("knowledge/created.md", "modification-required"),
      unit("knowledge/remaining.md", "modification-required"),
    ]);

    await assert.rejects(
      publishVerification(verification, context, publisher),
      /Injected issue creation failure/u,
    );
    assert.equal(publisher.comments.length, 1);
    assert.equal(publisher.created.length, 1);

    const result = await publishVerification(
      verification,
      { ...context, runAttempt: 2 },
      publisher,
    );

    assert.deepEqual(result.created, [103]);
    assert.deepEqual(result.updated, []);
    assert.equal(publisher.comments.length, 1);
    assert.equal(publisher.created.length, 2);
    assert.equal(
      publisher.created.filter((issue) =>
        issue.title.includes("knowledge/created.md"),
      ).length,
      1,
    );
    assert.equal(
      publisher.created.filter((issue) =>
        issue.title.includes("knowledge/remaining.md"),
      ).length,
      1,
    );
  });

  it("does not accept an untrusted issue-body marker as retry state", async () => {
    const publisher = new FakePublisher();
    const verification = output("modification-required");
    await publishVerification(verification, context, publisher);
    const first = publisher.issues.get(101);
    assert.ok(first);
    first.author = "untrusted-user";

    await publishVerification(
      verification,
      { ...context, runAttempt: 2 },
      publisher,
    );

    assert.equal(publisher.created.length, 2);
  });

  it("publishes one execution failure before any actionable body exceeds GitHub's limit", async () => {
    const publisher = new FakePublisher();
    const oversized = output("modification-required");
    const oversizedUnit = oversized.units[0];
    assert.ok(oversizedUnit);
    oversizedUnit.summary = "S".repeat(20_000);
    oversizedUnit.evidence = Array.from({ length: 5 }, (_, index) => ({
      description: "E".repeat(10_000),
      source: `source-${index}`,
    }));
    oversizedUnit.requiredChanges = ["R".repeat(10_000)];
    oversizedUnit.acceptanceCriteria = ["A".repeat(10_000)];

    const result = await publishVerification(oversized, context, publisher);

    assert.deepEqual(result, {
      created: [101],
      requiresFailure: true,
      updated: [],
    });
    assert.equal(publisher.created.length, 1);
    const created = publisher.created[0];
    assert.ok(created);
    assert.deepEqual(created.labels, [
      "automated-verification",
      "verification-failed",
    ]);
    assert.match(created.title, /^Content verification workflow failed:/u);
    assert.ok(created.body.length <= 65_536);
    assert.doesNotMatch(created.body, /## Required modifications/u);
  });

  it("preflights the combined body before publishing a grouped comment", async () => {
    const publisher = new FakePublisher();
    publisher.issues.set(
      12,
      existingIssue(
        12,
        "Shared content verification issue",
        "Affects knowledge/a.md and knowledge/b.md.",
      ),
    );
    const first = unit("knowledge/a.md", "modification-required", 12);
    const second = unit("knowledge/b.md", "modification-required", 12);
    first.summary = "A".repeat(34_000);
    second.summary = "B".repeat(34_000);

    const result = await publishVerification(
      outputWithUnits([first, second]),
      context,
      publisher,
    );

    assert.deepEqual(publisher.comments, []);
    assert.deepEqual(result.created, [101]);
    assert.match(
      publisher.created[0]?.title ?? "",
      /^Content verification workflow failed:/u,
    );
  });
});

describe("publishExecutionFailure", () => {
  it("updates an open issue with the exact operational-failure title once", async () => {
    const publisher = new FakePublisher();
    publisher.issues.set(
      8,
      existingIssue(
        8,
        "Content verification workflow failed: time-sensitive-knowledge: Copilot failed.",
      ),
    );

    const first = await publishExecutionFailure(
      "Copilot failed.",
      context,
      publisher,
    );
    const retry = await publishExecutionFailure(
      "Copilot failed.",
      { ...context, runAttempt: 2 },
      publisher,
    );

    assert.deepEqual(first.updated, [8]);
    assert.deepEqual(retry.updated, []);
    assert.equal(publisher.created.length, 0);
    assert.equal(publisher.comments.length, 1);
  });

  it("bounds rendered operational-failure bodies after Markdown escaping", async () => {
    const publisher = new FakePublisher();

    await publishExecutionFailure("&".repeat(20_000), context, publisher);

    const created = publisher.created[0];
    assert.ok(created);
    assert.ok(created.body.length <= 65_536);
    assert.match(
      created.body,
      /This report was truncated because GitHub limits/u,
    );
  });
});
