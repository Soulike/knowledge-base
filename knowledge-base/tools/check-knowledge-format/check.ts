import { readdir, readFile, stat } from "node:fs/promises";
import {
  basename,
  dirname,
  isAbsolute,
  join,
  posix,
  relative,
  resolve,
  sep,
  win32,
} from "node:path";
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

export interface MarketplacePluginEntry {
  name: string;
  sourcePath: string;
  pluginDirectory: string;
  knowledgeDirectory: string;
}

export interface MarketplacePluginCheckResult {
  plugin: MarketplacePluginEntry;
  result: KnowledgeFormatCheckResult;
}

export interface MarketplaceKnowledgeFormatCheckResult {
  plugins: MarketplacePluginCheckResult[];
  totalCheckedFileCount: number;
  hasDiagnostics: boolean;
}

type ParsedCliArguments =
  | {
      mode: "directory";
      directory: string;
      enforceReachability: boolean;
    }
  | {
      mode: "marketplace";
      marketplaceFile: string;
      enforceReachability: boolean;
    }
  | { mode: "invalid" };

const usageMessage =
  "Usage: node check.ts <knowledge-directory> [--enforce-reachability]\n" +
  "       node check.ts --marketplace <marketplace-file> [--enforce-reachability]\n";

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

function errorCode(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  return undefined;
}

function formatSummaryLine(result: KnowledgeFormatCheckResult): string {
  const reachableCount = result.reachability.reachableKnowledgeFilePaths.length;
  const unreachableCount =
    result.reachability.unreachableKnowledgeFilePaths.length;
  const leafCount = reachableCount + unreachableCount;
  const entrypointLabel =
    result.reachability.entrypointCount === 1
      ? "installed Skill entrypoint"
      : "installed Skill entrypoints";
  const unreachableVerb = unreachableCount === 1 ? "is" : "are";

  return (
    `Checked ${result.checkedFileCount} knowledge Markdown files. ` +
    `${reachableCount} of ${leafCount} Knowledge leaves are reachable from ` +
    `${result.reachability.entrypointCount} ${entrypointLabel}; ` +
    `${unreachableCount} ${unreachableVerb} not yet reachable.`
  );
}

function normalizeMarketplaceSource(source: string): string {
  if (
    !source.startsWith("./") ||
    source.includes("\\") ||
    source.split("/").includes("..")
  ) {
    throw new Error(
      `Marketplace plugin source '${source}' must be a package-relative path starting with './' without '..'.`,
    );
  }

  const normalized = posix.normalize(source);
  if (
    normalized === ".." ||
    normalized.startsWith("../") ||
    posix.isAbsolute(normalized) ||
    win32.isAbsolute(normalized) ||
    win32.parse(normalized).root !== ""
  ) {
    throw new Error(
      `Marketplace plugin source '${source}' must be a package-relative path starting with './' without '..'.`,
    );
  }

  return normalized;
}

