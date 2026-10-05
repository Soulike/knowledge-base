import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { discoverVerificationTargets } from "./targets.ts";

const index = `# Knowledge index

## Documents

| File Path | Knowledge Type | When to Read |
| --- | --- | --- |
| [knowledge/a.md](a.md) | time-sensitive | Read when checking A. |
| [knowledge/b.md](b.md) | evergreen | Read when checking B. |
`;

describe("discoverVerificationTargets", () => {
  it("selects Knowledge through the parsed index type", () => {
    const tracked = [
      "plugins/knowledge-base/knowledge/index.md",
      "plugins/knowledge-base/knowledge/a.md",
      "plugins/knowledge-base/knowledge/b.md",
    ];

    assert.deepEqual(
      discoverVerificationTargets("time-sensitive-knowledge", tracked, index),
      [
        {
          files: ["plugins/knowledge-base/knowledge/a.md"],
          id: "plugins/knowledge-base/knowledge/a.md",
          kind: "knowledge",
          knowledgeType: "time-sensitive",
        },
      ],
    );
    assert.deepEqual(
      discoverVerificationTargets("evergreen-knowledge", tracked, index),
      [
        {
          files: ["plugins/knowledge-base/knowledge/b.md"],
          id: "plugins/knowledge-base/knowledge/b.md",
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
      ".github/scripts/ai-review/prompts/review.md",
      ".github/scripts/ai-review/prompts/skills.md",
      ".github/workflows/README.md",
      ".github/workflows/verify-maintained-agent-content.md",
      ".github/workflows/shared/content-verification.md",
      ".github/workflows/shared/agentic-runtime.md",
      "AGENTS.md",
      "GLOSSARY.md",
      "docs/agents/domain.md",
      "plugins/knowledge-base/knowledge/a.md",
      "plugins/knowledge-base/knowledge/b.md",
      "plugins/knowledge-base/knowledge/index.md",
      "plugins/example/references/plugin.md",
      "plugins/example/skills/check/assets/example.json",
      "plugins/example/skills/check/SKILL.md",
      "plugins/knowledge-base/references/shared.md",
      "plugins/knowledge-base/skills/root/SKILL.md",
    ];

    assert.deepEqual(
      discoverVerificationTargets("maintained-agent-content", tracked, index),
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
          files: ["plugins/example/references/plugin.md"],
          id: "plugins/example/references/plugin.md",
          kind: "shared-reference",
        },
        {
          files: [
            "plugins/example/skills/check/SKILL.md",
            "plugins/example/skills/check/assets/example.json",
          ],
          id: "plugins/example/skills/check/SKILL.md",
          kind: "skill",
        },
        {
          files: ["plugins/knowledge-base/references/shared.md"],
          id: "plugins/knowledge-base/references/shared.md",
          kind: "shared-reference",
        },
        {
          files: ["plugins/knowledge-base/skills/root/SKILL.md"],
          id: "plugins/knowledge-base/skills/root/SKILL.md",
          kind: "skill",
        },
      ],
    );
  });

  it("fails when the parsed index and tracked Knowledge differ", () => {
    assert.throws(
      () =>
        discoverVerificationTargets(
          "evergreen-knowledge",
          [
            "plugins/knowledge-base/knowledge/index.md",
            "plugins/knowledge-base/knowledge/a.md",
            "plugins/knowledge-base/knowledge/c.md",
          ],
          index,
        ),
      new Error(
        "Cannot select Knowledge from an invalid index:\n" +
          "The index lists 'knowledge/b.md', but that leaf document does not exist.\n" +
          "Knowledge leaf 'knowledge/c.md' must be listed exactly once in the index.",
      ),
    );
  });

  it("keeps repository and plugin domain instructions in verification", () => {
    const instructions = [
      "GLOSSARY-MAP.md",
      "plugins/knowledge-base/AGENTS.md",
      "plugins/knowledge-base/docs/agents/domain.md",
      "plugins/knowledge-base/GLOSSARY.md",
    ];
    const targets = discoverVerificationTargets(
      "maintained-agent-content",
      [
        ...instructions,
        "plugins/knowledge-base/knowledge/index.md",
        "plugins/knowledge-base/knowledge/a.md",
        "plugins/knowledge-base/knowledge/b.md",
      ],
      index,
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
});
