# Apply the automation foundation to a revision-based workflow

## Identity

- ID: automation-workflow-foundation
- Kind: journey

## Covered objects

- [Automation Handbook](../../SKILL.md)

## Protected behavior

A broad multi-step automation request must select the automation Handbook and
apply its complete primary-work foundation before later work depends on the
workflow result. When the automated decision compares Git revisions, the
comparison package is additionally required. Protect cumulative reading and
application while allowing different workflow engines, designs, and prose.

## Task

Design a nightly release workflow that decides which validation to run by
comparing the release branch with the integration branch, performs required
validation, and publishes artifacts only when the required evidence is valid.
The design must also explain what operators can do after a failed or
inconclusive run and what evidence they will have for investigation.

## Starting state

Build the current candidate set from the frontmatter of every direct installed
Skill entrypoint under `knowledge-base/plugin/skills/*/SKILL.md`. Supply the
natural task request and candidate names and descriptions without expected
choices, target hints, this case, or evaluator conclusions. Use a fresh
supported lower-capability model with the expanded executor guard, read-only
access to the supplied repository snapshot, and a six-minute wall-clock
allowance.

First record the candidate choice before opening any candidate body. Then allow
the executor to read the complete current body of each chosen Skill and its
permitted direct routes and to produce the requested workflow design. Record
the exact source snapshot, model, configuration, selected candidates, files
read, final result, and available action observations.

## Expected behavior

- R1 (critical): select `handbook-automation` for the broad automated-workflow
  task before seeing its body. Other independently applicable Workflow or
  Handbook selections are permitted when justified by the task.
- R2 (critical): after reading the Handbook, read all three automation
  foundation documents and the Git-comparison package. Do not treat the
  package as a replacement for the foundation or choose only the closest
  reading.
- R3: use the foundation to make required outcomes, non-success and recovery,
  and diagnostic evidence explicit before artifact publication can depend on
  the run. Preserve failed, cancelled, skipped, missing, or inconclusive
  evidence as distinct from successful completion where the design reaches
  those states.
- R4: use the Git-comparison material to state the comparison question and the
  base/head semantics rather than treating a two-dot or three-dot command as a
  context-free recipe.
- R5: treat packaged guidance as supplemental to active project requirements
  and report any unavailable required reading or observation instead of
  inventing it.

## Verification

Use the journey form of the shared replay protocol. Inspect the recorded blind
selection, file-read account, and resulting design separately. Give the capable
reviewer this contract, the complete final Handbook and direct Knowledge
routes, the real candidate metadata, and the raw observation without the
coordinator's verdict. Judge every criterion independently and retain every
attempt.

A controlled faulty observation that omits one foundation document, skips the
Git-comparison package, or lets missing validation evidence authorize artifact
publication must fail the corresponding critical criterion. The controlled
copy calibrates the reviewer and is not another Agent run.

## Source

GitHub issues #242 and #246 require the automation foundation, cumulative Git
comparison package, broad natural selection, actual reading and application,
and distinct observation of those stages. This reconstructed case requires a
fresh replay against the completed Handbook.
