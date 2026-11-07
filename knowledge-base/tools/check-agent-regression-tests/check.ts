import { execFileSync } from "node:child_process";
import { readFile, stat } from "node:fs/promises";
import { posix, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";
import type { RootContent, Root, Nodes } from "mdast";

const requiredSections = [
  "Identity",
  "Covered objects",
  "Protected behavior",
  "Task",
  "Starting state",
  "Expected behavior",
  "Verification",
  "Source",
] as const;

export interface CaseRecord {
  id: string;
  kind: "selection" | "application" | "journey";
  filePath: string;
  covers: string[];
}

export interface ParsedCase {
  record: CaseRecord | null;
  sections: Map<string, RootContent[]>;
  localReferences: string[];
  diagnostics: string[];
}

function visit(node: Nodes, action: (node: Nodes) => void): void {
  action(node);
  if ("children" in node) {
    for (const child of node.children) visit(child, action);
  }
}

function resolveLocalFile(filePath: string, url: string): string | null {
  if (/^[a-z][a-z0-9+.-]*:/iu.test(url)) return null;
  const pathname = url.split("#")[0] ?? "";
  if (pathname.length === 0) return filePath;
  const decoded = decodeURIComponent(pathname);
  if (posix.isAbsolute(decoded) || decoded.includes("\\")) {
    throw new Error(`Use a document-relative file link: ${url}`);
  }
  const target = posix.normalize(posix.join(posix.dirname(filePath), decoded));
  if (target === ".." || target.startsWith("../")) {
    throw new Error(`Referenced material must be in the repository: ${url}`);
  }
  return target;
}

export function caseEntrypoints(filePaths: readonly string[]): string[] {
  const candidates = [...new Set(filePaths)].filter((filePath) => {
    const parts = filePath.split("/");
    return parts.at(-1) === "case.md" && parts.at(-3) === "tests";
  });
  return candidates
    .filter(
      (filePath) =>
        !candidates.some(
          (other) =>
            other !== filePath &&
            filePath.startsWith(`${posix.dirname(other)}/`),
        ),
    )
    .sort();
}

export function parseCaseDocument(
  markdown: string,
  filePath: string,
): ParsedCase {
  const document = fromMarkdown(markdown);
  const diagnostics: string[] = [];
  const sections = new Map<string, RootContent[]>();
  const first = document.children[0];
  if (
    first?.type !== "heading" ||
    first.depth !== 1 ||
    !toString(first).trim()
  ) {
    diagnostics.push("Begin the case with a nonempty level-one title.");
  }
  let section: RootContent[] | undefined;
  for (const node of document.children.slice(1)) {
    if (node.type === "heading" && node.depth === 1) {
      diagnostics.push("A case must have only one level-one title.");
    }
    if (node.type === "heading" && node.depth === 2) {
      const name = toString(node);
      if (sections.has(name)) diagnostics.push(`Duplicate section: ${name}`);
      section = [];
      sections.set(name, section);
    } else if (section !== undefined) {
      section.push(node);
    }
  }
  for (const name of requiredSections) {
    if (
      !toString({ type: "root", children: sections.get(name) ?? [] }).trim()
    ) {
      diagnostics.push(`Missing or empty section: ${name}`);
    }
  }

  const identity = new Map<string, string>();
  const identityList = sections
    .get("Identity")
    ?.find((node) => node.type === "list");
  if (identityList?.type === "list") {
    for (const item of identityList.children) {
      const value = toString(item).trim();
      const separator = value.indexOf(":");
      const key = value.slice(0, separator).trim();
      if (separator < 0 || identity.has(key)) {
        diagnostics.push(`Invalid or duplicate identity field: ${value}`);
      } else {
        identity.set(key, value.slice(separator + 1).trim());
      }
    }
  }
  const id = identity.get("ID") ?? "";
  const kind = identity.get("Kind");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(id)) {
    diagnostics.push("Identity must declare a stable lowercase hyphenated ID.");
  }
  if (id !== posix.basename(posix.dirname(filePath))) {
    diagnostics.push("The case directory must match its declared ID.");
  }
  if (kind !== "selection" && kind !== "application" && kind !== "journey") {
    diagnostics.push("Kind must be selection, application, or journey.");
  }

  const definitions = new Map<string, string>();
  visit(document, (node) => {
    if (node.type === "definition" && !definitions.has(node.identifier)) {
      definitions.set(node.identifier, node.url);
    }
  });
  const covers: string[] = [];
  const localReferences: string[] = [];
  const collect = (root: Root, covered: boolean): void => {
    visit(root, (node) => {
      if (
        node.type !== "link" &&
        node.type !== "linkReference" &&
        node.type !== "image" &&
        node.type !== "imageReference"
      )
        return;
      const url = "url" in node ? node.url : definitions.get(node.identifier);
      if (url === undefined) {
        diagnostics.push(
          "An unresolved reference-style link cannot identify material.",
        );
        return;
      }
      try {
        const target = resolveLocalFile(filePath, url);
        if (
          covered &&
          (target === null || url.includes("#") || url.includes("?") || !url)
        ) {
          throw new Error(
            `Covered objects must use local file links without fragments: ${url}`,
          );
        }
        if (target !== null) {
          localReferences.push(target);
          if (
            covered &&
            (node.type === "link" || node.type === "linkReference")
          )
            covers.push(target);
        }
      } catch (error) {
        diagnostics.push(
          error instanceof Error ? error.message : String(error),
        );
      }
    });
  };
  collect(document, false);
  collect(
    { type: "root", children: sections.get("Covered objects") ?? [] },
    true,
  );
  if (covers.length === 0)
    diagnostics.push("Declare covered objects with file links.");
  if (new Set(covers).size !== covers.length)
    diagnostics.push("Do not duplicate covered objects.");
  let commonDirectory = covers[0] === undefined ? "" : posix.dirname(covers[0]);
  for (const covered of covers.slice(1)) {
    const directory = posix.dirname(covered);
    while (
      commonDirectory !== "." &&
      directory !== commonDirectory &&
      !directory.startsWith(`${commonDirectory}/`)
    ) {
      commonDirectory = posix.dirname(commonDirectory);
    }
  }
  const expectedDirectory = posix.join(commonDirectory, "tests", id);
  if (covers.length > 0 && posix.dirname(filePath) !== expectedDirectory) {
    diagnostics.push(
      `Place this case in its nearest common directory: ${expectedDirectory}/case.md`,
    );
  }
  return {
    record:
      diagnostics.length === 0 &&
      (kind === "selection" || kind === "application" || kind === "journey")
        ? { id, kind, filePath, covers }
        : null,
    sections,
    localReferences: [...new Set(localReferences)],
    diagnostics,
  };
}

