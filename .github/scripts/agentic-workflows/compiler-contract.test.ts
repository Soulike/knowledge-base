import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertNoGeneratedDrift,
  compilerInvocation,
  compilerVersion,
  requireCompilerVersion,
  runtimeActionSha,
} from "./compiler-contract.ts";

describe("compilerInvocation", () => {
  it("uses the same release action and validation flags for both compiler entry points", () => {
    const compileArguments = [
      "compile",
      "--action-mode",
      "release",
      "--action-tag",
      runtimeActionSha,
      "--strict",
      "--validate",
      "--no-check-update",
    ];

    assert.deepEqual(compilerInvocation({}), {
      args: ["aw", ...compileArguments],
      command: "gh",
      versionArgs: ["aw", "--version"],
    });

    assert.deepEqual(
      compilerInvocation({
        GH_AW_COMPILER: "/private/tmp/gh-aw",
      }),
      {
        args: compileArguments,
        command: "/private/tmp/gh-aw",
        versionArgs: ["--version"],
      },
    );
  });
});

describe("requireCompilerVersion", () => {
  it("accepts the configured compiler version", () => {
    assert.equal(
      requireCompilerVersion(`gh aw version ${compilerVersion}\n`),
      compilerVersion,
    );
  });

  it("rejects mismatched and unparseable compiler versions", () => {
    const mismatchedCompilerVersion = compilerVersion.replace(
      /[0-9]+$/u,
      (patchVersion) => String(Number.parseInt(patchVersion, 10) + 1),
    );

    assert.throws(
      () =>
        requireCompilerVersion(`gh aw version ${mismatchedCompilerVersion}\n`),
      /Expected gh-aw compiler/u,
    );
    assert.throws(
      () => requireCompilerVersion("gh aw version unknown\n"),
      /received an unknown version/u,
    );
  });
});

describe("assertNoGeneratedDrift", () => {
  it("accepts an empty status and rejects any generated change", () => {
    assert.doesNotThrow(() => assertNoGeneratedDrift("\n"));
    assert.throws(
      () => assertNoGeneratedDrift(" M .github/aw/actions-lock.json\n"),
      /Generated Agentic workflow artifacts are stale/u,
    );
  });
});
