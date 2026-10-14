# Design selection triggers

## Scope

Use this reference when writing or reviewing a condition that selects a
Knowledge document or invokes an Agent Skill. It owns the reasoning shared by
those conditions; the consuming workflows own their required format and
artifact-specific routing rules.

## When to update

Update this reference when a real Knowledge or Skill routing case reveals a
missing or incorrect shared rule for selection, coverage, or precision.

## Write the condition

Fix the target's responsibility, then draft the condition from the reader's
starting point: the user's requested work, a decision to make, an available
artifact, or an observed workflow state. Ask when an Agent with only that
context would need the target. Use the responsibility to bound the route, not
as vocabulary the user must supply. For Knowledge, identify the earliest
independently useful reading point before workflow selection. For a Skill,
identify the user task or desired result that calls for its workflow; a subject
or artifact may delimit that task but does not establish invocation by itself.

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

Before finalizing the wording, test natural requests. Include a broad task
that does not name the target's concepts or diagnosis when its responsibility
can arise in wider work; include direct and nearby negative requests when they
exist. Derive cases from the target's actual responsibility rather than
meeting a fixed count. A broad task may select several targets when each
contributes a distinct responsibility.

For an independent check, give a fresh reader the requests, available artifacts,
and real candidate catalog or Skill descriptions. Have the reader choose before
showing the target's contents or the author's expected selection. Then compare
the choices with target responsibilities, the previous routes, and neighboring
routes. Resolve missed and unrelated selections; keep illustrative cases in the
review evidence rather than expanding the published trigger into a case list.
