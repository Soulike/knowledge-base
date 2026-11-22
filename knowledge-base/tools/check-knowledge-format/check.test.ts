import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { checkKnowledgeReachability } from "./reachability.ts";

const checkerPath = fileURLToPath(new URL("./check.ts", import.meta.url));

const validDocument = `# Authentication

## Scope

This document defines the authentication guarantees shared by every client.

## When to update

Update this document when an authentication guarantee or supported client changes.
`;

function validCatalog(rows: string): string {
  return `# Knowledge catalog

## Scope

This catalog lists Knowledge.

## When to update

Update this catalog when Knowledge changes.

## Documents

| File Path | Knowledge Type |
| --- | --- |
${rows}`;
}

test("requires either a knowledge directory or --marketplace as CLI arguments", () => {
  const result = spawnSync(process.execPath, [checkerPath], {
    encoding: "utf8",
  });

  assert.equal(result.status, 2);
  assert.equal(result.stdout, "");
  assert.equal(
    result.stderr,
    "Usage: node check.ts <knowledge-directory> [--enforce-reachability]\n" +
      "       node check.ts --marketplace <marketplace-file> [--enforce-reachability]\n",
  );
});

test("checks every Marketplace-selected plugin when invoked with --marketplace", async (t) => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "knowledge-check-"));
  const marketplaceDirectory = join(temporaryRoot, ".claude-plugin");
  const marketplaceFile = join(marketplaceDirectory, "marketplace.json");
  const basePlugin = join(temporaryRoot, "knowledge-base", "plugins", "base");
  const extraPlugin = join(temporaryRoot, "knowledge-base", "plugins", "extra");
  t.after(() => rm(temporaryRoot, { force: true, recursive: true }));

  await Promise.all([
    mkdir(marketplaceDirectory, { recursive: true }),
    mkdir(join(basePlugin, "knowledge", "core"), { recursive: true }),
    mkdir(join(basePlugin, "skills", "handbook-core"), { recursive: true }),
    mkdir(join(extraPlugin, "knowledge", "domain"), { recursive: true }),
    mkdir(join(extraPlugin, "skills", "handbook-domain"), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(
      marketplaceFile,
      JSON.stringify({
        name: "knowledge-base",
        plugins: [
          { name: "base", source: "./knowledge-base/plugins/base" },
          { name: "extra", source: "./knowledge-base/plugins/extra" },
        ],
      }),
    ),
    writeFile(
      join(basePlugin, "knowledge", "index.md"),
      validCatalog(
        "| [knowledge/core/guide.md](core/guide.md) | evergreen |\n",
      ),
    ),
    writeFile(join(basePlugin, "knowledge", "core", "guide.md"), validDocument),
    writeFile(
      join(basePlugin, "skills", "handbook-core", "SKILL.md"),
      "Read [Guide](../../knowledge/core/guide.md).\n",
    ),
    writeFile(
      join(extraPlugin, "knowledge", "index.md"),
      validCatalog(
        "| [knowledge/domain/topic.md](domain/topic.md) | time-sensitive |\n",
      ),
    ),
    writeFile(
      join(extraPlugin, "knowledge", "domain", "topic.md"),
      validDocument,
    ),
    writeFile(
      join(extraPlugin, "skills", "handbook-domain", "SKILL.md"),
      "Read [Topic](../../knowledge/domain/topic.md).\n",
    ),
  ]);

  const result = spawnSync(
    process.execPath,
    [checkerPath, "--marketplace", marketplaceFile, "--enforce-reachability"],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, "");
  assert.match(result.stdout, /\[base\] Checked 2 knowledge Markdown files\./);
  assert.match(result.stdout, /\[extra\] Checked 2 knowledge Markdown files\./);
  assert.match(
    result.stdout,
    /Checked 2 marketplace plugins \(4 knowledge Markdown files total\)\./,
  );
});

