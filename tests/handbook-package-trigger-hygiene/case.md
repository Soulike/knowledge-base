# Keep Handbook package conditions semantic and orthogonal

## Identity

- ID: handbook-package-trigger-hygiene
- Kind: application

## Covered objects

- [Content-maintenance Skill](../../.agents/skills/maintain-knowledge-base/SKILL.md)
- [Skill-maintenance workflow](../../.agents/skills/maintain-knowledge-base/references/maintain-skill.md)
- [Selection-trigger reference](../../knowledge-base/plugins/knowledge-base/references/agents/selection-triggers.md)

## Protected behavior

Handbook maintenance and review must reject conditional package triggers that
degenerate into grab-bag lists of fields, directories, or subtopics, as well as
redundant multi-leaf bundles patched with `"except when..."` carve-outs where
independent cumulative packages already compose orthogonal Knowledge cleanly.
Keep general anti-enumeration and cumulative composition rules domain-model-neutral
inside the shared selection-trigger reference while enforcing Handbook-package
hygiene from the repository-maintenance workflow, tolerating different valid
semantic wording and genuine prerequisite bundles.

## Task

Review the draft Handbook below and propose the concrete repairs needed for its
conditional required-reading packages without altering its top-level
`description`, adding new Knowledge leaves, or editing any files:

```markdown
---
name: handbook-service-rpc
description: Use when designing, implementing, reviewing, diagnosing, or understanding RPC service interfaces and protocol servers.
---

# Service RPC handbook

This Handbook routes curated RPC engineering guidance. Coverage is
non-exhaustive; if no package matches, continue without reading unrelated
material.

## Select required reading

Evaluate every condition cumulatively; do not pick only the closest match.

## Conditional required-reading packages

### Client-facing RPC interfaces

When designing, implementing, reviewing, evaluating, or diagnosing RPC
interfaces—including endpoint boundaries, method names, parameter schemas,
returned payloads, pagination budgets, or caller-facing error messages—read
`../../knowledge/rpc/interface-design.md` in full.

### Binary wire protocol contracts

When defining, implementing, reviewing, or explaining binary wire contracts,
framing headers, `metadataHints`, `payloadSchema`, `envelopeFormat`, session
handles, or `appError` versus transport errors, read both of these files:

- `../../knowledge/rpc/interface-design.md`
- `../../knowledge/rpc/wire-contracts.md`

When a focused explanation concerns only wire headers or error envelopes
without interface ergonomics, reading `../../knowledge/rpc/wire-contracts.md`
alone is sufficient.

### Server runtime architecture and testing

When structuring, implementing, reviewing, diagnosing, or testing a server's
entry point, transport wiring (`stdio` or HTTP), factory lifecycle, directory
layers (separating startup, `clients/`, `handlers/`, and `presenters/`), or
in-process `InMemoryTransport` tests, read
`../../knowledge/rpc/server-architecture.md` in full.

### Streaming RPC debugging

When debugging bidirectional streaming RPC frames (which builds directly on the
binary wire protocol rules as a prerequisite), read both of these files:

- `../../knowledge/rpc/wire-contracts.md`
- `../../knowledge/rpc/streaming-debugging.md`
```

Explain which rules govern your diagnosis, state the exact defects, identify
which existing multi-leaf bundle (if any) remains justified as a genuine
prerequisite, provide the repaired `## Conditional required-reading packages`
section, and verify that all existing tasks (interface-only, wire-only,
streaming-debugging, architecture-only, full server, and no-match) remain
covered. Do not modify repository files.

## Starting state

Supply the complete current
[Content-maintenance Skill](../../.agents/skills/maintain-knowledge-base/SKILL.md),
[Skill-maintenance workflow](../../.agents/skills/maintain-knowledge-base/references/maintain-skill.md),
[Selection-trigger reference](../../knowledge-base/plugins/knowledge-base/references/agents/selection-triggers.md),
and [Product authoring rules](../../knowledge-base/AGENTS.md) as read-only
guidance, without exposing the live repository's `handbook-agents` Skill or
any `tests/` case definitions.

## Expected behavior

- R1 (critical): identify both trigger defects in the draft Handbook under
  [Write the condition](../../knowledge-base/plugins/knowledge-base/references/agents/selection-triggers.md#write-the-condition)
  and
  [Handbook and Workflow selection triggers](../../.agents/skills/maintain-knowledge-base/references/maintain-skill.md#handbook-and-workflow-selection-triggers):
  (a) grab-bag enumerations of fields, directories, and subtopics substituting
  for semantic applicability boundaries across all three packages, and (b)
  redundant bundling of `interface-design.md` inside the wire-protocol package
  paired with an `"except when..."` carve-out when independent cumulative
  matching already composes both leaves cleanly.
- R2 (critical): rewrite the first three conditional packages into clean,
  orthogonal semantic conditions that omit grab-bag field/directory/mechanism
  lists (while still allowing brief semantic scope distinctions where genuinely
  needed) and eliminate both the duplicated `interface-design.md` link and its
  `"except when..."` patch from Package 2, while preserving Package 4's
  genuine prerequisite bundle (`wire-contracts.md` + `streaming-debugging.md`).
- R3 (critical): keep domain-model neutrality intact by attributing the general
  internal-condition, anti-enumeration, and cumulative-composition rules to
  [selection-triggers.md](../../knowledge-base/plugins/knowledge-base/references/agents/selection-triggers.md)
  and the Handbook-package enforcement to
  [maintain-skill.md](../../.agents/skills/maintain-knowledge-base/references/maintain-skill.md)
  (and [knowledge-base/AGENTS.md](../../knowledge-base/AGENTS.md)), without
  proposing to embed Handbook/Knowledge taxonomy into `selection-triggers.md`.
- R4: preserve cumulative matching (end-to-end RPC server work still selects
  all three core leaves, interface-only selects only `interface-design.md`,
  wire-only selects only `wire-contracts.md`, streaming-debugging selects both
  `wire-contracts.md` and `streaming-debugging.md`, architecture/testing-only
  selects only `server-architecture.md`, and unrelated RPC topics match none)
  without modifying repository files.

## Verification

Inspect files read and the returned diagnosis, repaired Markdown, and coverage
matrix separately.

A controlled faulty response that leaves any enumerated field/directory grab-bag
list in place, keeps `interface-design.md` duplicated with an `"except when..."`
exception in Package 2, breaks focused wire-only or architecture-only single-leaf
routing, strips the genuine prerequisite `wire-contracts.md` link from Package 4,
or claims `selection-triggers.md` owns Handbook taxonomy must fail the
corresponding critical criterion.

## Source

Newly authored protection derived from #296/#297 review feedback where
Handbook conditional package conditions accumulated field/directory grab-bag
lists and an orthogonal bundle-plus-carve-out patch despite general
anti-enumeration principles in
[selection-triggers.md](../../knowledge-base/plugins/knowledge-base/references/agents/selection-triggers.md);
requires fresh validation against the updated guidance.
