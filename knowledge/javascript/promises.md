# JavaScript Promise coordination

## Scope

This document defines project-independent principles for coordinating Promises
in JavaScript and TypeScript when concurrent work must finish before a dependent
side effect, or when Promise settlement is controlled outside the operation
that creates it. It is not a Promise API catalog or a general guide to
asynchronous application design.

## When to update

Update this document when ECMAScript changes the relevant Promise semantics,
target runtimes or TypeScript library definitions materially change the
available standard operations, or a recurring Promise-coordination failure
exposes a missing completion, compensation, or external-settlement principle.

## Wait for started work before dependent side effects

`Promise.all()` rejects with the first input rejection it observes. That settles
the aggregate Promise, but it neither cancels the other inputs nor establishes
that they have finished. A catch that immediately starts cleanup, rollback,
compensation, retry, or state restoration can therefore race with sibling
operations that are still producing side effects.

Separate the result policy from the completion barrier. When the next step
assumes that every started operation has stopped mutating the affected state:

1. Retain every Promise representing started work and wait for all of them to
   settle, commonly with `Promise.allSettled()`.
2. Inspect the complete results and propagate the failure or failures according
   to the owning error contract.
3. Re-read mutable external state when another actor can change whether the
   dependent side effect is still valid.
4. Compensate only the state that the current component owns and observed before
   the operation.

`Promise.allSettled()` is a barrier only for the input Promises. Each operation
must itself settle after the side effects and cleanup on which its caller relies
have reached their completion boundary.

If failure should stop sibling work early, request cancellation through the
operation-specific protocol, then still await the retained completion Promises
before a dependent side effect that requires quiescence.

## Prefer `Promise.withResolvers()` to handwritten deferreds

When the target runtime and TypeScript library definitions support it, use
`Promise.withResolvers<T>()` when code outside a Promise executor must receive
the associated settlement functions:

```ts
const { promise, resolve, reject } = Promise.withResolvers<Result>();
```

Prefer this standard capability over capturing resolver functions in mutable
variables, using definite-assignment assertions, or repeating a local deferred
helper. Use an ordinary `async` function or directly returned Promise when
settlement remains inside the operation that creates it; external settlement is
appropriate only when another lifecycle owns the signal, such as an event or
callback adapter or a controlled test barrier.

Treat declaration and runtime support as separate checks: a TypeScript library
declaration can make `Promise.withResolvers()` type-check but cannot provide its
runtime implementation. When either side lacks support, use the project's
established compatibility layer or one small typed helper at the owning
boundary.

## Force ordering with Promise barriers in tests

Use `Promise.withResolvers()` to make a relevant asynchronous interleaving
explicit. Signal that the delayed operation started, hold it at the boundary
under test, assert that the dependent phase has not run, then release it and
await the final result.

```ts
const started = Promise.withResolvers<void>();
const release = Promise.withResolvers<void>();
```

This directly exercises cases such as one operation failing while a sibling
remains in flight. `await Promise.resolve()` can advance already queued Promise
reactions, but it is not a completion barrier for work that depends on later
events, I/O, timers, or an external release. Apply
[Trustworthy test execution](../software-testing/trustworthy-test-execution.md)
when the barrier participates in a broader asynchronous, timeout, retry, or
cleanup test design.

## References

- [ECMAScript: `Promise.all`](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.all)
- [ECMAScript: `Promise.allSettled`](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.allsettled)
- [ECMAScript: `Promise.withResolvers`](https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-promise.withresolvers)
