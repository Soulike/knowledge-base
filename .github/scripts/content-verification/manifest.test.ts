import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildVerificationManifest } from "./manifest.ts";

const index = `# Knowledge index

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
      "knowledge/b.md",
      "knowledge/a.md",
      "knowledge/index.md",
    ];

    assert.deepEqual(
      buildVerificationManifest(
        "time-sensitive-knowledge",
        revision,
        tracked,
        index,
      ),
      {
        revision,
        reviewTargetIds: ["knowledge/a.md"],
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
        ],
      },
    );
    assert.deepEqual(
      buildVerificationManifest(
        "evergreen-knowledge",
        revision,
        tracked,
        index,
      ),
      {
        revision,
        reviewTargetIds: ["knowledge/b.md"],
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
        ],
      },
    );
    assert.deepEqual(
      buildVerificationManifest(
        "maintained-agent-content",
        revision,
        tracked,
        index,
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
          ["knowledge/index.md", "knowledge/a.md", "knowledge/b.md"],
          index,
        ),
      /lowercase 40-character Git SHA/u,
    );
  });
});
