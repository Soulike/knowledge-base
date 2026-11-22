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
  revision: string;
  scope: VerificationScope;
  trackedPaths: readonly string[];
} & (
  | { catalogMarkdown: string; catalogs?: never }
  | { catalogs: KnowledgeCatalogInputs; catalogMarkdown?: never }
);

export function createVerificationManifest(
  input: CreateVerificationManifestInput,
): VerificationManifest {
  const { revision, scope, trackedPaths } = input;
  if (!SHA_PATTERN.test(revision)) {
    throw new Error("Revision must be a lowercase 40-character Git SHA.");
  }
  const catalogInputs =
    input.catalogs !== undefined ? input.catalogs : input.catalogMarkdown;
  const targets = discoverVerificationTargetCatalog(
    trackedPaths,
    catalogInputs,
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
