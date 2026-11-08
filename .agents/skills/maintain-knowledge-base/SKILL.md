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
   [`AGENTS.md`](../../../AGENTS.md) to every part intended for Knowledge or a
   usage Skill. Generalize project-derived material only when it remains correct
   without its source project; classify non-generalizable parts as neither and
   leave them in that project.
3. Read
   [`references/agents/knowledge-and-skills.md`](../../../knowledge-base/plugin/references/agents/knowledge-and-skills.md),
   then identify every distinct part's intended consumers, maintenance
   lifecycle, and retrieval source. Apply its reading-origin, workflow-removal,
   owned-behavior, and lifecycle tests. A Knowledge candidate must have an
   independent reading need observable from installed-plugin user work, subject,
   or current material before Workflow decisions that it informs. During the
   migration, it must also retain a compatible Catalog `When to Read` route
   until the contract stage removes that runtime.
4. Classify every new, changed, moved, or removed affected responsibility unit
   as Knowledge, Workflow Skill, Handbook Skill, Skill reference, mixed, or
   another repository-owned artifact using that model. Keep subject
   understanding in Knowledge, task execution in a Workflow, coherent
   required-reading selection in a Handbook, and step-selected support in the
   Skill or an appropriately scoped reference. Keep repository instructions,
   prompts, implementation, and other material that owns none of those
   responsibilities in its actual artifact type.
