import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { checkAgentDocSizes } from "./check.ts";

const checkerPath = fileURLToPath(new URL("./check.ts", import.meta.url));

test("exits with code 2 on missing or invalid CLI arguments", () => {
  for (const args of [[], ["one", "two"], ["--unknown"], [""]]) {
    const result = spawnSync(process.execPath, [checkerPath, ...args], {
      encoding: "utf8",
    });

    assert.equal(result.status, 2, `args=${JSON.stringify(args)}`);
    assert.equal(result.stdout, "");
    assert.equal(
      result.stderr,
      "Usage: node check.ts <repository-directory>\n",
    );
  }
});

test("checks marketplace plugins and .agents Markdown within limits and exits 0", async (t) => {
  const repository = await mkdtemp(join(tmpdir(), "agent-doc-size-"));
  t.after(() => rm(repository, { force: true, recursive: true }));

  const pluginRoot = join(repository, "knowledge-base", "plugins", "base");
  await Promise.all([
    mkdir(join(repository, ".claude-plugin"), { recursive: true }),
    mkdir(join(pluginRoot, "knowledge", "core"), { recursive: true }),
    mkdir(join(pluginRoot, "references", "shared"), { recursive: true }),
    mkdir(join(pluginRoot, "skills", "workflow-demo", "references"), {
      recursive: true,
    }),
    mkdir(join(repository, ".agents", "skills", "maintain", "references"), {
      recursive: true,
    }),
    mkdir(join(repository, ".agents", "references"), { recursive: true }),
  ]);

  await Promise.all([
    writeFile(
      join(repository, ".claude-plugin", "marketplace.json"),
      JSON.stringify({
        name: "knowledge-base",
        plugins: [{ name: "base", source: "./knowledge-base/plugins/base" }],
      }),
    ),
    writeFile(join(pluginRoot, "knowledge", "index.md"), "# Catalog\n"),
    writeFile(join(pluginRoot, "knowledge", "core", "guide.md"), "# Guide\n"),
    writeFile(join(pluginRoot, "references", "shared", "ref.md"), "# Ref\n"),
    writeFile(
      join(pluginRoot, "skills", "workflow-demo", "SKILL.md"),
      "# Skill\n",
    ),
    writeFile(
      join(pluginRoot, "skills", "workflow-demo", "references", "detail.md"),
      "# Detail\n",
    ),
    writeFile(
      join(repository, ".agents", "skills", "maintain", "SKILL.md"),
      "# Maintain\n",
    ),
    writeFile(
      join(
        repository,
        ".agents",
        "skills",
        "maintain",
        "references",
        "steps.md",
      ),
      "# Steps\n",
    ),
    writeFile(
      join(repository, ".agents", "references", "shared.md"),
      "# Shared\n",
    ),
  ]);

  const result = await checkAgentDocSizes(repository);
  assert.equal(result.checkedFileCount, 8);
  assert.deepEqual(result.diagnostics, []);

  const cliResult = spawnSync(process.execPath, [checkerPath, repository], {
    encoding: "utf8",
  });
  assert.equal(cliResult.status, 0, cliResult.stderr);
  assert.equal(cliResult.stdout, "Checked 8 Agent Markdown files.\n");
  assert.equal(cliResult.stderr, "");
});

