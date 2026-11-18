# Agent behavioral evaluation

## Scope

This reference defines generic Agent behavioral-evaluation mechanics shared by
Skill behavioral proof, cross-model reader-understanding verification, and
behavioral regression workflows. It covers fresh-context isolation, inherited
boundary recording, evaluator-only withholding, the canonical executor
instructions guard, blind selection and application dispatch templates,
execution recording, contamination handling, independent judgment, and attempt
retention.

The calling workflow or validation standard owns which model baseline applies
(for example, a materially less capable comparison model for Skill or
documentation self-sufficiency, or a specified matched model for regression
replay) and any repository-specific case format, inventory, or completion
gates.

## When to update

Update this reference when an evaluation run, review, or failure reveals a
missing or unclear rule for context isolation, evaluator withholding, dispatch
templates, contamination handling, execution recording, or attempt retention.

## Isolate context and boundaries

Run each independent evaluation scenario in a fresh executor context
(`fork_turns: "none"` or dispatcher equivalent) rather than inheriting prior
conversation history or defaults. Explicitly select and pass the executor model
and capability-relevant configuration (such as reasoning effort when exposed)
according to the calling standard, and verify that the executor retains the
tools, modalities, and context required by the scenario. Report unavailable
prerequisites instead of silently substituting defaults or omitting missing
configuration.

For native sub-Agents, a fresh context removes parent conversation history, but
may still retain active instructions, installed Skill descriptions, filesystem
access, and ambient environment. Record the actual inherited boundary and
available observations; never claim full isolation or disablement of automatic
guidance without evidence. If ambient content could supply the answer or
invalidate the evaluated distinction, change the supported execution boundary
or report the scenario incomplete.

## Separate task inputs from evaluation criteria

Construct each executor's input from only the task and necessary starting
materials:

- **Selection:** supply current real candidate metadata without revealing the
  target name through instructions, fixture names, or wrapper text. Do not
  supply target bodies before observing the choice.
- **Application:** explicitly supply or require reading the complete current
  tested content and its necessary routes. Naming the target is allowed when
  the evaluation concerns behavior after reading.
- **Journey:** provide natural task inputs and observe selection, reading, and
  task behavior without substituting a selection-only stop for the whole task.

Withhold evaluator-only material from executors: expected answers, scoring
rubrics, protected-fault definitions, coverage declarations, past outputs, and
author or reviewer conclusions. Neutral capture fields or verification hooks may
specify what to observe without leaking expected decisions. Keep evaluator-only
material and suggestive paths out of the task workspace when the execution
boundary supports doing so.

## Prepare executor dispatch

### Executor instructions

Include the following guard verbatim in every executor prompt alongside the task,
permitted inputs, and neutral execution mechanics. Do not supply evaluator-only
specifications merely to convey these rules or disclose the target of a
selection task. The guard supplements input and environment separation; it does
not establish that inaccessible or undisclosed material cannot be read.

```text
Complete the assigned task independently using its permitted inputs, active
runtime instructions, and allowed reading routes. Normal Knowledge, Skills,
and references allowed for this task are guidance you should apply.

Do not search for, open, request, or use evaluator-only case definitions,
expected answers, scoring rubrics, reference outputs, previous run results,
or evaluator discussions. Do not use tools, repository history, or other
Agents to obtain these materials or infer which answer or guidance the
evaluation expects. Do not alter evaluator-owned tests, scoring, or evidence,
or fabricate actions or observations to obtain a passing result.

If you encounter evaluator-only material, stop further task execution and
report what was exposed, when, and how, without repeating the answer. Do not
silently continue, hide the exposure, or claim an independent result. If the
permitted inputs or reading boundary are unclear, report the gap rather than
consulting evaluation material to fill it.
```

Assess available access evidence as well as the executor's report; a clean
self-report does not establish absence of answer access. When evaluator-only
material reaches an executor, retain the attempt and record its execution as
`incomplete` with the contamination or guard violation; do not derive a pass or
a content failure from that run. Fix the exposure boundary before starting a
new run in an uncontaminated context. Allowed task guidance is not
contamination merely because it teaches the required behavior.

### Dispatch templates

