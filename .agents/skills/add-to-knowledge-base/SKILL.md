---
name: add-to-knowledge-base
description: Add material to this knowledge-base repository. Use when new material must be classified and integrated as static knowledge, an Agent workflow, or both.
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
   [`knowledge/agents/knowledge-and-skills.md`](../../../knowledge/agents/knowledge-and-skills.md),
   then classify every distinct part of the material as Knowledge, Skill,
   mixed, or neither using that model. Report why material in the last category
   was not integrated.
4. For each Knowledge part, read
   [`references/add-knowledge.md`](references/add-knowledge.md) and complete
   that workflow.
5. For each Skill part, read
   [`references/add-skill.md`](references/add-skill.md) and complete that
   workflow.
6. For mixed material, finish the Knowledge branch first so the Skill can
   reference the final canonical paths.
7. Review the combined result and report the classification, changed paths,
   and validation performed.

## Completion criteria

Finish only when every part of the input has been classified, every accepted
part has one authoritative home, the root Knowledge index and all references
resolve, every user-facing part preserves downstream-project independence, and
the resulting diff preserves the Knowledge-versus-Skill boundary.
