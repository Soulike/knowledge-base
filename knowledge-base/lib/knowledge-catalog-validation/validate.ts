import { KnowledgeCatalogValidationError } from "./error.ts";
import { parseKnowledgeCatalog } from "./parse.ts";
import type { KnowledgeCatalogEntry } from "./types.ts";

export function validateKnowledgeCatalog(
  markdown: string,
  availableFilePaths: readonly string[],
): KnowledgeCatalogEntry[] {
  const parsedCatalog = parseKnowledgeCatalog(markdown);
  const diagnostics = [...parsedCatalog.diagnostics];

  if (parsedCatalog.listedFilePaths !== null) {
    const availablePathSet = new Set(availableFilePaths);
    const listedPathCounts = new Map<string, number>();

    for (const filePath of parsedCatalog.listedFilePaths) {
      listedPathCounts.set(filePath, (listedPathCounts.get(filePath) ?? 0) + 1);
    }

    for (const [filePath, count] of listedPathCounts) {
      if (count > 1) {
        diagnostics.push(
          `Knowledge document 'knowledge/${filePath}' must be listed exactly once, but it appears ${count} times.`,
        );
      }

      if (!availablePathSet.has(filePath)) {
        diagnostics.push(
          `The catalog lists 'knowledge/${filePath}', but that leaf document does not exist.`,
        );
      }
    }

    for (const availableFilePath of availableFilePaths) {
      if (!listedPathCounts.has(availableFilePath)) {
        diagnostics.push(
          `Knowledge leaf 'knowledge/${availableFilePath}' must be listed exactly once in the catalog.`,
        );
      }
    }
  }

  if (diagnostics.length > 0) {
    throw new KnowledgeCatalogValidationError(diagnostics);
  }

  return parsedCatalog.entries;
}
