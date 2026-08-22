import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { parseVerificationOutput } from "./output.ts";
import type { VerificationTarget } from "./targets.ts";

const revision = "a".repeat(40);
const targets: VerificationTarget[] = [
  { files: ["knowledge/a.md"], id: "knowledge/a.md", kind: "knowledge" },
  { files: ["knowledge/b.md"], id: "knowledge/b.md", kind: "knowledge" },
];

function unit(
  id: string,
  status: "current" | "modification-required" = "current",
) {
  return {
    acceptanceCriteria:
      status === "current" ? [] : ["The claim matches the source."],
    evidence: [
      { source: "https://example.com", description: "Current source." },
    ],
    failure: null,
    id,
    matchingIssueNumber: status === "current" ? null : 12,
    requiredChanges: status === "current" ? [] : ["Update the stale claim."],
    status,
    summary: "Checked the unit.",
  };
}

function output(units: unknown[]): string {
  return JSON.stringify({
    revision,
    scope: "evergreen-knowledge",
    summary: "Verification complete.",
    units,
  });
}

describe("parseVerificationOutput", () => {
  it("accepts one result for every expected unit", () => {
    const parsed = parseVerificationOutput(
      output([unit("knowledge/b.md"), unit("knowledge/a.md")]),
      revision,
      "evergreen-knowledge",
      targets,
    );

    assert.equal(parsed.units.length, 2);
  });

  it("rejects missing, duplicate, and unexpected units", () => {
    assert.throws(
      () =>
        parseVerificationOutput(
          output([unit("knowledge/a.md")]),
          revision,
          "evergreen-knowledge",
          targets,
        ),
      /every expected target exactly once/u,
    );
    assert.throws(
      () =>
        parseVerificationOutput(
          output([unit("knowledge/a.md"), unit("knowledge/a.md")]),
          revision,
          "evergreen-knowledge",
          targets,
        ),
      /every expected target exactly once/u,
    );
  });

  it("requires actionable fields for modification-required", () => {
    const invalid = unit("knowledge/a.md", "modification-required");
    invalid.requiredChanges = [];

    assert.throws(
      () =>
        parseVerificationOutput(
          output([invalid, unit("knowledge/b.md")]),
          revision,
          "evergreen-knowledge",
          targets,
        ),
      /must describe required changes/u,
    );
  });

  it("accepts one matching issue shared by two units", () => {
    const parsed = parseVerificationOutput(
      output([
        unit("knowledge/a.md", "modification-required"),
        unit("knowledge/b.md", "modification-required"),
      ]),
      revision,
      "evergreen-knowledge",
      targets,
    );

    assert.deepEqual(
      parsed.units.map((result) => result.matchingIssueNumber),
      [12, 12],
    );
  });
});
