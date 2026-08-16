import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  listChangedFiles,
  readCommitterTimestamp,
  readFileAtRevision,
} from "./repository.ts";
import {
  nextPluginVersion,
  parsePluginVersion,
  readManifestVersion,
  releaseDateForTimestamp,
} from "./version.ts";

export interface CheckPluginVersionOptions {
  repository: string;
  baseRevision: string;
  headRevision: string;
}

export interface CheckPluginVersionResult {
  checked: boolean;
  version: string;
}

function isVersionedContent(path: string): boolean {
  return (
    path.startsWith("knowledge/") ||
    path.startsWith("references/") ||
    path.startsWith("skills/")
  );
}

export function checkPluginVersion({
  repository,
  baseRevision,
  headRevision,
}: CheckPluginVersionOptions): CheckPluginVersionResult {
  const baseContent = readFileAtRevision(
    repository,
    baseRevision,
    "plugin.json",
  );
  const headContent = readFileAtRevision(
    repository,
    headRevision,
    "plugin.json",
  );
  const baseVersion = readManifestVersion(
    baseContent,
    `plugin.json at ${baseRevision}`,
  );
  const headVersion = readManifestVersion(
    headContent,
    `plugin.json at ${headRevision}`,
  );
  const changedFiles = listChangedFiles(repository, baseRevision, headRevision);
  const contentChanged = changedFiles.some(isVersionedContent);
  const versionChanged = headVersion !== baseVersion;

  if (!contentChanged && !versionChanged) {
    return { checked: false, version: headVersion };
  }

  if (
    !contentChanged &&
    versionChanged &&
    parsePluginVersion(baseVersion) !== undefined
  ) {
    throw new Error(
      "The primary plugin version changed, but root Knowledge, Skill references, and usage Skills did not.",
    );
  }

  const committerTimestamp = readCommitterTimestamp(repository, headRevision);
  const releaseDate = releaseDateForTimestamp(committerTimestamp);
  const expectedVersion = nextPluginVersion(baseVersion, releaseDate);

  if (headVersion !== expectedVersion) {
    const reason = contentChanged
      ? "Versioned content changed."
      : "The version field changed.";
    throw new Error(
      `${reason} Expected primary plugin version '${expectedVersion}' from base '${baseVersion}' and head committer timestamp '${committerTimestamp}', but found '${headVersion}'.`,
    );
  }

  return { checked: true, version: headVersion };
}

function run(arguments_: string[]): number {
  if (arguments_.length !== 2) {
    process.stderr.write(
      "Usage: node check.ts <base-revision> <head-revision>\n",
    );
    return 2;
  }

  const [baseRevision, headRevision] = arguments_;

  if (baseRevision === undefined || headRevision === undefined) {
    return 2;
  }

  try {
    const result = checkPluginVersion({
      repository: process.cwd(),
      baseRevision,
      headRevision,
    });
    const message = result.checked
      ? `Primary plugin version is ${result.version}.`
      : `Primary plugin version remains ${result.version}; no versioned content changed.`;
    process.stdout.write(`${message}\n`);
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
