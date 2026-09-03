import { readFile } from "node:fs/promises";

import { parseVerificationManifest } from "./agentic-gate.ts";
import { GitHubConfirmationIssueRepository } from "./github-confirmation-issues.ts";
import { applyVerificationInconclusiveDecisions } from "./inconclusive-resolution.ts";
import { parseVerificationScope } from "./scope.ts";

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Inconclusive verification publisher: ${name} is required.`,
    );
  }
  return value;
}

if (required("CONTENT_VERIFICATION_AGENT_RESULT") !== "success") {
  throw new Error(
    "Inconclusive verification publisher: Agent job did not succeed.",
  );
}

const expectedRevision = required("CONTENT_VERIFICATION_EXPECTED_REVISION");
const expectedScope = parseVerificationScope(
  required("CONTENT_VERIFICATION_SCOPE"),
);
const manifestValue = JSON.parse(
  await readFile(required("CONTENT_VERIFICATION_TARGET_MANIFEST"), "utf8"),
) as unknown;
const outputValue = JSON.parse(
  await readFile(required("GH_AW_AGENT_OUTPUT"), "utf8"),
) as unknown;
const manifest = parseVerificationManifest(
  manifestValue,
  expectedRevision,
  expectedScope,
);
const repositoryParts = required("GITHUB_REPOSITORY").split("/");
if (
  repositoryParts.length !== 2 ||
  !repositoryParts[0] ||
  !repositoryParts[1]
) {
  throw new Error(
    "Inconclusive verification publisher: GITHUB_REPOSITORY must be owner/repo.",
  );
}
const [owner, repo] = repositoryParts;
const repository = new GitHubConfirmationIssueRepository({
  apiUrl: required("GITHUB_API_URL"),
  owner,
  repo,
  token: required("GITHUB_TOKEN"),
});
const result = await applyVerificationInconclusiveDecisions(
  manifest,
  outputValue,
  {
    owner,
    repo,
    runUrl: required("CONTENT_VERIFICATION_RUN_URL"),
    staged: process.env.GH_AW_SAFE_OUTPUTS_STAGED === "true",
  },
  repository,
);

process.stdout.write(
  `Inconclusive verification decisions applied: ${String(result.created.length)} created, ${String(result.suppressed.length)} not created.\n`,
);
