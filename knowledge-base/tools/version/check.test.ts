import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rename, rm, writeFile } from "node:fs/promises";
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
  pluginDirectory = "knowledge-base/plugin",
): Promise<string> {
  const repository = await mkdtemp(
    join(tmpdir(), "knowledge-base-version-check-"),
  );
  t.after(() => rm(repository, { force: true, recursive: true }));
  git(repository, ["init", "--initial-branch=main"]);
  git(repository, ["config", "user.name", "Plugin Version Test"]);
  git(repository, [
    "config",
    "user.email",
    "knowledge-base-version@example.com",
  ]);
  await mkdir(join(repository, pluginDirectory), { recursive: true });
  await mkdir(join(repository, ".claude-plugin"));
  await writeFile(
    join(repository, ".claude-plugin/marketplace.json"),
    JSON.stringify({
      plugins: [{ name: "knowledge-base", source: `./${pluginDirectory}` }],
    }),
  );
  await writeFile(
    join(repository, pluginDirectory, "plugin.json"),
    `${JSON.stringify({ name: "knowledge-base", version: baseVersion }, null, 2)}\n`,
  );
  await mkdir(join(repository, pluginDirectory, "knowledge"));
  await writeFile(
    join(repository, pluginDirectory, "knowledge", "index.md"),
    "# Index\n",
  );
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

async function advanceTarget(
  repository: string,
  commonAncestor: string,
): Promise<string> {
  git(repository, ["switch", "--create", "target-base", commonAncestor]);
  await writeFile(
    join(repository, "knowledge-base/plugin/plugin.json"),
    `${JSON.stringify({ name: "knowledge-base", version: "2026.8.15-2" }, null, 2)}\n`,
  );
  await writeFile(
    join(repository, "knowledge-base/plugin/knowledge/index.md"),
    "# Target branch release\n",
  );
  return commit(
    repository,
    "release on target branch",
    "2026-08-15T11:00:00+08:00",
    "2026-08-15T11:00:00+08:00",
  );
}

test("requires base and head revisions", () => {
  const result = spawnSync(process.execPath, [checkerPath], {
    encoding: "utf8",
  });

  assert.equal(result.status, 2);
  assert.equal(
    result.stderr,
    "Usage: node check.ts <target-revision> <head-revision>\n",
  );
});

test("ignores target-only releases when the PR changes only automation", async (t) => {
  const repository = await createRepository(t, "2026.8.15-1");
  const commonAncestor = git(repository, ["rev-parse", "HEAD"]);
  git(repository, ["switch", "--create", "topic"]);
  await mkdir(join(repository, ".github/workflows"), { recursive: true });
  await writeFile(
    join(repository, ".github/workflows/runtime.yml"),
    "name: Runtime\n",
  );
  const head = commit(
    repository,
    "update automation",
    "2026-08-15T10:00:00+08:00",
    "2026-08-15T10:00:00+08:00",
  );
  const target = await advanceTarget(repository, commonAncestor);

  const result = spawnSync(process.execPath, [checkerPath, target, head], {
    cwd: repository,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    result.stdout,
    "Plugin 'knowledge-base' version remains 2026.8.15-1; no versioned content changed.\n",
  );
});

test("detects PR content from the common ancestor and versions from the target", async (t) => {
  const repository = await createRepository(t, "2026.8.15-1");
  const commonAncestor = git(repository, ["rev-parse", "HEAD"]);
  git(repository, ["switch", "--create", "topic"]);
  await writeFile(
    join(repository, "knowledge-base/plugin/knowledge/index.md"),
    "# Topic branch content\n",
  );
  const missingVersion = commit(
    repository,
    "update knowledge without a bump",
    "2026-08-15T10:00:00+08:00",
    "2026-08-15T10:00:00+08:00",
  );
  await writeFile(
    join(repository, "knowledge-base/plugin/plugin.json"),
    `${JSON.stringify({ name: "knowledge-base", version: "2026.8.15-3" }, null, 2)}\n`,
  );
  const head = commit(
    repository,
    "version the PR content",
    "2026-08-15T10:01:00+08:00",
    "2026-08-15T10:01:00+08:00",
  );
  const target = await advanceTarget(repository, commonAncestor);

  const missingBump = spawnSync(
    process.execPath,
    [checkerPath, target, missingVersion],
    { cwd: repository, encoding: "utf8" },
  );
  assert.equal(missingBump.status, 1);
  assert.match(
    missingBump.stderr,
    /Expected 'knowledge-base' plugin version '2026\.8\.15-3'/u,
  );

  const result = spawnSync(process.execPath, [checkerPath, target, head], {
    cwd: repository,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    result.stdout,
    "Plugin 'knowledge-base' version is 2026.8.15-3.\n",
  );
});

test("rejects a PR version-only change even when the target has that version", async (t) => {
  const repository = await createRepository(t, "2026.8.15-1");
  const commonAncestor = git(repository, ["rev-parse", "HEAD"]);
  git(repository, ["switch", "--create", "topic"]);
  await writeFile(
    join(repository, "knowledge-base/plugin/plugin.json"),
    `${JSON.stringify({ name: "knowledge-base", version: "2026.8.15-2" }, null, 2)}\n`,
  );
  const head = commit(
    repository,
    "bump version only",
    "2026-08-15T10:00:00+08:00",
    "2026-08-15T10:00:00+08:00",
  );
  const target = await advanceTarget(repository, commonAncestor);

  const result = spawnSync(process.execPath, [checkerPath, target, head], {
    cwd: repository,
    encoding: "utf8",
  });

  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /version changed, but its Knowledge, Skill references, and usage Skills did not/u,
  );
});

test("uses the rebased head committer date instead of the author date", async (t) => {
  const repository = await createRepository(t, "2026.8.15-1");
  const base = git(repository, ["rev-parse", "HEAD"]);
  await writeFile(
    join(repository, "knowledge-base/plugin/plugin.json"),
    `${JSON.stringify({ name: "knowledge-base", version: "2026.8.18-1" }, null, 2)}\n`,
  );
  await writeFile(
    join(repository, "knowledge-base/plugin/knowledge/index.md"),
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
  assert.equal(
    result.stdout,
    "Plugin 'knowledge-base' version is 2026.8.18-1.\n",
  );
});

test("requires a bump when plugin Knowledge changes", async (t) => {
  const repository = await createRepository(t, "2026.8.15-1");
  const base = git(repository, ["rev-parse", "HEAD"]);
  await writeFile(
    join(repository, "knowledge-base/plugin/knowledge/index.md"),
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
    /Expected 'knowledge-base' plugin version '2026\.8\.15-2'/u,
  );
});

test("requires a bump when a plugin Skill reference changes", async (t) => {
  const repository = await createRepository(t, "2026.8.15-1");
  const base = git(repository, ["rev-parse", "HEAD"]);
  const referenceDirectory = join(
    repository,
    "knowledge-base/plugin/references/testing",
  );
  await mkdir(referenceDirectory, { recursive: true });
  await writeFile(
    join(referenceDirectory, "effectiveness.md"),
    "# Test effectiveness\n",
  );
  const head = commit(
    repository,
    "add shared Skill reference",
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
    /Expected 'knowledge-base' plugin version '2026\.8\.15-2'/u,
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

test("checks a package move using each revision's marketplace", async (t) => {
  const repository = await createRepository(t, "2026.8.15-1", ".");
  const base = git(repository, ["rev-parse", "HEAD"]);
  const destination = join(repository, "knowledge-base", "plugin");
  await mkdir(destination, { recursive: true });
  await rename(
    join(repository, "plugin.json"),
    join(destination, "plugin.json"),
  );
  await rename(join(repository, "knowledge"), join(destination, "knowledge"));
  await writeFile(
    join(repository, ".claude-plugin/marketplace.json"),
    JSON.stringify({
      plugins: [{ name: "knowledge-base", source: "./knowledge-base/plugin" }],
    }),
  );
  const unversioned = commit(
    repository,
    "move package",
    "2026-08-15T10:00:00+08:00",
    "2026-08-15T10:00:00+08:00",
  );
  const missingBump = spawnSync(
    process.execPath,
    [checkerPath, base, unversioned],
    {
      cwd: repository,
      encoding: "utf8",
    },
  );
  assert.equal(missingBump.status, 1);
  assert.match(
    missingBump.stderr,
    /Expected 'knowledge-base' plugin version '2026\.8\.15-2'/u,
  );

  await writeFile(
    join(destination, "plugin.json"),
    JSON.stringify({ name: "knowledge-base", version: "2026.8.15-2" }),
  );
  const head = commit(
    repository,
    "version package move",
    "2026-08-15T10:00:00+08:00",
    "2026-08-15T10:00:00+08:00",
  );
  // The comparison must use the captured revisions, not an unrelated working tree.
  await writeFile(join(repository, ".claude-plugin/marketplace.json"), "{}");
  const result = spawnSync(process.execPath, [checkerPath, base, head], {
    cwd: repository,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
});

test("rejects a version-only release after date versions are established", async (t) => {
  const repository = await createRepository(t, "2026.8.15-1");
  const base = git(repository, ["rev-parse", "HEAD"]);
  await writeFile(
    join(repository, "knowledge-base/plugin/plugin.json"),
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
    /version changed, but its Knowledge, Skill references, and usage Skills did not/u,
  );
});

test("allows the one-time migration from a legacy version", async (t) => {
  const repository = await createRepository(t, "0.1.0");
  const base = git(repository, ["rev-parse", "HEAD"]);
  await writeFile(
    join(repository, "knowledge-base/plugin/plugin.json"),
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
  assert.equal(
    result.stdout,
    "Plugin 'knowledge-base' version is 2026.8.15-1.\n",
  );
});

test("tracks multiple marketplace plugins independently when only one changes", async (t) => {
  const repository = await mkdtemp(
    join(tmpdir(), "knowledge-base-version-multi-"),
  );
  t.after(() => rm(repository, { force: true, recursive: true }));
  git(repository, ["init", "--initial-branch=main"]);
  git(repository, ["config", "user.name", "Plugin Version Test"]);
  git(repository, [
    "config",
    "user.email",
    "knowledge-base-version@example.com",
  ]);
  await mkdir(join(repository, ".claude-plugin"), { recursive: true });
  await mkdir(
    join(repository, "knowledge-base/plugins/knowledge-base/knowledge"),
    { recursive: true },
  );
  await mkdir(join(repository, "knowledge-base/plugins/chromium/knowledge"), {
    recursive: true,
  });
  await writeFile(
    join(repository, ".claude-plugin/marketplace.json"),
    JSON.stringify({
      plugins: [
        {
          name: "knowledge-base",
          source: "./knowledge-base/plugins/knowledge-base",
        },
        { name: "chromium", source: "./knowledge-base/plugins/chromium" },
      ],
    }),
  );
  await writeFile(
    join(repository, "knowledge-base/plugins/knowledge-base/plugin.json"),
    `${JSON.stringify({ name: "knowledge-base", version: "2026.8.15-1" }, null, 2)}\n`,
  );
  await writeFile(
    join(
      repository,
      "knowledge-base/plugins/knowledge-base/knowledge/index.md",
    ),
    "# Core\n",
  );
  await writeFile(
    join(repository, "knowledge-base/plugins/chromium/plugin.json"),
    `${JSON.stringify({ name: "chromium", version: "2026.8.15-1" }, null, 2)}\n`,
  );
  await writeFile(
    join(repository, "knowledge-base/plugins/chromium/knowledge/index.md"),
    "# Chromium\n",
  );
  const base = commit(
    repository,
    "base",
    "2026-08-15T09:00:00+08:00",
    "2026-08-15T09:00:00+08:00",
  );

  await writeFile(
    join(repository, "knowledge-base/plugins/chromium/knowledge/index.md"),
    "# Updated Chromium\n",
  );
  const missingBump = commit(
    repository,
    "update chromium without bump",
    "2026-08-15T10:00:00+08:00",
    "2026-08-15T10:00:00+08:00",
  );

  const failed = spawnSync(process.execPath, [checkerPath, base, missingBump], {
    cwd: repository,
    encoding: "utf8",
  });
  assert.equal(failed.status, 1);
  assert.match(
    failed.stderr,
    /Expected 'chromium' plugin version '2026\.8\.15-2'/u,
  );

  await writeFile(
    join(repository, "knowledge-base/plugins/chromium/plugin.json"),
    `${JSON.stringify({ name: "chromium", version: "2026.8.15-2" }, null, 2)}\n`,
  );
  const head = commit(
    repository,
    "bump chromium version",
    "2026-08-15T10:05:00+08:00",
    "2026-08-15T10:05:00+08:00",
  );

  const passed = spawnSync(process.execPath, [checkerPath, base, head], {
    cwd: repository,
    encoding: "utf8",
  });
  assert.equal(passed.status, 0, passed.stderr);
  assert.match(
    passed.stdout,
    /Plugin 'knowledge-base' version remains 2026\.8\.15-1; no versioned content changed\./u,
  );
  assert.match(passed.stdout, /Plugin 'chromium' version is 2026\.8\.15-2\./u);
});

test("validates initial version format for a newly added plugin and checks target collisions", async (t) => {
  const repository = await createRepository(t, "2026.8.15-1");
  const commonAncestor = git(repository, ["rev-parse", "HEAD"]);

  git(repository, ["switch", "--create", "topic"]);
  await mkdir(join(repository, "knowledge-base/plugins/chromium/knowledge"), {
    recursive: true,
  });
  await writeFile(
    join(repository, ".claude-plugin/marketplace.json"),
    JSON.stringify({
      plugins: [
        { name: "knowledge-base", source: "./knowledge-base/plugin" },
        { name: "chromium", source: "./knowledge-base/plugins/chromium" },
      ],
    }),
  );
  await writeFile(
    join(repository, "knowledge-base/plugins/chromium/knowledge/ios.md"),
    "# iOS\n",
  );
  await writeFile(
    join(repository, "knowledge-base/plugins/chromium/plugin.json"),
    `${JSON.stringify({ name: "chromium", version: "0.1.0" }, null, 2)}\n`,
  );
  const invalidNew = commit(
    repository,
    "add chromium with non-canonical version",
    "2026-08-15T10:00:00+08:00",
    "2026-08-15T10:00:00+08:00",
  );

  const failedInvalid = spawnSync(
    process.execPath,
    [checkerPath, commonAncestor, invalidNew],
    { cwd: repository, encoding: "utf8" },
  );
  assert.equal(failedInvalid.status, 1);
  assert.match(
    failedInvalid.stderr,
    /New 'chromium' plugin version '0\.1\.0'.*YYYY\.MM\.DD-N/u,
  );

  await writeFile(
    join(repository, "knowledge-base/plugins/chromium/plugin.json"),
    `${JSON.stringify({ name: "chromium", version: "2026.8.15-1" }, null, 2)}\n`,
  );
  const validNew = commit(
    repository,
    "add chromium with date version",
    "2026-08-15T10:05:00+08:00",
    "2026-08-15T10:05:00+08:00",
  );

  const passedNew = spawnSync(
    process.execPath,
    [checkerPath, commonAncestor, validNew],
    { cwd: repository, encoding: "utf8" },
  );
  assert.equal(passedNew.status, 0, passedNew.stderr);
  assert.match(
    passedNew.stdout,
    /Plugin 'knowledge-base' version remains 2026\.8\.15-1; no versioned content changed\./u,
  );
  assert.match(
    passedNew.stdout,
    /Plugin 'chromium' version is 2026\.8\.15-1\./u,
  );

  git(repository, ["switch", "--create", "target-collision", commonAncestor]);
  await mkdir(join(repository, "knowledge-base/plugins/chromium/knowledge"), {
    recursive: true,
  });
  await writeFile(
    join(repository, ".claude-plugin/marketplace.json"),
    JSON.stringify({
      plugins: [
        { name: "knowledge-base", source: "./knowledge-base/plugin" },
        { name: "chromium", source: "./knowledge-base/plugins/chromium" },
      ],
    }),
  );
  await writeFile(
    join(repository, "knowledge-base/plugins/chromium/knowledge/ios.md"),
    "# Target iOS\n",
  );
  await writeFile(
    join(repository, "knowledge-base/plugins/chromium/plugin.json"),
    `${JSON.stringify({ name: "chromium", version: "2026.8.15-1" }, null, 2)}\n`,
  );
  const targetWithChromium = commit(
    repository,
    "target also added chromium",
    "2026-08-15T11:00:00+08:00",
    "2026-08-15T11:00:00+08:00",
  );

  const collision = spawnSync(
    process.execPath,
    [checkerPath, targetWithChromium, validNew],
    { cwd: repository, encoding: "utf8" },
  );
  assert.equal(collision.status, 1);
  assert.match(
    collision.stderr,
    /Expected 'chromium' plugin version '2026\.8\.15-2'/u,
  );
});

test("requires source plugin bump when leaves are moved out into a newly split plugin", async (t) => {
  const repository = await createRepository(t, "2026.8.15-1");
  await writeFile(
    join(repository, "knowledge-base/plugin/knowledge/ios.md"),
    "# iOS UI\n\nDetailed architecture guidance.\n",
  );
  const base = commit(
    repository,
    "add ios leaf",
    "2026-08-15T09:00:00+08:00",
    "2026-08-15T09:00:00+08:00",
  );

  await mkdir(join(repository, "knowledge-base/plugins/chromium/knowledge"), {
    recursive: true,
  });
  await rename(
    join(repository, "knowledge-base/plugin/knowledge/ios.md"),
    join(repository, "knowledge-base/plugins/chromium/knowledge/ios.md"),
  );
  await writeFile(
    join(repository, ".claude-plugin/marketplace.json"),
    JSON.stringify({
      plugins: [
        { name: "knowledge-base", source: "./knowledge-base/plugin" },
        { name: "chromium", source: "./knowledge-base/plugins/chromium" },
      ],
    }),
  );
  await writeFile(
    join(repository, "knowledge-base/plugins/chromium/plugin.json"),
    `${JSON.stringify({ name: "chromium", version: "2026.8.15-1" }, null, 2)}\n`,
  );
  const missingSourceBump = commit(
    repository,
    "split chromium without bumping knowledge-base",
    "2026-08-15T10:00:00+08:00",
    "2026-08-15T10:00:00+08:00",
  );

  const failed = spawnSync(
    process.execPath,
    [checkerPath, base, missingSourceBump],
    { cwd: repository, encoding: "utf8" },
  );
  assert.equal(failed.status, 1);
  assert.match(
    failed.stderr,
    /Expected 'knowledge-base' plugin version '2026\.8\.15-2'/u,
  );

  await writeFile(
    join(repository, "knowledge-base/plugin/plugin.json"),
    `${JSON.stringify({ name: "knowledge-base", version: "2026.8.15-2" }, null, 2)}\n`,
  );
  const head = commit(
    repository,
    "bump knowledge-base after split",
    "2026-08-15T10:05:00+08:00",
    "2026-08-15T10:05:00+08:00",
  );

  const passed = spawnSync(process.execPath, [checkerPath, base, head], {
    cwd: repository,
    encoding: "utf8",
  });
  assert.equal(passed.status, 0, passed.stderr);
});

test("rejects a version-only bump on an unchanged sibling plugin", async (t) => {
  const repository = await mkdtemp(
    join(tmpdir(), "knowledge-base-version-sibling-"),
  );
  t.after(() => rm(repository, { force: true, recursive: true }));
  git(repository, ["init", "--initial-branch=main"]);
  git(repository, ["config", "user.name", "Plugin Version Test"]);
  git(repository, [
    "config",
    "user.email",
    "knowledge-base-version@example.com",
  ]);
  await mkdir(join(repository, ".claude-plugin"), { recursive: true });
  await mkdir(
    join(repository, "knowledge-base/plugins/knowledge-base/knowledge"),
    { recursive: true },
  );
  await mkdir(join(repository, "knowledge-base/plugins/chromium/knowledge"), {
    recursive: true,
  });
  await writeFile(
    join(repository, ".claude-plugin/marketplace.json"),
    JSON.stringify({
      plugins: [
        {
          name: "knowledge-base",
          source: "./knowledge-base/plugins/knowledge-base",
        },
        { name: "chromium", source: "./knowledge-base/plugins/chromium" },
      ],
    }),
  );
  await writeFile(
    join(repository, "knowledge-base/plugins/knowledge-base/plugin.json"),
    `${JSON.stringify({ name: "knowledge-base", version: "2026.8.15-1" }, null, 2)}\n`,
  );
  await writeFile(
    join(
      repository,
      "knowledge-base/plugins/knowledge-base/knowledge/index.md",
    ),
    "# Core\n",
  );
  await writeFile(
    join(repository, "knowledge-base/plugins/chromium/plugin.json"),
    `${JSON.stringify({ name: "chromium", version: "2026.8.15-1" }, null, 2)}\n`,
  );
  await writeFile(
    join(repository, "knowledge-base/plugins/chromium/knowledge/index.md"),
    "# Chromium\n",
  );
  const base = commit(
    repository,
    "base",
    "2026-08-15T09:00:00+08:00",
    "2026-08-15T09:00:00+08:00",
  );

  await writeFile(
    join(repository, "knowledge-base/plugins/chromium/knowledge/index.md"),
    "# Updated Chromium\n",
  );
  await writeFile(
    join(repository, "knowledge-base/plugins/chromium/plugin.json"),
    `${JSON.stringify({ name: "chromium", version: "2026.8.15-2" }, null, 2)}\n`,
  );
  await writeFile(
    join(repository, "knowledge-base/plugins/knowledge-base/plugin.json"),
    `${JSON.stringify({ name: "knowledge-base", version: "2026.8.15-2" }, null, 2)}\n`,
  );
  const head = commit(
    repository,
    "bump both when only chromium changed",
    "2026-08-15T10:00:00+08:00",
    "2026-08-15T10:00:00+08:00",
  );

  const failed = spawnSync(process.execPath, [checkerPath, base, head], {
    cwd: repository,
    encoding: "utf8",
  });
  assert.equal(failed.status, 1);
  assert.match(
    failed.stderr,
    /The 'knowledge-base' plugin version changed, but its Knowledge, Skill references, and usage Skills did not\./u,
  );
});

test("rejects duplicate or invalid marketplace plugin definitions", async (t) => {
  const repository = await createRepository(t, "2026.8.15-1");
  const base = git(repository, ["rev-parse", "HEAD"]);

  await writeFile(
    join(repository, ".claude-plugin/marketplace.json"),
    JSON.stringify({
      plugins: [
        { name: "knowledge-base", source: "./knowledge-base/plugin" },
        { name: "knowledge-base", source: "./knowledge-base/plugin" },
      ],
    }),
  );
  const duplicateHead = commit(
    repository,
    "duplicate plugin",
    "2026-08-15T10:00:00+08:00",
    "2026-08-15T10:00:00+08:00",
  );
  const duplicateResult = spawnSync(
    process.execPath,
    [checkerPath, base, duplicateHead],
    { cwd: repository, encoding: "utf8" },
  );
  assert.equal(duplicateResult.status, 1);
  assert.match(
    duplicateResult.stderr,
    /Duplicate marketplace plugin 'knowledge-base'\./u,
  );

  await writeFile(
    join(repository, ".claude-plugin/marketplace.json"),
    JSON.stringify({
      plugins: [{ name: "knowledge-base", source: "../outside" }],
    }),
  );
  const invalidSourceHead = commit(
    repository,
    "invalid plugin source",
    "2026-08-15T10:05:00+08:00",
    "2026-08-15T10:05:00+08:00",
  );
  const invalidSourceResult = spawnSync(
    process.execPath,
    [checkerPath, base, invalidSourceHead],
    { cwd: repository, encoding: "utf8" },
  );
  assert.equal(invalidSourceResult.status, 1);
  assert.match(
    invalidSourceResult.stderr,
    /must have a non-empty name and a local '\.\/' source without '\.\.'/u,
  );
});

test("reports all failing plugins when multiple plugins omit required bumps", async (t) => {
  const repository = await createRepository(t, "2026.8.15-1");
  await mkdir(join(repository, "knowledge-base/plugins/chromium/knowledge"), {
    recursive: true,
  });
  await writeFile(
    join(repository, ".claude-plugin/marketplace.json"),
    JSON.stringify({
      plugins: [
        { name: "knowledge-base", source: "./knowledge-base/plugin" },
        { name: "chromium", source: "./knowledge-base/plugins/chromium" },
      ],
    }),
  );
  await writeFile(
    join(repository, "knowledge-base/plugins/chromium/plugin.json"),
    `${JSON.stringify({ name: "chromium", version: "2026.8.15-1" }, null, 2)}\n`,
  );
  await writeFile(
    join(repository, "knowledge-base/plugins/chromium/knowledge/index.md"),
    "# Chromium\n",
  );
  const base = commit(
    repository,
    "add chromium",
    "2026-08-15T09:00:00+08:00",
    "2026-08-15T09:00:00+08:00",
  );

  await writeFile(
    join(repository, "knowledge-base/plugin/knowledge/index.md"),
    "# Updated core\n",
  );
  await writeFile(
    join(repository, "knowledge-base/plugins/chromium/knowledge/index.md"),
    "# Updated chromium\n",
  );
  const head = commit(
    repository,
    "update both without bumps",
    "2026-08-15T10:00:00+08:00",
    "2026-08-15T10:00:00+08:00",
  );

  const failed = spawnSync(process.execPath, [checkerPath, base, head], {
    cwd: repository,
    encoding: "utf8",
  });
  assert.equal(failed.status, 1);
  assert.match(
    failed.stderr,
    /Expected 'knowledge-base' plugin version '2026\.8\.15-2'/u,
  );
  assert.match(
    failed.stderr,
    /Expected 'chromium' plugin version '2026\.8\.15-2'/u,
  );
});
