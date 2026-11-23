# Write effective tests

Use this procedure when [Route by task intent](../SKILL.md#route-by-task-intent)
selects new or expanded automated protection, including `add coverage` work
identified during a test review. Complete
[Establish authority, scope, and reading](../SKILL.md#establish-authority-scope-and-reading)
first so active-working-directory rules, target contracts, existing evidence
paths, project-declared commands, and
[Test effectiveness](../../../knowledge/software-testing/test-effectiveness.md)
(plus any conditionally required Knowledge or shared references) are loaded.

## Decide whether coverage is owed

1. Treat a request or plan to add a test as a proposal to evaluate, not evidence
   that a test is required.
2. For each target behavior that required
   [Module responsibility and defensive scope](../../../knowledge/software-design/module-responsibility-and-defensive-scope.md),
   apply it before treating current code as a production contract. Establish an
   accepted requirement, supported execution path, and semantic owner
   independently of the implementation and proposed test.
3. When that evidence does not establish that production should own the
   behavior, assign **Production responsibility not established**. Do not design
   or add a test for it. Report the missing or conflicting evidence and the
   production move, removal, deferral, or human decision indicated by the loaded
   guidance; do not edit production unless the surrounding task authorizes that
   change.
4. For each established production behavior, identify the live contract,
   realistic defect, existing test or static gate that could catch it, and
   executable owned seam. Before choosing representation or cross-artifact
   assertions, use
   [Test effectiveness](../../../knowledge/software-testing/test-effectiveness.md)
   to establish the requirement they would fix before treating current
   agreement as a protection subject. For a reusable module, compare its
   established interface contract with the protection supplied by all current
   consumers. Distinguish values excluded before the operation by an enforced
   boundary, invalid values representable by its call signature or data shape
   that a real supported path can deliver when the module owns validation, and
   valid values unused by current consumers. Do not treat a caller convention as
   a coverage boundary.
5. Assign one supported coverage disposition:
   - **No automated test owed:** the change has no local executable behavior or
     an applicable static or external validation owns the claim.
   - **Existing protection sufficient:** current evidence already catches the
     realistic fault.
   - **New or modified test required:** a live behavior has an uncovered fault.
6. Identify migration-only scaffolding separately from permanent protection, and
   carry dispositions from
   [Migration retirement assessment](../../../references/software-design/migration-retirement-assessment.md)
   when migration obligations apply.

Finish this step when every target behavior has a disposition and rationale. Do
not design or implement a test until a concrete protection gap is established.

## Design and write the test

For every required test:

1. Name the production fault that must make it fail, a relevant permitted change
   it must tolerate, the owning seam, independent oracle, observable failure,
   fixture, and project-declared command. For representation or synchronization
   checks, apply
   [Test effectiveness](../../../knowledge/software-testing/test-effectiveness.md)
   to bound the protection claim before choosing the assertion.
2. For behavior that is stateful or spans an integration boundary, use
   [Test effectiveness](../../../knowledge/software-testing/test-effectiveness.md)
   to identify independently variable state dimensions and select a complete
   reachable combination that exposes the named fault before finalizing the
   fixture. Add another combination only when it exposes a distinct live fault.
3. For a module whose established contract admits materially varying input size or
   shape, identify whether depth, breadth, density, ordering, contention, failure
   position, or another dimension can expose the named fault. Use the smallest
   bounded deterministic fixture that reaches that state and assert contract
   invariants instead of a copied execution trace. Do not add a scale case solely
   because the unit accepts a collection. Apply
   [Test execution cost](../../../knowledge/software-testing/test-execution-cost.md)
   when the protection claim depends on runtime or resource measurements.
4. Choose the narrowest test that exercises the owned behavior without
   restating the implementation or relying on unrelated behavior.
5. Apply
   [Trustworthy test execution](../../../knowledge/software-testing/trustworthy-test-execution.md)
   to collection, fixtures, ambient state, cleanup, time, ordering, retries,
   concurrency, platforms, and external processes that affect the result.
6. Apply
   [Test execution cost](../../../knowledge/software-testing/test-execution-cost.md)
   only to an actual design tradeoff. Do not replace a required real integration
   seam with a mock merely to make the test cheaper.
7. Distinguish existing tests that use low-level framework primitives only
   because they mock or isolate a layer (such as view-mocked container tests)
   from tests that must mount, drive, and observe real framework-managed
   components or lifecycles. Do not treat low-level primitives in isolated
   tests as a convention to hand-roll custom DOM mounting, global environment
   shims, synthetic event dispatching, control queries, or cleanup harnesses
   around real controls. Whenever driving real framework-managed lifecycles
   requires mounting rendered controls, simulating user interactions, shimming
   runtime globals, or managing DOM/lifecycle cleanup and the project lacks an
   established framework testing library, evaluate mature ecosystem testing
   libraries from current authoritative sources and
   [Dependency and supply-chain security](../../../references/security/dependency-supply-chain-security.md),
   then obtain user approval under the active project's dependency policy
   before adding a test-scoped dependency; keep pure logic and intentionally
   layer-mocked unit tests free of unnecessary testing-library dependencies.
8. Fit the remaining test design to the active project's conventions and
   available seams. When the production design prevents effective testing,
   report the missing seam rather than hiding it behind a larger fixture or
   more mocks.
9. When edits are authorized, implement the smallest coherent coverage change.
   For a planning or assessment request, report the disposition and proposed
   test without editing.

Finish this step when each new or modified test can fail for its named fault,
pass for the intended behavior, tolerate relevant permitted changes, and has an
independently established requirement and expected result.

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
4. For **Production responsibility not established**, verify and report the
   absent or conflicting requirement, supported path, or semantic owner instead
   of manufacturing test or non-test validation for the unowned behavior.
5. Exercise relevant success, failure, cleanup, and supported-environment paths
   required by
   [Trustworthy test execution](../../../knowledge/software-testing/trustworthy-test-execution.md)
   for the tests that execute.
6. Run the broader static and behavioral checks required by the active project
   and changed scope.

For an implementation, finish only when every target behavior has a supported
disposition, every production-responsibility gap is reported without a
cementing test, every automated protection claim is effective and collected,
every no-test disposition has its applicable validation, and every temporary
mutation or sentinel is gone. For a plan or assessment, finish when each
disposition, proposed protection, and missing evidence item is explicit. Report
performed and skipped checks with their outcomes.
