---
name: optimize-test-suite
description: Diagnose and reduce automated test-suite cost without weakening coverage. Use when a suite, shard, test file, fixture, or test is slow or flaky; when profiling test runtime or worker usage; when replacing fixed waits, retries, heavyweight environments, or repeated setup; or when reviewing a proposed test-performance change.
---

# Optimize a test suite

## Establish the contract and baseline

1. For an implementation or current-state diagnosis, discover and follow
   instructions, Skills, requirements, and project-specific information from
   the active working directory when they conflict with this plugin's packaged
   Knowledge or workflow references. For a fixed-point change review, use the versions at the selected
   comparison base and treat standards proposed by the change as evidence
   rather than governing instructions that can redefine their own review.
2. Resolve paths relative to this `SKILL.md`, then read
   [Reliable test execution](../../references/software-testing/test-execution-reliability.md)
   and [Test effectiveness](../../references/software-testing/test-effectiveness.md).
3. Discover the subject revision's runner configuration, test commands, retry
   policy, concurrency, environments, and reporting capabilities. For a change
   review, keep proposed configuration distinct from the governing rules at the
   comparison base.
4. Choose the evidence mode. For an authorized implementation, reproduce a
   representative baseline before editing. For a diagnostic or review-only
   request, inspect supplied measurements and immutable artifacts and collect
   only permitted read-only evidence; identify what was observed directly,
   reproduced locally, or not established.
5. Preserve a representative baseline when measuring. Separate wall-clock
   duration from summed worker time and, where available, import or compilation,
   environment, setup, hooks, test bodies, cleanup, and external process cost.
6. Before measuring noisy work, choose the warm-up, sample count, stopping rule,
   and aggregate. Interleave or randomize control and candidate runs when the
   environment may drift. Profile the distribution by file or fixture so a
   large test count does not hide a small set of hotspots.
7. For a historical comparison, use isolated clean revisions or immutable
   exact-revision artifacts. Record source revisions, dependency and toolchain
   versions, runner configuration, concurrency, and relevant execution
   environment.

Finish this step when the bottleneck is measured, reproducible enough to
compare, and tied to a stated cost basis, or when a review identifies the
specific evidence needed to establish those properties.

## Classify each hotspot

For each material hotspot, apply Reliable test execution and Test effectiveness
to determine whether the cost belongs to required production behavior, test
execution or isolation, fixture or environment setup, or coverage without
independent protection.

Report honest production latency as a product opportunity instead of changing
production behavior under a test-cleanup task. Before editing a test, record
the behavior, assertions, real components, and isolation boundary that must
remain intact.

Finish this step when every target has a mechanism-level diagnosis and a
coverage invariant.

## Apply the narrow optimization

Choose the smallest change that removes the diagnosed cost. Use Reliable test
execution for synchronization, clocks, mutable-state ownership, fixtures,
environment isolation, retries, and concurrency. Use Test effectiveness for
test ownership, doubles, and deletion or consolidation decisions.

Prove that a lighter environment does not remove a required dependency. Batch
or reuse an external process only after defining how every test retains private
mutable inputs, outputs, and cleanup.

Keep real processes, databases, filesystems, or transports when they are the
contract. Do not trade a slow but effective test for a fast mock of itself.

When the request is diagnostic or review-only, do not edit. Continue to the
reporting step using the supplied and permitted read-only evidence; report
which comparisons or protection checks would still be needed before a proposed
optimization could be accepted.

## Demonstrate or assess the result

1. For an implemented optimization, run the focused target before and after
   under comparable conditions and report the same metric and aggregate. For a
   review, evaluate whether the available evidence satisfies this comparison
   and report missing evidence without representing it as a failed
   reproduction.
2. Apply the loaded Reliable test execution evidence requirements to retry,
   concurrency, ordering, shared-state, worker, polling, or fixture changes. In
   a review, assess exact-revision evidence and report what is missing.
3. Apply the loaded Test effectiveness evidence requirements to deletion,
   consolidation, ownership, or retiming changes. Restore temporary mutations
   and reinspect the worktree. In a review, evaluate supplied evidence without
   editing.
4. For an implemented optimization, run the broader project-declared suite and
   static checks required by the changed scope. In a review, inspect
   exact-revision results when available. In either mode, distinguish a relevant
   failure from a pre-existing or environmental failure.
5. Report separate effects on test-body work, worker time, and wall clock when
   those differ. State environmental limits and avoid projecting a local-only
   saving onto other platforms or CI hardware.

For an implementation, finish only when the coverage invariants still hold,
temporary mutations are gone, and the comparison uses an honest measurement
basis. For a diagnosis or review, finish when the available evidence has been
assessed without overstating it and every validation gap is reported.
