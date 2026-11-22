import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  isVersionedContent,
  listWorkingTreeChangedFiles,
  type MarketplacePlugin,
  marketplacePath,
  marketplacePlugins,
  readMarketplacePluginsAtRevision,
  readMergeBase,
} from "./repository.ts";
import {
  nextPluginVersion,
  readManifestVersion,
  releaseDateForTimestamp,
  replaceManifestVersion,
} from "./version.ts";

export interface UpdatePluginVersionOptions {
  repository: string;
  targetRevision: string;
  now?: Date;
}

export interface PluginVersionUpdateResult {
  name: string;
  manifestPath: string;
  version: string;
  updated: boolean;
}

export interface UpdatePluginVersionResult {
  plugins: PluginVersionUpdateResult[];
}

async function applyNextPluginVersion({
  plugin,
  manifestPath,
  currentContent,
  currentVersion,
  previousVersion,
  releaseDate,
}: {
  plugin: MarketplacePlugin;
  manifestPath: string;
  currentContent: string;
  currentVersion: string;
  previousVersion: string;
  releaseDate: string;
}): Promise<PluginVersionUpdateResult> {
  const nextVersion = nextPluginVersion(previousVersion, releaseDate);
  const updated = currentVersion !== nextVersion;

  if (updated) {
    await writeFile(
      manifestPath,
      replaceManifestVersion(currentContent, plugin.manifestPath, nextVersion),
    );
  }

  return {
    name: plugin.name,
    manifestPath: plugin.manifestPath,
    version: nextVersion,
    updated,
  };
}

export async function updatePluginVersion({
  repository,
  targetRevision,
  now = new Date(),
}: UpdatePluginVersionOptions): Promise<UpdatePluginVersionResult> {
  const currentPlugins = marketplacePlugins(
    await readFile(resolve(repository, marketplacePath), "utf8"),
  );
  const comparisonBase = readMergeBase(repository, targetRevision, "HEAD");
  const comparisonPlugins = new Map(
    readMarketplacePluginsAtRevision(repository, comparisonBase).map(
      (plugin) => [plugin.name, plugin],
    ),
  );
  const changedFiles = listWorkingTreeChangedFiles(repository, comparisonBase);
  const releaseDate = releaseDateForTimestamp(now);
  const results: PluginVersionUpdateResult[] = [];

  for (const currentPlugin of currentPlugins) {
    const manifestPath = resolve(repository, currentPlugin.manifestPath);
    const currentContent = await readFile(manifestPath, "utf8");
    const currentVersion = readManifestVersion(
      currentContent,
      currentPlugin.manifestPath,
    );
    const comparisonPlugin = comparisonPlugins.get(currentPlugin.name);

    let previousVersion: string | undefined;
    if (comparisonPlugin === undefined) {
      previousVersion = "";
    } else if (
      changedFiles.some(
        (path) =>
          isVersionedContent(path, comparisonPlugin.manifestPath) ||
          isVersionedContent(path, currentPlugin.manifestPath),
      )
    ) {
      previousVersion = readManifestVersion(
        comparisonPlugin.content,
        `${comparisonPlugin.manifestPath} at ${comparisonBase}`,
      );
    }

    if (previousVersion === undefined) {
      results.push({
        name: currentPlugin.name,
        manifestPath: currentPlugin.manifestPath,
        version: currentVersion,
        updated: false,
      });
      continue;
    }

    results.push(
      await applyNextPluginVersion({
        plugin: currentPlugin,
        manifestPath,
        currentContent,
        currentVersion,
        previousVersion,
        releaseDate,
      }),
    );
  }

  return { plugins: results };
}

async function run(arguments_: string[]): Promise<number> {
  const [targetRevision] = arguments_;
  if (arguments_.length !== 1 || targetRevision === undefined) {
    process.stderr.write("Usage: node update.ts <target-revision>\n");
    return 2;
  }

  const repository = fileURLToPath(new URL("../../../", import.meta.url));

  try {
    const result = await updatePluginVersion({ repository, targetRevision });
    if (result.plugins.length === 0) {
      process.stdout.write("No marketplace plugins found.\n");
      return 0;
    }
    for (const plugin of result.plugins) {
      const message = plugin.updated
        ? `Updated plugin '${plugin.name}' version to ${plugin.version}.`
        : `Plugin '${plugin.name}' version remains ${plugin.version}.`;
      process.stdout.write(`${message}\n`);
    }
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Plugin version update failed: ${message}\n`);
    return 1;
  }
}

const invokedPath = process.argv[1];

if (
  invokedPath !== undefined &&
  resolve(invokedPath) === resolve(fileURLToPath(import.meta.url))
) {
  process.exitCode = await run(process.argv.slice(2));
}
