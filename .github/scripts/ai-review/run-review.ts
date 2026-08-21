import { readFile } from "node:fs/promises";

import {
  copilotEffortArguments,
  readReviewConfig,
  type ReviewConfig,
} from "./config.ts";
import { fetchPullRequestRevisions } from "./diff.ts";
import { runCommand } from "./run-command.ts";

function renderPrompt(template: string, config: ReviewConfig): string {
  const replacements: Record<string, string> = {
    "{{BASE_SHA}}": config.baseSha,
    "{{EXPECTED_HEAD_SHA}}": config.expectedHeadSha,
    "{{PR_NUMBER}}": String(config.prNumber),
    "{{PR_URL}}": config.prUrl,
    "{{REPOSITORY}}": config.repository,
    "{{RUN_ATTEMPT}}": String(config.runAttempt),
    "{{RUN_ID}}": String(config.runId),
    "{{TOOLING_SHA}}": config.toolingSha,
  };
  let prompt = template;
  for (const [placeholder, value] of Object.entries(replacements)) {
    if (!prompt.includes(placeholder)) {
      throw new Error(`Prompt template is missing ${placeholder}.`);
    }
    prompt = prompt.replaceAll(placeholder, value);
  }
  if (/\{\{[A-Z0-9_]+\}\}/u.test(prompt)) {
    throw new Error("Prompt template contains an unresolved placeholder.");
  }
  return prompt;
}

async function main(): Promise<void> {
  const config = readReviewConfig();
  fetchPullRequestRevisions(
    config.workspace,
    config.prNumber,
    config.baseSha,
    config.expectedHeadSha,
  );
  const template = await readFile(
    new URL("./prompts/review.md", import.meta.url),
    "utf8",
  );
  const prompt = renderPrompt(template, config);
  const copilotArguments = [
    "--prompt",
    prompt,
    "--stream",
    "on",
    "--no-color",
    "--no-ask-user",
    "--no-auto-update",
    "--no-remote",
    "--no-remote-export",
    "--allow-all",
    "--disable-builtin-mcps",
    "--context",
    "long_context",
    "--model",
    config.model,
    ...copilotEffortArguments(config.reasoningEffort),
    "-C",
    config.workspace,
  ];

  console.log("Copilot CLI version:");
  await runCommand("copilot", ["--version"]);
  console.log("Skills CLI version:");
  await runCommand("skills", ["--version"]);
  console.log("GitHub CLI version:");
  await runCommand("gh", ["--version"]);
  console.log("Starting Copilot review; progress follows.");
  await runCommand("copilot", copilotArguments);
}

await main();
