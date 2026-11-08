# Maintain a Skill

1. Choose the audience and responsibility before choosing a path:
   - Put repository-authoring Workflow Skills in
     [`.agents/skills/`](../..). They maintain, organize, or validate this source
     repository.
   - Put installed Workflow and Handbook Skills in the owning plugin's flat
     `skills/` directory. The primary package is
     [`knowledge-base/plugin/skills/`](../../../../knowledge-base/plugin/skills/).
2. Read
   [Agent Skill authoring](../../../../knowledge-base/plugin/references/agents/skill-authoring.md)
   and
   [Design selection triggers](../../../../knowledge-base/plugin/references/agents/selection-triggers.md),
   then determine whether the change is material. Before the parent selects an
   operation, define the user's work and required understanding, compare current
   conditions, and classify the proposed responsibility as Workflow, Handbook,
   reference, mixed, or neither. After selection, resume here to author the
   applicable kind and prove its behavior.
3. For a Workflow, establish the complete user task, result, starting states,
   professional decisions, actions, failures, stopping behavior, and completion.
   For a Handbook, establish the task family, technical domain, or stable
   platform context, the decisions that require understanding, and the
   observable work that selects required reading. Do not turn a reading route
   into a Workflow whose result is only that guidance was loaded.
4. Test every installed Skill against an unknown downstream project. Discover
   project paths, layouts, domain rules, organization policies, and
   infrastructure from the Agent's active working directory. Product, platform,
   protocol, and engineering-domain specificity are valid. Return a proposed
   usage Skill that cannot be independent of its source project to the parent as
   neither.
5. Read the current
   [Knowledge Catalog](../../../../knowledge-base/plugin/knowledge/index.md) and
   search the complete
   [Knowledge tree](../../../../knowledge-base/plugin/knowledge/). Start from
   the user's work and reader decisions, identify every required subject
   responsibility, and read matching canonical Knowledge. Keep that Knowledge
   authoritative rather than reproducing it. Return missing independently
   retrievable understanding to the parent as mixed material so the Knowledge
   branch completes first.
6. While the migration Catalog remains active, preserve its existing reading
   routes and loader as runtime compatibility and coverage evidence.
   Design Handbook routes in addition to that contract; do not remove or narrow
   old routes, rename installed Skills, or add compatibility aliases before the
   coordinated cutover.
7. Search the selected Skill scope for existing owners:
   - Compare Workflows by invocation, accepted input states, user-visible result,
     decisions, effects, failure and completion, consumers, and lifecycle. Keep
     one Workflow only when it owns one complete task.
   - Compare Handbooks by user work, task family, technical domain or platform,
     required understanding, competing native descriptions, and route lifecycle.
     Reuse an existing Handbook when it owns the scene. Add another only for a
     distinct scene, not for each Knowledge leaf, package, or narrow condition.
8. Read every file in the affected bundle and every route or consumer needed to
   understand it. Assign execution to a Workflow, required-reading selection to
   a Handbook, and step-selected support to the parent Skill-reference branch.
   Apply the authoring standard's portability, progressive-disclosure, direct
   canonical-reading, and split-or-merge rules before editing.
9. Apply the parent-selected operation to each complete responsibility unit.
   Rewrite the current owner and remove superseded steps, conditions, exceptions,
   completion rules, no-op instructions, obsolete routes, and orphaned
   references. Do not preserve old and new models as layered qualifications.
10. For an installed target-model Skill, use a lowercase hyphenated directory
    and matching frontmatter name beginning with `workflow-` or `handbook-`.
    Keep installed Skills as immediate children of the package `skills/`
    directory. Do not add custom kind metadata or a prefix-kind checker. For a
    repository-authoring Workflow, use a task-appropriate verb-led name.
11. When renaming, splitting, merging, moving, or removing a Skill under an
    authorized coordinated migration, update every invocation pointer, consumer,
    marketplace or manifest route, regression case, prompt, and documentation
    reference, then remove the obsolete route. Outside that migration, preserve
    current installed names and do not create wrappers or aliases.
12. For a Handbook, write one semantic applicability statement in its
    description. In its body, define a foundation only when current Knowledge is
    common to the primary artifact work; define mandatory conditional packages
    from observable work or materials; require every match cumulatively; give a
    direct learning or explanation request about a package subject its own route
    without an unrelated foundation; use complete files or
    context-sufficient sections; and re-evaluate after stage or context changes.
    Link canonical reading units directly and prohibit Handbook-to-Handbook
    dependencies.
13. For every installed Skill that applies Knowledge, encode working-directory
    precedence: shared guidance supplements and does not override instructions,
    requirements, Skills, or project-specific decisions from the active working
    directory. Keep installed content inside its package boundary and free of
    source-checkout tooling, `.agents/`, private infrastructure, or unguaranteed
    Skill-to-Skill invocation. Apply the contribution-Skill exception in the
    repository [authoring rules](../../../../AGENTS.md#repository-architecture)
    only when it governs the Skill under change.
14. Run `pnpm check`, `git diff --check`, and every additional validator or
    focused behavior case selected by the changed artifacts. Produce separate
    evidence for native description selection, Workflow execution or Handbook
    package choice, actual reading and application, later-stage additions,
    negative loading, and output where applicable. Static links do not establish
    reading behavior.
15. Report the authoring standard's design and behavioral evidence, including
    the responsibility kind, user work, owner comparison, authoritative
    Knowledge, routes and migration compatibility, tested source and models,
    observations, and limitations. The parent workflow owns the single
    independent final-content and reader-understanding review.

Finish only when the Skill has one authoritative responsibility in the correct
audience scope and preserves downstream-project independence. A Workflow must
own one complete task with its failure and completion contract. A Handbook must
own one coherent reading scene with direct complete routes, cumulative package
selection, phase re-evaluation, and no task procedure or hidden Handbook
dependency. Every rule must have one authoritative copy, and new or material
behavior must have reviewable evidence.
