# Repair brittle hand-rolled component test harnesses and structural selectors

## Identity

- ID: brittle-test-harness-repair
- Kind: application

## Covered objects

- [Test review Workflow](../../SKILL.md)

## Protected behavior

When reviewing existing web UI component tests that fail after a minor
third-party UI library update and rely on hand-rolled mounting, global shims,
synthetic event plumbing, and internal CSS/DOM selectors, the Test review
Workflow must read the applicable testing Knowledge (including Web UI
accessible-semantics testing), avoid patching fragile custom harness plumbing
when a mature framework testing library is absent, and keep an unrelated
view-mocked unit test free of testing-library requirements.

## Task

Review these two existing tests in a read-only planning mode (do not edit files
or install packages):

1. `pagination.test.tsx`: Exercises a real stateful pagination and confirmation
   modal built with a third-party UI library. It currently mounts components
   with raw root-render/flush calls copied from another test, stubs
   `window.matchMedia` and `ResizeObserver` globally, dispatches raw synthetic
   `MouseEvent` instances, clicks `.ui-page-item-2`, and asserts `.ui-page-active`.
   It just broke after a minor UI library patch moved the click listener from
   the wrapper `<li>` to an inner `<a>`. The project manifest has no UI testing
   library installed.
2. `summary.test.tsx`: Tests a container's pure state formatting and mocks out
   the view layer with `mockView` using the same low-level root-render/flush
   primitives.

## Starting state

Supply the complete current [Test review Workflow](../../SKILL.md) and
read-only access to its linked canonical Knowledge and reference files. Assume
active project policy requires explicit user approval before adding any new
dependency, and keep the task read-only.

## Expected behavior

- R1 (critical): read `test-effectiveness.md`, `trustworthy-test-execution.md`,
  and `accessible-web-ui-testing.md` (and `dependency-supply-chain-security.md`
  for the library admission decision) before finalizing recommendations.
- R2 (critical): for `pagination.test.tsx`, diagnose both the brittle
  hand-rolled harness (mounting, global shims, synthetic events) and the
  external-dependency / structural CSS coupling (`.ui-page-item-2`,
  `.ui-page-active`), and propose evaluating an established framework testing
  library under `dependency-supply-chain-security.md` and active project
  approval policy rather than patching custom harness plumbing or moving the
  CSS selector to `.ui-page-item-2 > a`.
- R3 (critical): for `pagination.test.tsx`, replace structural selectors with
  accessible role/name queries and standard exposed semantic assertions (noting
  headless/semantic evidence limits for layout, pointer reachability, and
  keyboard/assistive-technology checks).
- R4 (critical): for `summary.test.tsx`, retain the isolated `mockView` pattern
  without requiring a UI testing-library dependency.

## Verification

Inspect files read, per-test dispositions, harness/dependency recommendations,
and selector/contract fixes separately for `pagination.test.tsx` and
`summary.test.tsx`. A faulty observation that patches the custom `dispatchEvent`
harness, moves the CSS selector to the inner `<a>` wrapper class, installs an
unapproved dependency, or forces a UI testing library onto `summary.test.tsx`
must fail the corresponding critical criterion.

## Source

GitHub issues #274, #275, and #276 require `workflow-review-and-improve-tests`
to avoid patching fragile custom component harnesses when a mature testing
library is missing and to route Web UI accessible-semantics testing and
external-dependency contract boundaries during test review.
