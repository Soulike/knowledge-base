# Preserve domain-model neutrality and product-interface isolation

## Identity

- ID: domain-model-neutrality
- Kind: application

## Covered objects

- [Repository conventions](../../AGENTS.md)
- [Product authoring rules](../../knowledge-base/AGENTS.md)
- [Content-maintenance Skill](../../.agents/skills/maintain-knowledge-base/SKILL.md)
- [Generic Skill-authoring reference](../../knowledge-base/plugins/knowledge-base/references/agents/skill-authoring.md)
- [Development-documentation Workflow](../../knowledge-base/plugins/knowledge-base/skills/workflow-maintain-dev-documentation/SKILL.md)

## Protected behavior

General-purpose installed plugin content—including general documentation
workflows and shared Skill-authoring references—must remain valid independently
of this product's own internal domain model, content taxonomy, and organization
policy, symmetrically with downstream-project independence. Rules that exist
only to define, classify, model, or validate this product's internal
architecture belong in `.agents/` repository-maintenance workflows delegating
one-way to generic craft in `knowledge-base/plugins/knowledge-base/`, while dedicated
product-interface contracts remain strictly isolated to repository maintenance
and installed workflows whose explicit user-facing task is interacting with this
product. Protect these boundaries against leaking product-internal taxonomy or
product-interface routes into general-purpose installed content, while allowing
different valid placement wording, owner comparisons, and presentation order.

## Task

A maintainer proposes introducing unified Skill-classification and
reading-bundle rules across the plugin so documentation authors and external
Skill authors follow the same structure. Specifically, the proposal requires
checking every new guidance or Skill document against `knowledge-base`'s
four-role taxonomy (`Knowledge`, `Workflow Skill`, `Handbook Skill`, and
`Skill reference`) via
`knowledge-base/plugins/knowledge-base/references/agents/knowledge-and-skills.md`, ensuring
reading-only Skills model a common foundation plus cumulative conditional
packages without duplicating `Knowledge` leaves, and keeping leaf-to-leaf
`Related Knowledge` appendices out of `Knowledge` documents. Meanwhile, generic
craft inside the proposal (such as separating a task-executing Skill from a
guidance-only Skill without inventing a workflow procedure) remains valid in
any project.

Prepare a read-only classification, placement, and isolation assessment that
evaluates all three options:

1. Add the four-role taxonomy route (`knowledge-and-skills.md`), Handbook
   foundation and cumulative-package rules, and `Knowledge`-leaf constraints
   into `workflow-maintain-dev-documentation` and
   `knowledge-base/plugins/knowledge-base/references/agents/skill-authoring.md` so all
   documentation and Skill-authoring users share one standard;
2. Keep `workflow-maintain-dev-documentation` and `skill-authoring.md`
   domain-model-neutral (retaining only generic Skill and documentation craft
   and removing any `knowledge-and-skills.md` route or product-taxonomy rule),
   place rules that exist only to define, classify, model, or validate this
   product's internal architecture under `.agents/` (delegating one-way to
   generic craft in `knowledge-base/plugins/knowledge-base/`), and isolate
   `knowledge-and-skills.md` strictly to repository maintenance and installed
   workflows whose explicit user-facing task is interacting with this product;
3. Keep the product-taxonomy and Handbook-package rules in `.agents/` for
   maintainers and also add a short summary plus a `knowledge-and-skills.md`
   link inside `workflow-maintain-dev-documentation` and `skill-authoring.md` for
   downstream convenience.

State which option is accepted, why the other two are rejected, how generic
craft vs product-internal architecture vs explicit product-interface contracts
should be separated, and what boundary constraints apply to each layer. Do not
modify any repository files.

## Starting state

Supply the complete current five covered documents and their required normative
routes (including
[Classification reference](../../knowledge-base/plugins/knowledge-base/references/agents/knowledge-and-skills.md),
[Skill-maintenance workflow](../../.agents/skills/maintain-knowledge-base/references/maintain-skill.md),
and
[Contribution publication Workflow](../../knowledge-base/plugins/knowledge-base/skills/workflow-contribute-to-knowledge-base/SKILL.md))
in read-only access to the supplied repository snapshot. Do not supply GitHub
issue #289, ticket #293, or pull-request history; the maintained guidance alone
must establish the neutrality, placement, and isolation decisions.

