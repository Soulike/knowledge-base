# Audit and refactor Agent guidance

Use this procedure when selected by
[Model the artifact and select the path](../SKILL.md#model-the-artifact-and-select-the-path)
to audit, streamline, split, or refactor existing Skills, Agent instructions,
or Agent prompts.

## Inspect the full consumption graph

1. Read the complete target rather than isolated sections, together with every
   coupled artifact:
   - For **Skills**, inspect `SKILL.md`, all Skill-local and shared references,
     sub-agents or prompt manifests if present, and descriptions of sibling
     Skills that could compete on selection.
   - For **`AGENTS.md` / `CLAUDE.md` and prompts**, inspect the entire
     instruction chain from repository root to deepest working directory, all
     pointed-at references, and any observed routing misses or Agent failure
     reports.
2. Measure actual UTF-8 byte sizes (`wc -c` or equivalent) for every Skill
   entrypoint, referenced file, and cumulative `AGENTS.md` chain against
   [Client limits overview](../../../knowledge/agents/client-document-size-limits.md#client-limits-overview).
3. Establish whether the request is assessment-only (read-only findings) or an
   authorized revision within agreed findings.

## Diagnose defects in priority order

Evaluate the target across four axes—deletion first, then correctness, then
triggers and behavioral reliability, then size and disclosure:

1. **Delete stale sediment, no-ops, and redundant caches.**
   - Identify obsolete rules, edit-history patches, duplicated authority across
     files, and rules that merely restate information cheaply inspected from
     `package.json`, configs, directory layout, or CLI `--help` (retain cached
     facts only when an unwritten convention, gotcha, or high lookup cost
     justifies the context load).
   - Remove references no current step or pointer selects.
2. **Correct factual claims and authority boundaries.**
   - Verify every command, path, schema constraint, environment assumption, and
     precedence rule against its current workspace or runtime authority,
     classifying each as **Keep**, **Correct**, **Delete**, or **Unverified**
     per
     [Establish authority and evidence](../../../knowledge/documentation/maintained-document-quality.md#establish-authority-and-evidence).
3. **Diagnose triggers, hierarchy, and behavioral traps.**
   - Audit Skill descriptions, internal conditions, and context pointers against
     [Design selection triggers](../../../references/agents/selection-triggers.md)
     for vague `"when relevant"` phrasing, late-discovered conditions,
     false-positive overlap with adjacent Skills, and missed triggers on
     natural user requests.
   - Audit execution instructions against
     [Write Skill instructions](../../../references/agents/skill-authoring.md#write-skill-instructions)
     for unstated prerequisites, scattered conditions that force assembly across
     sections, consequential actions lacking observable postcondition checks,
     fuzzy completion gates that tempt premature skipping, and bare `"don't"`
     prohibitions that prime the unwanted behavior without a positive target.
4. **Resolve size pressure and split by responsibility.**
   - Flag any `SKILL.md` near or over `8,000` UTF-8 bytes, any reference near or
     over `20,480` UTF-8 bytes, and any `AGENTS.md` chain approaching
     `32,768` UTF-8 bytes.
   - Plan progressive disclosure or responsibility splits (by branch, sequence
     with distinct completion boundaries, or independent topic) rather than
     silently deleting edge cases, failure rules, or completion gates to fit.

## Plan structural refactoring and apply

1. State the structural judgment for the complete resulting bundle or
   instruction chain using
   [Keep revisions coherent](../../../knowledge/documentation/maintained-document-quality.md#keep-revisions-coherent)
   before editing.
2. Branch by task authority:
   - For **assessment-only** requests, stop and report every finding with
     evidence, UTF-8 byte measurements, trigger/behavioral diagnosis, proposed
     dispositions and splits, unresolved decisions, and validation limits at
     [Verify and complete](../SKILL.md#verify-and-complete).
   - For **authorized revisions**, resolve required project choices first, then
     apply deletions, corrections, trigger refinements, progressive disclosure,
     and splits coherently across the affected bundle/chain and reconcile every
     pointer, link, manifest, and consumer.
3. Return to [Verify and complete](../SKILL.md#verify-and-complete) to verify
   original-to-final preservation (no lost invariants or weakened edge cases),
   final byte sizes, composed suitability, warranted probes, and deterministic
   checks.
