# Explain operation effects after non-success

## Identity

- ID: automation-effects-focused-learning
- Kind: application

## Covered objects

- [Automation Handbook](../../SKILL.md)

## Protected behavior

A focused question about the consequences of an automated operation's
non-success must reach failure-and-recovery guidance even when the request
does not name retry or recovery. Preserve learning about effects, uncertainty,
and retained work without forcing unrelated validation-status or
diagnostic-evidence reading. Allow different explanation structures and
examples.

## Task

Explain how operators should distinguish a background publication that stopped
before changing anything, one that changed only part of its destination, and
one whose completion cannot be confirmed. Discuss what those outcomes mean for
effects already made and work already completed. This is a focused conceptual
explanation; do not design, modify, review, or diagnose a concrete workflow.

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
  operations](../../../../knowledge/software-design/operation-failure-and-recovery.md).
- R2 (critical): exclude workflow-outcome-integrity,
  failure-diagnostic-evidence, and Git change-comparison reading because no
  validation-status, investigation-evidence, revision-comparison, or concrete
  workflow task is present.
- R3: distinguish confirmed absence of effects, confirmed partial effects, and
  unconfirmed effects. Do not infer that a failed or missing completion signal
  proves that no effect occurred or that earlier work was undone.
- R4: explain that retained input and completed work follow the operation's
  established contract; distinguish confirmed facts from unknown state instead
  of inventing guarantees about the publication system.
- R5: treat packaged guidance as supplemental to active requirements and report
  unavailable required reading honestly instead of inventing it.

## Verification

Use the application dispatch template. Inspect reading choices, actual file
reads, and the explanation separately. Give the capable reviewer this contract,
the final Handbook and direct routes, and raw observations without the
coordinator's verdict. Judge every criterion independently and retain every
attempt.

A controlled faulty observation that omits failure-and-recovery reading,
requires an explicit retry request before selecting it, loads the complete
primary-work foundation, or equates an unconfirmed outcome with no effect must
fail the corresponding criterion. The controlled copy calibrates the reviewer
and is not another Agent run.

## Source

[GitHub issue #257](https://github.com/Soulike/knowledge-base/issues/257) requires
preserving focused questions about operation effects and uncertainty while
clarifying the boundary with validation evidence. This reconstructed case
protects that positive route independently of the existing outcome-only cases.