test("reports per-plugin diagnostics prefixed with plugin name and path across all Marketplace plugins", async (t) => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "knowledge-check-"));
  const marketplaceDirectory = join(temporaryRoot, ".claude-plugin");
  const marketplaceFile = join(marketplaceDirectory, "marketplace.json");
  const firstPlugin = join(temporaryRoot, "knowledge-base", "plugins", "alpha");
  const secondPlugin = join(temporaryRoot, "knowledge-base", "plugins", "beta");
  const thirdPlugin = join(temporaryRoot, "knowledge-base", "plugins", "gamma");
  t.after(() => rm(temporaryRoot, { force: true, recursive: true }));

  await Promise.all([
    mkdir(marketplaceDirectory, { recursive: true }),
    mkdir(join(firstPlugin, "knowledge", "core"), { recursive: true }),
    mkdir(join(secondPlugin, "knowledge", "domain"), { recursive: true }),
    mkdir(join(secondPlugin, "skills", "handbook-beta"), { recursive: true }),
    mkdir(join(thirdPlugin, "skills", "handbook-gamma"), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(
      marketplaceFile,
      JSON.stringify({
        name: "knowledge-base",
        plugins: [
          { name: "alpha", source: "./knowledge-base/plugins/alpha" },
          { name: "beta", source: "./knowledge-base/plugins/beta" },
          { name: "gamma", source: "./knowledge-base/plugins/gamma" },
        ],
      }),
    ),
    writeFile(
      join(firstPlugin, "knowledge", "index.md"),
      validCatalog(
        "| [knowledge/core/orphan.md](core/orphan.md) | evergreen |\n",
      ),
    ),
    writeFile(
      join(firstPlugin, "knowledge", "core", "orphan.md"),
      validDocument,
    ),
    writeFile(
      join(secondPlugin, "knowledge", "index.md"),
      validCatalog(
        "| [knowledge/domain/broken.md](domain/broken.md) | evergreen |\n",
      ),
    ),
    writeFile(
      join(secondPlugin, "knowledge", "domain", "broken.md"),
      "# Broken\n\nMissing Scope.\n",
    ),
    writeFile(
      join(secondPlugin, "skills", "handbook-beta", "SKILL.md"),
      "Read [Broken](../../knowledge/domain/broken.md).\n",
    ),
  ]);

  const result = spawnSync(
    process.execPath,
    [checkerPath, "--enforce-reachability", "--marketplace", marketplaceFile],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(
    result.stderr,
    "[alpha] knowledge-base/plugins/alpha/knowledge/core/orphan.md: Knowledge leaf is not reachable from an installed Skill entrypoint through package-local Markdown links.\n" +
      "[beta] knowledge-base/plugins/beta/knowledge/domain/broken.md: The first section after the title must be '## Scope'.\n" +
      "[gamma] knowledge-base/plugins/gamma/knowledge: Knowledge directory does not exist.\n",
  );
});

test("reports the actual failing stage when a Marketplace plugin has valid Knowledge but skills is a file", async (t) => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "knowledge-check-"));
  const marketplaceDirectory = join(temporaryRoot, ".claude-plugin");
  const marketplaceFile = join(marketplaceDirectory, "marketplace.json");
  const pluginDirectory = join(
    temporaryRoot,
    "knowledge-base",
    "plugins",
    "broken-skills",
  );
  t.after(() => rm(temporaryRoot, { force: true, recursive: true }));

  await Promise.all([
    mkdir(marketplaceDirectory, { recursive: true }),
    mkdir(join(pluginDirectory, "knowledge", "core"), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(
      marketplaceFile,
      JSON.stringify({
        name: "knowledge-base",
        plugins: [
          {
            name: "broken-skills",
            source: "./knowledge-base/plugins/broken-skills",
          },
        ],
      }),
    ),
    writeFile(
      join(pluginDirectory, "knowledge", "index.md"),
      validCatalog(
        "| [knowledge/core/guide.md](core/guide.md) | evergreen |\n",
      ),
    ),
    writeFile(
      join(pluginDirectory, "knowledge", "core", "guide.md"),
      validDocument,
    ),
    writeFile(join(pluginDirectory, "skills"), "not a directory\n"),
  ]);

  const result = spawnSync(
    process.execPath,
    [checkerPath, "--marketplace", marketplaceFile, "--enforce-reachability"],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.doesNotMatch(result.stderr, /Knowledge directory is not a directory/);
  assert.match(
    result.stderr,
    /\[broken-skills\] knowledge-base\/plugins\/broken-skills\/skills: Skills directory is not a directory\./,
  );
});

