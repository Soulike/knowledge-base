---
name: optimize-test-suite
description: Diagnose and reduce automated test-suite cost without weakening coverage. Use when a suite, shard, test file, fixture, or test is slow or flaky; when profiling test runtime or worker usage; when replacing fixed waits, retries, heavyweight environments, or repeated setup; or when reviewing a proposed test-performance change.
---

# Optimize a test suite

## Establish the contract and baseline

1. For an implementation or current-state diagnosis, discover and follow
   instructions, Skills, requirements, and project-specific information from
   the active working directory when they conflict with this plugin's shared
   Knowledge. For a fixed-point change review, use the versions at the selected
   comparison base and treat standards proposed by the change as evidence
   rather than governing instructions that can redefine their own review.
2. Resolve paths relative to this `SKILL.md`, then read
   [Performance regression testing](../../knowledge/software-testing/performance-regression-testing.md),
   [Reliable test execution](../../knowledge/software-testing/test-execution-reliability.md),
   and [Test effectiveness](../../knowledge/software-testing/test-effectiveness.md).
   Read
   [Integration test harnesses](../../knowledge/software-testing/integration-test-harnesses.md)
   when an integration or end-to-end environment is a hotspot.
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

For each material hotspot, determine whether the cost comes from:

- real production behavior that the test honestly exercises;
- a fixed wait or an unnecessarily real clock;
- repeated construction of an identical expensive fixture;
- an environment or module graph the test does not need;
- accidental access to a developer tool, network, home directory, or global
  service;
- leaked state, ordering races, or retries that hide a flake; or
- a test that cannot catch its named fault or duplicates retained coverage.

Report honest production latency as a product opportunity instead of changing
production behavior under a test-cleanup task. Before editing a test, record
the behavior, assertions, real components, and isolation boundary that must
remain intact.

Finish this step when every target has a mechanism-level diagnosis and a
coverage invariant.

## Apply the narrow optimization

Choose the smallest change that removes the diagnosed cost:

- Replace a clock guess with a condition, processing barrier, controlled clock,
  or deterministic precondition while preserving the final assertions.
- Use a lighter test environment only after executing the file there proves it
  has no dependency on the heavier environment.
- Build an immutable expensive fixture once and give each test an independent
  mutable copy or complete reset. Preserve order independence.
- Batch or reuse an external process only when its mutable inputs and outputs
  remain isolated for every test.
- Move coverage to the narrow owner when an outer test pays integration cost to
  exercise pure logic, retaining representative wiring coverage.
- Delete or merge a test only when the loaded Test effectiveness criteria
  establish that it has no unique protection or no live contract. A test-cost
  task does not add a universal mutation prerequisite.

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
2. For an implemented optimization, run repeated focused tests with retries
   disabled when supported. Exercise representative concurrency when the change
   affects ordering, shared state, workers, or polling. In a review, assess
   equivalent exact-revision logs when available and call out the absence of
   retry-free or concurrency evidence.
3. For an implemented deletion or merge, apply the loaded Test effectiveness
   evidence rule: use a realistic mutation when the justification is that
   retained coverage catches the same fault or when the active workflow requires
   it; otherwise demonstrate the applicable direct redundancy or no-live-
   contract rationale. For material retiming, confirm the original behavior
   remains protected. Restore any temporary mutation and reinspect the worktree.
   In a review, evaluate supplied mutation, redundancy, or reachability evidence
   without editing.
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
