import { execFileSync } from "node:child_process";

import type { Finding } from "./review-output.ts";

export type ChangedLines = {
  left: Set<number>;
  right: Set<number>;
};

const hunkPattern = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/u;

export function parseChangedLines(diff: string): ChangedLines {
  const left = new Set<number>();
  const right = new Set<number>();
  let oldLine = 0;
  let newLine = 0;
  let inHunk = false;

  for (const line of diff.split("\n")) {
    const hunk = hunkPattern.exec(line);
    if (hunk) {
      oldLine = Number(hunk[1]);
      newLine = Number(hunk[3]);
      inHunk = true;
      continue;
    }
    if (!inHunk) {
      continue;
    }
    if (line.startsWith("@@")) {
      inHunk = false;
      continue;
    }
    if (line.startsWith("+")) {
      right.add(newLine);
      newLine += 1;
      continue;
    }
    if (line.startsWith("-")) {
      left.add(oldLine);
      oldLine += 1;
      continue;
    }
    if (line.startsWith(" ")) {
      oldLine += 1;
      newLine += 1;
      continue;
    }
    if (line.startsWith("\\ No newline at end of file")) {
      continue;
    }
    inHunk = false;
  }

  return { left, right };
}

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

export function validateFindingLines(
  repository: string,
  baseSha: string,
  headSha: string,
  findings: Finding[],
): void {
  assertSha(baseSha, "baseSha");
  assertSha(headSha, "headSha");
  const range = `${baseSha}...${headSha}`;
  const changedPaths = new Set(
    git(repository, ["diff", "--name-only", "-z", "--no-renames", range])
      .split("\0")
      .filter(Boolean),
  );
  const linesByPath = new Map<string, ChangedLines>();

  for (const finding of findings) {
    if (!changedPaths.has(finding.path)) {
      throw new Error(
        `Finding path ${finding.path} is not changed in the current pull request.`,
      );
    }
    let changedLines = linesByPath.get(finding.path);
    if (!changedLines) {
      const patch = git(repository, [
        "diff",
        "--no-renames",
        "--unified=0",
        "--no-color",
        "--no-ext-diff",
        range,
        "--",
        finding.path,
      ]);
      changedLines = parseChangedLines(patch);
      linesByPath.set(finding.path, changedLines);
    }
    const lines =
      finding.side === "RIGHT" ? changedLines.right : changedLines.left;
    if (!lines.has(finding.line)) {
      throw new Error(
        `Finding ${finding.path}:${finding.line} (${finding.side}) is not a changed line in the current pull request.`,
      );
    }
  }
}
