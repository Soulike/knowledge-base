import { readContentVerificationArtifacts } from "./artifacts.ts";
import { reduceFindingEvents } from "./finding-events.ts";
import { publishVerificationFindings } from "./finding-publication.ts";
import { GitHubIssueRepository } from "./github-issues.ts";
import { parseVerificationManifest } from "./manifest-validation.ts";
import { parseVerificationScope } from "./scope.ts";

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Content verification findings publisher: ${name} is required.`,
    );
  }
  return value;
}

if (required("CONTENT_VERIFICATION_AGENT_RESULT") !== "success") {
  throw new Error(
    "Content verification findings publisher: Agent job did not succeed.",
  );
}

const expectedRevision = required("CONTENT_VERIFICATION_EXPECTED_REVISION");
const expectedScope = parseVerificationScope(
  required("CONTENT_VERIFICATION_SCOPE"),
);
const { manifestValue, outputValue } = await readContentVerificationArtifacts(
  required("CONTENT_VERIFICATION_ARTIFACT_DIRECTORY"),
);
const manifest = parseVerificationManifest(
  manifestValue,
  expectedRevision,
  expectedScope,
);
const findings = reduceFindingEvents(manifest, outputValue);
const repositoryParts = required("GITHUB_REPOSITORY").split("/");
if (
  repositoryParts.length !== 2 ||
  !repositoryParts[0] ||
  !repositoryParts[1]
) {
  throw new Error(
    "Content verification findings publisher: GITHUB_REPOSITORY must be owner/repo.",
  );
}
const [owner, repo] = repositoryParts;
const repository = new GitHubIssueRepository({
  apiUrl: required("GITHUB_API_URL"),
  owner,
  repo,
  token: required("GITHUB_TOKEN"),
});
const result = await publishVerificationFindings(
  manifest,
  findings,
  { runUrl: required("CONTENT_VERIFICATION_RUN_URL") },
  repository,
);
process.stdout.write(
  `Content verification findings published: ${String(result.created.length)} created, ${String(result.suppressed.length)} exact duplicate(s) suppressed.\n`,
);
