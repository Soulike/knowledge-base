import { posix } from "node:path";

import {
  inspectKnowledgeIndex,
  type KnowledgeType,
} from "@knowledge-base/knowledge-index";

export const verificationScopes = [
  "time-sensitive-knowledge",
  "evergreen-knowledge",
  "skills-and-references",
] as const;

export type VerificationScope = (typeof verificationScopes)[number];

export type VerificationTarget = {
  files: string[];
  id: string;
  kind: "knowledge" | "shared-reference" | "skill";
};

function isKnowledgeScope(
  scope: VerificationScope,
): scope is `${KnowledgeType}-knowledge` {
  return scope !== "skills-and-references";
}

function knowledgeType(scope: `${KnowledgeType}-knowledge`): KnowledgeType {
  return scope === "time-sensitive-knowledge" ? "time-sensitive" : "evergreen";
}

function isSkillEntrypoint(filePath: string): boolean {
  const segments = filePath.split("/");
  return (
    segments.at(-1) === "SKILL.md" &&
    segments.length >= 3 &&
    segments.at(-3) === "skills"
  );
}

function sharedReferencePackage(filePath: string): boolean {
  if (filePath.startsWith("references/")) {
    return true;
  }
  if (filePath.startsWith(".agents/references/")) {
    return true;
  }
  return /^plugins\/[^/]+\/references\//u.test(filePath);
}

function normalizedTrackedPaths(trackedPaths: string[]): string[] {
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

function knowledgeTargets(
  scope: `${KnowledgeType}-knowledge`,
  trackedPaths: string[],
  indexMarkdown: string,
): VerificationTarget[] {
  const leafFilePaths = trackedPaths
    .filter(
      (filePath) =>
        filePath.startsWith("knowledge/") &&
        filePath.endsWith(".md") &&
        filePath !== "knowledge/index.md" &&
        !filePath.endsWith("/index.md"),
    )
    .map((filePath) => filePath.slice("knowledge/".length));
  const inspection = inspectKnowledgeIndex(indexMarkdown, leafFilePaths);
  if (inspection.diagnostics.length > 0) {
    throw new Error(
      `Cannot select Knowledge from an invalid index:\n${inspection.diagnostics.join("\n")}`,
    );
  }

  return inspection.entries
    .filter((entry) => entry.knowledgeType === knowledgeType(scope))
    .map<VerificationTarget>((entry) => {
      const filePath = `knowledge/${entry.filePath}`;
      return { files: [filePath], id: filePath, kind: "knowledge" };
    })
    .sort((left, right) => left.id.localeCompare(right.id));
}

function skillTargets(trackedPaths: string[]): VerificationTarget[] {
  const entrypoints = trackedPaths.filter(isSkillEntrypoint);
  const targets = entrypoints.map<VerificationTarget>((entrypoint) => {
    const directory = posix.dirname(entrypoint);
    const files = [
      entrypoint,
      ...trackedPaths.filter(
        (filePath) =>
          filePath !== entrypoint && filePath.startsWith(`${directory}/`),
      ),
    ];
    return {
      files,
      id: entrypoint,
      kind: "skill",
    };
  });

  for (const filePath of trackedPaths.filter(sharedReferencePackage)) {
    targets.push({ files: [filePath], id: filePath, kind: "shared-reference" });
  }

  return targets.sort((left, right) => left.id.localeCompare(right.id));
}

export function discoverVerificationTargets(
  scope: VerificationScope,
  trackedPaths: string[],
  indexMarkdown: string,
): VerificationTarget[] {
  const paths = normalizedTrackedPaths(trackedPaths);
  const targets = isKnowledgeScope(scope)
    ? knowledgeTargets(scope, paths, indexMarkdown)
    : skillTargets(paths);
  if (targets.length === 0) {
    throw new Error(
      `Verification scope '${scope}' did not discover any targets.`,
    );
  }

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

export function parseVerificationScope(value: string): VerificationScope {
  if (!verificationScopes.includes(value as VerificationScope)) {
    throw new Error(
      `Verification scope must be one of: ${verificationScopes.join(", ")}.`,
    );
  }
  return value as VerificationScope;
}
