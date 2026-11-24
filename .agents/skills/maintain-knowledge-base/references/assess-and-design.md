# Assess placement, design revisions, and report findings

Step-specific checklists for [maintain-knowledge-base](../SKILL.md).

## Placement and trigger coverage

Use this checklist during step 5 when inventorying existing artifacts and
evaluating placement or selection conditions:

1. Start from the user's work, concrete reader decisions, and required
   understanding. Keep Knowledge ownership separate from the reading bundles
   that need several documents together, then compare candidates' pre-edit
   responsibilities, consumers, reading or invocation triggers, and maintenance
   lifecycles.
2. **Knowledge placement:** apply the
   [ownership and retrieval assessment](maintain-knowledge.md#ownership-and-generalization)
   before concluding that an existing owner fits.
3. **Skill placement and product-taxonomy modeling:** follow
   [Agent Skill authoring](../../../../knowledge-base/plugins/knowledge-base/references/agents/skill-authoring.md)
   for generic Skill craft alongside
   [Choose the Skill responsibility](maintain-skill.md#choose-the-skill-responsibility),
   [Model a Handbook Skill](maintain-skill.md#model-a-handbook-skill), and
   [Skills and references](../../../../knowledge-base/AGENTS.md#skills-and-references);
   prefer an existing owner when it already owns the responsibility and report
   why no existing owner fits every new artifact.
4. **Affected reading or invocation conditions:** complete
   [Establish coverage before drafting](../../../../knowledge-base/plugins/knowledge-base/references/agents/selection-triggers.md#establish-coverage-before-drafting)
   before proposing wording or rewriting the target, applying
   [Handbook and Workflow selection triggers](maintain-skill.md#handbook-and-workflow-selection-triggers)
   for Knowledge-plugin Workflow descriptions, Handbook descriptions, and
   Handbook package conditions. Carry its coverage boundaries and request cases
   into the artifact-specific workflows.

## Design and select operations

Use this checklist during step 8 after completing step 7's artifact-specific
analysis:

1. Design the complete proposed result and artifact set by subject
   responsibility, user task, reading bundle, retrieval or invocation timing,
   consumers, and maintenance lifecycle.
2. When proposing a substantive revision, state the structural judgment in a
   work update using
   [Keep revisions coherent](../../../../knowledge-base/plugins/knowledge-base/knowledge/documentation/maintained-document-quality.md#keep-revisions-coherent)
   and proceed within existing authorization. For purely mechanical edits,
   confirm that meaning and structure are unchanged without a full structural
   assessment.
3. For each substantive proposal, compare making no change, deleting, rewriting,
   adding, merging, splitting, and moving before editing:
   - Prefer replacement or consolidation when material corrects, duplicates, or
     supersedes existing content.
   - Do not fit an independently needed responsibility into an existing owner
     when its assessed retrieval or invocation timing, consumers, or maintenance
     lifecycle requires separate ownership.
   - Use progressive disclosure for branch-only detail when it improves the
     reader's path.
   - Select for the clarity and coherence of the final content; diff size does
     not constrain the necessary rewrite within the authorized responsibility
     boundary.

## Assessment report

For assessment-only work (step 9), report all of the following and stop without
applying operations or claiming remediation:

- the classification of every affected responsibility unit;
- the structural judgment;
- proposed operations and destinations;
- unresolved decisions and explicitly identified unresolved evidence;
- validation limits;
- the required
  [ownership and retrieval account](maintain-knowledge.md#ownership-and-generalization)
  for Knowledge placement conclusions; and
- the dependency-boundary, domain-model-neutrality, and
  product-interface-isolation checks
  ([`AGENTS.md`](../../../../AGENTS.md#repository-architecture)) for `.agents/`
  and plugin proposals.

An unsupported fit conclusion leaves the assessment incomplete.
