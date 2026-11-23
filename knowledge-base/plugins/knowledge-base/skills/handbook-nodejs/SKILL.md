---
name: handbook-nodejs
description: Use when developing, maintaining, reviewing, configuring, diagnosing, or understanding Node.js runtime or npm package-manager behavior.
---

# Node.js handbook

This domain Handbook routes the curated Node.js runtime and npm package-manager
guidance currently available in this plugin. Its coverage is intentionally
non-exhaustive. It owns required-reading selection, not the procedure or
completion of the user's task. Resolve every packaged link relative to this
`SKILL.md`, and apply selected Knowledge as supplemental guidance under the
instructions, requirements, Skills, and project-specific decisions in the active
working directory.

## Select required reading

This Handbook currently has no common foundation. Evaluate every condition
below from the observable work, artifacts, and requested result. Every
matching package is required and cumulative; do not choose only the closest
match. A direct learning or explanation request about a package's subject
matches that package directly.

If no current package matches, the Handbook's reading selection is validly
complete with no package to read. Continue the task without applying unrelated
narrow material, inventing guidance, or implying that this Handbook documents
all of Node.js or npm. Do not copy or infer rules in place of reading the
linked canonical material.

## Conditional required-reading packages

### npm clean installation

When using the npm CLI for lockfile-driven clean installation or cache
optimization, or directly learning or explaining that subject, read
[npm clean-install cache reuse](../../knowledge/npm/clean-install-cache.md) in
full.

### Node.js asynchronous and synchronous filesystem APIs

When designing, implementing, reviewing, or diagnosing Node.js code that
performs any filesystem operation (whether single-step or multi-step), or when
directly learning or explaining when to choose `node:fs/promises` versus
synchronous `*Sync` APIs, read
[Asynchronous Node.js filesystem APIs](../../knowledge/nodejs/asynchronous-filesystem-apis.md)
in full.

### Multi-step Node.js filesystem operations

When designing, implementing, reviewing, or directly learning about a
multi-step Node.js filesystem operation or Node.js `FileHandle` identity and
open-flag primitives, read
[Node.js filesystem identity primitives](../../knowledge/nodejs/filesystem-identity-primitives.md)
in full. General filesystem and pathname-identity semantics live in their own
domain rather than in this Handbook, so evaluate general filesystem guidance
separately when filesystem work is present without treating this Handbook as a
substitute for it.
