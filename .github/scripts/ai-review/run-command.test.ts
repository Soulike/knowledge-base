import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

const runCommandUrl = new URL("./run-command.ts", import.meta.url).href;

function runHelper(childSource: string) {
  const source = `
    import { runCommand } from ${JSON.stringify(runCommandUrl)};
    await runCommand(process.execPath, ["--eval", ${JSON.stringify(childSource)}]);
  `;
  return spawnSync(
    process.execPath,
    ["--input-type=module", "--eval", source],
    { encoding: "utf8" },
  );
}

test("streams child stdout and stderr to the caller", () => {
  const result = runHelper(`
    process.stdout.write("Copilot progress\\n");
    process.stderr.write("Copilot diagnostic\\n");
  `);

  assert.equal(result.status, 0);
  assert.equal(result.stdout, "Copilot progress\n");
  assert.equal(result.stderr, "Copilot diagnostic\n");
});

test("rejects a nonzero child exit", () => {
  const result = runHelper("process.exit(7);");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /exited with status 7/u);
});
