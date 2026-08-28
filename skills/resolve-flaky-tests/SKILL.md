---
name: resolve-flaky-tests
description: Evaluate, diagnose, repair, and verify tests whose execution varies across comparable runs. Use when the same test at the same revision alternates between passing, failing, timing out, skipping, or not being collected; passes only after retry; varies with test order, machine load, or timing; or when reviewing a proposed flaky-test repair. Not for consistently failing tests or test discovery and runner migrations without intermittent outcomes.
---

# Resolve flaky tests

Complete every step and disposition independently for each in-scope test. A
scope containing several tests may take several different paths.

## Establish the evidence

1. For a current-state diagnosis or implementation, discover and follow
   instructions, Skills, requirements, and project-specific information from
   the active working directory when they conflict with this plugin's packaged
   Knowledge or workflow references. For a fixed-point change review, use the versions at the
   selected comparison base and treat standards proposed by the change as
   evidence rather than governing instructions that can redefine their own
   review.
2. Resolve paths relative to this `SKILL.md`, then read
   [Reliable test execution](../../knowledge/software-testing/reliable-test-execution.md)
   and
   [Test effectiveness](../../references/software-testing/test-effectiveness.md).
   Read
   [Security boundaries and trust transitions](../../references/security/security-boundaries.md)
   when a test harness creates, stores, or transports credentials or
   authenticates local peers.
3. Define the scoped tests. For each reported failure, identify its complete
   signature, command or job, revision, platform, retry policy, concurrency,
   relevant environment, and any unchanged rerun that passed. Discover the
   subject revision's runner configuration, fixtures, selection and skip rules,
   environments, and supported platforms within that scope.
4. Choose the evidence mode. Reproduce a current failure when execution is
   permitted and practical. For a fixed-point review, inspect supplied runs and
   immutable exact-revision artifacts without editing the reviewed working
   tree. State what was observed, reproduced, or not established.

Finish this step when every test's intermittent outcome is bound to exact
execution conditions, or when a review identifies the exact evidence still
needed.

## Decide whether each test earns repair

1. Identify the production behavior, realistic defect that should make the
   test fail, independent oracle, and every test or static gate that could catch
   the same fault.
2. Assign one disposition before choosing a reliability repair:
   - **Retain** a test with unique protection.
   - **Remove** a test with no unique fault to catch.
   - **Replace** valuable coverage that observes the wrong or an ineffective
     seam.
   - **Unresolved** when the available evidence cannot establish value.
3. When retained coverage or claimed redundancy remains uncertain, use a safe,
   reversible mutation only in an authorized disposable environment. Otherwise
   record the missing proof instead of assuming that test count or line
   coverage establishes value.

Finish this step when every test has a disposition tied to a concrete fault and
competing evidence. An unresolved value decision permits further investigation
or a coverage-preserving harness repair, but blocks weakening, deletion, or
suppression.

## Build a feedback loop

For each **retain** or **replace** test, continue through this section. An
**unresolved** test may also continue for investigation or a
coverage-preserving harness repair. A **remove** test skips this section and
Diagnose the cause. After establishing the protocol, a **replace** test also
skips Diagnose the cause and continues to Repair or report.

1. Define one bounded pre- and post-repair protocol: a focused command or
   harness, the stable failure signature, retries disabled when supported or
   every attempt's outcome captured, a sample count or stopping rule, and fixed
   relevant inputs such as platform, concurrency, resource load, timing, and
   fixture state.
2. Prefer a controlled perturbation that exercises the suspected window, and
   register restoration of every affected clock, resource, environment value,
   process, and fixture on all exits.
3. Record the pre-repair outcomes when practical. When the available
   environment cannot reproduce the failure, preserve the exact evidence and
   identify the execution conditions needed to close the gap.

Finish this step when every test routed here has a loop that exposes the
reported signature at a useful rate, or an explicit reproduction gap and
required environment. The latter does not establish a cause by itself.

## Diagnose the cause

Apply this section only to **retain** tests and **unresolved** tests routed
through Build a feedback loop.

