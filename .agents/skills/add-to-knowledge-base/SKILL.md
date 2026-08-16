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
   then identify every distinct part's intended consumers, maintenance
   lifecycle, and concrete direct-reading task or decision. A Knowledge
   candidate must support a root-index `When to Read` condition for an
   installed-plugin task that exists independently of this repository's
   authoring workflow.
4. Classify every part as Knowledge, Skill, mixed, or neither using that model.
   Keep explanation whose consumers and lifecycle belong only to an authoring
   workflow in that Skill or its references, even when the prose sounds
   general. Report why material in the last category was not integrated.
5. For each Knowledge part, read
   [`references/add-knowledge.md`](references/add-knowledge.md) and complete
   that workflow.
6. For each Skill part, read
   [`references/add-skill.md`](references/add-skill.md) and complete that
   workflow.
7. For mixed material, finish the Knowledge branch first so the Skill can
   reference the final canonical paths.
8. When the final diff changes root `knowledge/**` or `skills/**`, follow
   [`references/update-plugin-version.md`](references/update-plugin-version.md)
   after the content stabilizes.
9. Review the combined result and report the classification, changed paths,
   generated primary-plugin version when applicable, and validation performed.

## Completion criteria

Finish only when every part of the input has been classified, every accepted
part has one authoritative home, the root Knowledge index and all references
resolve, every user-facing part preserves downstream-project independence, and
every Knowledge part has an independent installed-use reading responsibility
and a valid Knowledge Type. The resulting diff must preserve the
Knowledge-versus-Skill boundary. When root Knowledge or usage Skills changed,
also require the PR-scoped primary-plugin version and its validation to be
current.
