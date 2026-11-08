import assert from "node:assert/strict";
import test from "node:test";

import {
  KnowledgeCatalogValidationError,
  validateKnowledgeCatalog,
} from "./index.ts";

function catalogWithRows(rows: string): string {
  return `# Knowledge catalog

## Scope

This catalog lists Knowledge.

## When to update

Update this catalog when Knowledge changes.

## Documents

| File Path | Knowledge Type |
| --- | --- |
${rows}`;
}

function assertDiagnostics(
  markdown: string,
  availableFilePaths: string[],
  expectedDiagnostics: string[],
): void {
  assert.throws(
    () => validateKnowledgeCatalog(markdown, availableFilePaths),
    (error: unknown) => {
      assert.ok(error instanceof KnowledgeCatalogValidationError);
      assert.deepEqual(error.diagnostics, expectedDiagnostics);
      return true;
    },
  );
}

test("returns validated Knowledge catalog entries", () => {
  const markdown =
    catalogWithRows(`| [knowledge/agents/model.md](agents/model.md) | evergreen |
| [knowledge/provider/config.md](provider/config.md) | time-sensitive |
`);

  assert.deepEqual(
    validateKnowledgeCatalog(markdown, [
      "agents/model.md",
      "provider/config.md",
    ]),
    [
      {
        filePath: "agents/model.md",
        knowledgeType: "evergreen",
      },
      {
        filePath: "provider/config.md",
        knowledgeType: "time-sensitive",
      },
    ],
  );
});

test("rejects an unknown Knowledge Type", () => {
  const markdown = catalogWithRows(
    "| [knowledge/agents/model.md](agents/model.md) | static |\n",
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
    catalogWithRows(`| [knowledge/agents/model.md](agents/model.md) | evergreen |
| [knowledge/agents/model.md](agents/model.md) | evergreen |
`);

  assertDiagnostics(
    markdown,
    ["agents/model.md"],
    [
      "Knowledge document 'knowledge/agents/model.md' must be listed exactly once, but it appears 2 times.",
    ],
  );
});

test("requires exactly the final two-column Documents schema", () => {
  const markdown = catalogWithRows("").replace(
    "| File Path | Knowledge Type |\n| --- | --- |",
    "| File Path | Knowledge Type | When to Read |\n| --- | --- | --- |",
  );

  assertDiagnostics(
    markdown,
    [],
    [
      "The Documents table must have the columns 'File Path' and 'Knowledge Type' in that order.",
    ],
  );
});

test("requires exactly two cells in every Documents row", () => {
  const markdown = catalogWithRows(
    "| [knowledge/agents/model.md](agents/model.md) | evergreen | obsolete runtime condition |\n",
  );

  assertDiagnostics(
    markdown,
    [],
    ["Documents table line 15 must contain exactly two columns."],
  );
});

test("requires one direct Markdown link in the File Path cell", () => {
  const markdown = catalogWithRows(
    "| knowledge/agents/model.md | evergreen |\n",
  );

  assertDiagnostics(
    markdown,
    [],
    [
      "Documents table line 15 must link a plugin-root-relative 'knowledge/...' path to its knowledge-relative target.",
    ],
  );
});

test("requires matching plugin-root-relative link text", () => {
  const markdown = catalogWithRows(
    "| [Model](agents/model.md) | evergreen |\n",
  );

  assertDiagnostics(
    markdown,
    ["agents/model.md"],
    [
      "Documents table line 15 link text and target must identify the same Knowledge document.",
    ],
  );
});

for (const [label, target] of [
  ["absolute", "/agents/model.md"],
  ["current-directory", "./agents/model.md"],
  ["parent-directory", "../agents/model.md"],
  ["non-Markdown", "agents/model.txt"],
] as const) {
  test(`rejects an invalid ${label} Knowledge target`, () => {
    const markdown = catalogWithRows(
      `| [knowledge/${target}](${target}) | evergreen |\n`,
    );

    assertDiagnostics(
      markdown,
      [],
      [
        "Documents table line 15 must target a knowledge-relative Markdown leaf path.",
      ],
    );
  });
}
