# Apply automation and operation guidance to a background workflow

## Identity

- ID: automation-workflow-foundation
- Kind: journey

## Covered objects

- [Automation Handbook](../../handbook-automation/SKILL.md)
- [Operation failure and recovery Workflow](../../workflow-design-operation-failure-recovery/SKILL.md)

## Protected behavior

A broad multi-step automation request whose outcome is visible to operators must
select both the automation reading scene and the operation-failure execution
Workflow. The Handbook must supply its complete foundation and Git-comparison
package. The Workflow must directly read its three core Knowledge owners without
consulting the maintenance-only Catalog, map non-success and recovery for the background operation,
and avoid interface-only reading when no person interacts with the flow.

## Task

Design a nightly release workflow that decides which validation to run by
comparing the release branch with the integration branch, performs required
validation, and publishes artifacts only when the required evidence is valid.
The run is background-only, but operators can observe its status and published
artifacts. Explain what operators can do after a failed or inconclusive run and
what evidence they will have for investigation.

## Starting state

Build the current 35-candidate Handbook and Workflow set from frontmatter under
`knowledge-base/plugin/skills/*/SKILL.md`. Supply the natural task request and
candidate names and descriptions without expected choices, target hints, this
case, or evaluator conclusions. Make `knowledge/index.md` unavailable as a
runtime input during execution.

Use a fresh supported lower-capability model with the expanded executor guard,
read-only access to the supplied repository snapshot, and a six-minute
wall-clock allowance. First record the candidate choice before opening any body.
Then allow the executor to read the complete current body of each chosen Skill
and its permitted direct routes and produce the requested workflow design.
Record the exact source snapshot, model, configuration, selected candidates,
files read, final result, and available action observations.

## Expected behavior

- R1 (critical): select `handbook-automation` and
  `workflow-design-operation-failure-recovery` before seeing their bodies.
- R2 (critical): after reading the Handbook, read all three automation
  foundation documents and the Git-comparison package. Do not treat the package
  as a replacement for the foundation or choose only the closest reading.
- R3 (critical): through the Workflow's direct routes, read operation failure
  and recovery, user-facing failure communication, and test effectiveness while
  the maintenance Catalog is unavailable as a runtime route.
- R4: because operators inspect the result and choose recovery actions, read
  interaction clarity and user goodwill for that person-operated boundary.
  Exclude mobile, Web, home-page, navigation, and usability-evaluation reading
  because no matching platform or evaluation work is present.
- R5: make required outcomes, non-success and recovery, diagnostic evidence,
  safe retry or continuation, and effect certainty explicit before artifact
  publication can depend on the run. Preserve failed, cancelled, skipped,
  missing, or inconclusive evidence as distinct from successful completion.
- R6: use the Git-comparison material to state the comparison question and the
  base/head semantics rather than treating a two-dot or three-dot command as a
  context-free recipe.
- R7: treat packaged guidance as supplemental to active project requirements
  and report any unavailable required reading or observation instead of
  inventing it.

## Verification

Use the journey form of the shared replay protocol. Inspect blind selection,
file-read accounts, and the resulting design separately. Confirm the direct
Workflow routes operated with the Catalog unavailable. Give the capable
reviewer this contract, the complete final bodies and direct Knowledge routes,
the 35-candidate metadata, and the raw observation without the coordinator's
verdict. Judge every criterion independently and retain every attempt.

A controlled faulty observation that omits one automation foundation document,
skips the Git-comparison package, reads mobile or Web guidance for the
background-only flow, or lets missing validation evidence authorize artifact
publication must fail the corresponding critical criterion. The controlled copy
calibrates the reviewer and is not another Agent run.

## Source

GitHub issues #242 and #246 require the automation foundation, cumulative Git
comparison package, broad natural selection, actual reading and application,
and distinct observation of those stages. GitHub issue #249 requires the
operation Workflow's background branch and core reading to work through direct
canonical routes without the Catalog. The operation behavior is a historical
control recovered from pull request #160.
