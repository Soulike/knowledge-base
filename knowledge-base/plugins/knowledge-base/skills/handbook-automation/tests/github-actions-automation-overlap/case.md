# Apply Automation and GitHub Actions guidance as the engine changes

## Identity

- ID: github-actions-automation-overlap
- Kind: journey

## Covered objects

- [Automation Handbook](../../SKILL.md)

## Protected behavior

One GitHub Actions Agent workflow begins without a specified execution engine
and later moves to gh-aw's Copilot engine. Protect the Automation Handbook
foundation, cumulative GitHub Actions platform packages, controlled platform
facts, honest capability limits, and engine-specific requirements at each
phase. The collaboration owner separately protects the generic reading
lifecycle, including reuse, rereading, interruption, and recovery behavior.

## Task

Work through these messages in one task, receiving the next only after the
previous response and observations are recorded:

1. `Design a GitHub Actions pull-request workflow that checks out the current PR head, sets up its runtime, lets an Agent inspect it, and posts the decision as a PR comment. It must run again when the head changes, and later jobs must not publish or act on a stale, failed, or incomplete Agent result. No gh-aw engine is specified.`
2. `Now revise that workflow so the Agent runs through gh-aw's Copilot engine. Explain the additional runtime, authentication, and model prerequisites and the remaining limits.`

Do not publish a workflow or comment.

## Starting state

Use the exact final installed Skill candidate metadata and current covered
guidance from the tested source. Begin with only message 1 and no expected
selection. Record applicable Skill choices before opening a new body, then
record every selected and excluded package before opening newly required
Knowledge. Permit read-only access to direct canonical routes and no external
effects.

Supply the [controlled current platform inputs](fixtures/verified-platform-inputs.md)
with phase 1 as ordinary task facts for permission and version decisions. They
replace live retrieval for those facts and define the available GitHub
operations; make the maintenance Catalog unavailable as a runtime route.

After the phase 1 choices, reads, and design are recorded, reveal message 2.
Record the engine-specific choices and direct reads before revising the design.
Record the candidate set, each phase message, choices, file and section reads,
each result, and observation limits.

This case observes the Automation and GitHub Actions guidance required by each
phase. Do not score generic reading reuse, rereading, guidance-change,
interruption, or recovery behavior here.

## Expected behavior

- R1 (critical): phase 1 selects `handbook-automation` from the natural request
  before opening its body.
- R2 (critical): phase 1 reads the complete Automation foundation
  (`workflow-outcome-integrity.md`, `operation-failure-and-recovery.md`,
  `failure-diagnostic-evidence.md`) through its direct canonical routes.
- R3 (critical): phase 1 selects the GitHub Actions permissions,
  version-selection, and Agent-run-state packages cumulatively. It does not
  assign gh-aw Copilot compatibility before that engine is introduced.
- R4: phase 1 uses the controlled facts for permissions and exact pins, binds
  the inspected subject, accepted decision, transferred evidence, publisher,
  and comment to immutable PR-head and execution identities, and admits only
  honest completion evidence. The supplied operations do not establish the
  current remote PR head at publication time, so preserve that stale-head
  guarantee as unresolved unless a separately authorized trusted check is
  added. Represent a design that needs such a check as conditional on separately
  authorizing and supplying it.
- R5 (critical): phase 2 additionally selects and reads the gh-aw Copilot
  compatibility package through the Automation Handbook's direct route. Before
  claiming an executable design, establish or report missing compiler, AWF,
  Copilot CLI, authentication, provider, resolved-model, wire-protocol,
  reasoning, context, and capability facts. The revised design continues to
  satisfy the domain requirements in R1–R4 without inventing compatibility.

## Verification

Preserve the natural message sequence. Inspect phase-by-phase Skill and package
choices, direct route reads, domain application, controlled-fact use, capability
limits, and the evolving design as separate evidence.

Controlled faulty observations that miss `handbook-automation`, omit any
foundation document or one of the three matching GitHub Actions packages, load
gh-aw compatibility during phase 1, treat a missing current-head capability as
supplied, or fail to add the engine-specific package during phase 2 must fail
the corresponding criterion.

Do not judge generic reassessment, reading reuse, rereading, interruption, or
route-restoration behavior in this case; those assertions belong to the
[collaboration lifecycle case](../../../../tests/collaboration-guidance-recovery/case.md).

## Source

GitHub issues #242 and #246 establish general-automation and platform
requirements, cumulative GitHub Actions packages, engine-specific reading, and
staged platform work. Reconciled under `handbook-automation` per #320 and #322
when GitHub Actions guidance merged into the Automation Handbook while leaving
shared reading-lifecycle assertions at their collaboration owner.
