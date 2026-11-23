# Design selection triggers

## Scope

Use this reference when writing or reviewing an Agent Skill description or an
internal routing condition inside a Skill. It owns the shared reasoning for
coverage, earliest useful selection, precision, and independent checks;
consuming artifacts own their required format and route.

## When to update

Update this reference when a real Skill-selection or internal-routing case
reveals a missing or incorrect shared rule for selection, coverage, or
precision.

## Establish coverage before drafting

1. Establish the target responsibility from user work and reader decisions. For
   an existing condition, record its wording, pre-change coverage, which
   dimensions the accepted task changes, and which must stay unchanged. A move,
   rename, grouping change, or body revision alone does not justify changing the
   selection boundary.
2. Prepare natural request cases before proposing wording. Include a plain broad
   task that neither names the target concepts nor already diagnoses the concern
   when the target is useful in wider work; include direct, focused-learning,
   overlap, phase-change, and nearby negative requests when they exist. Record
   why each case needs or excludes the target. A broad task may select several
   independent Skills or internal conditions.
3. For each proposed restriction, identify every previously covered task it
   would exclude. Establish that the accepted change removes that task from the
   target's responsibility or that another authoritative route now owns it. A
   request's failure to name the concern does not establish that it is
   unnecessary.

Finish by selecting only justified coverage changes. If a restriction's basis
remains unresolved, retain the existing coverage and report the question
separately.

## Write the condition

For an existing condition, start from its recorded wording and apply only the
coverage changes established above.

Draft from the earliest observable point in the reader's work: the requested
result, a decision to make, current material, language, platform, production
method, or task stage. Ask when an Agent with only that context needs the target.
If the target helps discover a risk, exception, or diagnosis, route from the
preceding work or artifact rather than requiring the conclusion to be known.
A topic summary or phrase such as “when relevant” does not define a condition.

Express cases with the same selection reason as one general condition. Add a
separate branch only when a request presenting that need alone should select the
target and the general condition does not already cover it. Lists of techniques,
examples, outcomes, or linked documents do not substitute for a semantic
condition.

For a Skill's top-level description, state the complete applicability or task
boundary—the promised result or work context that makes the Skill useful—without
enumerating internal steps, example lists, or every linked resource. When a
Skill must constrain a proposal or action before it begins, select from the
preceding work or decision point.

For internal routing conditions inside a Skill, select from observable work,
materials, or stage rather than requiring the reader to know a risk or
diagnosis that the routed resource helps uncover. Express each condition as one
concise semantic boundary (for example, "when designing or reviewing API input
contracts" rather than "including field names, enums, bounds, defaults, or error
text"); do not substitute a grab-bag list of fields, parameters, subtopics, or
file paths. When
multiple internal conditions can apply together, define each independently so
matching conditions apply cumulatively rather than forcing a single closest
match; do not duplicate an orthogonal resource into another branch with an
`"except when..."` carve-out when independent cumulative conditions already
compose them cleanly (group multiple resources under one condition only when one
is genuinely required whenever that specialization applies).

## Check selection from requests

Scale fresh-reader selection probes to trigger and placement risk per
[Verify reader understanding](reader-understanding.md#assess-probe-risk). Run a
blind selection check when adding a Skill, revising a description or internal
routing condition where overlap, false positives, or missed triggers are
plausible, resolving uncertain placement, or substantively shifting covered
responsibility. When trigger wording and coverage boundaries remain clearly
unchanged and unambiguous (such as a low-risk body simplification), coverage
analysis alone is sufficient without forcing a fresh-reader run.

When a blind selection probe is warranted for a Skill description, give a fresh
reader the natural request, available artifacts, and the real candidate
metadata. Record its choices before showing target bodies or expected
selections, compare against intended coverage, and resolve missed or unrelated
choices.

When a blind routing probe is warranted for internal conditional resources,
give a fresh reader the Skill's complete current body and the task context, then
record every selected and excluded condition before revealing expected choices.
Check cumulative matches, focused learning, valid no-match requests, overlaps,
and stage changes.

Record actual reading and application separately from selection choices when
evaluating full behavior. Static links or metadata choices alone do not prove a
file was read or applied.
