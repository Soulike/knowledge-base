import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";
import type { Heading, RootContent } from "mdast";

function isHeading(
  node: RootContent | undefined,
  depth: Heading["depth"],
): node is Heading {
  return node?.type === "heading" && node.depth === depth;
}

export function validateKnowledgeDocument(markdown: string): string[] {
  const document = fromMarkdown(markdown);
  const title = document.children[0];

  if (!isHeading(title, 1) || toString(title).trim() === "") {
    return ["The document must begin with a level-one title."];
  }

  const firstSection = document.children[1];

  if (!isHeading(firstSection, 2) || toString(firstSection) !== "Scope") {
    return ["The first section after the title must be '## Scope'."];
  }

  const secondSectionIndex = document.children.findIndex(
    (node, index) => index > 1 && isHeading(node, 2),
  );
  const secondSection = document.children[secondSectionIndex];

  if (!secondSection || toString(secondSection) !== "When to update") {
    return ["The second section must be '## When to update'."];
  }

  const scopeContent = document.children.slice(2, secondSectionIndex);

  if (scopeContent.length !== 1 || scopeContent[0]?.type !== "paragraph") {
    return ["The '## Scope' section must contain exactly one prose paragraph."];
  }

  const nextSectionIndex = document.children.findIndex(
    (node, index) => index > secondSectionIndex && isHeading(node, 2),
  );
  const whenToUpdateContent = document.children.slice(
    secondSectionIndex + 1,
    nextSectionIndex === -1 ? undefined : nextSectionIndex,
  );

  if (
    whenToUpdateContent.length !== 1 ||
    whenToUpdateContent[0]?.type !== "paragraph"
  ) {
    return [
      "The '## When to update' section must contain exactly one prose paragraph.",
    ];
  }

  return [];
}
