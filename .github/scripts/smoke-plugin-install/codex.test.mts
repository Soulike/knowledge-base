import assert from "node:assert/strict";
import test from "node:test";

import { installWithCodex } from "./codex.mts";
import type { Marketplace, RunCommand } from "./shared.mts";

const repository = "/workspace/repository";
const marketplace = (plugins: string[]): Marketplace => ({
  name: "knowledge-base",
  plugins: plugins.map((name) => ({ name })),
});

function fakeCodex(installedNames: string[] = []): {
  calls: Array<[string, string[]]>;
  run: RunCommand;
} {
  const calls: Array<[string, string[]]> = [];
  const run: RunCommand = (command, args) => {
    calls.push([command, [...args]]);
    const isInstalledList =
      args[0] === "plugin" &&
      args[1] === "list" &&
      !args.includes("--available");

    if (isInstalledList) {
      return JSON.stringify({
        installed: installedNames.map((name) => ({
          name,
          marketplaceName: "knowledge-base",
          installed: true,
        })),
      });
    }
    return "";
  };

  return { calls, run };
}

test("Codex accepts an empty marketplace", () => {
  const fake = fakeCodex();

  installWithCodex(repository, marketplace([]), fake.run);

  assert.deepEqual(fake.calls, [
    ["codex", ["--version"]],
    ["codex", ["plugin", "marketplace", "add", repository, "--json"]],
    [
      "codex",
      [
        "plugin",
        "list",
        "--marketplace",
        "knowledge-base",
        "--available",
        "--json",
      ],
    ],
    ["codex", ["plugin", "list", "--marketplace", "knowledge-base", "--json"]],
  ]);
});

test("Codex installs every marketplace plugin", () => {
  const fake = fakeCodex(["alpha", "bravo"]);

  installWithCodex(repository, marketplace(["alpha", "bravo"]), fake.run);

  assert.deepEqual(fake.calls.slice(3), [
    ["codex", ["plugin", "add", "alpha@knowledge-base", "--json"]],
    ["codex", ["plugin", "add", "bravo@knowledge-base", "--json"]],
    ["codex", ["plugin", "list", "--marketplace", "knowledge-base", "--json"]],
  ]);
});

test("Codex fails when an installed plugin is missing from the list", () => {
  const fake = fakeCodex(["alpha"]);

  assert.throws(
    () =>
      installWithCodex(repository, marketplace(["alpha", "bravo"]), fake.run),
    /Codex did not list bravo@knowledge-base as installed\./,
  );
});
