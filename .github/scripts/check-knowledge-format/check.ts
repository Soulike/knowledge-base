import { readdir, readFile } from "node:fs/promises";
import { basename, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { validateKnowledgeDocument } from "./validate.ts";

export interface KnowledgeFormatDiagnostic {
  filePath: string;
  message: string;
}

export interface KnowledgeFormatCheckResult {
  checkedFileCount: number;
  diagnostics: KnowledgeFormatDiagnostic[];
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
): Promise<KnowledgeFormatCheckResult> {
  const knowledgeDirectory = resolve(directory);
  const markdownFiles = await findMarkdownFiles(knowledgeDirectory);
  const diagnostics: KnowledgeFormatDiagnostic[] = [];

  for (const filePath of markdownFiles) {
    const markdown = await readFile(filePath, "utf8");
    const relativeFilePath = toPortablePath(
      relative(knowledgeDirectory, filePath),
    );
    const displayPath = toPortablePath(
      join(basename(knowledgeDirectory), relativeFilePath),
    );

    if (
      relativeFilePath !== "index.md" &&
      relativeFilePath.endsWith("/index.md")
    ) {
      diagnostics.push({
        filePath: displayPath,
        message:
          "Nested knowledge indexes are not allowed; list leaf documents directly in 'knowledge/index.md'.",
      });
    }

    for (const message of validateKnowledgeDocument(markdown)) {
      diagnostics.push({ filePath: displayPath, message });
    }
  }

  return { checkedFileCount: markdownFiles.length, diagnostics };
}

export async function runKnowledgeFormatCheck(
  directory: string,
): Promise<number> {
  try {
    const result = await checkKnowledgeDirectory(directory);

    if (result.diagnostics.length > 0) {
      for (const diagnostic of result.diagnostics) {
        process.stderr.write(`${diagnostic.filePath}: ${diagnostic.message}\n`);
      }

      return 1;
    }

    process.stdout.write(
      `Checked ${result.checkedFileCount} knowledge Markdown files.\n`,
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

  if (knowledgeDirectory === undefined) {
    process.stderr.write("Usage: node check.ts <knowledge-directory>\n");
    process.exitCode = 2;
  } else {
    process.exitCode = await runKnowledgeFormatCheck(knowledgeDirectory);
  }
}
