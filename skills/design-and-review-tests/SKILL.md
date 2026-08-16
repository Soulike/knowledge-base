---
name: design-and-review-tests
description: Design and review automated tests. Use when deciding whether a behavior change requires a test; adding or modifying tests; reviewing test content or coverage; assessing redundant or ineffective tests; or changing test discovery, conditional validation selection, or runner configuration.
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
5. Treat a direct test of an obvious enum member, required marker, minimum, or
   similarly self-explanatory declaration as redundant when it merely repeats
   that declaration through its parser. Keep coverage for non-obvious patterns,
   custom refinements, transformations, security boundaries, and integration at
   an untrusted runtime seam.
6. When a property can be enforced across the codebase by a static rule but no
   such gate exists, prefer adding that gate over one runtime example. Do not
   confuse a type annotation on unchecked external data with runtime validation.
7. Identify migration-only scaffolding separately from permanent protection.

Finish this step when every changed behavior or review concern has one evidence
path or a concrete, supportable coverage gap.

## Choose the owning test

1. Put pure behavior at its narrow owner and use an integration test only for
   wiring, side effects, or a contract that crosses components. Avoid asserting
   the same mapping exhaustively at both layers.
2. Give each test one diagnosable behavior. Keep the assertions that jointly
   define that behavior together.
3. Derive the expected result independently. Exercise every reachable
   short-circuit outcome, and pair negative assertions with a positive control.
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

For a runner or test-framework migration, isolate the mechanical conversion
from changes in coverage. Record the baseline identities, result and skip
outcomes, lifecycle and cleanup behavior, environment restoration, scheduling,
concurrency, isolation, and declared entrypoints. Preserve those semantics while
changing only the runner imports, hooks, configuration, or file placement
required by the migration. Review intentional behavior, fixture, and assertion
changes separately so they cannot hide collection or execution drift.

For test discovery or runner changes, keep collection aligned with stable
project conventions, make unexpected zero-test runs fail, and account for
compiler, linter, or coverage inputs affected by the same layout.

For conditional validation changes, prove that the comparison input and mapping
are reliable, that unknown or unmapped inputs broaden to the conservative
validation set, and that classifier or selector failures either block or trigger
that fallback. Keep an intentional empty selection distinguishable from both
failure dispositions. Exercise both run and legitimate-skip paths.

## Prove execution and teeth

1. Run the narrowest project-declared entrypoint that executes the target test
   and confirm the runner reports it as collected. For a runner or framework
   migration, run every project-declared entrypoint for the affected scope and
   compare result and skip outcomes, lifecycle and cleanup behavior, environment
   restoration, scheduling, concurrency, and isolation with the recorded
   baseline. Account for any intentional difference.
2. For a discovery or runner migration, compare the complete expected and
   collected test identity sets in both directions instead of relying on counts.
   Use a temporary failing sentinel when collection cannot otherwise be
   distinguished from success, then remove it.
3. For a historical revision that is not checked out, inspect immutable source
   and diff artifacts and use collection and result logs tied to that exact
   revision as execution evidence. Do not modify the active working tree merely
   to manufacture a mutation; label unperformed mutation analysis as reasoning.
4. When the active workflow requires real mutation, or uncertainty remains and
   writes are authorized, introduce an isolated, fully reversible realistic
   fault and confirm the intended coverage fails. For a deletion justified by
   retained coverage catching the same fault, use this check when practical. A
   directly established declaration restatement, duplicate branch and
   observable, copied implementation, stronger non-test gate, unchanged
   behavior, or absent live contract can instead be proved from that rationale.
   Otherwise record mutation analysis as reasoning rather than modifying code.
5. Restore the implementation and inspect the working tree before continuing.
6. Audit every declared applicability prerequisite and skip guard in the changed
   path. Coverage may skip while an optional executable, configuration,
   credential, or other declared prerequisite is genuinely absent. After every
   applicability predicate says the suite applies, a dependency that cannot
   start, authenticate with the supplied configuration, report its required
   version, or become healthy must fail visibly.
7. After synchronization, retry, fixture, or concurrency changes, run
   representative tests with retries disabled when the runner supports it and
   repeat enough times to expose the relevant failure mode.
8. Run the focused and broader static or behavioral checks required by the
   active project and changed scope.

For an implementation, finish only when every owed behavior has effective,
discovered coverage and temporary mutations and sentinels are gone. For a change
review, finish when every item in the two-way review inventory has been assessed;
for another review, finish when every coverage claim has been assessed. Each
finding must name the concrete unprotected fault, redundant protection,
unintended collection, or other violated test or execution contract. In either
mode, report performed and skipped checks with their outcomes.
