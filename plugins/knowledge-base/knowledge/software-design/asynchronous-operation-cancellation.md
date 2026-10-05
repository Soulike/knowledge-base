# Cancellation in asynchronous interface design

## Scope

This document defines project-independent considerations for an asynchronous
interface whose caller may stop needing its result while work remains. It covers
when cancellation is worth providing, how caller interest relates to work
ownership, how a cancellation request reaches avoidable work, and how to define
the boundary between requesting a stop and confirming completion.

## When to update

Update this document when evidence from asynchronous interface designs or
cancellation failures changes the relationship among caller abandonment,
avoidable execution cost, work ownership, signal propagation, and completion.

## Assess the remaining work

When designing an asynchronous interface, consider what happens if its caller
stops needing the result before execution finishes. Identify the remaining CPU
work, I/O, remote calls, and queued tasks, and whether continuing them has a
meaningful cost. This is a design check for asynchronous interfaces, not a
requirement to add a cancellation parameter to every short operation.

Where the remaining cost is worth avoiding, define how the interface learns
that its caller no longer needs the result and which work can be stopped. A
caller ceasing to wait for a result does not itself stop the execution that
would have produced it.

## Match cancellation to work ownership

Determine who still benefits from each part of the work. Work performed only
for the departing caller is a candidate for cancellation. If other callers
share an execution, one caller may stop waiting while the shared execution
continues for the others. A task with an independent purpose, such as refreshing
a shared cache, may also continue after the initiating caller leaves. When the
last interested caller leaves and the work has no independent purpose, its owner
can request cancellation of the remaining work. Do not make one caller's
cancellation signal the sole authority over work that others still need.

The interface's owner decides which work belongs to the caller and which work
has an independent lifetime. Stopping work that produces effects also depends
on the effect's contract; abandonment of a result does not undo an effect that
has already happened.

## Carry the request to avoidable work

Translate caller abandonment at the entry boundary into a cancellation
mechanism that the owned operation can observe. Carry it through the operation's
fan-out to the tasks that consume resources, check it before starting later
stages, and let active tasks stop at supported, safe points. Ending an outer
wait or response without reaching those tasks does not save their remaining
work.

For example, an HTTP handler may start several calls to assemble a response.
If the client leaves, its caller-only calls and calculations should receive the
cancellation request, and no further caller-only task should be started. The
transport or framework determines how the handler detects that event. In
JavaScript and TypeScript, an `AbortSignal` can carry the request, but each
operation must observe it and its underlying API determines what can actually
stop. Other runtimes may provide a request context that is passed to downstream
calls.

## Define the completion contract

A cancellation request is not evidence that the work has ended. An operation
may have finished already, may stop only at a later checkpoint, or may have a
dependency that cannot stop immediately. Specify, according to the interface's
actual effects and callers, what can continue, which cleanup is required, how
an observable cancellation result differs from an operational failure, and
what completion means. If a later action relies on the old work having stopped,
wait for a completion boundary that covers the work and effects it relies on.

Review the chosen contract with abandonment before work starts, while owned
tasks are active, while a shared task still has another interested caller, and
after its last interested caller leaves. Check that cancellation reaches the
intended work without stopping work owned by someone else.

## References

- [DOM Standard: `AbortSignal`](https://dom.spec.whatwg.org/#interface-abortsignal)
- [Go: Canceling in-progress operations](https://go.dev/doc/database/cancel-operations)
- [gRPC: Cancellation](https://grpc.io/docs/guides/cancellation/)
- [Node.js: File-system abort behavior](https://nodejs.org/api/fs.html#fsreadfilepath-options-callback)
