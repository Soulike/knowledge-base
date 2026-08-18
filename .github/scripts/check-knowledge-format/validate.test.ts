import assert from "node:assert/strict";
import test from "node:test";

import { validateKnowledgeDocument } from "./validate.ts";

test("rejects a document that does not begin with a title", () => {
  const markdown = `Introductory prose.

# Authentication

## Scope

This document defines the authentication guarantees shared by every client.

## When to update

Update this document when an authentication guarantee or supported client changes.
`;

  assert.deepEqual(validateKnowledgeDocument(markdown), [
    "The document must begin with a level-one title.",
  ]);
});

test("accepts a knowledge document with the required preface", () => {
  const markdown = `# Authentication

## Scope

This document defines the authentication guarantees shared by every client.

## When to update

Update this document when an authentication guarantee or supported client changes.

## Details

Knowledge content.
`;

  assert.deepEqual(validateKnowledgeDocument(markdown), []);
});

test("rejects a knowledge document without a Scope section", () => {
  const markdown = `# Authentication

## When to update

Update this document when an authentication guarantee changes.
`;

  assert.deepEqual(validateKnowledgeDocument(markdown), [
    "The first section after the title must be '## Scope'.",
  ]);
});

test("rejects a knowledge document without a When to update section", () => {
  const markdown = `# Authentication

## Scope

This document defines the authentication guarantees shared by every client.

## Details

Knowledge content.
`;

  assert.deepEqual(validateKnowledgeDocument(markdown), [
    "The second section must be '## When to update'.",
  ]);
});

test("rejects a Scope section that is only an enumeration", () => {
  const markdown = `# Authentication

## Scope

- Authentication guarantees
- Supported clients

## When to update

Update this document when an authentication guarantee or supported client changes.
`;

  assert.deepEqual(validateKnowledgeDocument(markdown), [
    "The '## Scope' section must contain exactly one prose paragraph.",
  ]);
});

test("rejects a When to update section that is only an enumeration", () => {
  const markdown = `# Authentication

## Scope

This document defines the authentication guarantees shared by every client.

## When to update

- Authentication changes
- Client changes

## Details

Knowledge content.
`;

  assert.deepEqual(validateKnowledgeDocument(markdown), [
    "The '## When to update' section must contain exactly one prose paragraph.",
  ]);
});

for (const heading of ["Related Knowledge", "See also"]) {
  test(`rejects a ${heading} routing appendix`, () => {
    const markdown = `# Authentication

## Scope

This document defines the authentication guarantees shared by every client.

## When to update

Update this document when an authentication guarantee or supported client changes.

## ${heading}

- [Authorization](authorization.md)
`;

    assert.deepEqual(validateKnowledgeDocument(markdown), [
      "Knowledge documents must not contain 'Related Knowledge' or 'See also' routing sections; keep routing in 'knowledge/index.md' and necessary links inline.",
    ]);
  });
}
