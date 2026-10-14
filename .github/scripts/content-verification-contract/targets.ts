import { posix } from "node:path";

import type { KnowledgeType } from "@knowledge-base/knowledge-catalog-validation";

import { discoverKnowledgeBaseTargets } from "./adapters/knowledge-base-targets.ts";
import { discoverMaintainedAgentContentTargets } from "./adapters/maintained-agent-content-targets.ts";
import type { VerificationScope } from "./scope.ts";
import type { VerificationTarget } from "./types.ts";

function isKnowledgeScope(
  scope: VerificationScope,
): scope is `${KnowledgeType}-knowledge` {
  return scope !== "maintained-agent-content";
}

function knowledgeType(scope: `${KnowledgeType}-knowledge`): KnowledgeType {
  return scope === "time-sensitive-knowledge" ? "time-sensitive" : "evergreen";
}

function normalizedTrackedPaths(trackedPaths: readonly string[]): string[] {
  const normalized = trackedPaths.map((filePath) => {
    if (
      filePath.length === 0 ||
      filePath.startsWith("/") ||
      filePath.includes("\\") ||
      posix.normalize(filePath) !== filePath ||
      filePath.split("/").some((segment) => segment === "..")
    ) {
      throw new Error(
        `Tracked path '${filePath}' is not a normalized repository path.`,
      );
    }
    return filePath;
  });
  return [...new Set(normalized)].sort();
}

export function discoverVerificationTargets(
  scope: VerificationScope,
  trackedPaths: readonly string[],
  catalogMarkdown: string,
): VerificationTarget[] {
  return selectVerificationTargets(
    scope,
    discoverVerificationTargetCatalog(trackedPaths, catalogMarkdown),
  );
}

export function selectVerificationTargets(
  scope: VerificationScope,
  targetCatalog: readonly VerificationTarget[],
): VerificationTarget[] {
  const targets = targetCatalog.filter((target) =>
    isKnowledgeScope(scope)
      ? target.kind === "knowledge" &&
        target.knowledgeType === knowledgeType(scope)
      : target.kind !== "knowledge",
  );
  if (targets.length === 0) {
    throw new Error(
      `Verification scope '${scope}' did not discover any targets.`,
    );
  }
  return targets;
}

export function discoverVerificationTargetCatalog(
  trackedPaths: readonly string[],
  catalogMarkdown: string,
): VerificationTarget[] {
  const paths = normalizedTrackedPaths(trackedPaths);
  const targets = [
    ...discoverKnowledgeBaseTargets(paths, catalogMarkdown),
    ...discoverMaintainedAgentContentTargets(paths),
  ].sort((left, right) => left.id.localeCompare(right.id));

  const ownedFiles = new Set<string>();
  for (const target of targets) {
    for (const filePath of target.files) {
      if (ownedFiles.has(filePath)) {
        throw new Error(
          `Verification file '${filePath}' belongs to multiple targets.`,
        );
      }
      ownedFiles.add(filePath);
    }
  }
  return targets;
}

export type { VerificationTarget } from "./types.ts";
