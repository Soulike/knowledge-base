import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { promisify } from "node:util";

import { buildVerificationManifest } from "./manifest.ts";
import { parseVerificationScope } from "./targets.ts";

const executeFile = promisify(execFile);

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

const workspace = resolve(required("GITHUB_WORKSPACE"));
const outputPath = required("CONTENT_VERIFICATION_TARGET_MANIFEST");
const scope = parseVerificationScope(required("CONTENT_VERIFICATION_SCOPE"));
if (!isAbsolute(outputPath)) {
  throw new Error("CONTENT_VERIFICATION_TARGET_MANIFEST must be absolute.");
}

const [{ stdout: revisionOutput }, { stdout: trackedOutput }, indexMarkdown] =
  await Promise.all([
    executeFile("git", ["rev-parse", "HEAD"], { cwd: workspace }),
    executeFile("git", ["ls-files", "-z"], {
      cwd: workspace,
      encoding: "buffer",
      maxBuffer: 10 * 1024 * 1024,
    }),
    readFile(join(workspace, "knowledge/index.md"), "utf8"),
  ]);

const trackedPaths = trackedOutput
  .toString("utf8")
  .split("\0")
  .filter((filePath) => filePath.length > 0);
const manifest = buildVerificationManifest(
  scope,
  revisionOutput.trim(),
  trackedPaths,
  indexMarkdown,
);

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, {
  encoding: "utf8",
  flag: "wx",
  mode: 0o600,
});
process.stdout.write(
  `Prepared ${String(manifest.targets.length)} targets at ${outputPath}.\n`,
);