test("enforces exact UTF-8 byte boundaries for Skill entrypoints and other checked documents", async (t) => {
  const repository = await mkdtemp(join(tmpdir(), "agent-doc-size-"));
  t.after(() => rm(repository, { force: true, recursive: true }));

  const pluginRoot = join(repository, "knowledge-base", "plugins", "base");
  await Promise.all([
    mkdir(join(repository, ".claude-plugin"), { recursive: true }),
    mkdir(join(pluginRoot, "knowledge", "core"), { recursive: true }),
    mkdir(join(pluginRoot, "references", "shared"), { recursive: true }),
    mkdir(join(pluginRoot, "skills", "exact-ok", "references"), {
      recursive: true,
    }),
    mkdir(join(pluginRoot, "skills", "exact-over"), { recursive: true }),
    mkdir(join(pluginRoot, "skills", "utf8-over"), { recursive: true }),
    mkdir(join(repository, ".agents", "skills", "agent-ok", "references"), {
      recursive: true,
    }),
    mkdir(join(repository, ".agents", "skills", "agent-over"), {
      recursive: true,
    }),
  ]);

  // Multi-byte UTF-8: '中' is 1 character, 3 UTF-8 bytes.
  // 2667 * 3 = 8,001 UTF-8 bytes (char length 2,667 < 8,000).
  const utf8SkillOver = "中".repeat(2667);
  // 6827 * 3 = 20,481 UTF-8 bytes (char length 6,827 < 20,480).
  const utf8KnowledgeOver = "中".repeat(6827);

  await Promise.all([
    writeFile(
      join(repository, ".claude-plugin", "marketplace.json"),
      JSON.stringify({
        name: "knowledge-base",
        plugins: [{ name: "base", source: "./knowledge-base/plugins/base" }],
      }),
    ),
    writeFile(join(pluginRoot, "knowledge", "index.md"), "# Catalog\n"),
    writeFile(
      join(pluginRoot, "knowledge", "core", "ok.md"),
      "a".repeat(20_480),
    ),
    writeFile(
      join(pluginRoot, "knowledge", "core", "over.md"),
      "a".repeat(20_481),
    ),
    writeFile(
      join(pluginRoot, "knowledge", "core", "utf8-over.md"),
      utf8KnowledgeOver,
    ),
    writeFile(
      join(pluginRoot, "references", "shared", "over.md"),
      "b".repeat(20_481),
    ),
    writeFile(
      join(pluginRoot, "skills", "exact-ok", "SKILL.md"),
      "c".repeat(8_000),
    ),
    writeFile(
      join(pluginRoot, "skills", "exact-ok", "references", "ref-ok.md"),
      "d".repeat(20_480),
    ),
    writeFile(
      join(pluginRoot, "skills", "exact-ok", "references", "ref-over.md"),
      "d".repeat(20_481),
    ),
    writeFile(
      join(pluginRoot, "skills", "exact-over", "SKILL.md"),
      "c".repeat(8_001),
    ),
    writeFile(
      join(pluginRoot, "skills", "utf8-over", "SKILL.md"),
      utf8SkillOver,
    ),
    writeFile(
      join(repository, ".agents", "skills", "agent-ok", "SKILL.md"),
      "e".repeat(8_000),
    ),
    writeFile(
      join(
        repository,
        ".agents",
        "skills",
        "agent-ok",
        "references",
        "detail-over.md",
      ),
      "f".repeat(20_481),
    ),
    writeFile(
      join(repository, ".agents", "skills", "agent-over", "SKILL.md"),
      "e".repeat(8_001),
    ),
  ]);

  const result = await checkAgentDocSizes(repository);
  assert.equal(result.checkedFileCount, 13);
  assert.deepEqual(
    result.diagnostics.map((d) => ({
      filePath: d.filePath,
      byteLength: d.byteLength,
      limitBytes: d.limitBytes,
    })),
    [
      {
        filePath: ".agents/skills/agent-ok/references/detail-over.md",
        byteLength: 20_481,
        limitBytes: 20_480,
      },
      {
        filePath: ".agents/skills/agent-over/SKILL.md",
        byteLength: 8_001,
        limitBytes: 8_000,
      },
      {
        filePath: "knowledge-base/plugins/base/knowledge/core/over.md",
        byteLength: 20_481,
        limitBytes: 20_480,
      },
      {
        filePath: "knowledge-base/plugins/base/knowledge/core/utf8-over.md",
        byteLength: 20_481,
        limitBytes: 20_480,
      },
      {
        filePath: "knowledge-base/plugins/base/references/shared/over.md",
        byteLength: 20_481,
        limitBytes: 20_480,
      },
      {
        filePath:
          "knowledge-base/plugins/base/skills/exact-ok/references/ref-over.md",
        byteLength: 20_481,
        limitBytes: 20_480,
      },
      {
        filePath: "knowledge-base/plugins/base/skills/exact-over/SKILL.md",
        byteLength: 8_001,
        limitBytes: 8_000,
      },
      {
        filePath: "knowledge-base/plugins/base/skills/utf8-over/SKILL.md",
        byteLength: 8_001,
        limitBytes: 8_000,
      },
    ],
  );

  const cliResult = spawnSync(process.execPath, [checkerPath, repository], {
    encoding: "utf8",
  });
  assert.equal(cliResult.status, 1);
  assert.equal(cliResult.stdout, "");
  assert.match(
    cliResult.stderr,
    /^\.agents\/skills\/agent-over\/SKILL\.md: 8001 UTF-8 bytes exceeds limit of 8000 bytes\.$/m,
  );
  assert.match(
    cliResult.stderr,
    /^knowledge-base\/plugins\/base\/knowledge\/core\/utf8-over\.md: 20481 UTF-8 bytes exceeds limit of 20480 bytes\.$/m,
  );
});

