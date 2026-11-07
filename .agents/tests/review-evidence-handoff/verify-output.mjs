import assert from "node:assert/strict";
import { log } from "node:console";
import { readFile } from "node:fs/promises";
import process from "node:process";
import { URL } from "node:url";

const [resultPath] = process.argv.slice(2);
assert.ok(resultPath, "Pass the actual result file.");
const result = JSON.parse(await readFile(resultPath, "utf8"));
const input = JSON.parse(
  await readFile(
    new URL("fixtures/observations.json", import.meta.url),
    "utf8",
  ),
);
assert.equal(
  result.case_statuses.beta,
  "incomplete",
  "R1: beta lacks required evidence.",
);
assert.equal(
  result.maintenance_status,
  "incomplete",
  "R1: do not complete maintenance yet.",
);
const expected = input.cases.flatMap((entry) => entry.attempts);
assert.equal(
  result.attempts.length,
  expected.length,
  "R2: retain all attempts.",
);
const retained = result.attempts.map((entry) => entry.record ?? entry);
for (const attempt of expected) {
  const matches = retained.filter((actual) => actual.id === attempt.id);
  assert.equal(matches.length, 1, "R2: retain each supplied attempt once.");
  for (const [key, value] of Object.entries(attempt)) {
    assert.deepEqual(
      matches[0][key],
      value,
      "R2: preserve the supplied record fields.",
    );
  }
}
assert.equal(result.reviewer.id, input.reviewer, "R4: use the same reviewer.");
assert.ok(result.reviewer.input, "R4: provide the reviewer handoff.");
assert.ok(Array.isArray(result.next_actions));
log(
  "Passed incomplete-state, attempt-retention, and reviewer-identity assertions; action and handoff semantics still require independent review.",
);
