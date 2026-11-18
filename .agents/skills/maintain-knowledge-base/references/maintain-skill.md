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

Start from the user's work and the decisions or understanding it requires, not
from a requested file type, the first wording of a request, or an existing Skill
boundary. Use
[Classifying Knowledge and Skill material](../../../../knowledge-base/plugin/references/agents/knowledge-and-skills.md)
to separate four product responsibilities:

- canonical subject understanding belongs in Knowledge;
- decisions and actions that produce a user's result belong in a Workflow Skill;
- selection and mandatory reading for a coherent task family, technical domain,
  or stable platform context belong in a Handbook Skill; and
- material selected only by one Skill step belongs in the Skill or a Skill
  reference.

Do not put task execution into a Handbook Skill or turn a reading route into a
Workflow Skill whose promised result is merely that files were loaded. Do not
copy canonical Knowledge into either kind. When proposed material mixes
responsibilities, split and stabilize the Knowledge owners before finalizing
Workflow or Handbook routes. Delegate generic Skill-authoring craft one-way to
[Agent Skill authoring](../../../../knowledge-base/plugin/references/agents/skill-authoring.md).

## Model a Workflow Skill

A Workflow Skill owns one independently invoked user task—its decisions,
actions, tool use, failure and stopping behavior, outputs, and completion
criteria—and needs one triggering task and one complete result even when it
branches over input states. Read applicable canonical Knowledge directly when an
execution step requires it rather than relying on native co-selection of a
Handbook or copying Knowledge into the Workflow.

Separate Workflow tasks that have different accepted input states, results,
completion states, privileged effects, or maintenance lifecycles even when they
share Knowledge. Different domains can remain branches when the user task and
Workflow are the same, while similar Knowledge remains in separate Workflows
when direction or completion differs. Do not use Skill-to-Skill orchestration
as a substitute for a correct task boundary, direct Knowledge reading, or
progressive disclosure.

Delegate generic task modeling, professional research, evidence-tied
requirements, ordered imperative workflow authoring, observable postconditions,
and completion gates one-way to
[Agent Skill authoring](../../../../knowledge-base/plugin/references/agents/skill-authoring.md).

## Model a Handbook Skill

Start from concrete user work and the understanding needed to make its decisions.
Inventory the canonical Knowledge responsibilities first; keep Knowledge leaves
separate when their subject ownership or maintenance lifecycle differs even
when one Handbook reads them together.

Compare the proposed reading scene with every existing Handbook Skill. Reuse or
extend an existing owner when it already covers the same user task family,
technical domain, or stable platform context. Add a Handbook only for a distinct
native entry that readers can recognize before opening another Skill—never as a
narrow 1:1 wrapper scoped to one Knowledge leaf or specific condition. A
distinct, self-contained domain, framework, or platform context may start
sparsely with a single curated Knowledge leaf (explicitly non-exhaustive, with
valid no-match behavior), and co-selection with a broader language or general
engineering Handbook does not mean that broader Handbook owns the specialized
domain's scene. Do not use Handbook-to-Handbook orchestration to compensate for
a weak boundary.

A Handbook body may contain:

- a **foundation**: canonical Knowledge required for the Handbook's primary
  artifact work; and
- **conditional required-reading packages**: complete reading units selected
  from observable work, current materials, language, platform, production
  method, or task stage.

Include a foundation only when its Knowledge is genuinely common to the primary
scene; a Handbook with no common current Knowledge has a valid empty
foundation. Evaluate every package condition and require every match
cumulatively. Give a direct focused-learning or explanation request about a
package's subject its own matching route that reads that package without
forcing an unrelated artifact-work foundation. Package conditions must not
require a risk, exception, or diagnosis that the selected Knowledge is meant to
uncover.

Use a complete canonical Knowledge file or a complete context-sufficient
section as the reading unit. A context-sufficient section includes the
definitions, premises, subsections, and important exceptions needed to apply it
independently.

