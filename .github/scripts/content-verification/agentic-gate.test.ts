import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  parseVerificationManifest,
  validateAgenticVerificationOutput,
} from "./agentic-gate.ts";
import type { VerificationManifest } from "./manifest.ts";

const revision = "a".repeat(40);
const manifest: VerificationManifest = {
  revision,
  scope: "time-sensitive-knowledge",
  targets: [
    { files: ["knowledge/a.md"], id: "knowledge/a.md", kind: "knowledge" },
    { files: ["knowledge/b.md"], id: "knowledge/b.md", kind: "knowledge" },
  ],
};

function issue(target: string): Record<string, unknown> {
  return {
    type: "create_issue",
    title: `[time-sensitive Knowledge] ${target}`,
    body: `Target: ${target}\n\nRevision: ${revision}\n\nUpdate the claim.`,
  };
}

describe("validateAgenticVerificationOutput", () => {
  it("accepts exactly one noop or one revision-bound issue per target", () => {
    assert.doesNotThrow(() =>
      validateAgenticVerificationOutput(manifest, {
        errors: [],
        items: [{ type: "noop", message: "All targets are current." }],
      }),
    );
    assert.doesNotThrow(() =>
      validateAgenticVerificationOutput(manifest, {
        errors: [],
        items: [issue("knowledge/a.md"), issue("knowledge/b.md")],
      }),
    );
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
});

describe("parseVerificationManifest", () => {
  it("authenticates the manifest revision and target shape", () => {
    assert.deepEqual(parseVerificationManifest(manifest, revision), manifest);
    assert.throws(
      () => parseVerificationManifest(manifest, "b".repeat(40)),
      /verification gate/u,
    );
    assert.throws(
      () =>
        parseVerificationManifest(
          { ...manifest, targets: [manifest.targets[0], manifest.targets[0]] },
          revision,
        ),
      /verification gate/u,
    );
  });
});
