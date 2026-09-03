import {
  isTrustedAuthorAssociation,
  type ReviewEventContext,
} from "./config.ts";
import type {
  GitHubClient,
  PullRequest,
  PullRequestReview,
  PullRequestReviewComment,
  WorkflowJob,
} from "./github.ts";
import {
  AI_REVIEW_AUTHOR,
  AI_REVIEW_WORKFLOW_ID,
  AI_REVIEW_WORKFLOW_NAME,
  type FindingCounts,
  type FindingSeverity,
  parseInlineFindingSeverity,
  parseReviewBody,
  type ReviewVerdict,
} from "./review-state.ts";

export type ReviewIdentity = {
  baseSha: string;
  expectedHeadSha: string;
  prNumber: number;
  repository: string;
  runAttempt: number;
  runId: number;
};

export type ReviewGateContext = ReviewIdentity & ReviewEventContext;

type ReviewGateClient = Pick<
  GitHubClient,
  "getPullRequest" | "listReviewComments" | "listReviews" | "listRunAttemptJobs"
>;

export function assertCurrentPullRequest(
  identity: ReviewIdentity,
  pullRequest: PullRequest,
): void {
  if (
    pullRequest.number !== identity.prNumber ||
    pullRequest.state !== "open" ||
    pullRequest.baseSha !== identity.baseSha ||
    pullRequest.headSha !== identity.expectedHeadSha
  ) {
    throw new Error(
      `Pull request changed during review: expected ${identity.baseSha}...${identity.expectedHeadSha}, received ${pullRequest.baseSha}...${pullRequest.headSha} (${pullRequest.state}).`,
    );
  }
}

function assertExactFindingCounts(
  review: PullRequestReview,
  reviewComments: PullRequestReviewComment[],
  visible: FindingCounts,
  bodyOnly: FindingCounts,
): void {
  const inline: FindingCounts = { high: 0, low: 0, medium: 0, nit: 0 };
  for (const comment of reviewComments.filter(
    (candidate) => candidate.reviewId === review.id,
  )) {
    const severity = parseInlineFindingSeverity(comment.body);
    if (!severity) {
      throw new Error(
        `Review ${review.id} contains an inline comment without a valid finding severity.`,
      );
    }
    inline[severity] += 1;
  }
  for (const severity of Object.keys(visible) as FindingSeverity[]) {
    if (inline[severity] + bodyOnly[severity] !== visible[severity]) {
      throw new Error(
        `Review ${review.id} finding counts do not equal its inline and body-only findings.`,
      );
    }
  }
}

function safeOutputWindow(jobs: WorkflowJob[]): {
  completedAt: number;
  startedAt: number;
} {
  const matches = jobs.filter((job) => job.name === "safe_outputs");
  if (
    matches.length !== 1 ||
    matches[0]?.status !== "completed" ||
    matches[0].conclusion !== "success" ||
    !matches[0].startedAt ||
    !matches[0].completedAt
  ) {
    throw new Error(
      "Expected exactly one successful safe_outputs job in the current run attempt.",
    );
  }
  const startedAt = Date.parse(matches[0].startedAt);
  const completedAt = Date.parse(matches[0].completedAt);
  if (
    !Number.isFinite(startedAt) ||
    !Number.isFinite(completedAt) ||
    completedAt < startedAt
  ) {
    throw new Error(
      "The current run attempt has an invalid safe_outputs window.",
    );
  }
  return { completedAt, startedAt };
}

export function verifyPublishedReview(
  identity: ReviewIdentity,
  pullRequest: PullRequest,
  reviews: PullRequestReview[],
  reviewComments: PullRequestReviewComment[],
  jobs: WorkflowJob[],
): ReviewVerdict {
  assertCurrentPullRequest(identity, pullRequest);
  const window = safeOutputWindow(jobs);
  const expectedRunUrl = `https://github.com/${identity.repository}/actions/runs/${identity.runId}`;
  let outsideCurrentAttempt = 0;
  const matchingReviews = reviews.flatMap((review) => {
    if (
      review.authorLogin !== AI_REVIEW_AUTHOR ||
      review.commitSha !== identity.expectedHeadSha ||
      review.state !== "COMMENTED"
    ) {
      return [];
    }
    const parsed = parseReviewBody(review.body);
    if (
      parsed?.attribution.workflowName !== AI_REVIEW_WORKFLOW_NAME ||
      parsed.attribution.workflowId !== AI_REVIEW_WORKFLOW_ID ||
      parsed.attribution.runId !== identity.runId ||
      parsed.attribution.runUrl !== expectedRunUrl ||
      parsed.reviewedHeadSha !== identity.expectedHeadSha
    ) {
      return [];
    }
    const submittedAt = Date.parse(review.submittedAt ?? "");
    if (
      !Number.isFinite(submittedAt) ||
      submittedAt < window.startedAt ||
      submittedAt > window.completedAt
    ) {
      outsideCurrentAttempt += 1;
      return [];
    }
    assertExactFindingCounts(
      review,
      reviewComments,
      parsed.counts,
      parsed.bodyOnlyCounts,
    );
    return [{ parsed, review }];
  });

  if (matchingReviews.length === 0 && outsideCurrentAttempt > 0) {
    throw new Error(
      "The attributed review was not published by the current run attempt.",
    );
  }
  if (matchingReviews.length !== 1) {
    throw new Error(
      `Expected exactly one COMMENT review for run ${identity.runId}, attempt ${identity.runAttempt}, and head ${identity.expectedHeadSha}; found ${matchingReviews.length}.`,
    );
  }
  return matchingReviews[0]!.parsed.verdict;
}

async function readPublishedReview(
  client: ReviewGateClient,
  context: ReviewGateContext,
): Promise<ReviewVerdict> {
  const [pullRequest, reviews, reviewComments, jobs] = await Promise.all([
    client.getPullRequest(context.prNumber),
    client.listReviews(context.prNumber),
    client.listReviewComments(context.prNumber),
    client.listRunAttemptJobs(context.runId, context.runAttempt),
  ]);
  return verifyPublishedReview(
    context,
    pullRequest,
    reviews,
    reviewComments,
    jobs,
  );
}

export async function enforceReviewGate(
  client: ReviewGateClient,
  context: ReviewGateContext,
): Promise<"approved"> {
  if (context.action === "converted_to_draft" || context.isDraft) {
    throw new Error("AI review cannot pass for a draft pull request.");
  }

  if (!isTrustedAuthorAssociation(context.authorAssociation)) {
    throw new Error(
      `AI review requires a trusted pull-request author; received ${context.authorAssociation}.`,
    );
  }

  if (context.agentJobResult !== "success") {
    throw new Error(
      `The Copilot Agent job did not succeed (${context.agentJobResult}).`,
    );
  }
  if (context.safeOutputsJobResult !== "success") {
    throw new Error(
      `The review safe-output job did not succeed (${context.safeOutputsJobResult}).`,
    );
  }

  const verdict = await readPublishedReview(client, context);

  if (verdict === "needs-change") {
    throw new Error("AI review requires changes.");
  }
  return "approved";
}
