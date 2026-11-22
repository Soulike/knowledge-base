# Testing web user interfaces through accessible semantics

## Scope

This document defines how automated component and browser tests for web user
interfaces select queries, interactions, and assertions using user-perceivable
accessible semantics, the dual behavioral and accessibility protection those
semantics provide, and the verification boundaries between headless or
semantic-tree tests and visual layout, keyboard navigation, and
assistive-technology checks.

## When to update

Update this document when W3C web accessibility specifications, browser or
headless-DOM accessibility-tree engines, or web UI testing practice changes the
recommended semantic query priority, exposed role/name/state guarantees, or
evidence limits of automated UI tests.

## Query and interact through user-perceivable semantics

Choose test queries and interaction targets by how people and assistive
technologies perceive and identify elements on the page, rather than by internal
DOM structure or styling details:

1. **Accessible role and accessible name or label:** Prefer querying controls,
   landmarks, headings, form inputs, and semantic status regions (such as
   `role="status"` or `role="alert"`) by their semantic role paired with their
   accessible name, associated visible label, or semantic text (for example, a
   `button` named `Save` or a field labelled `Email`). This reflects both visual
   identification and the browser accessibility tree used by assistive
   technologies.
2. **Visible text, placeholder, or text alternative:** For non-interactive
   content or plain feedback without a distinguishing semantic role and name,
   or for images, query by visible user-facing text, `alt` text for informative
   images, or placeholder text only when no proper label exists.
3. **Explicit test hooks as a last resort:** Use an explicit test attribute
   (such as a dedicated test ID) only when no stable user-perceivable semantic
   exists, such as dynamically formatted values or structural containers that
   carry no semantic landmark. Before falling back to a test hook on an
   interactive control, verify that the missing role or accessible name is not
   an actual accessibility defect in the UI.

Avoid querying or asserting against internal DOM hierarchy, tag nesting,
positional selectors (`nth-child`), or CSS styling classes. Users do not perceive
or rely on those implementation details, so tests tied to them break on markup
refactors and external UI library updates without catching real user-facing
failures.

## Verify both behavior and exposed accessibility

Selecting and asserting through accessible semantics gives one test two forms of
protection:

- **Refactor resilience:** Interacting with controls by their semantic role,
  name, and visible state keeps tests passing across harmless DOM restructuring,
  wrapper changes, and styling updates.
- **Built-in accessibility verification:** Requiring a test to resolve a control
  by role and accessible name—and to assert standard exposed states such as
  `aria-current`, `aria-disabled`, `aria-expanded`, `aria-invalid`, checked or
  selected states, or accessible status regions—immediately fails if a control
  lacks an accessible name, uses a non-semantic element without an interactive
  role, or omits required state updates.

Structural CSS-class selectors silently pass even when interactive controls are
invisible to assistive technologies or lack accessible names.

## Recognize what semantic tests do not prove

Automated tests that run in a headless DOM or inspect the accessibility tree
verify specific DOM and semantic guarantees, not the complete user experience:

- **What they establish:** DOM presence, computed native or ARIA roles,
  accessible names and labels, semantic state transitions, and application logic
  or state changes triggered through those controls.
- **What they do not establish:**
  - **Visual presentation and layout resilience:** They do not prove visual
    visibility, color contrast, typography scaling, responsive reflow, absence
    of unintended truncation, or freedom from clipping and overlap. Verifying
    those properties requires a real browser rendering engine and visual or
    geometry checks.
  - **Unobscured pointer reachability:** Programmatic clicks or test-runner
    auto-scrolling in headless or simulated DOM environments can activate
    controls that are visually clipped, zero-sized, or covered by sticky bars or
    overlays.
  - **Keyboard and assistive-technology behavior:** Finding or clicking a node
    in the accessibility tree does not verify logical `Tab` focus order, focus
    visibility, absence of keyboard traps, or actual screen-reader announcements.
    Those require dedicated keyboard-driven browser exercises and testing with
    relevant assistive technologies.

Report green semantic or component tests accurately as verifying behavior and
exposed accessible semantics, while keeping layout, pointer reachability,
keyboard navigation, and assistive-technology conformance as separate checks.

## Example: semantic queries versus structural hooks

Suppose an automated test verifies page switching and item deletion with a
confirmation dialog in a paginated web view:

- **Structural-hook approach:** The test clicks `.pagination-item-2`, opens
  `.select-dropdown`, clicks `.popconfirm-primary-btn`, and asserts
  `.pagination-item-active`. Changing an internal wrapper class or moving a
  click listener between nested elements breaks the test, while removing the
  button's `aria-label` or `aria-current` state still lets the test pass.
- **Accessible-semantics approach:** The test activates `role="button"` with
  accessible name `"Page 2"`, selects from `role="combobox"` named `"Page Size"`,
  confirms via `role="button"` named `"OK"`, and asserts `aria-current="page"`
  on the active page button along with the updated visible list items. This
  protects both application behavior and exposed control semantics, while
  explicitly leaving overflow/clipping resilience and keyboard `Tab` focus
  traversal to separate real-browser visual and keyboard checks.

## Sources

- [W3C Accessible Name and Description Computation 1.2](https://www.w3.org/TR/accname-1.2/)
- [W3C WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [Testing Library: About Queries — Priority](https://testing-library.com/docs/queries/about/#priority)
- [Playwright: Locators](https://playwright.dev/docs/locators)
