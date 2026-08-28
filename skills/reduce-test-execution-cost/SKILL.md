---
name: reduce-test-execution-cost
description: Diagnose and reduce automated test runtime or resource cost without weakening coverage or reliability. Use when profiling a slow or resource-heavy suite, shard, file, fixture, or test; reducing heavyweight environments, repeated setup, or unnecessary waits; or reviewing a test-performance change. Establish reproducible scoped execution before comparing costs; when execution is flaky or nondeterministic, reliability is the primary concern.
---

# Reduce test execution cost

## Establish the cost contract and baseline

1. For an implementation or current-state diagnosis, discover and follow
   instructions, Skills, requirements, and project-specific information from
   the active working directory when they conflict with this plugin's packaged
   Knowledge or workflow references. For a fixed-point change review, use the
   versions at the selected comparison base and treat standards proposed by the
   change as evidence rather than governing instructions that can redefine
   their own review.
2. Resolve paths relative to this `SKILL.md`, then read
   [Reliable test execution](../../knowledge/software-testing/reliable-test-execution.md).
3. Read
   [Test effectiveness](../../references/software-testing/test-effectiveness.md)
   only when the proposed or reviewed work changes coverage, assertions, test
   ownership, or doubles, or deletes or consolidates tests.
4. Discover the subject revision's runner configuration, test commands, retry
   policy, concurrency, environments, and reporting capabilities. For a change
   review, keep proposed configuration distinct from the governing rules at the
   comparison base.
5. Choose the evidence mode. For an authorized implementation, reproduce a
   representative baseline before editing. For a diagnostic or review-only
   request, inspect supplied measurements and immutable artifacts and collect
   only permitted read-only evidence; identify what was observed directly,
   reproduced locally, or not established.
6. Preserve a representative baseline when measuring. Separate wall-clock
   duration from summed worker time and, where available, import or compilation,
   environment, setup, hooks, test bodies, cleanup, and external-process cost.
7. Before measuring noisy work, choose the warm-up, sample count, stopping rule,
   and aggregate. Interleave or randomize control and candidate runs when the
   environment may drift. Profile the distribution by file or fixture so a
   large test count does not hide a small set of hotspots.
8. For a historical comparison, use isolated clean revisions or immutable
   exact-revision artifacts. Record source revisions, dependency and toolchain
   versions, runner configuration, concurrency, and relevant execution
   environment.

Finish this step when the bottleneck is measured, reproducible enough to
compare, and tied to a stated cost basis, or when a review identifies the
specific evidence needed to establish those properties. When nondeterminism
would invalidate the baseline, first establish a stable scoped execution
contract and repeatable results using Reliable test execution; begin the cost
comparison only after that evidence exists.

## Classify each hotspot

For each material hotspot, apply Reliable test execution to determine whether
the cost belongs to required production behavior, test execution or isolation,
or fixture or environment setup. If the candidate reduction would change
coverage, assertions, test ownership, or doubles, or delete or consolidate
tests, load and apply Test effectiveness before deciding.

Report honest production latency as a product opportunity instead of changing
production behavior under a test-cost task. Before editing a test, record the
behavior, assertions, real components, and isolation boundary that must remain
intact.

Finish this step when every target has a mechanism-level diagnosis and a
coverage and reliability invariant.

## Reduce the diagnosed cost

Choose the smallest change that removes the diagnosed cost. Use Reliable test
execution for synchronization, clocks, mutable-state ownership, fixtures,
environment isolation, retries, and concurrency. When the change affects
coverage, assertions, test ownership, or doubles, or deletes or consolidates
tests, use Test effectiveness for those decisions.

Prove that a lighter environment does not remove a required dependency. Batch
or reuse an external process only after defining how every test retains private
mutable inputs, outputs, and cleanup.

Keep real processes, databases, filesystems, or transports when they are the
contract. Do not trade a slow but effective test for a fast mock of itself.

When the request is diagnostic or review-only, do not edit. Continue to the
reporting step using the supplied and permitted read-only evidence; report
which comparisons or protection checks would still be needed before a proposed
cost reduction could be accepted.

## Demonstrate or assess the result

1. For an implemented reduction, run the focused target before and after under
   comparable conditions and report the same metric and aggregate. For a
   review, evaluate whether the available evidence satisfies this comparison
   and report missing evidence without representing it as a failed
   reproduction.
2. Apply Reliable test execution to retry, concurrency, ordering, shared-state,
   worker, polling, or fixture changes. In a review, assess exact-revision
   evidence and report what is missing.
3. Apply Test effectiveness to changes in coverage, assertions, ownership, or
   doubles and to deletion or consolidation. Restore temporary mutations and
   reinspect the working tree. In a review, evaluate supplied evidence without
   editing.
4. For an implemented reduction, run the broader project-declared suite and
   static checks required by the changed scope. In a review, inspect
   exact-revision results when available. In either mode, distinguish a relevant
   failure from a pre-existing or environmental failure.
5. Report separate effects on test-body work, worker time, wall clock, and other
   measured resources when those differ. State environmental limits and avoid
   projecting a local-only saving onto other platforms or CI hardware.

For an implementation, finish only when the coverage and reliability invariants
still hold, temporary mutations are gone, and the comparison uses an honest
measurement basis. For a diagnosis or review, finish when the available
evidence has been assessed without overstating it and every validation gap is
reported.
