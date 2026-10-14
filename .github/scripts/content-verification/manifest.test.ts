import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildVerificationManifest } from "./manifest.ts";

const catalog = `# Knowledge catalog

## Documents

| File Path | Knowledge Type | When to Read |
| --- | --- | --- |
| [knowledge/a.md](a.md) | time-sensitive | Read when checking A. |
| [knowledge/b.md](b.md) | evergreen | Read when checking B. |
`;

describe("buildVerificationManifest", () => {
  it("derives stable manifests for every scheduled verification scope", () => {
    const revision = "a".repeat(40);
    const tracked = [
      "AGENTS.md",
      ".agents/skills/check/SKILL.md",
      ".agents/skills/check/references/detail.md",
      "knowledge-base/plugin/knowledge/b.md",
      "knowledge-base/plugin/knowledge/a.md",
      "knowledge-base/plugin/knowledge/index.md",
    ];

    assert.deepEqual(
      buildVerificationManifest(
        "time-sensitive-knowledge",
        revision,
        tracked,
        catalog,
      ),
      {
        revision,
        reviewTargetIds: ["knowledge-base/plugin/knowledge/a.md"],
        scope: "time-sensitive-knowledge",
        targetCatalog: [
          {
            files: [
              ".agents/skills/check/SKILL.md",
              ".agents/skills/check/references/detail.md",
            ],
            id: ".agents/skills/check/SKILL.md",
            kind: "skill",
          },
          { files: ["AGENTS.md"], id: "AGENTS.md", kind: "agent-content" },
          {
            files: ["knowledge-base/plugin/knowledge/a.md"],
            id: "knowledge-base/plugin/knowledge/a.md",
            kind: "knowledge",
            knowledgeType: "time-sensitive",
          },
          {
            files: ["knowledge-base/plugin/knowledge/b.md"],
            id: "knowledge-base/plugin/knowledge/b.md",
            kind: "knowledge",
            knowledgeType: "evergreen",
          },
        ],
      },
    );
    assert.deepEqual(
      buildVerificationManifest(
        "evergreen-knowledge",
        revision,
        tracked,
        catalog,
      ),
      {
        revision,
        reviewTargetIds: ["knowledge-base/plugin/knowledge/b.md"],
        scope: "evergreen-knowledge",
        targetCatalog: [
          {
            files: [
              ".agents/skills/check/SKILL.md",
              ".agents/skills/check/references/detail.md",
            ],
            id: ".agents/skills/check/SKILL.md",
            kind: "skill",
          },
          { files: ["AGENTS.md"], id: "AGENTS.md", kind: "agent-content" },
          {
            files: ["knowledge-base/plugin/knowledge/a.md"],
            id: "knowledge-base/plugin/knowledge/a.md",
            kind: "knowledge",
            knowledgeType: "time-sensitive",
          },
          {
            files: ["knowledge-base/plugin/knowledge/b.md"],
            id: "knowledge-base/plugin/knowledge/b.md",
            kind: "knowledge",
            knowledgeType: "evergreen",
          },
        ],
      },
    );
    assert.deepEqual(
      buildVerificationManifest(
        "maintained-agent-content",
        revision,
        tracked,
        catalog,
      ),
      {
        revision,
        reviewTargetIds: [".agents/skills/check/SKILL.md", "AGENTS.md"],
        scope: "maintained-agent-content",
        targetCatalog: [
          {
            files: [
              ".agents/skills/check/SKILL.md",
              ".agents/skills/check/references/detail.md",
            ],
            id: ".agents/skills/check/SKILL.md",
            kind: "skill",
          },
          { files: ["AGENTS.md"], id: "AGENTS.md", kind: "agent-content" },
          {
            files: ["knowledge-base/plugin/knowledge/a.md"],
            id: "knowledge-base/plugin/knowledge/a.md",
            kind: "knowledge",
            knowledgeType: "time-sensitive",
          },
          {
            files: ["knowledge-base/plugin/knowledge/b.md"],
            id: "knowledge-base/plugin/knowledge/b.md",
            kind: "knowledge",
            knowledgeType: "evergreen",
          },
        ],
      },
    );
  });

  it("rejects a mutable revision instead of publishing an ambiguous manifest", () => {
    assert.throws(
      () =>
        buildVerificationManifest(
          "time-sensitive-knowledge",
          "main",
          [
            "knowledge-base/plugin/knowledge/index.md",
            "knowledge-base/plugin/knowledge/a.md",
            "knowledge-base/plugin/knowledge/b.md",
          ],
          catalog,
        ),
      /lowercase 40-character Git SHA/u,
    );
  });
});
