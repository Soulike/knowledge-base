---
name: maintain-knowledge-base-tests
description: Create, replay, review, and maintain behavioral regression cases for Knowledge, Skills, and references in this repository. Use for case-only tasks and for preserving or rerunning cases during knowledge-base content maintenance.
---

# Maintain knowledge-base regression tests

Preserve independently established behavior as replayable cases, then check it
again when related content changes. This authoring workflow owns regression
cases for Agent use of knowledge-base content; ordinary implementation tests
use the repository's applicable testing workflows.

## Establish the task

1. Resolve repository paths relative to this `SKILL.md`; the root is
   `../../..`. Follow its active instructions and distinguish assessment,
   replay, and authorized edits. A case-only request does not authorize changes
   to the content it tests. Content classification and placement use
   [maintain-knowledge-base](../maintain-knowledge-base/SKILL.md).
2. Identify the content, live behavior, requested operation, and available
   evidence. For selecting new protection, read and follow
   [write-effective-tests](../../../knowledge-base/plugin/skills/write-effective-tests/SKILL.md).
   For review of proposed or existing cases, coverage, execution, failures,
   cost, or retirement, read and follow
   [review-and-improve-tests](../../../knowledge-base/plugin/skills/review-and-improve-tests/SKILL.md).
   Apply their selected Knowledge and dispositions to Agent behavior as to
   other tested behavior; these cases have no separate test-quality standard.
3. Read the shared
   [case format and placement rules](../../references/agent-regression-tests.md#case-assets)
   and [discovery rules](../../references/agent-regression-tests.md#discover-and-select).
   Inventory all repository case entrypoints before choosing new protection or
   selecting replays. Map changed content and responsibilities to existing
   coverage, including joint cases and competing selection routes. Record each selected or excluded
   case's reason; distinguish a confirmed empty inventory from failed discovery.

## Write or maintain cases

4. For authorized case creation or revision, establish an independent behavior
   contract with the maintainer's accepted requirements. Identify the realistic
   fault, permitted variation, observation that distinguishes them, and existing
   protection. Preserve only distinct, needed protection; an observed validation
   attempt does not automatically deserve a permanent case.
5. Use the shared format to separate the task and starting materials from the
   evaluator's expected behavior. Declare covered objects with relative Markdown
   file links and place one copy near those objects. Confirm the
   [content-enumeration prerequisite](../../references/agent-regression-tests.md#case-assets)
   before registering cases. When the required tooling repair is outside the
   authorized scope, report that prerequisite and leave registration incomplete.
6. Make the case independently replayable with current content, bounded starting
   state, observable criteria, and an evaluation method. Recover an original
   validation task when available. A reconstructed case must identify its
   historical derivation and receive fresh validation; an issue summary or old
   passing verdict is not execution evidence.
7. For moves, splits, merges, or responsibility changes, repair covered links,
   fixtures, placement, and affected discovery routes while retaining stable
   case identities. Reassess the contract before changing expectations or
   retiring protection. Apply the testing workflow's dispositions; a failure
   alone does not justify deletion or a weaker expectation.

## Replay and judge

8. Read the shared
   [replay protocol](../../references/agent-regression-tests.md#replay-and-evidence)
   and [result rules](../../references/agent-regression-tests.md#judge-and-report).
   Establish the current source identity, available execution boundary,
   task-appropriate lower-capability model, observation methods, and bounded
   resource allowance before dispatch. Report missing prerequisites explicitly.
9. Give each independent case a fresh lower-capability Agent context containing
   only the permitted task inputs. Include the shared
   [executor instructions](../../references/agent-regression-tests.md#executor-instructions)
   in every dispatched prompt; a rule read only by the coordinator does not
   constrain the worker's supplied instructions. Collect its actual choices, artifacts, and
   available action evidence. Execute applicable program assertions and pass
   open semantic criteria with the contract and raw observations to an
   independent capable reviewer. The reviewer may evaluate several independent
   runs together; do not let their executor contexts teach one another.
10. Attribute failures to tested content, case, fixture, execution boundary,
    model suitability, or evaluation before repairing the authorized owner.
    Retain every attempt and investigate instability with a bounded protocol.
    Missing execution or evidence remains incomplete. Reuse observations for
    [reader-understanding review](../maintain-knowledge-base/references/review-reader-understanding.md)
    only when they supply all its required observations; obtain missing ones.

## Verify and complete

11. Check the final case inventory, stable identities, covered links, material
    references, and dispositions. Run available case-specific static checks and
    the repository's required checks for the changed artifacts, including
    `pnpm check` and `git diff --check`. Static validity does not establish Agent
    behavior. Content changes additionally follow the content-maintenance
    workflow's review and version requirements.
12. Report selected and excluded cases with reasons, tested source and model
    identities, each attempt's observations and criterion results, and every
    pass, failure, or incomplete result using the shared report rules. Put
    concise evidence in the PR or handoff; keep case assets focused on replay.

For assessment, complete the scoped dispositions and identify missing evidence.
For delivery, complete every authorized case disposition and required check.
Historical regression replay is complete only when all selected cases have
trusted passing evidence; unresolved failures or incomplete cases leave the
affected maintenance unfinished. Preserve protection whose value remains
unresolved and disclose any scope or capability limit.
