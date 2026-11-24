---
name: maintain-knowledge-base
description: Assess contribution classification, ownership, and placement, or maintain content in this knowledge-base repository. Use for read-only contribution triage and authorized changes to its Knowledge, Workflow Skills, Handbook Skills, Skill references, or maintained Agent instructions and prompts.
---

# Maintain the knowledge base

Classify every affected responsibility before choosing its final artifact or
operation.

An **affected responsibility unit** is the smallest complete block of meaning,
reading-route behavior, or task execution owned by one responsibility that an
authorized change can make stale or incoherent. Required route and consumer
repairs are part of the change effect, not authorization for independent
behavior.

## Workflow

1. Resolve paths relative to this `SKILL.md` (`../../..` is repository root).
   Keep assessment-only requests read-only; treat an authorized change as the
   **mutation boundary**. Read the affected plugin rules and enough surrounding
   context to judge the full effect; request expanded scope before changing an
   independent responsibility, public trigger, or consumer not required to
   leave the change coherent.
2. Apply
   [Assess contribution scope](../../../knowledge-base/plugins/knowledge-base/references/agents/contribution-scope-assessment.md)
   to new and existing content before fixing consumers, classification, or
   ownership, distinct from step 1's mutation boundary. Enforce the
   [architecture gates](../../../AGENTS.md#repository-architecture):
   dependency-boundary, symmetric downstream-project independence and
   domain-model neutrality, product-interface isolation (explicit
   product-interaction workflows only), and one-way delegation—routing
   generalizable guidance to `knowledge-base/plugins/<plugin-name>/`
   (`knowledge-base/plugins/knowledge-base/` for cross-domain), keeping
   repository-coupled or product-architecture rules in
   [repository-maintenance workflows](../../../GLOSSARY.md#repository-maintenance-workflow)
   under `.agents/` delegating one-way to the base plugin, and leaving
   non-generalizable source-project material outside installed plugins.
3. Read
   [`knowledge-and-skills.md`](../../../knowledge-base/plugins/knowledge-base/references/agents/knowledge-and-skills.md)
   and identify each part's consumers, maintenance lifecycle, and retrieval
   source using its boundary tests.
4. Classify every affected responsibility unit as Knowledge, Workflow Skill,
   Handbook Skill, Skill reference, repository-maintenance workflow/reference
   (only when repository-coupled or product-architecture-specific per step 2),
   mixed, or another repository artifact—keeping subject understanding in
   Knowledge, task execution in a Workflow, reading selection in a Handbook,
   step-selected support in a scoped reference, and non-owning material in its
   actual artifact type.
5. Inventory existing Knowledge, Skills, and references from user work,
   reader decisions, and required understanding (separating Knowledge ownership
   from reading bundles). Prefer an existing owner when it fits and report why
   none fits each new artifact; complete the
   [placement and trigger checklist](references/assess-and-design.md#placement-and-trigger-coverage)
   before drafting.
6. For maintained factual, explanatory, or instructional docs, read
   [Maintained document quality](../../../knowledge-base/plugins/knowledge-base/knowledge/documentation/maintained-document-quality.md);
   when covering software behavior, interfaces, operation, or decisions (or
   invalidated by software change), also read
   [Software-development documentation](../../../knowledge-base/plugins/knowledge-base/knowledge/documentation/software-development-documentation.md).
7. Read each affected artifact whole with needed routes and consumers, plus each
   applicable branch workflow—[`maintain-knowledge.md`](references/maintain-knowledge.md),
   [`maintain-skill.md`](references/maintain-skill.md), or
   [`maintain-skill-reference.md`](references/maintain-skill-reference.md)—up to
   analysis without applying operations. Reclassify returned material; for
   mixed material, analyze Knowledge first, then Workflow/Handbook, then
   references.
8. Design the complete proposed result and select operations per the
   [design and operation checklist](references/assess-and-design.md#design-and-select-operations)
   (substantive revisions: state structural judgment per step 6; purely
   mechanical edits: confirm unchanged meaning and structure).
9. **Assessment-only stop:** for assessment-only work, report the
   [assessment report checklist](references/assess-and-design.md#assessment-report)
   plus the required
   [ownership and retrieval account](references/maintain-knowledge.md#ownership-and-generalization)
   for Knowledge placement and stop without editing or claiming remediation; for
   authorized edits, continue to step 10.
10. Resume the branch workflows from step 7 to apply operations (mixed order:
    Knowledge first, then Workflow/Handbook before references), and maintain
    other repository artifacts under step 6 and project standards. Separate
    authoring evidence from reader-facing content (step 6, Establish authority
    and evidence) before finalizing, and follow
    [`workflow-manage-automated-tests`](../../../knowledge-base/plugins/knowledge-base/skills/workflow-manage-automated-tests/SKILL.md)
    before editing automated tests.
11. Self-check the composed result using
    [suitability review](../../../knowledge-base/plugins/knowledge-base/knowledge/documentation/maintained-document-quality.md#validate-the-result)
    for hidden prerequisites, scattered conditions, or broken routes; return to
    steps 7–9 if invalidated.
12. When `knowledge-base/plugins/*/knowledge/**`, `references/**`, or
    `skills/**` changed, follow
    [`update-knowledge-base-version.md`](references/update-knowledge-base-version.md)
    after content stabilizes.
13. Run `pnpm check` and `git diff --check`. Assess probe risk per
    [Verify reader understanding](../../../knowledge-base/plugins/knowledge-base/references/agents/reader-understanding.md#assess-probe-risk)
    (and
    [Prove Handbook and Workflow behavior](references/maintain-skill.md#prove-handbook-and-workflow-behavior)
    when Knowledge-plugin Skills changed); run warranted probes, repair exposed
    blind spots in authoritative content, and re-probe.
14. Assemble a concise PR or handoff summary per
    [`AGENTS.md`](../../../AGENTS.md#behavioral-and-documentation-change-summary)
    and step 13 (classification, affected units, structural rationale, changed
    routes/consumers, plugin versions, checks, and probe decision).

## Completion criteria

- **Assessment-only:** includes the required ownership and retrieval account for
  Knowledge placement (step 9), applies step 2's dependency-boundary,
  domain-model-neutrality, and product-interface-isolation checks for
  `.agents/` and plugin proposals, and identifies unresolved evidence
  (unsupported fit leaves assessment incomplete).
- **Authorized delivery:**
  - Every affected part is classified and placed in its single authoritative
    home satisfying step 2's architecture and one-way delegation gates.
  - Plugin content satisfies
    [`knowledge-base/AGENTS.md`](../../../knowledge-base/AGENTS.md), changed
    routes resolve, and `pnpm check` and `git diff --check` pass; other
    artifacts keep responsible form under step 6 and project standards.
  - Self-check confirms no unresolved suitability defects (step 11), warranted
    probes repaired and re-probed blind spots (step 13), changed plugin
    versions are current (step 12), and the PR or handoff includes step 14's
    summary.
