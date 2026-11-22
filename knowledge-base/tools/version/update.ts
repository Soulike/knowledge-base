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

interface PlannedPluginVersionUpdate {
  plugin: MarketplacePlugin;
  manifestPath: string;
  currentContent: string;
  currentVersion: string;
  nextVersion: string;
  updated: boolean;
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
  const plannedUpdates: PlannedPluginVersionUpdate[] = [];

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
      plannedUpdates.push({
        plugin: currentPlugin,
        manifestPath,
        currentContent,
        currentVersion,
        nextVersion: currentVersion,
        updated: false,
      });
      continue;
    }

    const nextVersion = nextPluginVersion(previousVersion, releaseDate);
    plannedUpdates.push({
      plugin: currentPlugin,
      manifestPath,
      currentContent,
      currentVersion,
      nextVersion,
      updated: currentVersion !== nextVersion,
    });
  }

  const results: PluginVersionUpdateResult[] = [];
  for (const planned of plannedUpdates) {
    if (planned.updated) {
      await writeFile(
        planned.manifestPath,
        replaceManifestVersion(
          planned.currentContent,
          planned.plugin.manifestPath,
          planned.nextVersion,
        ),
      );
    }

    results.push({
      name: planned.plugin.name,
      manifestPath: planned.plugin.manifestPath,
      version: planned.nextVersion,
      updated: planned.updated,
    });
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
