import { readFile } from "node:fs/promises";
import { join, posix } from "node:path";

import {
  KnowledgeCatalogValidationError,
  type KnowledgeCatalogEntry,
  validateKnowledgeCatalog,
} from "@knowledge-base/knowledge-catalog-validation";

import type { VerificationTarget } from "../types.ts";

const ISOMORPHIC_PLUGINS_DIRECTORY = "knowledge-base/plugins";
const ISOMORPHIC_CATALOG_PATTERN =
  /^knowledge-base\/plugins\/([^/]+)\/knowledge\/index\.md$/u;
const ISOMORPHIC_KNOWLEDGE_MARKDOWN_PATTERN =
  /^knowledge-base\/plugins\/([^/]+)\/knowledge\/(.+\.md)$/u;

export type KnowledgeCatalogInputs =
  ReadonlyMap<string, string> | Readonly<Record<string, string>>;

function isValidPluginSegment(segment: string): boolean {
  return segment.length > 0 && segment !== "." && segment !== "..";
}

export function isKnowledgeCatalogPath(filePath: string): boolean {
  const match = ISOMORPHIC_CATALOG_PATTERN.exec(filePath);
  return match?.[1] !== undefined && isValidPluginSegment(match[1]);
}

function knowledgeDirectoryForMarkdown(filePath: string): string | undefined {
  if (!filePath.endsWith(".md")) {
    return undefined;
  }
  const match = ISOMORPHIC_KNOWLEDGE_MARKDOWN_PATTERN.exec(filePath);
  if (match?.[1] !== undefined && isValidPluginSegment(match[1])) {
    return `${ISOMORPHIC_PLUGINS_DIRECTORY}/${match[1]}/knowledge`;
  }
  return undefined;
}

function normalizeCatalogInputs(
  catalogs: KnowledgeCatalogInputs,
): Map<string, string> {
  const entries =
    catalogs instanceof Map
      ? [...catalogs.entries()]
      : Object.entries(catalogs);
  const normalized = new Map<string, string>();
  for (const [catalogPath, markdown] of entries) {
    if (!isKnowledgeCatalogPath(catalogPath)) {
      throw new Error(`Invalid Knowledge catalog path '${catalogPath}'.`);
    }
    normalized.set(catalogPath, markdown);
  }
  return normalized;
}

export async function readKnowledgeBaseCatalogs(
  workspace: string,
  trackedPaths: readonly string[],
): Promise<Record<string, string>> {
  const catalogPaths = [
    ...new Set(trackedPaths.filter(isKnowledgeCatalogPath)),
  ].sort();

  if (catalogPaths.length === 0) {
    throw new Error("No Knowledge catalogs found in workspace.");
  }

  const contents = await Promise.all(
    catalogPaths.map(
      async (catalogPath) =>
        [
          catalogPath,
          await readFile(join(workspace, catalogPath), "utf8"),
        ] as const,
    ),
  );
  return Object.fromEntries(contents);
}

export function discoverKnowledgeBaseTargets(
  trackedPaths: readonly string[],
  catalogs: KnowledgeCatalogInputs,
): VerificationTarget[] {
  const catalogMap = normalizeCatalogInputs(catalogs);
  if (catalogMap.size === 0) {
    throw new Error("At least one Knowledge catalog is required.");
  }

  const trackedSet = new Set(trackedPaths);
  const leavesByDirectory = new Map<string, string[]>();

  for (const filePath of trackedPaths) {
    const knowledgeDirectory = knowledgeDirectoryForMarkdown(filePath);
    if (knowledgeDirectory === undefined) {
      continue;
    }
    const catalogPath = `${knowledgeDirectory}/index.md`;
    if (filePath === catalogPath) {
      if (!leavesByDirectory.has(knowledgeDirectory)) {
        leavesByDirectory.set(knowledgeDirectory, []);
      }
      continue;
    }
    if (filePath.endsWith("/index.md")) {
      throw new Error(`Nested Knowledge catalog '${filePath}' is not allowed.`);
    }
    const leafPath = filePath.slice(knowledgeDirectory.length + 1);
    const leaves = leavesByDirectory.get(knowledgeDirectory) ?? [];
    leaves.push(leafPath);
    leavesByDirectory.set(knowledgeDirectory, leaves);
  }

  for (const knowledgeDirectory of leavesByDirectory.keys()) {
    const catalogPath = `${knowledgeDirectory}/index.md`;
    if (!trackedSet.has(catalogPath)) {
      throw new Error(
        `Knowledge directory '${knowledgeDirectory}' is missing its Knowledge catalog '${catalogPath}'.`,
      );
    }
    if (!catalogMap.has(catalogPath)) {
      throw new Error(
        `Missing Knowledge catalog content for '${catalogPath}'.`,
      );
    }
  }

  for (const catalogPath of catalogMap.keys()) {
    if (!trackedSet.has(catalogPath)) {
      throw new Error(
        `Knowledge catalog '${catalogPath}' is not present in tracked files.`,
      );
    }
  }

  const targets: VerificationTarget[] = [];
  const sortedCatalogs = [...catalogMap.entries()].sort(([left], [right]) =>
    left.localeCompare(right),
  );

  for (const [catalogPath, catalogMarkdown] of sortedCatalogs) {
    const knowledgeDirectory = posix.dirname(catalogPath);
    const leafFilePaths = (leavesByDirectory.get(knowledgeDirectory) ?? [])
      .slice()
      .sort();
    let entries: KnowledgeCatalogEntry[];
    try {
      entries = validateKnowledgeCatalog(catalogMarkdown, leafFilePaths);
    } catch (error) {
      if (!(error instanceof KnowledgeCatalogValidationError)) {
        throw error;
      }
      throw new Error(
        `Cannot select Knowledge from invalid catalog '${catalogPath}':\n${error.diagnostics.join("\n")}`,
        {
          cause: error,
        },
      );
    }

    for (const entry of entries) {
      const filePath = `${knowledgeDirectory}/${entry.filePath}`;
      targets.push({
        files: [filePath],
        id: filePath,
        kind: "knowledge",
        knowledgeType: entry.knowledgeType,
      });
    }
  }

  return targets.sort((left, right) => left.id.localeCompare(right.id));
}
