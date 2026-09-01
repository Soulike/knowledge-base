import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { captureCommand } from "./run-command.ts";

describe("captureCommand", () => {
  it("retains structured stdout when the child exits nonzero", async () => {
    const result = await captureCommand(process.execPath, [
      "--input-type=module",
      "--eval",
      'process.stdout.write("{\\"type\\":\\"session.error\\"}\\n{\\"type\\":\\"result\\",\\"exitCode\\":1}\\n"); process.exit(1);',
    ]);

    assert.equal(result.exitCode, 1);
    assert.match(result.stdout, /session\.error/u);
    assert.match(result.stdout, /"exitCode":1/u);
  });
});
