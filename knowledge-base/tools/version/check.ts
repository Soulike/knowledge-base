import { posix, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  listChangedFiles,
  readCommitterTimestamp,
  readKnowledgeBasePluginAtRevision,
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

export interface CheckPluginVersionResult {
  checked: boolean;
  version: string;
}

function isVersionedContent(path: string, manifestPath: string): boolean {
  const pluginDirectory = posix.dirname(manifestPath);
  return ["knowledge", "references", "skills"].some((directory) =>
    path.startsWith(`${posix.join(pluginDirectory, directory)}/`),
  );
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
  const comparisonPlugin = readKnowledgeBasePluginAtRevision(
    repository,
    comparisonBase,
  );
  const targetPlugin = readKnowledgeBasePluginAtRevision(
    repository,
    targetRevision,
  );
  const headPlugin = readKnowledgeBasePluginAtRevision(
    repository,
    headRevision,
  );
  const comparisonVersion = readManifestVersion(
    comparisonPlugin.content,
    `${comparisonPlugin.manifestPath} at ${comparisonBase}`,
  );
  const targetVersion = readManifestVersion(
    targetPlugin.content,
    `${targetPlugin.manifestPath} at ${targetRevision}`,
  );
  const headVersion = readManifestVersion(
    headPlugin.content,
    `${headPlugin.manifestPath} at ${headRevision}`,
  );
  const changedFiles = listChangedFiles(
    repository,
    comparisonBase,
    headRevision,
  );
  const contentChanged = changedFiles.some(
    (path) =>
      isVersionedContent(path, comparisonPlugin.manifestPath) ||
      isVersionedContent(path, headPlugin.manifestPath),
  );
  const versionChanged = headVersion !== comparisonVersion;

  if (!contentChanged && !versionChanged) {
    return { checked: false, version: headVersion };
  }

  if (
    !contentChanged &&
    versionChanged &&
    parsePluginVersion(comparisonVersion) !== undefined
  ) {
    throw new Error(
      "The knowledge-base plugin version changed, but its Knowledge, Skill references, and usage Skills did not.",
    );
  }

  const committerTimestamp = readCommitterTimestamp(repository, headRevision);
  const releaseDate = releaseDateForTimestamp(committerTimestamp);
  const expectedVersion = nextPluginVersion(targetVersion, releaseDate);

  if (headVersion !== expectedVersion) {
    const reason = contentChanged
      ? "Versioned content changed."
      : "The version field changed.";
    throw new Error(
      `${reason} Expected knowledge-base plugin version '${expectedVersion}' from target '${targetVersion}' and head committer timestamp '${committerTimestamp}', but found '${headVersion}'.`,
    );
  }

  return { checked: true, version: headVersion };
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
    const message = result.checked
      ? `Knowledge-base plugin version is ${result.version}.`
      : `Knowledge-base plugin version remains ${result.version}; no versioned content changed.`;
    process.stdout.write(`${message}\n`);
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(
      `Knowledge-base plugin version check failed: ${message}\n`,
    );
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