test("rejects cross-plugin relative Markdown links from Skills and references into sibling plugins", async (t) => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "knowledge-check-"));
  const marketplaceDirectory = join(temporaryRoot, ".claude-plugin");
  const marketplaceFile = join(marketplaceDirectory, "marketplace.json");
  const pluginA = join(temporaryRoot, "knowledge-base", "plugins", "plugin-a");
  const pluginB = join(temporaryRoot, "knowledge-base", "plugins", "plugin-b");
  t.after(() => rm(temporaryRoot, { force: true, recursive: true }));

  await Promise.all([
    mkdir(marketplaceDirectory, { recursive: true }),
    mkdir(join(pluginA, "knowledge", "core"), { recursive: true }),
    mkdir(join(pluginA, "skills", "handbook-a", "references"), {
      recursive: true,
    }),
    mkdir(join(pluginA, "references"), { recursive: true }),
    mkdir(join(pluginB, "knowledge", "domain"), { recursive: true }),
    mkdir(join(pluginB, "skills", "handbook-b"), { recursive: true }),
    mkdir(join(pluginB, "references"), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(
      marketplaceFile,
      JSON.stringify({
        name: "knowledge-base",
        plugins: [
          { name: "plugin-a", source: "./knowledge-base/plugins/plugin-a" },
          { name: "plugin-b", source: "./knowledge-base/plugins/plugin-b" },
        ],
      }),
    ),
    writeFile(
      join(pluginA, "knowledge", "index.md"),
      validCatalog(
        "| [knowledge/core/guide.md](core/guide.md) | evergreen |\n",
      ),
    ),
    writeFile(join(pluginA, "knowledge", "core", "guide.md"), validDocument),
    writeFile(
      join(pluginA, "skills", "handbook-a", "SKILL.md"),
      "Read [Guide](../../knowledge/core/guide.md), " +
        "[Sibling Knowledge](../../../plugin-b/knowledge/domain/topic.md), " +
        "[Sibling Readme](../../../plugin-b/README.md), " +
        "[Local Ref](references/local.md), " +
        "[Shared Ref](../../references/shared.md), and " +
        "[Symlink Ref](references/symlink-ref.md).\n",
    ),
    writeFile(
      join(pluginA, "skills", "handbook-a", "references", "local.md"),
      "Read [Sibling Ref](../../../../plugin-b/references/shared.md).\n",
    ),
    writeFile(
      join(pluginA, "references", "shared.md"),
      "Read [Sibling Skill](../../plugin-b/skills/handbook-b/SKILL.md).\n",
    ),
    writeFile(
      join(pluginB, "knowledge", "index.md"),
      validCatalog(
        "| [knowledge/domain/topic.md](domain/topic.md) | evergreen |\n",
      ),
    ),
    writeFile(join(pluginB, "knowledge", "domain", "topic.md"), validDocument),
    writeFile(
      join(pluginB, "skills", "handbook-b", "SKILL.md"),
      "Read [Topic](../../knowledge/domain/topic.md).\n",
    ),
    writeFile(join(pluginB, "references", "shared.md"), "Sibling reference.\n"),
    writeFile(join(pluginB, "README.md"), "# Plugin B\n"),
    symlink(
      "../../../../plugin-b/references/shared.md",
      join(pluginA, "skills", "handbook-a", "references", "symlink-ref.md"),
    ),
  ]);

  const result = spawnSync(
    process.execPath,
    [checkerPath, "--marketplace", marketplaceFile, "--enforce-reachability"],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(
    result.stderr,
    "[plugin-a] knowledge-base/plugins/plugin-a/skills/handbook-a/SKILL.md: Route 'skills/handbook-a/SKILL.md -> ../plugin-b/knowledge/domain/topic.md' follows '../../../plugin-b/knowledge/domain/topic.md' from 'skills/handbook-a/SKILL.md:1' outside the plugin package.\n" +
      "[plugin-a] knowledge-base/plugins/plugin-a/skills/handbook-a/SKILL.md: Route 'skills/handbook-a/SKILL.md -> ../plugin-b/README.md' follows '../../../plugin-b/README.md' from 'skills/handbook-a/SKILL.md:1' outside the plugin package.\n" +
      "[plugin-a] knowledge-base/plugins/plugin-a/skills/handbook-a/SKILL.md: Route 'skills/handbook-a/SKILL.md -> references/shared.md -> ../plugin-b/skills/handbook-b/SKILL.md' follows '../../plugin-b/skills/handbook-b/SKILL.md' from 'references/shared.md:1' outside the plugin package.\n" +
      "[plugin-a] knowledge-base/plugins/plugin-a/skills/handbook-a/SKILL.md: Route 'skills/handbook-a/SKILL.md -> skills/handbook-a/references/local.md -> ../plugin-b/references/shared.md' follows '../../../../plugin-b/references/shared.md' from 'skills/handbook-a/references/local.md:1' outside the plugin package.\n" +
      "[plugin-a] knowledge-base/plugins/plugin-a/skills/handbook-a/SKILL.md: Route 'skills/handbook-a/SKILL.md -> skills/handbook-a/references/symlink-ref.md' follows 'references/symlink-ref.md' from 'skills/handbook-a/SKILL.md:1' outside the plugin package.\n",
  );
});