5. Inventory relevant existing Knowledge, Workflow Skills, Handbook Skills, and
   references in every applicable package or authoring scope. Start from the
   user's work, concrete reader decisions, and required understanding. Keep
   Knowledge ownership separate from the reading bundles that need several
   documents together, then compare candidates' pre-edit responsibilities,
   consumers, reading or invocation triggers, and maintenance lifecycles. For
   Knowledge, apply the
   [ownership and retrieval assessment](references/maintain-knowledge.md#ownership-and-generalization)
   before concluding that an existing owner fits. For Handbook placement,
   compare existing task families, technical domains, and stable platform
   contexts before adding an entry; retain a new Handbook only for a distinct
   native scene, not for each Knowledge leaf. Prefer an existing owner when it
   already owns the responsibility and report why no existing owner fits every
   new artifact.
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
   and apply it throughout the applicable authoring workflow. When that
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
    standards. Before finalizing any resulting document, apply the loaded
    Knowledge's boundary between authoring evidence and reader-facing content;
    keep an authoring input only when it serves the final document's maintained
    responsibility. For creation or maintenance of Agent-behavior regression
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
14. Review the combined result and report the classification, affected
    responsibility units, operations performed, changed Catalog, Handbook,
    Workflow, and reference routes and consumers, generated knowledge-base
    plugin version when applicable, and mechanical and semantic validation
    performed. Include the final structural judgment for
    substantive revisions and the concrete reason for retaining or changing
    the organization. Report the final-content suitability conclusion with the
    examined reader task and relevant final locations, separately from semantic
    correctness and project-check results.
    Include the regression inventory and selection account, selected case IDs,
    tested source and models, actual observations, all attempt outcomes, and
    remaining gaps. Record a confirmed empty inventory explicitly; failed
    discovery is incomplete. Preserve distinct effective validation cases through
    the case-maintenance workflow when case authoring is within the authorized
    task, rather than treating every temporary trial as permanent protection.

## Final validation

Use the following order. Selected regression cases require replay; a change of
meaning or structure also requires independent final-content review. New or
substantively changed Knowledge, Workflow Skills, Handbook Skills, and Skill references additionally
require [Review reader understanding](references/review-reader-understanding.md).
Mechanical changes retain their existing reduced-evidence path.

1. Prepare a fresh capable reviewer or isolated review context when independent
   judgment is required. For affected selections, first apply
   [Design selection triggers](../../../knowledge-base/plugin/references/agents/selection-triggers.md#check-selection-from-requests):
   give that reviewer the request cases established before drafting and the real
   candidate set, and record its choices before it sees target contents or
   expected selections. For a selected Handbook, separately record every
   package choice from current work before revealing expected packages. Keep
   both observations separate from later reading, application, and judgment.
2. Gather execution evidence against the final content using the shared
   [replay protocol](../../references/agent-regression-tests.md#replay-and-evidence)
   and [dispatch templates](../../references/agent-regression-tests.md#dispatch-templates).
   Run selected historical cases and applicable lower-capability behavioral or
   reader-understanding checks in fresh executor contexts. Reuse existing runs
   only when they observed the same final content and supply the required
   evidence. Collect raw observations and applicable program-assertion results
   before requesting their semantic judgments. The reviewer may inspect the
   explanation during preparation, but defer the combined verdict until the
   required execution observations are available or explicitly incomplete.
3. Supply that same capable reviewer with active instructions, applicable
   standards, accepted requirements, raw final artifacts, the trusted pre-change
   state, case contracts, and actual observations without the author's
   conclusions. Combine open case judgments with the required final-content and
   reader-understanding review. Include any required
   [case-value and organization review](../maintain-knowledge-base-tests/SKILL.md#review-case-value-and-organization)
   in that same review, supplying affected cases and related coverage and support
   evidence. Keep its judgments and dispositions separate from execution
   results. Apply the loaded Knowledge's suitability review
   to the reader task and complete final content. Account for every semantic
   change, attribute defects to the revision, compare observed selections with
   old routes and final responsibilities, and verify that retained, moved,
   split, and merged responsibilities remain reachable and usable from every
   required starting point. Keep suitability, semantic correctness,
   reader-understanding observations, and each case's judgment distinct.
4. Investigate failures and missing evidence at their owners. Obtain missing
   observations rather than repeating sufficient runs. Resolve introduced
   suitability defects, unexplained losses, distortions, duplicate authority,
   and route failures; after a repair, repeat the affected execution observations
   and independent review against the revised content. Preserve every attempt
   and use the shared [result rules](../../references/agent-regression-tests.md#judge-and-report).
   Historical passes do not replace independent final-content review.
   Unavailable required review or cross-model evidence, and selected cases that
   fail or lack trusted evidence, leave affected maintenance incomplete.

## Completion criteria

An assessment is complete only when its report includes the required
[ownership and retrieval account](references/maintain-knowledge.md#ownership-and-generalization)
for Knowledge placement conclusions and explicitly identifies unresolved
evidence. An unsupported fit conclusion leaves the assessment incomplete.

For authorized delivery, finish only when every affected part has been
classified and every accepted part has one authoritative home. Each affected responsibility unit must present
one coherent current model without superseded wording, duplicated authority,
patch-layered qualifications, or unnecessary workflow branches. The final
artifact structure must reflect responsibilities, retrieval or invocation
timing, consumers, and maintenance lifecycles rather than edit history, while
remaining no more complex than the required behavior and explanation demand.

Every new artifact must own a responsibility that no existing artifact owns.
The Knowledge Catalog and all references must resolve, every user-facing part
must preserve downstream-project independence, and every Knowledge part must
have an independent installed-use reading responsibility that survives removal
of every consuming Workflow and Handbook, precedes the Workflow decisions it
informs, and has a valid Knowledge Type. Each Knowledge leaf must serve that
responsibility without requiring another leaf as a prerequisite. The Catalog
must remain the complete maintenance inventory; during migration its existing
runtime conditions and loader must remain usable until the coordinated contract
stage. Every Handbook route must read canonical Knowledge directly, and a new
Handbook must own a distinct task family, technical domain, or stable platform
context. Every Skill reference must be selected only by its consuming Skill
steps and live at the smallest common package boundary. The resulting diff must
preserve the boundaries among Knowledge, reading routes, and task execution and
must not change an independent responsibility outside the authorized scope.
Every other affected repository artifact must remain in the form that owns its
responsibility and satisfy the same coherent-current-model quality gate.
The final-content suitability review must establish a usable organization, and
the independent review must find no introduced suitability defect or
unexplained semantic change. New and substantively revised Knowledge, Skills,
and Skill references must also have the required cross-model understanding
evidence. Confirmed understanding defects must be corrected in the content and
checked again in a fresh context before delivery is complete. When
historical regression cases are selected, also require trusted passing evidence
for every selected case; failure or incomplete execution prevents completion of
the affected maintenance. Any required case-value and organization review and
necessary authorized case or support cleanup must also be complete. When
knowledge-base plugin Knowledge, Skill references, or usage Skills changed,
also require the PR-scoped knowledge-base plugin version and its validation to
be current.
