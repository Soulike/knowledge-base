import { KnowledgeIndexError } from "./error.ts";
import type { KnowledgeIndexEntry } from "./types.ts";

export function validateKnowledgeIndex(
  entries: readonly KnowledgeIndexEntry[],
  availableFilePaths: readonly string[],
): void {
  const diagnostics: string[] = [];
  const availablePathSet = new Set(availableFilePaths);
  const indexedPathSet = new Set(entries.map((entry) => entry.filePath));

  for (const entry of entries) {
    if (!availablePathSet.has(entry.filePath)) {
      diagnostics.push(
        `The index lists 'knowledge/${entry.filePath}', but that leaf document does not exist.`,
      );
    }
  }

  for (const availableFilePath of availableFilePaths) {
    if (!indexedPathSet.has(availableFilePath)) {
      diagnostics.push(
        `Knowledge leaf 'knowledge/${availableFilePath}' must be listed exactly once in the index.`,
      );
    }
  }

  if (diagnostics.length > 0) {
    throw new KnowledgeIndexError(diagnostics);
  }
}
