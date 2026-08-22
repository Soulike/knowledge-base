import { spawn } from "node:child_process";
import { appendFile, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import { GitHubIssuePublisher } from "./github.ts";
import { parseVerificationOutput } from "./output.ts";
import {
  publishExecutionFailure,
  publishVerification,
  renderStepSummary,
  type PublicationContext,
  type PublicationResult,
} from "./publication.ts";
import {
  discoverVerificationTargets,
  parseVerificationScope,
} from "./targets.ts";

const SHA_PATTERN = /^[0-9a-f]{40}$/u;
const REPOSITORY_PATTERN = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u;
const LOGIN_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/u;

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
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) {
    throw new Error(`${name} exceeds the supported integer range.`);
  }
  return parsed;
}

async function command(
  commandName: string,
  arguments_: string[],
  workingDirectory: string,
): Promise<string> {
  return await new Promise((resolvePromise, reject) => {
    const child = spawn(commandName, arguments_, {
      cwd: workingDirectory,
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
      resolvePromise(stdout);
    });
  });
}

function publicationContext(): PublicationContext {
  const repository = required("CONTENT_VERIFICATION_REPOSITORY");
  if (!REPOSITORY_PATTERN.test(repository)) {
    throw new Error(
      "CONTENT_VERIFICATION_REPOSITORY must use the owner/name form.",
    );
  }
  const revision = required("CONTENT_VERIFICATION_REVISION");
  if (!SHA_PATTERN.test(revision)) {
    throw new Error(
      "CONTENT_VERIFICATION_REVISION must be a lowercase 40-character Git SHA.",
    );
  }
  const assignee = required("CONTENT_VERIFICATION_ASSIGNEE");
  if (!LOGIN_PATTERN.test(assignee)) {
    throw new Error(
      "CONTENT_VERIFICATION_ASSIGNEE is not a valid GitHub login.",
    );
  }
  return {
    assignee,
    repository,
    revision,
    runAttempt: positiveInteger(
      required("CONTENT_VERIFICATION_RUN_ATTEMPT"),
      "CONTENT_VERIFICATION_RUN_ATTEMPT",
    ),
    runId: positiveInteger(
      required("CONTENT_VERIFICATION_RUN_ID"),
      "CONTENT_VERIFICATION_RUN_ID",
    ),
    scope: parseVerificationScope(required("CONTENT_VERIFICATION_SCOPE")),
  };
}

async function discoverTargets(context: PublicationContext, workspace: string) {
  const actualRevision = (
    await command("git", ["rev-parse", "HEAD"], workspace)
  ).trim();
  if (actualRevision !== context.revision) {
    throw new Error("Publisher checkout does not match the verified revision.");
  }
  const trackedPaths = (await command("git", ["ls-files", "-z"], workspace))
    .split("\0")
    .filter(Boolean);
  const indexMarkdown = await readFile(
    join(workspace, "knowledge", "index.md"),
    "utf8",
  );
  return discoverVerificationTargets(
    context.scope,
    trackedPaths,
    indexMarkdown,
  );
}

function failureMessage(source: string): string {
  let value: unknown;
  try {
    value = JSON.parse(source) as unknown;
  } catch {
    return "The verifier failed without a readable failure report.";
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return "The verifier failed without a valid failure report.";
  }
  const message = (value as Record<string, unknown>).message;
  return typeof message === "string" && message.trim().length > 0
    ? message.slice(0, 20_000)
    : "The verifier failed without a failure message.";
}

async function readOptional(path: string): Promise<string | undefined> {
  try {
    return await readFile(path, "utf8");
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      return undefined;
    }
    throw error;
  }
}

async function writeSummary(
  outputSummary: string,
  publication: PublicationResult,
): Promise<void> {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) {
    return;
  }
  await appendFile(summaryPath, renderStepSummary(outputSummary, publication));
}

async function main(): Promise<void> {
  const context = publicationContext();
  const workspace = resolve(required("GITHUB_WORKSPACE"));
  const artifactDirectory = resolve(
    required("CONTENT_VERIFICATION_ARTIFACT_DIRECTORY"),
  );
  const expectedArtifactDirectory = resolve(
    required("RUNNER_TEMP"),
    "content-verification",
  );
  if (artifactDirectory !== expectedArtifactDirectory) {
    throw new Error(
      "CONTENT_VERIFICATION_ARTIFACT_DIRECTORY must be the content-verification directory under RUNNER_TEMP.",
    );
  }
  const publisher = new GitHubIssuePublisher(
    context.repository,
    required("GITHUB_TOKEN"),
  );
  const verifyResult = required("CONTENT_VERIFICATION_VERIFY_RESULT");
  const resultSource = await readOptional(
    join(artifactDirectory, "result.json"),
  );

  let publication: PublicationResult;
  let summary: string;
  if (verifyResult !== "success" || resultSource === undefined) {
    const failureSource = await readOptional(
      join(artifactDirectory, "failure.json"),
    );
    const message =
      failureSource === undefined
        ? `The verification job concluded with '${verifyResult}' before publishing a validated report.`
        : failureMessage(failureSource);
    publication = await publishExecutionFailure(message, context, publisher);
    summary = message;
  } else {
    const targets = await discoverTargets(context, workspace);
    const output = parseVerificationOutput(
      resultSource,
      context.revision,
      context.scope,
      targets,
    );
    publication = await publishVerification(output, context, publisher);
    summary = output.summary;
  }

  await writeSummary(summary, publication);
  for (const issueNumber of publication.created) {
    process.stdout.write(`Created issue #${issueNumber}.\n`);
  }
  for (const issueNumber of publication.updated) {
    process.stdout.write(`Updated issue #${issueNumber}.\n`);
  }
  if (publication.requiresFailure) {
    process.exitCode = 1;
  }
}

await main();
