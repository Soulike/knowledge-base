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

Scenario-specific materials, initial state, reset requirements, fixture state,
and task-specific tool or action boundaries. Include conditions for constructing
the current candidate set or supplying the current tested content. The shared
replay framework supplies the execution configuration around this state.

## Expected behavior

Independently accepted required, forbidden, and allowed behavior. Give each
criterion a stable label and identify any critical failure.

## Verification

Case-specific observable evidence for each criterion. Identify program
assertions, fault controls, and evidence required for process claims. The replay
framework supplies dispatch, reviewer handoff, attempt retention, and result
rules around those observations.

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

## Separate case contracts from replay execution

Like a unit test and its test runner, a case defines what behavior to exercise
and observe, while the repository's author-matched replay policy composes with
[Agent behavioral evaluation](../../knowledge-base/plugins/knowledge-base/references/agents/behavioral-evaluation.md)
for how that case runs. Case assets own the task, scenario data, fixtures,
expected behavior, and case-specific evidence; the shared evaluation reference
owns generic isolation, withholding, dispatch, execution recording, and
attempt-retention mechanics.

`Starting state` declares the capabilities, permissions, writable fixtures,
external controls, or exceptional resource characteristics specific to the
scenario. `Verification` declares the observations, assertions, and controlled
faults that distinguish that case's accepted behavior. A case whose tested
subject is the evaluation framework itself includes the relevant configuration
as task data and expected behavior.

Link static repository materials from `Starting state`, `Verification`, or
`Source` using the normal Markdown reference rules. Fixtures may be copied into
a fresh task environment. Name any state that must be reset, controlled external
responses, required tools, and cleanup. Keep fixtures only large enough to expose
the protected fault while preserving its real decision or integration boundary.

## Discover and select

Before authorized content edits, case maintenance, or replay:

Use `pnpm agent-tests:list` to obtain the statically validated repository case
inventory, including nonignored untracked source cases. The checker at
[check-agent-regression-tests](../../knowledge-base/tools/check-agent-regression-tests/check.ts)
uses parsed Markdown for required sections, identities, covered links, nearest
placement, and material references. `pnpm agent-tests:check` is part of the free
repository check; neither command selects cases, dispatches Agents, or judges
behavior. A failed inventory command is an incomplete discovery, not an empty
suite. Inspect the selected case assets to prepare the actual replay inputs.

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

## Replay policy and review schedule

Run selected regression cases using the repository's author-matched model
policy, and delegate all generic behavioral-evaluation mechanics one-way to
[Agent behavioral evaluation](../../knowledge-base/plugins/knowledge-base/references/agents/behavioral-evaluation.md):

- **Author-matched model baseline:** before dispatch, identify the model that
  materially authored the current change and run each independent case in a
  fresh executor context using that same supported model (and task-appropriate
  capability-relevant configuration such as reasoning effort when exposed),
  retaining needed tools, modalities, and context. Record the authoring model,
  executor configuration, and model-matching basis. When several models
  materially authored different affected behaviors, match each case to the
  model that authored the behavior it validates. For human-only authorship,
  select a task-suitable supported model and record that no authoring-model
  match exists. If the required authoring model is unavailable, an optional
  task-suitable fallback may supply diagnostic observations only; keep the
  affected replay `incomplete`. Missing model matching for any other reason
  also leaves the replay `incomplete`.
- **Evaluation mechanics and case mapping:** delegate generic isolation, input
  separation, dispatch, recording, and judgment mechanics one-way to
  [Agent behavioral evaluation](../../knowledge-base/plugins/knowledge-base/references/agents/behavioral-evaluation.md)
  (including its verbatim
  [executor instructions guard](../../knowledge-base/plugins/knowledge-base/references/agents/behavioral-evaluation.md#executor-instructions),
  [dispatch templates](../../knowledge-base/plugins/knowledge-base/references/agents/behavioral-evaluation.md#dispatch-templates),
  [execution recording](../../knowledge-base/plugins/knowledge-base/references/agents/behavioral-evaluation.md#record-execution),
  and
  [result classification and attempt retention](../../knowledge-base/plugins/knowledge-base/references/agents/behavioral-evaluation.md#judge-and-retain-attempts)).
  Map each case's `Task` and `Starting state` into the executor prompt
  (translating `Verification` only into neutral capture hooks) while
  withholding `Covered objects`, `Protected behavior`, `Expected behavior`,
  `Source`, past outputs, and author or reviewer conclusions.
- **Single-reviewer scheduling:** when content maintenance is also under
  review, route open case judgments into the same capable reviewer scheduled by
  [final validation](../skills/maintain-knowledge-base/SKILL.md#final-validation)
  rather than commissioning a separate case reviewer or a verdict before that
  review. When reusing a case run for reader-understanding evidence, delegate
  reuse eligibility and neutral follow-ups one-way to
  [Prepare independent observations](../../knowledge-base/plugins/knowledge-base/references/agents/reader-understanding.md#prepare-independent-observations).

## Pull-request and handoff regression evidence

Include the regression inventory, execution, and disposition fields required by
[`AGENTS.md`](../../AGENTS.md#behavioral-and-documentation-change-evidence)
in the pull-request description or handoff:

- Inventory and selection scope, selected case IDs, related exclusions, and
  selection/exclusion reasons (or an explicitly confirmed empty inventory;
  failed discovery is `incomplete`).
- Tested revision or snapshot, candidate construction, authoring-model and
  executor-model match, capability-relevant configuration, inherited
  environment, tools, and observation limits.
- Each attempt's actual observations, criterion judgments, case status (`pass`,
  `fail`, or `incomplete`), adjacent executor identity and configuration, and
  available resource usage, linking retained artifacts or logs where useful.
- Diagnosed failures, case or contract changes and rationale (applying
  [maintain-knowledge-base-tests](../skills/maintain-knowledge-base-tests/SKILL.md)
  dispositions), independent review conclusions, unresolved gaps, and affected
  maintenance completion state.

Store replay instructions and durable materials in `case.md` and fixtures
rather than turning each case into a conversation history log.
