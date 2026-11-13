# Hand case evidence to the existing final reviewer

## Identity

- ID: review-evidence-handoff
- Kind: application

## Covered objects

- [Content-maintenance Skill](../../skills/maintain-knowledge-base/SKILL.md)
- [Case-maintenance Skill](../../skills/maintain-knowledge-base-tests/SKILL.md)
- [Replay and result reference](../../references/agent-regression-tests.md)

## Protected behavior

Case execution and content review must share one independent capable reviewer.
Do not finish with missing evidence or rerun sufficient observations merely to
obtain a favorable result. Protect the handoff and completion decision while
allowing different presentation of the same supported plan.

## Task

内容修改已经稳定。根据给定的验证记录，为维护 Agent 写出下一步调度计划、给 reviewer 的交接内容和当前完成状态。只做计划与判定，不重新执行任务、不修改内容。把结果写入指定 JSON 文件。

## Starting state

Use [the observation records](fixtures/observations.json) as normal task data.
They describe inner validation whose decisions the coordinator must handle;
they are not this outer test's answers. Supply the current complete covered
guidance. These records are controlled task inputs, not logs of additional
Agent runs.

The initial blind selection of reviewer `reviewer-one` is already recorded.
Reading the final artifacts is now allowed for that same reviewer. Case `alpha`
has sufficient passing observations. Case `beta` has no observed violation, but
its required confusion observation is absent. The listed attempts belong to the
same source and must remain recorded. No further execution has occurred.

Permit read-only source/data access and writes only to the designated JSON
result. Capture `case_statuses` as an object mapping given case IDs to `pass`,
`fail`, or `incomplete`; `maintenance_status` uses the same statuses. Capture
`next_actions` as an array, `reviewer` as an object with `id` and `input`, and
`attempts` as an array retaining the supplied attempt records, directly or
inside `record` wrappers or case-context `records` groups. These are neutral
capture shapes, not their expected values.

## Expected behavior

- R1 (critical): maintenance and beta remain incomplete until the missing
  observation and required independent judgment exist; do not declare a pass.
- R2 (critical): keep both alpha attempts and beta's observation record.
- R3: target missing confusion evidence for beta. Alpha's supplied required
  observations are sufficient; do not schedule a full alpha rerun.
- R4: hand raw observations and contracts to `reviewer-one` for combined case,
  content, suitability, and understanding judgment; do not create a second
  reviewer or judge the final content before obtaining the required evidence.
- R5: separate the coordinator's plan from actions actually completed. Different
  plan wording is allowed; no real execution or review is claimed.
- R6: the supplied records do not establish case creation, substantive case
  revision, or changed tested responsibilities, and the task does not request
  value review. Keep any case-value and organization review conditional on
  establishing that premise; do not add an unconditional completion gate.

## Verification

Use the application template and capture the actual result artifact. The
independent reviewer uses the records and criteria to judge each decision.
Run [the output assertions](verify-output.mjs) against the result and supplied
records to check retained attempts and incomplete status before open semantic
review. A controlled faulty copy claiming beta and maintenance passed
must violate R1; dropping an attempt violates R2. The plan is the observed result,
not evidence that the planned actions occurred.

## Source

Derived from the maintainer-approved final-review scheduling and completion
contracts and the 2026-11-07 fresh understanding observations at commit `201e279`.
The earlier missing-observation question is made self-contained with explicit
records. This historical derivation requires a new saved-case replay.

The value-review activation criterion preserves the maintainer-approved bounded
scope and the 2026-11-07 observation of an unconditional extra review gate when
the triggering operation was unknown. Its assessment is separate from the
historical missing-observation criteria.
