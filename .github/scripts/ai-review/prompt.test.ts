import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { fromMarkdown } from "mdast-util-from-markdown";

import type { Nodes } from "mdast";
import type { ReviewConfig } from "./config.ts";
import { renderReviewPrompt } from "./prompt.ts";

const workspace = fileURLToPath(new URL("../../..", import.meta.url));
const templateUrl = new URL("./prompts/review.md", import.meta.url);
const guidanceUrl = new URL("./prompts/skills.md", import.meta.url);

const config: ReviewConfig = {
  baseSha: "a".repeat(40),
  expectedHeadSha: "b".repeat(40),
  model: "auto",
  prNumber: 40,
  prUrl: "https://github.com/Soulike/knowledge-base/pull/40",
  reasoningEffort: "auto",
  repository: "Soulike/knowledge-base",
  runAttempt: 1,
  runId: 1234,
  toolingSha: "c".repeat(40),
  workspace,
};

function linkTargets(markdown: string): string[] {
  const targets: string[] = [];

  function visit(node: Nodes): void {
    if (node.type === "link") {
      targets.push(node.url);
    }
    if ("children" in node) {
      for (const child of node.children) {
        visit(child);
      }
    }
  }

  visit(fromMarkdown(markdown));
  return targets;
}

test("injects the repository-root guidance routes", async () => {
  const [template, guidance] = await Promise.all([
    readFile(templateUrl, "utf8"),
    readFile(guidanceUrl, "utf8"),
  ]);

  const prompt = renderReviewPrompt(template, guidance, config);

  assert.deepEqual(linkTargets(prompt), [
    "AGENTS.md",
    ".agents/skills/maintain-knowledge-base/SKILL.md",
    "knowledge/software-testing/test-effectiveness.md",
    "knowledge/software-testing/trustworthy-test-execution.md",
    "knowledge/software-testing/test-execution-cost.md",
  ]);
  assert.doesNotMatch(prompt, /\{\{[A-Z0-9_]+\}\}/u);
});

test("requires the trusted guidance placeholder", async () => {
  const template = await readFile(templateUrl, "utf8");

  assert.throws(
    () =>
      renderReviewPrompt(
        template.replace("{{TRUSTED_GUIDANCE}}", "Guidance omitted."),
        "[Instructions](AGENTS.md)\n",
        config,
      ),
    /missing \{\{TRUSTED_GUIDANCE\}\}/u,
  );
});
