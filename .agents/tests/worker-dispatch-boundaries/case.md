# Prepare independent worker inputs and actual dispatch arguments

## Identity

- ID: worker-dispatch-boundaries
- Kind: application

## Covered objects

- [Case-maintenance Skill](../../skills/maintain-knowledge-base-tests/SKILL.md)
- [Replay and dispatch reference](../../references/agent-regression-tests.md)

## Protected behavior

The coordinator must prepare usable execution inputs from already selected
cases while retaining evaluator-only fields for the reviewer. Dispatcher
arguments carry replay configuration; worker messages carry the case task,
starting inputs, action boundary, and canonical guard. Permit different
surrounding wording, task names, and explanations while preserving those
responsibilities. This unit observes preparation, not actual nested worker
execution.

## Task

为已经选定的两个任务准备可直接派发的 worker 调用参数、各自完整 prompt，以及后续独立 reviewer 的输入。只准备，不真正派发，也不提前判定任务通过。把结果写入指定的 JSON 文件。

## Starting state

Use [the input data](fixtures/inputs.json). Materialize it in a neutral temporary
workspace along with the current real Skill candidate metadata and the current
complete covered guidance. The coordinator under test may read the supplied
inner case contracts as its work inputs; this outer case's criteria and report
remain evaluator-only. Do not expose this case file, its ID, or assertion script.
These two inner tasks are already selected, so no repository case inventory or
recursive regression execution is part of the assigned preparation.

Supply the actual available dispatcher schema and the source snapshot. Use a
fresh author-matched executor with an eight-minute wall-clock allowance. Allow
reading the supplied data and current guidance and writing only the designated
result file. Require a result object with `dispatches` and `reviewer_input`.
Capture dispatches as an array of `key` and `arguments` pairs or an object
mapping task keys to their arguments. These representations preserve the same
observable calls. The authoring-model and context settings in the input are
coordinator configuration, not instructions asking a running worker to change
itself.

## Expected behavior

- R1 (critical): each call's `arguments` matches the supplied authoring model
  and uses the supplied executor configuration while excluding parent history
  through the actual supported dispatcher settings. Those settings remain
  dispatcher arguments, while the worker message carries the inner case task
  and starting materials.
- R2 (critical): every `arguments.message` contains the complete current
  executor guard; a link or unexpanded placeholder is insufficient. Preserve its
  prohibition on obtaining evaluation answers or fabricating observations, its
  exposure stop/report rule, and permission to use normal allowed guidance.
- R3 (critical): worker messages contain their task and needed starting inputs,
  but none of the supplied evaluator markers, expected behavior, covered-object
  declarations, protected faults, or past verdicts.
- R4: selection supplies current real metadata and stops before bodies and task
  execution; application supplies the current allowed guidance and action
  boundary. Do not require identical prose or one particular task name.
- R5: reviewer input retains contracts separately and remains pending until
  actual execution observations arrive. No actual nested dispatch or task
  success is claimed.

## Verification

Build an application prompt with only `Task`, required starting inputs, current
guidance, source identity, the neutral output fields, and expanded guard. Keep
the outer oracle private. Run [the output assertions](verify-output.mjs) against
the actual JSON artifact and current guidance; independently review R4–R5 and
any open semantic aspects. Inspect available actions for forbidden outer-case
access; a self-report does not prove absence of access.

The assertion entrypoint accepts the result file followed by the current replay
reference as literal command operands. Reflow of the canonical guard is allowed.
For a safe faulty-output control, copy the result and change the model or
reasoning effort, move dispatcher settings into the message, remove
`fork_turns`, omit the guard, or forward one evaluator marker. Each
corresponding critical check must reject its faulty copy. These controls test
the assertions; they are not additional Agent runs or proof of improvement over
older guidance.

## Source

Recovered from the 2026-11-07 prompt-construction observations and targeted
dispatcher-schema follow-up used for commit `201e279`. The current maintainer
decision replaces lower-capability regression workers with fresh executors that
match the change author's model while retaining task-appropriate executor
configuration, the explicit prompt guard, evaluator separation, and actual
dispatcher arguments. The saved input retains that task with neutral material
names; new replay establishes current validity.
