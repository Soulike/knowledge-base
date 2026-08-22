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
   when the work changes assertions, test ownership, doubles, or coverage, or
   deletes or consolidates tests.
4. Read
   [Security boundaries and trust transitions](../../references/security/security-boundaries.md)
   when a test harness creates, stores, or transports credentials or
   authenticates local peers.
5. Define the scoped execution target: a test, file, shard, suite, runner or
   framework migration, or affected project-declared entrypoints and supported
   platforms. Do not silently expand a bounded reliability task to the whole
   repository.
6. Discover the subject revision's runner and discovery configuration,
   project-declared commands, selection and skip rules, retry policy,
   concurrency, fixtures, environments, and supported platforms within that
   scope. In a change review, keep governing configuration at the comparison
   base distinct from proposed configuration.
7. Choose the evidence mode. Reproduce a current failure when edits are
   authorized and practical; for a diagnostic or review-only request, inspect
   supplied runs and immutable exact-revision artifacts and state what was
   observed, reproduced, or not established.
8. For a runner, framework, or discovery migration, record the expected test
   inventory and baseline result and skip outcomes, lifecycle behavior,
   cleanup and environment restoration, scheduling, concurrency, isolation,
   and every scoped project-declared entrypoint. For an intermittent failure,
   define a bounded pre- and post-repair protocol before editing: identify the
   stable failure signature; disable retries when supported; hold concurrency
   and the relevant environment constant; choose a sample count or stopping
   rule; and record the pre-repair outcomes when practical.

Finish this step when the expected execution contract and observed deviation
are established, or when a review identifies the exact evidence still needed.

## Diagnose the reliability failure

1. Classify the issue as discovery or static-analysis omission, conditional
   selection, applicability or skip handling, synchronization, clock control,
   mutable-state or environment isolation, retry-hidden nondeterminism,
   platform behavior, external-process handling, or runner-semantic drift.
2. Name the violated execution contract and the mechanism that can produce the
   observed false pass, omission, nondeterminism, or migration difference.
3. Separate a production defect from a test-harness defect. Preserve a product
   failure as product evidence rather than weakening the test to make it pass.
4. For a change review, evaluate the proposed mechanism and exact-revision
   evidence without modifying the active working tree merely to manufacture a
   reproduction.

Finish this step when each scoped issue has a mechanism-level diagnosis or an
explicit evidence gap, not merely a larger timeout, retry count, or reduced
assertion.

## Repair or report

1. When edits are authorized, apply the narrowest change that restores the
   execution contract. Use the applicable Reliable test execution criteria for
   discovery, selectors, synchronization, clocks, state ownership, cleanup,
   retries, concurrency, platforms, and external processes.
2. For runner or discovery changes, isolate mechanical conversion from
   intentional assertion, fixture, coverage, or behavior changes and account
   for every deliberate difference.
3. Preserve private mutable state and explicit applicability rules. A present
   but broken dependency must fail visibly rather than becoming an unsupported
   environment.
4. For a diagnostic or review-only request, report the diagnosis, evidence,
   proposed repair, and validation still required without editing.

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
   retries disabled when supported, use the same concurrency and relevant
   environment, apply the chosen sample count or stopping rule, and compare the
   stable failure signature and outcomes. State explicitly when a pre-repair
   sample could not be obtained. For a diagnosis or review, assess supplied
   exact-revision evidence against the same protocol and report each missing
   element without editing.
4. For fixture, platform, or external-process changes, verify private state,
   cleanup on success and failure, and behavior in each affected supported
   environment.
5. Apply Test effectiveness whenever the repair changes coverage, assertions,
   ownership, or doubles. Run the focused and broader checks required by the
   active project and changed scope.

For an implementation, finish only when every scoped intended test is
collected, no failure is hidden as a pass or unsupported skip, relevant results
are reproducible, migration semantics are preserved or deliberately accounted
for, and temporary sentinels and mutations are gone. For a diagnosis or review,
finish when every available reliability claim has been assessed and each
missing proof is explicit. In either mode, report performed and skipped checks
with their outcomes.
