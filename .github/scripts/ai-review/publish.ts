import { constants } from "node:fs";
import { open } from "node:fs/promises";
import { join, resolve } from "node:path";

import { readReviewConfig, type ReviewConfig } from "./config.ts";
import { fetchPullRequestRevisions, validateFindingLines } from "./diff.ts";
import { GitHubClient } from "./github.ts";
import { parseReviewOutput, severities } from "./review-output.ts";
import {
  AI_REVIEW_AUTHOR,
  findingComment,
  hasReviewRunMarker,
  hasResolutionRunMarker,
  labels,
  planPublication,
  resolutionRunMarker,
  reviewRunMarker,
  type PublicationPlan,
} from "./review-state.ts";

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

async function readRegularFile(path: string): Promise<string> {
  const handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const stat = await handle.stat();
    if (!stat.isFile()) {
      throw new Error(`${path} is not a regular file.`);
    }
    return await handle.readFile("utf8");
  } finally {
    await handle.close();
  }
}

function metadataString(value: Record<string, unknown>, key: string): string {
  const item = value[key];
  if (typeof item !== "string" || item.length === 0) {
    throw new Error(`metadata.${key} must be a non-empty string.`);
  }
  return item;
}

function metadataNumber(value: Record<string, unknown>, key: string): number {
  const item = value[key];
  if (typeof item !== "number" || !Number.isSafeInteger(item) || item < 1) {
    throw new Error(`metadata.${key} must be a positive integer.`);
  }
  return item;
}

