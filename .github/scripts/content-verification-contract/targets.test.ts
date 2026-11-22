import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { discoverVerificationTargets } from "./targets.ts";

const catalog = `# Knowledge catalog

## Documents

| File Path | Knowledge Type |
| --- | --- |
| [knowledge/a.md](a.md) | time-sensitive |
| [knowledge/b.md](b.md) | evergreen |
`;

describe("discoverVerificationTargets", () => {
  it("selects Knowledge through the validated catalog type", () => {
    const tracked = [
      "knowledge-base/plugins/knowledge-base/knowledge/index.md",
      "knowledge-base/plugins/knowledge-base/knowledge/a.md",
      "knowledge-base/plugins/knowledge-base/knowledge/b.md",
    ];
    const catalogs = {
      "knowledge-base/plugins/knowledge-base/knowledge/index.md": catalog,
    };

    assert.deepEqual(
      discoverVerificationTargets(
        "time-sensitive-knowledge",
        tracked,
        catalogs,
      ),
      [
        {
          files: ["knowledge-base/plugins/knowledge-base/knowledge/a.md"],
          id: "knowledge-base/plugins/knowledge-base/knowledge/a.md",
          kind: "knowledge",
          knowledgeType: "time-sensitive",
        },
      ],
    );
    assert.deepEqual(
      discoverVerificationTargets("evergreen-knowledge", tracked, catalogs),
      [
        {
          files: ["knowledge-base/plugins/knowledge-base/knowledge/b.md"],
          id: "knowledge-base/plugins/knowledge-base/knowledge/b.md",
          kind: "knowledge",
          knowledgeType: "evergreen",
        },
      ],
    );
  });

  it("bundles Skills, prompts, instructions, and shared references once", () => {
    const tracked = [
      ".agents/references/authoring.md",
      ".agents/skills/add/references/local.md",
      ".agents/skills/add/SKILL.md",
      ".agents/skills/add/tests/local/case.md",
      ".github/scripts/ai-review/prompts/review.md",
      ".github/scripts/ai-review/prompts/skills.md",
      ".github/workflows/README.md",
      ".github/workflows/verify-maintained-agent-content.md",
      ".github/workflows/shared/content-verification.md",
      ".github/workflows/shared/agentic-runtime.md",
      "AGENTS.md",
      "GLOSSARY.md",
      "docs/agents/domain.md",
      "knowledge-base/plugins/knowledge-base/knowledge/a.md",
      "knowledge-base/plugins/knowledge-base/knowledge/b.md",
      "knowledge-base/plugins/knowledge-base/knowledge/index.md",
      "knowledge-base/plugins/example/references/plugin.md",
      "knowledge-base/plugins/example/skills/check/assets/example.json",
      "knowledge-base/plugins/example/skills/check/SKILL.md",
      "knowledge-base/plugins/example/skills/check/tests/local/case.md",
      "knowledge-base/plugins/knowledge-base/references/shared.md",
      "knowledge-base/plugins/knowledge-base/skills/root/SKILL.md",
      "knowledge-base/plugins/knowledge-base/skills/root/tests/local/case.md",
    ];

    assert.deepEqual(
      discoverVerificationTargets("maintained-agent-content", tracked, {
        "knowledge-base/plugins/knowledge-base/knowledge/index.md": catalog,
      }),
      [
        {
          files: [".agents/references/authoring.md"],
          id: ".agents/references/authoring.md",
          kind: "shared-reference",
        },
        {
          files: [
            ".agents/skills/add/SKILL.md",
            ".agents/skills/add/references/local.md",
          ],
          id: ".agents/skills/add/SKILL.md",
          kind: "skill",
        },
        {
          files: [
            ".github/scripts/ai-review/prompts/review.md",
            ".github/scripts/ai-review/prompts/skills.md",
          ],
          id: ".github/scripts/ai-review/prompts",
          kind: "agent-content",
        },
        {
          files: [".github/workflows/shared/agentic-runtime.md"],
          id: ".github/workflows/shared/agentic-runtime.md",
          kind: "shared-reference",
        },
        {
          files: [".github/workflows/shared/content-verification.md"],
          id: ".github/workflows/shared/content-verification.md",
          kind: "shared-reference",
        },
        {
          files: [".github/workflows/verify-maintained-agent-content.md"],
          id: ".github/workflows/verify-maintained-agent-content.md",
          kind: "agent-content",
        },
        {
          files: ["AGENTS.md"],
          id: "AGENTS.md",
          kind: "agent-content",
        },
        {
          files: ["docs/agents/domain.md"],
          id: "docs/agents/domain.md",
          kind: "agent-content",
        },
        {
          files: ["GLOSSARY.md"],
          id: "GLOSSARY.md",
          kind: "agent-content",
        },
        {
          files: ["knowledge-base/plugins/example/references/plugin.md"],
          id: "knowledge-base/plugins/example/references/plugin.md",
          kind: "shared-reference",
        },
        {
          files: [
            "knowledge-base/plugins/example/skills/check/SKILL.md",
            "knowledge-base/plugins/example/skills/check/assets/example.json",
          ],
          id: "knowledge-base/plugins/example/skills/check/SKILL.md",
          kind: "skill",
        },
        {
          files: ["knowledge-base/plugins/knowledge-base/references/shared.md"],
          id: "knowledge-base/plugins/knowledge-base/references/shared.md",
          kind: "shared-reference",
        },
        {
          files: ["knowledge-base/plugins/knowledge-base/skills/root/SKILL.md"],
          id: "knowledge-base/plugins/knowledge-base/skills/root/SKILL.md",
          kind: "skill",
        },
      ],
    );
  });

  it("ignores legacy knowledge-base/plugin and root plugins directories", () => {
    const tracked = [
      "knowledge-base/plugins/knowledge-base/knowledge/index.md",
      "knowledge-base/plugins/knowledge-base/knowledge/a.md",
      "knowledge-base/plugins/knowledge-base/knowledge/b.md",
      "knowledge-base/plugin/knowledge/index.md",
      "knowledge-base/plugin/knowledge/legacy.md",
      "knowledge-base/plugin/references/legacy.md",
      "plugins/legacy/references/shared.md",
      "plugins/legacy/GLOSSARY.md",
      "plugins/legacy/docs/agents/domain.md",
    ];
    const catalogs = {
      "knowledge-base/plugins/knowledge-base/knowledge/index.md": catalog,
    };

    assert.deepEqual(
      discoverVerificationTargets("evergreen-knowledge", tracked, catalogs),
      [
        {
          files: ["knowledge-base/plugins/knowledge-base/knowledge/b.md"],
          id: "knowledge-base/plugins/knowledge-base/knowledge/b.md",
          kind: "knowledge",
          knowledgeType: "evergreen",
        },
      ],
    );
    assert.throws(
      () =>
        discoverVerificationTargets(
          "maintained-agent-content",
          tracked,
          catalogs,
        ),
      /did not discover any targets/u,
    );
    assert.throws(
      () =>
        discoverVerificationTargets("evergreen-knowledge", tracked, {
          ...catalogs,
          "knowledge-base/plugin/knowledge/index.md": catalog,
        }),
      /Invalid Knowledge catalog path 'knowledge-base\/plugin\/knowledge\/index\.md'/u,
    );
  });

  it("fails when the validated catalog and tracked Knowledge differ", () => {
    assert.throws(
      () =>
        discoverVerificationTargets(
          "evergreen-knowledge",
          [
            "knowledge-base/plugins/knowledge-base/knowledge/index.md",
            "knowledge-base/plugins/knowledge-base/knowledge/a.md",
            "knowledge-base/plugins/knowledge-base/knowledge/c.md",
          ],
          {
            "knowledge-base/plugins/knowledge-base/knowledge/index.md": catalog,
          },
        ),
      new Error(
        "Cannot select Knowledge from invalid catalog 'knowledge-base/plugins/knowledge-base/knowledge/index.md':\n" +
          "The catalog lists 'knowledge/b.md', but that leaf document does not exist.\n" +
          "Knowledge leaf 'knowledge/c.md' must be listed exactly once in the catalog.",
      ),
    );
  });

  it("keeps repository and plugin domain instructions in verification", () => {
    const instructions = [
      "GLOSSARY-MAP.md",
      "knowledge-base/AGENTS.md",
      "knowledge-base/docs/agents/domain.md",
      "knowledge-base/GLOSSARY.md",
    ];
    const targets = discoverVerificationTargets(
      "maintained-agent-content",
      [
        ...instructions,
        "knowledge-base/plugins/knowledge-base/knowledge/index.md",
        "knowledge-base/plugins/knowledge-base/knowledge/a.md",
        "knowledge-base/plugins/knowledge-base/knowledge/b.md",
      ],
      {
        "knowledge-base/plugins/knowledge-base/knowledge/index.md": catalog,
      },
    );
    assert.deepEqual(
      targets,
      instructions.map((id) => ({
        files: [id],
        id,
        kind: "agent-content",
      })),
    );
  });

  it("discovers Knowledge targets across multiple isomorphic plugins", () => {
    const codexCatalog = `# Knowledge catalog

## Documents

| File Path | Knowledge Type |
| --- | --- |
| [knowledge/a.md](a.md) | evergreen |
| [knowledge/guide.md](guide.md) | time-sensitive |
`;
    const chromiumCatalog = `# Knowledge catalog

## Documents

| File Path | Knowledge Type |
| --- | --- |
| [knowledge/ios.md](ios.md) | evergreen |
`;
    const tracked = [
      "knowledge-base/plugins/knowledge-base/knowledge/index.md",
      "knowledge-base/plugins/knowledge-base/knowledge/a.md",
      "knowledge-base/plugins/knowledge-base/knowledge/b.md",
      "knowledge-base/plugins/codex/knowledge/index.md",
      "knowledge-base/plugins/codex/knowledge/a.md",
      "knowledge-base/plugins/codex/knowledge/guide.md",
      "knowledge-base/plugins/chromium/knowledge/index.md",
      "knowledge-base/plugins/chromium/knowledge/ios.md",
    ];
    const catalogs = {
      "knowledge-base/plugins/knowledge-base/knowledge/index.md": catalog,
      "knowledge-base/plugins/codex/knowledge/index.md": codexCatalog,
      "knowledge-base/plugins/chromium/knowledge/index.md": chromiumCatalog,
    };

    assert.deepEqual(
      discoverVerificationTargets(
        "time-sensitive-knowledge",
        tracked,
        catalogs,
      ),
      [
        {
          files: ["knowledge-base/plugins/codex/knowledge/guide.md"],
          id: "knowledge-base/plugins/codex/knowledge/guide.md",
          kind: "knowledge",
          knowledgeType: "time-sensitive",
        },
        {
          files: ["knowledge-base/plugins/knowledge-base/knowledge/a.md"],
          id: "knowledge-base/plugins/knowledge-base/knowledge/a.md",
          kind: "knowledge",
          knowledgeType: "time-sensitive",
        },
      ],
    );
    assert.deepEqual(
      discoverVerificationTargets("evergreen-knowledge", tracked, catalogs),
      [
        {
          files: ["knowledge-base/plugins/chromium/knowledge/ios.md"],
          id: "knowledge-base/plugins/chromium/knowledge/ios.md",
          kind: "knowledge",
          knowledgeType: "evergreen",
        },
        {
          files: ["knowledge-base/plugins/codex/knowledge/a.md"],
          id: "knowledge-base/plugins/codex/knowledge/a.md",
          kind: "knowledge",
          knowledgeType: "evergreen",
        },
        {
          files: ["knowledge-base/plugins/knowledge-base/knowledge/b.md"],
          id: "knowledge-base/plugins/knowledge-base/knowledge/b.md",
          kind: "knowledge",
          knowledgeType: "evergreen",
        },
      ],
    );
  });

  it("discovers Skills, shared references, and instructions across isomorphic plugins", () => {
    const tracked = [
      "knowledge-base/plugins/knowledge-base/knowledge/index.md",
      "knowledge-base/plugins/knowledge-base/knowledge/a.md",
      "knowledge-base/plugins/knowledge-base/AGENTS.md",
      "knowledge-base/plugins/knowledge-base/GLOSSARY.md",
      "knowledge-base/plugins/knowledge-base/GLOSSARY-MAP.md",
      "knowledge-base/plugins/knowledge-base/docs/agents/domain.md",
      "knowledge-base/plugins/knowledge-base/references/agents/skill-authoring.md",
      "knowledge-base/plugins/knowledge-base/skills/handbook-collaboration/SKILL.md",
      "knowledge-base/plugins/knowledge-base/skills/handbook-collaboration/tests/case.md",
      "knowledge-base/plugins/generative-media/knowledge/index.md",
      "knowledge-base/plugins/generative-media/knowledge/a.md",
      "knowledge-base/plugins/generative-media/references/still-image-prompt-contract.md",
      "knowledge-base/plugins/generative-media/skills/workflow-design-image-generation-prompts/SKILL.md",
      "knowledge-base/plugins/generative-media/skills/workflow-design-image-generation-prompts/references/local.md",
    ];
    const singleLeafCatalog = `# Knowledge catalog

## Documents

| File Path | Knowledge Type |
| --- | --- |
| [knowledge/a.md](a.md) | evergreen |
`;
    const catalogs = {
      "knowledge-base/plugins/knowledge-base/knowledge/index.md":
        singleLeafCatalog,
      "knowledge-base/plugins/generative-media/knowledge/index.md":
        singleLeafCatalog,
    };

    assert.deepEqual(
      discoverVerificationTargets(
        "maintained-agent-content",
        tracked,
        catalogs,
      ),
      [
        {
          files: [
            "knowledge-base/plugins/generative-media/references/still-image-prompt-contract.md",
          ],
          id: "knowledge-base/plugins/generative-media/references/still-image-prompt-contract.md",
          kind: "shared-reference",
        },
        {
          files: [
            "knowledge-base/plugins/generative-media/skills/workflow-design-image-generation-prompts/SKILL.md",
            "knowledge-base/plugins/generative-media/skills/workflow-design-image-generation-prompts/references/local.md",
          ],
          id: "knowledge-base/plugins/generative-media/skills/workflow-design-image-generation-prompts/SKILL.md",
          kind: "skill",
        },
        {
          files: ["knowledge-base/plugins/knowledge-base/AGENTS.md"],
          id: "knowledge-base/plugins/knowledge-base/AGENTS.md",
          kind: "agent-content",
        },
        {
          files: [
            "knowledge-base/plugins/knowledge-base/docs/agents/domain.md",
          ],
          id: "knowledge-base/plugins/knowledge-base/docs/agents/domain.md",
          kind: "agent-content",
        },
        {
          files: ["knowledge-base/plugins/knowledge-base/GLOSSARY-MAP.md"],
          id: "knowledge-base/plugins/knowledge-base/GLOSSARY-MAP.md",
          kind: "agent-content",
        },
        {
          files: ["knowledge-base/plugins/knowledge-base/GLOSSARY.md"],
          id: "knowledge-base/plugins/knowledge-base/GLOSSARY.md",
          kind: "agent-content",
        },
        {
          files: [
            "knowledge-base/plugins/knowledge-base/references/agents/skill-authoring.md",
          ],
          id: "knowledge-base/plugins/knowledge-base/references/agents/skill-authoring.md",
          kind: "shared-reference",
        },
        {
          files: [
            "knowledge-base/plugins/knowledge-base/skills/handbook-collaboration/SKILL.md",
          ],
          id: "knowledge-base/plugins/knowledge-base/skills/handbook-collaboration/SKILL.md",
          kind: "skill",
        },
      ],
    );
  });

  it("fails deterministically on catalog-versus-filesystem mismatches in any plugin", () => {
    const validCatalog = `# Knowledge catalog

## Documents

| File Path | Knowledge Type |
| --- | --- |
| [knowledge/a.md](a.md) | evergreen |
`;

    assert.throws(
      () =>
        discoverVerificationTargets(
          "evergreen-knowledge",
          [
            "knowledge-base/plugins/alpha/knowledge/index.md",
            "knowledge-base/plugins/alpha/knowledge/a.md",
            "knowledge-base/plugins/beta/knowledge/index.md",
            "knowledge-base/plugins/beta/knowledge/extra.md",
          ],
          {
            "knowledge-base/plugins/alpha/knowledge/index.md": validCatalog,
            "knowledge-base/plugins/beta/knowledge/index.md": validCatalog,
          },
        ),
      /Cannot select Knowledge from invalid catalog 'knowledge-base\/plugins\/beta\/knowledge\/index\.md':/u,
    );

    assert.throws(
      () =>
        discoverVerificationTargets(
          "evergreen-knowledge",
          [
            "knowledge-base/plugins/alpha/knowledge/index.md",
            "knowledge-base/plugins/alpha/knowledge/a.md",
            "knowledge-base/plugins/beta/knowledge/orphan.md",
          ],
          {
            "knowledge-base/plugins/alpha/knowledge/index.md": validCatalog,
          },
        ),
      /Knowledge directory 'knowledge-base\/plugins\/beta\/knowledge' is missing its Knowledge catalog/u,
    );

    assert.throws(
      () =>
        discoverVerificationTargets(
          "evergreen-knowledge",
          [
            "knowledge-base/plugins/alpha/knowledge/index.md",
            "knowledge-base/plugins/alpha/knowledge/a.md",
            "knowledge-base/plugins/beta/knowledge/index.md",
            "knowledge-base/plugins/beta/knowledge/a.md",
          ],
          {
            "knowledge-base/plugins/alpha/knowledge/index.md": validCatalog,
          },
        ),
      /Missing Knowledge catalog content for 'knowledge-base\/plugins\/beta\/knowledge\/index\.md'/u,
    );

    assert.throws(
      () =>
        discoverVerificationTargets(
          "evergreen-knowledge",
          [
            "knowledge-base/plugins/alpha/knowledge/index.md",
            "knowledge-base/plugins/alpha/knowledge/a.md",
          ],
          {
            "knowledge-base/plugins/alpha/knowledge/index.md": validCatalog,
            "knowledge-base/plugins/beta/knowledge/index.md": validCatalog,
          },
        ),
      /Knowledge catalog 'knowledge-base\/plugins\/beta\/knowledge\/index\.md' is not present in tracked files/u,
    );
  });
});
