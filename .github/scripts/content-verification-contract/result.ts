import { reduceFindingEvents } from "./finding-events.ts";
import { parseVerificationManifest } from "./manifest-validation.ts";
import type { VerificationManifest } from "./manifest.ts";
import type { VerificationScope } from "./scope.ts";

export type AuthenticatedVerificationResult = {
  findings: ReturnType<typeof reduceFindingEvents>;
  manifest: VerificationManifest;
};

export function authenticateVerificationResult(input: {
  expectedRevision: string;
  expectedScope: VerificationScope;
  manifestValue: unknown;
  outputValue: unknown;
}): AuthenticatedVerificationResult {
  const manifest = parseVerificationManifest(
    input.manifestValue,
    input.expectedRevision,
    input.expectedScope,
  );
  return {
    findings: reduceFindingEvents(manifest, input.outputValue),
    manifest,
  };
}
