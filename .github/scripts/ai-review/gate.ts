import { join, resolve } from "node:path";

import { readReviewVerdict } from "./review-verdict.ts";

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

const artifactDirectory = resolve(required("AI_REVIEW_ARTIFACT_DIRECTORY"));
const expectedArtifactDirectory = join(
  resolve(required("RUNNER_TEMP")),
  "ai-review",
);
if (artifactDirectory !== expectedArtifactDirectory) {
  throw new Error(
    "AI_REVIEW_ARTIFACT_DIRECTORY must be the ai-review directory under RUNNER_TEMP.",
  );
}

const verdict = await readReviewVerdict(artifactDirectory);
if (verdict === "needs-change") {
  throw new Error("AI review requires changes.");
}

process.stdout.write("AI review approved.\n");
