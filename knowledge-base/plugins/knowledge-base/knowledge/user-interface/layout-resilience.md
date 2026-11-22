# Resilient interface layouts

## Scope

This document explains how user interfaces preserve usable layout and access to
required information and actions as valid content, available rendering space,
and supported user text preferences vary. It supplies a cross-platform model
for designing, implementing, diagnosing, testing, and reviewing those outcomes.

## When to update

Update when evidence changes how content and text presentation determine space
requirements, how available space constrains an interface, or how presentation
choices and observations establish continued information access and operation.

## Treat content, space, and text presentation as joint state

An accepted data contract defines possible values and collection sizes, not
their rendered dimensions. Character count cannot establish text width: fonts,
glyphs, casing, spacing, and wrapping opportunities affect the space needed.
Translation can change both width and height, and no one script is always the
widest. The W3C's
[text-size guidance](https://www.w3.org/International/articles/article-text-size)
explains these localization effects.

Derive a content envelope from the values and quantities the interface admits.
Include ordinary content and adverse valid cases relevant to the layout: long
labels, unbroken identifiers or paths, localized or mixed-script text, supported
text directions, and an
ordinary and large valid collection where cardinality can affect presentation.
Account for icons, indicators, actions, padding, and indentation that compete
for space. A layout repair should accommodate the accepted contract; shortening
that contract requires a separate product decision.

Use the actual space available to the window or owning surface. Width and height
are independent constraints: a wide, short window can fail differently from a
narrow, tall one. Device names and physical screen dimensions do not establish
the space left by windowing, multitasking, surrounding interface, or overlays.
[Apple's layout guidance](https://developer.apple.com/design/human-interface-guidelines/layout)
and [Android's window-size guidance](https://developer.android.com/develop/adaptive-apps/guides/use-window-size-classes)
both use available space to inform adaptation.

Treat user text size and supported font or spacing preferences as inputs to the
layout. Honor the target environment's supported settings while keeping content
readable and controls operable. Text can grow without its container growing by
the same factor; the platform's scaling may also vary across text styles.
Validate the resulting presentation rather than assuming one uniform multiplier.

Pair content and text presentation with the space that must hold them. Long
labels in a small collection and many short labels can pass separately while
many difficult items together fail. A short window and enlarged text can each
pass while their combination hides an input or action. Select reachable
combinations that challenge different assumptions, applying
[fault-revealing scenario selection](../software-testing/test-effectiveness.md#select-fault-revealing-scenarios).
Retain an ordinary working case as a control; an exhaustive product of every
size, language, font, and state is unnecessary when it repeats the same evidence.

## Adapt the whole surface and preserve the task

Identify materially different presentations and the conditions that switch
between them. Exercise the transitions as well as their endpoints: resizing a
window, changing orientation or text settings, and opening a constrained panel can
change available space during a task. Check that necessary capabilities remain
reachable and that input, selection, focus, and task progress remain appropriate
after the change. [Apple's layout guidance](https://developer.apple.com/design/human-interface-guidelines/layout)
likewise emphasizes consistent functionality as available space changes.

Trace space from the owning surface through containers, rows or tracks,
interactive controls and adjacent actions, text containers, and rendered
content. Identify which boundaries can grow or resist shrinking and choose
their sizing, placement, and overflow behavior. This is an inspection model;
each wrapper needs only the constraints required by its role.

Inspect the composed surface. A shortened label does not establish that its
menu, indentation, icons, and actions fit. A panel can have a reasonable size
yet be placed beyond an available edge. Fixed or persistent regions can consume
the space required to read or operate the rest of the interface.

Choose wrapping, restructuring, resizing, truncation, or deliberate scrolling
according to the user's task. Explanatory text needed before an action usually
benefits from wrapping or more space. A compact label may be shortened when
users can distinguish the item and inspect its full value when needed; identical
visible prefixes can make a contained list unusable.

Choose a large-collection treatment from what users need to do with the set:

- Use a bounded preview with an accurate total and a direct route to the
  complete set when users mainly need to understand its consequence before
  acting.
- Use deliberate scrolling, pagination, or virtualization when users need to
  browse the complete set.
- Add grouping, filtering, or search when users need to locate, compare, or
  select items.
- Use an aggregate when its meaning changes the decision more than individual
  rows, preserving access to underlying items that remain material.

These choices solve different tasks. Growth alone does not require
virtualization, and scrolling does not restore context that growth has pushed
away. Preserve task-critical warnings, permissions, relationships, recovery
information, and actions by deciding which regions may grow or scroll.

Keep the represented scope explicit. When the surface promises or users need
the complete collection, make remaining items discoverable and reachable. An
aggregate, top-ranked, or policy-filtered view may intentionally represent less;
identify that scope so it does not appear to be the complete underlying set.

Visual containment, programmatic identification, and access to a complete value
are separate outcomes. Preserve the full identifying information exposed through
the platform's supported semantics. A name available to assistive technology
does not let every sighted keyboard or touch user inspect visually shortened
content. Provide an input-appropriate way to reveal essential full values, and
check its discoverability and operation on the supported paths.

## Carry the model through design, testing, and review

| Stage   | Decision and evidence needed                                                                                                                                                                                                                                      |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Design  | Establish supported space and text conditions, content variation, layout transitions, and how necessary information and actions remain accessible. A design or prototype establishes only the behavior it actually represents.                                    |
| Testing | Cover representative environments, layout boundaries on both axes, supported text changes, and combinations that expose distinct reachable faults. Verify information access, control operation, and the task result in an environment capable of observing them. |
| Review  | Compare the supported conditions, chosen presentation, and actual evidence. Follow important tasks after layout changes and account for untested environments or settings before making a completion claim.                                                       |

Select cases around layout transitions and constrained widths and heights, not
only popular device presets. Include the smallest relevant large collection or
adverse valid content; combine it with text and space changes when that exposes
a distinct fault. This does not create a large-fixture obligation for every
collection.

## Match the evidence to the claimed outcome

Use [independent oracles](../software-testing/test-effectiveness.md#use-an-independent-oracle)
for the required outcome. A chosen style, constraint, or semantic property does
not establish that the composed interface fits or can be operated.

Semantic and interaction checks can establish identifiers, totals, ordering,
states, disclosure, and access to a promised complete set. Font measurement,
intrinsic sizing, placement, clipping, and scrolling need an environment that
actually lays out and renders the target interface. Choose the narrowest
environment that can expose the fault, and add a composed task when application
wiring or surrounding presentation participates. Rendering evidence can come
from a suitable component environment, host renderer, simulator, or device;
[Android's screenshot-testing guidance](https://developer.android.com/training/testing/ui-tests/screenshot)
illustrates the different environments and their limitations.

For a bounded view, check the total and represented scope, initial bound and
ordering, route to the promised complete set, and state after expansion,
filtering, paging, or scrolling. For a constrained surface, check relevant full
bounds, adjacent controls, and whether required content and actions can actually
be reached. A control's partial intersection with the visible surface does not
prove that it is usable. Overflow measurements need the intended presentation
policy: a deliberately shortened label can legitimately have hidden overflow.

Screenshots establish appearance in the captured state. Geometry establishes
measured containment or placement. Actual input and result observations
establish operation on the exercised path. Programmatic semantics alone do not
establish actual assistive-technology behavior. Check the supported input and
assistive-technology paths required by the claim.

Record the rendered environment, available dimensions, content and text
settings, starting state, attempted task, and observed result. Identify
emulation and untested conditions. Passing the default presentation or one text
setting supports only that evidence; it does not establish all supported
presentations, settings, or task paths.
