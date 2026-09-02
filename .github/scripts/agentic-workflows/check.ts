import { execFile } from "node:child_process";
import { promisify } from "node:util";

import {
  assertNoGeneratedDrift,
  compileAgenticWorkflows,
} from "./compiler-contract.ts";

const executeFile = promisify(execFile);

await compileAgenticWorkflows();
const { stdout } = await executeFile(
  "git",
  [
    "status",
    "--porcelain=v1",
    "--untracked-files=all",
    "--",
    ".github/aw",
    ":(glob).github/workflows/*.lock.yml",
  ],
  { env: process.env },
);
assertNoGeneratedDrift(stdout);
