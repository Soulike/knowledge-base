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

const updaterPath = fileURLToPath(new URL("./update.ts", import.meta.url));

test("requires an explicit PR target revision", () => {
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
  await mkdir(join(repository, "knowledge"));
  await writeFile(
    join(repository, ".claude-plugin/marketplace.json"),
    JSON.stringify({ plugins: [{ name: "knowledge-base", source: "./" }] }),
  );
  await writeFile(
    join(repository, "plugin.json"),
    `${JSON.stringify({ name: "knowledge-base", version: "2026.8.15-1" }, null, 2)}\n`,
  );
  await writeFile(join(repository, "knowledge/index.md"), "# Index\n");
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
  await rename(
    join(repository, "knowledge"),
    join(repository, "knowledge-base/plugin/knowledge"),
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
  assert.deepEqual(await updatePluginVersion(options), {
    plugins: [
      {
        name: "knowledge-base",
        manifestPath: "knowledge-base/plugin/plugin.json",
        version: "2026.8.15-2",
        updated: true,
      },
    ],
  });
  const afterFirstUpdate = await readFile(
    join(repository, "knowledge-base/plugin/plugin.json"),
    "utf8",
  );
  assert.deepEqual(await updatePluginVersion(options), {
    plugins: [
      {
        name: "knowledge-base",
        manifestPath: "knowledge-base/plugin/plugin.json",
        version: "2026.8.15-2",
        updated: false,
      },
    ],
  });
  assert.equal(
    await readFile(
      join(repository, "knowledge-base/plugin/plugin.json"),
      "utf8",
    ),
    afterFirstUpdate,
  );
});

test("keeps the local PR release stable while the target advances", async (t) => {
  const repository = await createRepository(t);
  git(repository, ["switch", "--create", "topic"]);
  await writeFile(join(repository, "knowledge/index.md"), "# Topic content\n");
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
  assert.deepEqual(await updatePluginVersion(options), {
    plugins: [
      {
        name: "knowledge-base",
        manifestPath: "plugin.json",
        version: "2026.8.15-2",
        updated: true,
      },
    ],
  });
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

  assert.deepEqual(await updatePluginVersion(options), {
    plugins: [
      {
        name: "knowledge-base",
        manifestPath: "plugin.json",
        version: "2026.8.15-2",
        updated: false,
      },
    ],
  });
  assert.equal(
    await readFile(join(repository, "plugin.json"), "utf8"),
    afterFirstUpdate,
  );
});

test("updates only plugins whose versioned directories changed and initializes new plugins", async (t) => {
  const repository = await mkdtemp(
    join(tmpdir(), "knowledge-base-version-update-multi-"),
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
  await mkdir(
    join(repository, "knowledge-base/plugins/knowledge-base/knowledge"),
    { recursive: true },
  );
  await mkdir(join(repository, "knowledge-base/plugins/chromium/skills/s"), {
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
    join(repository, "knowledge-base/plugins/chromium/skills/s/SKILL.md"),
    "# Chromium Skill\n",
  );
  git(repository, ["add", "."]);
  git(repository, ["commit", "-m", "base"]);
  const base = git(repository, ["rev-parse", "HEAD"]);

  // Change only chromium's skills (untracked new file) and add a new codex plugin.
  await writeFile(
    join(repository, "knowledge-base/plugins/chromium/skills/s/extra.md"),
    "# Extra\n",
  );
  await mkdir(join(repository, "knowledge-base/plugins/codex/knowledge"), {
    recursive: true,
  });
  await writeFile(
    join(repository, "knowledge-base/plugins/codex/plugin.json"),
    `${JSON.stringify({ name: "codex", version: "0.1.0" }, null, 2)}\n`,
  );
  await writeFile(
    join(repository, "knowledge-base/plugins/codex/knowledge/index.md"),
    "# Codex\n",
  );
  await writeFile(
    join(repository, ".claude-plugin/marketplace.json"),
    JSON.stringify({
      plugins: [
        {
          name: "knowledge-base",
          source: "./knowledge-base/plugins/knowledge-base",
        },
        { name: "chromium", source: "./knowledge-base/plugins/chromium" },
        { name: "codex", source: "./knowledge-base/plugins/codex" },
      ],
    }),
  );

  const originalCoreManifest = await readFile(
    join(repository, "knowledge-base/plugins/knowledge-base/plugin.json"),
    "utf8",
  );

  const result = await updatePluginVersion({
    repository,
    targetRevision: base,
    now: new Date("2026-08-15T10:00:00+08:00"),
  });

  assert.deepEqual(result, {
    plugins: [
      {
        name: "knowledge-base",
        manifestPath: "knowledge-base/plugins/knowledge-base/plugin.json",
        version: "2026.8.15-1",
        updated: false,
      },
      {
        name: "chromium",
        manifestPath: "knowledge-base/plugins/chromium/plugin.json",
        version: "2026.8.15-2",
        updated: true,
      },
      {
        name: "codex",
        manifestPath: "knowledge-base/plugins/codex/plugin.json",
        version: "2026.8.15-1",
        updated: true,
      },
    ],
  });
  assert.equal(
    await readFile(
      join(repository, "knowledge-base/plugins/knowledge-base/plugin.json"),
      "utf8",
    ),
    originalCoreManifest,
  );
  assert.equal(
    JSON.parse(
      await readFile(
        join(repository, "knowledge-base/plugins/chromium/plugin.json"),
        "utf8",
      ),
    ).version,
    "2026.8.15-2",
  );
  assert.equal(
    JSON.parse(
      await readFile(
        join(repository, "knowledge-base/plugins/codex/plugin.json"),
        "utf8",
      ),
    ).version,
    "2026.8.15-1",
  );
});

test("bumps source plugin when relocating and splitting leaves while leaving sibling untouched", async (t) => {
  const repository = await mkdtemp(
    join(tmpdir(), "knowledge-base-version-update-split-"),
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
  await mkdir(join(repository, "knowledge-base/plugin/knowledge"), {
    recursive: true,
  });
  await mkdir(join(repository, "knowledge-base/plugins/codex/knowledge"), {
    recursive: true,
  });
  await writeFile(
    join(repository, ".claude-plugin/marketplace.json"),
    JSON.stringify({
      plugins: [
        { name: "knowledge-base", source: "./knowledge-base/plugin" },
        { name: "codex", source: "./knowledge-base/plugins/codex" },
      ],
    }),
  );
  await writeFile(
    join(repository, "knowledge-base/plugin/plugin.json"),
    `${JSON.stringify({ name: "knowledge-base", version: "2026.8.15-1" }, null, 2)}\n`,
  );
  await writeFile(
    join(repository, "knowledge-base/plugin/knowledge/core.md"),
    "# Core\n",
  );
  await writeFile(
    join(repository, "knowledge-base/plugin/knowledge/ios.md"),
    "# iOS\n",
  );
  await writeFile(
    join(repository, "knowledge-base/plugins/codex/plugin.json"),
    `${JSON.stringify({ name: "codex", version: "2026.8.15-1" }, null, 2)}\n`,
  );
  await writeFile(
    join(repository, "knowledge-base/plugins/codex/knowledge/index.md"),
    "# Codex\n",
  );
  git(repository, ["add", "."]);
  git(repository, ["commit", "-m", "base"]);
  const base = git(repository, ["rev-parse", "HEAD"]);

  // Relocate knowledge-base and move ios.md out into a new chromium plugin.
  await mkdir(
    join(repository, "knowledge-base/plugins/knowledge-base/knowledge"),
    { recursive: true },
  );
  await rename(
    join(repository, "knowledge-base/plugin/plugin.json"),
    join(repository, "knowledge-base/plugins/knowledge-base/plugin.json"),
  );
  await rename(
    join(repository, "knowledge-base/plugin/knowledge/core.md"),
    join(repository, "knowledge-base/plugins/knowledge-base/knowledge/core.md"),
  );
  await mkdir(join(repository, "knowledge-base/plugins/chromium/knowledge"), {
    recursive: true,
  });
  await rename(
    join(repository, "knowledge-base/plugin/knowledge/ios.md"),
    join(repository, "knowledge-base/plugins/chromium/knowledge/ios.md"),
  );
  await writeFile(
    join(repository, "knowledge-base/plugins/chromium/plugin.json"),
    `${JSON.stringify({ name: "chromium", version: "0.1.0" }, null, 2)}\n`,
  );
  await writeFile(
    join(repository, ".claude-plugin/marketplace.json"),
    JSON.stringify({
      plugins: [
        {
          name: "knowledge-base",
          source: "./knowledge-base/plugins/knowledge-base",
        },
        { name: "codex", source: "./knowledge-base/plugins/codex" },
        { name: "chromium", source: "./knowledge-base/plugins/chromium" },
      ],
    }),
  );

  const result = await updatePluginVersion({
    repository,
    targetRevision: base,
    now: new Date("2026-08-15T10:00:00+08:00"),
  });

  assert.deepEqual(result, {
    plugins: [
      {
        name: "knowledge-base",
        manifestPath: "knowledge-base/plugins/knowledge-base/plugin.json",
        version: "2026.8.15-2",
        updated: true,
      },
      {
        name: "codex",
        manifestPath: "knowledge-base/plugins/codex/plugin.json",
        version: "2026.8.15-1",
        updated: false,
      },
      {
        name: "chromium",
        manifestPath: "knowledge-base/plugins/chromium/plugin.json",
        version: "2026.8.15-1",
        updated: true,
      },
    ],
  });
});
