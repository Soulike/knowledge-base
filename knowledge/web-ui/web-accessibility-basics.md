# Baseline accessibility for web interfaces

## Scope

This document explains the accessibility decisions to make while designing and
implementing a web interface, so people can perceive its content,
understand its structure and controls, operate its task paths, and recognize the
results through different input methods and assistive technologies. It uses
selected public standards as a practical starting point for web UI work and
explains how these semantics can aid Agent browser automation.

## When to update

Update when W3C web accessibility standards, their implementation guidance, or
evidence from browser, assistive-technology, or Agent automation tools changes
the requirements, implementation advice, or ways to verify these outcomes.

## Build access into the task path

Identify the important user tasks and the content, controls, errors, and results
they must reach. Make accessibility decisions while choosing page structure and
interaction behavior, then check the composed task path as it develops. Early
and repeated evaluation can catch barriers before they spread across an
interface; involving disabled users can reveal problems a standards evaluation
misses. See W3C's guidance on [evaluation throughout
development](https://www.w3.org/WAI/test-evaluate/) and [involving
users](https://www.w3.org/WAI/test-evaluate/involving-users/).

Consult the [WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/) to
identify applicable success criteria, while selecting the conformance target
required for the project. The decisions below cover frequent starting points,
not all of the criteria. A conformance claim must address the applicable
criteria across the relevant full pages and [complete
processes](https://www.w3.org/TR/WCAG22/#conformance-reqs), including task
steps outside an individual component.

## Express structure and purpose programmatically

Use native HTML elements whose purpose matches the action: a link for
navigation, a button for an action, and a labelled input for entered data.
Identify the page language; organize content with meaningful headings, lists,
and regions; and provide a way to bypass repeated navigation. These choices
support the requirements for [information and
relationships](https://www.w3.org/TR/WCAG22/#info-and-relationships),
[language](https://www.w3.org/TR/WCAG22/#language-of-page), [bypassing
blocks](https://www.w3.org/TR/WCAG22/#bypass-blocks), and [name, role, and
value](https://www.w3.org/TR/WCAG22/#name-role-value). A skip link is one useful
bypass mechanism; the criterion does not prescribe that exact implementation.
The [WAI page-structure tutorial](https://www.w3.org/WAI/tutorials/page-structure/)
shows how to express the structure in markup.

Choose text alternatives by an image's job in context. Describe information
conveyed by an informative image, name the action of an image control, and use
an empty `alt=""` for a purely decorative image. See [WCAG Non-text
Content](https://www.w3.org/TR/WCAG22/#non-text-content) and the [WAI images
tutorial](https://www.w3.org/WAI/tutorials/images/). Keep the visible words of
a control in its accessible name, as required by [Label in
Name](https://www.w3.org/TR/WCAG22/#label-in-name).

Prefer native controls over recreating their behavior with ARIA. When a custom
widget is necessary, supply its appropriate role, name, state, and keyboard
behavior together; an ARIA role alone does not make it operable. Follow the
[ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)
for the chosen pattern, and verify the actual interaction.

## Make input and feedback understandable

Give each input a visible, programmatically associated label. State a required
format or constraint before submission when it affects the user's answer.
Identify detected errors in text, connect them to the affected input, and offer
a correction when one is known. These decisions implement the applicable
[Labels or Instructions](https://www.w3.org/TR/WCAG22/#labels-or-instructions),
[Error Identification](https://www.w3.org/TR/WCAG22/#error-identification), and
[Error Suggestion](https://www.w3.org/TR/WCAG22/#error-suggestion) criteria; the
[WAI forms tutorial](https://www.w3.org/WAI/tutorials/forms/) and [GOV.UK error
message guidance](https://design-system.service.gov.uk/components/error-message/)
show usable implementations.

When an action changes the interface without moving focus, make important
status feedback programmatically available, as required by [Status
Messages](https://www.w3.org/TR/WCAG22/#status-messages). For a dialog or other
focus-changing interaction, plan where focus moves, remains, and returns; the
[ARIA modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
gives implementation guidance. Keep the visible result and the state exposed to
assistive technology consistent.

## Preserve operation across input and display conditions

Work through each important task with a keyboard. Every necessary function
must be operable without a pointer, focus must follow a meaningful order and
remain visible, and a user must be able to leave each component. Sticky bars,
dialogs, and other overlays must not entirely obscure the focused control.
These are distinct checks under [Keyboard](https://www.w3.org/TR/WCAG22/#keyboard),
[No Keyboard Trap](https://www.w3.org/TR/WCAG22/#no-keyboard-trap), [Focus
Order](https://www.w3.org/TR/WCAG22/#focus-order), [Focus
Visible](https://www.w3.org/TR/WCAG22/#focus-visible), and [Focus Not
Obscured](https://www.w3.org/TR/WCAG22/#focus-not-obscured-minimum). Check
pointer [target size](https://www.w3.org/TR/WCAG22/#target-size-minimum),
particularly when controls are dense, applying its stated exceptions.

Do not rely on color alone to communicate an error, selection, or state.
Measure contrast: [WCAG Contrast
(Minimum)](https://www.w3.org/TR/WCAG22/#contrast-minimum) sets 4.5:1 for
ordinary text and 3:1 for large text, with stated exceptions; [Non-text
Contrast](https://www.w3.org/TR/WCAG22/#non-text-contrast) also applies to
required visual information in controls and graphics. Check that text can be
enlarged to 200% without losing content or function, and that content can
reflow at the viewport-equivalent sizes and exceptions defined by [Resize
Text](https://www.w3.org/TR/WCAG22/#resize-text) and
[Reflow](https://www.w3.org/TR/WCAG22/#reflow). A single browser text-size
setting does not establish those outcomes.

## Support semantic browser automation

The same roles, names, labels, and states can help an Agent find and operate a
page when its browser tool exposes those semantics. Playwright's
[role and label locators](https://playwright.dev/docs/locators) use accessible
attributes and associated labels, while [Playwright
MCP](https://github.com/microsoft/playwright-mcp) gives language models
structured accessibility snapshots. It follows that a correctly named button
or labelled field can be easier for such an Agent to identify than an unnamed
custom control. This is an inference about these automation channels, not a
WCAG requirement or a guarantee that an Agent can complete a task.

Check the actual tool and task path. An Agent using screenshots may depend more
on visible wording and layout, while semantic tools depend on the exposed
structure and state. Keep both representations accurate and consistent; do not
substitute an Agent run for checks with the supported human input and
assistive-technology paths.

## Verify the rendered task, not only the markup

Use automated checks to locate detectable omissions, then manually exercise
the actual task path with keyboard focus, text enlargement and reflow, form
errors, dynamic feedback, and relevant assistive technology. W3C notes that
[no automated tool alone can determine
conformance](https://www.w3.org/WAI/test-evaluate/tools/selecting/). An
accessible component library or template can help, but the finished content
and composed interactions still need testing; the [U.S. Web Design System's
accessibility guidance](https://designsystem.digital.gov/documentation/accessibility/)
also assigns product teams responsibility for evaluating their own use.

When the consequences of a barrier matter, observe disabled people attempting
representative tasks as well as checking standards. Record the supported
browser, input, and assistive-technology paths, what was actually observed, and
any coverage gaps. [W3C's guidance on involving
users](https://www.w3.org/WAI/test-evaluate/involving-users/) explains why
their findings add evidence without representing every person with the same
disability.

## Source

- Steve Krug, _Don't Make Me Think, Revisited: A Common Sense Approach to Web
  Usability_ (New Riders, 2014), Chapter 12.
