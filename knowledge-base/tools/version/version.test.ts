import assert from "node:assert/strict";
import test from "node:test";

import {
  nextPluginVersion,
  parsePluginVersion,
  releaseDateForTimestamp,
} from "./version.ts";

test("parses canonical plugin versions", () => {
  assert.deepEqual(parsePluginVersion("2026.8.15-2"), {
    date: "2026.8.15",
    sequence: 2,
  });
});

test("rejects noncanonical or impossible plugin versions", () => {
  assert.equal(parsePluginVersion("2026.08.15-1"), undefined);
  assert.equal(parsePluginVersion("2026.2.29-1"), undefined);
  assert.equal(parsePluginVersion("2026.8.15-0"), undefined);
});

test("increments once from the PR base on the same day", () => {
  assert.equal(nextPluginVersion("2026.8.15-3", "2026.8.15"), "2026.8.15-4");
  assert.equal(nextPluginVersion("2026.8.15-3", "2026.8.15"), "2026.8.15-4");
});

test("starts at one for a later date or a legacy base version", () => {
  assert.equal(nextPluginVersion("2026.8.15-3", "2026.8.18"), "2026.8.18-1");
  assert.equal(nextPluginVersion("0.1.0", "2026.8.18"), "2026.8.18-1");
});

test("rejects a release date older than the base version", () => {
  assert.throws(
    () => nextPluginVersion("2026.8.15-3", "2026.8.12"),
    /predates base version/u,
  );
});

test("derives dates at the Asia/Shanghai boundary", () => {
  assert.equal(
    releaseDateForTimestamp("2026-08-14T15:59:59.000Z"),
    "2026.8.14",
  );
  assert.equal(
    releaseDateForTimestamp("2026-08-14T16:00:00.000Z"),
    "2026.8.15",
  );
});
