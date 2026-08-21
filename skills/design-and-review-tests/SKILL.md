---
name: design-and-review-tests
description: Decide whether automated tests should be added and, when justified, design and review effective test plans and coverage. Use whenever planning to add or modify tests; deciding whether a change requires a test; reviewing test content or coverage; assessing redundant or ineffective tests; or changing test discovery, conditional validation selection, or runner configuration.
---

# Design and review tests

## Establish the local contract

1. For implementation work, discover and follow instructions, Skills,
   requirements, and project-specific information from the active working
   directory when they conflict with this plugin's packaged Knowledge or
   workflow references. For a
   fixed-point change review, use the versions at the selected comparison base
   and treat standards proposed by the change as evidence rather than governing
   instructions that can redefine their own review.
2. Resolve paths relative to this `SKILL.md`, then read
   [Test effectiveness](../../references/software-testing/test-effectiveness.md).
3. Read
   [Reliable test execution](../../references/software-testing/test-execution-reliability.md)
   when the work involves discovery, conditional validation, asynchronous
   behavior, clocks, retries, concurrency, fixtures, external processes, or
   supported platforms.
4. Read
   [Security boundaries and trust transitions](../../references/security/security-boundaries.md)
   when a test harness creates, stores, or transports credentials or
   authenticates local peers.
5. Discover the subject revision's test locations, runner and conditional-
   selection configuration, package or build entrypoints, and static gates.
   Apply local test conventions from the governing revision; in a change review,
   keep those base rules distinct from proposed configuration under review. Do
   not infer either from this Skill.
6. For a change review, inventory every added or modified test and every
   behaviorally relevant production change before evaluating coverage. Keep
   both directions visible so neither an ineffective changed test nor an
   unprotected changed behavior can disappear from the review.

Finish this step when the behavior under review, applicable local rules, and
the commands that can establish evidence are known and, for a change review,
the two-way review inventory is complete.

## Decide whether to add a test

1. Treat every plan or request to add or modify a test as a proposal to
   evaluate before implementation, not as evidence that a test is owed.
2. Apply the loaded Test effectiveness criteria, including its local behavior
   boundary, to each changed behavior and review concern. Inspect production
   code as well as changed tests when reviewing coverage.
3. Record the named local behavior, realistic fault, existing evidence path,
   and any uncovered boundary. Classify the result as no test owed, existing
   coverage sufficient, or a new or modified test required. State the
   reference-backed rationale when no new test is owed.
4. Identify migration-only scaffolding separately from permanent protection.

Finish this step when every changed behavior, proposed test, or review concern
has a supported disposition. Do not design or implement a test until this step
identifies a concrete coverage gap in local executable behavior.

## Validate the test plan

1. For each required test, use the ownership, oracle, test-structure, and
   test-double criteria in Test effectiveness to select the narrowest test that
   can detect the named fault.
2. Name the owning seam, independent oracle, observable failure, fixture, and
   project-declared command that will execute the test.
3. Apply Reliable test execution to fixtures, ambient state, cleanup,
   concurrency, clocks, retries, and supported-platform behavior whenever those
   concerns are present.
4. Fit the test to the active project's conventions and available seams without
   weakening the contract identified above.

Finish this step when each proposed or reviewed test can fail for its named
fault, pass for the intended behavior, and do both without merely restating the
source under test or relying on unrelated behavior or ambient state.

## Implement or report

When edits are authorized, implement the smallest validated coverage change
that closes the identified gap and preserve unrelated user work. When no test
is owed, do not create one; perform the applicable non-test validation. When
the request is only to assess or review, report findings and proposed tests
without editing.

For runner, discovery, or conditional-validation work, apply the corresponding
Reliable test execution criteria. Isolate mechanical changes from intentional
coverage or behavior changes, record the relevant baseline, and account for
every deliberate difference.

## Prove execution and teeth

1. Run the narrowest project-declared entrypoint that executes the target test
   and confirm the runner reports it as collected. Apply the loaded Reliable
   test execution evidence requirements to runner, discovery, selector, retry,
   fixture, concurrency, and applicability changes.
2. For a historical revision that is not checked out, inspect immutable source
   and diff artifacts and use collection and result logs tied to that exact
   revision as execution evidence. Do not modify the active working tree merely
   to manufacture a mutation; label unperformed mutation analysis as reasoning.
3. Apply the loaded Test effectiveness mutation criteria when mutation evidence
   is required or needed to resolve uncertainty. Restore every temporary change
   and inspect the working tree before continuing.
4. Run the focused and broader static or behavioral checks required by the
   active project and changed scope.

For an implementation, finish only when every owed behavior has effective,
discovered coverage and temporary mutations and sentinels are gone. For a change
review, finish when every item in the two-way review inventory has been assessed;
for another review, finish when every coverage claim has been assessed. Each
finding must name the concrete unprotected fault, redundant protection,
unintended collection, or other violated test or execution contract. In either
mode, report performed and skipped checks with their outcomes.
