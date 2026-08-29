---
name: review-and-improve-tests
description: Review, diagnose, and improve existing or proposed automated tests and their execution. Use when reviewing coverage in a change; auditing ineffective, redundant, misleading, flaky, undiscovered, skipped, or slow tests; diagnosing test failures or harness and runner problems; or reviewing a proposed test change. Determine whether the defect belongs to production, the test, the harness, or infrastructure before changing it.
---

# Review and improve tests

Evaluate and complete every in-scope item independently. A file, suite, or
change may contain tests with different concerns and dispositions.

## Establish the review subject

1. For current-state diagnosis or improvement, discover and follow instructions,
   Skills, requirements, and project-specific information from the active
   working directory when they conflict with this plugin's packaged Knowledge
   or workflow guidance. For a fixed-point change review, use the rules at the
   selected comparison base and treat proposed rules as review evidence rather
   than authority that can redefine their own review.
2. Define the requested test, file, component, suite, change, harness, runner, or
   symptom boundary. Discover the production contracts, tests, static gates,
   project-declared commands, runner configuration, and supplied execution
   evidence within that scope without silently expanding it.
3. Choose the evidence mode. Reproduce current behavior when execution is
   permitted and practical. For fixed-point review, inspect immutable source,
   diffs, and exact-revision logs without modifying the active working tree to
   manufacture evidence. State what was directly observed, reproduced, or not
   established.
4. Resolve paths relative to this `SKILL.md` and load only the Knowledge needed
   by the identified concerns:
   - Read
     [Test effectiveness](../../knowledge/software-testing/test-effectiveness.md)
     when judging coverage, assertions, ownership, doubles, or test value, and
     before retaining, strengthening, replacing, consolidating, or deleting a
     reported failing or intermittent test.
   - Read
     [Trustworthy test execution](../../knowledge/software-testing/trustworthy-test-execution.md)
     for collection, selection, skips, fixtures, time, ordering, retries,
     concurrency, platforms, external processes, timeouts, runner changes, or
     intermittent outcomes.
   - Read
     [Test execution cost](../../knowledge/software-testing/test-execution-cost.md)
     when runtime or resource cost is claimed or changed.
5. Read
   [Security boundaries and trust transitions](../../references/security/security-boundaries.md)
   when a test harness creates, stores, or transports credentials or
   authenticates local peers.

Finish this step when every scoped item, claimed behavior, observed symptom, and
available evidence path is identified.

## Evaluate protection and classify the problem

1. When coverage or test value is in scope, map tests and live production
   behaviors in both directions. For each test, identify its named behavior,
   realistic fault, independent oracle, observable failure, and competing test
   or static evidence. Record tests with no identified behavior and behaviors
   with no identified protection instead of dropping either from the review.
2. Classify every item by the concerns that actually apply:

   | Concern                 | Evidence required                                                                                 |
   | ----------------------- | ------------------------------------------------------------------------------------------------- |
   | Effectiveness           | Named behavior and fault, independent oracle, owning seam, and competing protection               |
   | Consistent failure      | Stable signature and evidence locating the defect in production, test, harness, or infrastructure |
   | Intermittent outcome    | Exact execution conditions, attempt outcomes, and a bounded comparison protocol                   |
   | Collection or selection | Expected and actual identities plus honest run, fail, and legitimate-skip paths                   |
   | Execution cost          | Comparable baseline and candidate using the same cost basis                                       |

3. Assign each test or behavior a supported disposition: keep, strengthen,
   replace, consolidate, delete, add coverage, no test owed, or unresolved.
   Do not infer protection from test count or line coverage, and do not assume a
   failing or flaky test is defective merely because its outcome is disruptive.
4. Record production seams or module responsibilities that prevent direct,
   effective testing as design findings rather than hiding them behind more
   mocks or broader fixtures.

Finish this step when every scoped item has its own concern set and disposition
tied to concrete evidence. An unresolved value decision blocks deletion,
suppression, assertion weakening, or replacement with less protection.

## Establish branch-specific evidence

- For a **consistent failure**, reproduce the stable signature when practical,
  form competing hypotheses, and identify whether the owner is production, the
  test, its fixture or harness, runner configuration, or infrastructure.
- For an **intermittent outcome**, bind the evidence to an exact revision,
  command, platform, concurrency, retry policy, and relevant environment. For a
  retained test, define a bounded before-and-after protocol with retries disabled
  when supported or every attempt captured. Prefer a controlled perturbation of
  the suspected mechanism over unfocused repetition. A remove disposition does
  not require reproducing a flake; a replacement uses conditions relevant to its
  new owning seam.
- For **collection, selection, skip, or runner changes**, compare expected and
  actual test identities in both directions and account for result and skip
  outcomes, lifecycle hooks, cleanup, scheduling, concurrency, isolation, and
  affected project-declared entrypoints as applicable.
- For **execution cost**, establish a reproducible baseline before editing when
  practical. Use the same metric, aggregate, environment, and relevant runner
  configuration for control and candidate; establish execution trust before
  attributing noisy measurements.

Finish this step when each applicable claim has mechanism-level evidence or an
explicit gap. A larger timeout, retry count, reduced assertion, or favorable
single timing sample is not a diagnosis.

## Improve or report

Handle every item according to its own evidence and disposition:

- Preserve a production defect exposed by a correct test as product evidence;
  repair production rather than weakening the test.
- Strengthen or replace an ineffective test at the seam that owns the behavior.
- Consolidate or delete only when retained evidence catches the same realistic
  fault or no live contract remains.
- Repair a retained unreliable test at the diagnosed owner: test, fixture,
  harness, runner configuration, infrastructure, or production.
- Reduce execution cost only at a diagnosed hotspot while preserving protection
  and execution trust.
- Leave unresolved protection intact while gathering evidence.

When edits are authorized, apply the smallest coherent changes that satisfy all
in-scope dispositions and preserve unrelated behavior and user work. For a
diagnostic or review-only request, report the disposition, evidence, proposed
change, and validation still required without editing.

## Prove every result

1. Confirm affected tests are collected through the relevant project-declared
   entrypoints.
2. Apply Test effectiveness to every final protection claim. A retained,
   strengthened, or replacement test must catch its named fault. A consolidation
   or deletion must leave equivalent protection or establish that no test is
   owed.
3. For a reliability repair, compare relevant pre- and post-change executions
   under the bounded protocol. Exercise owned cleanup on success and failure and
   state when a pre-change sample could not be obtained. Report the result as
   verified only when the evidence establishes both trustworthy execution and
   preserved protection; otherwise report the exact inconclusive gap.
4. For collection, selection, skip, or runner changes, prove the affected
   inventories and result paths rather than relying on a green aggregate.
5. For cost changes, compare the same metric and aggregate under comparable
   conditions, report environmental limits, and recheck effectiveness and
   execution trust.
6. Restore every temporary mutation, perturbation, sentinel, clock, resource,
   process, fixture, and environment change. Run the focused and broader checks
   required by the active project and changed scope.

Finish only when every item's own disposition is completed or explicitly
blocked, unauthorized, review-only, or inconclusive; completion of one branch
does not satisfy another. Report each disposition, diagnosed owner, performed
and skipped checks, and remaining evidence gaps.
