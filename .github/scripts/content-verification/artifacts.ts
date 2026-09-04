import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

export type ContentVerificationArtifacts = {
  manifestValue: unknown;
  outputValue: unknown;
};

async function findFile(directory: string, basename: string): Promise<string> {
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
  if (matches.length !== 1) {
    throw new Error(
      `Content verification artifacts: expected exactly one ${basename}, found ${String(matches.length)}.`,
    );
  }
  return matches[0] as string;
}

export async function readContentVerificationArtifacts(
  directory: string,
): Promise<ContentVerificationArtifacts> {
  const artifactDirectory = resolve(directory);
  const [manifestPath, outputPath] = await Promise.all([
    findFile(artifactDirectory, "content-verification-targets.json"),
    findFile(artifactDirectory, "agent_output.json"),
  ]);
  const [manifestValue, outputValue] = await Promise.all([
    readFile(manifestPath, "utf8").then(
      (content) => JSON.parse(content) as unknown,
    ),
    readFile(outputPath, "utf8").then(
      (content) => JSON.parse(content) as unknown,
    ),
  ]);
  return { manifestValue, outputValue };
}
