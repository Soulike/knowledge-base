import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  knowledgeBaseManifestPath,
  marketplacePath,
  readKnowledgeBasePluginAtRevision,
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

export async function updatePluginVersion({
  repository,
  targetRevision,
  now = new Date(),
}: UpdatePluginVersionOptions): Promise<string> {
  const relativeManifestPath = knowledgeBaseManifestPath(
    await readFile(resolve(repository, marketplacePath), "utf8"),
  );
  const manifestPath = resolve(repository, relativeManifestPath);
  const comparisonBase = readMergeBase(repository, targetRevision, "HEAD");
  const comparisonPlugin = readKnowledgeBasePluginAtRevision(
    repository,
    comparisonBase,
  );
  const currentContent = await readFile(manifestPath, "utf8");
  const comparisonVersion = readManifestVersion(
    comparisonPlugin.content,
    `${comparisonPlugin.manifestPath} at ${comparisonBase}`,
  );
  const currentVersion = readManifestVersion(
    currentContent,
    relativeManifestPath,
  );
  const releaseDate = releaseDateForTimestamp(now);
  const nextVersion = nextPluginVersion(comparisonVersion, releaseDate);

  if (currentVersion !== nextVersion) {
    await writeFile(
      manifestPath,
      replaceManifestVersion(currentContent, relativeManifestPath, nextVersion),
    );
  }

  return nextVersion;
}

async function run(arguments_: string[]): Promise<number> {
  const [targetRevision] = arguments_;
  if (arguments_.length !== 1 || targetRevision === undefined) {
    process.stderr.write("Usage: node update.ts <target-revision>\n");
    return 2;
  }

  const repository = fileURLToPath(new URL("../../../", import.meta.url));

  try {
    const version = await updatePluginVersion({ repository, targetRevision });
    process.stdout.write(`Knowledge-base plugin version: ${version}\n`);
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(
      `Knowledge-base plugin version update failed: ${message}\n`,
    );
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
