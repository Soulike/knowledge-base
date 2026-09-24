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

Start with the target's responsibility. For Knowledge, identify the earliest
task, decision, technical subject, or available artifact that creates an
independently useful reason to read it. For a Skill, identify the user task or
desired result that calls for its workflow; a subject or artifact may delimit
that task but does not establish an invocation by itself. State the condition
using information available before selection. If the target helps determine
whether a risk, exception, or diagnosis applies, route from the preceding task
or artifact; do not require the conclusion to be known before loading the
target. A topic summary or phrase such as “when relevant” does not define a
selection condition.

Express cases with the same selection reason as one general condition. Add a
separate branch only when a request presenting that need alone should select
the target and the general condition does not already cover it. A list of
techniques, examples, or outcomes is not a substitute for the condition.
Delete illustrative clauses, including `including ...` lists, when the general
condition already routes those cases. Keep an example only when it clarifies
an otherwise ambiguous boundary with an adjacent route.

Check the draft against direct and paraphrased requests that should select the
target, plus nearby requests that should select another owner. Compare it with
the previous route and neighboring routes so a rewrite preserves intended
entry paths without drawing in unrelated tasks. Shorten wording that merely
describes the target's contents, but keep distinctions needed to select it.
