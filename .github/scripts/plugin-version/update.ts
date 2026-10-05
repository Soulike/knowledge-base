import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  knowledgeBaseManifestPath,
  marketplacePath,
  readKnowledgeBasePluginAtRevision,
} from "./repository.ts";
import {
  nextPluginVersion,
  readManifestVersion,
  releaseDateForTimestamp,
  replaceManifestVersion,
} from "./version.ts";

export interface UpdatePluginVersionOptions {
  repository: string;
  baseRevision: string;
  now?: Date;
}

export async function updatePluginVersion({
  repository,
  baseRevision,
  now = new Date(),
}: UpdatePluginVersionOptions): Promise<string> {
  const relativeManifestPath = knowledgeBaseManifestPath(
    await readFile(resolve(repository, marketplacePath), "utf8"),
  );
  const manifestPath = resolve(repository, relativeManifestPath);
  const basePlugin = readKnowledgeBasePluginAtRevision(
    repository,
    baseRevision,
  );
  const currentContent = await readFile(manifestPath, "utf8");
  const baseVersion = readManifestVersion(
    basePlugin.content,
    `${basePlugin.manifestPath} at ${baseRevision}`,
  );
  const currentVersion = readManifestVersion(
    currentContent,
    relativeManifestPath,
  );
  const releaseDate = releaseDateForTimestamp(now);
  const targetVersion = nextPluginVersion(baseVersion, releaseDate);

  if (currentVersion !== targetVersion) {
    await writeFile(
      manifestPath,
      replaceManifestVersion(
        currentContent,
        relativeManifestPath,
        targetVersion,
      ),
    );
  }

  return targetVersion;
}

async function run(arguments_: string[]): Promise<number> {
  if (arguments_.length > 1) {
    process.stderr.write("Usage: node update.ts [base-revision]\n");
    return 2;
  }

  const repository = fileURLToPath(new URL("../../../", import.meta.url));
  const baseRevision = arguments_[0] ?? "origin/main";

  try {
    const version = await updatePluginVersion({ repository, baseRevision });
    process.stdout.write(`Primary plugin version: ${version}\n`);
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