Give shared reading-lifecycle rules one authoritative home. When a shared
policy is independently required at task start and recovery—such as the
collaboration Handbook's
[shared reading lifecycle](../../../../knowledge-base/plugin/references/agents/independent-collaboration.md#keep-guidance-current)—it
owns reuse, rereading, and reassessment as work or context changes across
Handbooks. Verify that the shared policy is selected and applied alongside
subject Handbooks rather than making Handbooks invoke each other or copying
lifecycle policy into every subject Handbook. Where no such shared policy
exists, the owning Handbook must supply the lifecycle rules itself.

A Handbook owns selection and mandatory reading obligations only. It has no
user-task procedure, side-effect contract, task failure state, output artifact,
or task completion gate. A broad platform Handbook routes the curated Knowledge
that exists and does not claim exhaustive platform coverage.

## Assign Knowledge, references, and bundle ownership

Complete missing independently retrievable understanding as canonical Knowledge
(and register it in
[knowledge/index.md](../../../../knowledge-base/plugin/knowledge/index.md))
before finalizing a Workflow or Handbook Skill that depends on it. Workflows
may read canonical Knowledge directly at the step that requires it. Handbooks
must link every required canonical reading unit directly relative to their
`SKILL.md`; they may not invoke or depend on another Handbook or hide a route
behind an unguaranteed Skill-to-Skill call.

Treat packaged Knowledge and Skills as supplemental when active-project
instructions, requirements, Skills, or domain decisions conflict. Delegate
generic bundle portability, working-directory precedence, registered-name
references, and reference split-or-merge rules one-way to
[Agent Skill authoring](../../../../knowledge-base/plugin/references/agents/skill-authoring.md).

## Write a Handbook body

State that the Handbook supplies required understanding and remains supplemental
to instructions, requirements, Skills, and domain decisions in the active
working directory. Tell the Agent to evaluate the foundation (when present) and
every package condition cumulatively from current observable work, read all
matches, and avoid choosing only the nearest package. Route directly to each
complete canonical Knowledge file or context-sufficient section rather than
through the Knowledge Catalog or another Handbook.

Make foundation applicability, focused learning without forcing an unrelated
foundation, and cumulative package selection explicit. Keep reuse, rereading,
and reassessment at the shared reading-lifecycle owner when one governs the
reading scene, rather than copying its policy into every Handbook. If no
package matches in a sparse platform or domain Handbook, state explicitly that
the Agent should continue without loading unrelated material or implying that
the platform is comprehensively documented. Do not add a task procedure,
completion criteria, output artifact, or hidden dependency on another Handbook.

## Handbook and Workflow selection triggers

Delegate generic trigger coverage analysis, earliest-observable-point drafting,
and blind request checking one-way to
[Design selection triggers](../../../../knowledge-base/plugin/references/agents/selection-triggers.md)
([Establish coverage before drafting](../../../../knowledge-base/plugin/references/agents/selection-triggers.md#establish-coverage-before-drafting),
[Write the condition](../../../../knowledge-base/plugin/references/agents/selection-triggers.md#write-the-condition),
and
[Check selection from requests](../../../../knowledge-base/plugin/references/agents/selection-triggers.md#check-selection-from-requests)).
Apply these product-specific description, package-condition, and verification
rules:

- **Coverage separation:** For a Handbook, separate native description
  coverage (one task family, technical domain, or stable platform context) from
  internal package coverage (the Knowledge required for current work inside
  that scene). Do not copy every old leaf condition into descriptions or create
  one Handbook per Knowledge leaf.
- **Workflow descriptions:** Put the complete independently invoked user-task
  boundary and promised result in the frontmatter description. By default,
  state the user-visible capability or result and a short condition beginning
  with `Use when` or `Use before`, using `Use before` when selection must
  precede proposals or actions the Workflow constrains. Keep internal steps
  and scenario lists out unless needed to distinguish an adjacent task.
- **Handbook descriptions:** Write one short semantic applicability rule based
  on observable user work or current material. Identify the task family,
  technical domain, or stable platform context without enumerating foundations,
  packages, Knowledge topics, registered names, or internal conditions. A
  sparse platform Handbook may route only currently curated guidance and must
  not claim exhaustive platform coverage.
- **Handbook package conditions:** Select packages from observable user work,
  current materials, language, platform, production method, or task stage.
  Conditions are mandatory and cumulative: evaluate all of them and read every
  match rather than choosing the closest one. Do not require the reader to know
  a risk, exception, or diagnosis that the selected Knowledge helps uncover.
  Cover focused learning and explanation directly as its own matching
  condition without forcing an unrelated foundation, and allow an empty
  foundation when no current Knowledge is genuinely common to the primary
  scene.
- **Handbook package selection verification:** After checking native Skill
  selection blindly via
  [Check selection from requests](../../../../knowledge-base/plugin/references/agents/selection-triggers.md#check-selection-from-requests),
  give a fresh reader the Handbook's complete current body and the task
  context, then record every selected and excluded package before revealing
  expected choices. Exercise cumulative matches, focused learning, valid
  no-match platform work, overlaps, and stage changes within an
  already-selected Handbook or running Workflow. Keep package selection
  distinct from native Skill selection, and record actual Knowledge reading
  and application separately from both choices.

## Prove Handbook and Workflow behavior

Delegate generic composed-bundle review, behavioral proof scenarios, model
selection, evaluation isolation and attempt retention, cross-model
reader-understanding verification, and pull-request or handoff evidence
formatting one-way to
[Review the composed bundle](../../../../knowledge-base/plugin/references/agents/skill-authoring.md#review-the-composed-bundle),
[Prove the behavior](../../../../knowledge-base/plugin/references/agents/skill-authoring.md#prove-the-behavior),
[Prepare pull-request and handoff evidence](../../../../knowledge-base/plugin/references/agents/skill-authoring.md#prepare-pull-request-and-handoff-evidence),
[Agent behavioral evaluation](../../../../knowledge-base/plugin/references/agents/behavioral-evaluation.md),
and
[Verify reader understanding](../../../../knowledge-base/plugin/references/agents/reader-understanding.md).
Apply these product-specific trace and evidence obligations alongside those
generic rules:

- **Composed-bundle trace:** Trace Workflow actions, direct Knowledge reading,
  step-selected references, stopping behavior, outputs, and completion. For
  Handbooks, trace description selection, foundation and cumulative package
  choices, actual Knowledge reading, and application as distinct events, and
  trace later-stage reassessment, reuse, and recovery at the shared
  reading-lifecycle owner.
- **Workflow evidence:** Exercise underspecified and settled inputs, the
  principal complex branch, material conflicts or missing evidence, direct
  Knowledge reading where required, output and completion gates, and
  postcondition verification or stopping behavior for consequential actions.
- **Handbook package evidence:** Exercise fresh-reader package choices against
  the complete Handbook body across cumulative matches, empty foundations,
  focused learning without unrelated foundations, valid no-match sparse
  platform work, and work-context changes within the same Handbook that
  activate different foundations or packages.
- **Knowledge reading and application evidence:** Observe required canonical
  Knowledge file or section reads and their use in the task separately from
  native Skill selection and Handbook package selection. Static links,
  invocation events, or plausible final answers alone do not prove Knowledge
  reading and application.
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
