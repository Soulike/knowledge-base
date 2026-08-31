---
name: write-effective-tests
description: Decide whether a defined production behavior needs automated coverage and, when it does, design, implement, and prove an effective test. Use when adding tests for new, changed, legacy, or previously untested behavior. Not for auditing or repairing existing tests or test execution.
---

# Write effective tests

## Establish the behavior contract

1. Discover and follow instructions, Skills, requirements, and project-specific
   information from the active working directory when they conflict with this
   plugin's packaged Knowledge or workflow guidance.
2. Resolve paths relative to this `SKILL.md`, then read
   [Test effectiveness](../../knowledge/software-testing/test-effectiveness.md).
3. Define the target production behavior or bounded coverage need. Discover its
   owning code, existing tests and static gates, project-declared test locations
   and commands, and local testing conventions. When the request concerns an
   actual production change, inventory every behaviorally relevant change so no
   required protection disappears behind the proposed tests.
4. Read
   [Module responsibility and defensive scope](../../knowledge/software-design/module-responsibility-and-defensive-scope.md)
   when the request, available production contract, and discovered code do not
   establish the proposed behavior's requirement, reachability, or owning
   module.
5. Read
   [Trustworthy test execution](../../knowledge/software-testing/trustworthy-test-execution.md)
   when discovery, conditional selection, asynchronous behavior, clocks,
   mutable state, retries, concurrency, platforms, external processes, or
   timeouts can affect the proposed result.
6. Read
   [Test execution cost](../../knowledge/software-testing/test-execution-cost.md)
   when the requested design makes a material runtime, environment, fixture, or
   resource tradeoff.
7. Read
   [Security boundaries and trust transitions](../../references/security/security-boundaries.md)
   when a test harness creates, stores, or transports credentials or
   authenticates local peers.

Finish this step when every target behavior, applicable local rule, existing
evidence path, and command that can establish execution is known.

## Decide whether coverage is owed

1. Treat a request or plan to add a test as a proposal to evaluate, not evidence
   that a test is required.
2. For each target behavior, identify the live contract, realistic defect,
   existing test or static gate that could catch it, and executable owned seam.
3. Assign one supported disposition:
   - **No automated test owed:** the change has no local executable behavior or
     an applicable static or external validation owns the claim.
   - **Existing protection sufficient:** current evidence already catches the
     realistic fault.
   - **New or modified test required:** a live behavior has an uncovered fault.
4. Identify migration-only scaffolding separately from permanent protection.

Finish this step when every target behavior has a disposition and rationale. Do
not design or implement a test until a concrete protection gap is established.

## Design and write the test

For every required test:

1. Name the production fault that must make it fail, the owning seam, independent
   oracle, observable failure, fixture, and project-declared command.
2. Choose the narrowest test that exercises the owned behavior without
   restating the implementation or relying on unrelated behavior.
3. Apply Trustworthy test execution to collection, fixtures, ambient state,
   cleanup, time, ordering, retries, concurrency, platforms, and external
   processes that affect the result.
4. Apply Test execution cost only to an actual design tradeoff. Do not replace a
   required real integration seam with a mock merely to make the test cheaper.
5. Fit the test to the active project's conventions and available seams. When
   the production design prevents effective testing, report the missing seam
   rather than hiding it behind a larger fixture or more mocks.
6. When edits are authorized, implement the smallest coherent coverage change.
   For a planning or assessment request, report the disposition and proposed
   test without editing.

Finish this step when each new or modified test can fail for its named fault,
pass for the intended behavior, and has an independently derived expected
result.

## Prove execution and protection

1. For each disposition that relies on automated protection, run the narrowest
   project-declared entrypoint and confirm that the runner reports every relied-
   upon test as collected.
2. For a new or modified test, use a safe, reversible mutation when it is
   required by the active project or needed to establish that the test catches
   its named fault. Restore every temporary change and inspect the working tree
   afterward.
3. For a **No automated test owed** disposition, perform the applicable static,
   schema, external-integration, or other non-test validation instead of test
   collection or mutation.
4. Exercise relevant success, failure, cleanup, and supported-environment paths
   required by Trustworthy test execution for the tests that execute.
5. Run the broader static and behavioral checks required by the active project
   and changed scope.

For an implementation, finish only when every target behavior has a supported
disposition, every automated protection claim is effective and collected,
every no-test disposition has its applicable validation, and every temporary
mutation or sentinel is gone. For a plan or assessment, finish when each
disposition, proposed protection, and missing evidence item is explicit. Report
performed and skipped checks with their outcomes.
