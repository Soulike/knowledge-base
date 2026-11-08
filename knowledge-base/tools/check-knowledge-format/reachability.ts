import { readdir, readFile, realpath, stat } from "node:fs/promises";
import {
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
  win32,
} from "node:path";

import { fromMarkdown } from "mdast-util-from-markdown";
import type { Nodes } from "mdast";

export interface KnowledgeReachabilityDiagnostic {
  filePath: string;
  message: string;
}

export interface KnowledgeReachabilityResult {
  diagnostics: KnowledgeReachabilityDiagnostic[];
  entrypointCount: number;
  reachableKnowledgeFilePaths: string[];
  unreachableKnowledgeFilePaths: string[];
}

interface LinkedMarkdownTarget {
  line: number;
  url: string;
}

interface IncomingLink {
  line: number;
  sourcePath: string;
  url: string;
}

type MarkdownPath =
  | { kind: "ignored" }
  | { kind: "local"; filePath: string }
  | { kind: "malformed"; reason: string };

function toPortablePath(filePath: string): string {
  return filePath.split(sep).join("/");
}

function visitNodes(node: Nodes, visit: (node: Nodes) => void): void {
  visit(node);
  if ("children" in node) {
    for (const child of node.children) {
      visitNodes(child, visit);
    }
  }
}

function linkedMarkdownTargets(markdown: string): LinkedMarkdownTarget[] {
  const document = fromMarkdown(markdown);
  const definitions = new Map<string, LinkedMarkdownTarget>();
  const targets: LinkedMarkdownTarget[] = [];

  visitNodes(document, (node) => {
    if (node.type === "definition" && !definitions.has(node.identifier)) {
      definitions.set(node.identifier, {
        line: node.position?.start.line ?? 1,
        url: node.url,
      });
    }
  });
  visitNodes(document, (node) => {
    if (node.type === "link") {
      targets.push({
        line: node.position?.start.line ?? 1,
        url: node.url,
      });
    } else if (node.type === "linkReference") {
      const target = definitions.get(node.identifier);
      if (target !== undefined) {
        targets.push(target);
      }
    }
  });

  return targets;
}

