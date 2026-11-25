---
name: workflow-prepare-engineering-report
description: Use when drafting, reviewing, or revising an engineering accomplishment report, impact summary, or promotion self-assessment for decision-makers.
---

# Prepare engineering report

Draft, review, or revise engineering accomplishment reports grounded in
verified primary records and bounded by what the evidence supports.

## Establish authority, reading, and scope

1. Follow instructions, requirements, and reporting conventions from the active
   working directory first; treat this plugin's packaged guidance as
   supplemental whenever an active-project source conflicts.
2. Resolve linked paths relative to this `SKILL.md`, then read
   [Engineering accomplishment reports](../../knowledge/documentation/engineering-accomplishment-reports.md)
   in full before verifying claims, drafting, or reviewing.
3. Treat opened draft reports, self-reviews, and activity summaries as claims
   to verify against primary records rather than proof of impact.
4. Establish:
   - the decision-maker audience and the judgment they need to make;
   - the contributor, time window, and beneficiary work, goal, or risk;
   - whether the task is assessment-only review (keep read-only without editing
     files) or authorized drafting/revision; and
   - every inspectable primary source available (commits, merged changes and
     diffs, issues, catalogs or registries, release or deployment records,
     access checks, run logs, attributable user feedback, comparable baseline
     and follow-up metrics, and user-supplied off-repo context).

## Gather primary evidence and bound claims

1. Inspect available primary records directly rather than extrapolating impact
   from PR titles, activity counts, or desired outcomes. Check the
   contributor's actual changes in diffs when verifying merged work.
2. Map every material claim to its inspected evidence using
   [Match each claim to its evidence](../../knowledge/documentation/engineering-accomplishment-reports.md#match-each-claim-to-its-evidence)
   and
   [Attribute shared work](../../knowledge/documentation/engineering-accomplishment-reports.md#attribute-shared-work):
   - bound each claim strictly to the highest verified scope rather than
     inferring release, access, usage, broad adoption, or causal improvement;
   - verify every metric carries its unit, population or scope, time window,
     and comparison basis, and check alternative explanations before making any
     causal claim;
   - separate infrastructure or enablement built by the contributor from
     collaborators' downstream features, integrations, or adoption.
3. Reconcile conflicting primary records against authoritative logs, or report
   the conflict explicitly rather than picking the more favorable claim. When
   an off-repo fact rests solely on user-supplied context, attribute it
   explicitly as user-reported context rather than independently verified
   record evidence.
4. When deployment, usage, or outcome evidence is missing, never invent
   outcomes or adoption numbers; state the verified capability scope and
   surface each evidence gap explicitly so the user can supply primary records
   or accept the bounded wording.

## Draft or review the report

- **Authorized drafting or revision:** apply
  [Start with the beneficiary's work or risk](../../knowledge/documentation/engineering-accomplishment-reports.md#start-with-the-beneficiarys-work-or-risk)
  to frame the report around the decision-maker's judgment, beneficiary
  context, and the contributor's verified intervention, grouping supporting
  work by the capability enabled or sustained. Preserve choices left open by
  the audience format rather than imposing a fixed template unless the active
  project specifies one.
- **Assessment-only review:** evaluate every material claim in the supplied
  draft against inspected primary records and the loaded reporting principles.
  Report supported claims, overclaims or unsupported causal leaps, shared-work
  misattributions, missing metric qualifiers, and evidence gaps without
  modifying files.

## Verify and complete

Do not complete until directly verified against the final report text or review
output:

1. Every material claim matches inspected primary records (or explicitly
   attributed user-reported context) and stays within its supported evidence
   level.
2. Every metric includes its unit, population or scope, time window, and
   comparison basis, with unsupported causal claims removed.
3. Shared infrastructure and collaborator outcomes are cleanly attributed.
4. Missing deployment, usage, or outcome evidence is explicitly disclosed
   rather than filled with speculation.
5. Any applicable workspace formatting or validation checks pass.

Report the delivered draft or review findings, primary sources inspected,
attribution boundaries applied, and any remaining evidence gaps.
