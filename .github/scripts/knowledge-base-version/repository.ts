import { execFileSync } from "node:child_process";

function git(repository: string, arguments_: string[]): string {
  return execFileSync("git", ["-C", repository, ...arguments_], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

export function readFileAtRevision(
  repository: string,
  revision: string,
  path: string,
): string {
  return git(repository, ["show", `${revision}:${path}`]);
}

export function readCommitterTimestamp(
  repository: string,
  revision: string,
): string {
  return git(repository, ["show", "-s", "--format=%cI", revision]).trim();
}

export function listChangedFiles(
  repository: string,
  baseRevision: string,
  headRevision: string,
): string[] {
  const output = git(repository, [
    "diff",
    "--name-only",
    "-z",
    `${baseRevision}...${headRevision}`,
    "--",
  ]);
  return output.split("\0").filter((path) => path.length > 0);
}
