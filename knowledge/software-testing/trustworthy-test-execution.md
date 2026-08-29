# Trustworthy test execution

## Scope

This document defines framework-independent principles for deciding whether an
automated-test result is complete, honest, and comparable across test design,
harnesses, runners, and CI.

## When to update

Update this document when a recurring omission, false pass, dishonest skip,
intermittent outcome, runner change, fixture leak, clock interaction, platform
difference, or timeout exposes a missing condition for trusting test execution.

## Trust the result only when three invariants hold

An automated-test result is trustworthy only when:

1. **Completeness:** every intended test and supporting static gate ran.
2. **Outcome integrity:** pass, fail, and skip represent their declared states;
   retries, selectors, and probes do not hide failures.
3. **Controlled execution:** the inputs that can change the result are owned or
   recorded well enough for relevant executions to be compared.

A green command without these properties is evidence about the command, not
necessarily about the behavior it was intended to protect.

## Prove intended validation ran

Discovery should follow stable project conventions rather than a hand-maintained
list that must change for every new location. An unexpectedly empty target must
fail closed; an intentionally empty target needs an explicit, reviewable
exception.

The same rule applies to compilers, linters, coverage tools, and other supporting
gates. Verify collection at each relevant boundary rather than inferring it from
a filename or directory.

When discovery changes, use reported test identities or a temporary failing
sentinel to distinguish "not run" from "passed." Remove the sentinel after the
check. A runner or discovery migration must compare expected and collected
identities in both directions. Equal counts are insufficient because one
omission and one accidental inclusion can cancel each other.

Collection equivalence alone does not establish migration equivalence. Result
and skip outcomes, lifecycle hooks, cleanup, environment restoration,
scheduling, concurrency, isolation, and every affected project-declared
entrypoint can also change semantics.

## Keep pass, fail, and skip honest

An applicability guard may skip coverage only while a declared optional
prerequisite is genuinely absent. Once the suite applies, failure to start,
query, authenticate with, or health-check a present dependency is a failure, not
an unsupported environment. Keep applicability detection separate from
execution so a probe cannot convert a broken dependency into a skip.

A selector that maps changed inputs to tests, shards, platforms, or validation
must broaden to conservative validation when its comparison base is incomplete
or an input is unknown. Represent classifier failure separately from an
intentional empty selection, and do not let an aggregator collapse either into
the same successful skip.

Retries can reduce transient disruption, but they do not make a nondeterministic
test correct. Diagnose with retries disabled when supported. When retries cannot
be disabled, retain every attempt's outcome; an aggregate pass can conceal the
same failure before and after a proposed repair.

## Synchronize on evidence

A fixed sleep treats elapsed time as proof. It is slow when work finishes early
and unreliable when the environment is loaded. Synchronize on evidence that
establishes the awaited fact:

| Awaited fact                                     | Reliable evidence                                                                                            |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| A positive event or state change                 | Await or poll the observable condition with a diagnostic timeout.                                            |
| Absence of an event                              | Wait for a barrier proving the triggering input was processed, then assert absence.                          |
| Time-driven behavior such as debounce or backoff | Advance a controlled clock and flush asynchronous work between clock steps.                                  |
| A coarse timestamp or version                    | Establish a deterministic older precondition, reread the baseline, then perform the action.                  |
| The delay itself is the contract                 | Observe the trigger, then measure from it with an explicit interval rationale and adequate diagnostic bound. |

A polling condition must imply the assertion that follows. Waiting for one call
before asserting exactly three races an intermediate state. Negative assertions
need an ordering guarantee, acknowledgement, queue drain, lifecycle event, or
other barrier proving that an incorrect event would already have occurred.

## Own execution inputs

Give each test private mutable state. Do not read or mutate a developer's
settings, credentials, home directory, running services, repository inventory,
or global process manager unless that environment is the subject. Register
cleanup at the lifecycle boundary that creates a resource and exercise it on
success and failure.

Shared fixtures are safe only when shared state is immutable and every test gets
an independent mutable copy or a reset with a proven boundary. Order dependence,
accumulated records, cached module state, and cleanup visible to another test are
isolation defects even when they save time.

Run-level state is not worker-local state. Derive worker-local paths and
identifiers inside each worker and establish them before application imports can
cache shared configuration.

Use controlled clocks for behavior defined by time, advance them through
asynchronous APIs when queued work must settle, and always restore the real
clock. Keep real I/O and framework polling outside the controlled-clock scope
when they depend on real timers.

Treat supported platforms as separate environments. Accidental path spelling,
shell behavior, permissions, process trees, timestamp resolution, and case
sensitivity are execution inputs, not portable constants. For filesystem
namespace races, use the forced-interleaving techniques in
[Pathnames and filesystem resource identity](../filesystems/pathnames-and-resource-identity.md).

## Establish intermittent evidence

Bind an intermittent outcome to an exact revision, command, failure signature,
platform, concurrency, retry policy, and relevant environment. Prefer a bounded
perturbation that amplifies the suspected mechanism over unfocused repetition,
and restore every affected clock, resource setting, environment value, process,
and fixture on every exit.

A protocol that cannot reproduce the failure can narrow hypotheses but does not
establish a cause. Compare pre- and post-change executions using the same
relevant conditions and record when a pre-change sample is unavailable.

A timeout is a diagnostic bound, not evidence that an awaited condition is
ready. Increase one only when valuable behavior is protected, the real
integration seam is already minimal, no production or harness defect explains
the delay, avoidable setup work is absent, and measurements show a bounded
runtime distribution beyond the existing limit. Keep the override local and
leave enough margin for failure propagation and cleanup.
