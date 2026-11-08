import { readdir, readFile } from "node:fs/promises";
import { basename, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import {
  KnowledgeCatalogValidationError,
  validateKnowledgeCatalog,
} from "@knowledge-base/knowledge-catalog-validation";
import {
  checkKnowledgeReachability,
  type KnowledgeReachabilityResult,
} from "./reachability.ts";
import { validateKnowledgeDocument } from "./validate.ts";

export interface KnowledgeFormatDiagnostic {
  filePath: string;
  message: string;
}

export interface KnowledgeFormatCheckResult {
  checkedFileCount: number;
  diagnostics: KnowledgeFormatDiagnostic[];
  reachability: KnowledgeReachabilityResult;
}

export interface KnowledgeFormatCheckOptions {
  enforceReachability?: boolean;
}

async function findMarkdownFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries.sort((left, right) =>
    left.name.localeCompare(right.name),
  )) {
    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findMarkdownFiles(entryPath)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(entryPath);
    }
  }

  return files;
}

function toPortablePath(filePath: string): string {
  return filePath.split(sep).join("/");
}

export async function checkKnowledgeDirectory(
  directory: string,
  options: KnowledgeFormatCheckOptions = {},
): Promise<KnowledgeFormatCheckResult> {
  const knowledgeDirectory = resolve(directory);
  const markdownFiles = await findMarkdownFiles(knowledgeDirectory);
  const diagnostics: KnowledgeFormatDiagnostic[] = [];
  const relativeMarkdownFiles = markdownFiles.map((filePath) =>
    toPortablePath(relative(knowledgeDirectory, filePath)),
  );
  let catalogMarkdown: string | undefined;

  for (const [index, filePath] of markdownFiles.entries()) {
    const markdown = await readFile(filePath, "utf8");
    const relativeFilePath = relativeMarkdownFiles[index];

    if (relativeFilePath === undefined) {
      continue;
    }

    const displayPath = toPortablePath(
      join(basename(knowledgeDirectory), relativeFilePath),
    );

    if (relativeFilePath === "index.md") {
      catalogMarkdown = markdown;
    }

    if (
      relativeFilePath !== "index.md" &&
      relativeFilePath.endsWith("/index.md")
    ) {
      diagnostics.push({
        filePath: displayPath,
        message:
          "Nested Knowledge catalogs are not allowed; list leaf documents directly in 'knowledge/index.md'.",
      });
    }

    for (const message of validateKnowledgeDocument(markdown)) {
      diagnostics.push({ filePath: displayPath, message });
    }
  }

  const catalogDisplayPath = toPortablePath(
    join(basename(knowledgeDirectory), "index.md"),
  );

  const leafFilePaths = relativeMarkdownFiles.filter(
    (filePath) => filePath !== "index.md" && !filePath.endsWith("/index.md"),
  );

  if (catalogMarkdown === undefined) {
    diagnostics.push({
      filePath: catalogDisplayPath,
      message: "The Knowledge catalog is required.",
    });
  } else {
    try {
      validateKnowledgeCatalog(catalogMarkdown, leafFilePaths);
    } catch (error) {
      if (!(error instanceof KnowledgeCatalogValidationError)) {
        throw error;
      }
      for (const message of error.diagnostics) {
        diagnostics.push({ filePath: catalogDisplayPath, message });
      }
    }
  }

  const pluginDirectory = resolve(knowledgeDirectory, "..");
  const reachability = await checkKnowledgeReachability(
    pluginDirectory,
    leafFilePaths.map((filePath) => `knowledge/${filePath}`),
  );
  diagnostics.push(...reachability.diagnostics);

  if (options.enforceReachability === true) {
    for (const filePath of reachability.unreachableKnowledgeFilePaths) {
      diagnostics.push({
        filePath,
        message:
          "Knowledge leaf is not reachable from an installed Skill entrypoint through package-local Markdown links.",
      });
    }
  }

  return {
    checkedFileCount: markdownFiles.length,
    diagnostics,
    reachability,
  };
}

export async function runKnowledgeFormatCheck(
  directory: string,
  options: KnowledgeFormatCheckOptions = {},
): Promise<number> {
  try {
    const result = await checkKnowledgeDirectory(directory, options);

    if (result.diagnostics.length > 0) {
      for (const diagnostic of result.diagnostics) {
        process.stderr.write(`${diagnostic.filePath}: ${diagnostic.message}\n`);
      }

      return 1;
    }

    const reachableCount =
      result.reachability.reachableKnowledgeFilePaths.length;
    const unreachableCount =
      result.reachability.unreachableKnowledgeFilePaths.length;
    const leafCount = reachableCount + unreachableCount;
    const entrypointLabel =
      result.reachability.entrypointCount === 1
        ? "installed Skill entrypoint"
        : "installed Skill entrypoints";
    const unreachableVerb = unreachableCount === 1 ? "is" : "are";

    process.stdout.write(
      `Checked ${result.checkedFileCount} knowledge Markdown files. ` +
        `${reachableCount} of ${leafCount} Knowledge leaves are reachable from ` +
        `${result.reachability.entrypointCount} ${entrypointLabel}; ` +
        `${unreachableCount} ${unreachableVerb} not yet reachable.\n`,
    );
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Knowledge format check failed: ${message}\n`);
    return 1;
  }
}

const invokedPath = process.argv[1];

if (
  invokedPath !== undefined &&
  resolve(invokedPath) === resolve(fileURLToPath(import.meta.url))
) {
  const knowledgeDirectory = process.argv[2];
  const option = process.argv[3];

  if (knowledgeDirectory === undefined) {
    process.stderr.write(
      "Usage: node check.ts <knowledge-directory> [--enforce-reachability]\n",
    );
    process.exitCode = 2;
  } else if (option !== undefined && option !== "--enforce-reachability") {
    process.stderr.write(
      "Usage: node check.ts <knowledge-directory> [--enforce-reachability]\n",
    );
    process.exitCode = 2;
  } else {
    process.exitCode = await runKnowledgeFormatCheck(knowledgeDirectory, {
      enforceReachability: option === "--enforce-reachability",
    });
  }
}
