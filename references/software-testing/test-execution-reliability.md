# Reliable test execution

## Scope

This reference supports workflow steps that make automated test results reproducible and honest across frameworks.

## When to update

Update this document when a recurring test failure, silent omission, selector or runner behavior, concurrency mechanism, clock interaction, fixture leak, or platform difference exposes a reliability condition not covered by the current discovery, conditional-selection, synchronization, isolation, or retry principles.

## A test that does not run protects nothing

A green command is meaningful only if the intended tests were discovered and executed. Discovery should follow stable conventions recursively rather than a hand-maintained list that must be updated for every new location. A run that unexpectedly discovers zero tests should fail closed; an intentionally empty target needs an explicit, reviewable exception.

The same principle applies to supporting static analysis. A test outside the compiler, linter, or coverage tool's inputs may execute while silently escaping another required gate. Verify collection at each relevant boundary instead of inferring it from filename or location.

When discovery changes, prove it with a sentinel that must fail if collected, inspect the runner's reported inventory, or use another mechanism that distinguishes “not run” from “passed.” Remove the sentinel immediately after the check.

For a runner or discovery migration, derive the expected test inventory from the project's authoritative naming and location rules, collect the runner's actual test identities or paths, and compare the two sets in both directions. Report missing and unexpected tests separately. Equal counts are insufficient because one omission and one accidental inclusion can cancel each other.

Collection equivalence is necessary but insufficient for a runner or framework migration. Preserve and compare the baseline result and skip outcomes, lifecycle hooks, cleanup and environment restoration, scheduling and concurrency, isolation semantics, and every project-declared entrypoint that must execute the affected inventory. Account for any intentional semantic change separately from the mechanical migration.

An availability guard may skip coverage only while at least one declared optional applicability prerequisite is genuinely absent. Define those predicates separately, including required executable, configuration, or credential presence. Once every applicability predicate says the suite applies, failures to start a dependency, query its required version, authenticate with the provided configuration, or pass a required health check are test failures rather than reasons to skip. Keep applicability detection separate from execution so a probe cannot turn a present-but-broken dependency into an apparently unsupported environment.

## Make conditional validation fail safe

A selector that maps changed inputs to tests, shards, platforms, or other validation is part of the validation boundary. It may reduce validation only when both the changed-input set and the mapping are reliable. A missing or incomplete comparison base and an unknown or unmapped input must broaden to the conservative full or default validation rather than produce an empty selection.

Represent classification outcome separately from test outcome. An intentional empty selection can be a valid, reviewable skip; classifier or selector failure, cancellation, and invalid or malformed output must block or trigger the conservative fallback. A downstream aggregator must not collapse either failure disposition into the same successful skip.

Keep the mapping in an executable authoritative source and exercise known affected, known unaffected, high-fan-out or global, mixed, and unknown inputs. Verify both the run path and the legitimate skip path so a selector cannot silently reduce required validation when its assumptions drift.

## Synchronize on evidence

A fixed sleep used to “give the system time” treats elapsed time as proof. It is slow when the operation finishes early and flaky when the machine is loaded. Classify the awaited fact and synchronize on evidence that establishes it:

| Awaited fact                                     | Reliable evidence                                                                                                |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| A positive event or state change                 | Poll or await the observable condition with a diagnostic timeout.                                                |
| Absence of an event                              | Wait for a separate barrier that proves the triggering input has been fully processed, then assert absence.      |
| Time-driven behavior such as debounce or backoff | Advance a controlled clock and flush asynchronous work between clock steps.                                      |
| A coarse-resolution timestamp or version         | Establish a deterministic older precondition, reread the baseline, then perform the action.                      |
| The delay itself is the contract                 | First observe the trigger, then wait from the specified interval with an explicit rationale and adequate bounds. |

A polling condition must imply the assertion that follows. Waiting for one call before asserting exactly three races an intermediate state; wait until at least three calls are observable, then assert the exact contract.

A negative assertion has no positive condition of its own. Use an ordering guarantee, acknowledgement, queue drain, lifecycle event, or other barrier showing that an incorrect event would already have occurred. The barrier also serves as the positive control that the setup made progress.

## Scope controlled clocks narrowly

Use a fake or virtual clock for production logic whose behavior is defined by time. Advance it through asynchronous APIs when promises or queued work must settle between ticks, and restore the real clock even when the test fails.

Clock replacement can also intercept framework polling, real sockets, process supervision, or unrelated library timers. Keep setup and real I/O on a real clock when necessary, install the controlled clock only around the timed behavior, and return to real time before invoking incompatible helpers. A faster conversion is valid only if every original behavioral assertion remains meaningful.

## Own mutable state and the environment

Build the smallest fixture that names the relevant branches and give each test private mutable state. Do not read or mutate a developer's settings, credentials, home directory, running services, repository inventory, or global process manager unless that environment is explicitly the subject. Register teardown for owned temporary fixtures at the same lifecycle boundary that creates them, and clean them up on both success and failure.

Shared fixture construction is safe only when the shared object is immutable and each test receives an independent mutable copy or reset with a proven boundary. Order dependence, accumulated branches or records, cached module state, and cleanup that another test can observe are isolation defects even if they save time.

Run-level state is not worker-local state. Derive mutable worker-local paths and identifiers inside each worker from that worker's identity, then establish them before application modules can read or cache shared configuration. Keep this early setup free of application imports that could capture the pre-isolation state.

Treat supported platforms as separate environments. Keep fixtures and assertions independent of accidental path spelling, separators, shell rules, permissions, process trees, timestamp resolution, and case sensitivity. When a platform-specific behavior is intentional, isolate it behind an explicit condition and exercise it on that platform rather than weakening all assertions.

For filesystem namespace races, apply the forced-interleaving techniques in [Pathnames and filesystem resource identity](../../knowledge/filesystems/pathnames-and-resource-identity.md) instead of relying on probabilistic concurrency.

## Keep nondeterminism visible

Retries can reduce transient CI disruption, but they do not make a nondeterministic test correct. An unexplained retry turns the first failure into hidden evidence and can absorb future defects in the same scope. During flake diagnosis or after changing synchronization, run representative tests with retries disabled and repeat them under the concurrency that exposed the problem.

Do not respond to an ordering or shared-state race by increasing an unrelated timeout. Correlate responses by identity or type, isolate mutable state, and establish the missing happens-before relationship. Varying failure locations across repeated runs often indicate leaked global state or an over-broad fixture rather than several independent product defects.

Runner concurrency is an environmental input, not a universal constant. Choose it from measured resource constraints and the target execution environment. A formula that has opposite effects on developer and CI machines is not self-justifying; verify its actual result on both.
