import { fromMarkdown } from "mdast-util-from-markdown";
import { gfmTableFromMarkdown } from "mdast-util-gfm-table";
import { toString } from "mdast-util-to-string";
import { gfmTable } from "micromark-extension-gfm-table";
import type { Heading, Link, RootContent, Table, TableCell } from "mdast";

const expectedColumns = ["File Path", "Knowledge Type", "When to Read"];
const knowledgeTypes = ["time-sensitive", "evergreen"] as const;

export type KnowledgeType = (typeof knowledgeTypes)[number];

export interface KnowledgeIndexEntry {
  filePath: string;
  knowledgeType: KnowledgeType;
  whenToRead: string;
}

export interface KnowledgeIndexInspection {
  entries: KnowledgeIndexEntry[];
  diagnostics: string[];
}

function isHeading(
  node: RootContent | undefined,
  depth: Heading["depth"],
  value: string,
): node is Heading {
  return (
    node?.type === "heading" && node.depth === depth && toString(node) === value
  );
}

function isTable(node: RootContent | undefined): node is Table {
  return node?.type === "table";
}

function onlyLink(cell: TableCell | undefined): Link | undefined {
  if (cell?.children.length !== 1) {
    return undefined;
  }

  const child = cell.children[0];
  return child?.type === "link" ? child : undefined;
}

function isKnowledgeType(value: string): value is KnowledgeType {
  return knowledgeTypes.some((knowledgeType) => knowledgeType === value);
}

export function inspectKnowledgeIndex(
  markdown: string,
  leafFilePaths: string[],
): KnowledgeIndexInspection {
  const document = fromMarkdown(markdown, {
    extensions: [gfmTable()],
    mdastExtensions: [gfmTableFromMarkdown()],
  });
  const documentsHeadingIndex = document.children.findIndex((node) =>
    isHeading(node, 2, "Documents"),
  );
  const diagnostics: string[] = [];
  const entries: KnowledgeIndexEntry[] = [];

  if (documentsHeadingIndex === -1) {
    return {
      entries,
      diagnostics: ["The index must contain a '## Documents' section."],
    };
  }

  const table = document.children[documentsHeadingIndex + 1];

  if (!isTable(table)) {
    return {
      entries,
      diagnostics: [
        "The Documents section must contain a GFM table immediately after its heading.",
      ],
    };
  }

  const header = table.children[0];
  const headerCells = header?.children.map((cell) => toString(cell));

  if (
    headerCells === undefined ||
    headerCells.length !== expectedColumns.length ||
    headerCells.some((column, index) => column !== expectedColumns[index])
  ) {
    return {
      entries,
      diagnostics: [
        "The Documents table must have the columns 'File Path', 'Knowledge Type', and 'When to Read' in that order.",
      ],
    };
  }

  const indexedPathCounts = new Map<string, number>();

  for (const row of table.children.slice(1)) {
    const cells = row.children;
    const lineNumber = row.position?.start.line;
    const location =
      lineNumber === undefined
        ? "A Documents table row"
        : `Documents table line ${lineNumber}`;

    if (cells.length !== expectedColumns.length) {
      diagnostics.push(`${location} must contain exactly three columns.`);
      continue;
    }

    const [filePathCell, knowledgeTypeCell, whenToReadCell] = cells;
    const filePathLink = onlyLink(filePathCell);

    if (filePathLink === undefined) {
      diagnostics.push(
        `${location} must link a repository-root-relative 'knowledge/...' path to its knowledge-relative target.`,
      );
      continue;
    }

    const targetPath = filePathLink.url;

    if (toString(filePathLink) !== `knowledge/${targetPath}`) {
      diagnostics.push(
        `${location} link text and target must identify the same Knowledge document.`,
      );
    }

    if (
      targetPath.length === 0 ||
      targetPath.startsWith("/") ||
      targetPath
        .split("/")
        .some((segment) => segment === "." || segment === "..") ||
      !targetPath.endsWith(".md")
    ) {
      diagnostics.push(
        `${location} must target a knowledge-relative Markdown leaf path.`,
      );
      continue;
    }

    indexedPathCounts.set(
      targetPath,
      (indexedPathCounts.get(targetPath) ?? 0) + 1,
    );

    const knowledgeType = toString(knowledgeTypeCell);

    if (!isKnowledgeType(knowledgeType)) {
      diagnostics.push(
        `Knowledge Type for 'knowledge/${targetPath}' must be 'time-sensitive' or 'evergreen'.`,
      );
      continue;
    }

    entries.push({
      filePath: targetPath,
      knowledgeType,
      whenToRead: toString(whenToReadCell),
    });
  }

  const leafPathSet = new Set(leafFilePaths);

  for (const [filePath, count] of indexedPathCounts) {
    if (count > 1) {
      diagnostics.push(
        `Knowledge document 'knowledge/${filePath}' must be listed exactly once, but it appears ${count} times.`,
      );
    }

    if (!leafPathSet.has(filePath)) {
      diagnostics.push(
        `The index lists 'knowledge/${filePath}', but that leaf document does not exist.`,
      );
    }
  }

  for (const leafFilePath of leafFilePaths) {
    if (!indexedPathCounts.has(leafFilePath)) {
      diagnostics.push(
        `Knowledge leaf 'knowledge/${leafFilePath}' must be listed exactly once in the index.`,
      );
    }
  }

  return { entries, diagnostics };
}
