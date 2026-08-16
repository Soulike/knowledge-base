---
name: maintain-documentation
description: Assess and maintain authoritative engineering guidance. Use when adding, changing, moving, deleting, or reviewing documentation, Agent instruction files, source comments or docstrings, or Skills; when deciding whether an implementation or proposal requires documentation; when choosing the authoritative home for guidance; or when checking a change for stale secondary representations.
---

# Maintain documentation

## Establish the governing context

1. Follow instructions, Skills, requirements, and project-specific information
   from the active working directory when they conflict with this plugin's
   shared Knowledge.
2. Resolve linked paths relative to this `SKILL.md`, then read
   [Authoritative engineering guidance](../../knowledge/documentation/authoritative-guidance.md).
3. Read
   [Source comments and docstrings](../../knowledge/software-engineering/source-comments.md)
   when source prose is being changed, reviewed, or potentially invalidated.
   Read
   [Knowledge and Skills](../../knowledge/agents/knowledge-and-skills.md) when
   deciding between those two artifact types.
4. Read the active project's instruction hierarchy, artifact-specific
   standards, changed implementation or proposal, and current authoritative
   sources. Discover its structure rather than assuming fixed paths or naming
   conventions.

## Account for changed meaning

For every changed meaning:

1. Identify who needs it and the recurring task it affects.
2. Locate the artifact that currently defines or owns it.
3. Find instructions, documentation, Skills, pointers, comments, and examples
   that the change may make incomplete, misleading, or stale.

Inspect semantic dependencies beyond the proposed diff and files already
categorized as documentation.

## Decide whether guidance is owed

Apply the information-need gate from Authoritative engineering guidance to
each proposed semantic block. Treat a necessary definition, pointer, or minimal
example as support for an admitted block. Accept “no documentation change” when
the authoritative sources and existing routes already make the meaning
reliable, and record that conclusion for the affected meaning.

When asked only to assess or review, report the decision and proposed owner
without editing. When edits are authorized, continue with only the admitted
blocks.

## Update the authoritative owner

1. Choose the artifact and narrowest stable owner by purpose, applying any
   stricter project-specific contract.
2. Add or revise the meaning in one authoritative home. Use pointers when
   another audience needs a route to it instead of reproducing the detail.
3. Give hand-maintained documents a clear content boundary and maintenance
   condition when their local standard requires or lacks them.
4. Write task-evaluable reading triggers and keep changing inventories at their
   live source unless completeness is mechanically maintained.
5. Update, redirect, or remove every secondary representation invalidated by
   the change. Prefer pruning obsolete prose to layering qualifications around
   it.

## Review the final state

1. Account for every changed meaning with its updated owner or a concrete
   conclusion that no guidance change is owed.
2. Confirm that every changed or impacted document, Skill, instruction,
   comment, pointer, and example was examined under its applicable standard.
3. Confirm that new reading triggers can be evaluated before opening their
   targets.
4. Search for stale paths, headings, names, examples, and competing copies.
5. Run the checks required by the active project and the user's request, and
   report any checks intentionally skipped or unavailable.

Finish when each changed meaning has one authoritative owner, all affected
routes remain usable, and no unexplained stale representation remains.
