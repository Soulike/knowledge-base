# Test effectiveness

## Scope

This reference supports workflow steps that decide whether a behavior needs an automated test and whether an existing test earns its maintenance cost across projects and frameworks.

## When to update

Update this document when evidence from real defects, test maintenance, module decomposition, or mutation analysis changes the criteria for identifying valuable coverage, redundant assertions, misleading oracles, appropriate test layers, test-structure design signals, or realistic faults that a test should expose.

## Protect behavior, not inventory

A test earns its place by detecting a realistic defect that no existing test or static check would already reject. Minimizing test count is not a goal: coverage with unique protection remains valuable even when it is expensive. Test count, line coverage, and proximity to recently changed code are discovery aids, not evidence of protection. Before adding or retaining a case, identify:

1. the production change that should make it fail;
2. why that change would be a defect rather than an intentional redesign;
3. whether another test or static gate would already fail; and
4. whether the test observes the behavior strongly enough to distinguish the defect.

A change in externally observable behavior normally needs coverage for the new contract. A change that is demonstrably behavior-preserving, such as a rename, a pure type tightening, or removal of an unreachable branch, does not gain protection from a ceremonial new test. Existing tests and static gates are the evidence for that claim.

Static guarantees stop at their actual boundary. A compiler can prove properties of code it checks, but a type annotation on data from a network, database, file, or deserializer is not runtime validation. Parsing, normalization, compatibility handling, and rejection at those seams are behavior and can require tests.

## Establish the local behavior boundary

A project test must exercise behavior owned by code that the project's declared test environment can execute and must observe that behavior's effect. File type does not decide this boundary: configuration interpreted by a local executable can participate in local behavior, while source code whose relevant effect occurs only inside an unavailable external system does not provide a local test seam.

Treat a declaration or configuration value consumed only by an external platform as input to that platform, not as local behavior merely because changing the value changes the remote outcome. Use the platform's applicable syntax or schema validation, and verify the effect through the real integration when that is practical and proportionate. Parsing the file locally and asserting that it contains the selected value restates the source; it does not exercise the external behavior or supply an independent oracle.

When local code interprets, transforms, validates, or transmits that input, test the owned effect through that code's interface rather than asserting the input literal. If no such local path exists, record that no local automated test is owed and identify the non-test validation that applies.

## Find marginal coverage

Several common test shapes add little or no independent protection:

- A guarantee is restated even though its complete accept-or-reject shape is directly readable from a declaration, such as checking that an enum accepts a listed member or that a simple required or minimum marker rejects the value it names. Repeating the declaration through its parser adds no independent oracle. Non-obvious patterns, custom refinements, transformations, security boundaries, and integration of the declaration at an untrusted runtime seam remain behavior worth exercising because their effective boundary cannot be recovered from one obvious declaration line.
- An upstream framework's own mechanism is retested. Keep coverage for the contract local code owns, including transformation, arguments, side effects, failure propagation, and one representative wiring case. When local correctness depends on surprising upstream behavior, keep a narrow characterization test that names that assumption.
- More inputs reach the same already-covered branch without exercising a distinct boundary or failure mode.
- The same result is asserted at several layers. Cover pure logic at its owning function and use integration coverage for wiring or side effects, rather than repeating every logic case through the outer surface.
- A runtime assertion repeats a property already enforced for all relevant code by a compiler, linter, schema generator, or other static gate.

When a property is broadly expressible as a static rule but no gate enforces it yet, prefer adding the compiler, linter, schema-generation, or build rule instead of protecting one runtime example. Static rules cover every input they analyze. They do not replace runtime validation and behavioral coverage for values that enter from a network, database, file, deserializer, or another unchecked boundary.

Redundancy is about independent failure, not textual similarity. Two similar tests can be necessary when they protect separately implemented branches. Conversely, differently written tests are redundant when they can only fail for the same reason.

## Build an independent oracle

Derive expected results independently from the implementation under test. Calling the production builder on both sides of an assertion, importing the decision constant and asserting that same constant, or reimplementing the full algorithm in the test creates a mirror that can preserve the same defect.

