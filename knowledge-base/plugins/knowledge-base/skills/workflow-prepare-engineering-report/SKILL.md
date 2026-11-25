---
name: workflow-prepare-engineering-report
description: Use when drafting, reviewing, or revising an engineering accomplishment report, impact summary, or promotion self-assessment for decision-makers.
---

# Prepare engineering report

Draft, review, or revise engineering accomplishment reports through concise,
attributable claims grounded in verified evidence and bounded by what the
records actually support.

## Establish authority, audience, and scope

1. Follow instructions, requirements, and reporting conventions from the active
   working directory first; treat this Skill's guidance as supplemental.
2. Treat draft reports, self-reviews, and activity summaries opened for the task
   as claims to verify against primary evidence rather than proof of impact.
3. Identify:
   - the decision-maker audience and the judgment they need to make;
   - the contributor, time window, and beneficiary work, goal, or risk;
   - whether the task is assessment-only review (keep read-only without editing
     files) or authorized drafting/revision; and
   - every inspectable evidence source available (commits, merged changes,
     issues, catalogs or registries, release or deployment records, run logs,
     attributable user feedback, comparable baseline and follow-up metrics, and
     explicit user-supplied context).

## Gather first-hand evidence and verify claims

Inspect available primary records directly rather than extrapolating impact from
PR titles, activity counts, or desired outcomes. Check every accomplishment
claim against this evidence ladder and keep each claim within its verified
boundary:

| Claim                                      | Evidence that can support it                                                                             | Boundary                                                                                   |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| A change entered the codebase              | Merged change records and the diffs themselves                                                           | Check the contributor's actual part; a merge does not establish release, use, or benefit.  |
| A capability is listed in a catalog        | A current entry visible in that catalog                                                                  | Listing does not establish access to or successful execution of the underlying capability. |
| A capability is accessible to stated users | Release or deployment records, or access checks, for those users in the reported version and environment | Access within that scope does not establish use or benefit.                                |
| A capability was used                      | Run records or attributable feedback describing a concrete use                                           | Observed cases do not establish broad adoption or an improved outcome.                     |
| A measured outcome improved                | Comparable baseline and follow-up measurements for the stated population, period, and measure            | A measured difference alone does not attribute the change to one contribution.             |

Apply these additional evidence rules:

- Give every metric its unit, population or scope, time window, and comparison
  basis. Investigate alternative explanations and confounding changes before
  making a causal claim; when causality is not established, report the observed
  change without attributing its cause.
- Treat activity counts and rankings as measuring only what their counting rule
  captures, never as proof of beneficiary value.
- Do not cite an absence of follow-up bug reports as proof that a defect was
  resolved or that reliability improved.
- When primary records conflict, reconcile them against authoritative logs or
  state the conflict rather than picking the more favorable claim. When an
  off-repo fact rests solely on user-supplied context, attribute it explicitly
  as user-reported context rather than independently verified record evidence.

## Attribute shared work and bound gaps

1. Separate infrastructure, tooling, or enablement built by the contributor
   from features, integrations, or content built on top of it by collaborators.
   For example, building a shared integration registry supports claiming that
   the contributor built the registry listing collaborators' integrations; claiming
   authorship of those integrations, team adoption, or faster delivery still
   requires separate evidence for each assertion.
2. Describe joint work and dependencies at the exact granularity records
   support. Enabling other work is a valuable contribution without transferring
   authorship of downstream work or proving that collaborators used it.
3. When a claim lacks deployment, usage, or outcome evidence:
   - never invent outcomes, adoption numbers, or causal improvements;
   - bound the drafted claim strictly to the highest verified scope (such as the
     implemented and verified capability available in the reported version); and
   - surface missing evidence gaps explicitly so the user can supply primary
     records or accept the bounded wording.

## Draft or review the report

- **Drafting or revising (authorized):**
  1. Start with the decision-maker's judgment and the beneficiary's work, goal,
     or risk. Include an initial obstacle only when known; preventive,
     reliability, testing, or documentation work may sustain a capability or
     mitigate a credible risk without a prior incident or measured outcome.
  2. Connect that beneficiary context to the contributor's own intervention and
     verified change. Group supporting engineering work (infrastructure,
     reliability, testing, documentation) by the capability it enables or
     sustains, keeping implementation detail only when it explains the
     contribution or supports a claim.
  3. Preserve choices left open by the audience format rather than imposing a
     rigid template unless the active project specifies one.
- **Reviewing (assessment-only or pre-revision critique):**
  Evaluate every material claim in the supplied draft against inspected records
  and the evidence ladder above. Report supported claims, overclaims or
  unsupported causal leaps, shared-work misattributions, and missing metric
  qualifiers or evidence gaps without rewriting files unless authorized.

## Verify and complete

Do not complete until directly verified against the final report text or review
output:

1. Every material claim matches inspected records or explicitly attributed user
   input and stays within its supported evidence level.
2. Every metric includes unit, population or scope, time window, and comparison
   basis, with causal claims supported by checked comparisons or omitted.
3. Shared infrastructure and collaborator outcomes are cleanly attributed.
4. Unobserved usage, adoption, or benefit gaps are explicitly disclosed rather
   than filled with speculation.
5. Any applicable workspace formatting or validation checks pass.

Report the delivered draft or review findings, verified primary sources
inspected, shared-attribution boundaries applied, and any remaining evidence
gaps.
