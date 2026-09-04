import type { VerificationScope } from "./scope.ts";
import {
  discoverVerificationTargetCatalog,
  selectVerificationTargets,
  type VerificationTarget,
} from "./targets.ts";

const SHA_PATTERN = /^[0-9a-f]{40}$/u;

export type VerificationManifest = {
  revision: string;
  reviewTargetIds: string[];
  scope: VerificationScope;
  targetCatalog: VerificationTarget[];
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
  const targets = discoverVerificationTargetCatalog(
    trackedPaths,
    indexMarkdown,
  );
  return {
    revision,
    reviewTargetIds: selectVerificationTargets(scope, targets).map(
      (target) => target.id,
    ),
    scope,
    targetCatalog: targets,
  };
}
