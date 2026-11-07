# Behavioral regression cases for knowledge-base content

A case preserves a task and an independent behavior contract so that another
Agent can attempt the task after the content changes. The contract describes
required behavior, forbidden behavior, and acceptable results. The tested
document and its previous output are evidence, not the authority that defines
the expected answer. Apply the testing principles selected by the consuming
workflow rather than maintaining a second standard for Agent tests.

## Case assets

Store each case at `tests/<case-id>/case.md`, with optional fixtures beside it.
Use a stable lowercase hyphenated ID independent of document titles and paths.
Keep one canonical copy and retain the ID when responsibility moves.
Adding this entrypoint to the repository's working tree adds the case to its
regression inventory; there is no separate registry or registration command.
Files beneath a case's fixture directories remain materials rather than
additional case entrypoints.

**Covered objects** are the canonical files whose behavior the case protects.
Declare each as a document-relative Markdown file link in `Covered objects`;
use local file targets without fragments. Link a Skill's entrypoint when testing
its workflow, and also link references whose own responsibility is protected.
The link target is the object identity; do not maintain a second path field.
This lets `pnpm links:check` detect broken references and lets discovery resolve
the same targets for reverse lookup.

Place `tests/` in the covered file's containing directory. For a case covering
several files, place it in their nearest common containing directory. For
example, a case protecting a Skill and one of its nested references belongs
under that Skill's directory; a case protecting two sibling Knowledge
directories belongs under their common parent. Candidate catalogs, unrelated
Skills in a selection task, and incidental reading materials are inputs, not
automatically covered objects. Include them in coverage only when the case
also protects their behavior. Discover joint cases by coverage, even when they
live outside an edited object's immediate directory.

Cases and fixtures are test assets, not Knowledge leaves, usage guidance, or
shared Skill references. Before introducing a collocated case, verify that
Knowledge-format checks, content-verification targets, Skill-bundle readers,
and reference enumeration distinguish the `tests/` subtree from canonical
content. Repair the owning enumerators as needed before registration; existing
recursive file discovery must not be assumed to make this distinction.
Keep test expectations out of the tested Agent's supplied content. A packaged
case's presence does not make it runtime guidance or guarantee client isolation.

Use the following fixed structure. Placeholder paths and prose describe a
template, not a registered case:

```markdown
# Case title

## Identity

- ID: stable-case-id
- Kind: selection | application | journey

## Covered objects

- [Covered document](../../covered-document.md)

## Protected behavior

State the accepted responsibility and realistic fault, plus a relevant
permitted change the case must tolerate.

## Task

The request given to the tested Agent, without the expected answer.

## Starting state

Materials, initial state, tool boundary, and conditions for constructing the
current candidate set or supplying the current tested content.

## Expected behavior

Independently accepted required, forbidden, and allowed behavior. Give each
criterion a stable label and identify any critical failure.

## Verification

Replay steps and observable evidence for each criterion. Identify program
assertions, semantic rubric, and evidence required for process claims.

## Source

Original validation or accepted requirement, its available evidence, and
whether the task was recovered or reconstructed from a historical problem.
```

The three kinds distinguish the following evidence:

| Kind        | Task inputs                                                                                 | Protection claim                                                                     |
| ----------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| selection   | Natural request and the current real candidate catalog or Skill descriptions                | The Agent chooses or excludes the intended guidance for the request                  |
| application | Task and explicit access to the current complete tested content and required reading routes | After reading, the Agent interprets and applies the guidance correctly               |
| journey     | Natural request, current candidates, and a task environment                                 | Selection, reading, and application connect correctly through the observed task path |

A reported selection does not prove that a client automatically loaded a Skill
or that the Agent read it. State the narrower claim unless actual loading or
reading evidence is available. Keep a small number of journeys for distinct
connection failures rather than repeating every application case end to end.

Link static repository materials from `Starting state`, `Verification`, or
`Source` using the normal Markdown reference rules. Fixtures may be copied into
a fresh task environment. Name any state that must be reset, controlled external
responses, required tools, and cleanup. Keep fixtures only large enough to expose
the protected fault while preserving its real decision or integration boundary.

## Discover and select

Before authorized content edits, case maintenance, or replay:

1. Identify the changed or requested files and affected responsibilities. Include
   consumers of a changed reference and catalogs or descriptions whose route
   changes can affect other guidance. Record old and new paths for moves.
2. Inspect nearby `tests/` directories, then inventory all repository-owned case
   entrypoints before filtering by relevance. Include common-ancestor
   directories such as repository-root `tests/`, and new working-tree cases;
   scanning only product and authoring directories or tracked files misses
   protection. Exclude generated dependencies and case fixture subtrees, not
   untracked source cases. Read each
   case's covered links and resolve them relative to that case. Match the
   changed objects against these targets across the entire inventory, including
   joint cases stored elsewhere. Tools inspecting this structure must use the
   repository's Markdown parser, including reference-style link resolution.
3. Select cases protecting affected behavior. For trigger or catalog changes,
   also assess selection cases protecting competing and neighboring routes.
   Expand selection when coverage declarations or impact cannot establish a
   safe exclusion. Link matching finds declared coverage; it does not replace
   responsibility and route analysis.
4. Record the inventory scope, selected IDs and reasons, and excluded related
   cases and reasons. Distinguish confirmed absence from unreadable assets,
   unresolved links, or failed discovery. An unexplained collection failure is
   incomplete, not an empty passing suite.

Do not duplicate joint cases or add per-document lists of tests. Their covered
links provide the canonical relationship. After a move, split, or merge, check
both old and new identities, update coverage and placement, and confirm the
same live responsibility remains protected.

