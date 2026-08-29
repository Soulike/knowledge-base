import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { validatePromptLinks, type PromptLinkDiagnostic } from "./validate.ts";

const PROMPT_PATH = /^\.github\/scripts\/[^/]+\/prompts\/.*\.md$/u;

export interface PromptLinkCheckResult {
  checkedFileCount: number;
  diagnostics: Array<PromptLinkDiagnostic & { filePath: string }>;
}

function toPortablePath(filePath: string): string {
  return filePath.split(sep).join("/");
}

export async function checkPromptLinks(
  repositoryPath: string,
): Promise<PromptLinkCheckResult> {
  const repositoryRoot = resolve(repositoryPath);
  const repositorySource = execFileSync(
    "git",
    [
      "-C",
      repositoryRoot,
      "ls-files",
      "--cached",
      "--others",
      "--exclude-standard",
      "-z",
    ],
    { encoding: "utf8" },
  );
  const deletedSource = execFileSync(
    "git",
    ["-C", repositoryRoot, "ls-files", "--deleted", "-z"],
    { encoding: "utf8" },
  );
  const deletedPaths = new Set(deletedSource.split("\0").filter(Boolean));
  const repositoryFilePaths = repositorySource
    .split("\0")
    .filter((filePath) => filePath.length > 0 && !deletedPaths.has(filePath));
  const repositoryPaths = new Set(repositoryFilePaths);
  const markdownPaths = repositoryFilePaths.filter((filePath) =>
    filePath.endsWith(".md"),
  );
  const markdownEntries = await Promise.all(
    markdownPaths.map(
      async (filePath) =>
        [
          filePath,
          await readFile(join(repositoryRoot, filePath), "utf8"),
        ] as const,
    ),
  );
  const repositoryMarkdown = new Map(markdownEntries);
  const promptPaths = markdownPaths.filter((filePath) =>
    PROMPT_PATH.test(toPortablePath(filePath)),
  );
  const diagnostics: PromptLinkCheckResult["diagnostics"] = [];

  for (const promptPath of promptPaths) {
    const markdown = repositoryMarkdown.get(promptPath);
    if (markdown === undefined) {
      continue;
    }
    for (const diagnostic of validatePromptLinks(
      promptPath,
      markdown,
      repositoryPaths,
      repositoryMarkdown,
    )) {
      diagnostics.push({ filePath: promptPath, ...diagnostic });
    }
  }

  return { checkedFileCount: promptPaths.length, diagnostics };
}

export async function runPromptLinkCheck(
  repositoryPath: string,
): Promise<number> {
  try {
    const result = await checkPromptLinks(repositoryPath);
    if (result.diagnostics.length > 0) {
      for (const diagnostic of result.diagnostics) {
        process.stderr.write(
          `${diagnostic.filePath}:${diagnostic.line}: ${diagnostic.message}\n`,
        );
      }
      return 1;
    }
    process.stdout.write(
      `Checked ${result.checkedFileCount} prompt Markdown files.\n`,
    );
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Prompt link check failed: ${message}\n`);
    return 1;
  }
}

const invokedPath = process.argv[1];
if (
  invokedPath !== undefined &&
  resolve(invokedPath) === resolve(fileURLToPath(import.meta.url))
) {
  const repositoryPath = process.argv[2];
  if (repositoryPath === undefined) {
    process.stderr.write("Usage: node check.ts <repository-directory>\n");
    process.exitCode = 2;
  } else {
    process.exitCode = await runPromptLinkCheck(repositoryPath);
  }
}