test("rejects a symlinked Knowledge leaf that resolves into a sibling plugin", async (t) => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "knowledge-check-"));
  const pluginA = join(temporaryRoot, "plugin-a");
  const pluginB = join(temporaryRoot, "plugin-b");
  t.after(() => rm(temporaryRoot, { force: true, recursive: true }));

  await Promise.all([
    mkdir(join(pluginA, "knowledge", "core"), { recursive: true }),
    mkdir(join(pluginA, "skills", "handbook-a"), { recursive: true }),
    mkdir(join(pluginB, "knowledge", "domain"), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(join(pluginB, "knowledge", "domain", "topic.md"), validDocument),
    writeFile(
      join(pluginA, "skills", "handbook-a", "SKILL.md"),
      "Read [Escaped](../../knowledge/core/escaped.md).\n",
    ),
    symlink(
      "../../../plugin-b/knowledge/domain/topic.md",
      join(pluginA, "knowledge", "core", "escaped.md"),
    ),
  ]);

  const reachability = await checkKnowledgeReachability(pluginA, [
    "knowledge/core/escaped.md",
  ]);

  assert.deepEqual(reachability.reachableKnowledgeFilePaths, []);
  assert.deepEqual(reachability.unreachableKnowledgeFilePaths, [
    "knowledge/core/escaped.md",
  ]);
  assert.deepEqual(reachability.diagnostics, [
    {
      filePath: "skills/handbook-a/SKILL.md",
      message:
        "Route 'skills/handbook-a/SKILL.md -> knowledge/core/escaped.md' follows '../../knowledge/core/escaped.md' from 'skills/handbook-a/SKILL.md:1' outside the plugin package.",
    },
  ]);
});

test("rejects invalid CLI combinations and invalid Marketplace plugin entries", async (t) => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "knowledge-check-"));
  const marketplaceFile = join(temporaryRoot, "marketplace.json");
  t.after(() => rm(temporaryRoot, { force: true, recursive: true }));

  const mixedArgsResult = spawnSync(
    process.execPath,
    [
      checkerPath,
      "knowledge-base/plugins/knowledge-base/knowledge",
      "--marketplace",
      marketplaceFile,
    ],
    { encoding: "utf8" },
  );

  assert.equal(mixedArgsResult.status, 2);
  assert.equal(mixedArgsResult.stdout, "");

  await writeFile(
    marketplaceFile,
    JSON.stringify({
      name: "knowledge-base",
      plugins: [{ name: "escaped", source: "../outside" }],
    }),
  );

  const escapedSourceResult = spawnSync(
    process.execPath,
    [checkerPath, "--marketplace", marketplaceFile],
    { encoding: "utf8" },
  );

  assert.equal(escapedSourceResult.status, 1);
  assert.equal(escapedSourceResult.stdout, "");
  assert.match(
    escapedSourceResult.stderr,
    /Marketplace plugin source '\.\.\/outside' must be a package-relative path starting with '\.\/' without '\.\.'\./,
  );
});

