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
   [Assess contribution scope](../../../knowledge-base/plugin/references/agents/contribution-scope-assessment.md)
   before fixing consumers, classification, or ownership. Apply it to new
   contributions and to review or maintenance of existing content. Keep its
   analysis distinct from the mutation boundary established in step 1.
   Apply the downstream-project-independence gate from
   [`AGENTS.md`](../../../AGENTS.md#repository-architecture) to every part
   intended for Knowledge or a usage Skill, leaving non-generalizable material
   in its source project. When a proposal or change touches
   [repository-maintenance workflows](../../../GLOSSARY.md#repository-maintenance-workflow)
   or their references under `.agents/`, also apply the
   [dependency-boundary and one-way delegation rule](../../../AGENTS.md#repository-architecture):
   any guidance, judgment criterion, or evaluation procedure that remains valid
   independently of this repository's layout, catalogs, versioning, or CI gates
   belongs in `knowledge-base/plugin/` (or the applicable plugin package) with
   one-way delegation from `.agents/`, rather than originating or remaining in
   `.agents/` or duplicating product-owned rules.
3. Read
   [`references/agents/knowledge-and-skills.md`](../../../knowledge-base/plugin/references/agents/knowledge-and-skills.md),
   then identify every distinct part's intended consumers, maintenance
   lifecycle, and retrieval source, applying its boundary tests.
4. Classify every new, changed, moved, or removed affected responsibility unit
   as Knowledge, Workflow Skill, Handbook Skill, Skill reference,
   repository-maintenance workflow/reference (only when repository-coupled per
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
   before concluding that an existing owner fits. For Skill placement, follow
   [Agent Skill authoring](../../../knowledge-base/plugin/references/agents/skill-authoring.md)
   and
   [Skills and references](../../../knowledge-base/AGENTS.md#skills-and-references);
   prefer an existing owner when it already owns the responsibility and report
   why no existing owner fits every new artifact.
   For affected reading or invocation conditions, complete
   [Establish coverage before drafting](../../../knowledge-base/plugin/references/agents/selection-triggers.md#establish-coverage-before-drafting)
   before proposing wording or rewriting the target. Carry its coverage
   boundaries and request cases into the artifact-specific workflows below.
   For authorized maintenance, also apply
   [Discover and select regression cases](../../references/agent-regression-tests.md#discover-and-select)
   before editing. Check nearby cases and reverse coverage links across the
   complete repository inventory, including joint cases, reference consumers,
   and affected competing routes. Carry the selected historical cases and
   selection reasons and any required
   [case-value and organization review](../maintain-knowledge-base-tests/SKILL.md#review-case-value-and-organization)
   scope into final validation; a placement assessment alone does
   not require replay.
6. If any affected part is maintained factual, explanatory, or instructional
   documentation, read
   [Maintained document quality](../../../knowledge-base/plugin/knowledge/documentation/maintained-document-quality.md)
   and apply it throughout the applicable maintenance workflow. When that
   documentation describes software behavior, interfaces, implementation,
   operation, or decisions, or a software change may invalidate it, also read
   [Software-development documentation](../../../knowledge-base/plugin/knowledge/documentation/software-development-documentation.md).
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
   [Keep revisions coherent](../../../knowledge-base/plugin/knowledge/documentation/maintained-document-quality.md#keep-revisions-coherent)
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
    [Establish authority and evidence](../../../knowledge-base/plugin/knowledge/documentation/maintained-document-quality.md#establish-authority-and-evidence)
    for the boundary between authoring evidence and reader-facing content. For
    creation or maintenance of Agent-behavior regression
    cases within the authorized task, follow
    [maintain-knowledge-base-tests](../maintain-knowledge-base-tests/SKILL.md).
    Before editing other tests, route by the responsibility that
    started the work. Direct selection of new protection for a production
    behavior or bounded coverage need uses
    [`workflow-write-effective-tests`](../../../knowledge-base/plugin/skills/workflow-write-effective-tests/SKILL.md).
    Review of coverage, an existing or proposed test, or test execution uses
    [`workflow-review-and-improve-tests`](../../../knowledge-base/plugin/skills/workflow-review-and-improve-tests/SKILL.md),
    which retains any coverage work selected by that review.
11. Review the composed result using the loaded Knowledge's
    [suitability review](../../../knowledge-base/plugin/knowledge/documentation/maintained-document-quality.md#validate-the-result).
    Record the reader task, relevant locations, and outcome separately from
    semantic correctness. When that result, new requirements, or feedback
    invalidate the structural judgment, return to steps 7–9 and assess the
    cumulative change before further editing.
12. When the final diff changes `knowledge-base/plugin/knowledge/**`,
    `knowledge-base/plugin/references/**`, or
    `knowledge-base/plugin/skills/**`, follow
    [`references/update-knowledge-base-version.md`](references/update-knowledge-base-version.md)
    after the content stabilizes.
13. Follow [Final validation](#final-validation) to replay selected historical
    cases and, when meaning or structure changed, complete the independent
    final-content review and required reader-understanding checks. Coordinate
    their observations and judgments rather than scheduling separate reviews
    for evidence that the same reviewer can assess.
14. Review the combined result and assemble the pull-request description (or
    handoff when authoring stops before a pull request exists) per
    [`AGENTS.md`](../../../AGENTS.md#behavioral-and-documentation-change-evidence).
    Include the repository-maintenance record: classification, affected
    responsibility units, dependency-boundary placement for `.agents/` changes,
    operations performed, changed Catalog, Handbook, Workflow, and reference
    routes and consumers, generated `knowledge-base` plugin version when
    applicable, final structural judgment and organizational rationale for
    substantive revisions, mechanical and semantic validation performed, and
    the final-content suitability conclusion (with examined reader task and
    relevant final locations) separate from semantic correctness and
    project-check results.
    Assemble all unmodified applicable evidence without collapsing observations
    into topic-only notes or aggregate pass claims, keeping each observation
    and attempt outcome adjacent to its producing executor identity and
    capability-relevant configuration:
    - **Skills:** include the design, comparison, scenario, and attempt
      evidence required by
      [Prepare pull-request and handoff evidence](../../../knowledge-base/plugin/references/agents/skill-authoring.md#prepare-pull-request-and-handoff-evidence).
    - **Reader understanding:** for primary-product Knowledge, Skills, and
      Skill references requiring cross-model verification, include the
      [required reader-understanding evidence](../../../knowledge-base/plugin/references/agents/reader-understanding.md#required-evidence),
      preserving actual reader paraphrase, concrete application decisions, and
      reported confusion or ambiguity tied to the relevant passages (or confirm
      the purely mechanical reduced-evidence boundary when applicable).
    - **Behavioral regression cases:** include the inventory and selection
      scope (explicitly recording a confirmed empty inventory; failed discovery
      is incomplete), tested source and author-matched model basis, case
      observations, attempt outcomes, case or contract changes, and remaining
      gaps required by
      [Behavioral regression cases](../../references/agent-regression-tests.md#pull-request-and-handoff-regression-evidence).
      Preserve distinct effective validation cases through
      [maintain-knowledge-base-tests](../maintain-knowledge-base-tests/SKILL.md)
      when case authoring is within the authorized task, rather than treating
      temporary validation runs as permanent protection.
    - **Other maintained instructions and prompts:** for semantic or structural
      changes, include affected responsibilities, final-content suitability and
      independent review conclusions, and remaining limitations.
      Keep lasting rules in their authoritative Knowledge, Skill, or reference
      rather than adding a design-history document.

## Final validation

Use the following order. Selected regression cases require replay; a change of
meaning or structure also requires independent final-content review. New or
substantively changed primary-product Knowledge, Workflow Skills, Handbook
Skills, and Skill references additionally require cross-model
reader-understanding verification per
[Reader understanding](../../../knowledge-base/AGENTS.md#reader-understanding)
and
[Verify reader understanding](../../../knowledge-base/plugin/references/agents/reader-understanding.md).
Purely mechanical edits retain their reduced-evidence confirmation that
meaning, structure, and required reader actions are unchanged.

1. Prepare a fresh capable reviewer or isolated review context when independent
   judgment is required, following
   [Agent behavioral evaluation](../../../knowledge-base/plugin/references/agents/behavioral-evaluation.md).
   For affected selections, first apply
   [Check selection from requests](../../../knowledge-base/plugin/references/agents/selection-triggers.md#check-selection-from-requests):
   give that reviewer the request cases established before drafting and the real
   candidate set, and record its choices before it sees target contents or
   expected selections. For a selected Handbook, separately record every
   package choice from current work before revealing expected packages. Keep
   both observations separate from later reading, application, and judgment.
2. Gather execution evidence against the final content using
   [Agent behavioral evaluation](../../../knowledge-base/plugin/references/agents/behavioral-evaluation.md)
   for fresh-context isolation, inherited-boundary recording, evaluator-only
   withholding, the verbatim
   [executor instructions guard](../../../knowledge-base/plugin/references/agents/behavioral-evaluation.md#executor-instructions),
   [dispatch templates](../../../knowledge-base/plugin/references/agents/behavioral-evaluation.md#dispatch-templates),
   and execution recording, together with
   [Behavioral regression cases](../../references/agent-regression-tests.md#replay-policy-and-review-schedule)
   for author-matched historical case replay. Separately run any applicable
   lower-capability Skill-authoring
   ([Prove the behavior](../../../knowledge-base/plugin/references/agents/skill-authoring.md#prove-the-behavior))
   or reader-understanding
   ([Verify reader understanding](../../../knowledge-base/plugin/references/agents/reader-understanding.md))
   checks in fresh contexts. Reuse existing runs only when they observed the
   same final content and supply all required observations (including actual
   paraphrase, application decisions, and confusion reports where reader
   understanding applies). Collect raw observations and applicable
   program-assertion results before requesting semantic judgments; the reviewer
   may inspect the explanation during preparation, but defer the combined
   verdict until required execution observations are available or explicitly
   incomplete.
3. Supply that same capable reviewer with the reviewer handoff template in
   [Agent behavioral evaluation](../../../knowledge-base/plugin/references/agents/behavioral-evaluation.md#dispatch-templates)
   (active instructions, applicable standards, accepted requirements, raw final
   artifacts, trusted pre-change state, case contracts, and actual
   observations without author conclusions). Combine open case judgments,
   final-content suitability and semantic review
   ([Validate the result](../../../knowledge-base/plugin/knowledge/documentation/maintained-document-quality.md#validate-the-result)),
   the capable explanation examination from
   [Examine the explanation](../../../knowledge-base/plugin/references/agents/reader-understanding.md#examine-the-explanation),
   and any required
   [case-value and organization review](../maintain-knowledge-base-tests/SKILL.md#review-case-value-and-organization)
   into that single scheduled review. Keep suitability, semantic correctness,
   reader-understanding observations, case judgments, and case-value
   dispositions distinct, and verify that retained, moved, split, and merged
   responsibilities remain reachable and usable from every required starting
   point.
4. Investigate failures and missing evidence at their owners; obtain missing
   observations through neutral follow-ups rather than repeating sufficient
   runs. Repair confirmed defects in authoritative reader-facing content within
   scope and repeat affected observations and independent review in fresh
   contexts. Retain every attempt and classify results per
   [Judge and retain attempts](../../../knowledge-base/plugin/references/agents/behavioral-evaluation.md#judge-and-retain-attempts)
   and
   [Resolve and repeat](../../../knowledge-base/plugin/references/agents/reader-understanding.md#resolve-and-repeat).
   Historical passes do not replace independent final-content review.
   Unavailable required review or cross-model evidence, unresolved
   reader-understanding defects, or selected cases that fail or lack trusted
   evidence leave affected maintenance incomplete.

## Completion criteria

An assessment is complete only when its report includes the required
[ownership and retrieval account](references/maintain-knowledge.md#ownership-and-generalization)
for Knowledge placement conclusions, applies the dependency-boundary check for
`.agents/` proposals, and explicitly identifies unresolved evidence. An
unsupported fit conclusion leaves the assessment incomplete.

For authorized delivery, finish only when:

- Every affected part is classified and placed in its single authoritative home
  satisfying [`AGENTS.md`](../../../AGENTS.md#repository-architecture), with
  one-way delegation from `.agents/` to `knowledge-base/plugin/` and
  downstream-project independence for user-facing content.
- Primary-product Knowledge, Skills, and Skill references satisfy
  [`knowledge-base/AGENTS.md`](../../../knowledge-base/AGENTS.md), every
  changed route and reference resolves, and `pnpm check` passes. Other affected
  repository artifacts remain in the form that owns their responsibility and
  satisfy coherent-current-model quality
  ([Maintained document quality](../../../knowledge-base/plugin/knowledge/documentation/maintained-document-quality.md))
  and their governing project standards.
- Final-content suitability review and independent review establish no
  introduced suitability defect or unexplained semantic change.
- Primary-product Knowledge, Skills, and Skill references have required
  cross-model reader-understanding evidence
  ([Verify reader understanding](../../../knowledge-base/plugin/references/agents/reader-understanding.md))
  with confirmed gaps repaired and re-checked in a fresh context (or confirmed
  mechanical-only reduced evidence).
- Every selected historical regression case has trusted passing evidence, and
  any required case-value and organization review and authorized cleanup are
  complete.
- When `knowledge-base/plugin/knowledge/**`,
  `knowledge-base/plugin/references/**`, or `knowledge-base/plugin/skills/**`
  changed, the PR-scoped `knowledge-base` plugin version and its validation are
  current
  ([update-knowledge-base-version.md](references/update-knowledge-base-version.md)).
- The final pull-request description or handoff assembles all required
  unmodified observations, identities, configurations, and limitations per
  [`AGENTS.md`](../../../AGENTS.md#behavioral-and-documentation-change-evidence).
