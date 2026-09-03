import { readReviewConfig, readReviewEvent } from "./config.ts";
import { GitHubClient } from "./github.ts";
import { enforceReviewGate } from "./review-gate.ts";

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

const config = readReviewConfig();
const event = readReviewEvent();
const client = new GitHubClient(required("GITHUB_TOKEN"), config.repository);
await enforceReviewGate(client, { ...config, ...event });

console.log("AI review approved.");