## Replay and evidence

The maintenance Agent coordinates cases and gathers observations. Each
independent case runs in a fresh executor context using a different, materially
lower-capability supported model than the task's authoring comparison model.
Select and record both models, their task suitability, and configuration using
[Agent Skill authoring](../../knowledge-base/plugin/references/agents/skill-authoring.md#prove-the-behavior).
The model must retain the tools, modalities, and context needed by the case.
A smaller reasoning setting on the same model is not the required comparison.

For native sub-Agents, a fresh context removes parent conversation history but
may retain active instructions, installed Skill descriptions, filesystem access,
and other environment. Record the actual inherited boundary and available
observations. Do not claim full isolation or disablement of automatic guidance
without evidence. If ambient content could supply the answer or invalidate the
protected distinction, change the supported execution boundary or report that
case incomplete.

Construct each executor's input from `Task` and the necessary `Starting state`:

- For selection, use the current real candidate set without revealing the target
  name through instructions, fixture names, or wrapper text. Do not provide the
  target body before observing the selection.
- For application, explicitly supply or require reading the current complete
  tested content and its necessary routes. The target may be named because the
  claim concerns behavior after reading.
- For a journey, provide natural inputs and observe the actual selection,
  reading, and task behavior required by its contract.

Withhold `Covered objects`, `Protected behavior`, `Expected behavior`, `Source`,
past outputs, and author or reviewer conclusions. The coordinator may translate
`Verification` into neutral task mechanics or capture hooks, but must not leak
its expected decisions. Keep evaluator-only material and suggestive paths out
of the task workspace when the execution boundary supports doing so.

### Executor instructions

Include the following guard in every executor prompt, alongside the task,
permitted inputs, and neutral execution mechanics. Do not supply the full case
document merely to convey these rules or disclose the target of a selection
case. The guard supplements input and environment separation; it does not
establish that inaccessible or undisclosed material cannot be read.

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

The coordinator and reviewer must assess available access evidence as well as
the worker's report. A clean self-report does not establish absence of answer
access. When evaluator-only material reaches the worker, retain the attempt and
record its execution as incomplete with the contamination or guard violation;
do not derive a pass or a content-regression failure from that run. Fix the
exposure boundary before a new run in an uncontaminated context. Allowed task
guidance is not contamination merely because it teaches the required behavior.

### Record execution

Bind observations to the actual content supplied: commit or exact source
snapshot, plus relevant uncommitted changes or input hashes when the working
tree differs. Use current content for replay; re-scoring an old transcript is
evaluation of that transcript, not a new regression run.

Collect observable choices, final outputs, artifacts, external state, and
available action events. A final explanation can establish an interpretation;
claims about reading, tool effects, or action order need corresponding
observations. For example, “investigate before editing” needs evidence of the
investigation and edit sequence. Self-reported compliance or a semantic judge
cannot fill a missing action trace. When the available Agent interface exposes
only a final message, restrict conclusions to what that message and independently
inspectable artifacts establish.

Set a task-appropriate token or time allowance before running, including
evaluation and any planned retries. Use reported usage when available and mark
unavailable usage as unknown. An exhausted allowance is incomplete. Save cost
by selecting relevant cases, using small fixtures, and batching capable review;
do not reuse old answers or omit needed evidence.

Routine replay asks whether the current content satisfies the contract. To
verify a targeted improvement, compare old and new content with the same task
and configuration when that comparison is needed; an optional no-content run
can distinguish content effects from the model's existing ability. These
comparisons do not make the old output the expected answer or require a costly
comparison matrix for each routine edit.

## Judge and report

Check deterministically observable criteria with program assertions where
available. Give an independent capable reviewer the accepted contract, criteria,
and raw observations for open semantic judgments. It may batch the judgment of
several cases and reuse the existing independent content review. Keep author
conclusions out of its evidence. Calibrate a new semantic rubric with known
satisfactory and faulty observations when needed to establish that it can
distinguish the protected fault; do not use an unverified judge's score alone
as protection evidence.

Classify every criterion and case:

- **Pass:** required observations establish the accepted contract, with no
  critical or forbidden behavior.
- **Fail:** trustworthy observations establish a contract violation. Identify
  the violated criterion and investigate its owner before repair.
- **Incomplete:** a required run, suitable model, fixture, observation, or
  judgment is unavailable or inconclusive. Conflicting judgments need resolution.

A case passes only when all required criteria have trusted passing evidence.
Critical failures cannot be averaged away. Preserve every attempt and explain
any bounded diagnostic replay; a later pass does not erase an earlier failure.
A diagnosed repair can be validated by a new run on the repaired subject while
retaining the earlier failure. An unexplained fail-to-pass change on the same
subject does not establish a trusted pass.
Do not retry until a favorable result or rewrite expectations merely to match
the current Agent. Contract revisions and retirement need independent reasons
that apply the consuming testing workflow's maintenance principles.

Record concise evidence in the existing PR or handoff:

- Inventory and selection scope; selected IDs, related exclusions, and reasons.
- Tested revision or snapshot, candidate construction, comparison and executor
  models, configuration, inherited environment, tools, and observation limits.
- Each attempt's actual observations, criterion judgments, case status, and
  available resource usage; link retained artifacts or logs where useful.
- Diagnosed failures, case or contract changes and rationale, review conclusions,
  unresolved gaps, and the affected maintenance completion state.

Store replay instructions and durable materials in cases rather than appending
every run's conversation. Preserve enough raw evidence for independent judgment
without turning each case into a history log. Existing reader-understanding
checks may reuse runs with the required paraphrase, application, and confusion
observations; obtain missing observations rather than treating a passing final
answer as proof of understanding.