Prefer small fixtures with hand-derived outcomes, externally visible contracts, or a simpler independent model. Test the effect of a decision rather than anchoring its current representation: a retry test should observe attempts and outcome, not merely assert the configured retry constant.

Exercise every reachable short-circuit outcome in a compound guard. For `A || B`, cover both the path where `A` short-circuits and the path where `B` decides; apply the same rule to `&&`, early returns, and equivalent guard forms. Pair a negative assertion with a positive control so an empty or broken setup cannot satisfy the test accidentally. For a persisted-shape migration, assert both the replacement behavior and the absence of every consumed legacy field; either half can regress independently.

## Keep one behavior per test

One test should diagnose one behavior. A useful name describes the single contract that failed. Split a test whose name needs unrelated clauses, but keep multiple assertions together when they jointly define one behavior, such as the values immediately before and after an expiry boundary.

Large setup is often a design signal. Moving it into a helper can hide that the subject is reachable only through too many collaborators. First consider whether a narrower interface or a different owning layer would make the behavior directly testable.

Three or more co-located test groups organized around independent fields, aspects, or responsibilities of one module are worth inspecting as a decomposition signal; one or two alone are weak evidence. Check whether the production module has more than one reason to change and whether each group reveals a stable seam. The count triggers investigation, not a mandate to split.

## Exercise the owned contract

When the claim is runtime behavior, execute scripts, command-line tools, hooks, and other executable artifacts and assert their outputs, exit status, or side effects. Matching their source text proves only that the text exists and can stay green when the behavior is broken. A source-level assertion belongs only where source form is itself the contract, such as compatibility with a parser that cannot be executed in the current environment, and should use a structural parser when structure matters. Human-facing prose has no runtime behavior; test the contract the prose describes, not the prose itself. An assertion that only proves a test double or its marker exists observes the test setup rather than the subject's behavior; assert the real owned outcome.

Place test doubles at the slow, nondeterministic, or external seam while keeping the behavior under review real. A double placed above a side effect that the test depends on removes its own subject. Make doubles reject unexpected arguments and assert call counts or ordering when those are part of the owned contract. Represent complete response shapes relevant to integration, and distinguish success, error, and malformed branches.

Keep setup and cleanup that only tests need in test utilities. Do not add a lifecycle method to a production type solely for tests unless that type genuinely owns the resource's lifecycle.

When mock setup is larger or more volatile than the behavior it isolates, use an integration test with real collaborators at the next stable boundary. A mock that repeatedly falls behind its real component no longer reduces uncertainty. If no concrete seam, cost, or source of nondeterminism justifies a mock, remove it.

Choose fixture contents from the named contract and the branches the test must expose, not from incidental complexity. Apply [Reliable test execution](test-execution-reliability.md) for fixture ownership, ambient environment, mutable-state isolation, and cleanup.

## Remove spent migration scaffolding

During a behavior migration, a temporary test that proves the old behavior is gone can help expose an incomplete change. It should not automatically become permanent coverage. Remove it when the retained new-contract test strictly implies the old behavior is absent and no live input, shared default, compatibility path, or security boundary can accidentally restore it.

Keep the test when reintroduction remains a standing operational risk. The deciding question is what realistic future defect the test would catch after the migration context has disappeared.

## Validate with realistic mutations

Mutation analysis asks whether coverage turns red when the implementation acquires a plausible defect. Representative mutations include a wrong argument or constant, the wrong branch handler, a missing state change or side effect, an empty or default return, and omitted validation for boundary or unauthorized input.

A controlled temporary mutation provides stronger evidence than a mental exercise when it is safe, reversible, and required by the active workflow or needed to resolve uncertainty. A deletion whose redundancy is directly established by copied production logic, the same branch and observable, declaration restatement, or another explicit marginal-coverage rule does not acquire a universal mutation prerequisite. When the claim is instead that retained coverage catches the same fault, a realistic mutation can prove it; when no live production path or contract remains, prove that absence rather than inventing a fault for dead scaffolding. To validate new coverage, confirm the intended test fails for the fault and passes again after the implementation is restored. A surviving mutation identifies either an unprotected behavior or an assertion without teeth.
