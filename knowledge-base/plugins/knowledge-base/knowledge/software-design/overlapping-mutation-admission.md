# Overlapping mutation admission

## Scope

This document defines the language- and framework-independent admission and
mutation-authority contract for a state-changing operation that may be invoked
again before an active invocation and its operation-owned finalization settle.

## When to update

Update this document when evidence from real overlapping-operation failures,
coordination mechanisms, cancellation behavior, or distributed state changes
the durable relationship among operation identity, admission, ownership,
finalization, stale execution, and externally visible effects.

## Model overlap at the operation boundary

An overlap exists when a new invocation can begin while an earlier invocation
still owns work that may affect the same state. The calls need not share a
thread, process, transport, or function entry point. Retries, reloads,
reconnects, polling, startup work, schedulers, background work, batch paths, and
other clients can all bypass caller-local pending state.

Do not infer production safety from a disabled control, one guarded route, or a
status indicator. These can improve feedback and recovery for one caller, but
they do not constrain another ingress. Either establish that supported
execution cannot overlap, or define the production-side admission contract.

## Establish identity, conflict, and ingress

Before selecting a coordination primitive, define three related boundaries:

1. **Operation identity** states which target, intent, and options make two
   invocations equivalent enough to share one completion. Raw request equality
   is neither required nor sufficient when defaults, authorization context, or
   mutable preconditions change the meaning.
2. **Conflict domain** is the resource set over which concurrent effects can
   violate the operation's contract. It may be narrower or wider than operation
   identity: different operations can conflict over one resource, while
   equivalent operations on independent resources need not block each other.
3. **Ingress set** includes every supported API, worker, scheduler, startup
   path, retry path, batch path, and direct caller that can begin the operation.

All ingresses for one conflict domain must converge on coordination or
conditional mutation enforced by the same effect-owning boundary. When the
selected admission outcome depends on existing active work, those ingresses
must observe the same active ownership. Apply
[Module responsibility and defensive scope](module-responsibility-and-defensive-scope.md)
to place admission with the module or service that owns the conflicting effect
and its contract.

## Define an explicit admission matrix

For every meaningful incoming-operation and active-operation pair, select a
caller-visible outcome. Common outcomes include:

| Outcome   | Appropriate condition                                                       | Contract to define                                                                                                             |
| --------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Start     | No active ownership conflicts                                               | Claim ownership and begin one execution.                                                                                       |
| Join      | The invocations have the same operation identity                            | Share the complete result without repeating the effect.                                                                        |
| Reject    | Explicit work conflicts and should neither wait nor replace the active work | Return a typed busy or conflict result before another conflicting effect starts.                                               |
| Skip      | Optional work encounters an occupied conflict domain                        | Start no conflicting effect and keep the skip distinct from operational failure and failure cooldown.                          |
| Queue     | Ordered later execution is a product requirement                            | Define ordering, capacity, deduplication, cancellation, and which mutable preconditions are reread when execution begins.      |
| Supersede | Newer work is allowed to replace active work                                | Define cancellation or detachment, generation ownership, and how stale completion is prevented from affecting the replacement. |

These outcomes are design choices rather than a preference order or a closed
set. A single operation can use different outcomes for equivalent explicit
requests, conflicting explicit requests, and optional background work. State
the distinctions in the operation's interface instead of collapsing every
non-start outcome into an untyped failure.

A join is duplicate suppression while work is active. Every attached joiner
observes the same complete operation result. A joiner can detach when its own
cancellation or timeout contract permits, while cancellation of the shared
execution remains a separate decision. A join does not by itself make a later
retry safe after the active entry disappears. That requires a retry contract
such as an inherently idempotent effect, a conditional mutation tied to the
expected state, or a durable idempotency identity enforced at every covered
effect boundary. When a retry must reproduce an established result, persist
enough state to recognize or reconstruct it.

## Make admission and ownership effective

When the admission contract uses active ownership, the admission decision and
ownership claim must form one coordination boundary. Register ownership before
any check, asynchronous work, or side effect whose correctness relies on
exclusivity; otherwise two invocations can both pass preflight before either
becomes visible as active. The selected ownership primitive must be atomic for
the conflict domain and visible to every actor in the ingress set.

Process-local coordination is sufficient only when that process owns every
conflicting effect. When independent processes, hosts, or services can mutate
the same domain, use coordination or conditional mutation at a boundary they
share. A check followed by a separate write leaves a race unless the owning
system supplies an atomic claim, transaction, compare-and-set, unique
constraint, generation condition, or equivalent primitive.

