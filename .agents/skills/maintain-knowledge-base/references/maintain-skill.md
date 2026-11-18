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
   [Prepare pull-request and handoff evidence](../../../../knowledge-base/plugin/references/agents/skill-authoring.md#prepare-pull-request-and-handoff-evidence),
   and return it to the parent workflow for unified assembly and single-reviewer
   [final validation](../SKILL.md#final-validation).

Finish only when the Skill lives at the boundary required by its dependencies,
satisfies repository layout, package-isolation, and Catalog-reachability
contracts, has all repository consumers reconciled, and returns complete
evidence for parent validation and delivery.

## Choose the Skill responsibility

Use
[Classifying Knowledge and Skill material](../../../../knowledge-base/plugin/references/agents/knowledge-and-skills.md)
and
[Skills and references](../../../../knowledge-base/AGENTS.md#skills-and-references)
to separate the four primary-product responsibilities: canonical subject
understanding belongs in Knowledge, independently invoked user-task execution
belongs in a Workflow Skill, required-reading selection for a task family,
domain, or platform belongs in a Handbook Skill, and step-selected support
belongs in the Skill or a Skill reference.

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
Handbook reads them together. Apply
[Skills and references](../../../../knowledge-base/AGENTS.md#skills-and-references)
for Handbook ownership, reuse before adding, rejecting 1:1 leaf wrappers,
sparse single-leaf domain or platform admission, foundation vs cumulative
conditional packages, empty-foundation and focused-learning routing,
complete-file or context-sufficient-section reading units, rejecting
Handbook-to-Handbook dependencies, and shared reading-lifecycle ownership at
[Keep guidance current](../../../../knowledge-base/plugin/references/agents/independent-collaboration.md#keep-guidance-current).

Apply these primary-product maintenance deltas:

- Sparse domain or platform entries must include valid no-match behavior and
  explicitly non-exhaustive coverage without implying comprehensive platform
  coverage.
- Where a bundle lacks an independently required shared reading-lifecycle
  owner, supply reuse, rereading, and reassessment rules in the owning Handbook
  itself rather than assuming another Handbook will be invoked.
- A Handbook owns selection and mandatory reading obligations only—no user-task
  procedure, side-effect contract, task failure state, output artifact, or task
  completion gate.

Delegate generic guidance-Skill modeling and observable condition drafting
one-way to
[Agent Skill authoring](../../../../knowledge-base/plugin/references/agents/skill-authoring.md)
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

Delegate supplemental guidance status, cumulative condition framing, and
complete-unit linking one-way to
[Skills and references](../../../../knowledge-base/AGENTS.md#skills-and-references),
[Write executable instructions](../../../../knowledge-base/plugin/references/agents/skill-authoring.md#write-executable-instructions),
and
[Write the condition](../../../../knowledge-base/plugin/references/agents/selection-triggers.md#write-the-condition).
Apply these primary-product Handbook body rules:

- Link directly to complete canonical Knowledge files or context-sufficient
  sections relative to `SKILL.md`, never through
  [knowledge/index.md](../../../../knowledge-base/plugin/knowledge/index.md) or
  another Handbook.
- Make foundation applicability (including valid empty foundations and direct
  focused-learning routes per
  [Skills and references](../../../../knowledge-base/AGENTS.md#skills-and-references))
  explicit without copying the shared reading-lifecycle policy owned by
  [Keep guidance current](../../../../knowledge-base/plugin/references/agents/independent-collaboration.md#keep-guidance-current),
  unless no shared owner governs the bundle.
- For a sparse domain or platform Handbook, state explicitly that when no
  package matches, the Agent continues without loading unrelated material or
  implying exhaustive coverage.
- Omit task procedures, output artifacts, failure contracts, and completion
  gates.

## Handbook and Workflow selection triggers

Delegate generic coverage analysis, earliest-observable-point drafting,
cumulative condition craft, and blind request verification one-way to
[Design selection triggers](../../../../knowledge-base/plugin/references/agents/selection-triggers.md)
([Establish coverage before drafting](../../../../knowledge-base/plugin/references/agents/selection-triggers.md#establish-coverage-before-drafting),
[Write the condition](../../../../knowledge-base/plugin/references/agents/selection-triggers.md#write-the-condition),
and
[Check selection from requests](../../../../knowledge-base/plugin/references/agents/selection-triggers.md#check-selection-from-requests)),
and delegate generic description craft (`Use when` / `Use before` and
single-rule semantic framing) one-way to
[Write the description](../../../../knowledge-base/plugin/references/agents/skill-authoring.md#write-the-description).
Apply these primary-product taxonomy deltas:

- **Coverage separation:** Separate a Handbook's native description coverage
  (one task family, technical domain, or stable platform context per
  [Skills and references](../../../../knowledge-base/AGENTS.md#skills-and-references))
  from internal package coverage inside that scene, without copying leaf
  conditions into descriptions or creating 1:1 leaf wrappers.
- **Handbook descriptions:** Identify the owning scene without enumerating
  foundations, packages, Knowledge topics, `workflow-`/`handbook-` names, or
  internal conditions, and do not claim exhaustive coverage on a sparse entry.
- **Handbook package selection verification:** Verify Handbook package routing
  per
  [Check selection from requests](../../../../knowledge-base/plugin/references/agents/selection-triggers.md#check-selection-from-requests)
  and
  [Skills and references](../../../../knowledge-base/AGENTS.md#skills-and-references)
  (including cumulative matches, focused-learning routes, empty foundations,
  and valid no-match sparse platform work), keeping internal package choices
  distinct from native Skill selection and from canonical Knowledge reading and
  application.

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
  selection, Handbook native selection, Handbook foundation and cumulative
  package choices (including empty foundations, focused-learning routes per
  [Skills and references](../../../../knowledge-base/AGENTS.md#skills-and-references),
  and valid no-match sparse entries), direct canonical Knowledge reading (both
  from Handbooks and from Workflow steps that cannot safely depend on Handbook
  co-selection), and Knowledge application distinct across composed-bundle
  traces and behavioral evidence. Trace later-stage reassessment, reuse, and
  recovery at the shared reading-lifecycle owner
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
  alone establishes that connection. Separate independent tasks when shared
  topic or chronology is the only reason to combine them; moving lifecycle
  policy alone does not justify changing a case's task or retiring its distinct
  protection.
- **Pull-request and handoff summary:** Include Workflow or Handbook
  responsibility kind and boundary, reading-scene or professional research,
  owner comparison, and authoritative Knowledge and reference placement
  alongside the unmodified evidence required by
  [Prepare pull-request and handoff evidence](../../../../knowledge-base/plugin/references/agents/skill-authoring.md#prepare-pull-request-and-handoff-evidence).