test("recursively checks Markdown files through the CLI", async (t) => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "knowledge-check-"));
  const knowledgeDirectory = join(temporaryRoot, "knowledge");
  const nestedDirectory = join(knowledgeDirectory, "security");
  t.after(() => rm(temporaryRoot, { force: true, recursive: true }));

  await mkdir(nestedDirectory, { recursive: true });
  await Promise.all([
    writeFile(
      join(knowledgeDirectory, "index.md"),
      validCatalog(
        "| [knowledge/security/authentication.md](security/authentication.md) | evergreen |\n",
      ),
    ),
    writeFile(join(nestedDirectory, "authentication.md"), validDocument),
    writeFile(join(nestedDirectory, "notes.txt"), "Not Markdown."),
  ]);

  const result = spawnSync(
    process.execPath,
    [checkerPath, knowledgeDirectory],
    {
      encoding: "utf8",
    },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Checked 2 knowledge Markdown files\./);
  assert.equal(result.stderr, "");
});

test("exits nonzero with file-relative diagnostics", async (t) => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "knowledge-check-"));
  const knowledgeDirectory = join(temporaryRoot, "knowledge");
  const nestedDirectory = join(knowledgeDirectory, "security");
  t.after(() => rm(temporaryRoot, { force: true, recursive: true }));

  await mkdir(nestedDirectory, { recursive: true });
  await writeFile(
    join(nestedDirectory, "authentication.md"),
    "# Authentication\n\nMissing the required preface.\n",
  );

  const result = spawnSync(
    process.execPath,
    [checkerPath, knowledgeDirectory],
    {
      encoding: "utf8",
    },
  );

  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.match(
    result.stderr,
    /knowledge\/security\/authentication\.md: The first section after the title must be '## Scope'\./,
  );
});

test("rejects nested Knowledge catalogs", async (t) => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "knowledge-check-"));
  const knowledgeDirectory = join(temporaryRoot, "knowledge");
  const nestedDirectory = join(knowledgeDirectory, "security");
  t.after(() => rm(temporaryRoot, { force: true, recursive: true }));

  await mkdir(nestedDirectory, { recursive: true });
  await Promise.all([
    writeFile(join(knowledgeDirectory, "index.md"), validCatalog("")),
    writeFile(join(nestedDirectory, "index.md"), validDocument),
  ]);

  const result = spawnSync(
    process.execPath,
    [checkerPath, knowledgeDirectory],
    {
      encoding: "utf8",
    },
  );

  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.match(
    result.stderr,
    /knowledge\/security\/index\.md: Nested Knowledge catalogs are not allowed; list leaf documents directly in 'knowledge\/index\.md'\./,
  );
});

test("reports Knowledge inventory mismatches in both directions", async (t) => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "knowledge-check-"));
  const knowledgeDirectory = join(temporaryRoot, "knowledge");
  const nestedDirectory = join(knowledgeDirectory, "security");
  t.after(() => rm(temporaryRoot, { force: true, recursive: true }));

  await mkdir(nestedDirectory, { recursive: true });
  await Promise.all([
    writeFile(
      join(knowledgeDirectory, "index.md"),
      validCatalog("| [knowledge/missing.md](missing.md) | evergreen |\n"),
    ),
    writeFile(join(nestedDirectory, "authentication.md"), validDocument),
  ]);

  const result = spawnSync(
    process.execPath,
    [checkerPath, knowledgeDirectory],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(
    result.stderr,
    "knowledge/index.md: The catalog lists 'knowledge/missing.md', but that leaf document does not exist.\n" +
      "knowledge/index.md: Knowledge leaf 'knowledge/security/authentication.md' must be listed exactly once in the catalog.\n",
  );
});

