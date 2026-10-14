import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";

import { readContentVerificationArtifacts } from "./artifacts.ts";

async function fixture(): Promise<string> {
  const directory = await mkdtemp(
    join(tmpdir(), "content-verification-artifacts-"),
  );
  await mkdir(join(directory, "content-verification-target-manifest"));
  await writeFile(
    join(
      directory,
      "content-verification-target-manifest",
      "content-verification-targets.json",
    ),
    JSON.stringify({ revision: "a".repeat(40) }),
  );
  return directory;
}

describe("readContentVerificationArtifacts", () => {
  it("accepts byte-identical Agent and fallback output copies", async () => {
    const directory = await fixture();
    try {
      const content = JSON.stringify({ errors: [], items: [] });
      for (const artifact of ["agent", "agent-output-fallback"]) {
        await mkdir(join(directory, artifact));
        await writeFile(
          join(directory, artifact, "agent_output.json"),
          content,
        );
      }

      assert.deepEqual(await readContentVerificationArtifacts(directory), {
        manifestValue: { revision: "a".repeat(40) },
        outputValue: { errors: [], items: [] },
      });
    } finally {
      await rm(directory, { force: true, recursive: true });
    }
  });

  it("rejects missing or disagreeing Agent output copies", async () => {
    const missingDirectory = await fixture();
    try {
      await assert.rejects(
        () => readContentVerificationArtifacts(missingDirectory),
        /expected at least one agent_output\.json/u,
      );
    } finally {
      await rm(missingDirectory, { force: true, recursive: true });
    }

    const ambiguousDirectory = await fixture();
    try {
      await Promise.all(
        [
          ["agent", { errors: [], items: [] }],
          [
            "agent-output-fallback",
            { errors: [], items: [{ type: "noop", message: "Different." }] },
          ],
        ].map(async ([artifact, value]) => {
          const artifactDirectory = join(ambiguousDirectory, String(artifact));
          await mkdir(artifactDirectory);
          await writeFile(
            join(artifactDirectory, "agent_output.json"),
            JSON.stringify(value),
          );
        }),
      );

      await assert.rejects(
        () => readContentVerificationArtifacts(ambiguousDirectory),
        /agent_output\.json copies disagree/u,
      );
    } finally {
      await rm(ambiguousDirectory, { force: true, recursive: true });
    }
  });

  it("rejects duplicate target manifests", async () => {
    const directory = await fixture();
    try {
      await mkdir(join(directory, "duplicate-manifest"));
      await writeFile(
        join(
          directory,
          "duplicate-manifest",
          "content-verification-targets.json",
        ),
        JSON.stringify({ revision: "a".repeat(40) }),
      );
      await mkdir(join(directory, "agent"));
      await writeFile(
        join(directory, "agent", "agent_output.json"),
        JSON.stringify({ errors: [], items: [] }),
      );

      await assert.rejects(
        () => readContentVerificationArtifacts(directory),
        /expected exactly one content-verification-targets\.json, found 2/u,
      );
    } finally {
      await rm(directory, { force: true, recursive: true });
    }
  });
});
