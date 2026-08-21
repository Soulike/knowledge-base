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

function validIndex(rows: string): string {
  return `# Knowledge index

## Scope

This index lists Knowledge.

## When to update

Update this index when Knowledge changes.

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
  assert.equal(result.stderr, "Usage: node check.ts <knowledge-directory>\n");
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
      validIndex(
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

test("rejects nested knowledge indexes", async (t) => {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "knowledge-check-"));
  const knowledgeDirectory = join(temporaryRoot, "knowledge");
  const nestedDirectory = join(knowledgeDirectory, "security");
  t.after(() => rm(temporaryRoot, { force: true, recursive: true }));

  await mkdir(nestedDirectory, { recursive: true });
  await Promise.all([
    writeFile(join(knowledgeDirectory, "index.md"), validIndex("")),
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
    /knowledge\/security\/index\.md: Nested knowledge indexes are not allowed; list leaf documents directly in 'knowledge\/index\.md'\./,
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
      validIndex(
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
    "knowledge/index.md: The index lists 'knowledge/missing.md', but that leaf document does not exist.\n" +
      "knowledge/index.md: Knowledge leaf 'knowledge/security/authentication.md' must be listed exactly once in the index.\n",
  );
});
