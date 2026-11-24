# Test effectiveness

## Scope

This document defines framework-independent principles for deciding whether an
automated test provides useful behavioral protection and for choosing the fault
scenario, fixture, seam, oracle, assertions, and doubles that make that
protection effective.

## When to update

Update this document when evidence from real defects, test maintenance, module
decomposition, or mutation analysis changes the criteria for identifying
valuable coverage, fault-revealing scenarios, redundant assertions, misleading
oracles, appropriate test layers, test-structure design signals, or realistic
faults that a test should expose.

## Protect behavior, not inventory

A test earns its place by detecting a realistic violation of a supported
contract without rejecting changes that contract permits. Establish the
requirement independently of the assertion, its name, or its author's retention
explanation. Test count, line coverage, and proximity to recently changed code
are discovery aids, not evidence of protection. Useful coverage identifies:

1. the production change that should make the test fail;
2. why that change would violate a live contract;
3. whether another test or static gate would already reject it;
4. whether the test observes the behavior strongly enough to distinguish the
   defect; and
5. which relevant permitted changes—in the unit under test or compatible
   internal updates inside integrated dependencies—must leave the test passing.

Choose new protection when no existing test or static check already rejects
the named fault. Missing evidence for a requirement leaves an ownership question
to resolve; it does not by itself establish that an existing commitment can be
removed.

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

Consider a fault-revealing scenario and how to exercise it while establishing
the production interface. Discovering that inputs cannot be controlled or
effects cannot be observed at the owning seam can improve the design before
dependencies become difficult to change. Test-first development can supply
this early feedback by writing a test that initially fails before implementing
the behavior that makes it pass. Its timing alone does not make the scenario
realistic or the oracle independent.
Choose the protection from the contract and existing evidence.

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
the owned effect through that code's interface; otherwise use the applicable
non-test validation instead of manufacturing a test.

For a local executable artifact such as a script, command-line tool, or hook,
execute it and assert its outputs, exit status, or side effects. Matching its
source text proves only that text exists and can stay green when behavior
breaks. Use source-level assertions only when source form is itself the contract (such as
compatibility with a parser that cannot run locally), using a structural parser
when structure matters.

For a reusable module, evaluate protection from its established interface
contract separately from current caller conventions. A consumer test proves one
caller's integration; it neither narrows the module's contract nor establishes
which inputs can reach it. Examine the complete interface, enforced gates, and
real supported producers and execution paths without forcing a separate test
file or layer when existing coverage exercises the owning seam.

Classify candidate inputs before treating them as coverage obligations:

1. A value that an enforced static gate, opaque constructor, schema, or
   non-bypassable runtime boundary prevents from reaching the operation through
   every supported path does not become supported because a cast, private
   mutation, or impossible fixture can construct it.
2. The operation's call signature or input representation can carry a value that
   violates an invariant the module owns enforcing. It earns rejection coverage
   only when a real supported producer or execution path can deliver it and the
   module owns interpreting the value or admitting its side effects. Protect
   both the failure and the absence of callbacks, persistence, or other effects
   that rejection must prevent.
3. A value accepted by the complete interface but unused by current consumers
   remains governed by the module's contract. Decide its coverage from a
   distinct realistic fault and competing protection rather than from present
   caller demand alone.

Apply
[Defensive scope and boundary ownership](../software-design/defensive-scope-and-boundary-ownership.md)
before this classification when the producer, supported path, invariant,
validation responsibility, or effect-owning boundary is not independently
established. Tests follow production ownership; they do not create it.

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
  boundary, failure mode, or reachable state dimension.
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

## Select fault-revealing scenarios

After naming the live contract and realistic defect, identify the states that
can vary independently and affect that defect. Depending on the behavior, these
can include an authority, derived store, persistence record, immutable artifact,
cache, external dependency, or asynchronous step. Model only dimensions that
participate in the contract; a fixture that leaves every input healthy and
mutually consistent can exercise the ordinary path while hiding the named fault.

Choose degraded, partial, stale, absent, or contradictory combinations that are
reachable and expose distinct live faults. Do not brute-force a Cartesian
product or construct combinations that the actual producers, protocol, or
operation cannot create. A state combination earns coverage when it can occur
and changes an owned decision, capability, failure, or side effect.

