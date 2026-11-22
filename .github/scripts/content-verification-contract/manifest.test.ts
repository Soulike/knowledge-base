import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createVerificationManifest } from "./manifest.ts";
import { parseVerificationManifest } from "./manifest-validation.ts";

const catalog = `# Knowledge catalog

## Documents

| File Path | Knowledge Type |
| --- | --- |
| [knowledge/a.md](a.md) | time-sensitive |
| [knowledge/b.md](b.md) | evergreen |
`;

describe("createVerificationManifest", () => {
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
      createVerificationManifest({
        scope: "time-sensitive-knowledge",
        revision,
        trackedPaths: tracked,
        catalogMarkdown: catalog,
      }),
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
      createVerificationManifest({
        scope: "evergreen-knowledge",
        revision,
        trackedPaths: tracked,
        catalogMarkdown: catalog,
      }),
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
      createVerificationManifest({
        scope: "maintained-agent-content",
        revision,
        trackedPaths: tracked,
        catalogMarkdown: catalog,
      }),
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
        createVerificationManifest({
          scope: "time-sensitive-knowledge",
          revision: "main",
          trackedPaths: [
            "knowledge-base/plugin/knowledge/index.md",
            "knowledge-base/plugin/knowledge/a.md",
            "knowledge-base/plugin/knowledge/b.md",
          ],
          catalogMarkdown: catalog,
        }),
      /lowercase 40-character Git SHA/u,
    );
  });

  it("derives valid multi-plugin manifests across every scope", () => {
    const revision = "b".repeat(40);
    const secondCatalog = `# Knowledge catalog

## Documents

| File Path | Knowledge Type |
| --- | --- |
| [knowledge/c.md](c.md) | evergreen |
| [knowledge/d.md](d.md) | time-sensitive |
`;
    const tracked = [
      "knowledge-base/plugins/knowledge-base/knowledge/index.md",
      "knowledge-base/plugins/knowledge-base/knowledge/a.md",
      "knowledge-base/plugins/knowledge-base/knowledge/b.md",
      "knowledge-base/plugins/knowledge-base/references/shared.md",
      "knowledge-base/plugins/knowledge-base/skills/handbook-base/SKILL.md",
      "knowledge-base/plugins/codex/knowledge/index.md",
      "knowledge-base/plugins/codex/knowledge/c.md",
      "knowledge-base/plugins/codex/knowledge/d.md",
      "knowledge-base/plugins/codex/references/codex.md",
      "knowledge-base/plugins/codex/skills/handbook-codex/SKILL.md",
    ];
    const catalogs = {
      "knowledge-base/plugins/knowledge-base/knowledge/index.md": catalog,
      "knowledge-base/plugins/codex/knowledge/index.md": secondCatalog,
    };

    const timeSensitive = createVerificationManifest({
      scope: "time-sensitive-knowledge",
      revision,
      trackedPaths: tracked,
      catalogs,
    });
    assert.deepEqual(timeSensitive.reviewTargetIds, [
      "knowledge-base/plugins/codex/knowledge/d.md",
      "knowledge-base/plugins/knowledge-base/knowledge/a.md",
    ]);
    assert.deepEqual(
      parseVerificationManifest(
        timeSensitive,
        revision,
        "time-sensitive-knowledge",
      ),
      timeSensitive,
    );

    const evergreen = createVerificationManifest({
      scope: "evergreen-knowledge",
      revision,
      trackedPaths: tracked,
      catalogs,
    });
    assert.deepEqual(evergreen.reviewTargetIds, [
      "knowledge-base/plugins/codex/knowledge/c.md",
      "knowledge-base/plugins/knowledge-base/knowledge/b.md",
    ]);
    assert.deepEqual(
      parseVerificationManifest(evergreen, revision, "evergreen-knowledge"),
      evergreen,
    );

    const maintained = createVerificationManifest({
      scope: "maintained-agent-content",
      revision,
      trackedPaths: tracked,
      catalogs,
    });
    assert.deepEqual(maintained.reviewTargetIds, [
      "knowledge-base/plugins/codex/references/codex.md",
      "knowledge-base/plugins/codex/skills/handbook-codex/SKILL.md",
      "knowledge-base/plugins/knowledge-base/references/shared.md",
      "knowledge-base/plugins/knowledge-base/skills/handbook-base/SKILL.md",
    ]);
    assert.deepEqual(
      parseVerificationManifest(
        maintained,
        revision,
        "maintained-agent-content",
      ),
      maintained,
    );
  });
});
