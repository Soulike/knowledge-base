# Place generalizable procedures by dependency boundary

## Identity

- ID: dependency-boundary-placement
- Kind: application

## Covered objects

- [Repository conventions](../../AGENTS.md)
- [Product authoring rules](../../knowledge-base/AGENTS.md)
- [Content-maintenance Skill](../../.agents/skills/maintain-knowledge-base/SKILL.md)
- [Classification reference](../../knowledge-base/plugin/references/agents/knowledge-and-skills.md)

## Protected behavior

Generalizable authoring, documentation, or evaluation procedures must live in
`knowledge-base/plugin/` even when they originate while maintaining this
repository, with repository-maintenance workflows delegating one-way without
restating, splitting, or overriding product-owned rules. Protect the dependency
boundary and single-authority rule against audience-based `.agents/` placement
and cross-layer duplication, while allowing different valid placement wording,
candidate owner comparisons, and presentation order.

## Task

During maintenance of this repository, reviewers encountered conflicting
judgments when independent Agents evaluated whether a revised guide preserved
existing obligations. A maintainer proposes documenting a reusable
**conflict-resolution and rubric-calibration procedure** for independent Agent
evaluators—how to compare opposing reviewer conclusions against raw
observations, test an ambiguous rubric against paired satisfactory and faulty
controls, and record unresolved disagreements. Every step and criterion of that
procedure remains valid for any project without depending on this repository's
directory layout, Knowledge Catalog, plugin versioning, or CI gates; only the
rule stating which repository PR validation stage invokes it is coupled to this
repository.

Prepare a read-only classification, placement, and delegation assessment that
evaluates all three options:

1. Place the complete conflict-resolution and rubric-calibration procedure inside
   `.agents/` (for example under `.agents/references/` or
   `.agents/skills/maintain-knowledge-base/references/`) because the procedure
   originated to support repository maintenance work and maintainers will read
   it;
2. Place the generalizable procedure inside `knowledge-base/plugin/` (checking
   existing shared Agent references before adding a separate reference, and
   keeping its text independent of `.agents/`, the repository layout, Catalog,
   and CI), while keeping only repository-coupled invocation and gate
   orchestration in `.agents/` via one-way delegation;
3. Place the procedure in `knowledge-base/plugin/` and also maintain a
   paraphrased summary of its core calibration and resolution rules inside
   `.agents/` so repository-maintenance workflows have local rules alongside
   it.

State which option is accepted, why the other two are rejected, how the
material should be classified, and what boundary constraints apply to each
layer. Do not modify any repository files.

## Starting state

Supply the complete current four covered documents and their required normative
routes in read-only access to the supplied repository snapshot. Do not supply
Spec #283, ticket #287, or PR history; the maintained guidance alone must
establish the placement and delegation rules.

Keep the task read-only: no files may be created, modified, or deleted. Record
the files read and the classification, boundary, and delegation rationale.

## Expected behavior

- R1 (critical): reject placing the generalizable conflict-resolution and
  rubric-calibration procedure in `.agents/` (Option 1). Explain that
  originating during repository maintenance or serving maintainers does not
  keep generalizable guidance in `.agents/`; because the procedure remains valid
  independently of this repository's layout, Catalog, versioning, or CI gates,
  the dependency-boundary rule assigns it to `knowledge-base/plugin/`.
- R2 (critical): accept Option 2, placing the generalizable procedure in
  `knowledge-base/plugin/` (comparing existing `knowledge-base/plugin/` owners
  before adding a new reference) and ensuring its content preserves
  downstream-project independence without relying on `.agents/`, repository
  checkout layout, Catalog rules, or CI gates.
- R3 (critical): reject duplicating, paraphrasing, splitting, or locally
  overriding the general rules in `.agents/` (Option 3). Retain only
  repository-coupled triggers, gates, or orchestration in `.agents/`,
  delegating one-way to `knowledge-base/plugin/`.
- R4: classify the procedure's responsibility accurately (applying the boundary
  tests and checking whether it serves as a step-selected Skill or shared Agent
  reference rather than Knowledge or a repository-maintenance workflow) and keep
  the assessment read-only without claiming file edits or unobserved checks.

## Verification

Inspect the returned placement assessment and file-read account.

A controlled faulty assessment that assigns the generalizable procedure to
`.agents/` because it originated for repository maintenance, that keeps a
paraphrased summary of the general calibration rules in `.agents/` alongside
the `knowledge-base/plugin/` authority, or that embeds `.agents/` paths or
repository CI gates inside `knowledge-base/plugin/` content must fail the
corresponding critical criterion.

## Source

Derived from GitHub issue #283 and ticket #287, which replaced the
audience-based `.agents/` exemption with the dependency-boundary,
single-authority, and one-way delegation rules across `AGENTS.md`,
`knowledge-base/AGENTS.md`, and `maintain-knowledge-base`. This new application
case requires fresh validation against the current integrated guidance.
