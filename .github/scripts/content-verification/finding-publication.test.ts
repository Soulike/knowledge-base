import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  publishVerificationFindings,
  type FindingIssue,
  type FindingIssueRepository,
} from "./finding-publication.ts";
import type { VerificationFinding } from "./finding-events.ts";
import type { VerificationManifest } from "./manifest.ts";

const revision = "a".repeat(40);
const manifest: VerificationManifest = {
  revision,
  reviewTargetIds: ["knowledge/a.md"],
  scope: "time-sensitive-knowledge",
  targetCatalog: [
    {
      files: ["knowledge/a.md"],
      id: "knowledge/a.md",
      kind: "knowledge",
      knowledgeType: "time-sensitive",
    },
    {
      files: ["skills/check/SKILL.md"],
      id: "skills/check/SKILL.md",
      kind: "skill",
    },
    {
      files: ["references/check.md"],
      id: "references/check.md",
      kind: "shared-reference",
    },
  ],
};

const findings: VerificationFinding[] = [
  {
    classification: "modification-required",
    finding:
      "Rewrite the two patch-layered exceptions as one current rule without losing the supported fallback.",
    findingId: "coherent-rule",
    relatedTargetIds: ["skills/check/SKILL.md", "references/check.md"],
    targetId: "knowledge/a.md",
  },
];

class FakeIssueRepository implements FindingIssueRepository {
  readonly created: Array<{
    assignees: string[];
    body: string;
    labels: string[];
    title: string;
  }> = [];
  openIssues: FindingIssue[] = [];

  async createIssue(
    input: (typeof this.created)[number],
  ): Promise<FindingIssue> {
    this.created.push(input);
    return {
      authorLogin: "github-actions[bot]",
      body: input.body,
      labels: input.labels,
      number: String(100 + this.created.length),
      pullRequest: false,
      state: "open",
      title: input.title,
    };
  }

  async listOpenIssues(): Promise<FindingIssue[]> {
    return this.openIssues;
  }
}

const context = {
  runUrl: "https://github.com/Soulike/knowledge-base/actions/runs/123",
};

describe("publishVerificationFindings", () => {
  it("constructs and publishes one trusted issue per final finding", async () => {
    const repository = new FakeIssueRepository();

    const result = await publishVerificationFindings(
      manifest,
      findings,
      context,
      repository,
    );

    assert.equal(result.created.length, 1);
    assert.deepEqual(repository.created[0]?.labels, [
      "automated-verification",
      "modification-required",
    ]);
    assert.match(
      repository.created[0]?.title ?? "",
      /^\[time-sensitive Knowledge modification required\] knowledge\/a\.md$/u,
    );
    assert.match(
      repository.created[0]?.body ?? "",
      /content-verification-finding/u,
    );
    assert.match(
      repository.created[0]?.body ?? "",
      /skills\/check\/SKILL\.md/u,
    );
    assert.match(repository.created[0]?.body ?? "", new RegExp(revision, "u"));
  });

  it("publishes independent findings separately and routes inconclusive work to a human", async () => {
    const repository = new FakeIssueRepository();
    const secondFinding: VerificationFinding = {
      classification: "verification-inconclusive",
      finding:
        "Current authoritative sources do not establish whether the exception remains necessary.",
      findingId: "exception-evidence",
      relatedTargetIds: [],
      targetId: "knowledge/a.md",
    };

    await publishVerificationFindings(
      manifest,
      [...findings, secondFinding],
      context,
      repository,
    );

    assert.equal(repository.created.length, 2);
    assert.deepEqual(repository.created[1]?.labels, [
      "automated-verification",
      "ready-for-human",
    ]);
  });

  it("cannot reconstruct an HTML comment delimiter from Agent finding text", async () => {
    const repository = new FakeIssueRepository();
    await publishVerificationFindings(
      manifest,
      [
        {
          ...findings[0]!,
          finding: "Untrusted prefix --><!----> must remain quoted text.",
        },
      ],
      context,
      repository,
    );

    const body = repository.created[0]?.body ?? "";
    assert.doesNotMatch(body, /--><!---->/u);
    assert.match(body, /--&gt;&lt;!----&gt;/u);
    assert.equal(body.match(/<!-- content-verification-finding:/gu)?.length, 1);
  });

  it("suppresses only an exact open issue that appears at the write boundary", async () => {
    const repository = new FakeIssueRepository();
    const first = await publishVerificationFindings(
      manifest,
      findings,
      context,
      repository,
    );
    assert.equal(first.created.length, 1);
    repository.openIssues = first.created;

    const second = await publishVerificationFindings(
      manifest,
      [
        {
          ...findings[0]!,
          findingId: "same-content-new-run-id",
          relatedTargetIds: ["references/check.md", "skills/check/SKILL.md"],
        },
      ],
      {
        ...context,
        runUrl: "https://github.com/Soulike/knowledge-base/actions/runs/124",
      },
      repository,
    );

    assert.deepEqual(second, {
      created: [],
      suppressed: [
        {
          findingId: "same-content-new-run-id",
          issueNumber: "101",
          reason: "publication_race",
        },
      ],
    });
    assert.equal(repository.created.length, 1);
  });
});
