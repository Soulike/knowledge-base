import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { copyFile, mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
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
const script = new URL("./findings-gate-cli.ts", import.meta.url);

async function runGate(
  items: unknown[],
  gateScript = script.pathname,
): Promise<void> {
  const directory = await mkdtemp(
    join(tmpdir(), "content-verification-findings-gate-"),
  );
  const nested = join(directory, "nested");
  await mkdir(nested);
  try {
    await Promise.all([
      writeFile(
        join(directory, "content-verification-targets.json"),
        JSON.stringify(manifest),
      ),
      writeFile(
        join(nested, "agent_output.json"),
        JSON.stringify({ errors: [], items }),
      ),
    ]);
    await executeFile(process.execPath, [gateScript], {
      env: {
        ...process.env,
        CONTENT_VERIFICATION_AGENT_RESULT: "success",
        CONTENT_VERIFICATION_ARTIFACT_DIRECTORY: directory,
        CONTENT_VERIFICATION_EXPECTED_REVISION: revision,
        CONTENT_VERIFICATION_SCOPE: manifest.scope,
      },
    });
  } finally {
    await rm(directory, { force: true, recursive: true });
  }
}

async function runIsolatedGate(items: unknown[]): Promise<void> {
  const directory = await mkdtemp(
    join(tmpdir(), "content-verification-findings-runtime-"),
  );
  try {
    const cliDirectory = join(directory, "content-verification-cli");
    const contractDirectory = join(directory, "content-verification-contract");
    await Promise.all([mkdir(cliDirectory), mkdir(contractDirectory)]);
    for (const file of ["artifacts.ts", "findings-gate-cli.ts"]) {
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
    await runGate(items, join(cliDirectory, "findings-gate-cli.ts"));
  } finally {
    await rm(directory, { force: true, recursive: true });
  }
}

describe("content verification findings gate CLI", () => {
  it("accepts a downloaded no-action completion", async () => {
    await assert.doesNotReject(() =>
      runGate([
        { type: "noop", message: "Review completed with no findings." },
      ]),
    );
  });

  it("runs without installed workspace dependencies", async () => {
    await assert.doesNotReject(() =>
      runIsolatedGate([{ type: "noop", message: "No action is needed." }]),
    );
  });

  it("exits nonzero for downloaded incomplete work", async () => {
    for (const type of [
      "report_incomplete",
      "report_missing_tool",
      "report_missing_data",
    ]) {
      await assert.rejects(
        () =>
          runGate([
            {
              type: "add_finding",
              finding_id: "earlier-finding",
              target_id: "knowledge/a.md",
              classification: "modification-required",
              finding: "A finding recorded before review became incomplete.",
            },
            { type, reason: "Source unavailable." },
          ]),
        /Agent reported incomplete work/u,
      );
    }
  });

  it("rejects a missing completion signal", async () => {
    await assert.rejects(
      () => runGate([]),
      /empty finding result requires a terminal noop/u,
    );
  });
});
