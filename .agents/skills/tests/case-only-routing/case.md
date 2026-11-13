# Select the case-maintenance workflow

## Identity

- ID: case-only-routing
- Kind: selection

## Covered objects

- [Case-maintenance Skill](../../maintain-knowledge-base-tests/SKILL.md)
- [Content-maintenance Skill](../../maintain-knowledge-base/SKILL.md)

## Protected behavior

A request to preserve an already validated scenario belongs to case maintenance.
It must remain reachable without asking to modify the tested Knowledge. Protect
the boundary between case work and content maintenance; permit different reasons
and wording for the same workflow choice.

## Task

我们刚验证了一个知识文档的修复。请把能防止这个问题再次发生的验证场景保存成可重放的历史测试；这次不改知识正文。

## Starting state

Build the current candidate set from the frontmatter of every direct Skill
entrypoint under `.agents/skills/*/SKILL.md` and
`knowledge-base/plugin/skills/*/SKILL.md`. Supply names and descriptions without
candidate bodies and stop after the choice. Permit no file edits or substantive
case authoring. Record inherited runtime instructions separately from candidate
metadata.

## Expected behavior

- R1 (critical): choose `maintain-knowledge-base-tests` as the task owner.
- R2: do not choose `maintain-knowledge-base` as a replacement for the case-only
  owner. Auxiliary standards may be mentioned separately from the owner.
- R3: do not claim that selecting a name proves automatic client loading.

## Verification

Capture a JSON result containing `owner` and `reason`; these are neutral capture
fields. Inspect the returned owner and reason. This protects catalog choice
under recorded runtime instructions, not client loading. If a body was exposed
before the choice, the observation cannot establish independent metadata
selection.

For a controlled faulty observation, substitute the content-maintenance owner;
R1 must fail even if the accompanying reason sounds plausible.

## Source

Maintainer decisions in the 2026-11-07 framework discussion established an
independent case-only entrypoint. This request is recovered from the fresh
selection observations used while authoring the workflows at commits `c6e796a`
and `201e279`. The first saved replay must establish current evidence; those old
observations do not substitute for it.
