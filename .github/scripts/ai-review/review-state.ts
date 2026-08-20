import { createHash } from "node:crypto";

import type { Finding, ReviewOutput, Severity } from "./review-output.ts";

export const labels = {
  approved: "AI Approved",
  needsChange: "AI Need Change",
  ready: "Ready for Review",
} as const;

export const AI_REVIEW_AUTHOR = "github-actions[bot]";

export type ReviewThreadComment = {
  authorLogin: string;
  body: string;
  databaseId: number;
};

export type ReviewThread = {
  comments: ReviewThreadComment[];
  id: string;
  isResolved: boolean;
};

type FindingMarker = {
  fingerprint: string;
  severity: Severity;
};

const findingMarkerPattern =
  /<!-- knowledge-base-ai-review-finding severity=(nit|low|medium|high) fingerprint=([0-9a-f]{64}) -->/u;

export function findingFingerprint(finding: Finding): string {
  return createHash("sha256")
    .update(
      JSON.stringify([
        finding.severity,
        finding.path,
        finding.line,
        finding.side,
        finding.title.trim(),
        finding.body.trim(),
      ]),
    )
    .digest("hex");
}

export function findingComment(finding: Finding): string {
  const fingerprint = findingFingerprint(finding);
  return `<!-- knowledge-base-ai-review-finding severity=${finding.severity} fingerprint=${fingerprint} -->\n**[${finding.severity}] ${finding.title.trim()}**\n\n${finding.body.trim()}`;
}

export function parseFindingMarker(body: string): FindingMarker | null {
  const match = findingMarkerPattern.exec(body);
  if (!match) {
    return null;
  }
  return {
    fingerprint: match[2] as string,
    severity: match[1] as Severity,
  };
}

export function aiFindingMarker(thread: ReviewThread): FindingMarker | null {
  const firstComment = thread.comments[0];
  if (firstComment?.authorLogin !== AI_REVIEW_AUTHOR) {
    return null;
  }
  return parseFindingMarker(firstComment.body);
}

export type FixedThread = {
  id: string;
  rationale: string;
  replyToCommentId: number;
};

export type PublicationPlan = {
  fixedThreads: FixedThread[];
  newFindings: Finding[];
  openCarriedFindings: FindingMarker[];
  verdict: "approved" | "needs-change";
};

export function planPublication(
  output: ReviewOutput,
  threads: ReviewThread[],
  options: { includeNewFindings?: boolean } = {},
): PublicationPlan {
  const byId = new Map(threads.map((thread) => [thread.id, thread]));
  const fixedThreads: FixedThread[] = [];

  for (const assessment of output.threadAssessments) {
    const thread = byId.get(assessment.threadId);
    if (!thread) {
      throw new Error(
        `Copilot assessed review thread ${assessment.threadId}, which is not part of this pull request.`,
      );
    }
    const marker = aiFindingMarker(thread);
    const firstComment = thread.comments[0];
    if (!marker || !firstComment) {
      throw new Error(
        `Copilot assessed review thread ${assessment.threadId}, which is not an AI-owned finding.`,
      );
    }
    if (assessment.status === "fixed" && !thread.isResolved) {
      fixedThreads.push({
        id: thread.id,
        rationale: assessment.rationale,
        replyToCommentId: firstComment.databaseId,
      });
    }
  }

  const fixed = new Set(fixedThreads.map((thread) => thread.id));
  const openCarriedFindings = threads.flatMap((thread) => {
    if (thread.isResolved || fixed.has(thread.id)) {
      return [];
    }
    const marker = aiFindingMarker(thread);
    return marker ? [marker] : [];
  });
  const openFingerprints = new Set(
    openCarriedFindings.map((marker) => marker.fingerprint),
  );
  const emittedFingerprints = new Set<string>();
  const candidateFindings =
    options.includeNewFindings === false ? [] : output.findings;
  const newFindings = candidateFindings.filter((finding) => {
    const fingerprint = findingFingerprint(finding);
    if (
      openFingerprints.has(fingerprint) ||
      emittedFingerprints.has(fingerprint)
    ) {
      return false;
    }
    emittedFingerprints.add(fingerprint);
    return true;
  });
  const needsChange = [...openCarriedFindings, ...newFindings].some(
    (finding) => finding.severity === "medium" || finding.severity === "high",
  );

  return {
    fixedThreads,
    newFindings,
    openCarriedFindings,
    verdict: needsChange ? "needs-change" : "approved",
  };
}

export function resolutionRunMarker(runId: number, threadId: string): string {
  return `<!-- knowledge-base-ai-review-resolution run-id=${runId} thread=${threadId} -->`;
}

export function hasResolutionRunMarker(
  thread: ReviewThread,
  runId: number,
): boolean {
  const marker = resolutionRunMarker(runId, thread.id);
  return thread.comments.some(
    (comment) =>
      comment.authorLogin === AI_REVIEW_AUTHOR && comment.body.includes(marker),
  );
}

export function reviewRunMarker(runId: number, headSha: string): string {
  return `<!-- knowledge-base-ai-review run-id=${runId} head=${headSha} -->`;
}

export function hasReviewRunMarker(
  body: string | null,
  runId: number,
  headSha: string,
): boolean {
  return body?.includes(reviewRunMarker(runId, headSha)) ?? false;
}
