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

Consider a fault-revealing scenario while establishing the production
interface; discovering uncontrollable inputs or unobservable effects at the
owning seam guides design before dependencies harden. Test-first development
supplies that early feedback, though writing a test first does not make its
scenario realistic or its oracle independent. Choose protection from the
contract and existing evidence.

## Establish the owned behavior

A project test must execute behavior owned by code that the project's declared
test environment can run and observe its effect. File type does not decide
ownership: configuration interpreted locally participates in local behavior,
whereas declarations consumed only by an unavailable external system lack a
local test seam. Parsing an external declaration locally to assert a selected
literal restates the source without exercising external behavior; apply the
platform's syntax or schema validation and verify the real integration when
practical and proportionate. Test local interpretation, transformation,
validation, or transmission through the owning code's interface; otherwise use
non-test validation rather than manufacturing a test.

Execute local executable artifacts—scripts, CLI tools, or hooks—and assert
outputs, exit status, or side effects rather than matching source text, which
can pass when behavior breaks. Assert source form only when form itself is the
contract (such as compatibility with a parser that cannot run locally), using a
structural parser when structure matters.

Evaluate a reusable module's protection from its established interface contract
separately from current caller conventions; a consumer test proves one caller's
integration without narrowing the contract or proving which inputs can reach
it. Inspect the complete interface, enforced gates, and real supported
producers and paths without forcing a separate test file or layer when existing
tests exercise the owning seam.

Classify candidate inputs before treating them as coverage obligations:

1. Values blocked on every supported path by an enforced static gate, opaque
   constructor, schema, or non-bypassable runtime boundary do not become
   supported merely because a cast, private mutation, or impossible fixture
   constructs them.
2. Values representable by the signature or input shape that violate an
   invariant the module owns enforcing earn rejection coverage only when a real
   supported producer or path can deliver them and the module owns interpreting
   them or admitting their side effects; protect both the failure and the
   absence of callbacks, persistence, or other prevented effects.
3. Values accepted by the complete interface but unused by current consumers
   remain governed by the contract; judge coverage by a distinct realistic
   fault and competing protection rather than current caller demand alone.

Apply
[Defensive scope and boundary ownership](../software-design/defensive-scope-and-boundary-ownership.md)
first whenever the producer, supported path, invariant, validation owner, or
effect-owning boundary is unestablished. Tests follow production ownership; they
do not create it.

## Find marginal protection

Several common test shapes add little or no independent protection:

- A test repeats a guarantee whose complete accept-or-reject shape is directly
  readable from a declaration; non-obvious refinements, transformations,
  security boundaries, and unchecked runtime seams remain behavior worth
  exercising.
- A test retests an upstream framework mechanism without asserting the local
  transformation, arguments, side effects, failure propagation, or wiring the
  project owns.
- More inputs hit an already-covered branch without exposing a distinct
  boundary, failure mode, or reachable state dimension.
- The same result is asserted across layers when only one layer owns it.
- A runtime assertion repeats a property already enforced across relevant code
  by a compiler, linter, schema generator, or equivalent static gate.

When a broadly expressible static property lacks a gate, prefer adding the gate
over testing one example; static analysis still does not replace runtime
coverage for unchecked inputs. Redundancy depends on independent failure, not
textual similarity: similar tests can guard separate branches, while differently
written tests can be redundant when they fail only for the same reason.

## Select fault-revealing scenarios

After naming the live contract and realistic defect, identify states that can
vary independently and affect that defect—such as an authority, derived store,
persistence record, immutable artifact, cache, external dependency, or
asynchronous step. Model only dimensions that participate in the contract; a
fixture with uniformly healthy, consistent inputs can miss the named fault.

Choose reachable degraded, partial, stale, absent, or contradictory
combinations that expose distinct live faults rather than brute-forcing a
Cartesian product or constructing impossible combinations. A combination earns
coverage when it can occur and changes an owned decision, capability, failure,
or side effect.

Control every independently meaningful input in the scenario. When a fallback,
cache, or retained derived value remains present, establish whether using it is
permitted or forbidden rather than leaving it to fixture defaults. When a
contract requires both a retained capability and the absence of a secondary
authority, fallback, mutation, or side effect, assert both alongside a positive
control proving the fixture can exercise the capability.

