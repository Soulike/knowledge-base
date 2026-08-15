---
name: add-to-knowledge-base
description: Add material to this knowledge-base repository. Use when new material must be classified and integrated as static knowledge, an Agent workflow, or both.
---

# Add to knowledge base

Classify the material before choosing its destination.

## Workflow

1. Resolve repository paths relative to this `SKILL.md`; the repository root is
   `../../..`.
2. Classify every distinct part of the material:
   - **Knowledge** captures reusable facts, principles, explanations, and
     references.
   - **Skill** captures triggers, decisions, execution steps, tool use, and
     completion criteria.
   - **Mixed** material contains both; split it into canonical Knowledge and a
     Skill that reads that Knowledge.
   - Material matching neither category stays outside the knowledge base;
     report why it was not integrated.
3. For each Knowledge part, read
   [`references/add-knowledge.md`](references/add-knowledge.md) and complete
   that workflow.
4. For each Skill part, read
   [`references/add-skill.md`](references/add-skill.md) and complete that
   workflow.
5. For mixed material, finish the Knowledge branch first so the Skill can
   reference the final canonical paths.
6. Review the combined result and report the classification, changed paths,
   and validation performed.

## Completion criteria

Finish only when every part of the input has been classified, every accepted
part has one authoritative home, all affected indexes and references resolve,
and the resulting diff preserves the Knowledge-versus-Skill boundary.
