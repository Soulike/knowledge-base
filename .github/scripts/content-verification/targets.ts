import { posix } from "node:path";

import {
  KnowledgeIndexError,
  type KnowledgeIndexEntry,
  type KnowledgeType,
  validateKnowledgeIndex,
} from "@knowledge-base/knowledge-index";
import type { VerificationScope } from "./scope.ts";

export type VerificationTarget = {
  files: string[];
  id: string;
  kind: "agent-content" | "knowledge" | "shared-reference" | "skill";
};

function isKnowledgeScope(
  scope: VerificationScope,
): scope is `${KnowledgeType}-knowledge` {
  return scope !== "maintained-agent-content";
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
  if (filePath.startsWith(".github/workflows/shared/")) {
    return filePath.endsWith(".md");
  }
  return /^plugins\/[^/]+\/references\//u.test(filePath);
}

function isAgentInstructions(filePath: string): boolean {
  return (
    filePath === "AGENTS.md" ||
    filePath.endsWith("/AGENTS.md") ||
    filePath === "CONTEXT.md" ||
    /^docs\/agents\/[^/]+\.md$/u.test(filePath)
  );
}

function isAgenticWorkflowSource(filePath: string): boolean {
  return (
    /^\.github\/workflows\/[^/]+\.md$/u.test(filePath) &&
    filePath !== ".github/workflows/README.md"
  );
}

function promptBundleDirectory(filePath: string): string | undefined {
  return /^(\.github\/scripts\/[^/]+\/prompts)\/.+\.md$/u.exec(filePath)?.[1];
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
  let entries: KnowledgeIndexEntry[];
  try {
    entries = validateKnowledgeIndex(indexMarkdown, leafFilePaths);
  } catch (error) {
    if (!(error instanceof KnowledgeIndexError)) {
      throw error;
    }
    throw new Error(
      `Cannot select Knowledge from an invalid index:\n${error.diagnostics.join("\n")}`,
      { cause: error },
    );
  }

  return entries
    .filter((entry) => entry.knowledgeType === knowledgeType(scope))
    .map<VerificationTarget>((entry) => {
      const filePath = `knowledge/${entry.filePath}`;
      return { files: [filePath], id: filePath, kind: "knowledge" };
    })
    .sort((left, right) => left.id.localeCompare(right.id));
}

function agentContentTargets(trackedPaths: string[]): VerificationTarget[] {
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

  const alreadyOwned = new Set(targets.flatMap((target) => target.files));
  for (const filePath of trackedPaths.filter(isAgentInstructions)) {
    if (!alreadyOwned.has(filePath)) {
      targets.push({ files: [filePath], id: filePath, kind: "agent-content" });
    }
  }

  for (const filePath of trackedPaths.filter(isAgenticWorkflowSource)) {
    if (!alreadyOwned.has(filePath)) {
      targets.push({ files: [filePath], id: filePath, kind: "agent-content" });
    }
  }

  const promptBundles = new Map<string, string[]>();
  for (const filePath of trackedPaths) {
    const directory = promptBundleDirectory(filePath);
    if (!directory || alreadyOwned.has(filePath)) {
      continue;
    }
    const files = promptBundles.get(directory) ?? [];
    files.push(filePath);
    promptBundles.set(directory, files);
  }
  for (const [directory, files] of promptBundles) {
    targets.push({
      files: files.sort(),
      id: directory,
      kind: "agent-content",
    });
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
    : agentContentTargets(paths);
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
