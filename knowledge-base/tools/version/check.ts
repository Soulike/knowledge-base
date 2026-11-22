import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  isVersionedContent,
  listChangedFiles,
  type PluginManifestAtRevision,
  readCommitterTimestamp,
  readMarketplacePluginsAtRevision,
  readMergeBase,
} from "./repository.ts";
import {
  nextPluginVersion,
  parsePluginVersion,
  readManifestVersion,
  releaseDateForTimestamp,
} from "./version.ts";

export interface CheckPluginVersionOptions {
  repository: string;
  targetRevision: string;
  headRevision: string;
}

export interface PluginVersionCheckResult {
  name: string;
  checked: boolean;
  version: string;
}

export interface CheckPluginVersionResult {
  plugins: PluginVersionCheckResult[];
}

function checkSinglePlugin({
  headPlugin,
  comparisonPlugin,
  targetPlugin,
  comparisonBase,
  targetRevision,
  headRevision,
  changedFiles,
  committerTimestamp,
  releaseDate,
}: {
  headPlugin: PluginManifestAtRevision;
  comparisonPlugin: PluginManifestAtRevision | undefined;
  targetPlugin: PluginManifestAtRevision | undefined;
  comparisonBase: string;
  targetRevision: string;
  headRevision: string;
  changedFiles: string[];
  committerTimestamp: string;
  releaseDate: string;
}): PluginVersionCheckResult {
  const headVersion = readManifestVersion(
    headPlugin.content,
    `${headPlugin.manifestPath} at ${headRevision}`,
  );

  if (comparisonPlugin === undefined && targetPlugin === undefined) {
    const expectedVersion = nextPluginVersion("", releaseDate);
    if (headVersion !== expectedVersion) {
      throw new Error(
        `Expected new '${headPlugin.name}' plugin version '${expectedVersion}' from head committer timestamp '${committerTimestamp}', but found '${headVersion}'.`,
      );
    }
    return { name: headPlugin.name, checked: true, version: headVersion };
  }

  const comparisonVersion =
    comparisonPlugin === undefined
      ? undefined
      : readManifestVersion(
          comparisonPlugin.content,
          `${comparisonPlugin.manifestPath} at ${comparisonBase}`,
        );
  const targetVersion =
    targetPlugin === undefined
      ? comparisonVersion
      : readManifestVersion(
          targetPlugin.content,
          `${targetPlugin.manifestPath} at ${targetRevision}`,
        );

  const contentChanged = changedFiles.some(
    (path) =>
      (comparisonPlugin !== undefined &&
        isVersionedContent(path, comparisonPlugin.manifestPath)) ||
      isVersionedContent(path, headPlugin.manifestPath),
  );
  const versionChanged =
    comparisonVersion === undefined || headVersion !== comparisonVersion;

  if (!contentChanged && !versionChanged) {
    return { name: headPlugin.name, checked: false, version: headVersion };
  }

  if (
    !contentChanged &&
    versionChanged &&
    comparisonVersion !== undefined &&
    parsePluginVersion(comparisonVersion) !== undefined
  ) {
    throw new Error(
      `The '${headPlugin.name}' plugin version changed, but its Knowledge, Skill references, and usage Skills did not.`,
    );
  }

  const expectedVersion = nextPluginVersion(targetVersion ?? "", releaseDate);

  if (headVersion !== expectedVersion) {
    const reason = contentChanged
      ? "Versioned content changed."
      : "The version field changed.";
    throw new Error(
      `${reason} Expected '${headPlugin.name}' plugin version '${expectedVersion}' from target '${targetVersion ?? ""}' and head committer timestamp '${committerTimestamp}', but found '${headVersion}'.`,
    );
  }

  return { name: headPlugin.name, checked: true, version: headVersion };
}

export function checkPluginVersion({
  repository,
  targetRevision,
  headRevision,
}: CheckPluginVersionOptions): CheckPluginVersionResult {
  const comparisonBase = readMergeBase(
    repository,
    targetRevision,
    headRevision,
  );
  const comparisonPlugins = new Map(
    readMarketplacePluginsAtRevision(repository, comparisonBase).map(
      (plugin) => [plugin.name, plugin],
    ),
  );
  const targetPlugins = new Map(
    readMarketplacePluginsAtRevision(repository, targetRevision).map(
      (plugin) => [plugin.name, plugin],
    ),
  );
  const headPlugins = readMarketplacePluginsAtRevision(
    repository,
    headRevision,
  );
  const changedFiles = listChangedFiles(
    repository,
    comparisonBase,
    headRevision,
  );
  const committerTimestamp = readCommitterTimestamp(repository, headRevision);
  const releaseDate = releaseDateForTimestamp(committerTimestamp);

  const results: PluginVersionCheckResult[] = [];
  const errors: string[] = [];

  for (const headPlugin of headPlugins) {
    try {
      results.push(
        checkSinglePlugin({
          headPlugin,
          comparisonPlugin: comparisonPlugins.get(headPlugin.name),
          targetPlugin: targetPlugins.get(headPlugin.name),
          comparisonBase,
          targetRevision,
          headRevision,
          changedFiles,
          committerTimestamp,
          releaseDate,
        }),
      );
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  return { plugins: results };
}

function run(arguments_: string[]): number {
  if (arguments_.length !== 2) {
    process.stderr.write(
      "Usage: node check.ts <target-revision> <head-revision>\n",
    );
    return 2;
  }

  const [targetRevision, headRevision] = arguments_;

  if (targetRevision === undefined || headRevision === undefined) {
    return 2;
  }

  try {
    const result = checkPluginVersion({
      repository: process.cwd(),
      targetRevision,
      headRevision,
    });
    for (const plugin of result.plugins) {
      const message = plugin.checked
        ? `Plugin '${plugin.name}' version is ${plugin.version}.`
        : `Plugin '${plugin.name}' version remains ${plugin.version}; no versioned content changed.`;
      process.stdout.write(`${message}\n`);
    }
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Plugin version check failed: ${message}\n`);
    return 1;
  }
}

const invokedPath = process.argv[1];

if (
  invokedPath !== undefined &&
  resolve(invokedPath) === resolve(fileURLToPath(import.meta.url))
) {
  process.exitCode = run(process.argv.slice(2));
}