test("skips absent optional directories and excludes non-runtime Markdown and non-Markdown files", async (t) => {
  const repository = await mkdtemp(join(tmpdir(), "agent-doc-size-"));
  t.after(() => rm(repository, { force: true, recursive: true }));

  const knowledgePlugin = join(repository, "knowledge-base", "plugins", "base");
  const skillOnlyPlugin = join(
    repository,
    "knowledge-base",
    "plugins",
    "utilities",
  );
  await Promise.all([
    mkdir(join(repository, ".claude-plugin"), { recursive: true }),
    mkdir(join(knowledgePlugin, "knowledge", "core"), { recursive: true }),
    mkdir(join(knowledgePlugin, "skills", "handbook-core"), {
      recursive: true,
    }),
    mkdir(join(skillOnlyPlugin, "skills", "workflow-retry", "scripts"), {
      recursive: true,
    }),
    mkdir(join(repository, "docs", "adr"), { recursive: true }),
    mkdir(join(repository, ".github", "workflows"), { recursive: true }),
  ]);

  const oversized = "x".repeat(30_000);
  await Promise.all([
    writeFile(
      join(repository, ".claude-plugin", "marketplace.json"),
      JSON.stringify({
        name: "knowledge-base",
        plugins: [
          { name: "base", source: "./knowledge-base/plugins/base" },
          { name: "utilities", source: "./knowledge-base/plugins/utilities" },
        ],
      }),
    ),
    writeFile(join(knowledgePlugin, "knowledge", "index.md"), "# Catalog\n"),
    writeFile(
      join(knowledgePlugin, "knowledge", "core", "guide.md"),
      "# Guide\n",
    ),
    writeFile(
      join(knowledgePlugin, "skills", "handbook-core", "SKILL.md"),
      "# Handbook\n",
    ),
    writeFile(
      join(skillOnlyPlugin, "skills", "workflow-retry", "SKILL.md"),
      "# Retry\n",
    ),
    writeFile(
      join(skillOnlyPlugin, "skills", "workflow-retry", "scripts", "run.txt"),
      oversized,
    ),
    writeFile(join(knowledgePlugin, "README.md"), oversized),
    writeFile(join(skillOnlyPlugin, "README.md"), oversized),
    writeFile(join(repository, "AGENTS.md"), oversized),
    writeFile(join(repository, "GLOSSARY.md"), oversized),
    writeFile(join(repository, "docs", "adr", "0001.md"), oversized),
    writeFile(join(repository, ".github", "workflows", "ci.md"), oversized),
  ]);

  const result = await checkAgentDocSizes(repository);
  assert.equal(result.checkedFileCount, 4);
  assert.deepEqual(result.diagnostics, []);
});

test("rejects invalid marketplace manifests and escaping plugin sources with exit code 1", async (t) => {
  const repository = await mkdtemp(join(tmpdir(), "agent-doc-size-"));
  const outsideDirectory = await mkdtemp(
    join(tmpdir(), "agent-doc-size-outside-"),
  );
  t.after(async () => {
    await Promise.all([
      rm(repository, { force: true, recursive: true }),
      rm(outsideDirectory, { force: true, recursive: true }),
    ]);
  });

  // Missing marketplace manifest
  const missingResult = spawnSync(process.execPath, [checkerPath, repository], {
    encoding: "utf8",
  });
  assert.equal(missingResult.status, 1);
  assert.equal(missingResult.stdout, "");
  assert.match(missingResult.stderr, /Agent document size check failed:/);

  // Path traversal source in marketplace.json
  await mkdir(join(repository, ".claude-plugin"), { recursive: true });
  await writeFile(
    join(repository, ".claude-plugin", "marketplace.json"),
    JSON.stringify({
      name: "knowledge-base",
      plugins: [{ name: "escape", source: "./../outside" }],
    }),
  );
  await assert.rejects(
    checkAgentDocSizes(repository),
    /must be a package-relative path starting with '\.\/' without '\.\.'/,
  );

  const traversalResult = spawnSync(
    process.execPath,
    [checkerPath, repository],
    { encoding: "utf8" },
  );
  assert.equal(traversalResult.status, 1);
  assert.equal(traversalResult.stdout, "");
  assert.match(traversalResult.stderr, /Agent document size check failed:/);

  // Symlinked plugin source escaping repository root
  await mkdir(join(repository, "knowledge-base", "plugins"), {
    recursive: true,
  });
  await symlink(
    outsideDirectory,
    join(repository, "knowledge-base", "plugins", "linked"),
  );
  await writeFile(
    join(repository, ".claude-plugin", "marketplace.json"),
    JSON.stringify({
      name: "knowledge-base",
      plugins: [{ name: "linked", source: "./knowledge-base/plugins/linked" }],
    }),
  );
  await assert.rejects(
    checkAgentDocSizes(repository),
    /resolves outside the repository root/,
  );
});
