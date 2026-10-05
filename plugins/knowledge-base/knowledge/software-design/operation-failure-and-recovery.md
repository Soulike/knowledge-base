# Failure and recovery in externally observable operations

## Scope

This document explains how to design non-success outcomes and recovery as part
of an operation's contract when an external consumer can observe its result. It
covers meaningful outcome states, effect and confirmation uncertainty, avoidable
failures, retained work, supported recovery, and evidence that the resulting
path works across interfaces and background processes.

## When to update

Update when evidence changes how externally observable outcomes, operation
effects, uncertainty, consumer capabilities, recovery, and verification relate
to one another during software design.

## Design the outcomes with the operation

Start with the consumer's task and the operation's intended result. Establish
the inputs and prerequisites, who may act, what work the consumer has already
invested, which effects the operation can produce, and how completion becomes
observable. A background operation still has an external outcome when a person,
API client, or another consumer later depends on its status or result.

Work through the operation's reachable transitions before settling its API
shape, interface, or success presentation. At each transition, consider what
can reject the request, interrupt progress, leave a partial effect, delay
completion, or prevent confirmation. Include faults that the system handles
internally only when they change the consumer's result, wait, available action,
or confidence in what happened. Prevent an avoidable failure at the point where
the system already has enough information to do so; do not make the consumer
discover a known prerequisite only after investing work.

## Distinguish outcomes by consequence

Group underlying faults when they leave the consumer with the same result,
effect certainty, and safe next action. Keep states separate when any of those
change. For each meaningful non-success state, establish:

- which requested result is absent, incomplete, delayed, or degraded;
- which effects definitely happened, definitely did not happen, or remain
  unconfirmed;
- which input and completed work remain available; and
- what the consumer or system can safely do next, including any prerequisite,
  permission, or wait.

A multi-step operation may have completed, failed, pending, and unconfirmed
parts at once. A failed response does not prove that an earlier mutation had no
effect. Describe an earlier effect as undone only when the operation contract
and observed state establish that outcome. The [failure-communication
contract](user-facing-failure-communication.md#bind-explanations-to-established-facts)
governs what the eventual consumer-facing result may claim about those facts
and uncertainties.

Do not enumerate every exception or invent unreachable combinations. Record a
material unknown when the design or implementation does not establish whether
a state can occur or what it does to the consumer. That unknown is a contract
question to resolve, not a reason to silently collapse the state into generic
failure.

## Make recovery a supported path

For each outcome, define a feasible continuation toward the consumer's goal or
an honest terminal result. Recovery may mean correcting input, retaining
completed work and continuing, checking the result before another attempt,
repairing a prerequisite, reversing a partial effect, or escalating to someone
who has the needed capability. Name the actor, available control or channel,
precondition, and observable result of that continuation. A request to repeat
the same action is useful only when the condition has changed or the
[operation's effect contract makes repetition safe](user-facing-failure-communication.md#treat-retry-advice-as-a-behavioral-promise).

If the current product cannot expose an uncertain result or provide a needed
repair, resume, rollback, or safe retry, identify the missing capability as a
design gap. An accurate explanation can serve as an interim response, but it
does not establish that the consumer can recover. When self-service is not
feasible, a real escalation path with the information needed to act can be the
supported continuation. Decisions that may lose data, duplicate effects,
change permissions, or create an irreversible outcome require the responsible
product or contract owner.

Recovery should preserve valid input and completed work when the contract
permits it. If a product must discard either, make the loss and the necessary
next action explicit. For an interactive flow, place feedback where the
consumer can connect it to the affected work, keep consequential status
available long enough to act, and support the interface's relevant input and
accessibility paths. The appropriate presentation follows the operation's
outcome and the consumer's task; it does not define either one.

## Verify the whole path

Carry each material outcome to its consumer using the
[producer-to-consumer trace](user-facing-failure-communication.md#trace-the-delivered-failure).
Check that the distinct effects, uncertainties, and recovery conditions in the
operation contract remain distinct in what the consumer receives.
Where the consumer implementation is outside the project, define and verify
the published contract and state what remains unobserved in downstream use.

Give each material outcome a verification disposition: existing protection,
new protection, another applicable observation, or an explicit gap. Place
detailed branch tests at the seam that owns the decision; add a representative
composed case when a plausible defect would lose or distort meaning between
seams. [Test effectiveness](../software-testing/test-effectiveness.md#select-fault-revealing-scenarios)
provides the criteria for selecting fault-revealing states and boundaries.
For a consequential interactive recovery path, an operable prototype or
implementation can also be checked through an uncoached task. Observe whether
the person recognizes the result, finds a safe action, and can continue; an
automated state check alone cannot establish that experience.
