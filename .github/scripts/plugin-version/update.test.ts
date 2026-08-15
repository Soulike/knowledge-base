import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { updatePluginVersion } from "./update.ts";

function git(repository: string, arguments_: string[]): string {
  return execFileSync("git", ["-C", repository, ...arguments_], {
    encoding: "utf8",
  }).trim();
}

test("repeated updates keep one version for the PR", async (t) => {
  const repository = await mkdtemp(join(tmpdir(), "plugin-version-update-"));
  t.after(() => rm(repository, { force: true, recursive: true }));
  git(repository, ["init", "--initial-branch=main"]);
  git(repository, ["config", "user.name", "Plugin Version Test"]);
  git(repository, ["config", "user.email", "plugin-version@example.com"]);
  await writeFile(
    join(repository, "plugin.json"),
    `${JSON.stringify({ name: "knowledge-base", version: "2026.8.15-1" }, null, 2)}\n`,
  );
  git(repository, ["add", "plugin.json"]);
  git(repository, ["commit", "-m", "base"]);
  const base = git(repository, ["rev-parse", "HEAD"]);

  const options = {
    repository,
    baseRevision: base,
    now: new Date("2026-08-15T10:00:00+08:00"),
  };
  assert.equal(await updatePluginVersion(options), "2026.8.15-2");
  const afterFirstUpdate = await readFile(
    join(repository, "plugin.json"),
    "utf8",
  );
  assert.equal(await updatePluginVersion(options), "2026.8.15-2");
  assert.equal(
    await readFile(join(repository, "plugin.json"), "utf8"),
    afterFirstUpdate,
  );
});
