---
name: watch-pull-request
description: Watch or resume watching a trusted or verified pull request across ongoing review comments, review threads, and CI activity; autonomously perform bounded remediation; and hand off after relevant automation has settled and no autonomous work remains executable. Report terminal PRs and interrupted execution separately. Use when the user requests continued monitoring and handling rather than a one-time inspection, review, diagnosis, or bounded fix.
---

# Watch a pull request

Own PR observation, the watch contract, external operations, and the continuing
watch lifecycle. Keep each item's disposition separate from the decision to
execute, wait, or finish the watch. A human-owned item or a mutation freeze does
not by itself end observation.

## Establish or resume a stopped watch

Read [Establish the watch contract](references/establish-watch-contract.md) and
[Security boundaries and trust transitions](../../references/security/security-boundaries.md).
Establish the complete contract and complete the checkpoint-resume safeguards
before observation or mutation. When a checkpoint contains an operation with an
unknown result, read
[Reconcile an unknown effect](references/reconcile-unknown-effect.md) and
establish its result before dependent work.

When the PR is draft or accepted intent may include entering review, also read
[Pull request review readiness](../../references/github/pull-request-review-readiness.md).
Record its one-shot authority and transition-history baseline in the contract.
Restart contract establishment whenever observation invalidates the watched
subject, trusted control revision, accepted intent, access, safe workspace, or
mutation boundary; apply the contract's human-only boundaries when renewal is
not autonomous.

## Observe and classify

Start a new watch, or resume one after its earlier execution stopped, with an
immediate complete observation, then repeat. A runtime yield, tool return, or
execution continuation while a retained waiting round is still in progress is
not a resumed watch: remain in the selected waiting action until that round
ends.

1. Read [Capture the PR state](references/capture-pr-state.md) and retrieve one
   complete current snapshot, including the source identity, thread baselines,
   and relevant automation through its expected result publication.
2. For each new or materially changed feedback batch, read
   [Code review feedback handling](../../references/code-review/feedback-handling.md).
   Establish its context from the contract and captured work, then apply its
   investigation, scope, remedy, and verification criteria. Reassess after
   resumed work or changed evidence; an earlier batch does not decide this one.
3. When factual title or description maintenance may be needed, read
   [Update PR metadata](references/update-pr-metadata.md) to assess eligibility
   before selecting a write.
4. Read [Classify the PR state](references/classify-pr-state.md). Record each
   item's disposition and dependencies, any PR-wide mutation freeze, and which
   admitted operations remain executable after applying those dependencies and
   freezes, and which relevant automatic processes are settled, progressing, or
   blocked. Classify the complete snapshot before executing any selected
   mutation.

## Choose the cycle action

Use the first applicable row. The classification owns action admission and
freeze scope; this table owns watch scheduling and completion.

| Current state                                                                                                                                                                                                | Next action                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The PR is merged or closed.                                                                                                                                                                                  | Verify and report the terminal state through [Hand off](references/hand-off.md).                                                                                                                                                                         |
| Safe observation of the watched PR cannot continue because its identity, required visibility, or runtime is unusable and cannot be restored autonomously.                                                    | Checkpoint and report an interrupted watch through [Hand off](references/hand-off.md).                                                                                                                                                                   |
| Currently executable autonomous work remains after applying dependencies and freeze scope.                                                                                                                   | Execute the selected operations below.                                                                                                                                                                                                                   |
| Relevant automation can still produce an expected result without human intervention.                                                                                                                         | Read [Wait for results](references/wait-for-results.md), establish or continue one waiting round, and return to complete observation only when its retained deadline or a relevant event ends it. Retain human-owned and deferred items during the wait. |
| All relevant automation has ended with definite, retrieved results, those results have been classified, no autonomous work remains executable, and no unknown operation outcome prevents final verification. | Verify and report normal completion through [Hand off](references/hand-off.md).                                                                                                                                                                          |
| A relevant automatic result or operation outcome needed for final verification remains unsettled, obtaining it requires human intervention, and no independent work or expected result can advance.          | Checkpoint and report an interrupted watch through [Hand off](references/hand-off.md).                                                                                                                                                                   |

Normal completion requires both settled current-head automation and no work
that can proceed autonomously under the current dependencies and freeze scope.
A failed, cancelled, or timed-out run supplies a definite result; classify its
resulting work before deciding to finish. When only human remediation or work
deferred by a human-owned freeze remains, normal completion applies. Required
human approvals and decisions do not bypass the waiting row. Missing evidence
does not establish completion: investigate it or identify the concrete
interruption.

Do not retrieve PR state or send a user-facing status update merely because the
runtime yields or a waiting tool returns before the retained deadline. After a
waiting round ends and its resulting complete observation and classification
finish, a status update may report that round's result and the next scheduled
interval even when no autonomous work was found.

## Execute the selected operations

Apply only the operations classified as currently executable:

- **Source remediation:** use the active project's implementation and validation
  workflows. For review-driven changes, apply shared feedback verification and
  accounting before dependent publication or replies. Read [Publish fixes](references/publish-fixes.md) for
  focused commits, aggregate validation, and the ordinary non-force push.
- **Review replies and thread resolution:** read
  [Reply and resolve](references/reply-and-resolve.md) after the selected work
  is complete and any source fix is published.
- **Factual title or description updates:** execute the previously assessed
  procedure in [Update PR metadata](references/update-pr-metadata.md).
- **A transient CI replay:** invoke the exact validation-only replay unit
  admitted by classification once and record the resulting attempt.
- **Entering review:** apply the shared readiness procedure loaded at contract
  establishment. After a verified successful transition, start a new complete
  observation before dependent mutation. Return a frozen or failed outcome to
  classification without another transition attempt.

When an operation's result is unknown, read
[Reconcile an unknown effect](references/reconcile-unknown-effect.md) before
dependent work or replay. When new evidence changes a remedy, dependency, or
admission decision, withhold affected operations and return to classification;
retrieve a new complete snapshot when the PR identity or observation baseline
changed. Operation references do not independently decide to finish the watch.

After an ordinary successful operation, perform the next dependent step without
an extra complete PR retrieval solely to close a small race. Once the admitted
work and its accounting are complete, return to observation. A new published
head requires its own automation results before normal completion.

Complete only after the verified normal or terminal outcome has been reported.
If execution ends without those conditions, report an interruption and preserve
the resume checkpoint; never claim that monitoring continues after execution
stops.
