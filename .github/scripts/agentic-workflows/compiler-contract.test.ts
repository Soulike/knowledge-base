import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  assertNoGeneratedDrift,
  compilerInvocation,
  requireCompilerVersion,
} from "./compiler-contract.ts";

describe("compilerInvocation", () => {
  it("pins the v0.87.10 compiler contract and resolved runtime action", () => {
    assert.deepEqual(compilerInvocation({}), {
      args: [
        "aw",
        "compile",
        "--action-mode",
        "release",
        "--action-tag",
        "ff62cdbec36230acbae869ddb28806e8eca01ea1",
        "--strict",
        "--validate",
        "--no-check-update",
      ],
      command: "gh",
      versionArgs: ["aw", "--version"],
    });

    assert.deepEqual(
      compilerInvocation({
        GH_AW_COMPILER: "/private/tmp/gh-aw",
      }),
      {
        args: [
          "compile",
          "--action-mode",
          "release",
          "--action-tag",
          "ff62cdbec36230acbae869ddb28806e8eca01ea1",
          "--strict",
          "--validate",
          "--no-check-update",
        ],
        command: "/private/tmp/gh-aw",
        versionArgs: ["--version"],
      },
    );
  });
});

describe("requireCompilerVersion", () => {
  it("rejects any compiler other than v0.87.10", () => {
    assert.equal(
      requireCompilerVersion("gh aw version v0.87.10\n"),
      "v0.87.10",
    );
    assert.throws(
      () => requireCompilerVersion("gh aw version v0.87.11\n"),
      /Expected gh-aw compiler v0\.87\.10/u,
    );
  });
});

describe("assertNoGeneratedDrift", () => {
  it("rejects modified, deleted, and untracked generated artifacts", () => {
    assert.doesNotThrow(() => assertNoGeneratedDrift("\n"));
    assert.throws(
      () =>
        assertNoGeneratedDrift(
          " M .github/aw/actions-lock.json\n?? .github/workflows/new.lock.yml\n",
        ),
      /Generated Agentic workflow artifacts are stale/u,
    );
  });
});
