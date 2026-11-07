import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test, type TestContext } from "node:test";
import { fileURLToPath } from "node:url";

import { caseEntrypoints, checkCases, parseCaseDocument } from "./check.ts";

function example(
  id: string,
  covered = "[Document](../../document.md)",
  omit = "",
): string {
  const sections = [
    ["Identity", `- ID: ${id}\n- Kind: application`],
    ["Covered objects", covered],
    [
      "Protected behavior",
      "Protect an accepted decision while allowing rewording.",
    ],
    ["Task", "Perform the assigned decision."],
    ["Starting state", "Use the supplied materials."],
    ["Expected behavior", "Preserve the accepted outcome."],
    ["Verification", "Observe the output and judge the contract."],
    ["Source", "Independently accepted fixture contract."],
  ];
  return `# Example\n\n${sections
    .filter(([name]) => name !== omit)
    .map(([name, body]) => `## ${name}\n\n${body}`)
    .join("\n\n")}\n`;
}

async function temporaryDirectory(context: TestContext): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "case-check-"));
  context.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

async function writeCaseWithDocument(
  root: string,
  directory: string,
  id: string,
): Promise<void> {
  await mkdir(join(root, directory, "tests", id), { recursive: true });
  await writeFile(join(root, directory, "document.md"), "# Subject\n");
  await writeFile(join(root, directory, "tests", id, "case.md"), example(id));
}

test("resolves reference-style coverage", () => {
  const valid = parseCaseDocument(
    `${example("reader", "- [Document][subject]")}\n[subject]: ../../document.md\n`,
    "tests/reader/case.md",
  );
  assert.deepEqual(valid.record?.covers, ["document.md"]);
  assert.deepEqual(valid.diagnostics, []);
});

test("rejects missing task or expectation sections", () => {
  for (const missing of ["Task", "Expected behavior"]) {
    const invalid = parseCaseDocument(
      example("reader", "[Document](../../document.md)", missing),
      "tests/reader/case.md",
    );
    assert.equal(invalid.record, null);
    assert.ok(
      invalid.diagnostics.includes(`Missing or empty section: ${missing}`),
      `Missing ${missing} must be diagnosed.`,
    );
  }
});

test("reference coverage follows the first definition for its label", () => {
  const parsed = parseCaseDocument(
    `${example("reader", "- [Document][subject]")}\n[subject]: ../../document.md\n[subject]: ../../other/document.md\n`,
    "tests/reader/case.md",
  );
  assert.deepEqual(parsed.record?.covers, ["document.md"]);
  assert.deepEqual(parsed.diagnostics, []);
});

test("discovers common-ancestor cases without treating nested fixture cases as entries", () => {
  assert.deepEqual(
    caseEntrypoints([
      "tests/joint/case.md",
      ".agents/tests/local/case.md",
      "tests/joint/fixtures/tests/sample/case.md",
      "tests/joint/case.md",
    ]),
    [".agents/tests/local/case.md", "tests/joint/case.md"],
  );
});

test("rejects cases outside the nearest common directory", () => {
  const misplaced = parseCaseDocument(
    example(
      "joint",
      "[A](../../../.agents/one.md)\n\n[B](../../../knowledge-base/two.md)",
    ),
    ".agents/tests/joint/case.md",
  );
  assert.equal(misplaced.record, null);
  assert.ok(
    misplaced.diagnostics.some((message) =>
      message.includes("nearest common directory"),
    ),
  );
});

test("rejects global duplicate IDs", async (context) => {
  const root = await temporaryDirectory(context);
  for (const directory of ["a", "b"]) {
    await writeCaseWithDocument(root, directory, "same");
  }
  const result = await checkCases(root, [
    "a/tests/same/case.md",
    "b/tests/same/case.md",
  ]);
  assert.ok(
    result.diagnostics.some((message) => message.includes("also belongs")),
  );
});

test("rejects missing linked material", async (context) => {
  const root = await temporaryDirectory(context);
  await writeCaseWithDocument(root, "a", "same");
  await rm(join(root, "a/document.md"));
  const missing = await checkCases(root, ["a/tests/same/case.md"]);
  assert.ok(
    missing.diagnostics.some((message) =>
      message.includes("Referenced file is missing"),
    ),
  );
});

test("CLI fails discovery outside a repository", async (context) => {
  const root = await temporaryDirectory(context);
  const executable = fileURLToPath(new URL("check.ts", import.meta.url));
  const absent = spawnSync(process.execPath, [executable, root, "--json"], {
    encoding: "utf8",
  });
  assert.equal(absent.status, 1);
  assert.match(absent.stderr, /Cannot discover regression cases/u);
});

test("CLI includes untracked cases", async (context) => {
  const root = await temporaryDirectory(context);
  const executable = fileURLToPath(new URL("check.ts", import.meta.url));
  execFileSync("git", ["init", "--quiet", root]);
  await writeCaseWithDocument(root, "", "reader");
  const result = spawnSync(process.execPath, [executable, root, "--json"], {
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  const entries: unknown = JSON.parse(result.stdout);
  assert.deepEqual(entries, [
    {
      id: "reader",
      kind: "application",
      filePath: "tests/reader/case.md",
      covers: ["document.md"],
    },
  ]);
});
