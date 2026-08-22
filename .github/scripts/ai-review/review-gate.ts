import {
  isTrustedAuthorAssociation,
  type ReviewEventContext,
} from "./config.ts";
import type { GitHubClient, PullRequest, PullRequestReview } from "./github.ts";
import {
  AI_REVIEW_AUTHOR,
  labels,
  parseReviewRunMarker,
  type ReviewVerdict,
} from "./review-state.ts";

export type ReviewIdentity = {
  baseSha: string;
  expectedHeadSha: string;
  prNumber: number;
  runAttempt: number;
  runId: number;
};

export type ReviewGateContext = ReviewIdentity & ReviewEventContext;

type ReviewGateClient = Pick<
  GitHubClient,
  "addLabel" | "getPullRequest" | "listReviews" | "removeLabel"
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

export function verifyPublishedReview(
  identity: ReviewIdentity,
  pullRequest: PullRequest,
  reviews: PullRequestReview[],
): ReviewVerdict {
  assertCurrentPullRequest(identity, pullRequest);

  const matchingReviews = reviews.flatMap((review) => {
    if (
      review.authorLogin !== AI_REVIEW_AUTHOR ||
      review.commitSha !== identity.expectedHeadSha ||
      review.state !== "COMMENTED"
    ) {
      return [];
    }
    const marker = parseReviewRunMarker(review.body);
    if (
      marker?.headSha !== identity.expectedHeadSha ||
      marker.runId !== identity.runId ||
      marker.runAttempt !== identity.runAttempt
    ) {
      return [];
    }
    return [{ marker, review }];
  });

  if (matchingReviews.length !== 1) {
    throw new Error(
      `Expected exactly one COMMENT review for run ${identity.runId}, attempt ${identity.runAttempt}, and head ${identity.expectedHeadSha}; found ${matchingReviews.length}.`,
    );
  }
  return matchingReviews[0]!.marker.verdict;
}

async function clearVerdictLabels(
  client: ReviewGateClient,
  prNumber: number,
): Promise<void> {
  await Promise.all([
    client.removeLabel(prNumber, labels.approved),
    client.removeLabel(prNumber, labels.needsChange),
  ]);
}

async function setVerdictLabel(
  client: ReviewGateClient,
  prNumber: number,
  verdict: ReviewVerdict,
): Promise<void> {
  await clearVerdictLabels(client, prNumber);
  await client.addLabel(
    prNumber,
    verdict === "approved" ? labels.approved : labels.needsChange,
  );
}

export async function enforceReviewGate(
  client: ReviewGateClient,
  context: ReviewGateContext,
): Promise<"approved" | "not-applicable"> {
  if (context.action === "closed") {
    await clearVerdictLabels(client, context.prNumber);
    return "not-applicable";
  }

  if (context.action === "converted_to_draft" || context.isDraft) {
    await clearVerdictLabels(client, context.prNumber);
    throw new Error("AI review cannot pass for a draft pull request.");
  }

  if (!isTrustedAuthorAssociation(context.authorAssociation)) {
    await clearVerdictLabels(client, context.prNumber);
    throw new Error(
      `AI review requires a trusted pull-request author; received ${context.authorAssociation}.`,
    );
  }

  if (context.reviewJobResult !== "success") {
    await clearVerdictLabels(client, context.prNumber);
    throw new Error(
      `The Copilot review job did not succeed (${context.reviewJobResult}).`,
    );
  }

  let verdict: ReviewVerdict;
  try {
    const [pullRequest, reviews] = await Promise.all([
      client.getPullRequest(context.prNumber),
      client.listReviews(context.prNumber),
    ]);
    verdict = verifyPublishedReview(context, pullRequest, reviews);
    await setVerdictLabel(client, context.prNumber, verdict);

    const [currentPullRequest, currentReviews] = await Promise.all([
      client.getPullRequest(context.prNumber),
      client.listReviews(context.prNumber),
    ]);
    verifyPublishedReview(context, currentPullRequest, currentReviews);
  } catch (error) {
    await clearVerdictLabels(client, context.prNumber);
    throw error;
  }

  if (verdict === "needs-change") {
    throw new Error("AI review requires changes.");
  }
  return "approved";
}
