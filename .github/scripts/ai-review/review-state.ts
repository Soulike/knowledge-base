export const labels = {
  approved: "AI Approved",
  needsChange: "AI Need Change",
} as const;

export const reviewVerdicts = ["approved", "needs-change"] as const;
export type ReviewVerdict = (typeof reviewVerdicts)[number];

export const AI_REVIEW_AUTHOR = "github-actions[bot]";

export type ReviewRunMarker = {
  headSha: string;
  runAttempt: number;
  runId: number;
  verdict: ReviewVerdict;
};

const reviewRunMarkerPattern =
  /<!-- knowledge-base-ai-review verdict=(approved|needs-change) head=([0-9a-f]{40}) run-id=([1-9][0-9]*) run-attempt=([1-9][0-9]*) -->/gu;
const visibleVerdictPattern =
  /^- \*\*Verdict:\*\* `(approved|needs-change)`$/gmu;
const visibleModelPattern = /^- \*\*Model:\*\* `([^`\r\n]{1,100})`$/gmu;

export function reviewRunMarker(
  verdict: ReviewVerdict,
  headSha: string,
  runId: number,
  runAttempt: number,
): string {
  return `<!-- knowledge-base-ai-review verdict=${verdict} head=${headSha} run-id=${runId} run-attempt=${runAttempt} -->`;
}

export function parseReviewRunMarker(
  body: string | null,
): ReviewRunMarker | null {
  if (body === null) {
    return null;
  }
  const matches = [...body.matchAll(reviewRunMarkerPattern)];
  const visibleVerdicts = [...body.matchAll(visibleVerdictPattern)];
  const visibleModels = [...body.matchAll(visibleModelPattern)];
  if (
    matches.length !== 1 ||
    visibleVerdicts.length !== 1 ||
    visibleModels.length !== 1
  ) {
    return null;
  }
  const match = matches[0];
  const visibleVerdict = visibleVerdicts[0];
  if (!match || !visibleVerdict || match[1] !== visibleVerdict[1]) {
    return null;
  }
  const runId = Number(match[3]);
  const runAttempt = Number(match[4]);
  if (!Number.isSafeInteger(runId) || !Number.isSafeInteger(runAttempt)) {
    return null;
  }
  return {
    headSha: match[2] as string,
    runAttempt,
    runId,
    verdict: match[1] as ReviewVerdict,
  };
}
