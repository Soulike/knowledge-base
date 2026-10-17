import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { updatePluginVersion } from "./update.ts";

test("requires an explicit PR target revision", () => {
  const updaterPath = fileURLToPath(new URL("./update.ts", import.meta.url));
  const result = spawnSync(process.execPath, [updaterPath], {
    encoding: "utf8",
  });

  assert.equal(result.status, 2);
  assert.equal(result.stderr, "Usage: node update.ts <target-revision>\n");
});

function git(repository: string, arguments_: string[]): string {
  return execFileSync("git", ["-C", repository, ...arguments_], {
    encoding: "utf8",
  }).trim();
}

async function createRepository(t: test.TestContext): Promise<string> {
  const repository = await mkdtemp(
    join(tmpdir(), "knowledge-base-version-update-"),
  );
  t.after(() => rm(repository, { force: true, recursive: true }));
  git(repository, ["init", "--initial-branch=main"]);
  git(repository, ["config", "user.name", "Plugin Version Test"]);
  git(repository, [
    "config",
    "user.email",
    "knowledge-base-version@example.com",
  ]);
  await mkdir(join(repository, ".claude-plugin"));
  await writeFile(
    join(repository, ".claude-plugin/marketplace.json"),
    JSON.stringify({ plugins: [{ name: "knowledge-base", source: "./" }] }),
  );
  await writeFile(
    join(repository, "plugin.json"),
    `${JSON.stringify({ name: "knowledge-base", version: "2026.8.15-1" }, null, 2)}\n`,
  );
  git(repository, ["add", "."]);
  git(repository, ["commit", "-m", "base"]);
  return repository;
}

test("repeated updates across a package move keep one version for the PR", async (t) => {
  const repository = await createRepository(t);
  const base = git(repository, ["rev-parse", "HEAD"]);

  await mkdir(join(repository, "knowledge-base", "plugin"), {
    recursive: true,
  });
  await rename(
    join(repository, "plugin.json"),
    join(repository, "knowledge-base/plugin/plugin.json"),
  );
  await writeFile(
    join(repository, ".claude-plugin/marketplace.json"),
    JSON.stringify({
      plugins: [{ name: "knowledge-base", source: "./knowledge-base/plugin" }],
    }),
  );

  const options = {
    repository,
    targetRevision: base,
    now: new Date("2026-08-15T10:00:00+08:00"),
  };
  assert.equal(await updatePluginVersion(options), "2026.8.15-2");
  const afterFirstUpdate = await readFile(
    join(repository, "knowledge-base/plugin/plugin.json"),
    "utf8",
  );
  assert.equal(await updatePluginVersion(options), "2026.8.15-2");
  assert.equal(
    await readFile(
      join(repository, "knowledge-base/plugin/plugin.json"),
      "utf8",
    ),
    afterFirstUpdate,
  );
});

test("derives the release from the explicit target as that target advances", async (t) => {
  const repository = await createRepository(t);
  git(repository, ["switch", "--create", "topic"]);
  await writeFile(join(repository, "knowledge.md"), "# Topic content\n");
  git(repository, ["add", "."]);
  git(repository, ["commit", "-m", "update content"]);
  git(repository, ["switch", "--create", "target-base", "main"]);
  await writeFile(
    join(repository, "plugin.json"),
    JSON.stringify({ name: "knowledge-base", version: "2026.8.15-2" }),
  );
  git(repository, ["add", "."]);
  git(repository, ["commit", "-m", "release on target"]);
  git(repository, ["switch", "topic"]);

  const options = {
    repository,
    targetRevision: "target-base",
    now: new Date("2026-08-15T10:00:00+08:00"),
  };
  assert.equal(await updatePluginVersion(options), "2026.8.15-3");
  git(repository, ["add", "."]);
  git(repository, ["commit", "-m", "version topic content"]);
  const afterFirstUpdate = await readFile(
    join(repository, "plugin.json"),
    "utf8",
  );

  git(repository, ["switch", "target-base"]);
  await writeFile(
    join(repository, "plugin.json"),
    JSON.stringify({ name: "knowledge-base", version: "2026.8.15-3" }),
  );
  git(repository, ["add", "."]);
  git(repository, ["commit", "-m", "another target release"]);
  git(repository, ["switch", "topic"]);

  assert.equal(await updatePluginVersion(options), "2026.8.15-4");
  assert.notEqual(
    await readFile(join(repository, "plugin.json"), "utf8"),
    afterFirstUpdate,
  );
});
