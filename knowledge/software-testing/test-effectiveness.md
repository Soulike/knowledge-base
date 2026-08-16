# Test effectiveness

## Scope

This document defines project- and framework-independent criteria for deciding whether a behavior needs an automated test and whether an existing test earns its maintenance cost. It owns marginal protection, fault-oriented coverage, independent oracles, behavioral focus, layer selection, use of real implementations and test doubles, transitional coverage, and mutation checks; reliable execution, performance-regression measurement, and integration-harness architecture belong to their dedicated documents.

## When to update

Update this document when evidence from real defects, test maintenance, or mutation analysis changes the criteria for identifying valuable coverage, redundant assertions, misleading oracles, appropriate test layers, or realistic faults that a test should expose.

## Protect behavior, not inventory

A test earns its place by detecting a realistic defect that no existing test or static check would already reject. Minimizing test count is not a goal: coverage with unique protection remains valuable even when it is expensive. Test count, line coverage, and proximity to recently changed code are discovery aids, not evidence of protection. Before adding or retaining a case, identify:

1. the production change that should make it fail;
2. why that change would be a defect rather than an intentional redesign;
3. whether another test or static gate would already fail; and
4. whether the test observes the behavior strongly enough to distinguish the defect.

A change in externally observable behavior normally needs coverage for the new contract. A change that is demonstrably behavior-preserving, such as a rename, a pure type tightening, or removal of an unreachable branch, does not gain protection from a ceremonial new test. Existing tests and static gates are the evidence for that claim.

Static guarantees stop at their actual boundary. A compiler can prove properties of code it checks, but a type annotation on data from a network, database, file, or deserializer is not runtime validation. Parsing, normalization, compatibility handling, and rejection at those seams are behavior and can require tests.

## Find marginal coverage

Several common test shapes add little or no independent protection:

- A direct declaration is restated, such as checking that an enum accepts one of its listed values or that a required field is required. Treat this as redundant only when weakening the declaration would either leave the owned contract unchanged or be rejected by a stronger gate. A runtime boundary still needs behavioral coverage when removing a minimum length, required marker, or similar declaration would admit invalid input. Exercise that boundary through its public parser or consumer instead of asserting the declaration's source form. Non-obvious patterns, custom refinements, transformations, and security boundaries also remain behavior worth exercising.
- An upstream framework's own mechanism is retested. Keep coverage for the contract local code owns, including transformation, arguments, side effects, failure propagation, and one representative wiring case. When local correctness depends on surprising upstream behavior, keep a narrow characterization test that names that assumption.
- More inputs reach the same already-covered branch without exercising a distinct boundary or failure mode.
- The same result is asserted at several layers. Cover pure logic at its owning function and use integration coverage for wiring or side effects, rather than repeating every logic case through the outer surface.
- A runtime assertion repeats a property already enforced for all relevant code by a compiler, linter, schema generator, or other static gate.

Redundancy is about independent failure, not textual similarity. Two similar tests can be necessary when they protect separately implemented branches. Conversely, differently written tests are redundant when they can only fail for the same reason.

## Build an independent oracle

Derive expected results independently from the implementation under test. Calling the production builder on both sides of an assertion, importing the decision constant and asserting that same constant, or reimplementing the full algorithm in the test creates a mirror that can preserve the same defect.

Prefer small fixtures with hand-derived outcomes, externally visible contracts, or a simpler independent model. Test the effect of a decision rather than anchoring its current representation: a retry test should observe attempts and outcome, not merely assert the configured retry constant.

Exercise every meaningful short-circuit path in a compound guard. Pair a negative assertion with a positive control so an empty or broken setup cannot satisfy the test accidentally. For a persisted-shape migration, assert both the replacement behavior and the absence of every consumed legacy field; either half can regress independently.

## Keep one behavior per test

One test should diagnose one behavior. A useful name describes the single contract that failed. Split a test whose name needs unrelated clauses, but keep multiple assertions together when they jointly define one behavior, such as the values immediately before and after an expiry boundary.

Large setup is often a design signal. Moving it into a helper can hide that the subject is reachable only through too many collaborators. First consider whether a narrower interface or a different owning layer would make the behavior directly testable.

## Exercise the owned contract

When the claim is runtime behavior, execute scripts, command-line tools, hooks, and other executable artifacts and assert their outputs, exit status, or side effects. Matching their source text proves only that the text exists and can stay green when the behavior is broken. A source-level assertion belongs only where source form is itself the contract, such as compatibility with a parser that cannot be executed in the current environment, and should use a structural parser when structure matters. Human-facing prose has no runtime behavior; test the contract the prose describes, not the prose itself.

Place test doubles at the slow, nondeterministic, or external seam while keeping the behavior under review real. A double placed above a side effect that the test depends on removes its own subject. Make doubles reject unexpected arguments, represent complete response shapes relevant to integration, and distinguish success, error, and malformed branches.

When mock setup is larger or more volatile than the behavior it isolates, use an integration test with real collaborators at the next stable boundary. A mock that repeatedly falls behind its real component no longer reduces uncertainty.

Use owned fixtures instead of borrowing a developer's home directory, current checkout inventory, global service, or machine configuration unless that ambient state is the contract. Give each test private mutable state and explicit cleanup. Test-only cleanup and inspection helpers belong in test support unless the production component genuinely owns that lifecycle operation.

## Remove spent migration scaffolding

During a behavior migration, a temporary test that proves the old behavior is gone can help expose an incomplete change. It should not automatically become permanent coverage. Remove it when the retained new-contract test strictly implies the old behavior is absent and no live input, shared default, compatibility path, or security boundary can accidentally restore it.

Keep the test when reintroduction remains a standing operational risk. The deciding question is what realistic future defect the test would catch after the migration context has disappeared.

## Validate with realistic mutations

Mutation analysis asks whether coverage turns red when the implementation acquires a plausible defect. Representative mutations include a wrong argument or constant, the wrong branch handler, a missing state change or side effect, an empty or default return, and omitted validation for boundary or unauthorized input.

A controlled temporary mutation provides stronger evidence than a mental exercise when it is safe and reversible. To justify deleting a test as redundant, introduce the fault it claims to catch and confirm that retained coverage fails. This mutation is not owed when the deletion rationale is instead that no live production path or contract remains; prove that absence from reachability and contract evidence rather than inventing a fault for dead scaffolding. To validate new coverage, confirm the intended test fails for the fault and passes again after the implementation is restored. A surviving mutation identifies either an unprotected behavior or an assertion without teeth.

## Related Knowledge

- [Reliable test execution](test-execution-reliability.md) owns discovery, synchronization, clocks, isolation, retries, and platform assumptions.
- [Performance regression testing](performance-regression-testing.md) owns deterministic complexity guards and measurement fallbacks.
- [Integration test harnesses](integration-test-harnesses.md) owns fidelity, topology, resource ownership, and validation tiers for real-component environments.
