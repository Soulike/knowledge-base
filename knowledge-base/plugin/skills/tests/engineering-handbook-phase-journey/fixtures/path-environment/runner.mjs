import { spawnSync } from "node:child_process";
import process from "node:process";
import { fileURLToPath, URL } from "node:url";

function run(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    env: process.env,
  });
  if (result.status !== 0) {
    throw new Error(result.stderr || `${command} failed`);
  }
  return result.stdout.trim();
}

process.stdout.write(`caller=${run("sdk-tool", [])}\n`);
process.stdout.write(
  `child=${run(process.execPath, [fileURLToPath(new URL("child.mjs", import.meta.url))])}\n`,
);
