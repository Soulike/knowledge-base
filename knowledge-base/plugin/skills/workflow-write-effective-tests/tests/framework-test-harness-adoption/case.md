# Adopt mature framework testing infrastructure instead of hand-rolling harnesses

## Identity

- ID: framework-test-harness-adoption
- Kind: application

## Covered objects

- [Effective-test writing Workflow](../../SKILL.md)

## Protected behavior

When tests must drive real framework-managed UI controls and no mature
framework testing library is installed, the Effective-test writing Workflow
must not extrapolate raw primitives from a view-mocked unit test into a
hand-rolled DOM mounting, global-shim, and synthetic event harness. Pure logic
or view-mocked unit tests must remain free of unnecessary testing-library
installations.

## Task

Handle these two independent requests in a read-only planning mode (do not edit
files or install packages):

1. Add automated component tests for our stateful pagination and confirmation
   popover UI using the real third-party UI controls. The project's dependency
   manifest declares the UI framework and the third-party UI library, but no UI
   testing library. The only existing test in the repository mocks out the view
   layer and mounts the container directly using the framework's low-level
   root-render and flush primitives. Propose the test setup and next steps.
2. Add a unit test for our pure `formatTotal` helper and a new view-mocked
   container test that follows the same existing `mockView` isolation pattern.

## Starting state

Supply the complete current [Effective-test writing Workflow](../../SKILL.md)
and read-only access to its linked canonical Knowledge and reference files.
Assume active project policy requires explicit user approval before adding any
new dependency, and keep the task read-only.

## Expected behavior

- R1 (critical): for request 1, distinguish the existing view-mocked test's
  low-level primitives from tests driving real framework-managed controls, and
  do not propose hand-rolling custom DOM mounting, global environment shims, or
  synthetic event-dispatching harnesses.
- R2 (critical): for request 1, treat adopting the ecosystem's mature framework
  testing library as a dependency-admission decision evaluated against current
  authoritative sources and supply-chain security criteria, requiring user
  approval under active project dependency policy before adding the
  test-scoped dependency.
- R3: for request 1, apply Web UI accessible-semantics testing and external
  dependency contract boundaries (avoiding internal wrapper/CSS selectors on
  the third-party UI controls).
- R4 (critical): for request 2, do not require installing a UI component testing
  library for the pure helper or intentionally view-mocked container test.

## Verification

Inspect the proposed setup, dependency decision, selector/contract guidance,
and read files for each independent request separately. A faulty observation
that copies low-level mount/act plumbing into a custom harness for request 1,
installs or assumes an unapproved dependency, or demands a UI testing library
for request 2 must fail the corresponding critical criterion.

## Source

GitHub issue #274 requires distinguishing view-mocked low-level test
primitives from real framework-component test harnesses and evaluating mature
framework testing libraries before hand-rolling custom plumbing.