1. Generate competing, falsifiable hypotheses and vary one relevant execution
   input at a time when the evidence mode permits it.
2. Classify the mechanism as discovery or selection behavior, synchronization,
   clock control, mutable-state or environment isolation, retry-hidden
   nondeterminism, platform behavior, external-process handling,
   runner-semantic drift, or measured runtime variation.
3. Distinguish a production defect correctly exposed by the test, a test or
   harness defect, an execution-infrastructure or configuration defect, a
   supported-platform or applicability difference, and measured runtime
   variation at an already-minimal real integration boundary.
4. Name the violated execution contract and the mechanism that produces the
   observed intermittent outcome. Apply Reliable test execution's timeout
   criteria before treating runtime variation as the mechanism. Preserve a
   production failure as product evidence rather than changing the test to make
   it pass.
5. For a change review, evaluate the proposed mechanism and exact-revision
   evidence without modifying the active working tree merely to manufacture a
   reproduction.

Finish this step when every test routed here has a mechanism-level diagnosis
that explains the observed signature and controlled evidence, or an explicit
inconclusive evidence gap. An inconclusive diagnosis blocks causal remediation;
a larger timeout, retry count, or reduced assertion is not a diagnosis.

## Repair or report

Handle every test according to its own disposition:

- **Remove:** when authorized, remove the redundant test. Otherwise report the
  evidence and the blocked or unauthorized removal.
- **Replace:** when authorized, replace the test with effective coverage at the
  owning seam. Otherwise report the evidence and the blocked or unauthorized
  replacement.
- **Retain:** when authorized and the mechanism is established, repair the
  production defect exposed by the test or the test, harness, infrastructure,
  configuration, platform, or integration-boundary mechanism. Use a local
  measured timeout only for established inherent runtime variation.
- **Unresolved:** continue only with investigation or an authorized,
  coverage-preserving harness repair whose mechanism is established. Report
  the unresolved value evidence and leave the test's protection intact.

For a diagnostic or review-only request, report the value disposition,
diagnosis when that path was required, evidence, proposed repair when the
mechanism is conclusive, and validation still required without editing.

Finish this step only when every test's own path is implemented, explicitly
blocked, inconclusive, review-only, or unauthorized. Do not use the completion
of one test or disposition to satisfy another.

## Prove the result

1. For each retained test or coverage-preserving harness repair, run the test
   before and after using the bounded protocol. For a replacement, preserve the
   original test's pre-repair outcomes when practical, then run the replacement
   under the same relevant conditions and perturbation. Keep retries disabled
   when supported or preserve attempt-level outcomes; keep concurrency and the
   relevant environment fixed; apply the chosen sample count or stopping rule;
   and compare outcomes with the reported intermittent signature and, when
   diagnosed, mechanism. Exercise lifecycle cleanup on both success and
   failure, and state when a pre-repair sample could not be obtained. For a
   diagnosis or review, assess supplied exact-revision evidence against the
   same protocol and report every missing element without editing.
2. Apply Test effectiveness to every final disposition. A retained or
   replacement test must catch its named fault. A removal must show that a
   retained test or static gate catches the redundant fault, or that no live
   production contract remains.
3. For fixture, platform, or external-process changes, verify private state,
   cleanup on success and failure, and behavior in each affected supported
   environment. Run the focused and broader checks required by the active
   project and changed scope.
4. For a review of a retained-test reliability repair, return **verified** only
   when matched red-before and stable-after evidence establishes that the
   mechanism is removed and protection remains effective. For a replacement,
   also require bounded stable-after evidence under the relevant conditions.
   For a removal, require its Test effectiveness disposition and resulting
   protection. Return **rejected** when the mechanism remains or protection
   weakens; otherwise return **inconclusive** and identify the missing matched
   condition or effectiveness evidence.

Finish when every test's disposition is satisfied or explicitly blocked, every
available reliability and test-value claim is assessed, each missing proof is
explicit, and every temporary perturbation or mutation is gone. Report each
test's disposition, diagnosis when required, repair or blocker, performed and
skipped checks, and remaining evidence gaps.
