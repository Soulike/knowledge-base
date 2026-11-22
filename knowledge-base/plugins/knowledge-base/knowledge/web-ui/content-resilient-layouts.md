# Content-resilient web layouts

## Scope

This document explains the browser, CSS, and accessibility decisions that keep
web layouts and required information and actions usable across valid content,
viewport dimensions, and user text settings. It maps those outcomes to Web
mechanisms, applicable standards, and browser verification.

## When to update

Update when CSS sizing, overflow or text semantics, browser settings and
rendering behavior, HTML disclosure or accessible-name semantics, or Web
accessibility standards and their implementation guidance change these choices
or the evidence needed to verify them.

## Choose browser display and text conditions

Content, available space, and text presentation form the
[joint state of a resilient layout](../user-interface/layout-resilience.md#treat-content-space-and-text-presentation-as-joint-state).
In a browser, preserve access to necessary information and controls as each
changes. Pair difficult valid text or collection size with constrained space
and relevant text settings; separately passing each dimension does not establish
their combination.

Use available CSS viewport width and height rather than physical pixels or a
device name. Include narrow, wide, tall, and short presentations relevant to the
interface: desktop windows and portrait monitors, phones and tablets in both
orientations, and resized or split windows can supply different space. Choose
breakpoints from the layout's needs and test immediately around each meaningful
transition. Exercise resizing and orientation changes during a task, checking
input, selection, focus, and access to the next action.

Treat the following mechanisms separately:

| Mechanism                 | Relevant effect and verification                                                                                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Browser default font size | Changes the user-agent font-size baseline. Author-specified root or text sizes can prevent it from influencing the page. Check that representative text responds to the supported preference.           |
| Browser minimum font size | Can enlarge smaller text without scaling all text or font-relative container dimensions proportionally. Check the rendered text and surrounding layout together.                                        |
| Text-only resizing        | Enlarges text through a browser-specific facility while available layout space may remain different from full-page zoom. Exercise that facility where supported.                                        |
| Full-page zoom            | Changes presentation scale and the effective CSS space used for layout. Check text enlargement, reflow, breakpoints, and composed tasks at actual browser zoom settings.                                |
| OS text preferences       | Browser and platform support determine whether and how they affect Web content. Verify the supported mechanism on the target environment rather than assuming a system setting always changes the page. |

[Chrome's settings guidance](https://support.google.com/chrome/answer/96810?hl=en&co=GENIE.Platform%3DDesktop)
distinguishes font preferences and page zoom, and notes that some sites prevent
font preferences from taking effect.
[W3C's Resize Text guidance](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
identifies text-only resizing as a user-agent scaling mechanism. Safari's
[website-size control](https://support.apple.com/guide/iphone/customize-your-safari-settings-iphb3100d149/ios)
is documented as Page Zoom. These controls are evidence of distinct browser
facilities, not proof that the page honors every user preference.

## Preserve the user's text-size baseline

Prefer typography derived from the user's default size: preserve the root's
default font size, use suitable relative sizes, and allow text-bearing regions
to wrap or grow. Explicitly fixing the root to `16px` also fixes the basis of
`rem`; using `rem` elsewhere then does not restore the user's default. The
[font-size definition](https://www.w3.org/TR/css-fonts-3/#font-size-prop)
and [font-relative lengths](https://www.w3.org/TR/css-values-4/#font-relative-lengths)
explain these relationships. Inspect form-control fonts as well as surrounding
text; inheritance can be appropriate when controls should share the page's
type scale.

Font-relative dimensions help express relationships, but content must still
have room to grow. The
[font-relative sizing rules](https://www.w3.org/TR/css-values-4/#font-relative-lengths)
apply minimum-font restrictions to used sizes without changing the resolution
of font-relative lengths in properties. A container
with a fixed `rem` height can therefore clip text even when both use relative
units. Prefer content-driven heights or an intentional, usable scrolling region
and check the actual result.

Fluid typography needs a user-relative baseline and verification of its effective
enlargement. Pure viewport units can counteract zoom; W3C's
[F94](https://www.w3.org/WAI/WCAG22/Techniques/failures/F94) describes this failure
and its conditions. A mixed formula can respond to default font preferences
without increasing proportionally:

```css
.heading {
  font-size: clamp(1rem, 0.75rem + 1vw, 2rem);
}
```

At a fixed 800 CSS px width, root sizes of 16px and 32px yield 20px and 32px
for this example. The relative component is useful, but the formula alone does
not establish 200% text enlargement. Check bounds, media-query overrides, and
actual scaling throughout the supported range.

For OS text settings, evaluate supported mechanisms and their fallback.
[Chrome's OS text-scale guidance](https://developer.chrome.com/docs/modern-web-guidance/guides/accessibility/respect-os-text-scale)
describes opting in with `<meta name="text-scale" content="scale">`.
Its semantics are defined in the work-in-progress
[CSS Fonts Level 5](https://www.w3.org/TR/css-fonts-5/), and
[MDN's reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/text-scale)
explains changes to existing automatic text-sizing behavior. Check current
target-browser support and the maximum effective setting before adopting it.
On unsupported environments, continued manual zoom access does not establish
that the OS preference is being honored.

## Apply the display criteria separately

Use the relevant WCAG 2.2 AA criteria as a baseline, keeping their conditions and
exceptions distinct from broader engineering recommendations:

| Criterion                                                                             | Required outcome                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Resize Text, 1.4.4](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)    | Text can be enlarged without assistive technology up to 200% without loss of content or functionality, except captions and images of text. At least one supported scaling mechanism can satisfy this criterion; that does not establish support for every user text setting.                                                                 |
| [Reflow, 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)             | Ordinary vertically scrolling content works at an equivalent width of 320 CSS px, and horizontally scrolling content at an equivalent height of 256 CSS px, without loss or required scrolling in two dimensions. Content whose meaning or use requires a two-dimensional layout has an exception.                                           |
| [Orientation, 1.3.4](https://www.w3.org/WAI/WCAG22/Understanding/orientation.html)    | Viewing and operation are not restricted to one orientation unless that orientation is essential. Independently check usable layout at the resulting width and height.                                                                                                                                                                       |
| [Text Spacing, 1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) | Without changing other styles, overriding line height to 1.5 times font size, paragraph-after spacing to 2 times, letter spacing to 0.12 times, and word spacing to 0.16 times preserves content and functionality. Apply the relevant properties for the language and script. These are override conditions, not prescribed default styles. |

The Reflow conditions are not a universal 320 by 256 test rectangle. A viewport
starting at 1280 CSS px wide becomes equivalent to 320 CSS px at 400% page zoom;
text enlargement is a separate requirement. Maps or data tables can require
two-dimensional scrolling, but the exception does not automatically cover the
rest of the page or ordinary content within individual table cells. Keep such
scrolling local where practical and check surrounding content's reflow.

Respect relevant supported text preferences as an engineering goal in addition
to these minimum criteria. A narrow viewport does not replace a text-setting
test, and a successful zoom test does not establish default- or minimum-font
behavior. Apply spacing overrides simultaneously and to each materially
different responsive layout, as illustrated by
[C36](https://www.w3.org/WAI/WCAG22/Techniques/css/C36).

## Constrain CSS boundaries and preserve information access

Trace viewport or owning-surface space through the panel, row or track, control,
adjacent actions, and text. Inspect both size and placement, especially for
popups and fixed or sticky regions. In small or zoomed viewports, persistent
chrome may consume the space needed by the task; the
[Reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
recommends adapting those regions, such as using normal flow or an accessible
way to change their display.

Several CSS mechanisms can make a locally plausible repair incomplete:

- A flex item's automatic minimum can be content-based on its main axis,
  depending on overflow and other constraints. An explicit zero minimum on the
  axis that must shrink, such as `min-inline-size: 0` for a row label, is one
  possible remedy. It does not decide how remaining content is presented. See
  [Flexbox automatic minimum sizing](https://www.w3.org/TR/css-flexbox-1/#min-size-auto).
- A bare `1fr` grid track has an automatic minimum. An intentional
  `minmax(0, 1fr)` can remove that floor; the item minimum and content overflow
  still matter. See [grid track sizing](https://www.w3.org/TR/css-grid-2/#track-sizes).
- A popup needs room for its label, padding, indentation, icons, and actions.
  A child maximum or ellipsis does not cap the composed popup or keep its anchor
  placement inside the viewport.

`text-overflow: ellipsis` affects rendering in a block container whose overflow
is not visible. It does not itself constrain ancestors or prevent wrapping;
the [overflow specification](https://www.w3.org/TR/css-overflow-3/#text-overflow)
separates that rendering from layout. Choose the outer size and placement,
allow appropriate descendants to shrink, and use wrapping, restructuring,
truncation, or scrolling that preserves the required information and actions.

For growing collections, select a presentation that supports the task and keeps
the represented scope and any promised complete set accessible, applying the
[information-access model](../user-interface/layout-resilience.md#adapt-the-whole-surface-and-preserve-the-task).
For a deliberately bounded Web preview, establish which items inform the user's
current decision through
[user-centered information hierarchy](../user-interface/user-centered-information-hierarchy.md).
An accurate total and a usable route to remaining items preserve the preview's
promise. Use [pagination](https://design-system.service.gov.uk/components/pagination/)
when dividing the set improves usability or performance. For expand/collapse,
preserve state and follow the WAI-ARIA
[disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/).

Preserve the complete accessible name when it identifies an item's action or
destination. CSS-only ellipsis normally retains the full name when that name
comes from unchanged DOM text, but role-specific rules, hidden content, or an
overriding naming source can change it. Follow
[accessible-name computation](https://www.w3.org/TR/accname-1.2/#computation-steps)
and retain visible label wording as required by
[Label in Name](https://www.w3.org/TR/WCAG22/#label-in-name).

Sighted keyboard and touch users also need a usable way to inspect essential
visually shortened values. The HTML
[`title` attribute](https://html.spec.whatwg.org/multipage/dom.html#the-title-attribute)
is advisory and may supplement access, but a pointing-only title or tooltip
cannot be the sole carrier of essential information. Check discoverability and
operation on the required input and assistive-technology paths.

## Verify browser rendering and the actual task

Carry display and text conditions through design, testing, and review. In
design, establish how the page adapts and preserves required information and
controls. Test the chosen layouts and transitions with ordinary and adverse
valid content, constrained widths and heights, and relevant settings. In review,
compare the promised conditions with observed rendering and task results;
identify uncovered settings and environments before making a completion claim.

A semantic or component test can verify names, totals, ordering, roles, states,
disclosure, and a route to the complete set. Intrinsic sizing, fonts, composed
height, scrolling, clipping, popup placement, and responsive layout need a real
rendering engine. A component test can run in a browser; add an application
journey when wiring or surrounding presentation participates in the fault.

Use a supported browser setting or isolated profile for font-preference tests,
with a control showing that the preference actually took effect. Measure text
and containers; changing an author CSS value alone does not test the browser's
default- or minimum-font mechanism. Exercise actual zoom facilities where they
are the subject of the claim. A resized viewport, CSS zoom, or changed device
pixel ratio supplies different evidence and must be identified as such.

Check relevant full bounds against the owning surface, placement, adjacent
controls, and the intended overflow policy. Partial viewport intersection does
not establish containment or operation. Client and scroll dimensions can detect
unintended overflow, but a deliberately truncated label can legitimately have
scroll width larger than client width. For bounded collections, verify totals,
initial bounds and ordering, represented scope, complete-set access, and state
after disclosure, filtering, paging, or scrolling.

Use screenshots for appearance, geometry for specific bounds, and semantic and
interaction assertions for names and successful actions. Account for test-tool
automatic scrolling when investigating pointer reachability: establish whether
the user's supported path can expose and operate the control. An attribute or
browser accessibility-tree snapshot does not establish actual
assistive-technology behavior. Record browser and platform, CSS dimensions,
content, text and zoom settings, input paths, emulation, observed outcomes, and
coverage gaps. A default desktop screenshot or one successful setting cannot
establish the rest of the supported presentation.
