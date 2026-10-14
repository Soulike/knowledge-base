import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { VerificationManifest } from "./manifest.ts";
import { parseVerificationManifest } from "./manifest-validation.ts";

const revision = "a".repeat(40);
const targetCatalog = [
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
    files: ["skills/a/SKILL.md", "skills/a/references/detail.md"],
    id: "skills/a/SKILL.md",
    kind: "skill",
  },
  {
    files: ["references/agents/shared.md"],
    id: "references/agents/shared.md",
    kind: "shared-reference",
  },
] satisfies VerificationManifest["targetCatalog"];
const manifests = {
  "evergreen-knowledge": {
    revision,
    reviewTargetIds: ["knowledge/b.md"],
    scope: "evergreen-knowledge",
    targetCatalog,
  },
  "maintained-agent-content": {
    revision,
    reviewTargetIds: ["skills/a/SKILL.md", "references/agents/shared.md"],
    scope: "maintained-agent-content",
    targetCatalog,
  },
  "time-sensitive-knowledge": {
    revision,
    reviewTargetIds: ["knowledge/a.md"],
    scope: "time-sensitive-knowledge",
    targetCatalog,
  },
} satisfies Record<string, VerificationManifest>;

describe("parseVerificationManifest", () => {
  it("authenticates every manifest scope, revision, catalog, and review subset", () => {
    for (const candidate of Object.values(manifests)) {
      assert.deepEqual(
        parseVerificationManifest(candidate, revision, candidate.scope),
        candidate,
      );
      assert.throws(
        () =>
          parseVerificationManifest(candidate, "b".repeat(40), candidate.scope),
        /Content verification manifest/u,
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
        /Content verification manifest/u,
      );
    }
  });

  it("rejects duplicate catalog identities and an incomplete review subset", () => {
    const manifest = manifests["time-sensitive-knowledge"];
    assert.throws(
      () =>
        parseVerificationManifest(
          {
            ...manifest,
            targetCatalog: [
              manifest.targetCatalog[0],
              manifest.targetCatalog[0],
            ],
          },
          revision,
          manifest.scope,
        ),
      /Content verification manifest/u,
    );
    assert.throws(
      () =>
        parseVerificationManifest(
          { ...manifest, reviewTargetIds: ["knowledge/b.md"] },
          revision,
          manifest.scope,
        ),
      /Content verification manifest/u,
    );
  });
});
