import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  applyVerificationInconclusiveDecisions,
  type ConfirmationIssue,
  type ConfirmationIssueComment,
  type ConfirmationIssueRepository,
} from "./inconclusive-resolution.ts";
import type { VerificationManifest } from "./manifest.ts";

const revision = "a".repeat(40);
const manifest: VerificationManifest = {
  revision,
  scope: "time-sensitive-knowledge",
  targets: [
    { files: ["knowledge/a.md"], id: "knowledge/a.md", kind: "knowledge" },
  ],
};

class FakeIssueRepository implements ConfirmationIssueRepository {
  readonly created: Array<{
    assignees: string[];
    body: string;
    labels: string[];
    title: string;
  }> = [];
  readonly comments = new Map<string, ConfirmationIssueComment>();
  readonly issues = new Map<string, ConfirmationIssue>();
  openIssues: ConfirmationIssue[] = [];

  async createIssue(input: {
    assignees: string[];
    body: string;
    labels: string[];
    title: string;
  }): Promise<ConfirmationIssue> {
    this.created.push(input);
    return {
      authorLogin: "github-actions[bot]",
      body: input.body,
      htmlUrl: `https://github.com/Soulike/knowledge-base/issues/${String(100 + this.created.length)}`,
      labels: input.labels,
      number: String(100 + this.created.length),
      pullRequest: false,
      state: "open",
      title: input.title,
    };
  }

  async getComment(commentId: string): Promise<ConfirmationIssueComment> {
    const comment = this.comments.get(commentId);
    if (!comment) {
      throw new Error(`Comment ${commentId} was not found.`);
    }
    return comment;
  }

  async getIssue(issueNumber: string): Promise<ConfirmationIssue> {
    const issue = this.issues.get(issueNumber);
    if (!issue) {
      throw new Error(`Issue ${issueNumber} was not found.`);
    }
    return issue;
  }

  async listOpenIssues(): Promise<ConfirmationIssue[]> {
    return this.openIssues;
  }
}

function agentOutput(items: unknown[]): unknown {
  return { errors: [], items };
}

function createDecision(
  summary = "Nail omission guidance lacks a public source",
) {
  return {
    type: "resolve_verification_inconclusive",
    action: "create_issue",
    target_id: "knowledge/a.md",
    summary,
    finding:
      "The maintained guidance says omitting nails can improve generation, but current public sources neither confirm nor invalidate that observation.",
    evidence_checked:
      "Checked the current product help and prompting guide; neither discusses fingernail omission.",
  };
}

function confirmationIssue(
  number: string,
  state: "closed" | "open",
): ConfirmationIssue {
  return {
    authorLogin: "github-actions[bot]",
    body: `<!-- content-verification-confirmation: ${JSON.stringify({
      revision,
      scope: manifest.scope,
      target: "knowledge/a.md",
      version: 1,
      workflow: "verify-time-sensitive-knowledge",
    })} -->\n\nConfirmation issue body.`,
    htmlUrl: `https://github.com/Soulike/knowledge-base/issues/${number}`,
    labels: ["automated-verification", "ready-for-human"],
    number,
    pullRequest: false,
    state,
    title:
      "[time-sensitive Knowledge verification inconclusive] knowledge/a.md: Existing confirmation",
  };
}

