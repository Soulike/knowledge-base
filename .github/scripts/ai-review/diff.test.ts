import assert from "node:assert/strict";
import test from "node:test";

import { parseChangedLines } from "./diff.ts";

test("maps added and removed lines from zero-context unified diff", () => {
  const changed = parseChangedLines(`diff --git a/example.md b/example.md
index 1111111..2222222 100644
--- a/example.md
+++ b/example.md
@@ -2,2 +2,3 @@
-old two
-old three
+new two
+new three
+new four
@@ -9 +10 @@
-old ten
+new eleven
`);

  assert.deepEqual([...changed.left], [2, 3, 9]);
  assert.deepEqual([...changed.right], [2, 3, 4, 10]);
});

test("tracks context when a diff unexpectedly contains it", () => {
  const changed = parseChangedLines(`@@ -4,3 +4,3 @@
 unchanged
-before
+after
 unchanged
`);

  assert.deepEqual([...changed.left], [5]);
  assert.deepEqual([...changed.right], [5]);
});

test("does not treat diff headers as changed lines", () => {
  const changed = parseChangedLines(`--- a/README.md
+++ b/README.md
`);

  assert.deepEqual([...changed.left], []);
  assert.deepEqual([...changed.right], []);
});

test("counts changed content that begins like a diff header", () => {
  const changed = parseChangedLines(`@@ -7 +7 @@
---removed heading
+++added heading
`);

  assert.deepEqual([...changed.left], [7]);
  assert.deepEqual([...changed.right], [7]);
});
