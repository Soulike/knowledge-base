import type { VerificationScope } from "./scope.ts";
import {
  discoverVerificationTargets,
  type VerificationTarget,
} from "./targets.ts";

const SHA_PATTERN = /^[0-9a-f]{40}$/u;

export type VerificationManifest = {
  revision: string;
  scope: VerificationScope;
  targets: VerificationTarget[];
};

export function buildVerificationManifest(
  scope: VerificationScope,
  revision: string,
  trackedPaths: string[],
  indexMarkdown: string,
): VerificationManifest {
  if (!SHA_PATTERN.test(revision)) {
    throw new Error("Revision must be a lowercase 40-character Git SHA.");
  }
  return {
    revision,
    scope,
    targets: discoverVerificationTargets(scope, trackedPaths, indexMarkdown),
  };
}
