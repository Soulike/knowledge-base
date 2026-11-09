# Combine automation and GitHub Actions reading

## Identity

- ID: github-actions-automation-overlap
- Kind: journey

## Covered objects

- [Automation Handbook](../../handbook-automation/SKILL.md)
- [GitHub Actions Handbook](../../handbook-github-actions/SKILL.md)

## Protected behavior

A GitHub Actions Agent workflow is both general automation and platform work.
It must select both independent Handbooks, read their directly linked material,
and accumulate every matching GitHub Actions package. Protect overlap,
cumulative package selection, and reuse of the shared canonical automation
document while allowing different valid workflow designs and wording.

## Task

Design a GitHub Actions pull-request workflow that checks out the repository,
sets up its runtime, lets an Agent inspect the current pull-request head, and
posts the Agent's decision as a pull-request comment. It must run again when the
pull-request head changes, and later jobs must not publish or act on a stale,
failed, or incomplete Agent result.

After the initial design, the workflow requirement changes: the Agent will run
through gh-aw's Copilot engine. Re-evaluate the Handbooks and packages before
revising the design for that execution path.

## Starting state

Build the current candidate set from the frontmatter of every direct installed
Skill entrypoint under `knowledge-base/plugin/skills/*/SKILL.md`. Supply the
natural task request and candidate names and descriptions without expected
choices, target hints, this case, or evaluator conclusions. Use a fresh
supported lower-capability model with the expanded executor guard, read-only
access to the supplied repository snapshot, and an eight-minute wall-clock
allowance.

Supply [controlled current platform inputs](fixtures/verified-platform-inputs.md)
as ordinary task data for permission and version decisions. They are a bounded
replay fixture, not general GitHub Actions guidance. Do not require external
retrieval to replace those controlled facts.

Record candidate choices before opening bodies. Then allow the executor to read
the complete bodies and direct routes of its chosen Skills and produce the
initial requested design. Only after that observation, send the natural
gh-aw Copilot-engine requirement above and record revised package choices,
newly required reading, and the changed design. Record the exact source
snapshot, model, configuration, selected candidates, Handbook package choices,
files read, final results, and available action observations.

## Expected behavior

- R1 (critical): select both `handbook-automation` and
  `handbook-github-actions` from the natural request before seeing their bodies.
  Other independently applicable Workflow or Handbook selections are permitted
  when justified.
- R2 (critical): read the complete automation foundation and the GitHub Actions
  foundation. Reuse the shared current workflow-outcome document rather than
  treating one Handbook as a dependency of the other.
- R3 (critical): select the GitHub Actions permissions, version-selection, and
  Agent-run-state packages cumulatively. Exclude the gh-aw Copilot-model package
  because the task does not use or ask about gh-aw Copilot model execution.
- R4: apply the reading to choose justified token permissions, explicit
  third-party Action or runtime versions, and a run-state contract that binds
  the comment and downstream work to the current pull-request head and honest
  completion evidence. Use the supplied controlled current facts rather than
  guessing or requiring live retrieval.
- R5: when the later requirement introduces gh-aw Copilot model execution,
  re-evaluate package conditions, add the gh-aw compatibility package, read it,
  and revise the design without discarding still-applicable earlier material.
  Treat packaged guidance as supplemental to active project requirements.

## Verification

Use the journey form of the shared replay protocol. Inspect blind native
selection, internal package choices, file-read evidence, and application in the
initial workflow design as separate observations. Then inspect the second-stage
package re-evaluation, additional file read, and revised design separately.
Give the capable reviewer this contract, the final Handbooks and direct routes,
the real candidate metadata, and raw observations without the coordinator's
verdict. Judge every criterion independently and retain every attempt.

A controlled faulty observation that selects only one Handbook, omits one of
the three matching GitHub Actions packages, or loads the non-matching gh-aw
package during the initial stage must fail the corresponding criterion. A copy
that does not add that package after the changed requirement must fail R5. The
controlled copies calibrate the reviewer and are not additional Agent runs.

## Source

GitHub issues #242 and #246 require independent general-automation and platform
selection, cumulative GitHub Actions packages, real overlap cases, and separate
selection, reading, and application evidence. This reconstructed case requires
a fresh replay against the completed Handbooks.
