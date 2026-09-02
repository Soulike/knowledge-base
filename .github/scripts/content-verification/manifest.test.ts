import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildVerificationManifest } from "./manifest.ts";

const index = `# Knowledge index

## Documents

| File Path | Knowledge Type | When to Read |
| --- | --- | --- |
| [knowledge/a.md](a.md) | time-sensitive | Read when checking A. |
| [knowledge/b.md](b.md) | evergreen | Read when checking B. |
`;

describe("buildVerificationManifest", () => {
  it("derives a stable time-sensitive manifest from the parsed index and tracked files", () => {
    const revision = "a".repeat(40);

    assert.deepEqual(
      buildVerificationManifest(
        "time-sensitive-knowledge",
        revision,
        ["knowledge/b.md", "knowledge/a.md", "knowledge/index.md"],
        index,
      ),
      {
        revision,
        scope: "time-sensitive-knowledge",
        targets: [
          {
            files: ["knowledge/a.md"],
            id: "knowledge/a.md",
            kind: "knowledge",
          },
        ],
      },
    );
  });

  it("rejects a mutable revision instead of publishing an ambiguous manifest", () => {
    assert.throws(
      () =>
        buildVerificationManifest(
          "time-sensitive-knowledge",
          "main",
          ["knowledge/index.md", "knowledge/a.md", "knowledge/b.md"],
          index,
        ),
      /lowercase 40-character Git SHA/u,
    );
  });
});
