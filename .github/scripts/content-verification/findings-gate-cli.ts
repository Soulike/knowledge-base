import { readContentVerificationArtifacts } from "./artifacts.ts";
import { reduceFindingEvents } from "./finding-events.ts";
import { parseVerificationManifest } from "./manifest-validation.ts";
import { parseVerificationScope } from "./scope.ts";

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Content verification findings gate: ${name} is required.`);
  }
  return value;
}

if (required("CONTENT_VERIFICATION_AGENT_RESULT") !== "success") {
  throw new Error(
    "Content verification findings gate: Agent job did not succeed.",
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
process.stdout.write(
  `Content verification findings passed the gate: ${String(findings.length)} finding(s).\n`,
);