export async function readMarketplacePlugins(
  marketplaceFile: string,
): Promise<MarketplacePluginEntry[]> {
  const resolvedMarketplaceFile = resolve(marketplaceFile);
  const content = await readFile(resolvedMarketplaceFile, "utf8");
  const marketplace: unknown = JSON.parse(content);

  if (
    typeof marketplace !== "object" ||
    marketplace === null ||
    !("plugins" in marketplace) ||
    !Array.isArray(marketplace.plugins) ||
    marketplace.plugins.length === 0
  ) {
    throw new Error("The marketplace must contain a non-empty plugins array.");
  }

  const marketplaceParent = dirname(resolvedMarketplaceFile);
  const marketplaceRoot =
    basename(marketplaceParent) === ".claude-plugin"
      ? dirname(marketplaceParent)
      : marketplaceParent;
  const seenNames = new Set<string>();
  const entries: MarketplacePluginEntry[] = [];

  for (const plugin of marketplace.plugins) {
    if (
      typeof plugin !== "object" ||
      plugin === null ||
      !("name" in plugin) ||
      typeof plugin.name !== "string" ||
      plugin.name.trim() === "" ||
      !("source" in plugin) ||
      typeof plugin.source !== "string" ||
      plugin.source.trim() === ""
    ) {
      throw new Error(
        "Each marketplace plugin entry must include non-empty string 'name' and 'source' fields.",
      );
    }

    if (seenNames.has(plugin.name)) {
      throw new Error(`Duplicate marketplace plugin name '${plugin.name}'.`);
    }
    seenNames.add(plugin.name);

    const sourcePath = normalizeMarketplaceSource(plugin.source);
    const pluginDirectory = resolve(marketplaceRoot, sourcePath);
    const relativePluginDirectory = relative(marketplaceRoot, pluginDirectory);
    if (
      relativePluginDirectory === ".." ||
      relativePluginDirectory.startsWith(`..${sep}`) ||
      isAbsolute(relativePluginDirectory)
    ) {
      throw new Error(
        `Marketplace plugin source '${plugin.source}' must resolve inside the marketplace root.`,
      );
    }

    entries.push({
      name: plugin.name,
      sourcePath,
      pluginDirectory,
      knowledgeDirectory: join(pluginDirectory, "knowledge"),
    });
  }

  return entries;
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

function emptyKnowledgeCheckResult(
  diagnostics: KnowledgeFormatDiagnostic[] = [],
): KnowledgeFormatCheckResult {
  return {
    checkedFileCount: 0,
    diagnostics,
    reachability: {
      diagnostics: [],
      entrypointCount: 0,
      reachableKnowledgeFilePaths: [],
      unreachableKnowledgeFilePaths: [],
    },
  };
}

async function probeDirectory(
  directoryPath: string,
  displayLabel: string,
): Promise<
  | { status: "directory" }
  | { status: "missing" }
  | { status: "error"; message: string }
> {
  try {
    const stats = await stat(directoryPath);
    if (!stats.isDirectory()) {
      return {
        status: "error",
        message: `${displayLabel} directory is not a directory.`,
      };
    }
    return { status: "directory" };
  } catch (error) {
    const code = errorCode(error);
    if (code === "ENOENT") {
      return { status: "missing" };
    }
    if (code === "ENOTDIR") {
      return {
        status: "error",
        message: `${displayLabel} directory is not a directory.`,
      };
    }
    throw error;
  }
}

export async function checkMarketplaceKnowledge(
  marketplaceFile: string,
  options: KnowledgeFormatCheckOptions = {},
): Promise<MarketplaceKnowledgeFormatCheckResult> {
  const plugins = await readMarketplacePlugins(marketplaceFile);
  const results: MarketplacePluginCheckResult[] = [];
  let totalCheckedFileCount = 0;
  let hasDiagnostics = false;

  for (const plugin of plugins) {
    const knowledgeProbe = await probeDirectory(
      plugin.knowledgeDirectory,
      "Knowledge",
    );

    let result: KnowledgeFormatCheckResult;
    if (knowledgeProbe.status === "error") {
      result = emptyKnowledgeCheckResult([
        {
          filePath: "knowledge",
          message: knowledgeProbe.message,
        },
      ]);
    } else if (knowledgeProbe.status === "directory") {
      result = await checkKnowledgeDirectory(
        plugin.knowledgeDirectory,
        options,
      );
    } else {
      const skillsDirectory = join(plugin.pluginDirectory, "skills");
      const skillsProbe = await probeDirectory(skillsDirectory, "Skills");

      if (skillsProbe.status === "error") {
        result = emptyKnowledgeCheckResult([
          {
            filePath: "skills",
            message: skillsProbe.message,
          },
        ]);
      } else if (skillsProbe.status === "missing") {
        result = emptyKnowledgeCheckResult([
          {
            filePath: "skills",
            message: "Skills directory does not exist.",
          },
        ]);
      } else {
        const reachability = await checkKnowledgeReachability(
          plugin.pluginDirectory,
          [],
        );
        const diagnostics = [...reachability.diagnostics];
        if (reachability.entrypointCount === 0) {
          diagnostics.push({
            filePath: "skills",
            message:
              "Skills directory must contain at least one Skill entrypoint.",
          });
        }
        result = {
          checkedFileCount: 0,
          diagnostics,
          reachability,
        };
      }
    }

    totalCheckedFileCount += result.checkedFileCount;
    if (result.diagnostics.length > 0) {
      hasDiagnostics = true;
    }
    results.push({ plugin, result });
  }

  return {
    plugins: results,
    totalCheckedFileCount,
    hasDiagnostics,
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

    process.stdout.write(`${formatSummaryLine(result)}\n`);
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Knowledge format check failed: ${message}\n`);
    return 1;
  }
}

export async function runMarketplaceKnowledgeFormatCheck(
  marketplaceFile: string,
  options: KnowledgeFormatCheckOptions = {},
): Promise<number> {
  try {
    const marketplaceResult = await checkMarketplaceKnowledge(
      marketplaceFile,
      options,
    );

    if (marketplaceResult.hasDiagnostics) {
      for (const { plugin, result } of marketplaceResult.plugins) {
        for (const diagnostic of result.diagnostics) {
          const prefixedPath =
            plugin.sourcePath === "."
              ? diagnostic.filePath
              : `${plugin.sourcePath}/${diagnostic.filePath}`;
          process.stderr.write(
            `[${plugin.name}] ${prefixedPath}: ${diagnostic.message}\n`,
          );
        }
      }

      return 1;
    }

    for (const { plugin, result } of marketplaceResult.plugins) {
      process.stdout.write(`[${plugin.name}] ${formatSummaryLine(result)}\n`);
    }

    const pluginLabel =
      marketplaceResult.plugins.length === 1
        ? "marketplace plugin"
        : "marketplace plugins";
    process.stdout.write(
      `Checked ${marketplaceResult.plugins.length} ${pluginLabel} (${marketplaceResult.totalCheckedFileCount} knowledge Markdown files total).\n`,
    );
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Knowledge format check failed: ${message}\n`);
    return 1;
  }
}

