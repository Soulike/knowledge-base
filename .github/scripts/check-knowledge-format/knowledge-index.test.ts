import assert from "node:assert/strict";
import test from "node:test";

import { inspectKnowledgeIndex } from "./knowledge-index.ts";

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

test("accepts an exhaustive Knowledge Type partition", () => {
  const markdown =
    indexWithRows(`| [knowledge/agents/model.md](agents/model.md) | evergreen | Read when modeling Agents. |
| [knowledge/provider/config.md](provider/config.md) | time-sensitive | Read when configuring a provider. |
`);

  assert.deepEqual(
    inspectKnowledgeIndex(markdown, ["agents/model.md", "provider/config.md"]),
    {
      entries: [
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
      diagnostics: [],
    },
  );
});

test("rejects an unknown Knowledge Type", () => {
  const markdown = indexWithRows(
    "| [knowledge/agents/model.md](agents/model.md) | static | Read when modeling Agents. |\n",
  );

  assert.deepEqual(inspectKnowledgeIndex(markdown, ["agents/model.md"]), {
    entries: [],
    diagnostics: [
      "Knowledge Type for 'knowledge/agents/model.md' must be 'time-sensitive' or 'evergreen'.",
    ],
  });
});

test("rejects missing, duplicate, and nonexistent index entries", () => {
  const markdown =
    indexWithRows(`| [knowledge/agents/model.md](agents/model.md) | evergreen | Read when modeling Agents. |
| [knowledge/agents/model.md](agents/model.md) | evergreen | Read when modeling Agents. |
| [knowledge/missing.md](missing.md) | time-sensitive | Read when reading missing Knowledge. |
`);

  assert.deepEqual(
    inspectKnowledgeIndex(markdown, ["agents/model.md", "security/auth.md"])
      .diagnostics,
    [
      "Knowledge document 'knowledge/agents/model.md' must be listed exactly once, but it appears 2 times.",
      "The index lists 'knowledge/missing.md', but that leaf document does not exist.",
      "Knowledge leaf 'knowledge/security/auth.md' must be listed exactly once in the index.",
    ],
  );
});

test("requires the canonical Documents table columns", () => {
  const markdown = indexWithRows("").replace(
    "| File Path | Knowledge Type | When to Read |\n| --- | --- | --- |",
    "| File Path | When to Read |\n| --- | --- |",
  );

  assert.deepEqual(inspectKnowledgeIndex(markdown, []).diagnostics, [
    "The Documents table must have the columns 'File Path', 'Knowledge Type', and 'When to Read' in that order.",
  ]);
});

test("requires a task-facing When to Read condition", () => {
  const markdown =
    indexWithRows(`| [knowledge/empty.md](empty.md) | evergreen | |
| [knowledge/wrong-prefix.md](wrong-prefix.md) | evergreen | Use when reviewing a document. |
`);

  assert.deepEqual(
    inspectKnowledgeIndex(markdown, ["empty.md", "wrong-prefix.md"]),
    {
      entries: [],
      diagnostics: [
        "When to Read for 'knowledge/empty.md' must not be empty.",
        "When to Read for 'knowledge/wrong-prefix.md' must begin with 'Read when'.",
      ],
    },
  );
});
