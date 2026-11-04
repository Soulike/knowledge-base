# Design selection triggers

## Scope

Use this reference when writing or reviewing a condition that selects a
Knowledge document or invokes an Agent Skill. It owns the reasoning shared by
those conditions; the consuming workflows own their required format and
artifact-specific routing rules.

## When to update

Update this reference when a real Knowledge or Skill routing case reveals a
missing or incorrect shared rule for selection, coverage, or precision.

## Establish coverage before drafting

1. Establish the target's responsibility from reader needs and the accepted
   task. For an existing condition, record the condition itself, its pre-change
   coverage, which dimensions the task requires changing, and which must stay
   unchanged. A move, rename, or body revision alone does not justify changing
   the selection boundary.
2. Before proposing wording, prepare natural request cases from those reader
   needs and coverage boundaries. Include a plain broad task that neither names
   the target's concepts nor already diagnoses the concern when the target is
   useful in wider work; include direct and nearby negative requests when they
   exist. Record why each case needs or excludes the target. A broad task may
   select several targets when each contributes a distinct responsibility.
   Keep these cases for the final check; add cases when new reader needs emerge
   rather than replacing them to fit a candidate condition.
3. For each proposed restriction, identify the previously covered tasks it
   would exclude. Establish that this coverage change belongs to the accepted
   task and that those tasks no longer need the target's understanding or
   workflow, or are no longer supported. A request's failure to name the
   target's concern does not establish that it is unnecessary; neither does
   closer resemblance between a condition and the target's contents.

Finish by selecting only justified coverage changes. If a restriction's basis
remains unresolved, retain that part of the existing coverage and report the
question separately. A narrower candidate awaiting justification is not a
completed coverage decision.

## Write the condition

For an existing condition, start from its recorded wording and apply only the
coverage changes established above.

Draft from the earliest useful point in the reader's task: the user's requested
work, a decision to make, an available artifact, or an observed workflow state.
Ask when an Agent with only that context would need the target. Use the
target's responsibility to establish its usefulness at that point. A specialized
responsibility can be needed during a broader task; its content vocabulary
need not become a prerequisite for selection. For Knowledge, this reading point
must precede workflow selection. For a Skill, identify the user task or desired
result that calls for its workflow; a subject or artifact may delimit that task
but does not establish invocation by itself.

For example, a reader asked to implement a file upload needs applicable
failure-and-recovery Knowledge before deciding how timeouts, partial uploads,
and retries should behave. The request need not mention those concerns.
A condition requiring the reader to already be designing partial-upload
recovery would delay selection until after a decision the Knowledge should
help uncover. Start from the implementation task and use the Knowledge's
responsibility to check its contribution to that task.

If the target helps determine whether a risk, exception, or diagnosis applies,
route from the preceding task or artifact; do not require the conclusion to be
known before loading the target. A topic summary or phrase such as “when
relevant” does not define a selection condition.

Express cases with the same selection reason as one general condition. Add a
separate branch only when a request presenting that need alone should select
the target and the general condition does not already cover it. A list of
techniques, examples, or outcomes is not a substitute for the condition.
Delete illustrative clauses, including `including ...` lists, when the general
condition already routes those cases. Keep an example only when it clarifies
an otherwise ambiguous boundary with an adjacent route.

## Check selection from requests

Check selection when writing or revising a condition, assessing a target's
placement, or substantively changing its covered content or responsibility, even if its
route's wording is unchanged.
An unchanged condition mentioning the subject does not establish that readers
will select the needed understanding. Begin during placement assessment so
the result can inform the owner and routing decision; repeat against the final
candidate set after drafting.

Use the request cases established before drafting against the real candidate
set. Compare existing conditions with their proposed replacements, accounting
for every added restriction and its excluded tasks. Successful positive
selections alone do not justify a narrower boundary.

For an independent check, give a fresh reader the requests, available artifacts,
and real candidate catalog or Skill descriptions. Have the reader choose before
showing the target's contents or the author's expected selection. Then compare
the choices with target responsibilities, the previous routes, and neighboring
routes. Resolve missed and unrelated selections; keep illustrative cases in the
review evidence rather than expanding the published trigger into a case list.
