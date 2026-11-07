import assert from "node:assert/strict";
import { log } from "node:console";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import process from "node:process";
import { pathToFileURL, URL } from "node:url";

const requireParser = createRequire(
  new URL(
    "../../../knowledge-base/tools/check-agent-regression-tests/package.json",
    import.meta.url,
  ),
);
const { fromMarkdown } = await import(
  pathToFileURL(requireParser.resolve("mdast-util-from-markdown")).href
);
const [resultPath, guidancePath] = process.argv.slice(2);
assert.ok(
  resultPath && guidancePath,
  "Pass the result file and current replay reference.",
);
const result = JSON.parse(await readFile(resultPath, "utf8"));
const inputs = JSON.parse(
  await readFile(new URL("fixtures/inputs.json", import.meta.url), "utf8"),
);
const document = fromMarkdown(await readFile(guidancePath, "utf8"));
const heading = document.children.findIndex(
  (node) =>
    node.type === "heading" &&
    node.depth === 3 &&
    node.children.length === 1 &&
    node.children[0].type === "text" &&
    node.children[0].value === "Executor instructions",
);
assert.ok(heading >= 0, "The current guard section must exist.");
const remaining = document.children.slice(heading + 1);
const end = remaining.findIndex(
  (node) => node.type === "heading" && node.depth <= 3,
);
const guard = (end < 0 ? remaining : remaining.slice(0, end)).find(
  (node) => node.type === "code" && node.lang === "text",
);
assert.ok(guard?.value, "The current guard must contain prompt instructions.");
const normalized = (value) => value.trim().split(/\s+/u).join(" ");
const dispatches = Array.isArray(result.dispatches)
  ? result.dispatches
  : Object.entries(result.dispatches).map(([key, args]) => ({
      key,
      arguments: args,
    }));
assert.equal(dispatches.length, inputs.items.length);
for (const item of inputs.items) {
  const matches = dispatches.filter((entry) => entry.key === item.key);
  assert.equal(matches.length, 1, `Exactly one dispatch for ${item.key}.`);
  const args = matches[0].arguments;
  assert.equal(
    args.model,
    inputs.worker_model,
    "R1: model must be a dispatcher argument.",
  );
  assert.equal(
    args.fork_turns,
    inputs.worker_history,
    "R1: exclude parent history with the actual argument.",
  );
  assert.equal(typeof args.task_name, "string");
  assert.ok(
    normalized(args.message).includes(normalized(guard.value)),
    "R2: expand the full canonical guard.",
  );
  assert.ok(
    args.message.includes(item.task),
    "R3: preserve the assigned task.",
  );
  for (const data of inputs.items) {
    for (const marker of [
      data.expected_behavior,
      data.protected_behavior,
      data.source,
      ...data.covered_objects,
    ]) {
      assert.ok(
        !args.message.includes(marker),
        "R3: evaluator-only material leaked to a worker.",
      );
    }
  }
}
assert.ok(result.reviewer_input, "Provide reviewer inputs separately.");
log(
  "Passed dispatch argument, guard, task, and evaluator-boundary assertions; semantic criteria still require independent review.",
);
