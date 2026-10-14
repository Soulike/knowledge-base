import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { copyFile, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { it } from "node:test";
import { promisify } from "node:util";

const executeFile = promisify(execFile);
const revision = "a".repeat(40);
const manifest = {
  revision,
  reviewTargetIds: ["knowledge/a.md"],
  scope: "time-sensitive-knowledge",
  targetCatalog: [
    {
      files: ["knowledge/a.md"],
      id: "knowledge/a.md",
      kind: "knowledge",
      knowledgeType: "time-sensitive",
    },
  ],
};

async function runPublisher(script: string): Promise<string> {
  const artifactDirectory = await mkdtemp(
    join(tmpdir(), "content-verification-publication-artifacts-"),
  );
  const outputDirectory = join(artifactDirectory, "agent");
  await mkdir(outputDirectory);
  try {
    await Promise.all([
      writeFile(
        join(artifactDirectory, "content-verification-targets.json"),
        JSON.stringify(manifest),
      ),
      writeFile(
        join(outputDirectory, "agent_output.json"),
        JSON.stringify({
          errors: [],
          items: [{ type: "noop", message: "No findings." }],
        }),
      ),
    ]);
    const { stdout } = await executeFile(process.execPath, [script], {
      env: {
        ...process.env,
        CONTENT_VERIFICATION_AGENT_RESULT: "success",
        CONTENT_VERIFICATION_ARTIFACT_DIRECTORY: artifactDirectory,
        CONTENT_VERIFICATION_EXPECTED_REVISION: revision,
        CONTENT_VERIFICATION_RUN_URL:
          "https://github.com/Soulike/knowledge-base/actions/runs/123",
        CONTENT_VERIFICATION_SCOPE: manifest.scope,
        GITHUB_API_URL: "https://api.github.invalid",
        GITHUB_REPOSITORY: "Soulike/knowledge-base",
        GITHUB_TOKEN: "unused-for-noop",
      },
    });
    return stdout;
  } finally {
    await rm(artifactDirectory, { force: true, recursive: true });
  }
}

it("publishes a no-finding result without installed workspace dependencies", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "content-verification-publication-runtime-"),
  );
  try {
    const cliDirectory = join(directory, "content-verification-cli");
    const contractDirectory = join(directory, "content-verification-contract");
    const publicationDirectory = join(
      directory,
      "content-verification-publication",
    );
    await Promise.all([
      mkdir(cliDirectory),
      mkdir(contractDirectory),
      mkdir(publicationDirectory),
    ]);
    for (const file of ["artifacts.ts", "findings-publication-cli.ts"]) {
      await copyFile(
        new URL(`./${file}`, import.meta.url),
        join(cliDirectory, file),
      );
    }
    for (const file of [
      "finding-events.ts",
      "manifest-validation.ts",
      "result.ts",
      "scope.ts",
    ]) {
      await copyFile(
        new URL(`../content-verification-contract/${file}`, import.meta.url),
        join(contractDirectory, file),
      );
    }
    for (const file of [
      "finding-publication.ts",
      "github-issues.ts",
      "index.ts",
    ]) {
      await copyFile(
        new URL(`../content-verification-publication/${file}`, import.meta.url),
        join(publicationDirectory, file),
      );
    }

    assert.equal(
      await runPublisher(join(cliDirectory, "findings-publication-cli.ts")),
      "Content verification findings published: 0 created, 0 exact duplicate(s) suppressed.\n",
    );
  } finally {
    await rm(directory, { force: true, recursive: true });
  }
});
