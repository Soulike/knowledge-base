import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import {
  parseVerificationManifest,
  validateAgenticVerificationOutput,
} from "./agentic-gate.ts";

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Content verification gate: ${name} is required.`);
  }
  return value;
}

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
      `Content verification gate: expected exactly one ${basename}, found ${String(matches.length)}.`,
    );
  }
  return matches[0] as string;
}

if (required("CONTENT_VERIFICATION_AGENT_RESULT") !== "success") {
  throw new Error("Content verification gate: Agent job did not succeed.");
}

const artifactDirectory = resolve(
  required("CONTENT_VERIFICATION_ARTIFACT_DIRECTORY"),
);
const expectedRevision = required("CONTENT_VERIFICATION_EXPECTED_REVISION");
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
const manifest = parseVerificationManifest(manifestValue, expectedRevision);
validateAgenticVerificationOutput(manifest, outputValue);
process.stdout.write("Content verification safe outputs passed the gate.\n");
