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

const validCatalog =
  catalogWithRows(`| [knowledge/agents/model.md](agents/model.md) | evergreen |
| [knowledge/provider/config.md](provider/config.md) | time-sensitive |
`);

test("returns entries when the catalog matches the available Knowledge files", () => {
  assert.deepEqual(
    validateKnowledgeCatalog(validCatalog, [
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

test("rejects catalog and file inventory mismatches in both directions", () => {
  assert.throws(
    () =>
      validateKnowledgeCatalog(validCatalog, [
        "agents/model.md",
        "security.md",
      ]),
    (error: unknown) => {
      assert.ok(error instanceof KnowledgeCatalogValidationError);
      assert.deepEqual(error.diagnostics, [
        "The catalog lists 'knowledge/provider/config.md', but that leaf document does not exist.",
        "Knowledge leaf 'knowledge/security.md' must be listed exactly once in the catalog.",
      ]);
      return true;
    },
  );
});

test("reports row, duplicate, and inventory diagnostics together", () => {
  const invalidCatalog =
    catalogWithRows(`| [knowledge/agents/model.md](agents/model.md) | evergreen |
| [knowledge/agents/model.md](agents/model.md) | evergreen |
| [knowledge/missing.md](missing.md) | static |
`);

  assert.throws(
    () =>
      validateKnowledgeCatalog(invalidCatalog, [
        "agents/model.md",
        "security/auth.md",
      ]),
    (error: unknown) => {
      assert.ok(error instanceof KnowledgeCatalogValidationError);
      assert.deepEqual(error.diagnostics, [
        "Knowledge Type for 'knowledge/missing.md' must be 'time-sensitive' or 'evergreen'.",
        "Knowledge document 'knowledge/agents/model.md' must be listed exactly once, but it appears 2 times.",
        "The catalog lists 'knowledge/missing.md', but that leaf document does not exist.",
        "Knowledge leaf 'knowledge/security/auth.md' must be listed exactly once in the catalog.",
      ]);
      return true;
    },
  );
});
