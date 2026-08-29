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
    const tracked = ["knowledge/index.md", "knowledge/a.md", "knowledge/b.md"];

    assert.deepEqual(
      discoverVerificationTargets("time-sensitive-knowledge", tracked, index),
      [{ files: ["knowledge/a.md"], id: "knowledge/a.md", kind: "knowledge" }],
    );
    assert.deepEqual(
      discoverVerificationTargets("evergreen-knowledge", tracked, index),
      [{ files: ["knowledge/b.md"], id: "knowledge/b.md", kind: "knowledge" }],
    );
  });

  it("bundles Skills, prompts, instructions, and shared references once", () => {
    const tracked = [
      ".agents/references/authoring.md",
      ".agents/skills/add/references/local.md",
      ".agents/skills/add/SKILL.md",
      ".github/scripts/ai-review/prompts/review.md",
      ".github/scripts/ai-review/prompts/skills.md",
      "AGENTS.md",
      "plugins/example/references/plugin.md",
      "plugins/example/skills/check/assets/example.json",
      "plugins/example/skills/check/SKILL.md",
      "references/shared.md",
      "skills/root/SKILL.md",
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
          files: ["AGENTS.md"],
          id: "AGENTS.md",
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
          files: ["references/shared.md"],
          id: "references/shared.md",
          kind: "shared-reference",
        },
        {
          files: ["skills/root/SKILL.md"],
          id: "skills/root/SKILL.md",
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
          ["knowledge/index.md", "knowledge/a.md", "knowledge/c.md"],
          index,
        ),
      new Error(
        "Cannot select Knowledge from an invalid index:\n" +
          "The index lists 'knowledge/b.md', but that leaf document does not exist.\n" +
          "Knowledge leaf 'knowledge/c.md' must be listed exactly once in the index.",
      ),
    );
  });
});
