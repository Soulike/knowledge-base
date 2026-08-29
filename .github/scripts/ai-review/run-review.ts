import { readFile } from "node:fs/promises";

import { copilotEffortArguments, readReviewConfig } from "./config.ts";
import { fetchPullRequestRevisions } from "./diff.ts";
import { renderReviewPrompt } from "./prompt.ts";
import { runCommand } from "./run-command.ts";

async function main(): Promise<void> {
  const config = readReviewConfig();
  fetchPullRequestRevisions(
    config.workspace,
    config.prNumber,
    config.baseSha,
    config.expectedHeadSha,
  );
  const templateUrl = new URL("./prompts/review.md", import.meta.url);
  const guidanceUrl = new URL("./prompts/skills.md", import.meta.url);
  const [template, guidance] = await Promise.all([
    readFile(templateUrl, "utf8"),
    readFile(guidanceUrl, "utf8"),
  ]);
  const prompt = renderReviewPrompt(template, guidance, config);
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
