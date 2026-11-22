import type { KnowledgeCatalogInputs } from "./adapters/knowledge-base-targets.ts";
import type { VerificationScope } from "./scope.ts";
import {
  discoverVerificationTargetCatalog,
  selectVerificationTargets,
} from "./targets.ts";
import type { VerificationTarget } from "./types.ts";

const SHA_PATTERN = /^[0-9a-f]{40}$/u;

export type VerificationManifest = {
  revision: string;
  reviewTargetIds: string[];
  scope: VerificationScope;
  targetCatalog: VerificationTarget[];
};

export type CreateVerificationManifestInput = {
  catalogs: KnowledgeCatalogInputs;
  revision: string;
  scope: VerificationScope;
  trackedPaths: readonly string[];
};

export function createVerificationManifest(
  input: CreateVerificationManifestInput,
): VerificationManifest {
  const { catalogs, revision, scope, trackedPaths } = input;
  if (!SHA_PATTERN.test(revision)) {
    throw new Error("Revision must be a lowercase 40-character Git SHA.");
  }
  const targets = discoverVerificationTargetCatalog(trackedPaths, catalogs);
  return {
    revision,
    reviewTargetIds: selectVerificationTargets(scope, targets).map(
      (target) => target.id,
    ),
    scope,
    targetCatalog: targets,
  };
}
