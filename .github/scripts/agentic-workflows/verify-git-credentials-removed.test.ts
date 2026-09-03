import assert from "node:assert/strict";
import { chmodSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { describe, it } from "node:test";

const verifier = fileURLToPath(
  new URL("verify-git-credentials-removed.sh", import.meta.url),
);

type Fixture = {
  config: string | ((gitDirectory: string) => string);
  includedConfig?: string;
  restrictRepository?: boolean;
};

function runVerifier(fixture: Fixture | string) {
  const root = mkdtempSync(join(tmpdir(), "git-credential-verifier-"));
  const repository = join(root, "repository");
  const initialized = spawnSync("git", ["init", "--quiet", repository], {
    encoding: "utf8",
  });
  if (initialized.status !== 0) {
    throw new Error(initialized.stderr);
  }
  const gitDirectory = join(repository, ".git");
  const normalized =
    typeof fixture === "string" ? { config: fixture } : fixture;
  const config =
    typeof normalized.config === "function"
      ? normalized.config(gitDirectory)
      : normalized.config;
  writeFileSync(join(gitDirectory, "config"), `\n${config}\n`, { flag: "a" });
  if (normalized.includedConfig !== undefined) {
    writeFileSync(
      join(gitDirectory, "included.conf"),
      normalized.includedConfig,
    );
  }

  if (normalized.restrictRepository === true) {
    chmodSync(repository, 0o000);
  }
  const result = spawnSync("bash", [verifier, root], { encoding: "utf8" });
  if (normalized.restrictRepository === true) {
    chmodSync(repository, 0o700);
  }
  rmSync(root, { force: true, recursive: true });
  return result;
}

describe("verify-git-credentials-removed", () => {
  it("accepts a parseable config without credentials", () => {
    const result = runVerifier(`
[remote "origin"]
  url = https://github.com/Soulike/knowledge-base.git
`);

    assert.equal(result.status, 0, result.stderr);
  });

  for (const candidate of [
    {
      config: `[credential]\n  helper = store\n`,
      name: "credential helper",
    },
    {
      config: `[http "https://github.com/"]\n  extraheader = AUTHORIZATION: basic secret-value\n`,
      name: "HTTP extraheader",
    },
    {
      config: `[remote "origin"]\n  url = https://x-access-token:secret-value@github.com/Soulike/knowledge-base.git\n`,
      name: "authenticated remote",
    },
    {
      config: `[url "https://x-access-token:secret-value@github.com/"]\n  insteadOf = https://github.com/\n`,
      name: "credentialed URL rewrite",
    },
  ]) {
    it(`rejects ${candidate.name} without logging its value`, () => {
      const result = runVerifier(candidate.config);

      assert.equal(result.status, 1);
      assert.doesNotMatch(result.stderr, /secret-value/u);
    });
  }

  for (const candidate of [
    {
      config: `[include]\n  path = included.conf\n`,
      name: "included credential helper",
    },
    {
      config: (gitDirectory: string) =>
        `[includeIf "gitdir:${gitDirectory}"]\n  path = included.conf\n`,
      name: "conditionally included credential helper",
    },
  ]) {
    it(`rejects ${candidate.name}`, () => {
      const result = runVerifier({
        config: candidate.config,
        includedConfig: `[credential]\n  helper = store\n`,
      });

      assert.equal(result.status, 1);
    });
  }

  it("rejects a config that cannot be verified", () => {
    const result = runVerifier(`[credential\n  helper = store\n`);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /cannot be verified/u);
  });

  it("rejects a root that cannot be completely inspected", () => {
    const result = runVerifier({
      config: `[credential]\n  helper = store\n`,
      restrictRepository: true,
    });

    assert.equal(result.status, 1);
    assert.match(result.stderr, /could not inspect/u);
  });
});
