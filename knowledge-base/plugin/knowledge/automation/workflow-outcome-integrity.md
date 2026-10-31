# Outcome integrity in automated workflows

## Scope

This document explains how an automated workflow preserves the meaning of
required checks through applicability decisions, dependency scheduling, and
final completion or authorization. It covers the relationship between evidence,
protected effects, execution conditions, and the result accepted by an external
consumer across workflow engines and pipelines.

## When to update

Update when a workflow defect or stronger evidence changes how applicability,
dependency propagation, conditional execution, tolerated errors, final gates,
or consumer acceptance can conceal or preserve required-check outcomes.

## Define what completion must prove

Start with the workflow's intended result and the consumer that decides whether
it completed or may authorize another operation. The consumer may be a release
gate, a scheduler, another service, or a person reading a status. Identify the
required checks, the evidence each must produce, the work that depends on that
evidence, and the exact result the consumer accepts.

Treat success as an evidence requirement. A command failing internally does
not establish that the consumer receives failure. A stopped deployment does
not establish that its required status blocks release. Follow the result from
each producer through the effective execution graph to the final completion or
authorization boundary.

Distinguish a valid task result from inability to perform the task. A completed
analysis may validly report that no change is needed or that the available
evidence is inconclusive, when its contract permits those results. Failure to
complete mandatory analysis supplies neither result. The final gate must
verify successful completion under the declared contract rather than infer it
from absence of findings or effects.

## Establish applicability before selecting work

Keep the decision that a check applies separate from execution of that check.
A genuinely non-applicable check may be skipped only after a successful,
reliable applicability decision selects that declared path. Detection errors,
timeouts, malformed results, and missing evidence must remain explicit
failures of the responsible step. Do not map them to an empty selection,
unsupported environment, or successful skip.

Declare any optional degraded path and keep its result distinguishable from
completion of mandatory validation. Error tolerance for an optional activity
must not silently make a required prerequisite optional. For test workflows,
[trustworthy test execution](../software-testing/trustworthy-test-execution.md#keep-pass-fail-and-skip-honest)
defines the additional requirements for honest discovery, execution, selectors,
and test skips; a successful orchestration status alone cannot establish that
the intended validation ran.

## Inspect the effective execution graph

Review the graph that actually executes, including generated or compiled
configuration and reusable wrappers. Trace:

- which failed, cancelled, or skipped prerequisites prevent dependent work;
- which conditions allow cleanup, diagnostics, and reporting to continue;
- where error-tolerance settings or result mappings replace an underlying
  outcome with a successful conclusion; and
- which individual checks or aggregate result the consumer uses to admit the
  next operation.

Distinguish skipping a step, a job, and an entire workflow. Their reported
results and acceptance rules can differ. An authored "always run" condition is
not proof that the final reporter will execute: enclosing conditions,
dependency rules, wrappers, and workflow invocation still determine whether
that path is reached. Inspect both scheduling and the reporter's decision.

For example, GitHub Actions documentation consulted on 31 October 2026 stated
that a conditionally skipped job reported success even when configured as a required check
([job conditions](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-jobs-with-conditions)).
Failed or skipped prerequisites could also skip dependent jobs unless their
conditions allowed execution
([job dependencies](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idneeds)).
When the consumer required only a downstream status job, skipping that job could
therefore leave its requirement apparently satisfied without successful
validation. This differed from skipping a whole workflow through path, branch,
or commit-message filtering, which left its associated required checks
pending ([required-check troubleshooting](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks)).
This dated example illustrates the distinction between scheduling and
acceptance. Check the current engine and consumer contracts when applying it;
other platforms need not accept skipped work.

## Separate protected work from status reporting

Stop dependent effects when their required prerequisites are unsatisfied.
Schedule the final status decision so it can observe unsuccessful prerequisites
without allowing the protected work to proceed. Cleanup and diagnostics may
also need to run, but their success must not erase the primary failure.

The final gate must account for every applicable required check and accept
only evidence that it completed successfully under the declared contract.
Failure, cancellation, timeout, unexpected skipping, and missing results do
not satisfy that requirement. A declared non-applicable path needs evidence of
the successful applicability decision, not merely an absent check result.

Give a separate reporter only the trusted status information and capabilities
needed to decide and publish the result. Reporting an unsuccessful prerequisite
must not require executing protected processing, trusting its arbitrary
artifacts, or granting its effect-producing permissions. If the reporter cannot
run or its result is missing, the consumer's acceptance rule must still prevent
authorization without the required evidence.

For example, a release workflow can keep packaging and deployment dependent on
successful compatibility validation while a separate final status job inspects
the validation outcome. Failed validation stops release work and makes the
final required status explicitly unsuccessful. If applicability detection
fails, the same protection applies; a reliable decision that compatibility
validation does not apply follows its separately declared path.

A supported retry or recovery may eventually establish the required evidence.
It must do so through successful work, not by relabeling or discarding an
unsuccessful attempt. When earlier work may have produced partial or uncertain
effects, [operation failure and recovery](../software-design/operation-failure-and-recovery.md#make-recovery-a-supported-path)
governs the safe continuation: establish the earlier effects and the conditions
that make retry, reconciliation, or repair safe before using recovery to reach
completion.

## Verify the producer and the consumed result

Choose representative unsuccessful prerequisites that expose distinct faults
in the producer, scheduling, and final gate. Include failure, cancellation,
timeout, unexpected skipping, or missing results where those states are
reachable and can change the decision. Verify the genuinely non-applicable,
optional degraded, and recovered paths when the contract supports them.

For each selected case, observe both what the required check reports and what
the external consumer accepts. Assert that forbidden dependent effects do not
run and that missing successful evidence cannot authorize completion. Verify
that cleanup and diagnostics preserve the primary outcome when they succeed
or fail themselves.

Apply [test effectiveness](../software-testing/test-effectiveness.md#establish-the-owned-behavior)
to place detailed checks at the seam that owns each decision and a
representative composed check where scheduling or status mapping can lose its
meaning. Executing a final status command locally can establish its decisions
for supplied outcomes; it cannot establish that a hosted scheduler invokes it
or that a live ruleset consumes the intended check. Validate the effective
configuration with the platform's supported checks and observe the real
integration when practical and proportionate. State any unobserved scheduler
or consumer boundary explicitly.
