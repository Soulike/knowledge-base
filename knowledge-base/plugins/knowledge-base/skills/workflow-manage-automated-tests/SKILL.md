---
name: workflow-manage-automated-tests
description: Use when deciding whether automated tests are owed, writing new tests, or reviewing, diagnosing, or changing existing tests or test execution.
---

# Manage automated tests

## Establish authority, scope, and reading

1. For current-state work (adding, planning, reviewing, diagnosing, or changing
   tests), discover and follow instructions, Skills, requirements, and
   project-specific information from the active working directory when they
   conflict with this plugin's packaged Knowledge or workflow guidance. For a
   fixed-point change review, use the rules at the selected comparison base and
   treat proposed rules as review evidence rather than authority that can
   redefine their own review.
2. Define the in-scope production behavior, bounded coverage need, test, file,
   component, suite, change, harness, runner, or symptom boundary without
   silently expanding it. Discover the owning code, production contracts,
   existing tests and static gates, project-declared test locations and
   commands, runner configuration, installed test dependencies, local testing
   conventions, and supplied execution evidence.
   - When the task concerns an actual production change, inventory every
     behaviorally relevant change so no required protection disappears behind
     the proposed tests.
   - For a reusable module, identify its established interface contract
     separately from the narrower paths exercised by each current consumer.
3. Choose the evidence mode. Reproduce current behavior when execution is
   permitted and practical. For a fixed-point review, inspect immutable source,
   diffs, and exact-revision logs without modifying the active working tree to
   manufacture evidence. State what was directly observed, reproduced, or not
   established.
4. Resolve paths relative to this `SKILL.md` and read the applicable canonical
   Knowledge and shared references before making dependent decisions:
   - Read
     [Test effectiveness](../../knowledge/software-testing/test-effectiveness.md)
     when deciding whether automated protection is owed, designing or writing
     new tests, judging coverage, assertions, ownership, doubles, or test value,
     or before retaining, strengthening, replacing, consolidating, or deleting
     a reported failing or intermittent test.
   - Read
     [Defensive scope and boundary ownership](../../knowledge/software-design/defensive-scope-and-boundary-ownership.md)
     when a test or request is offered as evidence that production should own
     defensive, compatibility, migration, trust, presentation, or
     future-consumer behavior; when the available contract does not establish
     the accepted requirement, supported execution path, reachability, or
     semantic owner; when producer or consumer conventions appear to exclude an
     input representable by a reusable module's call signature or data shape;
     or when reassessing retained code and test support as a migration
     obligation changes or ends.
   - Read
     [Module responsibility and interfaces](../../knowledge/software-design/module-responsibility-and-interfaces.md)
     when test structure suggests mixed module responsibilities or a missing
     seam.
   - Read
     [Trustworthy test execution](../../knowledge/software-testing/trustworthy-test-execution.md)
     when test discovery, collection, selection, skips, asynchronous behavior,
     clocks, fixtures, ambient or mutable state, cleanup, time, ordering,
     retries, concurrency, platforms, external processes, timeouts, runner
     changes, or intermittent outcomes can affect the result.
   - Read
     [Test execution cost](../../knowledge/software-testing/test-execution-cost.md)
     when runtime or resource cost is explicitly claimed, measured, analyzed, or
     changed, or when choosing between competing test designs specifically over
     a runtime or resource cost tradeoff. The existence of tests, adding normal
     coverage, or choosing ordinary fixtures or owning seams alone does not match
     this route.
   - Read
     [Testing web user interfaces through accessible semantics](../../knowledge/software-testing/accessible-web-ui-testing.md)
     when the target behavior or reviewed tests render or drive a web user
     interface.
   - Read
     [Security boundaries and trust transitions](../../references/security/security-boundaries.md)
     when a test harness creates, stores, or transports credentials or
     authenticates local peers.
   - Read
     [Dependency and supply-chain security](../../references/security/dependency-supply-chain-security.md)
     when tests that must drive real framework-managed components or lifecycles
     lack an established framework testing library and adopting an ecosystem
     testing library is evaluated.
   - Read
     [Migration retirement assessment](../../references/software-design/migration-retirement-assessment.md)
     when the task includes tests or support affected by a changed migration
     obligation, or forms part of a final migration assessment.

Finish this step when the scoped targets, applicable local rules, evidence
mode, and required reading are established.

## Route by task intent

Select the reference that owns the task's direction:

- Read and follow [Write effective tests](references/write-effective-tests.md)
  when deciding whether production behavior or a bounded coverage need owes new
  or expanded automated protection, and when designing, writing, or proving new
  tests.
- Read and follow
  [Review and improve tests](references/review-and-improve-tests.md) when
  reviewing existing or proposed tests, suites, coverage, or fixed-point test
  diffs; diagnosing consistent failures, intermittent outcomes,
  collection/selection/skip/runner behavior, or execution cost; or updating,
  repairing, consolidating, or retiring existing tests or test harnesses.
- When a task spans both (such as reviewing an existing suite and adding
  coverage for newly identified gaps, or updating existing tests alongside new
  production behavior), apply
  [Review and improve tests](references/review-and-improve-tests.md) to each
  existing test and execution concern and
  [Write effective tests](references/write-effective-tests.md) to each new or
  expanded protection need.

## Complete and report

Finish only when every in-scope behavior or test item has completed its routed
procedure's completion and proof gates:

- Assign each item its own evidence-backed disposition rather than relying on
  test count, line coverage, passing history, or a green aggregate alone.
- Never design or add a test for **Production responsibility not established**
  behavior, never weaken a test to hide a production defect, never patch
  fragile custom UI harness plumbing when a mature framework testing library is
  missing (stop and request user approval under project policy instead), and
  never drop unresolved protection while gathering evidence.
- Restore every temporary mutation, perturbation, sentinel, clock, resource,
  process, fixture, and environment change, and inspect the working tree
  afterward.
- Keep planning, diagnostic, and review-only requests read-only without editing
  files or installing packages.
- Report every item's disposition, diagnosed owner (when applicable), performed
  and skipped checks with outcomes, and remaining evidence gaps.
