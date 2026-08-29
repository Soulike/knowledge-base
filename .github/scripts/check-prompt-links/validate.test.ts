import assert from "node:assert/strict";
import test from "node:test";

import { validatePromptLinks } from "./validate.ts";

const promptPath = ".github/scripts/example/prompts/review.md";

test("accepts repository-root files and headings", () => {
  const markdown = `Read [instructions](AGENTS.md),
[the scope](docs/guide.md#scope), [the API](docs/guide.md#api-guide),
[the status](docs/guide.md#-status), and [this section](#review).

## Review
`;
  const repositoryMarkdown = new Map([
    [promptPath, markdown],
    ["AGENTS.md", "# Instructions\n"],
    [
      "docs/guide.md",
      "# Guide\n\n## Scope\n\n## <span>API</span> Guide\n\n## ![Badge](badge.svg) Status\n",
    ],
  ]);

  assert.deepEqual(
    validatePromptLinks(
      promptPath,
      markdown,
      new Set(repositoryMarkdown.keys()),
      repositoryMarkdown,
    ),
    [],
  );
});

test("reports document-relative, missing, and invalid heading targets", () => {
  const markdown = `Read [outside](../../../../AGENTS.md),
[missing](missing.md), and [wrong heading](docs/guide.md#missing).
`;
  const repositoryMarkdown = new Map([
    [promptPath, markdown],
    ["AGENTS.md", "# Instructions\n"],
    ["docs/guide.md", "# Guide\n\n## Scope\n"],
  ]);

  assert.deepEqual(
    validatePromptLinks(
      promptPath,
      markdown,
      new Set(repositoryMarkdown.keys()),
      repositoryMarkdown,
    ),
    [
      {
        line: 1,
        message:
          "Prompt link '../../../../AGENTS.md' must use a repository-root-relative target without '..'.",
      },
      {
        line: 2,
        message:
          "Prompt link 'docs/guide.md#missing' does not match a heading in 'docs/guide.md'.",
      },
      {
        line: 2,
        message: "Prompt link 'missing.md' does not match a repository file.",
      },
    ],
  );
});

test("ignores external URLs", () => {
  const markdown = "Read [the specification](https://example.com/spec).\n";

  assert.deepEqual(
    validatePromptLinks(
      promptPath,
      markdown,
      new Set([promptPath]),
      new Map([[promptPath, markdown]]),
    ),
    [],
  );
});

test("rejects repository files written only as inline code", () => {
  const markdown = "Read `AGENTS.md` before reviewing.\n";

  assert.deepEqual(
    validatePromptLinks(
      promptPath,
      markdown,
      new Set([promptPath, "AGENTS.md"]),
      new Map([
        [promptPath, markdown],
        ["AGENTS.md", "# Instructions\n"],
      ]),
    ),
    [
      {
        line: 1,
        message:
          "Repository file 'AGENTS.md' must be a Markdown link in prompt prose.",
      },
    ],
  );
});
