# Resource-aware concurrency for type-aware ESLint

## Scope

This document guides the choice and diagnosis of ESLint worker-thread concurrency for type-aware linting under runtime and memory constraints. It relates worker selection to typed-analysis cost, V8 heap pressure, process memory, and the execution environment so that a faster lint command remains reliable within its resource budget.

## When to update

Update this document when ESLint changes its concurrency options or worker behavior, typescript-eslint changes the cost or scope of type analysis, Node.js changes relevant worker or memory semantics, or observed CI workloads expose a missing resource distinction or validation condition.

## Treat worker count as a resource decision

For ESLint versions with multithread linting, `--concurrency=off` runs linting in the main thread and is the default. A positive numeric value requests a bounded worker count; `auto` selects concurrency from CPU availability and the number of files. This is a throughput heuristic, not a memory budget. Benchmark `off` as the no-worker baseline, even when the current command uses `auto`.

Each worker has initialization and runtime costs. Configuration, parsers, plugins, and type-aware TypeScript analysis can hold substantial state in workers, so adding workers may increase aggregate memory faster than it reduces elapsed time. The exact effect depends on the files and project scopes assigned to workers. Too many workers can also spend more time initializing than they save in linting.

Distinguish a V8 old-space limit from process resident set size (RSS). `--max-old-space-size` bounds the old-memory section of a V8 isolate; it is not a cap on the whole process. Worker threads have separate V8 heaps, while process RSS includes their resident memory along with native allocations and other process state. In Node.js, `process.memoryUsage().rss` covers the process, but its heap fields describe only the calling thread. A process can therefore have RSS well above a configured old-space limit without contradicting that limit. Diagnose a V8 heap exhaustion message separately from a runner or container memory kill.

## Compare candidates where lint actually runs

Compare `off` with a small set of explicit numeric values on the intended execution environment. Keep the source revision, linted file set, dependencies, Node.js and tool versions, ESLint configuration, heap setting, cache state, and relevant runner resources comparable. Decide warm-up and sample count before measuring noisy runs, and record repeated outcomes rather than selecting the fastest successful attempt.

For each candidate, record elapsed time, CPU time (or note when it cannot be measured), peak process RSS, heap pressure or exhaustion, and both the failure count and total run count. Measure enough to see whether a speed improvement consumes the runner's memory margin. `auto` can choose differently when available CPUs or file counts differ, and even the same fixed count can behave differently under another operating system, memory limit, or scheduler. Local results cannot establish a safe CI setting; measure on the target runner and verify the complete required CI lint path. When failures are intermittent, repeat that full path; one passing run does not establish that the failure is gone.

## Respond to memory pressure without hiding it

When lint approaches a heap or runner limit, compare `off` with the lowest fixed concurrency that meets the relevant runtime need while retaining measured memory margin. Single-threaded linting can be the right choice when its added time is acceptable, especially when lint is not on the critical path. A fixed worker count can be justified when repeated target-environment measurements show both useful time savings and adequate margin. Do not prescribe one count or performance ratio for every project.

Before enlarging the heap, check for duplicate lint work, unexpectedly broad TypeScript project inclusion, build artifacts included in analysis, and expensive type-checking work. Reproduce under the intended heap setting and identify whether the failure is V8 heap exhaustion in the main thread or a worker, or aggregate process or runner pressure. Increase the old-space limit only when the affected V8 isolate's working set requires it after reasonable scope and cost improvements, the runner has enough total memory, and comparable full-path runs confirm the tradeoff. If RSS or the runner limit is the binding constraint, raising the V8 allowance alone can make the failure worse.

## References

- [ESLint: New in v9.34.0: Multithread Linting](https://eslint.org/blog/2025/08/multithread-linting/)
- [ESLint: Command Line Interface Reference](https://eslint.org/docs/latest/use/command-line-interface)
- [typescript-eslint: Performance](https://typescript-eslint.io/troubleshooting/typed-linting/performance/)
- [Node.js: Command-line API](https://nodejs.org/api/cli.html)
- [Node.js: Process](https://nodejs.org/api/process.html)
- [Node.js: Worker threads](https://nodejs.org/api/worker_threads.html)
