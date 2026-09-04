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
const script = new URL("./agentic-gate-cli.ts", import.meta.url);

async function runGate(
  items: unknown[],
  gateScript = script.pathname,
): Promise<void> {
  const directory = await mkdtemp(join(tmpdir(), "content-verification-gate-"));
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
    join(tmpdir(), "content-verification-gate-runtime-"),
  );
  try {
    await Promise.all([
      copyFile(
        new URL("./agentic-gate-cli.ts", import.meta.url),
        join(directory, "agentic-gate-cli.ts"),
      ),
      copyFile(
        new URL("./agentic-gate.ts", import.meta.url),
        join(directory, "agentic-gate.ts"),
      ),
      copyFile(
        new URL("./scope.ts", import.meta.url),
        join(directory, "scope.ts"),
      ),
    ]);
    await runGate(items, join(directory, "agentic-gate-cli.ts"));
  } finally {
    await rm(directory, { force: true, recursive: true });
  }
}

describe("content verification gate CLI", () => {
  it("accepts a downloaded noop artifact", async () => {
    await assert.doesNotReject(() =>
      runGate([{ type: "noop", message: "No issue is needed." }]),
    );
  });

  it("runs without installed workspace dependencies", async () => {
    await assert.doesNotReject(() =>
      runIsolatedGate([{ type: "noop", message: "No issue is needed." }]),
    );
  });

  it("exits nonzero for downloaded incomplete work", async () => {
    await assert.rejects(
      () =>
        runGate([
          {
            type: "report_incomplete",
            reason: "Source unavailable.",
          },
        ]),
      /verification gate/u,
    );
  });
});
