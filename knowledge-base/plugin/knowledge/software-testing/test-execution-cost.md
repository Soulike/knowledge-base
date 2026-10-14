# Test execution cost

## Scope

This document defines framework-independent principles for measuring and
reducing automated-test runtime or resource cost without weakening behavioral
protection or execution trust.

## When to update

Update this document when real test-performance work exposes a missing
measurement distinction, comparability requirement, cost owner, isolation
constraint, or proof needed to accept a test-cost reduction.

## Define the cost being compared

"Faster" is not one metric. Distinguish wall-clock duration, summed worker time,
CPU, memory, process or container use, and external-service consumption. Within
an execution, separate import or compilation, environment creation, setup,
hooks, test bodies, cleanup, and external-process work when the runner exposes
them.

A large test count does not identify the bottleneck. Attribute cost by test,
file, fixture, environment, shard, or lifecycle phase so a small number of
hotspots cannot hide inside an aggregate.

## Require comparable evidence

Control and candidate measurements must use exact source revisions and
comparable dependencies, toolchains, runner configuration, concurrency,
hardware class, and relevant environment. Choose warm-up, sample count,
stopping rule, and aggregate before measuring noisy work.

Interleave or randomize control and candidate runs when the environment may
drift. Report distributions or repeated aggregates rather than selecting a
single favorable run. A nondeterministic execution must first satisfy
[Trustworthy test execution](trustworthy-test-execution.md); otherwise timing
differences cannot be attributed to the proposed change.

Local measurements support claims about the measured environment. Do not
project them onto CI hardware, another platform, or another concurrency model
without corresponding evidence.

## Diagnose the cost owner

Separate required production work from test-only work. Honest latency at a real
integration seam is a product opportunity, not automatically test waste.
Avoidable polling, repeated environment creation, over-broad fixtures,
unnecessary compilation, duplicated setup, and idle waits can belong to the
test system.

Before changing a test, identify the behavior, assertions, real collaborators,
and isolation boundary that must remain intact. Apply
[Test effectiveness](test-effectiveness.md) when a proposed reduction changes
coverage, assertions, ownership, doubles, or test inventory.

## Separate journey phases by their evidence

Before optimizing a slow integration or end-to-end test, divide its journey
into precondition and state establishment, the protected transition, observation
and assertions, and cleanup. For each phase, identify the named fault it can
expose or the later evidence it only supports. Review expensive boundary
crossings and repeated phases rather than inferring cost from test length or
count alone.

Establish supporting preconditions through the least expensive stable seam
that preserves the relevant contract. An application API or fixture can replace
UI navigation when that navigation is only setup. Keep the setup path when its
routing, validation, persistence, hydration, or other wiring participates in
the fault. A fixture's type correctness alone does not establish that it
preserves those semantics. Keep the production collaborators and observable
outcomes needed by the protected transition and its assertions.

Match interaction fidelity to the protection. Exercise keyboard, pointer,
drag-and-drop, focus, or popup mechanics when the mechanism or its integration
with the resulting action is part of the contract. Otherwise use a stable
direct operation and retain distinct mechanism coverage at its owning seam.
Invoking an internal callback is not a substitute when event delivery or
cross-boundary wiring is what the test protects.

Synchronization changes must preserve the production completion path the test
is intended to exercise. Apply
[Trustworthy test execution](trustworthy-test-execution.md#synchronize-on-evidence)
to timers, polling, fallbacks, wake signals, and lifecycle barriers; reaching
the same final state through a different path can discard protection.

## Repeat only the phases a matrix dimension can change

Treat theme, viewport, locale, role, platform, and input mechanism as candidate
dimensions. Establish which phases and interactions each dimension can change
before multiplying a costly journey across its values. Presentation settings
can alter composition or lifecycle, roles can alter authorization, and locale
or platform can alter behavior. Their names alone do not establish independence.

When a dimension changes only presentation, protect the business transition in
a representative composed case and exercise the presentation matrix against
immutable or independently recreated established state. Keep the actual
renderer and any hydration or lifecycle behavior required by those assertions.
Repeat an affected transition for dimensions that can change its behavior or
integration, and retain combinations that expose distinct interaction faults.
Use [Test effectiveness](test-effectiveness.md) to decide which combinations
provide independent protection rather than requiring an exhaustive product.

For example, a response card is checked in two themes and at desktop and mobile
widths. If those settings cannot alter submission or completion, one composed
case can establish that transition while independently recreated response state
supports the four presentation cases. A supporting setting can be established
through the real application API, and a focused keyboard case can protect
selection reachability. If the mobile composition changes recipient selection,
submission, or completion, retain that affected composed transition at the
mobile width. Sharing the output of a live test with later cases would instead
create an ordering dependency.

## Preserve isolation while sharing cost

Batching or reusing an external process, database, filesystem, container, or
fixture is safe only when each test retains private mutable inputs, outputs, and
cleanup. Shared construction may reduce setup cost, but shared mutable state can
turn the saving into order dependence or flakiness.

Keep a real process, transport, database, or filesystem when it is part of the
owned contract. Replacing an effective integration test with a fast mock of
itself reduces cost by discarding evidence.

## Prove the reduction

Compare the same metric and aggregate before and after the change. Report
separate effects on test-body work, worker time, wall clock, and other measured
resources when they differ. A valid reduction also preserves the named
behavioral protection and the completeness, outcome integrity, and controlled
execution required to trust the result.

Removing actions, waits, or repeated transitions establishes which work was
eliminated. Passing cases support only their exercised protection. Neither
establishes a runtime improvement or its size without a comparable measurement;
report unmeasured savings as an expected cost reduction.

## References

- [Playwright API testing: establish server-side preconditions](https://playwright.dev/docs/api-testing)
- [Playwright best practices: test isolation](https://playwright.dev/docs/best-practices#make-tests-as-isolated-as-possible)
