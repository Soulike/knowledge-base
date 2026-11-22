import { execFileSync } from "node:child_process";
import { posix } from "node:path";

export const marketplacePath = ".claude-plugin/marketplace.json";

export interface MarketplacePlugin {
  name: string;
  source: string;
  manifestPath: string;
}

export interface PluginManifestAtRevision extends MarketplacePlugin {
  content: string;
}

export function marketplacePlugins(
  marketplaceContent: string,
): MarketplacePlugin[] {
  const marketplace: unknown = JSON.parse(marketplaceContent);
  if (
    typeof marketplace !== "object" ||
    marketplace === null ||
    !("plugins" in marketplace) ||
    !Array.isArray(marketplace.plugins)
  ) {
    throw new Error("The marketplace must contain a plugins array.");
  }

  const plugins: unknown[] = marketplace.plugins;
  const seenNames = new Set<string>();
  const resolved: MarketplacePlugin[] = [];

  for (const plugin of plugins) {
    if (
      typeof plugin !== "object" ||
      plugin === null ||
      !("name" in plugin) ||
      typeof plugin.name !== "string" ||
      plugin.name.length === 0 ||
      !("source" in plugin) ||
      typeof plugin.source !== "string" ||
      !plugin.source.startsWith("./") ||
      plugin.source.split("/").includes("..")
    ) {
      throw new Error(
        "Each marketplace plugin must have a non-empty name and a local './' source without '..'.",
      );
    }

    if (seenNames.has(plugin.name)) {
      throw new Error(`Duplicate marketplace plugin '${plugin.name}'.`);
    }
    seenNames.add(plugin.name);

    resolved.push({
      name: plugin.name,
      source: plugin.source,
      manifestPath: posix.join(plugin.source, "plugin.json"),
    });
  }

  return resolved;
}

export function readMarketplacePluginsAtRevision(
  repository: string,
  revision: string,
): PluginManifestAtRevision[] {
  const plugins = marketplacePlugins(
    readFileAtRevision(repository, revision, marketplacePath),
  );
  return plugins.map((plugin) => ({
    ...plugin,
    content: readFileAtRevision(repository, revision, plugin.manifestPath),
  }));
}

export function isVersionedContent(
  path: string,
  manifestPath: string,
): boolean {
  const pluginDirectory = posix.dirname(manifestPath);
  return ["knowledge", "references", "skills"].some((directory) =>
    path.startsWith(`${posix.join(pluginDirectory, directory)}/`),
  );
}

function git(repository: string, arguments_: string[]): string {
  return execFileSync("git", ["-C", repository, ...arguments_], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

export function readFileAtRevision(
  repository: string,
  revision: string,
  path: string,
): string {
  return git(repository, ["show", `${revision}:${path}`]);
}

export function readCommitterTimestamp(
  repository: string,
  revision: string,
): string {
  return git(repository, ["show", "-s", "--format=%cI", revision]).trim();
}

export function readMergeBase(
  repository: string,
  targetRevision: string,
  headRevision: string,
): string {
  return git(repository, ["merge-base", targetRevision, headRevision]).trim();
}

export function listChangedFiles(
  repository: string,
  fromRevision: string,
  toRevision: string,
): string[] {
  const output = git(repository, [
    "diff",
    "--no-renames",
    "--name-only",
    "-z",
    fromRevision,
    toRevision,
    "--",
  ]);
  return output.split("\0").filter((path) => path.length > 0);
}

export function listWorkingTreeChangedFiles(
  repository: string,
  fromRevision: string,
): string[] {
  const trackedOutput = git(repository, [
    "diff",
    "--no-renames",
    "--name-only",
    "-z",
    fromRevision,
    "--",
  ]);
  const untrackedOutput = git(repository, [
    "ls-files",
    "--others",
    "--exclude-standard",
    "-z",
  ]);
  const paths = new Set<string>();
  for (const path of trackedOutput.split("\0")) {
    if (path.length > 0) {
      paths.add(path);
    }
  }
  for (const path of untrackedOutput.split("\0")) {
    if (path.length > 0) {
      paths.add(path);
    }
  }
  return [...paths];
}
