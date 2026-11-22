# Shared-state concurrency

## Scope

This document explains how overlapping executions preserve shared-state invariants and make required progress through a coherent coordination protocol.

## When to update

Update this document when evidence from concurrent state transitions, resource contention, or worker shutdown changes the relationship among state ownership, atomicity, visibility, waiting, and progress guarantees.

## Define correctness before selecting a primitive

Concurrent executions can overlap in their work; parallel executions run at the
same time. Threads are one implementation, but asynchronous tasks can also
interleave at suspension points. Establish which overlap the actual runtime and
entry points permit rather than assuming every pair of source statements can
interleave, or assuming a container makes shared state safe.

State the invariant that must remain true and the progress the application needs.
Unique identifiers must remain unique; a stock reservation must not consume the
same remaining item twice. An operation can preserve these safety properties
while waiting forever, so progress needs a separate argument. Concurrency may
overlap waiting or independent computation, but coordination, contention, and
resource limits can offset the gain. Measure the relevant workload before claiming
a throughput benefit.

When independently invoked operations can conflict, their
[admission contract](overlapping-mutation-admission.md#define-an-explicit-admission-matrix)
decides whether conflicting requests may start new work, share active work,
reject, queue, or replace work. The coordination implementation must enforce that chosen outcome at the
scope where conflicting effects occur. A lock shared only within one process cannot protect a
resource that other processes also mutate unless the resource supplies the
required shared coordination or conditional mutation.

## Reduce shared mutable state where the contract permits

Give each mutable value a clear owner and identify every actor that can read or
write it. Keeping a field private limits access through the API; it does not
prevent two calls to that API from racing.

Independent task-local data can avoid coordination when no aliases—other
references to the same underlying object—let other tasks mutate that state.
Immutable snapshots or separate working
copies can also isolate calculation, with results combined by the component responsible for combining them.
A shallow copy that retains shared mutable children does not provide that
isolation. Establish how a snapshot is obtained consistently and whether its
possible staleness is acceptable to the operation before replacing shared access
with copies. Copying has costs as well as benefits.

Keep the underlying calculation independently exercisable when that clarifies the
design, while concentrating the coordination that governs shared transitions.
Moving every thread-related statement to another class is insufficient if callers
still have to coordinate the invariant themselves.

## Protect the complete state transition

Atomicity means that the relevant operation takes effect as one indivisible step
for competing actors. Visibility means that another actor can observe the state
changes under the chosen runtime's ordering rules. Establish both from the
primitive's actual contract; one source expression, an atomic field, or a
thread-safe collection does not prove an arbitrary sequence of calls is atomic.

An exclusive lock provides mutual exclusion: only one participating execution
can hold that same lock at a time. This can protect a transition when every
conflicting access participates in the required protocol.

For example, separately safe `isEmpty()` and `remove()` calls do not make
`if (!isEmpty()) remove()` one decision. Another consumer may remove the last item
between them. Use a supported atomic removal operation whose empty-queue behavior
matches the contract, or a coordination boundary covering the check and removal.
Likewise, an individually atomic read and write
do not automatically make incrementing a shared counter atomic.

Every access capable of violating the same invariant must participate in a
compatible protocol. Locking writers while readers can observe an invalid
intermediate combination may still violate the promised read contract. Different
locks around different methods do not exclude one another merely because both
methods are labelled synchronized.

Keep the critical section—the region protected by coordination—small enough to
avoid unrelated contention, but large enough to preserve the whole invariant.
Do not shorten it by moving a required check outside the protected transition.
Slow I/O, callbacks, or acquisition of another resource inside it deserve scrutiny:
they can hold up other work or introduce a waiting cycle. If work moves outside
the region, revalidate any assumptions that can change before committing its
result, using the protocol the shared-state owner supports.

## Bound demand on shared resources

Choose resource limits from the accepted work and operating contract. Count
executing work and accepted waiting work separately: a fixed number of workers
does not establish a bounded backlog. Queued work can retain request data,
connections, or other resources even before a worker starts it. Check where each
limit is enforced and what happens when it is reached, including whether the
caller waits or receives the contract's non-admission outcome. Do not infer a
bound from the scheduler's name or from one successful load test.

For example, four workers can execute at most four tasks at once while an
unbounded queue continues accepting thousands of tasks. The execution limit has
not limited the memory retained by waiting tasks. Use the required queue or
admission bound and resource ownership to keep demand within the established
budget; changing the worker count alone does not fulfill that requirement.

## Make resource acquisition support progress

A deadlock leaves participants blocked by dependencies on one another, such as
each holding a resource the other needs. Starvation
means a participant is repeatedly denied the opportunity to progress. Livelock
means participants keep acting, often retrying, without completing useful work.
Mutual exclusion alone does not rule out any of these progress failures.

Trace what each participant can wait for, which resource it holds while waiting,
and who can satisfy that wait. With blocking operations on a bounded
producer–consumer queue, a producer can wait for space when the queue is full,
and a consumer can wait for an item when it is empty. These waits concern
different queue states. The queue protocol must
make the relevant state changes visible and wake or complete the appropriate
waits. Fairness and cancellation behavior depend on the chosen implementation;
do not infer them from the name of a lock or queue.

Include worker capacity in this trace. For example, four tasks occupy all four
workers in a fixed-capacity pool. Each task queues another task to that same pool
and keeps its worker occupied while waiting for the new task's result. The queued
tasks have no free worker to run them. Adding a timeout can expose or limit waiting without proving
that the required work can progress or that timed-out work has stopped.

In the usual allocation model for reusable exclusive resources, these conditions
together permit a resource deadlock:

| Condition             | Meaning                                                               |
| --------------------- | --------------------------------------------------------------------- |
| Mutual exclusion      | A resource cannot be held by competing participants at once.          |
| Hold and wait         | A participant keeps a resource while waiting for another.             |
| No forced reclamation | The allocation protocol cannot reclaim a resource from its holder.    |
| Circular wait         | Participants form a cycle, each awaiting a resource held by the next. |

Break a necessary condition while preserving the resource's correctness contract.
A common choice is one strict acquisition order followed by every participating
path, including indirect calls. Two operations that acquire resources `A` then
`B` and `B` then `A` can each hold the resource the other needs. Acquiring them in
the same strict order removes that cycle. The order must cover the actual
resources acquired; adding a few more connections or checking availability before
a separate acquisition does not establish this guarantee.

Another choice is a supported acquisition operation that grants the required set
together without holding a partial set while waiting. Alternatively, release a
partial set before retrying instead of retaining it while waiting. Establish that
acquisition and release really have those semantics.
Retries can still cause starvation or livelock, and more concurrency can increase
contention. Removing one resource cycle is not a proof of fairness, capacity, or
all other progress properties.

Releasing resources does not undo an earlier external effect. Before restarting an
attempt that may have written data, use the
[operation's outcome and recovery contract](operation-failure-and-recovery.md#make-recovery-a-supported-path)
to establish what happened and whether repetition is safe. The component controlling the resource
must also support any proposed cancellation or reclamation; taking a resource
away while its previous owner can still use it can replace a progress problem
with a safety violation.

## Complete blocked participants during shutdown

Shutdown must include blocked participants. Decide whether accepted work drains
or is abandoned, stop admission accordingly, and provide a completion path for
each remaining wait. A consumer cannot finish by waiting for another item after
its only producer has stopped. A coordinator cannot finish by waiting for a worker
that never receives the stop condition. Account for failures as well as the
ordinary stop sequence, and release resources only after the work that uses them
has reached the required completion boundary. A stop request or expired timeout
alone is not evidence that a worker stopped.

## Exercise the relevant interleavings

First exercise the underlying sequential rule, then the coordination that must
preserve it under the allowed overlap. Choose a realistic competing schedule
that would violate the invariant if coordination were wrong, and observe the
result or effect at its owner. [Test effectiveness](../software-testing/test-effectiveness.md#test-at-the-owning-seam)
owns the choice of protected fault and evidence; this schedule must represent
production-permitted interference rather than an impossible fixture state.

Use barriers or acknowledgements to establish the required phases, following
[trustworthy test execution](../software-testing/trustworthy-test-execution.md#synchronize-on-evidence).
Place a test barrier where the competing execution can actually reach it;
holding an exclusive lock while waiting for another actor to acquire that lock
can manufacture a test deadlock. A diagnostic timeout on a test wait can expose lack of progress in a
represented scenario. Varying load and scheduling can discover additional races,
but stress passes or added sleeps do not prove every allowed execution is safe.
Retain an intermittent failure as evidence to investigate even when a later run
passes.

## Sources

- Brett L. Schuchert, “Concurrency,” chapter 13 in _Clean Code: A Handbook of Agile Software Craftsmanship_, ISBN 978-0-13-235088-4. Chinese edition: _代码整洁之道_, translated by 韩磊, 人民邮电出版社, 2010, ISBN 978-7-115-21687-8. Its shared-state, compound-call, execution-model, and shutdown examples inform this account; historical Java performance comparisons, exact bytecode-path counts, and tool recommendations are not portable guarantees.
- Brett L. Schuchert, “Concurrency II,” appendix A in the same editions: bounded resource demand, compound operations, resource deadlock conditions, and acquisition strategies, with their correctness and progress limits.
- [Java Language Specification, chapter 17: Threads and Locks](https://docs.oracle.com/javase/specs/jls/se26/html/jls-17.html): a concrete language model distinguishing synchronization and visibility; other runtimes require their own supported contracts.
- [Java `Executors` documentation](https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/Executors.html): a concrete counterexample to assuming a fixed worker count also bounds queued work.
