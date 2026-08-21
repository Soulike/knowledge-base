import { spawn } from "node:child_process";
import { constants } from "node:fs";
import { mkdir, open, readFile, rm } from "node:fs/promises";
import { join, resolve } from "node:path";

import {
  copilotEffortArguments,
  readVerificationConfig,
  type VerificationConfig,
} from "./config.ts";
import { parseVerificationOutput } from "./output.ts";
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

async function command(
  commandName: string,
  arguments_: string[],
  workingDirectory?: string,
  trim = true,
): Promise<string> {
  return await new Promise((resolvePromise, reject) => {
    const child = spawn(commandName, arguments_, {
      cwd: workingDirectory,
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
          new Error(`${commandName} exited with status ${code ?? "unknown"}.`),
        );
        return;
      }
      resolvePromise(trim ? stdout.trim() : stdout);
    });
  });
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

async function verify(): Promise<void> {
  const config = readVerificationConfig();
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

  const copilotVersion = await command("copilot", ["--version"]);
  const skillsVersion = await command("skills", ["--version"]);
  const response = await command("copilot", copilotArguments);
  if (!response) {
    throw new Error("Copilot returned an empty verification response.");
  }
  const result = parseVerificationOutput(
    response,
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

async function recordFailure(error: unknown): Promise<void> {
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
    message: error instanceof Error ? error.message : String(error),
    revision: process.env.CONTENT_VERIFICATION_REVISION ?? null,
    scope: process.env.CONTENT_VERIFICATION_SCOPE ?? null,
  };
  await writeExclusive(
    join(resolvedOutput, "failure.json"),
    `${JSON.stringify(failure, null, 2)}\n`,
  );
}

try {
  await verify();
} catch (error) {
  await recordFailure(error);
  throw error;
}
