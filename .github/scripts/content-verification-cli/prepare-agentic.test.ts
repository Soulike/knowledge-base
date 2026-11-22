import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { promisify } from "node:util";

import { parseVerificationManifest } from "../content-verification-contract/manifest-validation.ts";

const executeFile = promisify(execFile);
const script = new URL("./prepare-agentic.ts", import.meta.url).pathname;

async function commitRepoFiles(
  files: Readonly<Record<string, string>>,
): Promise<{ directory: string; revision: string }> {
  const directory = await mkdtemp(
    join(tmpdir(), "content-verification-prepare-agentic-"),
  );
  try {
    await executeFile("git", ["init"], { cwd: directory });
    await executeFile("git", ["config", "user.name", "Test"], {
      cwd: directory,
    });
    await executeFile("git", ["config", "user.email", "test@example.com"], {
      cwd: directory,
    });
    for (const [relativePath, content] of Object.entries(files)) {
      const fullPath = join(directory, relativePath);
      await mkdir(join(fullPath, ".."), { recursive: true });
      await writeFile(fullPath, content, "utf8");
    }
    await executeFile("git", ["add", "."], { cwd: directory });
    await executeFile("git", ["commit", "-m", "init"], { cwd: directory });
    const { stdout } = await executeFile("git", ["rev-parse", "HEAD"], {
      cwd: directory,
    });
    return { directory, revision: stdout.trim() };
  } catch (error) {
    await rm(directory, { force: true, recursive: true });
    throw error;
  }
}

function catalogMarkdown(rows: Array<[string, string]>): string {
  const lines = rows.map(
    ([path, type]) => `| [knowledge/${path}](${path}) | ${type} |`,
  );
  return `# Knowledge catalog

## Documents

| File Path | Knowledge Type |
| --- | --- |
${lines.join("\n")}
`;
}

describe("prepare-agentic", () => {
  it("builds a manifest across isomorphic plugins and legacy layout", async () => {
    const { directory, revision } = await commitRepoFiles({
      "knowledge-base/plugin/knowledge/index.md": catalogMarkdown([
        ["legacy.md", "evergreen"],
      ]),
      "knowledge-base/plugin/knowledge/legacy.md": "# Legacy\n",
      "knowledge-base/plugins/codex/knowledge/index.md": catalogMarkdown([
        ["provider.md", "time-sensitive"],
      ]),
      "knowledge-base/plugins/codex/knowledge/provider.md": "# Provider\n",
      "knowledge-base/plugins/codex/references/setup.md": "# Setup\n",
      "knowledge-base/plugins/codex/skills/handbook-codex/SKILL.md":
        "# Codex\n",
    });

    const outputDirectory = await mkdtemp(
      join(tmpdir(), "content-verification-prepare-out-"),
    );
    const outputPath = join(outputDirectory, "manifest.json");
    try {
      await executeFile(process.execPath, [script], {
        env: {
          ...process.env,
          CONTENT_VERIFICATION_SCOPE: "evergreen-knowledge",
          CONTENT_VERIFICATION_TARGET_MANIFEST: outputPath,
          GITHUB_WORKSPACE: directory,
        },
      });
      const manifest = parseVerificationManifest(
        JSON.parse(await readFile(outputPath, "utf8")) as unknown,
        revision,
        "evergreen-knowledge",
      );
      assert.deepEqual(manifest.reviewTargetIds, [
        "knowledge-base/plugin/knowledge/legacy.md",
      ]);
      assert.deepEqual(
        manifest.targetCatalog.map((target) => target.id),
        [
          "knowledge-base/plugin/knowledge/legacy.md",
          "knowledge-base/plugins/codex/knowledge/provider.md",
          "knowledge-base/plugins/codex/references/setup.md",
          "knowledge-base/plugins/codex/skills/handbook-codex/SKILL.md",
        ],
      );
    } finally {
      await rm(directory, { force: true, recursive: true });
      await rm(outputDirectory, { force: true, recursive: true });
    }
  });

  it("fails deterministically when a plugin knowledge directory has no catalog", async () => {
    const { directory } = await commitRepoFiles({
      "knowledge-base/plugins/knowledge-base/knowledge/index.md":
        catalogMarkdown([["base.md", "evergreen"]]),
      "knowledge-base/plugins/knowledge-base/knowledge/base.md": "# Base\n",
      "knowledge-base/plugins/broken/knowledge/orphan.md": "# Orphan\n",
    });

    const outputDirectory = await mkdtemp(
      join(tmpdir(), "content-verification-prepare-out-"),
    );
    const outputPath = join(outputDirectory, "manifest.json");
    try {
      await assert.rejects(
        () =>
          executeFile(process.execPath, [script], {
            env: {
              ...process.env,
              CONTENT_VERIFICATION_SCOPE: "evergreen-knowledge",
              CONTENT_VERIFICATION_TARGET_MANIFEST: outputPath,
              GITHUB_WORKSPACE: directory,
            },
          }),
        /Knowledge directory 'knowledge-base\/plugins\/broken\/knowledge' is missing its Knowledge catalog/u,
      );
    } finally {
      await rm(directory, { force: true, recursive: true });
      await rm(outputDirectory, { force: true, recursive: true });
    }
  });
});
