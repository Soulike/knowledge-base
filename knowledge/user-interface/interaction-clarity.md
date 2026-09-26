# Interaction clarity in user interfaces

## Scope

This document explains how to make available actions and the path through an
interface understandable from the user's task. It covers recognizable action
labels, perceivable controls, input expectations, and feedback during an
interaction so people can proceed without guessing how the interface works. It
applies to user interfaces and multi-step flows without prescribing a platform,
widget, or visual style.

## When to update

Update when evidence changes how user expectations, action naming, control
recognition, input interpretation, flow orientation, action feedback, and
task-based observation contribute to an understandable interaction path.

## Start from the user's next action

At each step, establish what the user is trying to do, what they already know,
and what the system expects next. A user should be able to recognize the
available action, distinguish it from surrounding content, anticipate its
effect, and tell whether the system accepted their input. A screen can present
the right facts yet still make people guess how to use it.

After a step changes, make the user's place in the flow and the available next
step recognizable. If the task calls for revisiting an earlier choice, make the
way back clear without requiring the user to reconstruct the route.

Reduce interpretation that serves only the interface. A consequential choice
may require careful thought; removing its explanation, risk, or confirmation
would make the task less understandable, not easier. Aim for immediate
recognition where the task permits it, and clear explanation where it does not.

## Name actions by what users can expect

Use terms that people recognize in the task's context. An action label should
help them predict its destination or effect. Clever names, internal terms, and
unexplained abbreviations can force users to test possibilities instead of
choosing confidently. A familiar word can still need context when several
actions have similar names or different consequences.

For example, a control that saves entered information before moving on should
say so when that distinction matters. The
[GOV.UK Design System's button guidance](https://design-system.service.gov.uk/components/button/)
distinguishes “Save and continue” from “Continue” according to whether the
action saves information. For Web links,
[WCAG Link Purpose (In Context)](https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html)
likewise requires their purpose to be determinable from the link text or its
programmatically determined context, subject to its stated exception.

Keep the terms for the same action and object coherent as the user moves through
the flow. Verify unfamiliar or domain-specific wording with people who know the
task but do not know the product's internal vocabulary.

## Make actions recognizable and operable

Present interactive elements so users can tell what can be acted on and what is
ordinary content. Visual treatment, placement, and state should reinforce the
action's meaning; a label alone cannot resolve an element that appears inert or
whose available state is unclear. Provide the platform's semantic controls and
names so recognition and operation also work through supported keyboard, touch,
and assistive-technology paths. Do not rely on hover or color alone to reveal a
necessary action.

Use familiar interaction patterns when they fit the task, while checking the
composed result rather than assuming that a conventional-looking control will
be understood in its actual context.

## Make input expectations and responses legible

Label required input in terms users know, and disclose a necessary format or
restriction before it causes an avoidable error. The
[GOV.UK text-input guidance](https://design-system.service.gov.uk/components/text-input/)
recommends short, visible labels and warns against using placeholder text in
place of a label or hint.

When the system needs a specific item but users know it by a name rather than
an internal code, let them identify the intended item or explain the required
identifier. If suggestions help, show enough distinguishing context to choose
correctly and make the accepted selection apparent. A suggestion list is one
possible treatment, not a requirement for every input; the
[U.S. Web Design System's combo-box guidance](https://designsystem.digital.gov/components/combo-box/)
describes it for selecting from a large list using familiar option names.

For example, a request form may require a registered team. If users know team
names but not database identifiers, a field that silently requires an identifier
and rejects the name after submission creates avoidable guesswork. A labelled
choice that distinguishes similarly named teams lets the user confirm the
intended recipient before proceeding. If free text is genuinely accepted, keep
that path available instead of imposing selection merely for consistency.

Give feedback at the point where the user needs to know whether an input or
action took effect. If a value has not been recognized or selected, make that
state visible before the user proceeds as though it were accepted. When an
action takes time, distinguish acceptance from completion and show when the
next action is available. Do not imply that a result is complete while it is
still pending.

## Explain necessary complexity near the decision

An unfamiliar or inherently complex step may not be obvious at a glance. Use a
well-chosen name, perceivable structure, and a small amount of specific help
near the choice to explain what the user needs to do and what will happen. Keep
material consequences visible before action. More instructions are not a repair
for a confusing label or an input rule the interface could express directly.

## Validate the action path with a task

Give a participant or fresh reviewer a realistic goal without coaching the
expected next step. Observe whether they find the action, interpret its label,
recognize it as operable, predict its effect, provide accepted input, and
understand the resulting state. Follow a transition to see whether they know
where they are, how to continue or return when needed, and whether a delayed
action is still in progress. Hesitation, repeated guesses, inert-element
attempts, and late correction loops help locate avoidable ambiguity; they do
not by themselves prescribe a particular widget or wording.

Check the supported input and assistive-technology paths that the claim covers.
A screenshot or author review can reveal a visual problem, but cannot establish
that people can proceed through the interaction. Do not treat time spent on a
necessary decision as a usability defect merely because it is measurable.

## Source

- Steve Krug, _Don't Make Me Think, Revisited: A Common Sense Approach to Web
  Usability_ (New Riders, 2014), Chapter 1.
