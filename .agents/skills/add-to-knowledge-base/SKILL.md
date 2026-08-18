---
name: add-to-knowledge-base
description: Add material to this knowledge-base repository. Use when new material must be classified and integrated as Knowledge, an Agent workflow or Skill reference, or both.
---

# Add to knowledge base

Classify the material before choosing its destination.

## Workflow

1. Resolve repository paths relative to this `SKILL.md`; the repository root is
   `../../..`.
2. Apply the downstream-project-independence gate from [`AGENTS.md`](../../../AGENTS.md)
   to every part intended for Knowledge or a usage Skill. Generalize
   project-derived material only when it remains correct without its source
   project; classify non-generalizable parts as neither and leave them in that
   project.
3. Read
   [`references/agents/knowledge-and-skills.md`](../../../references/agents/knowledge-and-skills.md),
   then identify every distinct part's intended consumers, maintenance
   lifecycle, and retrieval source. Apply its retrieval-origin, workflow-
   removal, routing-order, and lifecycle tests. A Knowledge candidate must
   support a root-index `When to Read` condition that is observable from an
   installed-plugin task, subject, or artifact before any workflow is selected.
4. Classify every part as Knowledge, Skill or Skill reference, mixed, or
   neither using that model. Keep explanation selected only by a workflow step
   in that Skill or an appropriately scoped reference even when the prose
   sounds general or several Skills use it. Report why material in the last
   category was not integrated.
5. If any accepted part is maintained explanatory or instructional text, read
   [Good development documentation](../../../references/documentation/good-development-documentation.md)
   and apply it throughout the applicable authoring workflow.
6. For each Knowledge part, read
   [`references/add-knowledge.md`](references/add-knowledge.md) and complete
   that workflow.
7. For each Skill part, read
   [`references/add-skill.md`](references/add-skill.md) and complete that
   workflow.
8. For mixed material, finish the Knowledge branch first so the Skill can
   reference the final canonical paths.
9. When the final diff changes root `knowledge/**`, `references/**`, or
   `skills/**`, follow
   [`references/update-plugin-version.md`](references/update-plugin-version.md)
   after the content stabilizes.
10. Review the combined result and report the classification, changed paths,
    generated primary-plugin version when applicable, and validation performed.

## Completion criteria

Finish only when every part of the input has been classified, every accepted
part has one authoritative home, the root Knowledge index and all references
resolve, every user-facing part preserves downstream-project independence, and
every Knowledge part has an independent installed-use reading responsibility
that survives removal of every consuming Skill, precedes workflow selection,
and has a valid Knowledge Type. Each Knowledge leaf must serve that
responsibility without requiring another leaf as a prerequisite, and the root
index must remain the only Knowledge routing catalog. Every Skill reference
must be routed only by its consuming workflow steps and live at the smallest
common package boundary. The resulting diff must preserve the Knowledge-versus-
workflow boundary. When root Knowledge, Skill references, or usage Skills
changed, also require the PR-scoped primary-plugin version and its validation
to be current.
