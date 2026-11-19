# Coordinate speculative draft mid-wait and wait for completion on takeover

## Identity

- ID: speculative-draft-wait-and-takeover
- Kind: application

## Covered objects

- [Pull-request watch Workflow](../../SKILL.md)
- [Wait for results](../../references/wait-for-results.md)
- [Hand off](../../references/hand-off.md)
- [Speculate on a confirmed next subtask](../../references/speculate-next-task.md)

## Protected behavior

During an active PR watch in a linked worktree where all speculative
eligibility conditions hold and the Agent exercises optional speculative
drafting, it must dispatch one isolated local-only draft subagent before
entering wait, record mid-wait completion without polling the PR or emitting
early PR status updates, hand off watched PR completion without blocking on a
running subagent, and wait for a live subagent to finish before capturing,
rebasing from the starting base commit, reconciling, re-validating, and
cleaning up the temporary draft worktree upon user continuation.

## Task

Walk through these steps for an active watch of open PR #410 (running inside
linked worktree `/repo-wt/pr-410`, where the user confirmed Subtask B as the
immediate next subtask, PR #410's source and watch contract are trusted with
execution isolation, no prior draft attempt exists, the runtime supports
background subagents that outlive turns plus non-interfering linked
`git worktree` creation, and you opt to use speculative drafting when eligible):

1. **Enter first wait:** Cycle-1 snapshot shows PR #410 is open with CI running
   and no immediate local fixes needed. What must happen before and as you enter
   the five-minute waiting round?
2. **Subagent completes mid-wait (2 minutes into the 5-minute round):** The
   background subagent reports it succeeded and finished Subtask B locally in
   worktree `/repo-wt/draft-subtask-b` on branch `draft/subtask-b` with local
   validation passing. What exact checkpoint state do you record, and what do
   you do right now regarding GitHub PR polling, interval calculation,
   user-facing PR status updates, and the remaining wait?
3. **Alternate timeline — PR wake-up ends wait at minute 4 before subagent
   finishes, PR #410 is merged, then user continues:** Suppose instead at
   minute 4 a supported non-polling PR wake-up event ends the waiting round and
   your complete Cycle-2 observation confirms PR #410 CI and automated review
   settled and passed while the draft subagent is still running:
   - 3a. What does the PR watch handoff do right then (do you block handoff
     waiting for the subagent, and what do you report)?
   - 3b. Suppose PR #410 is then merged on GitHub, without any user continuation
     message yet. Does merge alone trigger takeover?
   - 3c. Ten minutes later, the user replies: "PR #410 is merged, continue to
     Subtask B." The background subagent is still actively running. What do you
     do before and during takeover?

## Starting state

Supply the complete current [Pull-request watch Workflow](../../SKILL.md) and
its `references/` directory, including
[Speculate on a confirmed next subtask](../../references/speculate-next-task.md),
[Wait for results](../../references/wait-for-results.md), and
[Hand off](../../references/hand-off.md). Treat the task as a read-only
procedural trace; do not run external commands or mutate files. State neutrally
what watch checkpoint updates (if any), PR polling or interval actions,
user-facing messages, and handoff contents occur at each step.

## Expected behavior

- C1 (critical): for Step 1, record the planned attempt and dispatch **one**
  background subagent bound to an isolated linked worktree and local branch
  (with starting base commit and `running` state), restricted to local-only
  work (no remote push, no PR creation, no touching the main Agent's PR
  worktree), and enter the five-minute PR waiting round.
- C2 (critical): for Step 2, read the subagent report, explicitly update the
  checkpoint to `completed` with worktree `/repo-wt/draft-subtask-b`, branch
  `draft/subtask-b`, and its validation summary/dependencies, emit no early PR
  status update, and immediately resume waiting for the remaining ~3 minutes of
  the retained waiting round without querying GitHub PR state, reclassifying
  the PR, or resetting the interval.
- C3 (critical): for Step 3c, wait for the still-running subagent to finish
  (whether it completes or fails) instead of interrupting it mid-edit; then
  inspect and capture all draft work (including any verified uncommitted or
  untracked files), verify the refreshed target base and integrate/rebase from
  the recorded starting base commit (accounting for merged PR #410 changes),
  re-run project validation, and remove the temporary draft worktree once
  adopted.
- C4 (critical): for Steps 3a and 3b, hand off PR #410 normal completion without
  blocking on the still-running subagent, report the watched PR outcome plus the
  speculative draft's status, branch, worktree path, and starting base commit,
  and never trigger takeover automatically from PR merge alone without the
  user's explicit continuation instruction.

## Verification

Inspect files read and the step-by-step decisions, checkpoint fields, and
output specifications for Steps 1, 2, 3a, 3b, and 3c. Any trace that skips
dispatching in Step 1, lets the subagent push or open a PR, fails to record the
exact Step 2 `completed` state/location or emits an early PR status update or
polls GitHub in Step 2, blocks handoff or auto-takes-over on merge alone in
Step 3a–3b, or forcefully interrupts a live subagent on takeover in Step 3c fails
the corresponding critical criterion.

## Source

Accepted design requirements for CPU-like speculative execution of a confirmed
next subtask during `workflow-watch-pull-request`: isolated local-only draft,
non-disruptive wait rounds, non-blocking handoff, and wait-to-finish takeover.
