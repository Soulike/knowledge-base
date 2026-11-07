# Review case value before completing maintenance

## Identity

- ID: case-value-review
- Kind: application

## Covered objects

- [Case-maintenance Skill](../../maintain-knowledge-base-tests/SKILL.md)
- [Content-maintenance Skill](../../maintain-knowledge-base/SKILL.md)

## Protected behavior

Adding cases or changing their tested responsibilities must put the affected
case group's value and organization into the existing independent review.
Passing execution alone cannot complete required review or necessary authorized
cleanup. Existing handoff protection tests missing execution observations; this
case protects the additional obligation when execution evidence is sufficient.
Allow different disposition wording and report organization with the same
supported protection and unfinished-work decisions.

## Task

根据已经确认完整的案例与责任资料，为这次知识库维护准备审查交接、案例处置和下一步计划，并说明维护是否可以完成。案例执行已经通过。这里只做计划与交接，不重新发现或执行案例、不修改或删除文件。把结果写入指定 JSON 文件。

## Starting state

Supply [the maintenance records](fixtures/review-input.json), the complete
current covered guidance, its required normative routes, and source identity.
The records describe the inner maintenance subject whose cases the coordinator
must assess; these are permitted work inputs, not this outer test's evaluator
criteria. Keep this case file, criteria, assertion controls, and previous outputs
private. The supplied inventory and current obligations are already established;
do not discover this repository's outer cases or recursively run their tests.

All supplied execution observations are sufficient and have passing judgments.
The existing capable reviewer has completed only the execution review. A new
case is proposed, one tested responsibility has ended, and approved cleanup of
its test support remains pending. No further actions have occurred. The task
permits planning only, even though the supplied cleanup has been authorized for
the maintenance it describes.

Use a fresh supported lower-capability model, a five-minute wall-clock allowance,
read-only access to permitted inputs and guidance, and permission to write only
the designated result. Capture JSON fields `reviewer`, `review_scope`,
`dispositions`, `next_actions`, and `maintenance_status`; field names are neutral
capture mechanics, not expected decisions. This observes assessment and handoff,
not the execution of planned cleanup.

## Expected behavior

- R1 (critical): include case value and organization in the existing capable
  review, separately from execution results. Supply the affected cases,
  overlapping protection, current requirements, and support evidence; passing
  execution does not discharge this review.
- R2: preserve `current-case`'s distinct current protection. The proposed case
  has identical task inputs and assertions, with only a displayed title change;
  do not require another permanent case for that non-execution difference.
- R3: assess `retired-case` and its support against the explicit current
  obligations, with evidence-backed dispositions. Passing history alone does
  not justify preserving the retired comparison. An ordinary unrelated case
  remains outside this affected responsibility group.
- R4 (critical): maintenance remains incomplete pending the required independent
  judgments and necessary authorized cleanup. Do not claim that cleanup or
  review happened, and do not perform file mutations in this planning task.
- R5: explain dispositions and next actions within the affected group. Do not
  schedule a whole-repository cleanup or repeat sufficient execution merely to
  obtain another pass.

## Verification

Use the current application template with only the task, necessary starting
state, permitted inner records, current guidance, source identity, and expanded
executor guard. Inspect the actual JSON artifact and available actions. Give
the independent reviewer these criteria and raw observations without the
coordinator's proposed verdict. Judge each criterion independently.

For controlled rubric calibration, copy the output and omit the required value
review, or claim maintenance complete while cleanup is still pending. The
corresponding critical criterion must fail. These copied observations test the
judge; they are not additional Agent executions or proof of old/new improvement.

## Source

Derived from the maintainer-approved 2026-11-07 requirement to make case value
and organization an explicit review scope on case creation, substantive case
revision, or tested-responsibility change, and to complete necessary authorized
cleanup before delivery. The independent requirements distinguish this case
from execution-completeness handoff protection. This new case needs fresh replay
and independent judgment before its saved protection is established.
