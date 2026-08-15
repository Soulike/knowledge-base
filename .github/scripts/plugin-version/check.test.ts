import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const checkerPath = fileURLToPath(new URL("./check.ts", import.meta.url));

function git(
  repository: string,
  arguments_: string[],
  env = process.env,
): string {
  return execFileSync("git", ["-C", repository, ...arguments_], {
    encoding: "utf8",
    env,
  }).trim();
}

async function createRepository(
  t: test.TestContext,
  baseVersion: string,
): Promise<string> {
  const repository = await mkdtemp(join(tmpdir(), "plugin-version-check-"));
  t.after(() => rm(repository, { force: true, recursive: true }));
  git(repository, ["init", "--initial-branch=main"]);
  git(repository, ["config", "user.name", "Plugin Version Test"]);
  git(repository, ["config", "user.email", "plugin-version@example.com"]);
  await writeFile(
    join(repository, "plugin.json"),
    `${JSON.stringify({ name: "knowledge-base", version: baseVersion }, null, 2)}\n`,
  );
  await mkdir(join(repository, "knowledge"));
  await writeFile(join(repository, "knowledge", "index.md"), "# Index\n");
  git(repository, ["add", "."]);
  git(repository, ["commit", "-m", "base"]);
  return repository;
}

function commit(
  repository: string,
  message: string,
  authorDate: string,
  committerDate: string,
): string {
  git(repository, ["add", "."]);
  git(repository, ["commit", "-m", message], {
    ...process.env,
    GIT_AUTHOR_DATE: authorDate,
    GIT_COMMITTER_DATE: committerDate,
  });
  return git(repository, ["rev-parse", "HEAD"]);
}

test("requires base and head revisions", () => {
  const result = spawnSync(process.execPath, [checkerPath], {
    encoding: "utf8",
  });

  assert.equal(result.status, 2);
  assert.equal(
    result.stderr,
    "Usage: node check.ts <base-revision> <head-revision>\n",
  );
});

test("uses the rebased head committer date instead of the author date", async (t) => {
  const repository = await createRepository(t, "2026.8.15-1");
  const base = git(repository, ["rev-parse", "HEAD"]);
  await writeFile(
    join(repository, "plugin.json"),
    `${JSON.stringify({ name: "knowledge-base", version: "2026.8.18-1" }, null, 2)}\n`,
  );
  await writeFile(
    join(repository, "knowledge", "index.md"),
    "# Updated index\n",
  );
  const head = commit(
    repository,
    "update knowledge",
    "2026-08-12T10:00:00+08:00",
    "2026-08-18T10:00:00+08:00",
  );

  const result = spawnSync(process.execPath, [checkerPath, base, head], {
    cwd: repository,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, "Primary plugin version is 2026.8.18-1.\n");
});

test("requires a bump when root Knowledge changes", async (t) => {
  const repository = await createRepository(t, "2026.8.15-1");
  const base = git(repository, ["rev-parse", "HEAD"]);
  await writeFile(
    join(repository, "knowledge", "index.md"),
    "# Updated index\n",
  );
  const head = commit(
    repository,
    "update knowledge",
    "2026-08-15T10:00:00+08:00",
    "2026-08-15T10:00:00+08:00",
  );

  const result = spawnSync(process.execPath, [checkerPath, base, head], {
    cwd: repository,
    encoding: "utf8",
  });

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /Expected primary plugin version '2026\.8\.15-2'/u,
  );
});

test("does not version an independent plugin change", async (t) => {
  const repository = await createRepository(t, "2026.8.15-1");
  const base = git(repository, ["rev-parse", "HEAD"]);
  const pluginDirectory = join(repository, "plugins", "example");
  await mkdir(pluginDirectory, { recursive: true });
  await writeFile(join(pluginDirectory, "plugin.json"), "{}\n");
  const head = commit(
    repository,
    "update independent plugin",
    "2026-08-15T10:00:00+08:00",
    "2026-08-15T10:00:00+08:00",
  );

  const result = spawnSync(process.execPath, [checkerPath, base, head], {
    cwd: repository,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /no versioned content changed/u);
});

test("rejects a version-only release after date versions are established", async (t) => {
  const repository = await createRepository(t, "2026.8.15-1");
  const base = git(repository, ["rev-parse", "HEAD"]);
  await writeFile(
    join(repository, "plugin.json"),
    `${JSON.stringify({ name: "knowledge-base", version: "2026.8.15-2" }, null, 2)}\n`,
  );
  const head = commit(
    repository,
    "bump version only",
    "2026-08-15T10:00:00+08:00",
    "2026-08-15T10:00:00+08:00",
  );

  const result = spawnSync(process.execPath, [checkerPath, base, head], {
    cwd: repository,
    encoding: "utf8",
  });

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /version changed, but root Knowledge and usage Skills did not/u,
  );
});

test("allows the one-time migration from a legacy version", async (t) => {
  const repository = await createRepository(t, "0.1.0");
  const base = git(repository, ["rev-parse", "HEAD"]);
  await writeFile(
    join(repository, "plugin.json"),
    `${JSON.stringify({ name: "knowledge-base", version: "2026.8.15-1" }, null, 2)}\n`,
  );
  const head = commit(
    repository,
    "adopt date version",
    "2026-08-15T10:00:00+08:00",
    "2026-08-15T10:00:00+08:00",
  );

  const result = spawnSync(process.execPath, [checkerPath, base, head], {
    cwd: repository,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, "Primary plugin version is 2026.8.15-1.\n");
});
