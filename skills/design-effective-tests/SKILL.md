---
name: design-effective-tests
description: Decide what automated coverage a production behavior or bounded coverage need requires, then design, implement, or review effective tests. Use when designing initial automated coverage for a new project or untested module; starting from a new, changed, or unchanged legacy production behavior; deciding whether behavior needs a test; or reviewing coverage scoped to that behavior or change.
---

# Design effective tests

## Establish the target behavior contract

1. For implementation work, discover and follow instructions, Skills,
   requirements, and project-specific information from the active working
   directory when they conflict with this plugin's packaged Knowledge or
   workflow references. For a fixed-point change review, use the versions at
   the selected comparison base and treat standards proposed by the change as
   evidence rather than governing instructions that can redefine their own
   review.
2. Resolve paths relative to this `SKILL.md`, then read
   [Test effectiveness](../../references/software-testing/test-effectiveness.md).
3. Read
   [Reliable test execution](../../knowledge/software-testing/reliable-test-execution.md)
   when the work involves asynchronous behavior, clocks, retries, concurrency,
   fixtures, external processes, or supported platforms.
4. Read
   [Security boundaries and trust transitions](../../references/security/security-boundaries.md)
   when a test harness creates, stores, or transports credentials or
   authenticates local peers.
5. Define the target production behavior or coverage gap. When the request
   starts from a new project, component, or module-level coverage need, bound
   the subject and derive the concrete production behaviors before deciding on
   tests. Discover the subject revision's applicable test locations,
   project-declared commands, static gates, and local test conventions. In a
   change review, keep the governing rules at the comparison base distinct from
   proposed configuration under review.
6. When the target is an actual change, inventory every behaviorally relevant
   production change and every added or modified test. Keep both directions
   visible so neither an ineffective changed test nor an unprotected changed
   behavior can disappear from the review.

Finish this step when every target behavior, the applicable local rules, and
the commands that can establish evidence are known and, for a review of actual
changes, the two-way change inventory is complete.

## Decide what coverage is owed

1. Treat every plan or request to add or modify a test as a proposal to
   evaluate before implementation, not as evidence that a test is owed.
2. Apply Test effectiveness, including its local behavior boundary, to each
   target behavior and proposed test. Inspect existing coverage and production
   code rather than evaluating the proposed test in isolation.
3. Record the named local behavior, realistic fault, existing evidence path,
   and any uncovered boundary. Classify the result as no test owed, existing
   coverage sufficient, or a new or modified test required. State the
   reference-backed rationale when no new test is owed.
4. Identify migration-only scaffolding separately from permanent protection.

Finish this step when every target behavior and proposed test has a supported
disposition. Do not design or implement a test until this step identifies a
concrete coverage gap in local executable behavior. Keep the work scoped to
that behavior; an open-ended audit or cleanup of existing tests is a separate
test-suite effectiveness concern.

## Design and implement the test

1. For each required test, use the ownership, oracle, test-structure, and
   test-double criteria in Test effectiveness to select the narrowest test that
   can detect the named fault.
2. Name the owning seam, independent oracle, observable failure, fixture, and
   project-declared command that will execute the test.
3. Apply Reliable test execution to fixtures, ambient state, cleanup,
   concurrency, clocks, retries, and supported-platform behavior whenever those
   concerns are present.
4. Fit the test to the active project's conventions and available seams without
   weakening the behavior contract.
5. When edits are authorized, implement the smallest validated coverage change
   that closes the identified gap and preserve unrelated user work. When no
   test is owed, perform the applicable non-test validation. For an assessment
   or review, report the disposition and proposed test without editing.

Finish this step when each required or reviewed test can fail for its named
fault, pass for the intended behavior, and do both without restating the source
under test or relying on unrelated behavior or ambient state.

## Prove execution and protection

1. Run the narrowest project-declared entrypoint that executes the target test
   and confirm the runner reports it as collected.
2. For a historical revision that is not checked out, inspect immutable source
   and diff artifacts and use collection and result logs tied to that exact
   revision as execution evidence. Do not modify the active working tree merely
   to manufacture a mutation; label unperformed mutation analysis as reasoning.
3. Apply the Test effectiveness mutation criteria when mutation evidence is
   required or needed to resolve uncertainty. Restore every temporary change
   and inspect the working tree before continuing.
4. Run the focused and broader static or behavioral checks required by the
   active project and changed scope.

For an implementation, finish only when every owed target behavior has
effective, discovered coverage and temporary mutations are gone. For a review
of actual changes, finish when every item in the two-way change inventory has
been assessed. Each finding must name the concrete unprotected fault,
ineffective changed test, or other violated coverage contract. In either mode,
report performed and skipped checks with their outcomes.
