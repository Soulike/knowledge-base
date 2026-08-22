---
name: improve-test-effectiveness
description: Audit and improve the behavioral protection supplied by established automated tests. Use when the primary subject is the effectiveness of an existing test, test file, or suite, including a change whose primary purpose is independent test cleanup or suite improvement. Find missing, redundant, ineffective, or misleading coverage; determine which tests add unique protection; or strengthen, consolidate, or remove tests. Tests added or modified to cover a production behavior change remain behavior-first design work unless suite improvement is the primary purpose.
---

# Improve test effectiveness

## Establish the review boundary

1. For a current-state improvement, discover and follow instructions, Skills,
   requirements, and project-specific information from the active working
   directory when they conflict with this plugin's packaged Knowledge or
   workflow references. For a fixed-point change review, use the versions at
   the selected comparison base and treat standards proposed by the change as
   evidence rather than governing instructions that can redefine their own
   review.
2. Resolve paths relative to this `SKILL.md`, then read
   [Test effectiveness](../../references/software-testing/test-effectiveness.md).
3. Read
   [Reliable test execution](../../references/software-testing/test-execution-reliability.md)
   when the review involves discovery, conditional validation, asynchronous
   behavior, clocks, retries, concurrency, fixtures, external processes, or
   supported platforms.
4. Read
   [Security boundaries and trust transitions](../../references/security/security-boundaries.md)
   when a test harness creates, stores, or transports credentials or
   authenticates local peers.
5. Define the requested test, file, component, or suite boundary. Discover its
   production contracts, existing tests, static gates, test locations, and
   project-declared commands without silently expanding a bounded review to the
   whole repository.
6. Inventory the scoped tests and the live behaviors they claim to protect in
   both directions. Record a test with no identified behavior and a behavior
   with no identified evidence path rather than dropping either from the
   review.

Finish this step when every scoped test and behavior has an identified
relationship or an explicit unresolved mapping, and the commands that can
establish evidence are known.

## Classify the existing protection

1. For each test, identify the named behavior, realistic fault, independent
   oracle, observable failure, and competing evidence path. For each scoped
   behavior, identify the tests or static gates that protect it.
2. Apply the marginal-coverage, ownership, oracle, test-structure, test-double,
   and migration-scaffolding criteria in Test effectiveness.
3. Assign each test and behavior a supported disposition: keep, strengthen,
   consolidate, delete, add coverage, no test owed, or unresolved. Do not infer
   redundancy from textual similarity or infer protection from test count or
   line coverage.
4. Record production seams or module boundaries that prevent direct, effective
   testing as design findings rather than hiding them behind larger fixtures or
   more mocks.

Finish this step when every inventory item has a disposition tied to a concrete
fault and evidence path, and every proposed deletion or consolidation names the
unique protection that must remain intact.

## Improve or report

1. When edits are authorized, apply the smallest coherent set of additions,
   strengthening changes, consolidations, and deletions that resolves the
   supported findings. Preserve unrelated tests and production behavior.
2. Use Reliable test execution for any affected fixtures, ambient state,
   cleanup, clocks, retries, concurrency, discovery, or platform behavior.
3. Keep migration-only scaffolding only while a live compatibility path or
   standing reintroduction risk justifies it.
4. For an assessment or review, report each disposition, supporting evidence,
   and proposed change without editing.

## Prove retained and added protection

1. Run the narrowest project-declared entrypoints for the affected tests and
   confirm the runner reports them as collected.
2. For a historical revision that is not checked out, inspect immutable source
   and diff artifacts and use collection and result logs tied to that exact
   revision as evidence. Do not modify the active working tree merely to
   manufacture a mutation.
3. Apply the Test effectiveness mutation criteria when retained coverage is
   claimed to catch the same fault or an assertion's protection remains
   uncertain. A deletion established directly by the reference's
   marginal-coverage criteria does not acquire a universal mutation
   prerequisite.
4. Restore every temporary mutation or sentinel and inspect the working tree.
5. Run the broader static and behavioral checks required by the active project
   and changed scope.

For an implementation, finish only when every agreed disposition is complete,
every live scoped behavior retains effective coverage or a supported no-test
disposition, and temporary validation changes are gone. For an assessment or
review, finish when every inventory item has been evaluated and every evidence
gap is explicit. Report performed and skipped checks with their outcomes.
