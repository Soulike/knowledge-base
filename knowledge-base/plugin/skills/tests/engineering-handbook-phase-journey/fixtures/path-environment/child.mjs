import { spawnSync } from "node:child_process";
import process from "node:process";

const result = spawnSync("sdk-tool", [], {
  encoding: "utf8",
  env: process.env,
});

if (result.status !== 0) {
  throw new Error(result.stderr || "sdk-tool failed");
}

process.stdout.write(result.stdout.trim());
