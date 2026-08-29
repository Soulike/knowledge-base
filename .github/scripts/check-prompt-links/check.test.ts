import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const checkerPath = fileURLToPath(new URL("./check.ts", import.meta.url));

test("requires the repository directory", () => {
  const result = spawnSync(process.execPath, [checkerPath], {
    encoding: "utf8",
  });

  assert.equal(result.status, 2);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, "Usage: node check.ts <repository-directory>\n");
});

test("checks new prompt Markdown and detects deleted targets", async (t) => {
  const repository = await mkdtemp(join(tmpdir(), "prompt-links-"));
  const promptDirectory = join(
    repository,
    ".github",
    "scripts",
    "example",
    "prompts",
  );
  t.after(() => rm(repository, { force: true, recursive: true }));

  await mkdir(promptDirectory, { recursive: true });
  await Promise.all([
    writeFile(join(repository, "AGENTS.md"), "# Instructions\n"),
    writeFile(
      join(promptDirectory, "review.md"),
      "Read [repository instructions](AGENTS.md).\n",
    ),
    writeFile(
      join(repository, "notes.md"),
      "This ordinary document has [different semantics](missing.md).\n",
    ),
  ]);
  execFileSync("git", ["init", "--quiet"], { cwd: repository });
  execFileSync("git", ["add", "AGENTS.md", "notes.md"], {
    cwd: repository,
  });

  const result = spawnSync(process.execPath, [checkerPath, repository], {
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, "Checked 1 prompt Markdown files.\n");
  assert.equal(result.stderr, "");

  await rm(join(repository, "AGENTS.md"));
  const missingTargetResult = spawnSync(
    process.execPath,
    [checkerPath, repository],
    { encoding: "utf8" },
  );

  assert.equal(missingTargetResult.status, 1);
  assert.equal(missingTargetResult.stdout, "");
  assert.match(
    missingTargetResult.stderr,
    /review\.md:1: Prompt link 'AGENTS\.md' does not match a repository file\./u,
  );
});
