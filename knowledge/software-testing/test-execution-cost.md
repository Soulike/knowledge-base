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
