---
name: maintain-knowledge-base
description: Assess contribution classification, ownership, and placement, or maintain content in this knowledge-base repository. Use for read-only contribution triage and authorized changes to its Knowledge, Workflow Skills, Handbook Skills, Skill references, or maintained Agent instructions and prompts.
---

# Maintain the knowledge base

Classify every affected responsibility before choosing its final artifact or
operation.

An **affected responsibility unit** is the smallest complete block of meaning,
reading-route behavior, or task execution owned by one responsibility that the
authorized change can make stale or incoherent. Its required route and consumer
repairs are part of the change effect, but do not authorize changes to
independent behavior.

## Workflow

1. Resolve repository paths relative to this `SKILL.md`; the repository root is
   `../../..`. Establish whether the request is assessment-only or authorizes
   edits; keep assessment read-only. Treat any authorized change as the mutation
   boundary. Read the affected plugin's authoring rules and enough surrounding content to
   judge the complete effect, but request an
   expanded scope before changing an independent responsibility, public trigger,
   or consumer not required to leave the authorized change coherent.
2. Read
   [Assess contribution scope](../../../knowledge-base/plugins/knowledge-base/references/agents/contribution-scope-assessment.md)
   before fixing consumers, classification, or ownership. Apply it to new
   contributions and to review or maintenance of existing content. Keep its
   analysis distinct from the mutation boundary established in step 1.
   During triage and placement, enforce the
   [dependency-boundary, symmetric downstream-project independence and domain-model neutrality, product-interface isolation, and one-way delegation gates](../../../AGENTS.md#repository-architecture):
   route generalizable guidance to the owning plugin under
   `knowledge-base/plugins/<plugin-name>/` (using
   `knowledge-base/plugins/knowledge-base/` for cross-domain general-purpose
   guidance),
   isolate product-interface contracts to explicit product-interaction
   workflows, keep repository-coupled or product-architecture rules in
   [repository-maintenance workflows](../../../GLOSSARY.md#repository-maintenance-workflow)
   under `.agents/` delegating one-way to `knowledge-base/plugins/knowledge-base/`, and leave
   non-generalizable source-project material outside installed plugins.
3. Read
   [`references/agents/knowledge-and-skills.md`](../../../knowledge-base/plugins/knowledge-base/references/agents/knowledge-and-skills.md),
   then identify every distinct part's intended consumers, maintenance
   lifecycle, and retrieval source, applying its boundary tests.
4. Classify every new, changed, moved, or removed affected responsibility unit
   as Knowledge, Workflow Skill, Handbook Skill, Skill reference,
   repository-maintenance workflow/reference (only when repository-coupled or
   product-architecture-specific per
   [`AGENTS.md`](../../../AGENTS.md#repository-architecture)), mixed, or another
   repository-owned artifact using that model. Keep subject understanding in
   Knowledge, task execution in a Workflow, coherent required-reading selection
   in a Handbook, and step-selected support in the Skill or an appropriately
   scoped reference. Keep repository instructions, prompts, implementation, and
   other material that owns none of those responsibilities in its actual
   artifact type.
5. Inventory relevant existing Knowledge, Workflow Skills, Handbook Skills, and
   references in every applicable package or authoring scope. Start from the
   user's work, concrete reader decisions, and required understanding. Keep
   Knowledge ownership separate from the reading bundles that need several
   documents together, then compare candidates' pre-edit responsibilities,
   consumers, reading or invocation triggers, and maintenance lifecycles. For
   Knowledge, apply the
   [ownership and retrieval assessment](references/maintain-knowledge.md#ownership-and-generalization)
   before concluding that an existing owner fits. For Skill placement and
   product-taxonomy modeling, follow
   [Agent Skill authoring](../../../knowledge-base/plugins/knowledge-base/references/agents/skill-authoring.md)
   for generic Skill craft alongside
   [Choose the Skill responsibility](references/maintain-skill.md#choose-the-skill-responsibility),
   [Model a Handbook Skill](references/maintain-skill.md#model-a-handbook-skill),
   and
   [Skills and references](../../../knowledge-base/AGENTS.md#skills-and-references);
   prefer an existing owner when it already owns the responsibility and report
   why no existing owner fits every new artifact.
   For affected reading or invocation conditions, complete
   [Establish coverage before drafting](../../../knowledge-base/plugins/knowledge-base/references/agents/selection-triggers.md#establish-coverage-before-drafting)
   before proposing wording or rewriting the target, applying
   [Handbook and Workflow selection triggers](references/maintain-skill.md#handbook-and-workflow-selection-triggers)
   for Knowledge-plugin Workflow descriptions, Handbook descriptions, and Handbook
   package conditions. Carry its coverage
   boundaries and request cases into the artifact-specific workflows below.
6. If any affected part is maintained factual, explanatory, or instructional
   documentation, read
   [Maintained document quality](../../../knowledge-base/plugins/knowledge-base/knowledge/documentation/maintained-document-quality.md)
   and apply it throughout the applicable maintenance workflow. When that
   documentation describes software behavior, interfaces, implementation,
   operation, or decisions, or a software change may invalidate it, also read
   [Software-development documentation](../../../knowledge-base/plugins/knowledge-base/knowledge/documentation/software-development-documentation.md).
7. Read each affected artifact as a whole together with the routes and
   consumers needed to judge it. Read every applicable artifact workflow named
   below and complete its analysis up to, but not including, application of a
   parent-selected operation. Reclassify any material that a branch returns.
   For mixed material, analyze the Knowledge part first, then the Workflow or
   Handbook part, then its references.
8. Using the completed artifact-specific analysis, design the complete proposed
   result and artifact set by subject responsibility, user task, reading bundle,
   retrieval or invocation timing, consumers, and maintenance lifecycle. When proposing a
   substantive revision, state the structural judgment in a work update using
   [Keep revisions coherent](../../../knowledge-base/plugins/knowledge-base/knowledge/documentation/maintained-document-quality.md#keep-revisions-coherent)
   and proceed within the existing authorization. For purely mechanical edits,
   confirm that meaning and structure are unchanged without a full structural
   assessment.
9. For each substantive proposal, choose the operations that realize that
   structure across the complete affected responsibility units. Compare making
   no change, deleting, rewriting, adding, merging, splitting, and moving before
   editing. Prefer replacement or consolidation when material corrects,
   duplicates, or supersedes existing content; do not fit an independently
   needed responsibility into an existing owner when its assessed retrieval or
   invocation timing, consumers, or maintenance lifecycle requires separate
   ownership.
   Use progressive disclosure for branch-only detail when it improves
   the reader's path. Select for the clarity and coherence of the final content;
   diff size does not constrain the necessary rewrite within the authorized
   responsibility boundary.
   For assessment-only work, report the classification, structural judgment,
   proposed operations and destinations, unresolved decisions, and validation
   limits. Include the required
   [ownership and retrieval account](references/maintain-knowledge.md#ownership-and-generalization)
   for Knowledge placement conclusions. Stop here without applying operations
   or claiming remediation.
10. Resume each applicable artifact workflow and apply the selected operations.
    For each Knowledge part, use
    [`references/maintain-knowledge.md`](references/maintain-knowledge.md) and
    complete that workflow. For each Workflow or Handbook part, use
    [`references/maintain-skill.md`](references/maintain-skill.md) and complete
    that workflow. For each Skill-reference part, use
    [`references/maintain-skill-reference.md`](references/maintain-skill-reference.md)
    and complete that workflow. For mixed material, finish the Knowledge branch
    first, then stabilize the Workflow and Handbook responsibilities before
    finalizing their references. Maintain other repository-owned explanatory or instructional
    artifacts directly under the parent quality gate and their governing project
    standards. Before finalizing any resulting document, apply
    [Establish authority and evidence](../../../knowledge-base/plugins/knowledge-base/knowledge/documentation/maintained-document-quality.md#establish-authority-and-evidence)
    for the boundary between authoring evidence and reader-facing content.
    Before editing automated tests, use
    [`workflow-manage-automated-tests`](../../../knowledge-base/plugins/knowledge-base/skills/workflow-manage-automated-tests/SKILL.md)
    (selecting new protection for a production behavior or bounded coverage need
    through its new-coverage sub-flow, and reviewing coverage, an existing or
    proposed test, or test execution through its review sub-flow, which retains
    any coverage work selected by that review).
11. Perform a self-check of the composed result using
    [suitability review](../../../knowledge-base/plugins/knowledge-base/knowledge/documentation/maintained-document-quality.md#validate-the-result)
    and check for hidden prerequisites, scattered conditions, or broken routes.
    When that self-check, new requirements, or feedback invalidate the
    structural judgment, return to steps 7–9 and assess the cumulative change
    before further editing.
12. When the final diff changes `knowledge-base/plugins/*/knowledge/**`,
    `knowledge-base/plugins/*/references/**`, or
    `knowledge-base/plugins/*/skills/**`, follow
    [`references/update-knowledge-base-version.md`](references/update-knowledge-base-version.md)
    after the content stabilizes.
13. Run `pnpm check` and `git diff --check`. Assess probe risk per
    [Verify reader understanding](../../../knowledge-base/plugins/knowledge-base/references/agents/reader-understanding.md#assess-probe-risk)
    (plus
    [Prove Handbook and Workflow behavior](references/maintain-skill.md#prove-handbook-and-workflow-behavior)
    when Knowledge-plugin Skills changed), run targeted weak-model or blind
    selection probes when warranted, repair any exposed document blind spots
    in the authoritative content, and re-probe the affected passage or
    scenario.
14. Assemble a concise pull-request summary (or handoff summary when authoring
    stops before a pull request exists) per
    [`AGENTS.md`](../../../AGENTS.md#behavioral-and-documentation-change-summary)
    covering classification, affected responsibility units, structural
    rationale for substantive revisions, changed routes/consumers, generated
    plugin version(s), deterministic checks, and the probe decision (low-risk
    skip rationale, or probed target, surfaced blind spot, and fix), leaving
    final semantic, suitability, and probe-coverage review to pull-request AI
    review.

## Completion criteria

An assessment is complete only when its report includes the required
[ownership and retrieval account](references/maintain-knowledge.md#ownership-and-generalization)
for Knowledge placement conclusions, applies the dependency-boundary,
domain-model-neutrality, and product-interface-isolation checks for `.agents/`
and plugin proposals, and explicitly identifies unresolved evidence. An
unsupported fit conclusion leaves the assessment incomplete.

For authorized delivery, finish only when:

- Every affected part is classified and placed in its single authoritative home
  satisfying [`AGENTS.md`](../../../AGENTS.md#repository-architecture), with
  one-way delegation from `.agents/` to `knowledge-base/plugins/knowledge-base/`,
  downstream-project independence and domain-model neutrality for
  general-purpose user-facing content, and product-interface contracts
  isolated to explicit product-interaction workflows.
- Knowledge, Skills, and Skill references under `knowledge-base/plugins/*/` satisfy
  [`knowledge-base/AGENTS.md`](../../../knowledge-base/AGENTS.md), every
  changed route and reference resolves, and `pnpm check` and `git diff --check`
  pass. Other affected repository artifacts remain in the form that owns
  their responsibility and satisfy coherent-current-model quality
  ([Maintained document quality](../../../knowledge-base/plugins/knowledge-base/knowledge/documentation/maintained-document-quality.md))
  and their governing project standards.
- Author self-check confirms clear current content with no unresolved
  suitability defects, and any risk-warranted probes per
  [Verify reader understanding](../../../knowledge-base/plugins/knowledge-base/references/agents/reader-understanding.md)
  have confirmed document blind spots repaired and re-probed.
- When `knowledge-base/plugins/*/knowledge/**`,
  `knowledge-base/plugins/*/references/**`, or `knowledge-base/plugins/*/skills/**`
  changed, the PR-scoped plugin version(s) and their validation are
  current
  ([update-knowledge-base-version.md](references/update-knowledge-base-version.md)).
- The pull-request description (or handoff when authoring stops before a pull
  request exists) includes the concise summary required by
  [`AGENTS.md`](../../../AGENTS.md#behavioral-and-documentation-change-summary).
