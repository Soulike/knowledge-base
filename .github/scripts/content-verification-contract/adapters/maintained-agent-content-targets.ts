import { posix } from "node:path";

import type { VerificationTarget } from "../types.ts";

function isSkillEntrypoint(filePath: string): boolean {
  const segments = filePath.split("/");
  return (
    segments.at(-1) === "SKILL.md" &&
    segments.length >= 3 &&
    segments.at(-3) === "skills"
  );
}

function sharedReferencePackage(filePath: string): boolean {
  if (filePath.startsWith("knowledge-base/plugin/references/")) {
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
    filePath === "GLOSSARY.md" ||
    filePath === "GLOSSARY-MAP.md" ||
    /^knowledge-base\/GLOSSARY(?:-MAP)?\.md$/u.test(filePath) ||
    /^knowledge-base\/docs\/agents\/[^/]+\.md$/u.test(filePath) ||
    /^plugins\/[^/]+\/GLOSSARY(?:-MAP)?\.md$/u.test(filePath) ||
    /^plugins\/[^/]+\/docs\/agents\/[^/]+\.md$/u.test(filePath) ||
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

export function discoverMaintainedAgentContentTargets(
  trackedPaths: readonly string[],
): VerificationTarget[] {
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