describe("applyVerificationInconclusiveDecisions", () => {
  it("constructs and publishes one trusted confirmation issue", async () => {
    const repository = new FakeIssueRepository();

    const result = await applyVerificationInconclusiveDecisions(
      manifest,
      agentOutput([createDecision()]),
      {
        owner: "Soulike",
        repo: "knowledge-base",
        runUrl:
          "https://github.com/Soulike/knowledge-base/actions/runs/33713910029",
        staged: false,
      },
      repository,
    );

    assert.equal(result.created.length, 1);
    assert.equal(result.suppressed.length, 0);
    assert.equal(repository.created.length, 1);
    const created = repository.created[0];
    assert.ok(created);
    assert.match(created.title, /verification inconclusive/u);
    assert.deepEqual(created.labels, [
      "automated-verification",
      "ready-for-human",
    ]);
    assert.deepEqual(created.assignees, ["Soulike"]);
    for (const expected of [
      "knowledge/a.md",
      revision,
      "33713910029",
      "Nail omission guidance lacks a public source",
      "current product help and prompting guide",
      "how the information was obtained",
      "when it must be verified again",
      "modify or delete the questioned content",
    ]) {
      assert.match(created.body, new RegExp(expected, "u"));
    }
  });

  it("accepts an authenticated matching open confirmation issue", async () => {
    const repository = new FakeIssueRepository();
    repository.issues.set("41", confirmationIssue("41", "open"));

    const result = await applyVerificationInconclusiveDecisions(
      manifest,
      agentOutput([
        {
          ...createDecision(),
          action: "do_not_create_issue",
          no_issue_reason: "matching_open_issue",
          issue_number: "41",
        },
      ]),
      {
        owner: "Soulike",
        repo: "knowledge-base",
        runUrl:
          "https://github.com/Soulike/knowledge-base/actions/runs/33713910029",
        staged: false,
      },
      repository,
    );

    assert.equal(repository.created.length, 0);
    assert.deepEqual(result.suppressed, [
      {
        issueNumber: "41",
        reason: "matching_open_issue",
        targetId: "knowledge/a.md",
      },
    ]);
  });

  it("accepts a trusted collaborator disposition on a closed issue", async () => {
    for (const authorAssociation of ["OWNER", "MEMBER", "COLLABORATOR"]) {
      const repository = new FakeIssueRepository();
      repository.issues.set("42", confirmationIssue("42", "closed"));
      repository.comments.set("9001", {
        authorAssociation,
        body: "This came from repeated product use; retry after the next model update.",
        htmlUrl:
          "https://github.com/Soulike/knowledge-base/issues/42#issuecomment-9001",
        id: "9001",
        issueNumber: "42",
      });

      const result = await applyVerificationInconclusiveDecisions(
        manifest,
        agentOutput([
          {
            ...createDecision(),
            action: "do_not_create_issue",
            no_issue_reason: "trusted_collaborator_disposition",
            issue_number: "42",
            comment_id: "9001",
          },
        ]),
        {
          owner: "Soulike",
          repo: "knowledge-base",
          runUrl:
            "https://github.com/Soulike/knowledge-base/actions/runs/33713910029",
          staged: false,
        },
        repository,
      );

      assert.equal(repository.created.length, 0);
      assert.deepEqual(result.suppressed, [
        {
          issueNumber: "42",
          reason: "trusted_collaborator_disposition",
          targetId: "knowledge/a.md",
        },
      ]);
    }
  });

  it("re-reads every related issue before linking it from a new confirmation", async () => {
    const repository = new FakeIssueRepository();

    await assert.rejects(
      () =>
        applyVerificationInconclusiveDecisions(
          manifest,
          agentOutput([
            {
              ...createDecision(),
              related_issue_numbers: "404",
            },
          ]),
          {
            owner: "Soulike",
            repo: "knowledge-base",
            runUrl:
              "https://github.com/Soulike/knowledge-base/actions/runs/33713910029",
            staged: false,
          },
          repository,
        ),
      /404/u,
    );
    assert.equal(repository.created.length, 0);
  });

  it("publishes separate issues for independent findings on one target", async () => {
    const repository = new FakeIssueRepository();

    await applyVerificationInconclusiveDecisions(
      manifest,
      agentOutput([
        createDecision("First inconclusive finding"),
        createDecision("Second inconclusive finding"),
      ]),
      {
        owner: "Soulike",
        repo: "knowledge-base",
        runUrl:
          "https://github.com/Soulike/knowledge-base/actions/runs/33713910029",
        staged: false,
      },
      repository,
    );

    assert.equal(repository.created.length, 2);
    assert.notEqual(repository.created[0]?.title, repository.created[1]?.title);
  });

  it("suppresses an identical issue that appears at publication time", async () => {
    const firstRepository = new FakeIssueRepository();
    const firstResult = await applyVerificationInconclusiveDecisions(
      manifest,
      agentOutput([createDecision()]),
      {
        owner: "Soulike",
        repo: "knowledge-base",
        runUrl:
          "https://github.com/Soulike/knowledge-base/actions/runs/33713910029",
        staged: false,
      },
      firstRepository,
    );
    const racedIssue = firstResult.created[0];
    assert.ok(racedIssue);

    const racingRepository = new FakeIssueRepository();
    racingRepository.openIssues = [racedIssue];
    const result = await applyVerificationInconclusiveDecisions(
      manifest,
      agentOutput([createDecision()]),
      {
        owner: "Soulike",
        repo: "knowledge-base",
        runUrl:
          "https://github.com/Soulike/knowledge-base/actions/runs/33713910030",
        staged: false,
      },
      racingRepository,
    );

    assert.equal(racingRepository.created.length, 0);
    assert.deepEqual(result.suppressed, [
      {
        issueNumber: racedIssue.number,
        reason: "publication_race",
        targetId: "knowledge/a.md",
      },
    ]);
  });

  it("rejects unauthenticated issue and disposition references", async () => {
    const publicationContext = {
      owner: "Soulike",
      repo: "knowledge-base",
      runUrl:
        "https://github.com/Soulike/knowledge-base/actions/runs/33713910029",
      staged: false,
    };
    const dispositionDecision = {
      ...createDecision(),
      action: "do_not_create_issue",
      no_issue_reason: "trusted_collaborator_disposition",
      issue_number: "42",
      comment_id: "9001",
    };

    for (const authorAssociation of [
      "CONTRIBUTOR",
      "FIRST_TIMER",
      "NONE",
      undefined,
    ]) {
      const repository = new FakeIssueRepository();
      repository.issues.set("42", confirmationIssue("42", "closed"));
      repository.comments.set("9001", {
        ...(authorAssociation === undefined ? {} : { authorAssociation }),
        body: "No change is needed; verify again after a model update.",
        htmlUrl:
          "https://github.com/Soulike/knowledge-base/issues/42#issuecomment-9001",
        id: "9001",
        issueNumber: "42",
      });
      await assert.rejects(
        () =>
          applyVerificationInconclusiveDecisions(
            manifest,
            agentOutput([dispositionDecision]),
            publicationContext,
            repository,
          ),
        /trusted collaborator/u,
      );
    }

    const invalidRepositories = [
      new FakeIssueRepository(),
      (() => {
        const repository = new FakeIssueRepository();
        repository.issues.set("42", {
          ...confirmationIssue("42", "closed"),
          pullRequest: true,
        });
        return repository;
      })(),
      (() => {
        const repository = new FakeIssueRepository();
        repository.issues.set("42", {
          ...confirmationIssue("42", "closed"),
          authorLogin: "someone-else",
        });
        return repository;
      })(),
      (() => {
        const repository = new FakeIssueRepository();
        repository.issues.set("42", confirmationIssue("42", "open"));
        return repository;
      })(),
      (() => {
        const repository = new FakeIssueRepository();
        repository.issues.set("42", confirmationIssue("42", "closed"));
        repository.comments.set("9001", {
          authorAssociation: "OWNER",
          body: "No change is needed; verify again after a model update.",
          htmlUrl:
            "https://github.com/Soulike/knowledge-base/issues/43#issuecomment-9001",
          id: "9001",
          issueNumber: "43",
        });
        return repository;
      })(),
    ];

    for (const repository of invalidRepositories) {
      await assert.rejects(() =>
        applyVerificationInconclusiveDecisions(
          manifest,
          agentOutput([dispositionDecision]),
          publicationContext,
          repository,
        ),
      );
      assert.equal(repository.created.length, 0);
    }

    const closedMatchingRepository = new FakeIssueRepository();
    closedMatchingRepository.issues.set(
      "42",
      confirmationIssue("42", "closed"),
    );
    await assert.rejects(
      () =>
        applyVerificationInconclusiveDecisions(
          manifest,
          agentOutput([
            {
              ...createDecision(),
              action: "do_not_create_issue",
              no_issue_reason: "matching_open_issue",
              issue_number: "42",
            },
          ]),
          publicationContext,
          closedMatchingRepository,
        ),
      /not open/u,
    );

    for (const invalidIssue of [
      {
        ...confirmationIssue("42", "open"),
        labels: ["automated-verification", "modification-required"],
      },
      {
        ...confirmationIssue("42", "open"),
        title: "[time-sensitive Knowledge] knowledge/a.md",
      },
    ]) {
      const repository = new FakeIssueRepository();
      repository.issues.set("42", invalidIssue);
      await assert.rejects(() =>
        applyVerificationInconclusiveDecisions(
          manifest,
          agentOutput([
            {
              ...createDecision(),
              action: "do_not_create_issue",
              no_issue_reason: "matching_open_issue",
              issue_number: "42",
            },
          ]),
          publicationContext,
          repository,
        ),
      );
    }
  });
});
