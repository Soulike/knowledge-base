import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  parseVerificationManifest,
  validateAgenticVerificationOutput,
} from "./agentic-gate.ts";
import type { VerificationManifest } from "./manifest.ts";

const revision = "a".repeat(40);
const manifests = {
  "evergreen-knowledge": {
    revision,
    scope: "evergreen-knowledge",
    targets: [
      { files: ["knowledge/b.md"], id: "knowledge/b.md", kind: "knowledge" },
    ],
  },
  "maintained-agent-content": {
    revision,
    scope: "maintained-agent-content",
    targets: [
      {
        files: ["skills/a/SKILL.md", "skills/a/references/detail.md"],
        id: "skills/a/SKILL.md",
        kind: "skill",
      },
      {
        files: ["references/agents/shared.md"],
        id: "references/agents/shared.md",
        kind: "shared-reference",
      },
    ],
  },
  "time-sensitive-knowledge": {
    revision,
    scope: "time-sensitive-knowledge",
    targets: [
      { files: ["knowledge/a.md"], id: "knowledge/a.md", kind: "knowledge" },
      { files: ["knowledge/b.md"], id: "knowledge/b.md", kind: "knowledge" },
    ],
  },
} satisfies Record<string, VerificationManifest>;
const manifest = manifests["time-sensitive-knowledge"];

const titlePrefixes = {
  "evergreen-knowledge": "[evergreen Knowledge] ",
  "maintained-agent-content": "[maintained Agent content] ",
  "time-sensitive-knowledge": "[time-sensitive Knowledge] ",
} as const;

function issue(
  target: string,
  scope: keyof typeof titlePrefixes = "time-sensitive-knowledge",
): Record<string, unknown> {
  return {
    type: "create_issue",
    title: `${titlePrefixes[scope]}${target}`,
    body: `Target: ${target}\n\nRevision: ${revision}\n\nUpdate the claim.`,
  };
}

function inconclusive(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    type: "resolve_verification_inconclusive",
    action: "create_issue",
    target_id: "knowledge/a.md",
    summary: "Current sources do not address the observed behavior",
    finding: "The claim could not be confirmed or invalidated.",
    evidence_checked: "Checked the current official product documentation.",
    ...overrides,
  };
}

describe("validateAgenticVerificationOutput", () => {
  it("accepts exactly one noop or one revision-bound issue per target for every scope", () => {
    for (const [scope, candidate] of Object.entries(manifests)) {
      assert.doesNotThrow(() =>
        validateAgenticVerificationOutput(candidate, {
          errors: [],
          items: [{ type: "noop", message: "All targets are current." }],
        }),
      );
      assert.doesNotThrow(() =>
        validateAgenticVerificationOutput(candidate, {
          errors: [],
          items: candidate.targets.map((target) =>
            issue(target.id, scope as keyof typeof titlePrefixes),
          ),
        }),
      );
    }
  });

  it("fails incomplete or malformed terminal output", () => {
    for (const output of [
      { errors: [], items: [] },
      {
        errors: [],
        items: [
          {
            type: "report_incomplete",
            reason: "Authoritative source unavailable.",
          },
        ],
      },
      { errors: ["invalid safe output"], items: [] },
      {
        errors: [],
        items: [issue("knowledge/a.md"), { type: "noop", message: "Done." }],
      },
    ]) {
      assert.throws(
        () => validateAgenticVerificationOutput(manifest, output),
        /verification gate/u,
      );
    }
  });

  it("rejects duplicate, unknown, or unbound target issues", () => {
    const unknown = issue("knowledge/unknown.md");
    const unbound = issue("knowledge/a.md");
    unbound.body = "Update the claim without subject identity.";
    const expandedEffect = issue("knowledge/a.md");
    expandedEffect.labels = ["extra-label"];

    for (const items of [
      [issue("knowledge/a.md"), issue("knowledge/a.md")],
      [unknown],
      [unbound],
      [expandedEffect],
    ]) {
      assert.throws(
        () =>
          validateAgenticVerificationOutput(manifest, { errors: [], items }),
        /verification gate/u,
      );
    }
  });

  it("accepts mixed modification and per-finding inconclusive decisions", () => {
    assert.doesNotThrow(() =>
      validateAgenticVerificationOutput(manifest, {
        errors: [],
        items: [
          issue("knowledge/b.md"),
          inconclusive(),
          inconclusive({
            summary: "A second independent observation is not documented",
            finding: "A different claim remains inconclusive.",
          }),
        ],
      }),
    );
  });

  it("rejects duplicate or contradictory inconclusive decisions", () => {
    for (const items of [
      [inconclusive(), inconclusive()],
      [inconclusive({ target_id: "knowledge/unknown.md" })],
      [
        inconclusive({
          action: "create_issue",
          no_issue_reason: "matching_open_issue",
          issue_number: "42",
        }),
      ],
      [
        inconclusive({
          action: "do_not_create_issue",
          no_issue_reason: "ambiguous_history",
          issue_number: "42",
        }),
      ],
      [
        inconclusive({
          action: "do_not_create_issue",
          no_issue_reason: "trusted_collaborator_disposition",
          issue_number: "42",
        }),
      ],
      [
        inconclusive({
          action: "do_not_create_issue",
          no_issue_reason: "matching_open_issue",
          issue_number: "42",
          comment_id: "9001",
        }),
      ],
    ]) {
      assert.throws(
        () =>
          validateAgenticVerificationOutput(manifest, { errors: [], items }),
        /verification gate/u,
      );
    }
  });
});

describe("parseVerificationManifest", () => {
  it("authenticates every manifest scope, revision, and target shape", () => {
    for (const candidate of Object.values(manifests)) {
      assert.deepEqual(
        parseVerificationManifest(candidate, revision, candidate.scope),
        candidate,
      );
      assert.throws(
        () =>
          parseVerificationManifest(candidate, "b".repeat(40), candidate.scope),
        /verification gate/u,
      );
      assert.throws(
        () =>
          parseVerificationManifest(
            candidate,
            revision,
            candidate.scope === "time-sensitive-knowledge"
              ? "evergreen-knowledge"
              : "time-sensitive-knowledge",
          ),
        /verification gate/u,
      );
    }
    assert.throws(
      () =>
        parseVerificationManifest(
          { ...manifest, targets: [manifest.targets[0], manifest.targets[0]] },
          revision,
          manifest.scope,
        ),
      /verification gate/u,
    );
  });
});