function parseCliArguments(args: readonly string[]): ParsedCliArguments {
  let directory: string | undefined;
  let marketplaceFile: string | undefined;
  let enforceReachability = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === undefined) {
      continue;
    }

    if (argument === "--enforce-reachability") {
      enforceReachability = true;
    } else if (argument === "--marketplace") {
      const value = args[index + 1];
      if (
        marketplaceFile !== undefined ||
        value === undefined ||
        value === "" ||
        value.startsWith("--")
      ) {
        return { mode: "invalid" };
      }
      marketplaceFile = value;
      index += 1;
    } else if (argument.startsWith("--marketplace=")) {
      const value = argument.slice("--marketplace=".length);
      if (marketplaceFile !== undefined || value === "") {
        return { mode: "invalid" };
      }
      marketplaceFile = value;
    } else if (argument.startsWith("-")) {
      return { mode: "invalid" };
    } else if (directory === undefined) {
      directory = argument;
    } else {
      return { mode: "invalid" };
    }
  }

  if (marketplaceFile !== undefined && directory === undefined) {
    return { mode: "marketplace", marketplaceFile, enforceReachability };
  }

  if (directory !== undefined && marketplaceFile === undefined) {
    return { mode: "directory", directory, enforceReachability };
  }

  return { mode: "invalid" };
}

const invokedPath = process.argv[1];

if (
  invokedPath !== undefined &&
  resolve(invokedPath) === resolve(fileURLToPath(import.meta.url))
) {
  const parsed = parseCliArguments(process.argv.slice(2));

  if (parsed.mode === "invalid") {
    process.stderr.write(usageMessage);
    process.exitCode = 2;
  } else if (parsed.mode === "marketplace") {
    process.exitCode = await runMarketplaceKnowledgeFormatCheck(
      parsed.marketplaceFile,
      {
        enforceReachability: parsed.enforceReachability,
      },
    );
  } else {
    process.exitCode = await runKnowledgeFormatCheck(parsed.directory, {
      enforceReachability: parsed.enforceReachability,
    });
  }
}