For orchestration forwarding collaborator results, a call assertion proves the
interaction but not that the returned value reached the downstream decision.
For each forwarded value, name a plausible wiring fault—omission, substitution
with another snapshot or context, or swapped results—choose fixture values
where correct and faulty forwarding produce different outcomes at the
decision-owning seam, and assert that semantic outcome. Treat call assertions as
supplemental unless the interaction itself is the contract, use separate
focused scenarios when one fixture cannot distinguish forwarded values, and
apply [controlled mutation evidence](#prove-the-test-has-teeth) when uncertainty
remains.

For example, if current configuration leaves an input unclassified while
historical configuration explicitly selects no action, forwarding the historical
result yields no action whereas omitting it produces the unclassified-input
failure; fixtures where both produce the same decision cannot prove forwarding.

Schema parsing and dismissal checks do not prove freshness, identity, or
precondition comparisons elsewhere. Exercise each independently implemented
admission or execution path that can omit a required check—keeping detailed
cases at the owner and a representative composed check when transport can drop
or substitute the value—and assert that a stale or mismatched input changes the
semantic outcome at the owner rather than merely being accepted or forwarded.

Cover detailed state combinations at the narrowest owning seam, adding a
representative composed scenario at the highest-risk user-observable state
supported by the evidence rather than defaulting to the happy path when
cross-boundary wiring can fail. Avoid generic "unavailable" fixtures that leave
a forbidden fallback or general cache unexamined: test the reachable partial
failure (such as an available resource whose prepared artifact is missing while
a cache remains) and assert both the required outcome and that fallback did not
run, plus a separate reachable contradiction where surviving derived data must
not act as a second authority.

### Treat scale and input shape as fault dimensions

When a contract admits materially varying input size or shape, identify
dimensions that change reachable correctness state—size, depth and execution
waves, breadth and fan-out, density, ordering, contention, early or late
failure, cancellation position, and combinations of successful, satisfied,
failed, blocked, and pending work—only when they expose a named fault (such as
stack exhaustion, incomplete propagation, order dependence, starvation, or
resource conflicts) that small fixtures miss. Accepting a collection alone does
not create a stress-test obligation.

Use the smallest bounded deterministic fixture reaching the dimension (generated
when clearer) and assert contract invariants—prerequisite ordering, concurrency
and conflict limits, order independence, one outcome per admitted item,
transitive failure propagation, cancellation policy, and state release—rather
than copying a large trace or production algorithm. Avoid multiplying fixtures
for the same fault and dimension, and keep correctness fixtures stable across
environments; elapsed time, throughput, memory, and operation growth require
their own contract and observable metric under
[Test execution cost](test-execution-cost.md) rather than diagnostic timeouts.

## Use an independent oracle

Derive expected results independently from the implementation under test;
calling the production builder on both sides, importing the tested constant, or
reimplementing the algorithm creates a mirror that shares defects, as can
comparing two unverified artifacts.

For snapshots, structural equality, and text matching, establish why a
supported consumer or project commitment requires the fixed representation or
synchronization; asserting that artifacts match does not prove that equality
protects a contract. A committed generated artifact promised to match current
generation needs equality protection against missed regeneration, with separate
evidence for generator correctness; shared-defect blindness limits the claim
without invalidating synchronization protection.

When a justified parity or output-equivalence contract requires artifacts or
outputs to agree except for bounded documented differences or volatile fields,
do not check only a fixed allowlist of shared fields, which silently misses
unmatched newly added fields. Instead, validate expected exclusions where
required so renamed or removed difference paths do not stay silently unused,
mask or remove only those justified paths, and assert structural equality across
the remaining governed fields and covered context; restrict subset-only checks
to contracts where only those named fields are coupled.

Use hand-derived outcomes, external contracts, invariants, or a simpler model on
the smallest fault-revealing fixture, observing contract-required effects (such
as retry attempts and outcome, not only configured retry count). Check a
relevant permitted variation and realistic violation when judging assertion
strength—a reasoning check, not a mandate to mutate every test. Exercise each
reachable short-circuit outcome in compound guards, pair negative assertions
with positive controls, and for persisted-shape migrations assert both the
replacement behavior and absence of consumed legacy fields.

## Test at the owning seam

One test should diagnose one behavior: group assertions that jointly define one
contract, and split unrelated contracts with different failure owners.

Large setup is often a design signal; before hiding it in a helper, check
whether a narrower interface or different owning layer makes the behavior
directly testable. Co-located test groups around independent module
responsibilities can likewise signal a missing production seam—an investigation
prompt, not an automatic split rule.

Place doubles at slow, nondeterministic, or external seams while keeping the
reviewed behavior real; a double above a depended-on side effect removes its own
subject. Reject unexpected inputs in doubles and model the response shapes and
failure branches relevant to the integration. When mock setup exceeds or is
more volatile than the isolated behavior, use a real collaborator at the next
stable seam and drop mocks lacking a seam, cost, or nondeterminism reason.
Apply [Trustworthy test execution](trustworthy-test-execution.md) when fixture
ownership, ambient state, time, ordering, or cleanup affects the result.

### Stay within external dependencies' public contracts

When tests cross an external dependency—such as a UI library, ORM, router, or
SDK—to verify application behavior, interact and assert only through
contracts the dependency documents for callers or users. Avoid private markup,
styling hooks or CSS classes, internal listener nodes, generated query aliases,
or undocumented internal state that can change across compatible updates; assert
application outcomes, wired inputs, and documented contract effects instead.

For example, drive a UI control through its documented interface or accessible
semantics and assert application state, wired inputs, and standard contract
state rather than internal wrapper or visual-state classes, and assert an
ORM-backed repository's documented outputs or persisted state rather than
internal query aliases.

## Make the protected behavior readable

Maintained tests are software future readers must understand and modify. Keep
the situation, operation under test, and expected consequence clear so readers
see which contract is protected and which fixture facts matter.

Separate setup, action, and checking visually without rigid labelled blocks.
Name helpers after meaningful test operations to hide construction or transport
noise without burying meaningful inputs, mutable state, or oracle rationale
(and investigate large setup as a [missing-seam signal](#test-at-the-owning-seam)
before wrapping it). Multiple named expectations can clarify failures better
than one compact string, and checking both rejection and absence of a write can
jointly define one contract without duplicating setup—while keeping independent
operations separate.

Refactor helpers and fixtures as behavior evolves without losing independent
expectations or fault sensitivity. Simpler construction than production code is
fine for clarity within resource limits when isolation, reliability, and
protection hold.

## Remove spent migration scaffolding

Migration comparison tests, fixtures, and test-only adapters can verify a
cutover without earning permanent residence. Reassess them as the comparison
obligation ends: retire fixtures and adapters that reconstruct obsolete entry
paths solely for old-vs-new comparison once no supported contract needs them,
while preserving protection for current contracts, supported older clients,
persisted formats, and unresolved obligations.

Temporary tests proving old behavior is gone can catch incomplete migrations
without belonging permanently. Remove them when retained new-contract tests
strictly imply the old behavior is absent and no live input, compatibility
path, shared default, or security boundary can restore it; keep them while
reintroduction remains a standing risk.

## Prove the test has teeth

Mutation analysis asks whether coverage fails when a plausible defect—wrong
argument or constant, wrong branch, omitted state change or side effect, empty
return, or missing boundary check—is introduced.

A safe, reversible temporary mutation beats mental analysis when uncertainty
remains, though copied logic, identical branches and observables, declaration
restatement, or absent contracts establish redundancy directly. When retained
coverage is claimed to catch the same fault, a realistic mutation can prove it;
a surviving mutation exposes unprotected behavior or a toothless assertion.

## Source for early feedback and test readability

Robert C. Martin, “Unit Tests,” chapter 9 in _Clean Code: A Handbook of Agile Software Craftsmanship_, ISBN 978-0-13-235088-4. Chinese edition: _代码整洁之道_, translated by 韩磊, 人民邮电出版社, 2010, ISBN 978-7-115-21687-8.
