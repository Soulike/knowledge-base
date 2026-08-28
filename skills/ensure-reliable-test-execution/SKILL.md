---
name: ensure-reliable-test-execution
description: Diagnose, change, and verify automated test execution so intended tests run and results are reproducible and fail-safe. Use when tests are flaky, order- or platform-dependent, silently skipped or undiscovered; when fixtures, clocks, retries, concurrency, or external processes make results unreliable; or when changing test discovery, conditional validation, runner or framework collection, or execution semantics.
---

# Ensure reliable test execution

## Establish the execution contract

1. For a current-state diagnosis or implementation, discover and follow
   instructions, Skills, requirements, and project-specific information from
   the active working directory when they conflict with this plugin's packaged
   Knowledge or workflow references. For a fixed-point change review, use the
   versions at the selected comparison base and treat standards proposed by the
   change as evidence rather than governing instructions that can redefine
   their own review.
2. Resolve paths relative to this `SKILL.md`, then read
   [Reliable test execution](../../references/software-testing/test-execution-reliability.md).
3. Read
   [Test effectiveness](../../references/software-testing/test-effectiveness.md)
   for every intermittent test whose retention, removal, replacement, or repair
   is being decided, and whenever the work changes assertions, test ownership,
   doubles, or coverage, or deletes or consolidates tests.
4. Read
   [Security boundaries and trust transitions](../../references/security/security-boundaries.md)
   when a test harness creates, stores, or transports credentials or
   authenticates local peers.
5. Define the scoped execution target: a test, file, shard, suite, runner or
   framework migration, or affected project-declared entrypoints and supported
   platforms. Do not silently expand a bounded reliability task to the whole
   repository.
6. For a reported failure, identify its complete signature, command or job,
   revision, platform, retry policy, concurrency, relevant environment, and any
   unchanged rerun that passed. Discover the subject revision's runner and
   discovery configuration, project-declared commands, selection and skip
   rules, fixtures, environments, and supported platforms within the scope. In
   a change review, keep governing configuration at the comparison base
   distinct from proposed configuration.
7. Choose the evidence mode. Reproduce a current failure in a disposable
   environment when execution is permitted and practical. For a fixed-point
   review, inspect supplied runs and immutable exact-revision artifacts without
   editing the reviewed working tree. State what was observed, reproduced, or
   not established.
8. For a runner, framework, or discovery migration, record the expected test
   inventory and baseline result and skip outcomes, lifecycle behavior,
   cleanup and environment restoration, scheduling, concurrency, isolation,
   and every scoped project-declared entrypoint.

Finish this step when the expected execution contract and reported failure or
observed deviation are bound to exact execution conditions, or when a review
identifies the exact evidence still needed.

## Decide whether an intermittent test earns repair

1. For each intermittent test, identify the production behavior, realistic
   defect that should make the test fail, independent oracle, and every test or
   static gate that could catch the same fault.
2. Assign one Test effectiveness disposition before choosing a reliability
   repair: retain a test with unique protection, remove one with no unique
   fault to catch, or replace valuable coverage that observes the wrong or an
   ineffective seam.
3. When retained coverage or claimed redundancy remains uncertain, use a safe,
   reversible mutation only in an authorized disposable environment. Otherwise
   record the missing proof instead of assuming that test count or line
   coverage establishes value.

Finish this step for an intermittent failure only when the test has a retain,
remove, replace, or unresolved disposition tied to a concrete fault and
competing evidence. An unresolved value decision blocks remediation that would
weaken, delete, or merely suppress the test.

## Build an intermittent feedback loop

1. After the test-value decision, define one bounded pre- and post-repair
   protocol: a focused command or harness, the stable failure signature,
   retries disabled when supported or every attempt's outcome captured, a
   sample count or stopping rule, and fixed relevant inputs such as platform,
   concurrency, resource load, timing, and fixture state.
2. Prefer a controlled perturbation that exercises the suspected window, and
   register restoration of every affected clock, resource, environment value,
   process, and fixture on all exits.
3. Record the pre-repair outcomes when practical. When the available
   environment cannot reproduce the failure, preserve the exact evidence and
   identify the execution conditions needed to close the gap.

Finish this step for an intermittent failure when the loop exposes the reported
signature at a useful rate, or when the reproduction gap and required
environment are explicit. The latter does not establish a cause by itself.

## Diagnose the reliability failure

1. Generate competing, falsifiable hypotheses and vary one relevant execution
   input at a time when the evidence mode permits it.
2. Classify the issue as discovery or static-analysis omission, conditional
   selection, applicability or skip handling, synchronization, clock control,
   mutable-state or environment isolation, retry-hidden nondeterminism,
   platform behavior, external-process handling, or runner-semantic drift.