test("reports Skill reachability in diagnostic mode without enforcing orphans", async (t) => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "knowledge-check-"));
  const pluginDirectory = join(temporaryRoot, "plugin");
  const knowledgeDirectory = join(pluginDirectory, "knowledge");
  const topicDirectory = join(knowledgeDirectory, "security");
  const skillDirectory = join(
    pluginDirectory,
    "skills",
    "workflow-review-security",
  );
  t.after(() => rm(temporaryRoot, { force: true, recursive: true }));

  await Promise.all([
    mkdir(topicDirectory, { recursive: true }),
    mkdir(skillDirectory, { recursive: true }),
  ]);
  await Promise.all([
    writeFile(
      join(knowledgeDirectory, "index.md"),
      validCatalog(
        "| [knowledge/security/authentication.md](security/authentication.md) | evergreen |\n" +
          "| [knowledge/security/authorization.md](security/authorization.md) | evergreen |\n",
      ),
    ),
    writeFile(join(topicDirectory, "authentication.md"), validDocument),
    writeFile(join(topicDirectory, "authorization.md"), validDocument),
    writeFile(
      join(skillDirectory, "SKILL.md"),
      "Read [Authentication](../../knowledge/security/authentication.md#scope).\n",
    ),
  ]);

  const migrationResult = spawnSync(
    process.execPath,
    [checkerPath, knowledgeDirectory],
    { encoding: "utf8" },
  );

  assert.equal(migrationResult.status, 0, migrationResult.stderr);
  assert.equal(
    migrationResult.stdout,
    "Checked 3 knowledge Markdown files. " +
      "1 of 2 Knowledge leaves are reachable from 1 installed Skill entrypoint; " +
      "1 is not yet reachable.\n",
  );
  assert.equal(migrationResult.stderr, "");

  const enforcedResult = spawnSync(
    process.execPath,
    [checkerPath, knowledgeDirectory, "--enforce-reachability"],
    { encoding: "utf8" },
  );

  assert.equal(enforcedResult.status, 1);
  assert.equal(enforcedResult.stdout, "");
  assert.equal(
    enforcedResult.stderr,
    "knowledge/security/authorization.md: Knowledge leaf is not reachable from an installed Skill entrypoint through package-local Markdown links.\n",
  );
});

test("follows used reference links through package references and terminates cycles", async (t) => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "knowledge-check-"));
  const pluginDirectory = join(temporaryRoot, "plugin");
  const knowledgeDirectory = join(pluginDirectory, "knowledge");
  const topicDirectory = join(knowledgeDirectory, "security");
  const skillDirectory = join(
    pluginDirectory,
    "skills",
    "workflow-review-security",
  );
  const skillReferencesDirectory = join(skillDirectory, "references");
  const sharedReferencesDirectory = join(pluginDirectory, "references");
  t.after(() => rm(temporaryRoot, { force: true, recursive: true }));

  await Promise.all([
    mkdir(topicDirectory, { recursive: true }),
    mkdir(skillReferencesDirectory, { recursive: true }),
    mkdir(sharedReferencesDirectory, { recursive: true }),
  ]);
  await Promise.all([
    writeFile(
      join(knowledgeDirectory, "index.md"),
      validCatalog(
        "| [knowledge/security/authentication.md](security/authentication.md) | evergreen |\n" +
          "| [knowledge/security/image-only.md](security/image-only.md) | evergreen |\n" +
          "| [knowledge/security/inline-image-only.md](security/inline-image-only.md) | evergreen |\n" +
          "| [knowledge/security/unused.md](security/unused.md) | evergreen |\n",
      ),
    ),
    writeFile(join(topicDirectory, "authentication.md"), validDocument),
    writeFile(join(topicDirectory, "image-only.md"), validDocument),
    writeFile(join(topicDirectory, "inline-image-only.md"), validDocument),
    writeFile(join(topicDirectory, "unused.md"), validDocument),
    writeFile(
      join(skillDirectory, "SKILL.md"),
      "Read the [local route][route].\n\n" +
        "![Inline diagram](../../knowledge/security/inline-image-only.md)\n\n" +
        "![Diagram][image]\n\n" +
        "[route]: references/start.md\n" +
        "[image]: ../../knowledge/security/image-only.md\n" +
        "[unused]: ../../knowledge/security/unused.md\n",
    ),
    writeFile(
      join(skillReferencesDirectory, "start.md"),
      "Continue through the [shared route](../../../references/first.md).\n",
    ),
    writeFile(
      join(sharedReferencesDirectory, "first.md"),
      "Continue to the [second reference][second].\n\n[second]: second.md\n",
    ),
    writeFile(
      join(sharedReferencesDirectory, "second.md"),
      "Read [Authentication][knowledge], then return to the [first reference](first.md).\n\n" +
        "[knowledge]: ../knowledge/security/authentication.md#scope\n",
    ),
  ]);

  const result = spawnSync(
    process.execPath,
    [checkerPath, knowledgeDirectory],
    {
      encoding: "utf8",
    },
  );

  const enforcedResult = spawnSync(
    process.execPath,
    [checkerPath, knowledgeDirectory, "--enforce-reachability"],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, "");
  assert.equal(enforcedResult.status, 1);
  assert.equal(enforcedResult.stdout, "");
  assert.equal(
    enforcedResult.stderr,
    "knowledge/security/image-only.md: Knowledge leaf is not reachable from an installed Skill entrypoint through package-local Markdown links.\n" +
      "knowledge/security/inline-image-only.md: Knowledge leaf is not reachable from an installed Skill entrypoint through package-local Markdown links.\n" +
      "knowledge/security/unused.md: Knowledge leaf is not reachable from an installed Skill entrypoint through package-local Markdown links.\n",
  );
  assert.equal(
    result.stdout,
    "Checked 5 knowledge Markdown files. " +
      "1 of 4 Knowledge leaves are reachable from 1 installed Skill entrypoint; " +
      "3 are not yet reachable.\n",
  );
});

