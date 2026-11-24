---
name: workflow-watch-pull-request
description: Use when watching or resuming a pull request through ongoing review and CI activity.
---

# Watch a pull request

Own PR observation, the watch contract, external operations, and the continuing
watch lifecycle. Keep each item's disposition separate from deciding whether
to execute, wait, or finish. A human-owned item or mutation freeze does not by
itself end observation.

## Establish or resume a stopped watch

Read [Establish the watch contract](references/establish-watch-contract.md) and
[Security boundaries and trust transitions](../../references/security/security-boundaries.md).
Establish the complete contract and checkpoint-resume safeguards before
observation or mutation. If a checkpoint has an unknown-result operation, read
[Reconcile an unknown effect](references/reconcile-unknown-effect.md) before
dependent work.

When the PR is draft or accepted intent may include entering review, also read
[Pull request review readiness](../../references/github/pull-request-review-readiness.md)
and record its one-shot authority and transition-history baseline in the
contract. Restart contract establishment whenever observation invalidates the
watched subject, trusted control revision, accepted intent, access, safe
workspace, or mutation boundary (keeping non-autonomous renewals human-only).

## Observe and classify

Start a new watch, or resume one after execution stopped, with an immediate
complete observation, then repeat. A runtime yield, tool return, or unrelated
background subagent completion during an active waiting round is not a resumed
watch: stay in the selected wait until that round ends.

1. Read [Capture the PR state](references/capture-pr-state.md) for one complete
   current snapshot (source identity, thread baselines, and relevant automation
   through expected result publication).
2. For each new or materially changed feedback batch (and after resumed work or
   changed evidence; an earlier batch never decides a new one), ensure
   [Independent collaboration](../../references/agents/independent-collaboration.md)
   is in context (read in full when missing or changed), then read
   [Code review feedback handling](../../references/code-review/feedback-handling.md)
   and apply it using the contract and captured work.
3. When factual title or description maintenance may be needed, read
   [Update PR metadata](references/update-pr-metadata.md) to assess eligibility
   before selecting a write.
4. Read [Classify the PR state](references/classify-pr-state.md). Record
   dispositions, dependencies, any PR-wide freeze, currently executable admitted
   operations, and settled, progressing, or blocked automation. If verified
   observation shows the PR closed unmerged or reversed direction invalidating
   a recorded stacked draft, follow
   [Speculate on a confirmed next subtask](references/speculate-next-task.md) to
   mark it `obsolete` (cleaning up only when safe) before choosing handoff or
   the next action. Classify the complete snapshot before any mutation.

## Choose the cycle action

Use the first applicable branch. Classification owns action admission and freeze
scope; this order owns watch scheduling and completion:

1. **PR merged or closed:** verify and report the terminal state via
   [Hand off](references/hand-off.md).
2. **Safe observation cannot continue** (identity, required visibility, or
   runtime is unusable and not autonomously restorable): checkpoint and report
   an interrupted watch via [Hand off](references/hand-off.md).
3. **Executable autonomous work remains** after applying dependencies and freeze
   scope: execute the selected operations below.
4. **Relevant automation can still produce an expected result autonomously:** if
   an explicitly confirmed next subtask has no recorded speculative draft state
   yet, check
   [Speculate on a confirmed next subtask](references/speculate-next-task.md)
   first; then read [Wait for results](references/wait-for-results.md) to run
   one waiting round until its retained deadline or a relevant PR event,
   retaining human-owned and deferred items.
5. **All relevant automation ended with definite retrieved results, those
   results are classified, no autonomous work remains executable, and no unknown
   outcome blocks final verification:** verify and report normal completion via
   [Hand off](references/hand-off.md).
6. **A relevant automatic result or outcome needed for final verification is
   unsettled, needs human intervention, and no independent work or expected
   result can advance:** checkpoint and report an interrupted watch via
   [Hand off](references/hand-off.md).

Normal completion requires settled current-head automation and no executable
autonomous work under current dependencies and freeze scope. Failed,
cancelled, or timed-out runs are definite results to classify first. Human
remediation or work deferred by a human-owned freeze still allows normal
completion. Required human approvals and decisions do not bypass waiting.
Missing evidence never establishes completion: investigate it or identify the
interruption.

Never retrieve PR state or send a status update merely because the runtime
yields, a waiting tool returns early, or a speculative draft subagent completes
mid-round. After a waiting round ends and complete observation and
classification finish, a status update may report that round's result and next
interval even when no autonomous work was found.

## Execute the selected operations

Apply only operations classified as currently executable:

- **Source remediation:** use the active project's implementation and validation
  workflows, applying shared feedback verification and accounting for
  review-driven changes before publication or replies. Read
  [Publish fixes](references/publish-fixes.md) for focused commits, aggregate
  validation, and ordinary non-force push.
- **Review replies and thread resolution:** read
  [Reply and resolve](references/reply-and-resolve.md) after selected work
  completes and any source fix is published.
- **Factual title or description updates:** run the assessed procedure in
  [Update PR metadata](references/update-pr-metadata.md).
- **Transient CI replay:** invoke the exact classification-admitted
  validation-only replay unit once and record the attempt.
- **Post-remediation automated review trigger:** confirm from the captured
  snapshot that satisfying remediation is published and visible on the PR and
  no automatic review started for it; invoke the exact classification-admitted
  full-evaluation trigger or full workflow rerun once, record the run or
  attempt identity, and return to observation.
- **Entering review:** apply the shared readiness procedure loaded at contract
  establishment. After a verified transition, start a new complete observation
  before dependent mutation; return a frozen or failed outcome to classification
  without retrying.

When an operation's result is unknown, read
[Reconcile an unknown effect](references/reconcile-unknown-effect.md) before
dependent work or replay. When new evidence changes a remedy, dependency, or
admission, withhold affected operations and return to classification (re-capturing
if PR identity or baseline changed). Operation references do not independently
finish the watch.

After an ordinary successful operation, take the next dependent step without an
extra complete PR retrieval solely for a small race. Once admitted work and
accounting complete, return to observation; a new published head requires its
own automation results before normal completion.

## Completion criteria

Complete only after reporting the verified normal or terminal outcome. If
execution ends without those conditions, report an interruption and preserve the
resume checkpoint; never claim monitoring continues after execution stops.
