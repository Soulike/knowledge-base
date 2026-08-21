import assert from "node:assert/strict";
import test from "node:test";

import {
  KnowledgeIndexError,
  validateKnowledgeIndex,
  type KnowledgeIndexEntry,
} from "./index.ts";

const entries: KnowledgeIndexEntry[] = [
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
];

test("accepts an index that matches the available Knowledge files", () => {
  assert.doesNotThrow(() =>
    validateKnowledgeIndex(entries, ["agents/model.md", "provider/config.md"]),
  );
});

test("rejects index and file inventory mismatches in both directions", () => {
  assert.throws(
    () => validateKnowledgeIndex(entries, ["agents/model.md", "security.md"]),
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
