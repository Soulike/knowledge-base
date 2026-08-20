import { execFileSync } from "node:child_process";
import { appendFile } from "node:fs/promises";

import { GitHubClient } from "./github.ts";
import { labels } from "./review-state.ts";

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

function positiveInteger(value: string, name: string): number {
  if (!/^[1-9][0-9]*$/u.test(value)) {
    throw new Error(`${name} must be a positive integer.`);
  }
  return Number(value);
}

async function main(): Promise<void> {
  if (required("AI_REVIEW_TRIGGER_LABEL") !== labels.ready) {
    throw new Error(`This workflow only accepts the ${labels.ready} label.`);
  }
  const repository = required("GITHUB_REPOSITORY");
  const prNumber = positiveInteger(
    required("AI_REVIEW_PR_NUMBER"),
    "AI_REVIEW_PR_NUMBER",
  );
  const client = new GitHubClient(required("GITHUB_TOKEN"), repository);
  const pullRequest = await client.getPullRequest(prNumber);
  if (pullRequest.number !== prNumber || pullRequest.state !== "open") {
    throw new Error(`Pull request #${prNumber} is not open.`);
  }

  const toolingSha = execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
  if (!/^[0-9a-f]{40}$/u.test(toolingSha)) {
    throw new Error(
      "The trusted tooling checkout did not resolve to a Git SHA.",
    );
  }

  await client.removeLabel(prNumber, labels.ready);
  await client.removeLabel(prNumber, labels.approved);
  await client.removeLabel(prNumber, labels.needsChange);

  const output = required("GITHUB_OUTPUT");
  const values: Record<string, string | number> = {
    base_sha: pullRequest.baseSha,
    head_sha: pullRequest.headSha,
    pr_number: pullRequest.number,
    pr_url: pullRequest.htmlUrl,
    repository,
    tooling_sha: toolingSha,
  };
  await appendFile(
    output,
    Object.entries(values)
      .map(([name, value]) => `${name}=${value}\n`)
      .join(""),
  );
}

await main();
