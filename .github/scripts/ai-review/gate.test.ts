import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test, { type TestContext } from "node:test";

import {
  reviewVerdictFile,
  writeReviewVerdict,
  type ReviewVerdict,
} from "./review-verdict.ts";

const gatePath = fileURLToPath(new URL("./gate.ts", import.meta.url));

async function fixture(t: TestContext): Promise<{
  artifactDirectory: string;
  runnerTemp: string;
}> {
  const runnerTemp = await mkdtemp(join(tmpdir(), "ai-review-gate-"));
  t.after(async () => {
    await rm(runnerTemp, { force: true, recursive: true });
  });
  const artifactDirectory = join(runnerTemp, "ai-review");
  await mkdir(artifactDirectory);
  return { artifactDirectory, runnerTemp };
}

function runGate(artifactDirectory: string, runnerTemp: string) {
  return spawnSync(process.execPath, [gatePath], {
    encoding: "utf8",
    env: {
      ...process.env,
      AI_REVIEW_ARTIFACT_DIRECTORY: artifactDirectory,
      RUNNER_TEMP: runnerTemp,
    },
  });
}

async function runPublishedVerdict(t: TestContext, verdict: ReviewVerdict) {
  const subject = await fixture(t);
  await writeReviewVerdict(subject.artifactDirectory, verdict);
  return runGate(subject.artifactDirectory, subject.runnerTemp);
}

test("passes an approved review", async (t) => {
  const result = await runPublishedVerdict(t, "approved");

  assert.equal(result.status, 0);
  assert.equal(result.stdout, "AI review approved.\n");
  assert.equal(result.stderr, "");
});

test("fails a review that needs changes", async (t) => {
  const result = await runPublishedVerdict(t, "needs-change");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /AI review requires changes\./u);
});

test("fails closed when the published verdict is missing", async (t) => {
  const subject = await fixture(t);

  const result = runGate(subject.artifactDirectory, subject.runnerTemp);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /verdict\.txt/u);
});

test("fails closed when the published verdict is invalid", async (t) => {
  const subject = await fixture(t);
  await writeFile(
    join(subject.artifactDirectory, reviewVerdictFile),
    "unexpected\n",
  );

  const result = runGate(subject.artifactDirectory, subject.runnerTemp);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /contains an invalid review verdict/u);
});