test("excludes non-runtime sources and stops traversal at Knowledge", async (t) => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "knowledge-check-"));
  const pluginDirectory = join(temporaryRoot, "plugin");
  const knowledgeDirectory = join(pluginDirectory, "knowledge");
  const topicDirectory = join(knowledgeDirectory, "security");
  const skillDirectory = join(
    pluginDirectory,
    "skills",
    "workflow-review-security",
  );
  const authoringSkillDirectory = join(
    temporaryRoot,
    ".agents",
    "skills",
    "authoring",
  );
  const otherPluginSkillDirectory = join(
    temporaryRoot,
    "plugins",
    "other",
    "skills",
    "reader",
  );
  t.after(() => rm(temporaryRoot, { force: true, recursive: true }));

  const leafNames = [
    "authoring-only",
    "chained",
    "direct",
    "fixture-only",
    "other-plugin-only",
    "readme-only",
    "research-only",
  ];
  await Promise.all([
    mkdir(topicDirectory, { recursive: true }),
    mkdir(skillDirectory, { recursive: true }),
    mkdir(join(pluginDirectory, "references", "research"), {
      recursive: true,
    }),
    mkdir(join(pluginDirectory, "references", "tests", "fixtures"), {
      recursive: true,
    }),
    mkdir(authoringSkillDirectory, { recursive: true }),
    mkdir(otherPluginSkillDirectory, { recursive: true }),
  ]);
  await Promise.all([
    writeFile(
      join(knowledgeDirectory, "index.md"),
      validCatalog(
        leafNames
          .map(
            (leafName) =>
              `| [knowledge/security/${leafName}.md](security/${leafName}.md) | evergreen |`,
          )
          .join("\n") + "\n",
      ),
    ),
    ...leafNames.map((leafName) =>
      writeFile(
        join(topicDirectory, `${leafName}.md`),
        leafName === "direct"
          ? `${validDocument}\n## Details\n\nRead [Chained](chained.md).\n`
          : validDocument,
      ),
    ),
    writeFile(
      join(skillDirectory, "SKILL.md"),
      "Read [Direct](../../knowledge/security/direct.md), " +
        "the [Catalog](../../knowledge/index.md), " +
        "a [README route](../../references/README.md), " +
        "[research](../../references/research/note.md), and " +
        "a [fixture](../../references/tests/fixtures/route.md).\n",
    ),
    writeFile(
      join(pluginDirectory, "references", "README.md"),
      "Read [README-only Knowledge](../knowledge/security/readme-only.md).\n",
    ),
    writeFile(
      join(pluginDirectory, "references", "research", "note.md"),
      "Read [research-only Knowledge](../../knowledge/security/research-only.md).\n",
    ),
    writeFile(
      join(pluginDirectory, "references", "tests", "fixtures", "route.md"),
      "Read [fixture-only Knowledge](../../../knowledge/security/fixture-only.md).\n",
    ),
    writeFile(
      join(authoringSkillDirectory, "SKILL.md"),
      "Read [authoring-only Knowledge](../../../plugin/knowledge/security/authoring-only.md).\n",
    ),
    writeFile(
      join(otherPluginSkillDirectory, "SKILL.md"),
      "Read [other-plugin-only Knowledge](../../../../plugin/knowledge/security/other-plugin-only.md).\n",
    ),
  ]);

  const result = spawnSync(
    process.execPath,
    [checkerPath, knowledgeDirectory],
    {
      encoding: "utf8",
    },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    result.stdout,
    "Checked 8 knowledge Markdown files. " +
      "1 of 7 Knowledge leaves are reachable from 1 installed Skill entrypoint; " +
      "6 are not yet reachable.\n",
  );
  assert.equal(result.stderr, "");
});

