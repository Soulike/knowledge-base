import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

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

| File Path | Knowledge Type | When to Read |
| --- | --- | --- |
${rows}`;
}

test("requires the knowledge directory as a CLI argument", () => {
  const result = spawnSync(process.execPath, [checkerPath], {
    encoding: "utf8",
  });

  assert.equal(result.status, 2);
  assert.equal(result.stdout, "");
  assert.equal(
    result.stderr,
    "Usage: node check.ts <knowledge-directory> [--enforce-reachability]\n",
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
        "| [knowledge/security/authentication.md](security/authentication.md) | evergreen | Read when authenticating. |\n",
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
      validCatalog(
        "| [knowledge/missing.md](missing.md) | evergreen | Read when checking missing Knowledge. |\n",
      ),
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

test("reports Skill reachability without enforcing migration orphans", async (t) => {
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
        "| [knowledge/security/authentication.md](security/authentication.md) | evergreen | Read when authenticating. |\n" +
          "| [knowledge/security/authorization.md](security/authorization.md) | evergreen | Read when authorizing. |\n",
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
        "| [knowledge/security/authentication.md](security/authentication.md) | evergreen | Read when authenticating. |\n" +
          "| [knowledge/security/image-only.md](security/image-only.md) | evergreen | Read when checking images. |\n" +
          "| [knowledge/security/inline-image-only.md](security/inline-image-only.md) | evergreen | Read when checking inline images. |\n" +
          "| [knowledge/security/unused.md](security/unused.md) | evergreen | Read when checking unused definitions. |\n",
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
              `| [knowledge/security/${leafName}.md](security/${leafName}.md) | evergreen | Read when checking ${leafName}. |`,
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
        "| [knowledge/security/authentication.md](security/authentication.md) | evergreen | Read when authenticating. |\n",
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