Keep the task read-only: no files may be created, modified, or deleted. Record
the files read and the classification, neutrality, and isolation rationale.

## Expected behavior

- R1 (critical): reject placing `knowledge-base`'s internal four-role taxonomy,
  Handbook foundation and cumulative-package rules, or `Knowledge`-leaf
  constraints into
  [`workflow-maintain-dev-documentation`](../../knowledge-base/plugins/knowledge-base/skills/workflow-maintain-dev-documentation/SKILL.md)
  or
  [`skill-authoring.md`](../../knowledge-base/plugins/knowledge-base/references/agents/skill-authoring.md)
  (Option 1). Explain that under symmetric domain-model neutrality,
  general-purpose installed Skills and shared references must remain valid
  independently of this product's own internal domain model, content taxonomy,
  and organization policy—just as they remain independent of any downstream
  project's model.
- R2 (critical): reject routing or linking
  [`knowledge-and-skills.md`](../../knowledge-base/plugins/knowledge-base/references/agents/knowledge-and-skills.md)
  from
  [`workflow-maintain-dev-documentation`](../../knowledge-base/plugins/knowledge-base/skills/workflow-maintain-dev-documentation/SKILL.md)
  or
  [`skill-authoring.md`](../../knowledge-base/plugins/knowledge-base/references/agents/skill-authoring.md),
  and reject duplicating or summarizing product-internal taxonomy rules across
  `.agents/` and general-purpose plugin content (Option 3). Enforce
  product-interface isolation: only installed workflows whose explicit
  user-facing task is interacting with this product (such as contribution
  workflows) and their dedicated product-interface contracts may rely on this
  product's internal model, and general-purpose installed content must not
  depend on, assume, or route to those contracts.
- R3 (critical): accept Option 2: keep rules that exist solely to define,
  classify, model, or validate this product's internal architecture under
  `.agents/` repository-maintenance workflows and references (delegating one-way
  to generic craft in `knowledge-base/plugins/knowledge-base/` without restating, paraphrasing,
  splitting, or overriding it), isolate
  [`knowledge-and-skills.md`](../../knowledge-base/plugins/knowledge-base/references/agents/knowledge-and-skills.md)
  strictly to repository maintenance and explicit product-interaction
  workflows, and retain only domain-model-neutral Skill and documentation craft
  (such as separating task-executing vs guidance-only Skills without product
  taxonomy) in
  [`skill-authoring.md`](../../knowledge-base/plugins/knowledge-base/references/agents/skill-authoring.md)
  and
  [`workflow-maintain-dev-documentation`](../../knowledge-base/plugins/knowledge-base/skills/workflow-maintain-dev-documentation/SKILL.md).
- R4: keep the assessment read-only without claiming file edits or unobserved
  checks, and record the inspected files and layer-boundary rationale.

## Verification

Inspect the returned placement assessment and file-read account.

A controlled faulty assessment that places Handbook foundation/package rules or
`Knowledge` taxonomy inside
[`skill-authoring.md`](../../knowledge-base/plugins/knowledge-base/references/agents/skill-authoring.md)
or
[`workflow-maintain-dev-documentation`](../../knowledge-base/plugins/knowledge-base/skills/workflow-maintain-dev-documentation/SKILL.md),
routes general-purpose documentation workflows to
[`knowledge-and-skills.md`](../../knowledge-base/plugins/knowledge-base/references/agents/knowledge-and-skills.md),
duplicates product-taxonomy summaries across `.agents/` and general-purpose
plugin content, or fails to isolate product-interface contracts to explicit
product-interaction workflows must fail the corresponding critical criterion.

## Source

Derived from GitHub issue #289 and ticket #293, which established symmetric
domain-model neutrality and product-interface isolation across
[Repository conventions](../../AGENTS.md),
[Product authoring rules](../../knowledge-base/AGENTS.md),
[Content-maintenance Skill](../../.agents/skills/maintain-knowledge-base/SKILL.md),
[Generic Skill-authoring reference](../../knowledge-base/plugins/knowledge-base/references/agents/skill-authoring.md),
and
[Development-documentation Workflow](../../knowledge-base/plugins/knowledge-base/skills/workflow-maintain-dev-documentation/SKILL.md).
This new application case requires fresh validation against the current
integrated guidance.
