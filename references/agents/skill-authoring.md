# Agent Skill authoring

## Scope

This reference supports workflow steps for writing and reviewing reusable Agent Skills that are portable, reliably invoked, structurally focused, and behaviorally correct.

## When to update

Update this document when a real authoring or review case exposes a missing rule for Skill portability, invocation, bundle structure, disclosure, or behavioral validation.

## Keep references portable

Refer to another Skill by its registered name rather than an installation path. Read shared packaged files directly unless the client explicitly guarantees Skill orchestration.

Resolve bundled resources relative to the current Skill. Discover project files and external authorities from the active working directory rather than embedding one source project's layout.

## Make invocation and disclosure complete

Put every distinct trigger branch in the frontmatter description. State the capability and task conditions there, and keep execution details in the body.

Define each trigger branch by the general task condition that makes the Skill
applicable. Add examples only when they distinguish an otherwise ambiguous
boundary, and introduce them after the complete condition so they cannot stand
in for it.

Write task-facing instructions in imperative form. Keep the primary workflow and completion criteria in the main file. Load branch-specific references only from the decisions that require them, and keep one authoritative copy of each rule.

## Design the Skill bundle by responsibility

Read the complete affected Skill bundle and the routes or consumers needed to
understand it before changing its structure. Treat the current files as
evidence of the existing design, not as a boundary the final design must
preserve. Organize the bundle by independently owned responsibility, retrieval
timing, consumers, and maintenance lifecycle rather than by edit history or the
operation that introduced the content.

Keep the invocation contract, primary workflow, decisions that select
supporting material, and completion criteria in `SKILL.md`. Keep information
needed by every execution path there as well. Move branch-only facts, criteria,
or procedures into a reference selected directly by the workflow step that
needs them. A separate Skill requires an independently invocable responsibility
with its own user outcome and completion state; do not replace progressive
disclosure with Skill-to-Skill orchestration.

After applying the active project's package-boundary rules, split a reference
when the resulting units have distinct selecting decisions, consumer sets,
responsibilities, or maintenance lifecycles. Merge references when those
properties coincide and separate files preserve only historical edits. Do not
use file length, step count, or reference count as an automatic split or merge
rule.

For every affected unit in the bundle, compare making no change, deleting,
rewriting, adding, merging, splitting, and moving the material. Complete this
comparison before adding content anywhere. Replace superseded workflow steps
and remove obsolete routes rather than retaining chronological layers. The
final bundle should expose one authoritative current workflow for each
invocation and should contain no orphaned reference or duplicated rule.

## Verify behavior, not only structure

Validate frontmatter, references, formatting, metadata, and every changed route
through the bundle. When static checks cannot establish invocation, selection,
decision, failure, or completion behavior, forward-test representative branches
in a fresh or isolated context without disclosing the intended answer or the
author's conclusions. Compare the original and final bundle so every semantic
change is intentional and every moved or retained responsibility remains
reachable at the right time.
