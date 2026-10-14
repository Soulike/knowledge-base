import { readFile } from "node:fs/promises";
import { join } from "node:path";

import {
  KnowledgeCatalogValidationError,
  type KnowledgeCatalogEntry,
  validateKnowledgeCatalog,
} from "@knowledge-base/knowledge-catalog-validation";

import type { VerificationTarget } from "../types.ts";

const KNOWLEDGE_DIRECTORY = "knowledge-base/plugin/knowledge";

export function readKnowledgeBaseCatalog(workspace: string): Promise<string> {
  return readFile(join(workspace, KNOWLEDGE_DIRECTORY, "index.md"), "utf8");
}

export function discoverKnowledgeBaseTargets(
  trackedPaths: readonly string[],
  catalogMarkdown: string,
): VerificationTarget[] {
  const leafFilePaths = trackedPaths
    .filter(
      (filePath) =>
        filePath.startsWith(`${KNOWLEDGE_DIRECTORY}/`) &&
        filePath.endsWith(".md") &&
        filePath !== `${KNOWLEDGE_DIRECTORY}/index.md` &&
        !filePath.endsWith("/index.md"),
    )
    .map((filePath) => filePath.slice(KNOWLEDGE_DIRECTORY.length + 1));
  let entries: KnowledgeCatalogEntry[];
  try {
    entries = validateKnowledgeCatalog(catalogMarkdown, leafFilePaths);
  } catch (error) {
    if (!(error instanceof KnowledgeCatalogValidationError)) {
      throw error;
    }
    throw new Error(
      `Cannot select Knowledge from an invalid catalog:\n${error.diagnostics.join("\n")}`,
      { cause: error },
    );
  }

  return entries
    .map<VerificationTarget>((entry) => {
      const filePath = `${KNOWLEDGE_DIRECTORY}/${entry.filePath}`;
      return {
        files: [filePath],
        id: filePath,
        kind: "knowledge",
        knowledgeType: entry.knowledgeType,
      };
    })
    .sort((left, right) => left.id.localeCompare(right.id));
}