function parseMetadata(source: string, expected: ReviewConfig): ReviewMetadata {
  let parsed: unknown;
  try {
    parsed = JSON.parse(source) as unknown;
  } catch (error) {
    throw new Error(
      `Review metadata is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error },
    );
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Review metadata must be an object.");
  }
  const value = parsed as Record<string, unknown>;
  const metadata: ReviewMetadata = {
    baseSha: metadataString(value, "baseSha"),
    copilotVersion: metadataString(value, "copilotVersion"),
    expectedHeadSha: metadataString(value, "expectedHeadSha"),
    model: metadataString(value, "model"),
    prNumber: metadataNumber(value, "prNumber"),
    prUrl: metadataString(value, "prUrl"),
    reasoningEffort: metadataString(
      value,
      "reasoningEffort",
    ) as ReviewMetadata["reasoningEffort"],
    repository: metadataString(value, "repository"),
    runAttempt: metadataNumber(value, "runAttempt"),
    runId: metadataNumber(value, "runId"),
    skillsVersion: metadataString(value, "skillsVersion"),
    toolingSha: metadataString(value, "toolingSha"),
    workspace: metadataString(value, "workspace"),
  };
  for (const key of [
    "baseSha",
    "expectedHeadSha",
    "model",
    "prNumber",
    "prUrl",
    "reasoningEffort",
    "repository",
    "runAttempt",
    "runId",
    "toolingSha",
    "workspace",
  ] as const) {
    if (metadata[key] !== expected[key]) {
      throw new Error(
        `Review metadata ${key} does not match the trusted job input.`,
      );
    }
  }
  return metadata;
}

function counts(plan: PublicationPlan): string {
  const all = [...plan.openCarriedFindings, ...plan.newFindings];
  return severities
    .map(
      (severity) =>
        `${severity}: ${all.filter((finding) => finding.severity === severity).length}`,
    )
    .join(", ");
}

function reviewBody(
  summary: string,
  metadata: ReviewMetadata,
  plan: PublicationPlan,
): string {
  const verdictLabel =
    plan.verdict === "needs-change" ? labels.needsChange : labels.approved;
  return `${reviewRunMarker(metadata.runId, metadata.expectedHeadSha)}
## AI review

${summary.trim()}

- **Verdict:** \`${verdictLabel}\`
- **Active AI findings:** ${counts(plan)}
- **New inline findings:** ${plan.newFindings.length}
- **Resolved AI threads:** ${plan.fixedThreads.length}

Reviewed [PR #${metadata.prNumber}](${metadata.prUrl}) at \`${metadata.expectedHeadSha}\` using ${metadata.copilotVersion}, Skills CLI ${metadata.skillsVersion}, model \`${metadata.model}\`, reasoning effort \`${metadata.reasoningEffort}\`, and knowledge-base \`${metadata.toolingSha}\`.
`;
}

async function assertCurrentPullRequest(
  client: GitHubClient,
  config: ReviewConfig,
): Promise<void> {
  const pullRequest = await client.getPullRequest(config.prNumber);
  if (
    pullRequest.state !== "open" ||
    pullRequest.headSha !== config.expectedHeadSha ||
    pullRequest.baseSha !== config.baseSha
  ) {
    throw new Error(
      `Pull request changed during review: expected ${config.baseSha}...${config.expectedHeadSha}, received ${pullRequest.baseSha}...${pullRequest.headSha} (${pullRequest.state}).`,
    );
  }
}

async function removeVerdictLabels(
  client: GitHubClient,
  prNumber: number,
): Promise<void> {
  await client.removeLabel(prNumber, labels.approved);
  await client.removeLabel(prNumber, labels.needsChange);
}

async function main(): Promise<void> {
  const config = readReviewConfig();
  const artifactDirectory = required("AI_REVIEW_ARTIFACT_DIRECTORY");
  const expectedArtifactDirectory = join(
    resolve(required("RUNNER_TEMP")),
    "ai-review",
  );
  if (resolve(artifactDirectory) !== expectedArtifactDirectory) {
    throw new Error(
      "AI_REVIEW_ARTIFACT_DIRECTORY must be the ai-review directory under RUNNER_TEMP.",
    );
  }
  const [metadataSource, outputSource] = await Promise.all([
    readRegularFile(join(artifactDirectory, "metadata.json")),
    readRegularFile(join(artifactDirectory, "review.json")),
  ]);
  const metadata = parseMetadata(metadataSource, config);
  const output = parseReviewOutput(outputSource, config.expectedHeadSha);
  const client = new GitHubClient(required("GITHUB_TOKEN"), config.repository);

  await assertCurrentPullRequest(client, config);
  fetchPullRequestRevisions(
    config.workspace,
    config.prNumber,
    config.baseSha,
    config.expectedHeadSha,
  );
  validateFindingLines(
    config.workspace,
    config.baseSha,
    config.expectedHeadSha,
    output.findings,
  );

  const [threads, priorReviews] = await Promise.all([
    client.listReviewThreads(config.prNumber),
    client.listReviews(config.prNumber),
  ]);
  const alreadyPublished = priorReviews.some(
    (review) =>
      review.authorLogin === AI_REVIEW_AUTHOR &&
      hasReviewRunMarker(review.body, config.runId, config.expectedHeadSha),
  );
  const plan = planPublication(output, threads, {
    includeNewFindings: !alreadyPublished,
  });
  const threadsById = new Map(threads.map((thread) => [thread.id, thread]));

  await assertCurrentPullRequest(client, config);
  for (const fixedThread of plan.fixedThreads) {
    const thread = threadsById.get(fixedThread.id);
    if (!thread) {
      throw new Error(`Review thread ${fixedThread.id} disappeared.`);
    }
    await assertCurrentPullRequest(client, config);
    if (!hasResolutionRunMarker(thread, config.runId)) {
      await client.replyToReviewComment(
        config.prNumber,
        fixedThread.replyToCommentId,
        `${resolutionRunMarker(config.runId, fixedThread.id)}\nVerified fixed at \`${config.expectedHeadSha}\`: ${fixedThread.rationale}`,
      );
    }
    await client.resolveReviewThread(fixedThread.id);
  }

  if (!alreadyPublished) {
    await assertCurrentPullRequest(client, config);
    await client.createCommentReview(
      config.prNumber,
      config.expectedHeadSha,
      reviewBody(output.summary, metadata, plan),
      plan.newFindings.map((finding) => ({
        body: findingComment(finding),
        line: finding.line,
        path: finding.path,
        side: finding.side,
      })),
    );
  }

  await assertCurrentPullRequest(client, config);
  await removeVerdictLabels(client, config.prNumber);
  await client.addLabel(
    config.prNumber,
    plan.verdict === "needs-change" ? labels.needsChange : labels.approved,
  );

  try {
    await assertCurrentPullRequest(client, config);
  } catch (error) {
    await removeVerdictLabels(client, config.prNumber);
    throw error;
  }
}

await main();
