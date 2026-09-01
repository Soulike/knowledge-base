import { constants } from "node:fs";
import { mkdir, open, readFile, rm } from "node:fs/promises";
import { join, resolve } from "node:path";

import {
  copilotEffortArguments,
  readVerificationConfig,
  type VerificationConfig,
} from "./config.ts";
import {
  extractCopilotFinalAnswer,
  formatCopilotDiagnostics,
  summarizeCopilotEventTypes,
  type CopilotRunDiagnostics,
} from "./copilot-output.ts";
import { parseVerificationOutput } from "./output.ts";
import { captureCommand, command } from "./run-command.ts";
import { discoverVerificationTargets } from "./targets.ts";

type VerificationMetadata = {
  copilotVersion: string;
  model: string;
  reasoningEffort: string;
  repository: string;
  revision: string;
  runAttempt: number;
  runId: number;
  scope: string;
  skillsVersion: string;
};

const COPILOT_REVIEW_TOOLS = [
  "glob",
  "grep",
  "github-mcp-server-issue_read",
  "github-mcp-server-search_issues",
  "skill",
  "view",
  "web_fetch",
  "web_search",
] as const;

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

function renderPrompt(
  template: string,
  config: VerificationConfig,
  targetsJson: string,
): string {
  const replacements: Record<string, string> = {
    "{{REPOSITORY}}": config.repository,
    "{{REVISION}}": config.revision,
    "{{SCOPE}}": config.scope,
    "{{TARGETS_JSON}}": targetsJson,
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

async function assertCleanWorkspace(workspace: string): Promise<void> {
  const status = await command(
    "git",
    ["status", "--porcelain=v1", "--untracked-files=all"],
    workspace,
  );
  if (status.length > 0) {
    throw new Error("The verifier modified the checked-out repository.");
  }
}

async function verify(diagnostics: CopilotRunDiagnostics): Promise<void> {
  const config = readVerificationConfig();
  diagnostics.model = config.model;
  diagnostics.reasoningEffort = config.reasoningEffort;
  const expectedOutputDirectory = resolve(
    process.env.RUNNER_TEMP ?? "",
    "content-verification",
  );
  if (config.outputDirectory !== expectedOutputDirectory) {
    throw new Error(
      "CONTENT_VERIFICATION_OUTPUT_DIRECTORY must be the content-verification directory under RUNNER_TEMP.",
    );
  }

  const actualRevision = await command(
    "git",
    ["rev-parse", "HEAD"],
    config.workspace,
  );
  if (actualRevision !== config.revision) {
    throw new Error(
      "The checked-out revision does not match the requested revision.",
    );
  }
  await assertCleanWorkspace(config.workspace);

  const trackedSource = await command(
    "git",
    ["ls-files", "-z"],
    config.workspace,
    false,
  );
  const trackedPaths = trackedSource.split("\0").filter(Boolean);
  const indexMarkdown = await readFile(
    join(config.workspace, "knowledge", "index.md"),
    "utf8",
  );
  const targets = discoverVerificationTargets(
    config.scope,
    trackedPaths,
    indexMarkdown,
  );
  const targetsJson = JSON.stringify(targets, null, 2);
  const template = await readFile(
    new URL("./prompts/verify.md", import.meta.url),
    "utf8",
  );
  const prompt = renderPrompt(template, config, targetsJson);
  const copilotArguments = [
    "--prompt",
    prompt,
    "--silent",
    "--stream",
    "off",
    "--output-format",
    "json",
    "--no-color",
    "--no-ask-user",
    "--no-auto-update",
    "--no-remote",
    "--no-remote-export",
    "--disallow-temp-dir",
    `--available-tools=${COPILOT_REVIEW_TOOLS.join(",")}`,
    "--allow-tool=github-mcp-server(issue_read)",
    "--allow-tool=github-mcp-server(search_issues)",
    "--allow-all-urls",
    "--add-github-mcp-tool",
    "issue_read",
    "--add-github-mcp-tool",
    "search_issues",
    "--secret-env-vars=COPILOT_GITHUB_TOKEN",
    "--context",
    "long_context",
    "--model",
    config.model,
    ...copilotEffortArguments(config.reasoningEffort),
    "-C",
    config.workspace,
  ];

  const copilotVersion = await command("copilot", ["--version"]);
  const skillsVersion = await command("skills", ["--version"]);
  diagnostics.copilotVersion = copilotVersion;
  diagnostics.skillsVersion = skillsVersion;
  console.log(`Copilot CLI version: ${copilotVersion}`);
  console.log(`Skills CLI version: ${skillsVersion}`);
  console.log("Starting Copilot content verification.");
  const copilot = await captureCommand("copilot", copilotArguments);
  diagnostics.observedEventTypes = summarizeCopilotEventTypes(copilot.stdout);
  if (copilot.exitCode !== 0) {
    throw new Error(
      `copilot exited with status ${copilot.exitCode ?? "unknown"}.`,
    );
  }
  const response = copilot.stdout;
  if (!response) {
    throw new Error("Copilot returned an empty verification response.");
  }
  const result = parseVerificationOutput(
    extractCopilotFinalAnswer(response),
    config.revision,
    config.scope,
    targets,
  );
  await assertCleanWorkspace(config.workspace);

  const metadata: VerificationMetadata = {
    copilotVersion,
    model: config.model,
    reasoningEffort: config.reasoningEffort,
    repository: config.repository,
    revision: config.revision,
    runAttempt: config.runAttempt,
    runId: config.runId,
    scope: config.scope,
    skillsVersion,
  };
  await rm(config.outputDirectory, { force: true, recursive: true });
  await mkdir(config.outputDirectory, { recursive: true });
  await writeExclusive(
    join(config.outputDirectory, "targets.json"),
    `${targetsJson}\n`,
  );
  await writeExclusive(
    join(config.outputDirectory, "result.json"),
    `${JSON.stringify(result, null, 2)}\n`,
  );
  await writeExclusive(
    join(config.outputDirectory, "metadata.json"),
    `${JSON.stringify(metadata, null, 2)}\n`,
  );
}

async function recordFailure(
  error: unknown,
  diagnostics: CopilotRunDiagnostics,
): Promise<void> {
  const outputDirectory = process.env.CONTENT_VERIFICATION_OUTPUT_DIRECTORY;
  const runnerTemp = process.env.RUNNER_TEMP;
  if (!outputDirectory || !runnerTemp) {
    return;
  }
  const resolvedOutput = resolve(outputDirectory);
  if (resolvedOutput !== resolve(runnerTemp, "content-verification")) {
    return;
  }
  await rm(resolvedOutput, { force: true, recursive: true });
  await mkdir(resolvedOutput, { recursive: true });
  const failure = {
    diagnostics: formatCopilotDiagnostics(diagnostics),
    message: error instanceof Error ? error.message : String(error),
    revision: process.env.CONTENT_VERIFICATION_REVISION ?? null,
    scope: process.env.CONTENT_VERIFICATION_SCOPE ?? null,
  };
  await writeExclusive(
    join(resolvedOutput, "failure.json"),
    `${JSON.stringify(failure, null, 2)}\n`,
  );
}

const diagnostics: CopilotRunDiagnostics = {
  copilotVersion: null,
  model: null,
  observedEventTypes: [],
  reasoningEffort: null,
  skillsVersion: null,
};
try {
  await verify(diagnostics);
} catch (error) {
  await recordFailure(error, diagnostics);
  throw error;
}
