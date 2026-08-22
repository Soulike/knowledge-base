import { execFileSync } from "node:child_process";

function git(repository: string, arguments_: string[]): string {
  return execFileSync("git", ["-C", repository, ...arguments_], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
}

function assertSha(value: string, name: string): void {
  if (!/^[0-9a-f]{40}$/u.test(value)) {
    throw new Error(`${name} must be a lowercase 40-character Git SHA.`);
  }
}

export function fetchPullRequestRevisions(
  repository: string,
  prNumber: number,
  baseSha: string,
  headSha: string,
): void {
  assertSha(baseSha, "baseSha");
  assertSha(headSha, "headSha");
  if (!Number.isSafeInteger(prNumber) || prNumber < 1) {
    throw new Error("prNumber must be a positive integer.");
  }

  git(repository, [
    "fetch",
    "--no-tags",
    "--force",
    "origin",
    "+refs/heads/*:refs/remotes/origin/*",
  ]);
  git(repository, [
    "fetch",
    "--no-tags",
    "--force",
    "origin",
    `refs/pull/${prNumber}/head:refs/remotes/origin/ai-review-head`,
  ]);

  const fetchedHead = git(repository, [
    "rev-parse",
    "refs/remotes/origin/ai-review-head",
  ]).trim();
  if (fetchedHead !== headSha) {
    throw new Error(
      `Fetched pull-request head ${fetchedHead} does not match expected head ${headSha}.`,
    );
  }
  git(repository, ["cat-file", "-e", `${baseSha}^{commit}`]);
}