Keep ownership active through the last operation-owned effect, including
publication, persistence, reconciliation, and cleanup when those phases belong
to the operation contract. Define release behavior for success, typed failure,
thrown failure, cancellation, and timeout. A caller timing out or disconnecting
does not establish that server-side work stopped, and an operation cannot
safely release shared state while one of its owned writers can still commit.

## Prevent stale executions from affecting newer work

Coordination ownership and mutation authority are separate properties. An
owner token can prevent a delayed cleanup from releasing a lock that has
already been acquired by another operation. It does not necessarily prevent
the delayed operation from writing to the protected resource after its lease or
ownership expires.

When work can outlive its ownership, carry a monotonic fencing token,
generation, resource version, or another precondition to the mutation boundary
and reject effects from stale owners there. Define which finalization effects
need the same protection. Time-based expiry improves recovery from abandoned
ownership but does not by itself stop an earlier execution from continuing.

A locally owned generation represents one semantic precondition, not a general
indication that nearby state changed. Define the assumption associated with the
generation and advance it only when an event makes work admitted under an
earlier value stale. Cache eviction, refresh requests, recomputation, or changes
to independently owned cached data must not advance an authority generation
unless they invalidate that same assumption. When one reset spans independent
state, split its invalidation effects or give the independently changing domains
separate generations so unrelated changes do not widen the stale domain.

When an authority-changing mutation is confirmed and operation-owned
verification or reconciliation follows, advance the applicable generation at
that confirmed mutation boundary before those later phases can overlap
pre-mutation work. The exact boundary depends on the external mutation
contract. When an effect may have occurred without confirmation, a later local
generation change cannot close that uncertainty; use an atomic precondition or
fence at the effect-owning boundary, or define how the ambiguous outcome is
reconciled.

## Keep observation separate from admission

Status endpoints, persisted operation records, pending indicators, and polling
help callers discover work started elsewhere or recover after losing local
state. They are observation mechanisms unless the effect-owning boundary also
uses them in an atomic admission decision. Treating an observed Boolean or
status read as a lock recreates the check-then-act race.

## Review and test the selected contract

A design or review should account for:

1. operation identity, conflict domain, and every production ingress;
2. the outcome of each meaningful overlap;
3. the atomic admission point, whether ownership registration or conditional
   mutation, and its coordination scope;
4. when active ownership is used, the final operation-owned effect and every
   release path;
5. cancellation, timeout, queueing, or supersession behavior that applies; and
6. the semantic precondition represented by each generation or fence, the
   events and boundary that advance it, and the mechanism that rejects stale
   mutation and, when ownership can transfer, stale release.

Review remains incomplete while a supported ingress or operation-owned phase is
unaccounted for, unless evidence establishes that a second invocation cannot
overlap it.

Protect the selected matrix cells with deterministic interleavings. For active
ownership, hold the first operation after it acquires ownership, invoke the
competing production path, assert the admission result and effect count, then
release and await the required completion. For conditional mutation without an
active-owner record, force competing mutations against the same expected
precondition and assert which effects can commit. Exercise exceptional release
and finalization ownership when they can violate the contract. Add a composed
test when separate ingresses must converge on the same owner, and keep the
detailed cases at the narrowest seam that owns admission.

When a generation protects publication from work admitted under an authority
snapshot, test both sides of its scope. Hold valid work across an unrelated
cache reset and prove that it remains valid. For a real authority change,
complete the replacement work before releasing the pre-mutation work and prove
that the stale completion cannot publish. When operation-owned verification
follows the mutation, observe that the generation has already advanced before
verification begins.

For JavaScript and TypeScript barriers, apply [JavaScript Promise coordination](../javascript/promises.md).
Apply [Test effectiveness](../software-testing/test-effectiveness.md) to select
the fault-revealing cases and [Trustworthy test execution](../software-testing/trustworthy-test-execution.md)
to establish ordering and completion without sleeps. A forced interleaving
proves the represented overlap; it does not prove every process failure or
distributed partition.

## References

- [RFC 9110: Idempotent methods](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2)
- [Go `singleflight` duplicate call suppression](https://pkg.go.dev/golang.org/x/sync/singleflight)
- [AWS guidance for idempotent task execution](https://docs.aws.amazon.com/wellarchitected/latest/agentic-ai-lens/agentrel06-bp04.html)
- [Redis distributed lock ownership and release](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/)
- [Google Cloud Storage request preconditions](https://cloud.google.com/storage/docs/request-preconditions)
