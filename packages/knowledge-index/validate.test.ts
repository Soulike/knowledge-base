import assert from "node:assert/strict";
import test from "node:test";

import { KnowledgeIndexError, validateKnowledgeIndex } from "./index.ts";

function indexWithRows(rows: string): string {
  return `# Knowledge index

## Scope

This index lists Knowledge.

## When to update

Update this index when Knowledge changes.

## Documents

| File Path | Knowledge Type | When to Read |
| --- | --- | --- |
${rows}`;
}

const validIndex =
  indexWithRows(`| [knowledge/agents/model.md](agents/model.md) | evergreen | Read when modeling Agents. |
| [knowledge/provider/config.md](provider/config.md) | time-sensitive | Read when configuring a provider. |
`);

test("returns entries when the index matches the available Knowledge files", () => {
  assert.deepEqual(
    validateKnowledgeIndex(validIndex, [
      "agents/model.md",
      "provider/config.md",
    ]),
    [
      {
        filePath: "agents/model.md",
        knowledgeType: "evergreen",
        whenToRead: "Read when modeling Agents.",
      },
      {
        filePath: "provider/config.md",
        knowledgeType: "time-sensitive",
        whenToRead: "Read when configuring a provider.",
      },
    ],
  );
});

test("rejects index and file inventory mismatches in both directions", () => {
  assert.throws(
    () =>
      validateKnowledgeIndex(validIndex, ["agents/model.md", "security.md"]),
    (error: unknown) => {
      assert.ok(error instanceof KnowledgeIndexError);
      assert.deepEqual(error.diagnostics, [
        "The index lists 'knowledge/provider/config.md', but that leaf document does not exist.",
        "Knowledge leaf 'knowledge/security.md' must be listed exactly once in the index.",
      ]);
      return true;
    },
  );
});

test("reports row, duplicate, and inventory diagnostics together", () => {
  const invalidIndex =
    indexWithRows(`| [knowledge/agents/model.md](agents/model.md) | evergreen | Read when modeling Agents. |
| [knowledge/agents/model.md](agents/model.md) | evergreen | Read when modeling Agents. |
| [knowledge/missing.md](missing.md) | static | Read when reading missing Knowledge. |
`);

  assert.throws(
    () =>
      validateKnowledgeIndex(invalidIndex, [
        "agents/model.md",
        "security/auth.md",
      ]),
    (error: unknown) => {
      assert.ok(error instanceof KnowledgeIndexError);
      assert.deepEqual(error.diagnostics, [
        "Knowledge Type for 'knowledge/missing.md' must be 'time-sensitive' or 'evergreen'.",
        "Knowledge document 'knowledge/agents/model.md' must be listed exactly once, but it appears 2 times.",
        "The index lists 'knowledge/missing.md', but that leaf document does not exist.",
        "Knowledge leaf 'knowledge/security/auth.md' must be listed exactly once in the index.",
      ]);
      return true;
    },
  );
});
