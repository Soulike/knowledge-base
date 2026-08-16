---
name: design-and-review-tests
description: Design and review automated tests. Use when deciding whether a behavior change requires a test; adding or modifying tests; reviewing test content or coverage; assessing redundant or ineffective tests; or changing test discovery and runner configuration.
---

# Design and review tests

## Establish the local contract

1. Discover and follow instructions, Skills, requirements, and
   project-specific information from the active working directory when they
   conflict with this plugin's shared Knowledge.
2. Resolve paths relative to this `SKILL.md`, then read
   [Test effectiveness](../../knowledge/software-testing/test-effectiveness.md).
3. Read
   [Reliable test execution](../../knowledge/software-testing/test-execution-reliability.md)
   when the work involves discovery, asynchronous behavior, clocks, retries,
   concurrency, fixtures, external processes, or supported platforms.
4. Read
   [Performance regression testing](../../knowledge/software-testing/performance-regression-testing.md)
   for a performance guard, benchmark gate, or test-cost decision. Read
   [Integration test harnesses](../../knowledge/software-testing/integration-test-harnesses.md)
   when the subject is a multi-component or multi-process harness.
5. Discover the active project's test locations, runner configuration,
   package or build entrypoints, static gates, and local test conventions from
   the working tree. Do not infer them from this Skill.

Finish this step when the behavior under review, applicable local rules, and
the commands that can establish evidence are known.

## Decide what protection is owed

1. State the externally observable behavior that changed or the coverage claim
   being reviewed.
2. Name realistic implementation faults that would violate it. Distinguish
   defects from deliberate design changes.
3. Map each fault to existing tests, static checks, executable contracts, or an
   uncovered boundary. Inspect production code as well as changed tests when
   reviewing coverage.
4. Add coverage for changed behavior and uncovered standing risks. Record why
   no new test is owed when the change is demonstrably behavior-preserving or a
   stronger existing gate already rejects every relevant fault.
5. Do not dismiss a schema or declaration test merely because its assertion is
   simple. If weakening the declaration could admit invalid runtime input,
   treat that boundary as behavior and look for coverage through the public
   parser or consumer. Call the direct test redundant only when a stronger gate
   protects the same fault or no owned contract depends on it.
6. Identify migration-only scaffolding separately from permanent protection.

Finish this step when every changed behavior or review concern has one evidence
path or a concrete, supportable coverage gap.

## Choose the owning test

1. Put pure behavior at its narrow owner and use an integration test only for
   wiring, side effects, or a contract that crosses components. Avoid asserting
   the same mapping exhaustively at both layers.
2. Give each test one diagnosable behavior. Keep the assertions that jointly
   define that behavior together.
3. Derive the expected result independently. Exercise each meaningful guard
   path, and pair negative assertions with a positive control.
4. Execute scripts and other executable artifacts. Place doubles below the
   behavior under test, at the slow, nondeterministic, or external seam.
5. Build private, minimal fixtures. Isolate intentional platform behavior and
   keep accidental machine state outside the test.
6. For a persisted-shape migration, assert both the replacement result and the
   absence of consumed legacy fields.

Finish this step when each proposed or reviewed test can fail for its named
fault without relying on unrelated behavior or ambient state.

## Implement or report

When edits are authorized, implement the smallest coverage change that closes
the identified gap and preserve unrelated user work. When the request is only
to assess or review, report findings and proposed tests without editing.

For test discovery or runner changes, keep collection aligned with stable
project conventions, make unexpected zero-test runs fail, and account for
compiler, linter, or coverage inputs affected by the same layout.

## Prove execution and teeth

1. Run the narrowest project-declared entrypoint that executes the target test
   and confirm the runner reports it as collected. Use a temporary failing
   sentinel when collection cannot otherwise be distinguished from success,
   then remove it.
2. For a historical revision that is not checked out, inspect immutable source
   and diff artifacts and use collection and result logs tied to that exact
   revision as execution evidence. Do not modify the active working tree merely
   to manufacture a mutation; label unperformed mutation analysis as reasoning.
3. When writes are authorized and a mutation can be isolated and fully
   reverted, introduce a realistic fault and confirm the intended coverage
   fails. For a proposed deletion, confirm retained coverage catches the fault.
   If no test is owed because the behavior is unchanged, a stronger non-test
   gate rejects the fault, or no live production path or contract remains,
   prove that rationale instead; there is no deletion fault to mutate.
   Otherwise record mutation analysis as reasoning rather than modifying code.
4. Restore the implementation and inspect the working tree before continuing.
5. After synchronization, retry, fixture, or concurrency changes, run
   representative tests with retries disabled when the runner supports it and
   repeat enough times to expose the relevant failure mode.
6. Run the focused and broader static or behavioral checks required by the
   active project and changed scope.

For an implementation, finish only when every owed behavior has effective,
discovered coverage and temporary mutations and sentinels are gone. For a
review, finish when every coverage claim has been assessed and each finding
names the unprotected fault. In either mode, report performed and skipped
checks with their outcomes.
