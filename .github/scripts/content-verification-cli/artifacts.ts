import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

export type ContentVerificationArtifacts = {
  manifestValue: unknown;
  outputValue: unknown;
};

async function findFiles(
  directory: string,
  basename: string,
): Promise<string[]> {
  const matches: string[] = [];
  async function visit(current: string): Promise<void> {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) {
        await visit(path);
      } else if (entry.isFile() && entry.name === basename) {
        matches.push(path);
      }
    }
  }
  await visit(directory);
  return matches.sort();
}

function requireOneFile(paths: string[], basename: string): string {
  const path = paths[0];
  if (paths.length !== 1 || path === undefined) {
    throw new Error(
      `Content verification artifacts: expected exactly one ${basename}, found ${String(paths.length)}.`,
    );
  }
  return path;
}

function requireFiles(
  paths: string[],
  basename: string,
): { additional: string[]; first: string } {
  const [first, ...additional] = paths;
  if (first === undefined) {
    throw new Error(
      `Content verification artifacts: expected at least one ${basename}, found 0.`,
    );
  }
  return { additional, first };
}

export async function readContentVerificationArtifacts(
  directory: string,
): Promise<ContentVerificationArtifacts> {
  const artifactDirectory = resolve(directory);
  const [manifestPaths, outputPaths] = await Promise.all([
    findFiles(artifactDirectory, "content-verification-targets.json"),
    findFiles(artifactDirectory, "agent_output.json"),
  ]);
  const manifestPath = requireOneFile(
    manifestPaths,
    "content-verification-targets.json",
  );
  const outputFiles = requireFiles(outputPaths, "agent_output.json");
  const [manifestContent, firstOutputContent, additionalOutputContents] =
    await Promise.all([
      readFile(manifestPath, "utf8"),
      readFile(outputFiles.first, "utf8"),
      Promise.all(outputFiles.additional.map((path) => readFile(path, "utf8"))),
    ]);
  const outputContents = [firstOutputContent, ...additionalOutputContents];
  if (new Set(outputContents).size !== 1) {
    throw new Error(
      `Content verification artifacts: ${String(outputPaths.length)} agent_output.json copies disagree.`,
    );
  }
  const manifestValue = JSON.parse(manifestContent) as unknown;
  const outputValue = JSON.parse(firstOutputContent) as unknown;
  return { manifestValue, outputValue };
}