export async function checkCases(
  repositoryRoot: string,
  filePaths: readonly string[],
): Promise<{ cases: CaseRecord[]; diagnostics: string[] }> {
  const cases: CaseRecord[] = [];
  const diagnostics: string[] = [];
  const ids = new Map<string, string>();
  for (const filePath of caseEntrypoints(filePaths)) {
    try {
      const parsed = parseCaseDocument(
        await readFile(resolve(repositoryRoot, filePath), "utf8"),
        filePath,
      );
      diagnostics.push(
        ...parsed.diagnostics.map((message) => `${filePath}: ${message}`),
      );
      const record = parsed.record;
      if (record !== null) {
        const existing = ids.get(record.id);
        if (existing !== undefined)
          diagnostics.push(
            `${filePath}: ID '${record.id}' also belongs to ${existing}`,
          );
        ids.set(record.id, filePath);
        cases.push(record);
      }
      for (const referenced of parsed.localReferences) {
        try {
          if (!(await stat(resolve(repositoryRoot, referenced))).isFile())
            throw new Error("not a file");
        } catch {
          diagnostics.push(
            `${filePath}: Referenced file is missing or not a file: ${referenced}`,
          );
        }
      }
    } catch (error) {
      diagnostics.push(
        `${filePath}: Cannot read case: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  return { cases, diagnostics };
}

export async function runCheck(
  repositoryRoot: string,
  json: boolean,
): Promise<number> {
  try {
    const files = execFileSync(
      "git",
      ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
      { cwd: repositoryRoot, encoding: "utf8" },
    )
      .split("\0")
      .filter(Boolean);
    const result = await checkCases(repositoryRoot, files);
    if (result.diagnostics.length > 0) {
      console.error(result.diagnostics.join("\n"));
      return 1;
    }
    console.log(
      json
        ? JSON.stringify(result.cases, null, 2)
        : `Checked ${result.cases.length} behavioral regression cases.`,
    );
    return 0;
  } catch (error) {
    console.error(
      `Cannot discover regression cases: ${error instanceof Error ? error.message : String(error)}`,
    );
    return 1;
  }
}

if (
  process.argv[1] !== undefined &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const directories = args.filter((argument) => argument !== "--json");
  if (directories.length !== 1) {
    console.error("Usage: node check.ts <repository-root> [--json]");
    process.exitCode = 2;
  } else {
    process.exitCode = await runCheck(resolve(directories[0] ?? "."), json);
  }
}
