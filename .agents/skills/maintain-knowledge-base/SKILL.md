---
name: maintain-knowledge-base
description: Maintain content in this knowledge-base repository. Use when an authorized change must add, correct, rewrite, split, merge, move, or remove Knowledge, an Agent workflow, a Skill reference, or maintained Agent instructions and prompts that govern them.
---

# Maintain the knowledge base

Classify every affected responsibility before choosing its final artifact or
operation.

An **affected responsibility unit** is the smallest complete block of meaning
or workflow behavior owned by one responsibility that the authorized change
can make stale or incoherent. Its required route and consumer repairs are part
of the change effect, but do not authorize changes to independent behavior.

## Workflow

1. Resolve repository paths relative to this `SKILL.md`; the repository root is
   `../../..`. Treat the user's requested change as the mutation boundary. Read
   enough surrounding content to judge the complete effect, but request an
   expanded scope before changing an independent responsibility, public trigger,
   or consumer not required to leave the authorized change coherent.
2. Apply the downstream-project-independence gate from
   [`AGENTS.md`](../../../AGENTS.md) to every part intended for Knowledge or a
   usage Skill. Generalize project-derived material only when it remains correct
   without its source project; classify non-generalizable parts as neither and
   leave them in that project.
3. Read
   [`references/agents/knowledge-and-skills.md`](../../../references/agents/knowledge-and-skills.md),
   then identify every distinct part's intended consumers, maintenance
   lifecycle, and retrieval source. Apply its retrieval-origin,
   workflow-removal, routing-order, and lifecycle tests. A Knowledge candidate
   must support a root-index `When to Read` condition that is observable from an
   installed-plugin task, subject, or artifact before any workflow is selected.
4. Classify every new, changed, moved, or removed affected responsibility unit
   as Knowledge, Skill, Skill reference, mixed, or another repository-owned
   artifact using that model. Keep explanation selected only by a workflow step
   in that Skill or an appropriately scoped reference even when the prose
   sounds general or several Skills use it. Keep repository instructions,
   prompts, implementation, and other material that owns neither retrievable
   understanding nor a reusable workflow in its actual artifact type rather
   than forcing it into Knowledge or a Skill.
5. Inventory relevant existing Knowledge, Skills, and references in every
   applicable package or authoring scope. Compare their pre-edit
   responsibilities, consumers, retrieval or invocation triggers, and
   maintenance lifecycles. Prefer an existing owner when it already owns the
   responsibility; retain a new artifact only for an independently owned
   remainder, and report why no existing owner fits it.
6. If any affected part is maintained explanatory or instructional text, read
   [Good development documentation](../../../references/documentation/good-development-documentation.md)
   and apply it throughout the applicable authoring workflow.
7. Read each affected artifact as a whole together with the routes and
   consumers needed to judge it. Read every applicable artifact workflow named
   below and complete its analysis up to, but not including, application of a
   parent-selected operation. Reclassify any material that a branch returns.
   For mixed material, analyze the Knowledge part first, then the Skill part,
   then its references.
8. Using the completed artifact-specific analysis, design the final artifact
   set by responsibility, retrieval or invocation timing, consumers, and
   maintenance lifecycle rather than by the requested operation or current file
   layout.
9. For every affected responsibility unit, compare making no change, deleting,
   rewriting, adding, merging, splitting, and moving the material. Complete this
   comparison before adding content at any location. Do not add by default when
   the material corrects, duplicates, or supersedes existing content; needs a
   widened pre-edit responsibility or trigger to fit; adds another qualification
   to accumulated exceptions; or exposes multiple independently retrieved,
   invoked, or maintained responsibilities. Also examine whether deletion or
   movement preserves the required outcome with less maintained content and
   whether branch-only detail belongs behind progressive disclosure. Select the
   operation that leaves the smallest complete and coherent current model.
10. Resume each applicable artifact workflow and apply the selected operations.
    For each Knowledge part, use
    [`references/maintain-knowledge.md`](references/maintain-knowledge.md) and
    complete that workflow. For each Skill part, use
    [`references/maintain-skill.md`](references/maintain-skill.md) and complete
    that workflow. For each Skill-reference part, use
    [`references/maintain-skill-reference.md`](references/maintain-skill-reference.md)
    and complete that workflow. For mixed material, finish the Knowledge branch
    first, then stabilize the Skill responsibilities before finalizing their
    references. Maintain other repository-owned explanatory or instructional
    artifacts directly under the parent quality gate and their governing project
    standards.
11. When the final diff changes root `knowledge/**`, `references/**`, or
    `skills/**`, follow
    [`references/update-plugin-version.md`](references/update-plugin-version.md)
    after the content stabilizes.
12. When meaning or structure changed, use a fresh Agent or isolated context for
    a read-only semantic comparison of the trusted pre-change state, accepted
    requirements, and every final affected artifact. Require the comparison to
    account for every semantic change and verify that retained, moved, split,
    and merged responsibilities remain reachable from each required starting
    point. Resolve every unexplained loss, distortion, duplicate authority, or
    route failure and repeat the comparison after each fix. Treat unavailable
    independent comparison as an incomplete result.
13. Review the combined result and report the classification, affected
    responsibility units, operations performed, changed routes and consumers,
    generated primary-plugin version when applicable, and mechanical and
    semantic validation performed. Explain a plausible structural alternative
    only when rejecting it materially affected the result.

## Completion criteria

Finish only when every affected part has been classified and every accepted
part has one authoritative home. Each affected responsibility unit must present
one coherent current model without superseded wording, duplicated authority,
patch-layered qualifications, or unnecessary workflow branches. The final
artifact structure must reflect responsibilities, retrieval or invocation
timing, consumers, and maintenance lifecycles rather than edit history, while
remaining no more complex than the required behavior and explanation demand.

Every new artifact must own a responsibility that no existing artifact owns.
The root Knowledge index and all references must resolve, every user-facing
part must preserve downstream-project independence, and every Knowledge part
must have an independent installed-use reading responsibility that survives
removal of every consuming Skill, precedes workflow selection, and has a valid
Knowledge Type. Each Knowledge leaf must serve that responsibility without
requiring another leaf as a prerequisite, and the root index must remain the
only Knowledge routing catalog. Every Skill reference must be selected only by
its consuming workflow steps and live at the smallest common package boundary.
The resulting diff must preserve the Knowledge-versus-workflow boundary and
must not change an independent responsibility outside the authorized scope.
Every other affected repository artifact must remain in the form that owns its
responsibility and satisfy the same coherent-current-model quality gate.
The independent semantic comparison must find no unexplained change. When root
Knowledge, Skill references, or usage Skills changed, also require the
PR-scoped primary-plugin version and its validation to be current.