3. Name the violated execution contract and the mechanism that can produce the
   observed false pass, omission, nondeterminism, or migration difference.
4. For an intermittent failure, distinguish a production defect correctly
   exposed by the test, a harness defect, a supported-platform or applicability
   difference, and measured runtime variation at an already-minimal real
   integration boundary. Apply Reliable test execution's timeout criteria
   before treating runtime variation as the mechanism.
5. Preserve a production failure as product evidence rather than weakening the
   test to make it pass.
6. For a change review, evaluate the proposed mechanism and exact-revision
   evidence without modifying the active working tree merely to manufacture a
   reproduction.

Finish this step when each scoped issue has a mechanism-level diagnosis that
explains the observed signature and controlled evidence, or an explicit
inconclusive evidence gap. An inconclusive diagnosis blocks causal remediation;
a larger timeout, retry count, or reduced assertion is not a diagnosis.

## Repair or report

1. When edits are authorized and the mechanism is established, apply the
   narrowest change that restores the execution contract. Use the applicable
   Reliable test execution criteria for discovery, selectors, synchronization,
   clocks, state ownership, cleanup, retries, concurrency, platforms, external
   processes, and honest runtime variation.
2. For an intermittent failure, follow the test's value disposition: remove a
   redundant test, replace valuable coverage at its owning seam, repair a
   production defect exposed by a retained test, or repair harness
   nondeterminism at its mechanism. Use a local measured timeout only for
   established inherent runtime variation.
3. For runner or discovery changes, isolate mechanical conversion from
   intentional assertion, fixture, coverage, or behavior changes and account
   for every deliberate difference.
4. Preserve private mutable state and explicit applicability rules. A present
   but broken dependency must fail visibly rather than becoming an unsupported
   environment.
5. For a diagnostic or review-only request, report the value disposition,
   diagnosis, evidence, proposed repair when the mechanism is conclusive, and
   validation still required without editing. For an inconclusive result,
   report the required environment or evidence and why remediation remains
   blocked.

Finish this step when the authorized repair is implemented at the diagnosed
owner, or when the requested diagnosis or review accounts for the available
evidence and every blocked or unauthorized change without editing.

## Prove reliable execution

1. For discovery, runner, or framework changes, compare expected and collected
   test identities in both directions. Also compare result and skip outcomes,
   lifecycle hooks, cleanup, environment restoration, scheduling, concurrency,
   isolation, and every affected project-declared entrypoint. Remove any
   temporary failing sentinel after proving collection.
2. For conditional validation or applicability changes, exercise known
   affected, known unaffected, high-fan-out or global, mixed, and unknown
   inputs. Prove both the run and legitimate-skip paths and the fail-safe or
   conservative fallback for invalid or unavailable classification.
3. For every intermittent failure with an implemented repair, run the
   representative tests before and after using the bounded protocol: keep
   retries disabled when supported or preserve attempt-level outcomes, use the
   same controlled perturbation when one was selected, keep concurrency and the
   relevant environment fixed, apply the chosen sample count or stopping rule,
   and compare the stable failure signature and outcomes. Exercise lifecycle
   cleanup on both success and failure. State explicitly when a pre-repair
   sample could not be obtained. For a diagnosis or review, assess supplied
   exact-revision evidence against the same protocol and report each missing
   element without editing.
4. For fixture, platform, or external-process changes, verify private state,
   cleanup on success and failure, and behavior in each affected supported
   environment.
5. Apply Test effectiveness to every intermittent repair and whenever another
   repair changes coverage, assertions, ownership, or doubles. A retained or
   replacement test must still catch its named fault; removal must show that a
   retained test or static gate catches the redundant fault, or that no live
   production contract remains. Run the focused and broader checks required by
   the active project and changed scope.
6. For a review of an existing intermittent repair, return **verified** only
   when matched red-before and stable-after evidence establishes that the
   mechanism is removed and protection remains effective; return **rejected**
   when the mechanism remains or protection weakens; otherwise return
   **inconclusive** and identify the missing matched condition.

For an implementation, finish only when every scoped intended test is
collected, no failure is hidden as a pass or unsupported skip, relevant results
are reproducible, migration semantics are preserved or deliberately accounted
for, every applicable intermittent test's value disposition is satisfied,
lifecycle cleanup has been exercised, and temporary sentinels, perturbations,
and mutations are gone. For a diagnosis or review, finish when every available
reliability and test-value claim has been assessed and each missing proof is
explicit. In either mode, report performed and skipped checks with their
outcomes.