Control every independently meaningful input in the selected scenario. When a
fallback, cache, or retained derived value remains available, establish whether
using it is permitted or forbidden rather than letting fixture defaults decide.
When one contract requires both a retained capability and the absence of a
secondary authority, fallback, mutation, or side effect, assert both and keep a
positive control that proves the fixture can exercise the capability.

For orchestration that forwards values returned by collaborators, a call
assertion proves the interaction but not that the returned value reached the
downstream decision. For each independently meaningful forwarded value, name a
plausible wiring fault such as omission, substitution with another snapshot or
context, or swapping two results. Choose fixture values for which correct and
faulty forwarding produce different outcomes at the seam that owns the
decision, and assert that semantic outcome. Treat call and argument assertions
as supplemental unless the interaction itself is the owned contract. Use
separate focused scenarios when one fixture cannot distinguish every forwarded
value, and apply [controlled mutation evidence](#prove-the-test-has-teeth) when
the protection remains uncertain.

For example, current configuration can leave an input unclassified while
historical configuration explicitly selects no action. Correctly forwarding
the historical result selects no action, while omitting it produces the
unclassified-input failure. If current and historical fixtures instead produce
the same decision, the expected result cannot establish which value was
forwarded.

For [human decision authorization](../software-design/human-decision-authorization.md)
binding a later command to reviewed content, use a supersession fixture: create
decision A, replace it with B under the same stable request and logical action
identifiers with changed approval-relevant content (different request IDs avoid
the substitution fault), submit a schema-valid stale command for A through the
supported path, and assert rejection at the decision owner before protected
callbacks, persistence, effects, or consumption while B remains current and
unchanged, then prove a valid response for B proceeds.

Schema parsing and stale dismissal do not prove freshness checks elsewhere.
Exercise each independently implemented admission or execution path that can
omit the comparison—keeping detailed checks at the owner and a representative
composed check when transport can drop or substitute the identity—asserting
that a stale value changes the semantic outcome at the owner rather than merely
being accepted or forwarded. Keep stale-command rejection distinct from a test
holding old in-flight work to prove its late completion cannot overwrite a
replacement.

Cover detailed state combinations at the narrowest owning seam, adding a
representative composed scenario when the fault depends on cross-boundary wiring
(selecting the highest-risk user-observable state supported by the evidence
rather than defaulting to the happy path). For example, pair a healthy baseline
(authority reports the resource available, current metadata, matching prepared
artifact) with a fault case where the authority still reports the resource
available and metadata current while the recorded artifact is removed and a
general cache remains—asserting both the required outcome and that the cache is
not consulted when fallback is forbidden, since a generic "unavailable" fixture
that leaves the cache unexamined proves neither claim. Test a separate reachable
contradiction where derived data survives after the authority no longer reports
the resource and must not become a second authority.

### Treat scale and input shape as fault dimensions

When a module's contract admits materially varying input size or shape, identify
dimensions that can change reachable correctness state—such as size, depth and
execution waves, breadth and fan-out, density, ordering, contention, early or
late failure, cancellation position, and combinations of successful, satisfied,
failed, blocked, and pending work—only when they can expose a named fault (such
as stack exhaustion, incomplete propagation, order dependence, starvation, or
resource conflicts) that small fixtures miss. Accepting a collection alone does
not create a stress-test obligation.

Use the smallest bounded deterministic fixture reaching the selected dimension
(generated when clearer) and assert contract invariants—such as prerequisite
ordering, concurrency and conflict limits, order independence, one outcome per
admitted item, transitive failure propagation, cancellation policy, and state
release—rather than copying a large trace or production algorithm. Do not
multiply fixtures for the same fault and dimension. Keep correctness fixtures
stable across supported environments; elapsed time, throughput, memory use,
operation growth, and other performance or resource claims require their own
established contract and observable metric under
[Test execution cost](test-execution-cost.md) rather than using diagnostic
timeouts as oracles.

## Use an independent oracle

Derive expected results independently from the implementation under test.
Calling the production builder on both sides of an assertion, importing the
decision constant and asserting the same constant, or reimplementing the full
algorithm in the test creates a mirror that can preserve the same defect.
Comparing two artifacts can likewise preserve a defect shared by both.

For snapshots, structural equality, and source or text matching, establish
why a supported consumer or accepted project purpose needs the fixed
representation or synchronization relationship. A statement that artifacts
match is itself a claim to evaluate; it does not by itself establish that
enforcing their equality serves that purpose. A committed generated artifact
may be promised to match current generation; equality then protects against
missed regeneration, while separate evidence establishes generator correctness.
The assertion's inability to detect shared defects limits its claim rather than
invalidating justified synchronization protection.

When a justified parity or output-equivalence contract requires artifacts or
outputs to agree everywhere except a bounded set of documented differences or
volatile fields, avoid checking only a fixed allowlist of shared fields,
because newly added fields edited on one side silently bypass it. Instead,
validate expected exclusions where required so renamed or removed difference
paths do not remain silently unused, remove or mask only those explicitly
justified paths, and assert structural equality across the remaining governed
fields and any covered surrounding content. Limit subset-only checks to
contracts where only those named fields are coupled while other fields may vary
independently.

Use hand-derived outcomes, externally visible contracts, invariants, or a simpler
independent model on the smallest fault-revealing fixture. Observe the effect a
contract requires: a retry test should observe attempts and outcome, not merely
assert the configured retry count.
Check a relevant permitted variation and a realistic violation when judging
whether an assertion constrains too much or protects too little. This is a
reasoning requirement, not a demand to execute mutations for every test.

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
real collaborator at the next stable seam; remove mocks without a concrete seam,
cost, or nondeterminism justification. Apply
[Trustworthy test execution](trustworthy-test-execution.md) when fixture
ownership, ambient state, time, ordering, or cleanup affects the result.

### Stay within external dependencies' public contracts

When a test crosses an external dependency—such as a UI component library, ORM,
router, or SDK—to verify application-owned behavior, keep interactions and
assertions within the behavioral and semantic contracts the dependency documents
for callers or users. Avoid coupling to private markup, styling hooks or CSS
classes, internal listener attachment nodes, generated query aliases, or
undocumented internal state, which can change across compatible dependency
updates without breaking the dependency's contract or the application; assert
application-owned outcomes, wired inputs, and documented contract effects
instead.

For example, clicking a UI library's internal wrapper class or asserting a visual
state class can break when a patch release moves the click listener or renames
styling wrappers; driving the control through its documented interface or
accessible semantics and asserting application state, wired inputs, and standard
contract state preserves coverage across valid updates. Likewise, asserting an
ORM-backed repository's documented outputs or persisted state tolerates internal
query-generation changes across minor updates.

## Make the protected behavior readable

Maintained tests are software that later readers must understand and change.
Keep the situation, operation under test, and expected consequence recognizable
so readers can tell which contract is protected and which fixture facts matter.

Keep setup, action, and checking distinguishable without imposing rigid labelled
blocks. Name helpers after meaningful test operations to remove incidental
construction or transport noise without burying independently meaningful
inputs, hidden mutable state, or the expected-result rationale (and investigate
large setup as a [missing-seam signal](#test-at-the-owning-seam) before hiding
it).

Make required state and mismatches easy to recognize. Multiple named
expectations can be clearer than one compact string; for a rejected update,
checking both rejection and absence of a write can jointly define one contract
without repeating setup just to isolate one assertion per test, while keeping
independent operations with distinct consequences separate.

Refactor helpers and fixtures as behavior evolves while preserving independent
expectations and fault sensitivity. Test code may use simpler construction than
production code when it aids clarity within suite resource limits, provided it
remains correct, isolated, reliable, and protective.

## Remove spent migration scaffolding

Migration comparison tests, fixtures, and test-only adapters can establish that
a cutover is safe without earning a permanent place in the target system.
Reassess their protection as the comparison obligation ends. A fixture that
reconstructs an obsolete entry path solely to compare old and new behavior can
retire together with its adapter when no supported contract needs that path.
Retain effective protection for the current contract, including any supported
older clients or persisted formats; the comparison itself is not a substitute
for that protection. Preserve scaffolding whose potentially live obligation
remains unresolved.

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

## Source for early feedback and test readability

Robert C. Martin, “Unit Tests,” chapter 9 in _Clean Code: A Handbook of Agile Software Craftsmanship_, ISBN 978-0-13-235088-4. Chinese edition: _代码整洁之道_, translated by 韩磊, 人民邮电出版社, 2010, ISBN 978-7-115-21687-8.
