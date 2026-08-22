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

function assertDiagnostics(
  markdown: string,
  availableFilePaths: string[],
  expectedDiagnostics: string[],
): void {
  assert.throws(
    () => validateKnowledgeIndex(markdown, availableFilePaths),
    (error: unknown) => {
      assert.ok(error instanceof KnowledgeIndexError);
      assert.deepEqual(error.diagnostics, expectedDiagnostics);
      return true;
    },
  );
}

test("returns the parsed Knowledge index entries", () => {
  const markdown =
    indexWithRows(`| [knowledge/agents/model.md](agents/model.md) | evergreen | Read when modeling Agents. |
| [knowledge/provider/config.md](provider/config.md) | time-sensitive | Read when configuring a provider. |
`);

  assert.deepEqual(
    validateKnowledgeIndex(markdown, ["agents/model.md", "provider/config.md"]),
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

test("rejects an unknown Knowledge Type", () => {
  const markdown = indexWithRows(
    "| [knowledge/agents/model.md](agents/model.md) | static | Read when modeling Agents. |\n",
  );

  assertDiagnostics(
    markdown,
    ["agents/model.md"],
    [
      "Knowledge Type for 'knowledge/agents/model.md' must be 'time-sensitive' or 'evergreen'.",
    ],
  );
});

test("rejects duplicate Knowledge paths", () => {
  const markdown =
    indexWithRows(`| [knowledge/agents/model.md](agents/model.md) | evergreen | Read when modeling Agents. |
| [knowledge/agents/model.md](agents/model.md) | evergreen | Read when modeling Agents. |
`);

  assertDiagnostics(
    markdown,
    ["agents/model.md"],
    [
      "Knowledge document 'knowledge/agents/model.md' must be listed exactly once, but it appears 2 times.",
    ],
  );
});

test("requires the canonical Documents table columns", () => {
  const markdown = indexWithRows("").replace(
    "| File Path | Knowledge Type | When to Read |\n| --- | --- | --- |",
    "| File Path | When to Read |\n| --- | --- |",
  );

  assertDiagnostics(
    markdown,
    [],
    [
      "The Documents table must have the columns 'File Path', 'Knowledge Type', and 'When to Read' in that order.",
    ],
  );
});

test("requires task-facing When to Read conditions", () => {
  const markdown =
    indexWithRows(`| [knowledge/empty.md](empty.md) | evergreen | |
| [knowledge/wrong-prefix.md](wrong-prefix.md) | evergreen | Use when reviewing a document. |
`);

  assertDiagnostics(
    markdown,
    ["empty.md", "wrong-prefix.md"],
    [
      "When to Read for 'knowledge/empty.md' must not be empty.",
      "When to Read for 'knowledge/wrong-prefix.md' must begin with 'Read when'.",
    ],
  );
});
