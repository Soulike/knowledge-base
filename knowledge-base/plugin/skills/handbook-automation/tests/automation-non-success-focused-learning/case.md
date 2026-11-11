# Explain broad non-success outcomes

## Identity

- ID: automation-non-success-focused-learning
- Kind: application

## Covered objects

- [Automation Handbook](../../SKILL.md)

## Protected behavior

A broad focused question about unsuccessful outcomes of a background operation
must reach failure-and-recovery guidance without requiring the reader to name
effects, uncertainty, retained work, or recovery techniques first. Protect that
reading origin independently of requests already framed around those concerns.
Allow different meaningful state vocabularies, examples, and explanation
structures.

## Task

Explain the different unsuccessful outcomes an automated background operation
may expose to its consumer. This is a general learning question, without a
concrete workflow to design or review.

## Starting state

Supply the complete current Automation Handbook, its permitted direct canonical
routes, and the natural task request. Do not supply this case, expected reading
choices, evaluator criteria, prior outputs, or author conclusions. Use a fresh
supported lower-capability model with the expanded executor guard, read-only
access to the supplied repository snapshot, and a six-minute wall-clock
allowance.

Ask the executor to record every selected and excluded reading unit before
opening Knowledge, then answer the task. Record the exact source snapshot,
model, configuration, reading choices, files read, final answer, and available
action observations.

## Expected behavior

- R1 (critical): select and read [Failure and recovery in externally observable
  operations](../../../../knowledge/software-design/operation-failure-and-recovery.md)
  without requiring a more specific effects or retry request.
- R2 (critical): exclude workflow-outcome-integrity,
  failure-diagnostic-evidence, and Git change-comparison reading because no
  required-check acceptance, investigation-evidence, revision-comparison, or
  concrete workflow task is present.
- R3: distinguish meaningful outcomes by the consumer's result, effect
  certainty, and safe next action. Explain that a multi-step operation can have
  completed, incomplete, pending, or unconfirmed parts without imposing a
  universal list of status names.
- R4: do not infer absence or reversal of effects from a failed response alone.
  Tie safe continuation to established effects and the operation contract
  instead of recommending unconditional repetition.
- R5: treat packaged guidance as supplemental to active requirements and report
  unavailable required reading honestly instead of inventing it.

## Verification

Use the application dispatch template. Inspect reading choices, actual file
reads, and the explanation separately. Give the capable reviewer this contract,
the final Handbook and direct routes, and raw observations without the
coordinator's verdict. Judge every criterion independently and retain every
attempt.

A controlled faulty observation that selects no subject until the request names
effects or retry, loads the complete primary-work foundation, or assumes that
failure proves no effects must fail the corresponding criterion. The controlled
copy calibrates the reviewer and is not another Agent run.

## Source

[GitHub issue #257](https://github.com/Soulike/knowledge-base/issues/257) requires
preserving legitimate focused non-success learning while clarifying its
boundary with validation evidence. This reconstructed case protects broad
learning that does not already diagnose an operation-effects or recovery
concern.
