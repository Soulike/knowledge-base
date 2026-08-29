import { posix } from "node:path";

import GithubSlugger from "github-slugger";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";

import type { Nodes } from "mdast";

const URL_SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*:/u;

export interface PromptLinkDiagnostic {
  line: number;
  message: string;
}

function visit(node: Nodes, visitor: (node: Nodes) => void): void {
  visitor(node);
  if ("children" in node) {
    for (const child of node.children) {
      visit(child, visitor);
    }
  }
}

function headingIds(markdown: string): Set<string> {
  const identifiers = new Set<string>();
  const slugger = new GithubSlugger();
  visit(fromMarkdown(markdown), (node) => {
    if (node.type === "heading") {
      identifiers.add(
        slugger.slug(
          toString(node, { includeHtml: false, includeImageAlt: false }),
        ),
      );
    }
  });
  return identifiers;
}

function splitUrl(url: string): {
  pathname: string;
  fragment: string | undefined;
} {
  const hashIndex = url.indexOf("#");
  const withoutFragment = hashIndex === -1 ? url : url.slice(0, hashIndex);
  const queryIndex = withoutFragment.indexOf("?");
  return {
    pathname:
      queryIndex === -1
        ? withoutFragment
        : withoutFragment.slice(0, queryIndex),
    fragment:
      hashIndex === -1
        ? undefined
        : decodeURIComponent(url.slice(hashIndex + 1)),
  };
}

function rootRelativePath(pathname: string): string | undefined {
  const decoded = decodeURI(pathname);
  const segments = decoded.split("/");
  if (
    decoded.startsWith("/") ||
    segments.includes("..") ||
    segments.includes("")
  ) {
    return undefined;
  }
  const normalized = posix.normalize(decoded.replace(/^\.\//u, ""));
  return normalized === "." ? undefined : normalized;
}

export function validatePromptLinks(
  promptPath: string,
  markdown: string,
  repositoryPaths: ReadonlySet<string>,
  repositoryMarkdown: ReadonlyMap<string, string>,
): PromptLinkDiagnostic[] {
  const diagnostics: PromptLinkDiagnostic[] = [];
  const document = fromMarkdown(markdown);

  visit(document, (node) => {
    if (node.type === "inlineCode") {
      const candidate = rootRelativePath(splitUrl(node.value).pathname);
      if (candidate !== undefined && repositoryPaths.has(candidate)) {
        diagnostics.push({
          line: node.position?.start.line ?? 1,
          message: `Repository file '${node.value}' must be a Markdown link in prompt prose.`,
        });
      }
      return;
    }

    if (
      node.type !== "link" &&
      node.type !== "image" &&
      node.type !== "definition"
    ) {
      return;
    }
    if (node.url.startsWith("//") || URL_SCHEME.test(node.url)) {
      return;
    }

    const line = node.position?.start.line ?? 1;
    const { pathname, fragment } = splitUrl(node.url);
    let targetPath = promptPath;
    if (pathname.length > 0) {
      const normalized = rootRelativePath(pathname);
      if (normalized === undefined) {
        diagnostics.push({
          line,
          message: `Prompt link '${node.url}' must use a repository-root-relative target without '..'.`,
        });
        return;
      }
      targetPath = normalized;
      if (!repositoryPaths.has(targetPath)) {
        diagnostics.push({
          line,
          message: `Prompt link '${node.url}' does not match a repository file.`,
        });
        return;
      }
    }

    if (fragment !== undefined && fragment.length > 0) {
      const targetMarkdown = repositoryMarkdown.get(targetPath);
      if (targetMarkdown === undefined) {
        diagnostics.push({
          line,
          message: `Prompt link '${node.url}' targets a heading in a non-Markdown file.`,
        });
        return;
      }
      if (!headingIds(targetMarkdown).has(fragment)) {
        diagnostics.push({
          line,
          message: `Prompt link '${node.url}' does not match a heading in '${targetPath}'.`,
        });
      }
    }
  });

  return diagnostics.sort(
    (left, right) =>
      left.line - right.line || left.message.localeCompare(right.message),
  );
}
