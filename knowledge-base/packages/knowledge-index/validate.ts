import { KnowledgeIndexError } from "./error.ts";
import { parseKnowledgeIndex } from "./parse.ts";
import type { KnowledgeIndexEntry } from "./types.ts";

export function validateKnowledgeIndex(
  markdown: string,
  availableFilePaths: readonly string[],
): KnowledgeIndexEntry[] {
  const parsedIndex = parseKnowledgeIndex(markdown);
  const diagnostics = [...parsedIndex.diagnostics];

  if (parsedIndex.indexedFilePaths !== null) {
    const availablePathSet = new Set(availableFilePaths);
    const indexedPathCounts = new Map<string, number>();

    for (const filePath of parsedIndex.indexedFilePaths) {
      indexedPathCounts.set(
        filePath,
        (indexedPathCounts.get(filePath) ?? 0) + 1,
      );
    }

    for (const [filePath, count] of indexedPathCounts) {
      if (count > 1) {
        diagnostics.push(
          `Knowledge document 'knowledge/${filePath}' must be listed exactly once, but it appears ${count} times.`,
        );
      }

      if (!availablePathSet.has(filePath)) {
        diagnostics.push(
          `The index lists 'knowledge/${filePath}', but that leaf document does not exist.`,
        );
      }
    }

    for (const availableFilePath of availableFilePaths) {
      if (!indexedPathCounts.has(availableFilePath)) {
        diagnostics.push(
          `Knowledge leaf 'knowledge/${availableFilePath}' must be listed exactly once in the index.`,
        );
      }
    }
  }

  if (diagnostics.length > 0) {
    throw new KnowledgeIndexError(diagnostics);
  }

  return parsedIndex.entries;
}
