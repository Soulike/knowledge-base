# Test effectiveness

## Scope

This document defines framework-independent principles for deciding whether an
automated test provides useful behavioral protection and for choosing the seam,
oracle, assertions, and doubles that make that protection effective.

## When to update

Update this document when evidence from real defects, test maintenance, module
decomposition, or mutation analysis changes the criteria for identifying
valuable coverage, redundant assertions, misleading oracles, appropriate test
layers, test-structure design signals, or realistic faults that a test should
expose.

## Protect behavior, not inventory

A test earns its place by detecting a realistic defect that no existing test or
static check would already reject. Test count, line coverage, and proximity to
recently changed code are discovery aids, not evidence of protection. Useful
coverage identifies:

1. the production change that should make the test fail;
2. why that change would violate a live contract;
3. whether another test or static gate would already reject it; and
4. whether the test observes the behavior strongly enough to distinguish the
   defect.

A change in externally observable behavior normally needs protection for the
new contract. A demonstrably behavior-preserving change, such as a rename, pure
type tightening, or removal of an unreachable branch, does not gain protection
from a ceremonial test. Existing tests and static gates are the evidence for
that claim.

Static guarantees stop at their actual boundary. A compiler can prove
properties of code it checks, but a type annotation on data from a network,
database, file, or deserializer is not runtime validation. Parsing,
normalization, compatibility handling, and rejection at those seams are
behavior and can require tests.

## Establish the owned behavior

A project test must exercise behavior owned by code that the project's declared
test environment can execute and must observe that behavior's effect. File type
does not decide ownership: configuration interpreted by a local executable can
participate in local behavior, while source whose relevant effect occurs only
inside an unavailable external system does not provide a local test seam.

Treat a declaration consumed only by an external platform as input to that
platform. Parsing the file locally and asserting that it contains a selected
literal restates the source; it does not exercise the external behavior or
supply an independent oracle. Apply the platform's syntax or schema validation
and verify the real integration when practical and proportionate.

When local code interprets, transforms, validates, or transmits the input, test
the owned effect through that code's interface. When no local owned effect
exists, use the applicable non-test validation instead of manufacturing a test.

When the owned contract is a local executable artifact such as a script,
command-line tool, or hook, execute it and assert its outputs, exit status, or
side effects. Matching its source text proves only that the text exists and can
stay green when behavior is broken. Use a source-level assertion only when
source form is itself the contract, such as compatibility with a parser that
cannot run in the current environment, and use a structural parser when
structure matters.

## Find marginal protection

Several common test shapes add little or no independent protection:

- A test repeats a guarantee whose complete accept-or-reject shape is directly
  readable from a declaration. Non-obvious refinements, transformations,
  security boundaries, and unchecked runtime seams remain behavior worth
  exercising.
- A test retests an upstream framework mechanism without asserting the local
  transformation, arguments, side effects, failure propagation, or wiring that
  the project owns.
- More inputs reach the same already-covered branch without exposing a distinct
  boundary or failure mode.
- The same result is asserted at several layers even though only one layer owns
  the decision.
- A runtime assertion repeats a property enforced for all relevant code by a
  compiler, linter, schema generator, or equivalent static gate.

When a broadly expressible static property has no gate, prefer adding the gate
over protecting one example. Static analysis does not replace runtime coverage
for unchecked inputs.

Redundancy is about independent failure, not textual similarity. Similar tests
can protect separately implemented branches, while differently written tests
can be redundant when they only fail for the same reason.

## Use an independent oracle

Derive expected results independently from the implementation under test.
Calling the production builder on both sides of an assertion, importing the
decision constant and asserting the same constant, or reimplementing the full
algorithm in the test creates a mirror that can preserve the same defect.

Prefer small fixtures with hand-derived outcomes, externally visible contracts,
or a simpler independent model. Test the effect of a decision rather than its
current representation: a retry test should observe attempts and outcome, not
merely assert the configured retry count.

Exercise each reachable short-circuit outcome in compound guards. Pair a
negative assertion with a positive control so an empty or broken setup cannot
satisfy it accidentally. For persisted-shape migrations, assert both the
replacement behavior and the absence of consumed legacy fields.

## Test at the owning seam

One test should diagnose one behavior. Keep multiple assertions together when
they jointly define one contract, but split unrelated contracts whose failures
would have different owners.

Large setup is often a design signal. Before hiding it in a helper, consider
whether a narrower interface or different owning layer would make the behavior
directly testable. Several co-located test groups organized around independent
responsibilities of one module can likewise reveal a missing production seam;
the grouping is a reason to investigate, not an automatic split rule.

Place doubles at slow, nondeterministic, or external seams while keeping the
behavior under review real. A double above a side effect that the test depends
on removes its own subject. Make doubles reject unexpected inputs and represent
the response shapes and failure branches relevant to the integration.

When mock setup is larger or more volatile than the behavior it isolates, use a
real collaborator at the next stable seam. If no concrete seam, cost, or source
of nondeterminism justifies a mock, remove it.

Choose fixtures from the named contract rather than incidental complexity.
Apply [Trustworthy test execution](trustworthy-test-execution.md) when fixture
ownership, ambient state, time, ordering, or cleanup affects the result.

## Remove spent migration scaffolding

A temporary test proving that old behavior is gone can expose an incomplete
migration. It should not automatically become permanent. Remove it when retained
new-contract protection strictly implies the old behavior is absent and no live
input, compatibility path, shared default, or security boundary can restore it.
Keep it when reintroduction remains a realistic standing risk.

## Prove the test has teeth

Mutation analysis asks whether coverage turns red when the implementation
acquires a plausible defect. Representative mutations include a wrong argument
or constant, the wrong branch handler, an omitted state change or side effect,
an empty return, and missing validation at a boundary.

A controlled temporary mutation is stronger than a mental exercise when it is
safe, reversible, and needed to resolve uncertainty. It is not universally
required: copied production logic, the same branch and observable, declaration
restatement, or the absence of a live contract can establish redundancy
directly. When retained coverage is claimed to catch the same fault, a realistic
mutation can prove it. A surviving mutation identifies either an unprotected
behavior or an assertion without teeth.
