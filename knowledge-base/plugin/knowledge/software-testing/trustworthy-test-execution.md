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

Before each wait, poll, follow-up action, or assertion, name the exact fact the
next step requires and accept a barrier only when observing it implies that
fact. Evidence for one completion phase does not establish a later or unrelated
phase. A response establishes that a reply was observed, while a URL assertion
establishes only the asserted address condition. A rendered or accessible-state
assertion establishes its asserted view condition at that observation point; it
does not by itself establish unrelated hydration, effects, persistence, or
background work. A local state change does not establish persistence, and a
process-start signal does not establish service readiness. Observe an
acknowledgement owned by the required phase, such as the persistence result, a
read through the persistence owner, or the process's declared readiness
interface. Treat exit before readiness as failure. Do not bridge phases with a
fixed delay or an unrelated request.

Before replacing a fixed wait or eventual-condition poll, identify the
production completion path that the existing test actually reaches. The same
observable end state can result from a primary event and a timeout, polling,
watchdog, or compatibility fallback. A new synchronization mechanism that
forces a different path can preserve the final assertion while discarding the
old path's protection. Apply
[Test effectiveness](test-effectiveness.md) to give independently implemented
completion paths separate coverage dispositions, retaining each only when it
catches a distinct live fault.

Synchronize a retained path on evidence specific to that path. When its elapsed
duration is contractual and its timer can be controlled safely, advance a
controlled clock and observe the state immediately before and at the boundary;
use a path-specific temporary mutation when the protected branch remains
ambiguous. For example, an eventual-removal test
in a harness that never emits `animationend` can be exercising a 400 ms timeout
fallback. Dispatching `animationend` makes the test faster but stops protecting
that fallback, while a controlled-clock test that observes presence through
399 ms and removal at 400 ms preserves the boundary without paying real elapsed
time.

A polling condition must imply the assertion that follows. Waiting for one call
before asserting exactly three races an intermediate state. Negative assertions
need an ordering guarantee, acknowledgement, queue drain, lifecycle event, or
other barrier proving that an incorrect event would already have occurred.

### Choose time control for the protected contract

Distinguish a contractual duration, an operation's timeout completion path,
and a diagnostic deadline that bounds test execution. If elapsed duration is
part of the protected contract, retain evidence for that interval and boundary.
When only the timeout path is protected, the production duration can instead be
operational policy; exercising that path need not pay the default interval.

Use a controlled clock when it can safely drive the relevant production timer.
Flush asynchronous work between clock steps, and establish the real I/O phase
on which the timeout depends before advancing time. Real sockets, streams,
processes, and framework polling can depend on real time even when an
application timer is controlled. Advancing one clock does not establish
progress on another. Mixed clocks are usable only when the intended path,
required phase barriers, and resource settlement remain observable without
clock interference.

When controlled time cannot safely exercise a retained real-I/O timeout path,
use a shorter nonzero duration at the boundary that owns the timeout policy.
Reuse an existing configuration or construction seam where possible; expose a
missing policy seam at its owner rather than adding test-only switches across
callers. Keep the production default unchanged and execute the real operation
and timeout handler. Protect default selection or the original duration
separately when either is a requirement; a short-policy case does not establish
them.

Select the shorter value through bounded focused executions and the owning
aggregate under relevant concurrency and load. Leave enough margin to establish
the intended I/O phase reliably, and keep the governing diagnostic deadline
large enough for timeout propagation, settlement, and applicable cleanup. No
duration is universally suitable. Apply [Test execution cost](test-execution-cost.md)
to comparable measurements; reducing one case's wait does not establish a
reduction in the complete suite's wall-clock duration.

Assert evidence specific to the timeout path, its outcome, the contract-required
attempt count, and any forbidden retry or side effect. A timeout result or
cancellation request does not establish that owned work stopped. Observe the
operation's true completion and resource-settlement boundaries before cleanup
or asserting that no later effect can occur. Use a path-specific temporary
mutation when the same outcome could conceal a different completion path.

For example, a client has a long production response timeout and must return an
unconfirmed result without retrying when its peer remains silent. Keep a real
loopback server that receives the request and sends no response. Use a shorter
request policy, prove receipt occurred before timeout, observe the real timeout
outcome and one attempt, and confirm request and server resources have settled
before cleanup. An immediate synthetic error bypasses the silent-peer path;
timeout before receipt can instead test connection establishment. Neither
establishes the intended response-timeout protection.

