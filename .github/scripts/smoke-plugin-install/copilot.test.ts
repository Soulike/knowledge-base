import assert from "node:assert/strict";
import test from "node:test";

import { installWithCopilot } from "./copilot.ts";
import type { Marketplace, RunCommand } from "./shared.ts";

const repository = "/workspace/repository";
const marketplace = (plugins: string[]): Marketplace => ({
  name: "knowledge-base",
  plugins: plugins.map((name) => ({ name })),
});

function fakeCopilot(installedSelectors: string[] = []): {
  calls: Array<[string, string[]]>;
  run: RunCommand;
} {
  const calls: Array<[string, string[]]> = [];
  const run: RunCommand = (command, args) => {
    calls.push([command, [...args]]);
    if (args[0] === "plugin" && args[1] === "list") {
      return [
        "Installed plugins:",
        ...installedSelectors.map((selector) => `  • ${selector} (v1.2.3)`),
      ].join("\n");
    }
    return "";
  };

  return { calls, run };
}

test("Copilot accepts an empty marketplace", () => {
  const fake = fakeCopilot();

  installWithCopilot(repository, marketplace([]), fake.run);

  assert.deepEqual(fake.calls, [
    ["copilot", ["--version"]],
    ["copilot", ["plugin", "marketplace", "add", repository]],
    ["copilot", ["plugin", "marketplace", "browse", "knowledge-base"]],
    ["copilot", ["plugin", "list"]],
  ]);
});

test("Copilot installs every marketplace plugin", () => {
  const fake = fakeCopilot(["alpha@knowledge-base", "bravo@knowledge-base"]);

  installWithCopilot(repository, marketplace(["alpha", "bravo"]), fake.run);

  assert.deepEqual(fake.calls.slice(3), [
    ["copilot", ["plugin", "install", "alpha@knowledge-base"]],
    ["copilot", ["plugin", "install", "bravo@knowledge-base"]],
    ["copilot", ["plugin", "list"]],
  ]);
});

test("Copilot fails when an installed plugin is missing from the list", () => {
  const fake = fakeCopilot(["alpha@knowledge-base"]);

  assert.throws(
    () =>
      installWithCopilot(repository, marketplace(["alpha", "bravo"]), fake.run),
    /Copilot did not list bravo@knowledge-base as installed\./,
  );
});
