# Asynchronous Node.js filesystem APIs

## Scope

This document defines when Node.js code should use asynchronous
`node:fs/promises` APIs rather than synchronous `*Sync` methods from `node:fs`,
the narrow runtime boundaries where synchronous filesystem calls are required
or acceptable, and the in-process interleaving risks exposed when moving from
synchronous calls to `await`. It covers execution-model selection across
long-lived servers and workers, bootstrap and exit hooks, signal handlers, and
standalone scripts; handle ownership, open flags, pathname-identity invariants,
and general multi-actor admission contracts remain outside its scope.

## When to update

Update this document when a supported Node.js release changes `node:fs` or
`node:fs/promises` execution behavior, event-loop or threadpool scheduling,
`AbortSignal` support, or `process` lifecycle rules for `'exit'` and signal
listeners, or when observed failures expose a missing execution-model boundary
or interleaving hazard.

## Default to `node:fs/promises` in long-lived processes

Node.js runs JavaScript on a single event-loop thread. Synchronous `*Sync`
methods such as `readdirSync`, `readFileSync`, `writeFileSync`, `unlinkSync`,
`mkdirSync`, and `realpathSync` block that thread—and all other JavaScript
execution—until the operating-system call finishes. In long-lived processes such
as HTTP or WebSocket servers, background workers, schedulers, and daemons,
blocking the event loop delays process readiness, stalls concurrent requests,
and postpones health checks, heartbeats, and scheduled timers.

Use `node:fs/promises` by default for runtime filesystem operations in
long-lived processes, including single-step reads and writes as well as
multi-step cleanup or directory scans. `node:fs/promises` executes standard
filesystem work off the event-loop thread on Node.js's background threadpool,
composes naturally with `async`/`await` and `try`/`catch`, supports explicit
`FileHandle` cleanup (`await using` or `close()`), and accepts an `AbortSignal`
for cancellable work. Do not copy legacy `*Sync` patterns from adjacent helpers
into readiness, request, or background paths.

Because `node:fs/promises` shares Node.js's finite libuv threadpool with
other background operations (such as DNS lookups and some cryptographic or
compression calls), issuing an unbounded burst of concurrent filesystem
operations can saturate the pool and delay unrelated I/O. Bound high-fanout
directory traversals or batch file work to fit the workload rather than starting
unlimited unthrottled operations.

## Restrict synchronous calls to justified boundaries

Synchronous `*Sync` calls are appropriate only in two distinct categories, with
different justifications:

1. **Required synchronous boundaries where the event loop cannot be awaited:**
   - **Pre-async bootstrap:** Minimal initialization required before
     asynchronous listeners, error hooks, or server endpoints are attached—or
     when an initialization contract cannot `await` Promises during synchronous
     setup (such as creating an initial log directory or reading a tiny
     bootstrap flag before fatal handlers attach, as opposed to scanning
     accumulated files or parsing large payloads). Keep only that minimal step
     synchronous and move subsequent directory scans, reading, or cleanup onto
     `node:fs/promises` (or top-level `await` in ES modules once hooks are
     ready).
   - **Synchronous `'exit'` listeners and immediate fatal teardown:** Node.js
     [`'exit'` event listeners](https://nodejs.org/api/process.html#event-exit)
     must run only synchronous operations because the process exits immediately
     after those listeners return and abandons any queued event-loop work or
     unresolved Promises. Teardown code that invokes `process.exit()`
     immediately shares that synchronous-only constraint.
2. **Permissible sequential scripts with no concurrency or cancellation need:**
   - **Standalone short-lived CLI tools or one-shot build/install scripts:**
     Blocking the single execution thread carries no readiness or concurrent-request
     cost when the script runs strictly sequentially from start to finish. Switch
     to `node:fs/promises` if the script runs concurrent operations, updates
     interactive UI/timers, or needs `AbortSignal` cancellation.

Do not group POSIX signal listeners (`SIGINT`, `SIGTERM`) with `'exit'`
listeners by default. Node.js dispatches signal events asynchronously while the
event loop is still active, so graceful-shutdown handlers can await
`node:fs/promises` cleanup before exiting unless they terminate immediately.

Also avoid choosing `*Sync` under the assumption that synchronous calls are
needed for filesystem atomicity. Filesystem-level atomic primitives—such as
exclusive creation (`O_CREAT | O_EXCL`) or atomic `rename`—work through
`node:fs/promises` just as through `*Sync`. Synchronous calls prevent only
_in-process JavaScript_ interleaving across `await` points; in a long-lived
server, prevent in-process overlap through explicit coordination instead of
blocking the event loop.

## Coordinate overlapping asynchronous work

Replacing `*Sync` directory processing with `node:fs/promises` introduces
`await` suspension points between steps such as listing a directory, reading
entries, and unlinking processed files. While one asynchronous run is suspended,
a timer, retry, request handler, or startup task in the same process can begin a
second run over the same directory, causing duplicate work, spurious `ENOENT`
races, or partial state.

When multiple invocations or callers can target the same directory, serialize or
coordinate those scans and mutations under an explicit
[overlapping-mutation admission contract](../software-design/overlapping-mutation-admission.md)
(for example, per-directory serialization, queueing, or skipping redundant work).
Remember that both `*Sync` calls and in-process JavaScript locks coordinate only
one Node.js process; they do not exclude concurrent mutations by external
processes.

For example, when a long-lived server starts up, creating a required directory
synchronously (`mkdirSync`) during top-level bootstrap before fatal/error hooks
attach keeps that pre-hook step synchronous, while reading and deleting
accumulated leftover files afterward via `node:fs/promises` under per-directory
serialization keeps server readiness non-blocking and prevents overlapping scans.

## References

- [Node.js file system documentation](https://nodejs.org/api/fs.html)
- [Node.js process `'exit'` and signal events](https://nodejs.org/api/process.html#event-exit)