function parseMarkdownPath(url: string): MarkdownPath {
  const path = url.split(/[?#]/, 1)[0];

  if (
    path === undefined ||
    path === "" ||
    path.startsWith("//") ||
    (!win32.isAbsolute(path) && /^[a-z][a-z\d+.-]*:/iu.test(path))
  ) {
    return { kind: "ignored" };
  }

  let decodedPath: string;
  try {
    decodedPath = decodeURIComponent(path);
  } catch {
    return { kind: "malformed", reason: "invalid percent encoding" };
  }

  if (decodedPath.includes("\\")) {
    return {
      kind: "malformed",
      reason: "package Markdown paths must use forward slashes",
    };
  }

  if (!decodedPath.toLowerCase().endsWith(".md")) {
    return { kind: "ignored" };
  }

  return { filePath: decodedPath, kind: "local" };
}

function errorCode(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  return undefined;
}

async function findSkillEntrypoints(
  pluginDirectory: string,
): Promise<string[]> {
  const skillsDirectory = join(pluginDirectory, "skills");
  let entries;

  try {
    entries = await readdir(skillsDirectory, { withFileTypes: true });
  } catch (error) {
    if (errorCode(error) === "ENOENT") {
      return [];
    }
    throw error;
  }

  const entrypoints: string[] = [];
  for (const entry of entries.sort((left, right) =>
    left.name.localeCompare(right.name),
  )) {
    if (!entry.isDirectory()) {
      continue;
    }

    const entrypoint = join(skillsDirectory, entry.name, "SKILL.md");
    try {
      await stat(entrypoint);
      entrypoints.push(entrypoint);
    } catch (error) {
      if (errorCode(error) === "ENOENT") {
        continue;
      }
      throw error;
    }
  }

  return entrypoints;
}

function isOutsidePackage(relativePath: string): boolean {
  return (
    relativePath === ".." ||
    relativePath.startsWith("../") ||
    isAbsolute(relativePath)
  );
}

function isPackageReference(filePath: string): boolean {
  const segments = filePath.split("/");
  const lowerCaseSegments = segments.map((segment) => segment.toLowerCase());
  const fileName = lowerCaseSegments.at(-1);

  if (
    fileName === "readme.md" ||
    fileName?.endsWith(".test.md") === true ||
    fileName?.endsWith(".spec.md") === true ||
    lowerCaseSegments.some((segment) =>
      [
        "__fixtures__",
        "__tests__",
        "fixture",
        "fixtures",
        "research",
        "test",
        "tests",
      ].includes(segment),
    )
  ) {
    return false;
  }

  return (
    lowerCaseSegments[0] === "references" ||
    (lowerCaseSegments[0] === "skills" && lowerCaseSegments[2] === "references")
  );
}

function isPotentialKnowledgeLeaf(filePath: string): boolean {
  return (
    filePath.startsWith("knowledge/") &&
    filePath.endsWith(".md") &&
    filePath !== "knowledge/index.md" &&
    !filePath.endsWith("/index.md")
  );
}

function routeDescription(route: readonly string[]): string {
  return route.join(" -> ");
}

function readFailureMessage(code: string | undefined): string {
  if (code === "ENOENT") {
    return "file does not exist";
  }

  return `target is not a readable Markdown file (${code ?? "unknown error"})`;
}

export async function checkKnowledgeReachability(
  pluginDirectory: string,
  knowledgeFilePaths: readonly string[],
): Promise<KnowledgeReachabilityResult> {
  const resolvedPluginDirectory = resolve(pluginDirectory);
  const realPluginDirectory = await realpath(resolvedPluginDirectory);
  const entrypoints = await findSkillEntrypoints(resolvedPluginDirectory);
  const knowledgePathSet = new Set(knowledgeFilePaths);
  const reachableKnowledgePaths = new Set<string>();
  const diagnostics: KnowledgeReachabilityDiagnostic[] = [];

  for (const entrypoint of entrypoints) {
    const entrypointPath = toPortablePath(
      relative(resolvedPluginDirectory, entrypoint),
    );
    const visited = new Set<string>();

    function addDiagnostic(message: string): void {
      diagnostics.push({ filePath: entrypointPath, message });
    }

    async function visitRoute(
      filePath: string,
      displayPath: string,
      route: readonly string[],
      incomingLink?: IncomingLink,
    ): Promise<void> {
      let realFilePath: string;
      try {
        realFilePath = await realpath(filePath);
      } catch (error) {
        const code = errorCode(error);
        if (incomingLink === undefined) {
          addDiagnostic(
            `Installed Skill entrypoint '${displayPath}' cannot be read: ${readFailureMessage(code)}.`,
          );
        } else {
          addDiagnostic(
            `Route '${routeDescription(route)}' cannot read '${displayPath}' linked from '${incomingLink.sourcePath}:${incomingLink.line}': ${readFailureMessage(code)}.`,
          );
        }
        return;
      }

      const realPluginRelativePath = toPortablePath(
        relative(realPluginDirectory, realFilePath),
      );
      if (isOutsidePackage(realPluginRelativePath)) {
        if (incomingLink === undefined) {
          addDiagnostic(
            `Installed Skill entrypoint '${displayPath}' resolves outside the plugin package.`,
          );
        } else {
          addDiagnostic(
            `Route '${routeDescription(route)}' follows '${incomingLink.url}' from '${incomingLink.sourcePath}:${incomingLink.line}' outside the plugin package.`,
          );
        }
        return;
      }

      if (
        incomingLink !== undefined &&
        !isPackageReference(realPluginRelativePath)
      ) {
        return;
      }

      if (visited.has(realFilePath)) {
        return;
      }
      visited.add(realFilePath);

      let markdown: string;
      try {
        markdown = await readFile(realFilePath, "utf8");
      } catch (error) {
        const code = errorCode(error);
        if (incomingLink === undefined) {
          addDiagnostic(
            `Installed Skill entrypoint '${displayPath}' cannot be read: ${readFailureMessage(code)}.`,
          );
        } else {
          addDiagnostic(
            `Route '${routeDescription(route)}' cannot read '${displayPath}' linked from '${incomingLink.sourcePath}:${incomingLink.line}': ${readFailureMessage(code)}.`,
          );
        }
        return;
      }

      for (const target of linkedMarkdownTargets(markdown)) {
        const parsedPath = parseMarkdownPath(target.url);
        if (parsedPath.kind === "ignored") {
          continue;
        }
        if (parsedPath.kind === "malformed") {
          addDiagnostic(
            `Route '${routeDescription(route)}' has malformed Markdown link '${target.url}' at '${displayPath}:${target.line}': ${parsedPath.reason}.`,
          );
          continue;
        }

        const targetPath = resolve(dirname(filePath), parsedPath.filePath);
        const pluginRelativeTarget = toPortablePath(
          relative(resolvedPluginDirectory, targetPath),
        );
        const targetRoute = [...route, pluginRelativeTarget];
        const incoming: IncomingLink = {
          line: target.line,
          sourcePath: displayPath,
          url: target.url,
        };

        if (
          isAbsolute(parsedPath.filePath) ||
          win32.isAbsolute(parsedPath.filePath) ||
          isOutsidePackage(pluginRelativeTarget)
        ) {
          addDiagnostic(
            `Route '${routeDescription(targetRoute)}' follows '${target.url}' from '${displayPath}:${target.line}' outside the plugin package.`,
          );
          continue;
        }

        if (knowledgePathSet.has(pluginRelativeTarget)) {
          reachableKnowledgePaths.add(pluginRelativeTarget);
        } else if (isPackageReference(pluginRelativeTarget)) {
          await visitRoute(
            targetPath,
            pluginRelativeTarget,
            targetRoute,
            incoming,
          );
        } else if (isPotentialKnowledgeLeaf(pluginRelativeTarget)) {
          try {
            await readFile(targetPath, "utf8");
          } catch (error) {
            addDiagnostic(
              `Route '${routeDescription(targetRoute)}' cannot read '${pluginRelativeTarget}' linked from '${displayPath}:${target.line}': ${readFailureMessage(errorCode(error))}.`,
            );
          }
        }
      }
    }

    await visitRoute(entrypoint, entrypointPath, [entrypointPath]);
  }

  const reachableKnowledgeFilePaths = [...reachableKnowledgePaths].sort();
  const unreachableKnowledgeFilePaths = knowledgeFilePaths
    .filter((filePath) => !reachableKnowledgePaths.has(filePath))
    .sort();

  diagnostics.sort(
    (left, right) =>
      left.filePath.localeCompare(right.filePath) ||
      left.message.localeCompare(right.message),
  );

  return {
    diagnostics,
    entrypointCount: entrypoints.length,
    reachableKnowledgeFilePaths,
    unreachableKnowledgeFilePaths,
  };
}
