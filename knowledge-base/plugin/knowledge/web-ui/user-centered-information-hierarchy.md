# User-centered web interface information hierarchy

## Scope

This document explains how to select, relate, and emphasize information so a
web interface supports the user's current task, question, or decision through a
coherent visual and semantic hierarchy.

## When to update

Update when stronger evidence changes how user tasks, necessary context,
causal relationships, scanning and reading behavior, content grouping, visual
emphasis, progressive disclosure, semantic structure, accessibility, or
task-based validation interact within this scope.

## Start from the user's task

Define what the user is trying to understand or accomplish before selecting
fields, components, or visual treatments. Establish the target, the user's
current context, and the question or action the interface must support.

For each candidate fact, ask whether it changes the user's understanding of:

- the target object, action, or current state;
- a relationship, cause, consequence, or required side effect;
- an authorization, permission, risk, or recovery condition;
- identity needed to distinguish the target; or
- an available or required next action.

Do not expose a fact merely because it exists in an API response, domain object,
manifest, execution plan, or diagnostic record. Availability does not establish
value for the current task. The GOV.UK guidance on
[writing for user interfaces](https://www.gov.uk/service-manual/design/writing-for-user-interfaces)
similarly recommends beginning with minimal content, adding help when research
shows a need, and putting important words first.

## Preserve the minimum complete context

Remove information that does not help the current task while retaining the
context needed for informed and safe action. Required consequences,
dependencies, permissions, warnings, and recovery facts remain visible when
they affect consent, risk, or the result of proceeding. Move diagnostics,
provenance, and implementation detail to another surface or disclosure only
when they do not change the user's interpretation or choice.

Minimal does not mean vague. Preserve enough identity to distinguish objects,
enough state to understand the current situation, and enough consequence to
understand what an action will do. Additional labels and explanations can
increase rather than reduce effort when they give supporting detail the same
prominence as task-critical information.

## Explain cause and consequence directly

When one action causes another installation, mutation, permission grant, or
persistent side effect, state the relationship in user language. Identify the
cause, the affected objects, and the consequence instead of presenting related
items as an unexplained list or exposing only an internal execution sequence.

For example, an installation surface can identify the selected item, state that
it requires the listed dependencies and that they will also be installed, then
present requested permissions separately. Cache state, plan identifiers, and
execution ordering remain secondary unless they change the decision. For
irreversible or unchangeable actions, W3C's
[confirmation technique](https://www.w3.org/WAI/WCAG22/Techniques/general/G168)
likewise calls for identifying the selected action and the consequence of
proceeding.

## Establish hierarchy before styling

Rank information according to the current task before choosing type sizes,
weights, colors, borders, icons, or component containers. Determine which
object, state, or action provides the surface's purpose; which conditions or
consequences can change the user's interpretation or choice; which related
objects must be understood; and which details only support identity or
diagnosis. Their order depends on the task rather than a universal sequence.

Use grouping, proximity, alignment, whitespace, and reading order to express
those relationships before adding decoration. Repeated cards, borders, badges,
or headings can flatten the hierarchy when every item receives equivalent
prominence.

## Make the first scan informative

On task-oriented surfaces, people may look first for words and areas that match
their immediate goal and leave much of the rest unread. Longer articles and
reports may receive sustained reading, often mixed with scanning. Design for
the expected task and verify what people actually notice rather than assuming
that every word will be read or that no one will read closely.

Give regions distinct purposes and labels so a person can identify where to
focus and what can be ignored. Headings should reveal the content they govern,
be visually distinct at different levels, and sit closer to the material they
introduce than to the preceding section. Grouping must convey the true
relationship: a heading placed over unrelated areas can falsely imply that
they belong to the same section.

Use familiar conventions for the location, appearance, and behavior of common
page regions when they help people orient quickly. If a different arrangement
better serves the task, make its purpose and boundaries recognizable. Check the
intended audience and device context rather than treating one page layout as a
universal convention.

Break dense prose at meaningful topic boundaries. Use lists for parallel items
that people need to compare or locate, and emphasize a few discriminating terms
when that helps them find a relevant passage. A wall of prose or a page where
everything is highlighted makes the useful part harder to find. Keep necessary
details available for deliberate reading; scannability does not justify
removing information needed for an informed decision.

## Keep task copy purposeful

On a task page or section landing page, copy should serve the reader's task:
for example, by identifying the target or current state, helping people locate
what they need, distinguishing an option, explaining a consequence, or
supporting the next step. Remove greetings, empty promotional claims, and
introductions that merely announce content already visible. When a claim
matters, replace praise with a concrete fact that helps the user decide. Less
incidental copy reduces visual noise and lets more useful content appear in the
initial view.

Do not use a word-count target as a substitute for deciding what the user
needs. Keep time estimates, eligibility conditions, material consequences, and
alternative routes when they affect a decision. Put details near the point
where people can use them, before the choice they inform. Long-form articles
and explanations may require more text; judge them by their reading purpose
instead of applying a task-page limit.

## Combine visual channels deliberately

Type size and weight, position, spacing, color, borders, and icons can each
contribute to structure, emphasis, identity, or state. Give them consistent
roles within the interface and use the strongest treatments sparingly. A
hierarchy that depends on every element being large, bold, saturated, or boxed
has no remaining signal for what matters most.

Check the message, grouping, and typographic hierarchy before relying on color.
Then use color to reinforce meaning or attention according to the product's
design system. The U.S. Web Design System's
[color guidance](https://designsystem.digital.gov/design-tokens/color/overview/)
similarly recommends establishing the message and hierarchy independently of
color before applying it to functional and expressive roles.

Icons can reinforce a kind, action, or state when they improve recognition, but
they do not replace a necessary label or explanation. Keep supporting metadata
visually quieter while preserving required readability and contrast. Do not
make color, shape, size, or location the sole carrier of required information.

Competing animation, promotions, decorative treatments, and uniformly strong
emphasis can obscure the task's signal. Reduce or relocate them according to
the reader's purpose instead of asking every element to attract attention.

## Preserve meaning outside the visual presentation

Visual and semantic hierarchy are separate contracts that should express the
same relationships. Use headings, lists, groups, labels, descriptions, and
logical source and focus order so the interface remains understandable when a
user does not perceive its spacing, position, color, or iconography.

When presentation communicates a relationship, state, or consequence, make the
same meaning programmatically determinable or available in text. WCAG's
[Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
guidance applies this requirement to structure expressed through visual
formatting, while
[Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
requires another visual means when color communicates information, actions, or
distinctions.

## Disclose secondary information without hiding the task

Progressive disclosure can reduce routine load when only some users need lower
priority supporting information. Keep required permissions, material side
effects, risks, dependencies, and recovery conditions visible when users need
them before acting. A disclosure should have a concise label that lets users
predict what it contains and decide whether opening it serves their task.

The GOV.UK Design System's
[details guidance](https://design-system.service.gov.uk/components/details/)
uses the same boundary: disclosure can make supplementary information easier to
scan, but should not conceal information most users need.

## Validate the information hierarchy

Give a reviewer or participant a realistic task without coaching the expected
answer. Observe which words or regions they notice first and whether they can
find the relevant area without reading everything. Ask them to identify the
surface's purpose, primary object or state,
important consequence, required relationships, permissions or risks, and next
action where those elements apply. If they must first reconstruct the
implementation model, the surface may expose the wrong information or give it
the wrong hierarchy.

Use scenarios that challenge different hierarchy choices: an API-shaped surface with
irrelevant fields, an action with required side effects and permissions, a
dense view with uniform emphasis, a case where diagnostics can move safely to
disclosure, a safety-sensitive case where detail must remain visible, and a
status view with no immediate action. Retain an ordinary case as a control.

Check the composed result with realistic content, constrained width, supported
themes, text enlargement, keyboard navigation, and relevant assistive
technology. Verify that muted information remains readable, emphasized
information is actually more prominent, source and focus order remain logical,
and required distinctions survive without color or icons. A screenshot or
author review can expose appearance defects, but it does not establish that
users can find, understand, or act on the information. Record the environments,
participants or reviewers, tasks, and observed decisions that support each
validation claim.

## Source

- Steve Krug, _Don't Make Me Think, Revisited: A Common Sense Approach to Web
  Usability_ (New Riders, 2014), Chapters 2–3 and 5.