test("reports actionable diagnostics for broken Skill routes", async (t) => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "knowledge-check-"));
  const pluginDirectory = join(temporaryRoot, "plugin");
  const knowledgeDirectory = join(pluginDirectory, "knowledge");
  const topicDirectory = join(knowledgeDirectory, "security");
  const sharedReferencesDirectory = join(pluginDirectory, "references");
  const outsideDirectory = join(temporaryRoot, "outside");
  t.after(() => rm(temporaryRoot, { force: true, recursive: true }));

  await Promise.all([
    mkdir(topicDirectory, { recursive: true }),
    mkdir(sharedReferencesDirectory, { recursive: true }),
    mkdir(join(sharedReferencesDirectory, "unreadable.md"), {
      recursive: true,
    }),
    mkdir(outsideDirectory, { recursive: true }),
    ...["escape", "malformed", "missing", "unreadable"].map((skillName) =>
      mkdir(join(pluginDirectory, "skills", skillName), { recursive: true }),
    ),
  ]);
  await Promise.all([
    writeFile(
      join(knowledgeDirectory, "index.md"),
      validCatalog(
        "| [knowledge/security/authentication.md](security/authentication.md) | evergreen |\n",
      ),
    ),
    writeFile(join(topicDirectory, "authentication.md"), validDocument),
    writeFile(join(outsideDirectory, "reference.md"), "Outside package.\n"),
    writeFile(
      join(pluginDirectory, "skills", "escape", "SKILL.md"),
      "Read [outside](../../../outside/reference.md).\n",
    ),
    writeFile(
      join(pluginDirectory, "skills", "malformed", "SKILL.md"),
      "Read [malformed](%ZZ.md).\n",
    ),
    writeFile(
      join(pluginDirectory, "skills", "missing", "SKILL.md"),
      "Read [missing](references/missing.md).\n",
    ),
    writeFile(
      join(pluginDirectory, "skills", "unreadable", "SKILL.md"),
      "Read [unreadable](../../references/unreadable.md).\n",
    ),
  ]);

  const result = spawnSync(
    process.execPath,
    [checkerPath, knowledgeDirectory],
    {
      encoding: "utf8",
    },
  );

  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(
    result.stderr,
    "skills/escape/SKILL.md: Route 'skills/escape/SKILL.md -> ../outside/reference.md' follows '../../../outside/reference.md' from 'skills/escape/SKILL.md:1' outside the plugin package.\n" +
      "skills/malformed/SKILL.md: Route 'skills/malformed/SKILL.md' has malformed Markdown link '%ZZ.md' at 'skills/malformed/SKILL.md:1': invalid percent encoding.\n" +
      "skills/missing/SKILL.md: Route 'skills/missing/SKILL.md -> skills/missing/references/missing.md' cannot read 'skills/missing/references/missing.md' linked from 'skills/missing/SKILL.md:1': file does not exist.\n" +
      "skills/unreadable/SKILL.md: Route 'skills/unreadable/SKILL.md -> references/unreadable.md' cannot read 'references/unreadable.md' linked from 'skills/unreadable/SKILL.md:1': target is not a readable Markdown file (EISDIR).\n",
  );
});
