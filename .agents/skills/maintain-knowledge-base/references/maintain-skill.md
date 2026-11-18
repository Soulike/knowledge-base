# Maintain a Skill

1. Apply the dependency-boundary rule in
   [`AGENTS.md`](../../../../AGENTS.md#repository-architecture) before choosing
   a path:
   - Keep generalizable Workflow and Handbook Skills in the owning plugin's
     flat `skills/` directory. The primary package is
     [`knowledge-base/plugin/skills/`](../../../../knowledge-base/plugin/skills/);
     auxiliary plugins use `plugins/<plugin-name>/skills/`.
   - Keep only repository-coupled
     [repository-maintenance workflows](../../../../GLOSSARY.md#repository-maintenance-workflow)
     in [`.agents/skills/`](../..), delegating one-way to `knowledge-base/plugin/`
     without restating, paraphrasing, splitting, or overriding product-owned
     rules.
2. Read
   [Agent Skill authoring](../../../../knowledge-base/plugin/references/agents/skill-authoring.md)
   and
   [Design selection triggers](../../../../knowledge-base/plugin/references/agents/selection-triggers.md),
   and delegate all general Skill responsibility, task and reading-scene
   modeling, downstream-project independence, description and body authoring,
   bundle organization, composed-bundle review, and behavioral-proof rules to
   those authorities without restating them here.
3. Inspect the primary product's
   [Knowledge Catalog](../../../../knowledge-base/plugin/knowledge/index.md) and
   [Knowledge tree](../../../../knowledge-base/plugin/knowledge/) (or the
   applicable plugin's Knowledge) alongside existing Skills in the target scope.
   Return missing independently retrievable subject understanding to the parent
   workflow's Knowledge branch first, and return step-selected support to its
   Skill-reference branch. Confirm downstream-project independence for
   installed Skills per
   [`AGENTS.md`](../../../../AGENTS.md#repository-architecture), returning
   non-generalizable content to the parent as neither.
4. Apply the parent-selected operation to each complete affected responsibility
   unit and enforce repository layout and packaging rules:
   - For primary-product installed Skills under `knowledge-base/plugin/skills/`,
     follow
     [Skills and references](../../../../knowledge-base/AGENTS.md#skills-and-references):
     place each entrypoint in an immediate child directory with one `SKILL.md`
     and matching frontmatter `name` prefixed with `workflow-` or `handbook-`,
     without custom kind metadata, aliases, wrapper Skills, or a prefix-kind
     checker.
   - Keep `knowledge-base/plugin/skills/**` inside its package boundary and free
     of `.agents/`, source-checkout tooling (`knowledge-base/lib/`,
     `knowledge-base/tools/`), and sibling plugins, applying only the explicit
     contribution-Skill manifest exception in
     [`AGENTS.md`](../../../../AGENTS.md#repository-architecture) when it
     governs the Skill under change.
   - For repository-maintenance workflows under `.agents/skills/`, use a
     task-appropriate verb-led directory and frontmatter `name`.
5. When adding, renaming, splitting, merging, moving, or removing a Skill under
   an authorized change, reconcile every affected repository consumer—invocation
   pointers, marketplace and manifest routes
   ([`.claude-plugin/marketplace.json`](../../../../.claude-plugin/marketplace.json),
   `plugin.json`), regression cases, `.github/` prompts and verification
   workflows, and repository docs—then remove obsolete routes and wrappers.
6. Verify Knowledge Catalog reachability (`pnpm knowledge:check`) when primary
   plugin Skills or routes change so every leaf in
   [knowledge/index.md](../../../../knowledge-base/plugin/knowledge/index.md)
   remains
   reachable through the package-local graph
   ([Knowledge](../../../../knowledge-base/AGENTS.md#knowledge)).
7. Run `pnpm check` and `git diff --check`. Produce the behavioral proof and
   pull-request or handoff summary required by
   [Prove the behavior](../../../../knowledge-base/plugin/references/agents/skill-authoring.md#prove-the-behavior)
   and
   [Prepare pull-request and handoff evidence](../../../../knowledge-base/plugin/references/agents/skill-authoring.md#prepare-pull-request-and-handoff-evidence)
   (together with
   [Prove Handbook and Workflow behavior](#prove-handbook-and-workflow-behavior)
   for primary-product Workflow and Handbook Skills),
   and return it to the parent workflow for unified assembly and single-reviewer
   [final validation](../SKILL.md#final-validation).

Finish only when the Skill lives at the boundary required by its dependencies,
satisfies repository layout, package-isolation, and Catalog-reachability
contracts, has all repository consumers reconciled, and returns complete
evidence for parent validation and delivery.

## Choose the Skill responsibility

Classify proposed primary-product material into its owning responsibility using
[Classifying Knowledge and Skill material](../../../../knowledge-base/plugin/references/agents/knowledge-and-skills.md)
and
[Skills and references](../../../../knowledge-base/AGENTS.md#skills-and-references).
Do not package a reading route as a Workflow Skill or copy canonical Knowledge
into a Skill. When proposed material mixes responsibilities, stabilize its
Knowledge owners before finalizing Workflow or Handbook routes. Delegate
generic Skill-responsibility and boundary craft one-way to
[Model the Skill and its boundaries](../../../../knowledge-base/plugin/references/agents/skill-authoring.md#model-the-skill-and-its-boundaries).

## Model a Workflow Skill

Apply
[Skills and references](../../../../knowledge-base/AGENTS.md#skills-and-references)
for Workflow task ownership and direct canonical Knowledge reading when an
execution step cannot safely depend on native Handbook co-selection (without
copying canonical Knowledge into the Workflow). Delegate generic task modeling,
splitting across domains or completion directions, professional research,
ordered imperative instructions, observable postconditions, progressive
disclosure, and completion gates one-way to
[Agent Skill authoring](../../../../knowledge-base/plugin/references/agents/skill-authoring.md).

## Model a Handbook Skill

Inventory canonical Knowledge responsibilities first, keeping Knowledge leaves
separate when subject ownership or maintenance lifecycle differs even when one
Handbook reads them together. Apply the complete Handbook reading-selection,
package, reading-unit, sparse-entry, and lifecycle-ownership contract in
[Skills and references](../../../../knowledge-base/AGENTS.md#skills-and-references),
using
[Keep guidance current](../../../../knowledge-base/plugin/references/agents/independent-collaboration.md#keep-guidance-current)
as the shared reading-lifecycle owner when the bundle includes it.

Delegate generic guidance-Skill modeling (including keeping reading-only Skills
free of task procedures or completion gates) and observable condition drafting
one-way to
[Agent Skill authoring](../../../../knowledge-base/plugin/references/agents/skill-authoring.md#model-the-skill-and-its-boundaries)
and
[Design selection triggers](../../../../knowledge-base/plugin/references/agents/selection-triggers.md).

## Assign Knowledge, references, and bundle ownership

Complete missing independently retrievable understanding as canonical Knowledge
and register it in
[knowledge/index.md](../../../../knowledge-base/plugin/knowledge/index.md)
before finalizing a dependent Workflow or Handbook Skill. Enforce direct
package-local canonical routes, absence of Handbook-to-Handbook dependencies,
and supplemental status per
[Skills and references](../../../../knowledge-base/AGENTS.md#skills-and-references),
and delegate generic bundle portability, working-directory precedence,
registered-name references, and reference split-or-merge rules one-way to
[Organize the bundle and ownership](../../../../knowledge-base/plugin/references/agents/skill-authoring.md#organize-the-bundle-and-ownership).

## Write a Handbook body

Follow the Handbook structure, reading-unit, and lifecycle-ownership contract in
[Skills and references](../../../../knowledge-base/AGENTS.md#skills-and-references)
alongside [Model a Handbook Skill](#model-a-handbook-skill), and delegate
generic instruction and condition craft one-way to
[Write Skill instructions](../../../../knowledge-base/plugin/references/agents/skill-authoring.md#write-skill-instructions)
and
[Write the condition](../../../../knowledge-base/plugin/references/agents/selection-triggers.md#write-the-condition).
Apply these primary-product Handbook body rules:

- Link directly to complete canonical Knowledge files or context-sufficient
  sections relative to `SKILL.md`, never through
  [knowledge/index.md](../../../../knowledge-base/plugin/knowledge/index.md) or
  another Handbook.
- Make every modeled reading and no-match path from
  [Skills and references](../../../../knowledge-base/AGENTS.md#skills-and-references)
  explicit in `SKILL.md`, keeping shared reading-lifecycle rules at
  [Keep guidance current](../../../../knowledge-base/plugin/references/agents/independent-collaboration.md#keep-guidance-current)
  unless the bundle lacks a shared lifecycle owner.

## Handbook and Workflow selection triggers

Delegate generic coverage analysis, earliest-observable-point drafting,
cumulative condition craft, and blind request verification one-way to
[Design selection triggers](../../../../knowledge-base/plugin/references/agents/selection-triggers.md)
([Establish coverage before drafting](../../../../knowledge-base/plugin/references/agents/selection-triggers.md#establish-coverage-before-drafting),
[Write the condition](../../../../knowledge-base/plugin/references/agents/selection-triggers.md#write-the-condition),
and
[Check selection from requests](../../../../knowledge-base/plugin/references/agents/selection-triggers.md#check-selection-from-requests)),
delegate generic description craft (`Use when` / `Use before` and single-rule
applicability) one-way to
[Write the description](../../../../knowledge-base/plugin/references/agents/skill-authoring.md#write-the-description),
and apply the Workflow and Handbook selection contract in
[Skills and references](../../../../knowledge-base/AGENTS.md#skills-and-references).
Apply these primary-product taxonomy rules:

- **Coverage separation:** Keep a Handbook's native description scoped to its
  owning scene independently of internal package conditions, and omit
  `workflow-`/`handbook-` names from descriptions.
- **Package routing verification:** Apply
  [Check selection from requests](../../../../knowledge-base/plugin/references/agents/selection-triggers.md#check-selection-from-requests)
  to every Handbook route required by
  [Skills and references](../../../../knowledge-base/AGENTS.md#skills-and-references).

## Prove Handbook and Workflow behavior

Delegate generic composed-bundle review, behavioral proof scenarios,
execution and postcondition checks, model selection, evaluation isolation and
attempt retention, cross-model reader-understanding verification, and
pull-request or handoff evidence formatting one-way to
[Review the composed bundle](../../../../knowledge-base/plugin/references/agents/skill-authoring.md#review-the-composed-bundle),
[Prove the behavior](../../../../knowledge-base/plugin/references/agents/skill-authoring.md#prove-the-behavior),
[Prepare pull-request and handoff evidence](../../../../knowledge-base/plugin/references/agents/skill-authoring.md#prepare-pull-request-and-handoff-evidence),
[Check selection from requests](../../../../knowledge-base/plugin/references/agents/selection-triggers.md#check-selection-from-requests),
[Agent behavioral evaluation](../../../../knowledge-base/plugin/references/agents/behavioral-evaluation.md),
and
[Verify reader understanding](../../../../knowledge-base/plugin/references/agents/reader-understanding.md).
Apply these primary-product deltas:

- **Product routing and reading separation:** Keep Workflow native
  selection, Handbook native selection, the Handbook package and routing
  choices required by
  [Skills and references](../../../../knowledge-base/AGENTS.md#skills-and-references),
  direct canonical Knowledge reading (both from Handbooks and from Workflow
  steps that cannot safely depend on Handbook co-selection), and Knowledge
  application distinct across composed-bundle traces and behavioral evidence.
  Trace later-stage reassessment, reuse, and recovery at the shared
  reading-lifecycle owner
  ([Keep guidance current](../../../../knowledge-base/plugin/references/agents/independent-collaboration.md#keep-guidance-current))
  when it governs the scene.
- **Domain-connection journeys vs shared lifecycle unit:** Keep generic
  reading-lifecycle policy and its unit-level protection at the authoritative
  shared owner (or locally when owned locally). Subject cases protect their
  own conditions, direct Knowledge routes, and application. Retain a
  representative journey when a domain transition exposes a distinct realistic
  connection fault—such as a previously inapplicable foundation becoming
  required after focused learning, an ongoing Workflow gaining a conditional
  Knowledge route, or a later artifact requiring a different execution
  target—because neither independent task checks nor the shared lifecycle unit
  alone establishes that connection. Moving lifecycle
  policy alone does not justify changing a case's task or retiring its distinct
  protection.
- **Pull-request and handoff summary:** Include Workflow or Handbook
  responsibility kind and boundary, reading-scene or professional research,
  owner comparison, and authoritative Knowledge and reference placement
  alongside the unmodified evidence required by
  [Prepare pull-request and handoff evidence](../../../../knowledge-base/plugin/references/agents/skill-authoring.md#prepare-pull-request-and-handoff-evidence).
