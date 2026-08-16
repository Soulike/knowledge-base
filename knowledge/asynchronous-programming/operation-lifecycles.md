# Asynchronous operation lifecycles

## Scope

This document defines implementation-independent invariants for asynchronous work whose result can outlive the view, request, refresh, batch, or owner that started it, including lifecycle identity, currentness, replacement, cancellation scope, sibling isolation, and bounded-queue capacity release.

## When to update

Update this document when a stale-result overwrite, teardown race, cancellation leak, sibling failure, or queue-capacity incident changes the evidence needed to bind asynchronous work to its owner and retire it safely.

## Bind work to a lifecycle identity

Give each mounted view, request generation, refresh, batch, or comparable owner a lifecycle identity. An asynchronous result may mutate shared or visible state only while that identity is still current. Checking that the component still exists is insufficient when a newer operation under the same component has replaced the older one.

Retire the old identity before replacement or teardown can expose a new state. Propagate cancellation to owned I/O where possible, but keep the currentness check even when an underlying operation cannot be cancelled or races with cancellation. Completion after retirement must become a no-op for shared state.

## Make newer work authoritative

Overlapping refreshes and submissions need an explicit ordering rule. When the newest request represents current intent, an older completion must not overwrite it, dismiss its UI, remove its pending data, or otherwise commit against the new lifecycle. Bind completion to the exact generation and input it is allowed to finalize rather than comparing only a broad owner identifier.

## Scope failure and cancellation

A local item failure should remain local unless the contract defines the group as atomic. Retiring a shared lifecycle or cancelling sibling work because one file, page, or item failed converts an isolated error into unrelated data loss. Conversely, teardown of the owning lifecycle should cancel or retire all of its descendants.

Bound concurrent work explicitly and release capacity on every terminal path, including rejection, cancellation, and stale completion. A failed item that retains its slot can stall otherwise independent work even when error reporting is correct.
