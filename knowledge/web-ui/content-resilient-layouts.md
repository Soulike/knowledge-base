# Content-resilient web layouts

## Scope

This document explains how web interfaces preserve usable layout and access to
required information when valid content and available rendering space vary.

## When to update

Update when CSS sizing or overflow semantics, HTML disclosure semantics, or
accessible-name and accessibility requirements change the guidance, or when
evidence about text rendering, information access, or realistic content-dependent
failures reveals a missing case within this scope.

## Treat content and available space as joint state

An accepted data contract defines possible content, not its rendered dimensions.
A character-count limit cannot establish pixel width: fonts, glyphs, casing,
spacing, and wrapping opportunities affect the space text needs. Translation can
change both width and height, and no one script is always the widest. The W3C's
[text-size guidance](https://www.w3.org/International/articles/article-text-size)
explains these localization effects.

Derive a content envelope from the values the interface admits. Include ordinary
content and adverse valid cases relevant to its layout: long labels, unbroken
identifiers or paths, and localized or mixed-script text where supported. Account
for icons, indicators, adjacent actions, padding, and nested indentation that
compete for the same space. A layout repair should accommodate the accepted
contract; shortening that contract requires a separate product decision.

Pair content with the presentation that must hold it. A narrow viewport with a
short label and a spacious layout with a long label can both pass while their
constrained combination fails. Examine each materially different presentation,
such as an expanded rail and a collapsed flyout, at the relevant constrained
width or height. Include text enlargement, font changes, spacing overrides, and
text direction when they can expose a distinct supported failure. A narrow
viewport alone does not establish behavior under text resizing or spacing
changes; WCAG treats [resizing](https://www.w3.org/TR/WCAG22/#resize-text),
[reflow](https://www.w3.org/TR/WCAG22/#reflow), and
[text spacing](https://www.w3.org/TR/WCAG22/#text-spacing) as distinct criteria.

Use a small set of reachable combinations that challenge different assumptions.
Apply [fault-revealing scenario selection](../software-testing/test-effectiveness.md#select-fault-revealing-scenarios)
by combining adverse valid content with constrained space and retaining an
ordinary working case as a control. An exhaustive product of viewport sizes,
languages, fonts, and states is unnecessary when those combinations expose the
same fault.

## Constrain the boundaries that determine layout

Trace available space from the viewport or owning surface through the floating
container or panel, row or grid track, interactive control and adjacent actions,
text container, and rendered content. Identify which boundaries can grow or
resist shrinking and decide their sizing and overflow behavior. This is an
inspection model, not a requirement to add minimums and maximums to every wrapper.

Several mechanisms can make a locally plausible treatment incomplete:

- A flex item's automatic minimum can be content-based on its main axis,
  depending on its computed overflow and other size constraints. Inspect the
  item that must shrink. An explicit zero minimum on the appropriate axis, such
  as `min-inline-size: 0` for a horizontal row label, is one possible remedy;
  it does not decide how the remaining content should be presented. See
  [Flexbox automatic minimum sizing](https://www.w3.org/TR/css-flexbox-1/#min-size-auto).
- A bare `1fr` grid track has an automatic minimum. An intentional
  `minmax(0, 1fr)` track can remove that floor, while the grid item's minimum and
  content overflow still need consideration. See
  [grid track sizing](https://www.w3.org/TR/css-grid-2/#track-sizes).
- A popup can exceed its available space even when a child has a maximum width
  and ellipsis. Its own size must account for padding, indentation, and adjacent
  controls. A size cap also does not establish correct placement: the popup may
  still cross a viewport edge because of its anchor or positioning context.

`text-overflow: ellipsis` controls the rendering of overflowing inline content
in a block container whose overflow is not visible; it does not itself constrain
the container or its ancestors, or prevent wrapping. The
[overflow specification](https://www.w3.org/TR/css-overflow-3/#text-overflow)
explicitly separates ellipsis rendering from layout. Choose the outer size and
placement, allow the appropriate descendants to shrink, and select a treatment
for the resulting content space.

For example, a menu's label may already be clipped to its own maximum while the
label, indentation, icons, and actions together require more space than the
viewport provides. Further shortening the label is insufficient evidence of a
repair: the composed menu and its usable controls must fit the intended surface.

## Preserve meaning when choosing a presentation

Choose wrapping, responsive restructuring, resizing, truncation, or deliberate
scrolling according to the user's task. Explanatory text that must be read before
an action usually benefits from wrapping or more space. A compact item label may
be truncated when users can still identify the item and inspect its full value
when needed. Preserve distinguishing context where practical; many identical
visible prefixes can make a contained list unusable.

Visual containment, accessible naming, and access to the complete value are
separate contracts. For an item whose full value identifies the action or
destination, preserve and verify the complete accessible name. CSS-only ellipsis
normally retains the full name when the control is named from its unchanged DOM
text, but role-specific rules, hidden content, or an overriding naming source
can change that result. Follow the
[accessible-name computation](https://www.w3.org/TR/accname-1.2/#computation-steps)
instead of assuming a separate `aria-label` is required. When supplying a name,
retain the visible label wording as required by
[Label in Name](https://www.w3.org/TR/WCAG22/#label-in-name).

A complete accessible name does not let every sighted keyboard or touch user
inspect visually shortened content. Provide an input-appropriate way to reveal
essential full values, and check its discoverability and operation for the
supported input and assistive-technology paths. The HTML
[`title` attribute](https://html.spec.whatwg.org/multipage/dom.html#the-title-attribute)
provides advisory information and may supplement that mechanism. Keep it
optional, and establish access on the required paths before relying on a
disclosure. A title or tooltip available only through pointing cannot be the
sole carrier of essential information.

## Verify the rendered and semantic outcomes

Choose an environment by what the claim requires. Semantic tests can establish
computed names, roles, states, and interaction wiring. Font measurement,
intrinsic sizing, popup placement, clipping, and composed responsive layout need
a real rendering engine. A component test can run in a real browser; layout
evidence does not automatically require a full application E2E journey. Add a
representative composed journey when the fault depends on application wiring or
presentation that the narrower environment cannot exercise.

Use [independent oracles](../software-testing/test-effectiveness.md#use-an-independent-oracle)
for the required outcome rather than asserting only a selected CSS class or
attribute. Check the complete relevant bounds against the owning surface, the
visibility and usability of adjacent controls, and client versus scroll
dimensions where they describe the intended overflow policy. Partial viewport
intersection does not prove containment. Conversely, a deliberately truncated
label can correctly have a scroll width larger than its client width; that
alone is not a defect.

Screenshots can detect paint and appearance regressions. Use geometry assertions
for specific containment thresholds and semantic or interaction assertions for
names, disclosure, and successful actions. Neither an attribute check nor an
accessibility-tree snapshot establishes actual assistive-technology behavior.
Validate the supported input and assistive-technology paths needed by the claim,
and state which environments and cases the observations cover.