## Own execution inputs

Give each test private mutable state. Do not read or mutate a developer's
settings, credentials, home directory, running services, repository inventory,
or global process manager unless that environment is the subject. Register
cleanup at the lifecycle boundary that creates a resource. The lifecycle owner
that creates mutable state also owns the actors that can continue reading or
writing it and the cleanup required to return it to the declared baseline.

Shared fixtures are safe only when shared state is immutable and every test gets
an independent mutable copy or a reset with a proven boundary. Order dependence,
accumulated records, cached module state, and cleanup visible to another test are
isolation defects even when they save time.

Run-level state is not worker-local state. Derive worker-local paths and
identifiers inside each worker and establish them before application imports can
cache shared configuration.

Treat every real process, shell, browser, database, filesystem, transport, and
remote operation as an execution input when it can change scheduling or the
result. Account for the complete fan-out, including command lookup, interpreter
startup, subprocesses launched by doubles, environment or repository setup, and
cleanup. A double placed at an external seam should not start another
interpreter, service, or remote operation unless that behavior participates in
the protected contract. Apply [Test effectiveness](test-effectiveness.md) to
decide which detailed cases must cross the external seam and which
representative seam cases add distinct protection. Apply
[Test execution cost](test-execution-cost.md) when measuring or reducing the
resulting runtime or resource cost.

Before deleting or reusing mutable state, stop, cancel, or await every owned
writer, watcher, socket, request, timer, and child process that can still use it.
Cancellation is complete only when the actor cannot later commit into the old
or reused namespace. After those actors have settled, use bounded
platform-supported retry only for documented transient cleanup failures; retry
does not repair an active-writer race.

Exercise cleanup after setup failure, assertion failure, timeout, and success
when those paths can leave owned state. Preserve the primary failure when
cleanup also fails, retain the cleanup failure as secondary diagnostic evidence,
and verify that the resource is absent or that the declared baseline is
observable before another test reuses its owner or name.

Always restore the real clock after using a controlled clock.

Treat supported platforms as separate environments. Accidental path spelling,
shell behavior, permissions, process trees, timestamp resolution, and case
sensitivity are execution inputs, not portable constants. When a test claims
to verify a host utility, interpreter, filesystem, or process behavior on a
supported platform, exercise the production integration path with the real
component on that platform and the supported interpreter version. A fake
command, injected platform value, alternate shell, or modeled error can test
application-owned decisions, but cannot establish the host behavior it
replaces. If that platform is unavailable, report its behavior as unverified
instead of writing a simulated-platform test and treating its pass as platform
evidence. For filesystem namespace races, use the forced-interleaving
techniques in
[Pathnames and filesystem resource identity](../filesystems/pathnames-and-resource-identity.md).

## Treat timeout retries as overlapping executions

A timeout, abort result, or wrapper rejection that can settle independently of
the underlying body establishes only that the runner stopped waiting. It does
not by itself establish that the test body or any writer, request, timer,
process, or external operation started by that attempt has settled. A test-body
`finally` block is likewise not a runner completion barrier: the runner can
begin hooks or return control while the original body continues toward that
block independently.

Apply the attempt's ownership boundary before a hook restores shared state,
another case reuses it, or a retry starts. Request cancellation when the
operation supports it, then await evidence that every attempt-owned actor can
no longer read or mutate the prior state. Treat a completion signal as a
barrier only when it represents the effects and cleanup on which the caller
relies.

When another attempt can start before that boundary, model the attempts as
concurrent executions. Inventory every process singleton, environment value,
fixture, namespace, process, port, file, database, remote operation, and
external side effect that both can reach. Account for an earlier attempt that
publishes a late result, performs late cleanup, or deletes or overwrites state
already claimed by the replacement. Attempt-private mutable state is isolated
only when the previous attempt can no longer reach it.

Disable same-case retry when settlement cannot be established before the next
attempt. This removes that retry path, but it does not stop the timed-out work
or make hooks and later cases safe. When the runner cannot prevent continued
same-worker execution until quiescence, replace the attempt only after
terminating and confirming an isolation boundary that contains every relevant
actor and effect. A worker or process exit does not settle detached descendants,
server-side or remote work, or durable effects outside that boundary.

