import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { reduceFindingEvents } from "./finding-events.ts";
import type { VerificationManifest } from "./manifest.ts";

const manifest: VerificationManifest = {
  revision: "a".repeat(40),
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
      files: ["knowledge/b.md"],
      id: "knowledge/b.md",
      kind: "knowledge",
      knowledgeType: "evergreen",
    },
    {
      files: ["skills/check/SKILL.md"],
      id: "skills/check/SKILL.md",
      kind: "skill",
    },
  ],
};

function output(items: unknown[]): unknown {
  return { errors: [], items };
}

function add(overrides: Record<string, unknown> = {}) {
  return {
    type: "add_finding",
    finding_id: "duplicate-owner",
    target_id: "knowledge/a.md",
    classification: "modification-required",
    finding: "The same rule is maintained by two canonical owners.",
    related_target_ids: "skills/check/SKILL.md, knowledge/b.md",
    ...overrides,
  };
}

describe("reduceFindingEvents", () => {
  it("replays add, full replacement update, and delete events in order", () => {
    assert.deepEqual(
      reduceFindingEvents(
        manifest,
        output([
          add(),
          {
            type: "add_finding",
            finding_id: "obsolete-qualification",
            target_id: "knowledge/a.md",
            classification: "verification-inconclusive",
            finding: "The qualification may no longer be necessary.",
          },
          {
            type: "update_finding",
            finding_id: "duplicate-owner",
            target_id: "knowledge/a.md",
            classification: "modification-required",
            finding:
              "Keep one canonical owner and replace the other account with an inline dependency at the point of use.",
            related_target_ids: "knowledge/b.md",
          },
          {
            type: "delete_finding",
            finding_id: "obsolete-qualification",
          },
        ]),
      ),
      [
        {
          classification: "modification-required",
          finding:
            "Keep one canonical owner and replace the other account with an inline dependency at the point of use.",
          findingId: "duplicate-owner",
          relatedTargetIds: ["knowledge/b.md"],
          targetId: "knowledge/a.md",
        },
      ],
    );
  });

  it("accepts an empty event stream as a successful no-action result", () => {
    assert.deepEqual(reduceFindingEvents(manifest, output([])), []);
  });

  it("rejects targets outside the trusted manifest boundaries", () => {
    for (const event of [
      add({ target_id: "knowledge/b.md" }),
      add({ related_target_ids: "knowledge/unknown.md" }),
      add({ related_target_ids: "knowledge/a.md" }),
    ]) {
      assert.throws(
        () => reduceFindingEvents(manifest, output([event])),
        /Content verification findings/u,
      );
    }
  });

  it("rejects duplicate adds and mutations without an active finding", () => {
    for (const events of [
      [add(), add()],
      [
        {
          ...add(),
          type: "update_finding",
        },
      ],
      [{ type: "delete_finding", finding_id: "not-added" }],
      [add(), { type: "delete_finding", finding_id: "duplicate-owner" }, add()],
    ]) {
      assert.throws(
        () => reduceFindingEvents(manifest, output(events)),
        /Content verification findings/u,
      );
    }
  });

  it("fails closed at the Agent-output artifact boundary", () => {
    for (const candidate of [
      { errors: ["invalid item"], items: [] },
      output([{ type: "report_incomplete", reason: "Source unavailable." }]),
      output([{ ...add(), unsupported: true }]),
      { errors: [], items: "not-an-array" },
    ]) {
      assert.throws(
        () => reduceFindingEvents(manifest, candidate),
        /Content verification findings/u,
      );
    }
  });
});
