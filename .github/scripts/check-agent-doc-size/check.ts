import { constants as fsConstants } from "node:fs";
import { open, readdir, readFile, realpath, stat } from "node:fs/promises";
import {
  isAbsolute,
  join,
  posix,
  relative,
  resolve,
  sep,
  win32,
} from "node:path";
import { fileURLToPath } from "node:url";

export const SKILL_ENTRYPOINT_MAX_BYTES = 8_000;
export const AGENT_DOC_MAX_BYTES = 20_480;

const USAGE_MESSAGE = "Usage: node check.ts <repository-directory>\n";
const PLUGIN_CHECKED_DIRECTORIES = [
  "knowledge",
  "references",
  "skills",
] as const;

export interface AgentDocSizeDiagnostic {
  filePath: string;
  byteLength: number;
  limitBytes: number;
  message: string;
}

export interface AgentDocSizeCheckResult {
  checkedFileCount: number;
  diagnostics: AgentDocSizeDiagnostic[];
}

interface MarketplacePluginLocation {
  name: string;
  pluginDirectory: string;
}

interface CheckedMarkdownTarget {
  absolutePath: string;
  repoRelativePath: string;
  limitBytes: number;
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

function isOutsideDirectory(relativePath: string): boolean {
  return (
    relativePath === ".." ||
    relativePath.startsWith(`..${sep}`) ||
    isAbsolute(relativePath)
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

async function assertExistingDirectory(
  directoryPath: string,
  label: string,
): Promise<void> {
  let stats;
  try {
    stats = await stat(directoryPath);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${label} cannot be accessed: ${message}`, {
      cause: error,
    });
  }
  if (!stats.isDirectory()) {
    throw new Error(`${label} is not a directory.`);
  }
}

async function probeOptionalDirectory(
  directoryPath: string,
  label: string,
): Promise<boolean> {
  try {
    const stats = await stat(directoryPath);
    if (!stats.isDirectory()) {
      throw new Error(`${label} is not a directory.`);
    }
    return true;
  } catch (error) {
    const code = errorCode(error);
    if (code === "ENOENT") {
      return false;
    }
    if (code === "ENOTDIR") {
      throw new Error(`${label} is not a directory.`, { cause: error });
    }
    throw error;
  }
}

async function readMarketplacePluginLocations(
  repositoryRoot: string,
  realRepositoryRoot: string,
): Promise<MarketplacePluginLocation[]> {
  const marketplaceFile = join(
    repositoryRoot,
    ".claude-plugin",
    "marketplace.json",
  );
  const content = await readFile(marketplaceFile, "utf8");
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

  const seenNames = new Set<string>();
  const locations: MarketplacePluginLocation[] = [];

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
    const pluginDirectory = resolve(repositoryRoot, sourcePath);
    if (isOutsideDirectory(relative(repositoryRoot, pluginDirectory))) {
      throw new Error(
        `Marketplace plugin source '${plugin.source}' must resolve inside the repository root.`,
      );
    }

    await assertExistingDirectory(
      pluginDirectory,
      `Marketplace plugin '${plugin.name}' directory`,
    );

    const realPluginDirectory = await realpath(pluginDirectory);
    if (isOutsideDirectory(relative(realRepositoryRoot, realPluginDirectory))) {
      throw new Error(
        `Marketplace plugin source '${plugin.source}' resolves outside the repository root.`,
      );
    }

    locations.push({
      name: plugin.name,
      pluginDirectory,
    });
  }

  return locations;
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

function limitForScopeRelativePath(scopeRelativePath: string): number {
  const segments = scopeRelativePath.split("/");
  if (
    segments.length === 3 &&
    segments[0] === "skills" &&
    segments[2] === "SKILL.md"
  ) {
    return SKILL_ENTRYPOINT_MAX_BYTES;
  }
  return AGENT_DOC_MAX_BYTES;
}

async function measureRegularFileBytes(filePath: string): Promise<number> {
  const flags = fsConstants.O_RDONLY | (fsConstants.O_NOFOLLOW ?? 0);
  const handle = await open(filePath, flags);
  try {
    const stats = await handle.stat();
    if (!stats.isFile()) {
      throw new Error(`Expected regular file at '${filePath}'.`);
    }
    return stats.size;
  } finally {
    await handle.close();
  }
}

export async function checkAgentDocSizes(
  repositoryPath: string,
): Promise<AgentDocSizeCheckResult> {
  const repositoryRoot = resolve(repositoryPath);
  await assertExistingDirectory(repositoryRoot, "Repository root");
  const realRepositoryRoot = await realpath(repositoryRoot);

  const plugins = await readMarketplacePluginLocations(
    repositoryRoot,
    realRepositoryRoot,
  );

  const targetsByPath = new Map<string, CheckedMarkdownTarget>();

  function recordTarget(scopeRoot: string, filePath: string): void {
    const repoRelativePath = toPortablePath(relative(repositoryRoot, filePath));
    if (targetsByPath.has(repoRelativePath)) {
      return;
    }
    const scopeRelativePath = toPortablePath(relative(scopeRoot, filePath));
    targetsByPath.set(repoRelativePath, {
      absolutePath: filePath,
      repoRelativePath,
      limitBytes: limitForScopeRelativePath(scopeRelativePath),
    });
  }

  for (const plugin of plugins) {
    for (const subdirectoryName of PLUGIN_CHECKED_DIRECTORIES) {
      const subdirectory = join(plugin.pluginDirectory, subdirectoryName);
      const exists = await probeOptionalDirectory(
        subdirectory,
        `Plugin '${plugin.name}' ${subdirectoryName} directory`,
      );
      if (!exists) {
        continue;
      }
      for (const filePath of await findMarkdownFiles(subdirectory)) {
        recordTarget(plugin.pluginDirectory, filePath);
      }
    }
  }

  const agentsDirectory = join(repositoryRoot, ".agents");
  if (await probeOptionalDirectory(agentsDirectory, ".agents directory")) {
    for (const filePath of await findMarkdownFiles(agentsDirectory)) {
      recordTarget(agentsDirectory, filePath);
    }
  }

  const targets = [...targetsByPath.values()].sort((left, right) =>
    left.repoRelativePath.localeCompare(right.repoRelativePath),
  );
  const diagnostics: AgentDocSizeDiagnostic[] = [];

  for (const target of targets) {
    const byteLength = await measureRegularFileBytes(target.absolutePath);
    if (byteLength > target.limitBytes) {
      diagnostics.push({
        filePath: target.repoRelativePath,
        byteLength,
        limitBytes: target.limitBytes,
        message: `${byteLength} UTF-8 bytes exceeds limit of ${target.limitBytes} bytes.`,
      });
    }
  }

  return {
    checkedFileCount: targets.length,
    diagnostics,
  };
}

export async function runAgentDocSizeCheck(
  repositoryPath: string,
): Promise<number> {
  try {
    const result = await checkAgentDocSizes(repositoryPath);
    if (result.diagnostics.length > 0) {
      for (const diagnostic of result.diagnostics) {
        process.stderr.write(`${diagnostic.filePath}: ${diagnostic.message}\n`);
      }
      return 1;
    }
    process.stdout.write(
      `Checked ${result.checkedFileCount} Agent Markdown files.\n`,
    );
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Agent document size check failed: ${message}\n`);
    return 1;
  }
}

function parseCliRepositoryPath(args: readonly string[]): string | undefined {
  if (args.length !== 1) {
    return undefined;
  }
  const repositoryPath = args[0];
  if (
    repositoryPath === undefined ||
    repositoryPath === "" ||
    repositoryPath.startsWith("-")
  ) {
    return undefined;
  }
  return repositoryPath;
}

const invokedPath = process.argv[1];
if (
  invokedPath !== undefined &&
  resolve(invokedPath) === resolve(fileURLToPath(import.meta.url))
) {
  const repositoryPath = parseCliRepositoryPath(process.argv.slice(2));
  if (repositoryPath === undefined) {
    process.stderr.write(USAGE_MESSAGE);
    process.exitCode = 2;
  } else {
    process.exitCode = await runAgentDocSizeCheck(repositoryPath);
  }
}