When a test retry can repeat a state-changing operation whose effects survive
the caller's timeout or disconnection, apply
[Overlapping mutation admission](../software-design/overlapping-mutation-admission.md)
at the effect-owning boundary. The operation still needs an applicable
idempotency, conditional-mutation, ownership, or stale-execution contract.

An ordinary failure can be retried sequentially when the attempt's true
completion boundary has settled and cleanup has restored the declared
baseline.

## Establish intermittent evidence

Bind an intermittent outcome to an exact revision, command, failure signature,
platform, concurrency, retry policy, and relevant environment. Prefer a bounded
perturbation that amplifies the suspected mechanism over unfocused repetition,
and restore every affected clock, resource setting, environment value, process,
and fixture on every exit.

A focused green run establishes only that the selected command passed once
under the observed conditions; it does not establish which completion path
produced the result. Match additional proof to execution inputs that can change
the result. For a multi-phase transition, force or observe the ordering that
distinguishes success from the reported failure. For a cleanup race, control the
writer or process lifecycle around cleanup. For a process- or shell-heavy
change, run the focused target with retries disabled when supported and the
owning aggregate under its normal concurrency; exercise the relevant supported
platform or disclose the gap.

For a cold-start claim, name the owner that must be fresh, such as the browser
context, client load, server process, data root, persisted cache, or module
state, and recreate that boundary in the comparison. Warm repetition is
supporting evidence after the mechanism is understood; it does not substitute
for reproducing the relevant cold or adverse condition.

A protocol that cannot reproduce the failure can narrow hypotheses but does not
establish a cause. Compare pre- and post-change executions using the same
relevant conditions and record when a pre-change sample is unavailable.

## Budget diagnostic deadline hierarchies

A diagnostic timeout bounds an awaited condition or test execution; it does not
establish readiness or make elapsed time the protected behavior. Increase one only
when valuable behavior is protected, the real integration seam is
already minimal, no production or harness defect explains the delay, avoidable
setup work is absent, and measurements show a bounded runtime distribution
beyond the existing limit. Keep an override local.

Map every effective timeout, including defaults and overrides, to the exact
lifecycle phases that its runner or operation governs. A test-body deadline can
exclude hooks or teardown, while a worker, suite, fixture, or run deadline can
impose another outer bound. Treat a deadline as outer only for the phases that
its documented lifecycle covers.

For each governing outer deadline, calculate the longest reachable wall-clock
path through its phases. Sum the maximum relevant bounds of sequential work.
For concurrent work, use the longest reachable critical path only when the
operations actually overlap under their dependencies, runner scheduling, and
resource constraints. Account for command discovery and startup, setup,
reachable retries and retry delays, failure propagation, cancellation, process
or resource settlement, and cleanup when they consume that same budget. Use the
longest reachable alternative rather than summing mutually exclusive paths.

An inner deadline being numerically lower than an outer deadline is
insufficient when several bounded operations can run sequentially. When an
inner failure is intended to provide the useful diagnostic, its governing outer
deadline must leave time for that failure to occur and propagate and for owned
work to settle or cancel before applicable cleanup. This numeric hierarchy is
necessary but not sufficient: timer delivery can be late, and an expired
timeout, abort request, or sent termination signal does not establish resource
settlement.

Prefer asynchronous, cancellable APIs for test-owned operations that may block
on a process, service, transport, filesystem, or other external resource, and
await completion or confirmed cancellation before cleanup. Short deterministic
synchronous work does not require conversion merely because it is synchronous.
Do not assume that a runner deadline can preempt longer synchronous blocking
work: when enforcement depends on the same execution thread, the runner cannot
act until that work returns or yields, and the resulting pass, failure, or
delayed timeout is runner-specific. When synchronous behavior belongs to the
protected contract, retain a representative case with an operation-level
enforceable bound, or isolate it behind a worker or process that an independent
watchdog can terminate before the test confirms settlement.

A deliberately enforced performance deadline is a separate behavior contract.
Establish its requirement through [Test effectiveness](test-effectiveness.md)
and apply [Test execution cost](test-execution-cost.md) to its measurements and
comparisons instead of treating it as diagnostic margin.
