import { spawn } from "node:child_process";
import { constants } from "node:fs";
import { mkdir, open, readFile, rm } from "node:fs/promises";
import { join, resolve } from "node:path";

import {
  copilotEffortArguments,
  readReviewConfig,
  type ReviewConfig,
} from "./config.ts";
import { fetchPullRequestRevisions } from "./diff.ts";
import { parseReviewOutput } from "./review-output.ts";

type ReviewMetadata = ReviewConfig & {
  copilotVersion: string;
  skillsVersion: string;
};

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

async function writeExclusive(path: string, contents: string): Promise<void> {
  const handle = await open(
    path,
    constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY,
    0o600,
  );
  try {
    await handle.writeFile(contents);
  } finally {
    await handle.close();
  }
}

async function command(
  commandName: string,
  arguments_: string[],
): Promise<string> {
  return await new Promise((resolve, reject) => {
    const child = spawn(commandName, arguments_, {
      env: process.env,
      stdio: ["ignore", "pipe", "inherit"],
    });
    let stdout = "";
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => {
      stdout += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            `${commandName} ${arguments_.join(" ")} exited with status ${code ?? "unknown"}.`,
          ),
        );
        return;
      }
      resolve(stdout.trim());
    });
  });
}

function renderPrompt(template: string, config: ReviewConfig): string {
  const replacements: Record<string, string> = {
    "{{BASE_SHA}}": config.baseSha,
    "{{EXPECTED_HEAD_SHA}}": config.expectedHeadSha,
    "{{PR_NUMBER}}": String(config.prNumber),
    "{{PR_URL}}": config.prUrl,
    "{{REPOSITORY}}": config.repository,
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
  const outputDirectory = required("AI_REVIEW_OUTPUT_DIRECTORY");
  const expectedOutputDirectory = join(
    resolve(required("RUNNER_TEMP")),
    "ai-review",
  );
  if (resolve(outputDirectory) !== expectedOutputDirectory) {
    throw new Error(
      "AI_REVIEW_OUTPUT_DIRECTORY must be the ai-review directory under RUNNER_TEMP.",
    );
  }
  const template = await readFile(
    new URL("./prompts/review.md", import.meta.url),
    "utf8",
  );
  const prompt = renderPrompt(template, config);
  const copilotArguments = [
    "--prompt",
    prompt,
    "--silent",
    "--stream",
    "off",
    "--no-color",
    "--no-ask-user",
    "--no-auto-update",
    "--no-remote",
    "--no-remote-export",
    "--allow-all",
    "--enable-all-github-mcp-tools",
    "--context",
    "long_context",
    "--model",
    config.model,
    ...copilotEffortArguments(config.reasoningEffort),
    "-C",
    config.workspace,
  ];

  const [copilotVersion, skillsVersion, response] = await Promise.all([
    command("copilot", ["--version"]),
    command("skills", ["--version"]),
    command("copilot", copilotArguments),
  ]);
  if (!response) {
    throw new Error("Copilot returned an empty review response.");
  }
  parseReviewOutput(response, config.expectedHeadSha);

  const metadata: ReviewMetadata = {
    ...config,
    copilotVersion,
    skillsVersion,
  };
  await rm(outputDirectory, { force: true, recursive: true });
  await mkdir(outputDirectory, { recursive: true });
  await writeExclusive(join(outputDirectory, "review.json"), `${response}\n`);
  await writeExclusive(
    join(outputDirectory, "metadata.json"),
    `${JSON.stringify(metadata, null, 2)}\n`,
  );
}

await main();
