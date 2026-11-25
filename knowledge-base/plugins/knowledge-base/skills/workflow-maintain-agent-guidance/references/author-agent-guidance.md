# Author or update Agent guidance

Use this procedure when selected by
[Model the artifact and select the path](../SKILL.md#model-the-artifact-and-select-the-path)
to design a new Skill, Agent instruction file, or Agent prompt, or to update an
existing one for a settled requirement.

## Model the task, audience, and boundaries

1. Establish the starting inputs, decisions, tool and authority boundaries,
   failure/stopping states, and observable completion conditions from real work
   rather than from a file template.
   - For **Skills**, apply
     [Model the Skill and its boundaries](../../../references/agents/skill-authoring.md#model-the-skill-and-its-boundaries):
     separate tasks or scopes with different inputs, results, completion states,
     privileged side effects, or maintenance lifecycles, and keep reading-only
     guidance free of invented execution gates.
   - For **project or system Agent instructions (`AGENTS.md`, `CLAUDE.md`,
     prompts)**, identify target clients, instruction hierarchy precedence, and
     every existing file in the chain from repository root to deepest working
     directory so new rules do not duplicate, override unexpectedly, or push the
     combined chain past its client budget.
2. Verify any project commands, file paths, schemas, or contracts the guidance
   will rely on directly against the workspace. Omit facts cheaply read from
   existing project manifests, configs, or `--help` output unless an unwritten
   convention, ordering constraint, or recurring failure pitfall justifies
   caching them.
3. For updates to existing guidance, inspect the complete bundle or instruction
   chain and state the structural judgment in a work update using
   [Keep revisions coherent](../../../knowledge/documentation/maintained-document-quality.md#keep-revisions-coherent)
   before picking insertion points. Resolve project-owned design tradeoffs with
   the user before drafting.

## Design triggers, pointers, and disclosure

1. Apply
   [Establish coverage before drafting](../../../references/agents/selection-triggers.md#establish-coverage-before-drafting)
   and
   [Write the condition](../../../references/agents/selection-triggers.md#write-the-condition)
   to every Skill `description`, internal routing condition, and `AGENTS.md`
   context pointer:
   - Draft from the earliest observable cue in the user's request or artifact,
     front-loading discriminating terms and omitting synonym padding or
     internal step lists.
   - Keep independent conditions cumulative without `"except when..."`
     carve-outs, and check adjacent siblings for false-positive overlap.
2. Organize the information hierarchy using
   [Organize the bundle and ownership](../../../references/agents/skill-authoring.md#organize-the-bundle-and-ownership)
   and
   [Practical sizing implications](../../../knowledge/agents/client-document-size-limits.md#practical-sizing-implications-for-portable-documentation-and-skills):
   - Keep invocation boundaries, core sequence, explicit reference/pointer
     selectors, failure/stopping rules, output contracts, and completion gates in
     `SKILL.md` comfortably within the client Skill-injection cap so tail gates
     are never silently truncated.
   - Push branch-only procedures, dense checklists, templates, and worked
     examples into Skill-local or pointer-reached references within the
     single-file read cap, with clear selection conditions at the point of need.
   - Keep cumulative `AGENTS.md` chains comfortably within the aggregate
     project-instruction budget by linking out domain- or directory-specific
     details rather than piling always-loaded prose into root instructions.

## Draft and bind postconditions

1. Write direct, positive instructions using
   [Write Skill instructions](../../../references/agents/skill-authoring.md#write-skill-instructions)
   and
   [Design for reader use](../../../knowledge/documentation/maintained-document-quality.md#design-for-reader-use).
   Prefer stating the desired positive rule over bare prohibitions unless a
   hard guardrail requires an explicit boundary paired with what to do instead.
2. Bind every consequential action whose silent omission or partial failure
   could still appear plausible to an observable postcondition (acted-on object,
   expected state, verification step, and recovery/stop rule). Keep completion
   criteria checkable, exhaustive, and close to the end of `SKILL.md` so later
   branches cannot bypass them.
3. Reconcile affected manifests, invocation pointers, navigation links, and
   sibling descriptions, then return to
   [Verify and complete](../SKILL.md#verify-and-complete) to verify sizes,
   routes, composed suitability, warranted probes, and deterministic checks.
