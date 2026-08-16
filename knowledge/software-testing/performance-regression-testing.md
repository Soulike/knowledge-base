# Performance regression testing

## Scope

This document explains how to turn a performance expectation into stable regression evidence and how to interpret test-suite cost without weakening functional coverage, including mechanism-based complexity guards, structural performance invariants, wall-clock fallbacks, noise-aware measurement, and suite-cost decomposition.

## When to update

Update this document when evidence from performance regressions, measurement noise, runtime instrumentation, or suite optimization changes which observable mechanisms provide reliable guards, how timing fallbacks should be interpreted, or how coverage-preserving cost reductions are demonstrated.

## Name the performance contract

“Fast” is not a testable property until the failure is named. Distinguish among algorithmic growth, bounded work, maximum concurrency, request or allocation counts, latency, throughput, memory use, and an external service-level objective. The guard should observe the narrowest property that makes the regression a defect.

Keep functional correctness beside the performance property. A function that returns early with an empty result can satisfy every work-count or latency threshold while being completely broken.

## Prefer mechanism over elapsed time

When the problematic work is observable, count it instead of timing it. Candidate signals include collection reads, comparisons, database queries, network calls, allocations, queue depth, rendered nodes, and concurrent operations. These signals are determined primarily by the implementation and input, rather than by the current machine's load.

Compare work across deliberately scaled inputs. Doubling input size gives a useful separation: linear work approaches a factor of two, while quadratic work approaches four after fixed costs become small. Choose input sizes and a threshold with margin for constant terms and expected algorithms such as linearithmic growth. Instrumentation must observe the mechanism that could regress; counting reads of one collection cannot detect repeated string copying, layout thrash, or hidden work elsewhere.

Some performance contracts are better expressed structurally than through a single count. A lazy loader can assert that invisible items trigger no fetches, in-flight work never exceeds a cap, a rejection releases its slot, and every requested item is eventually handled. These invariants identify the failure more precisely than a duration threshold.

## Mutation-check the guard

Temporarily restore or simulate the inefficient implementation and confirm that the guard fails by a wide margin. A guard that has never gone red may observe the wrong mechanism, use inputs that are too small, or set a threshold the defect can satisfy.

Restore the efficient implementation and verify both the performance property and the functional result. Record the mutation and observed separation when future maintainers will otherwise be unable to distinguish a safety margin from an arbitrary number.

## Use wall-clock evidence as a fallback

Timing is sometimes the only way to cover the public path, especially when relevant work occurs inside a runtime, parser primitive, renderer, or external process that cannot be instrumented. Prefer scaling behavior over a single absolute deadline: measure several geometrically increasing input sizes and estimate how runtime grows. A complexity slope or growth ratio can separate linear from quadratic behavior even when absolute duration varies.

Reduce avoidable noise by preparing inputs outside the timed region, warming the runtime, batching operations above timer resolution, repeating samples, using a robust aggregate such as a median, and recording the environment. Set the threshold between the expected and defective classes with a demonstrated margin, not just above the fastest observed good run.

Shared runners can still produce false failures and false confidence. Keep a noisy timing harness advisory when a deterministic inner guard covers the main risk. Make wall-clock evidence merge-blocking only when the execution environment is controlled enough, the threshold represents a real contract, and the cost of false positives is accepted. An absolute limit is appropriate for an actual latency objective; it is a poor proxy for algorithmic complexity.

## Diagnose suite cost before optimizing

Separate import or compilation, environment construction, setup, hooks, test bodies, cleanup, and external process cost. Total test count rarely identifies the bottleneck: a small number of files or fixtures can dominate a large suite. Profile the distribution and start with measured hotspots.

Distinguish test overhead from honest production behavior. A test that waits for a real health poll may reveal product startup latency; changing production to make the test faster is a product decision. Fixed sleeps, repeatedly rebuilt identical fixtures, unnecessary heavyweight environments, and accidental access to external tools are test costs.

Compare representative before-and-after runs under the same conditions and report medians or another stated aggregate. Choose the warm-up, sample count, stopping rule, and aggregate before inspecting the result. When machine load or another environmental factor can drift over time, interleave or randomize control and candidate runs instead of measuring every control run first.

Compare historical implementations from isolated clean revisions or immutable exact-revision artifacts, never from a working tree whose dependencies or generated state can bleed between versions. Record the source revision, dependency and toolchain versions, runner configuration, concurrency, and relevant execution environment so the comparison can be reproduced or its limits understood. Keep the measurement basis explicit: summed worker CPU, per-file duration, and wall-clock duration answer different questions and their percentages are not interchangeable.

## Preserve protection while reducing cost

Optimize how the precondition is reached, not what the test proves. Replace clock guesses with conditions or controlled time, keep real components that define the contract, and share only immutable fixture construction while preserving private mutable state.

Delete or merge a slow test only when the marginal-coverage and mutation criteria in [Test effectiveness](test-effectiveness.md) establish that it has no unique protection or no live contract. Slowness does not create an additional mutation prerequisite or justify weaker evidence. After synchronization, fixture, environment, or concurrency changes, repeat the affected tests with retries disabled and under representative load. A faster green run is insufficient when the changed test can no longer fail for its named defect.