Prepare executor inputs from the task and necessary starting state without
exposing evaluator-only files or answers. Replace every placeholder below before
dispatch, inserting the full guard from
[Executor instructions](#executor-instructions) where indicated. An unexpanded
guard placeholder or a link asking the executor to look up the guard is not a
prepared prompt; keep one authoritative copy of the guard rather than
redefining it in templates.

Explicitly pass the selected model, capability-relevant configuration, and
fresh-context setting (`fork_turns: "none"` or dispatcher equivalent) as
dispatcher arguments rather than embedding them inside the executor message as
instructions asking a running worker to change itself.

For a blind selection scenario, supply current candidate metadata and stop at
the choice:

```text
<Insert the complete executor guard here.>

Task request:
<The scenario request, without expected selections or target hints.>

Permitted starting materials and tools:
<Only the initial facts, materials, and tool boundary required by this task.>

Current candidate metadata:
<The real candidate identifiers, descriptions, and normal catalog metadata;
no candidate bodies or evaluator-only annotations.>

Choose the relevant guidance from this metadata, or choose none. During this
selection step, do not open candidate bodies or perform the substantive task.
Return your chosen identifiers and reasons tied to the request. Report any
missing input, unintended body exposure, or uncertainty. This response records
your choice; do not claim that a client loaded or read the chosen guidance.
```

For an application scenario, name the allowed current guidance and perform the
task:

```text
<Insert the complete executor guard here.>

Task request:
<The scenario request, without evaluator criteria or a reference answer.>

Permitted starting state, materials, tools, and action boundary:
<The initial state and necessary task materials; include required reset or
cleanup mechanics and a concrete resource allowance.>

Required current guidance:
<Complete current content, or explicit permitted paths and reading routes
that provide the complete content. Identify the supplied source snapshot.>

Read the required guidance and its necessary routes before taking the task
actions it governs. Perform the assigned task within the permitted boundary.
Return the actual result and artifact locations, with the decisions that
explain the result. Distinguish completed actions from proposed work, and link
available observations rather than inventing tool or reading evidence. Report
uncertainty, missing prerequisites, or an explicit stop with its reason.
```

For a journey, retain the natural task path and capture the choice before
reading and application; do not substitute the selection-only stop for the
whole task. Reuse task decisions and artifacts for reader-understanding checks
when they supply all required observations, or obtain missing paraphrase,
application, or confusion observations through a neutral follow-up after the
task observation without supplying author conclusions or expected answers.

After any required blind selection has been recorded, prepare the independent
capable reviewer's input separately. It receives the evaluator-only material
that executors must not see:

```text
Review subject and standards:
<Task and scope, active instructions, applicable standards, accepted
requirements, exact final artifacts, and trusted pre-change artifacts.>

Scenario contracts and evidence:
<Scenario IDs, independent criteria and their sources, covered
responsibilities, actual executor inputs and source/model identities, inherited
context limits, every attempt's raw observations, and program-assertion
results. Mark missing evidence explicitly; omit the author's or coordinator's
proposed verdict.>

Judge each required criterion as pass, fail, or incomplete, citing actual
evidence and unresolved gaps. Keep scenario judgments, semantic correctness,
reader suitability, and reader-understanding observations separate. A missing
observation is not supplied by a plausible explanation or an executor's claim.
```

## Record execution

Bind observations to the exact content supplied: commit or source snapshot,
plus relevant uncommitted changes or input hashes when working files differ.
Run against current content; re-scoring an old transcript evaluates that
historical transcript, not the revised content.

Collect observable choices, final outputs, artifacts, external state, and
available action events. A final explanation can establish an interpretation,
while claims about reading, tool effects, or action order require corresponding
observations. For example, investigating before editing requires evidence of
the investigation and edit sequence; self-reported compliance or a semantic
judge cannot fill a missing action trace. When an interface exposes only a
final message, restrict conclusions to what that message and independently
inspectable artifacts establish.

Set a task-appropriate token or time allowance before running, including
evaluation and any planned retries. Record reported usage when available and
mark unavailable usage as unknown; an exhausted allowance is `incomplete`.

When isolating content effects from prior model capability is necessary,
compare pre-change and revised content under the same task and configuration,
or run an optional no-content baseline. These comparisons do not make old
output the expected answer or require a comparison matrix for routine edits.

## Judge and retain attempts

Check deterministically observable criteria with program assertions where
available. Give an independent capable reviewer the accepted criteria, source
snapshots, and raw observations for open semantic judgments without author
conclusions. Calibrate a new semantic rubric against known satisfactory and
faulty observations when needed to establish that it distinguishes the target
fault; do not rely on an unverified judge's score alone.

Classify every criterion and scenario:

- **Pass:** trustworthy observations establish all required criteria, with no
  critical or forbidden behavior.
- **Fail:** trustworthy observations establish a criterion violation. Identify
  the violated criterion and investigate its owner before repair.
- **Incomplete:** a required run, suitable model, fixture, observation, or
  judgment is unavailable, contaminated, or inconclusive. Conflicting judgments
  require resolution.

A scenario passes only when all required criteria have trusted passing
evidence; critical failures cannot be averaged away. Retain every material
attempt—including failed, contaminated, superseded, and incomplete attempts—and
keep each attempt's executor identity and capability-relevant configuration
adjacent to its outcome. A later pass does not erase an earlier failure.
Explain any bounded diagnostic replay, and validate diagnosed repairs on the
revised subject while retaining earlier failures. An unexplained fail-to-pass
change on the same subject does not establish a trusted pass. Do not retry
until a favorable result or weaken expectations merely to match current output.
