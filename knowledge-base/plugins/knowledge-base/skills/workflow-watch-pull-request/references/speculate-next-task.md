# Speculate on a confirmed next subtask

Use this reference when a pull-request watch has an explicitly confirmed next
subtask, or when an active or preserved speculative draft from an earlier wait
is ready to coordinate, hand off, or take over.

Speculative drafting is an optional optimization. It never changes the watched
PR's normal completion boundary, mutation freeze, or human-only merge rules, and
it never runs when preconditions are unmet or uncertain.

## Verify eligibility before dispatching

Dispatch at most **one** background subagent for one tight next subtask only
when every condition below holds:

1. **Explicitly confirmed, certain subtask:** The user has already explicitly
   provided or confirmed the immediate next subtask in the current task plan,
   and there is no doubt about whether to start it. Never pull an unconfirmed
   item from an issue tracker or backlog, and never dispatch when eligibility
   or scope is uncertain—when unsure, do not dispatch.
2. **No prior draft state for that subtask:** The watch checkpoint has no
   existing speculative draft entry for that confirmed subtask (whether
   `running`, `completed`, `failed`, `preserved on disk`, `obsolete`, or
   `unknown`), and no other speculative draft subagent is currently active. Do
   not re-dispatch the same subtask on a later waiting round or after a
   checkpoint resume.
3. **Watch contract trust, execution isolation, and linked worktree:**

- The watch contract permits local execution, and the entire draft path
  (worktree setup, PR-controlled worker execution, and local checks) obeys
  [Keep PR-controlled content out of the authority path](establish-watch-contract.md#keep-pr-controlled-content-out-of-the-authority-path):
  for a stacked or dependent subtask branching from the watched PR head, the
  watched PR source is trusted or verified against accepted intent, and the
  draft workspace and worker run without remote-mutation credentials. If
  isolation cannot be established, skip speculative execution.
- The main Agent's current working directory is already inside a linked Git
  worktree (for example, `git rev-parse --git-dir` resolves to a different
  directory from `git rev-parse --git-common-dir`), rather than the
  repository's primary checkout. Some repositories do not support
  `git worktree` development (for example due to shared build caches, ports,
  lockfiles, or environment assumptions), so operating directly in the
  primary clone indicates that concurrent worktree execution cannot be
  assumed safe. If the main Agent is working directly in the primary clone,
  or if worktree status cannot be verified, skip speculative execution.
- Running a second linked worktree concurrently will not interfere with the
  main Agent's workspace through shared build directories, package locks,
  ports, or local daemons; if non-interference cannot be established, skip
  speculative execution.

4. **Runtime support, PR state, and timing:**

- The active runtime supports dispatching and reading an asynchronous
  background subagent and creating a separate isolated linked Git worktree
  and local branch without altering or blocking the main Agent's watched-PR
  worktree.
- The watched PR is still open (not merged or closed), any immediate
  first-cycle autonomous remediation for the watched PR has already been
  committed and pushed so the draft does not start from stale local state,
  and the next subtask does not depend on an unsettled human design choice
  on the watched PR that would likely force discarding the draft.

When any condition fails, record no speculative dispatch and continue the
ordinary watch loop. Both independent subtasks (branched from the target base)
and stacked or dependent subtasks (branched from the current watched PR head)
are eligible when all four conditions hold.

## Dispatch the local-only draft subagent

1. Choose the isolated linked worktree path and local branch name outside the
   main Agent's watched-PR working directory (branched from the target base for
   an independent subtask, or from the captured watched-PR head for a stacked
   subtask) and identify the exact starting base commit SHA. Before creating
   the worktree or launching the worker, record that planned draft attempt
   (`pending-dispatch`, subtask, worktree path, local branch, and starting base
   commit SHA) in the watch checkpoint so any interruption leaves owned
   cleanup identities.
2. Create the linked Git worktree and local branch. If creation fails before
   dispatch, remove only the exact partial directory and temporary branch
   created for this attempt (pruning worktree registration only for that owned
   path), record `failed` (or remove the failed attempt if nothing remains on
   disk while blocking re-dispatch for this round/checkpoint as needed), and
   continue ordinary waiting.
3. Dispatch one background subagent bound to that isolated worktree and branch
   (without remote-mutation credentials) with:
   - the confirmed subtask scope, accepted constraints, and starting base
     commit or watched-PR reference;

- a strict **local-only** mutation boundary: edit files, commit draft
  changes locally (or leave clean local changes if unable to commit), and
  run local project checks inside its own worktree only; **do not** push to
  any remote, create or update a pull request, modify the main Agent's
  worktree, or start another downstream subtask; and
- a structured handoff output requirement: starting base commit used, changed
  files and created local commits, local validation run and outcomes,
  remaining gaps, and known assumptions or dependencies on the watched PR.

4. Update the watch checkpoint immediately with the worker identity and outcome:

- If dispatch starts normally, record `running` and the subagent identity.
- If dispatch returns a **definite rejection or failure** before starting a
  worker, confirm no worker is running, clean up only the exact temporary
  worktree and branch created for this attempt, record `failed` for the
  subtask (preventing automatic re-dispatch), and continue ordinary waiting.
- If dispatch times out or returns an **unknown** launch outcome, record
  `unknown` alongside the recorded identities, do not launch a second draft
  worker, and inspect and reconcile the recorded worker and worktree before
  any cleanup or reuse.

5. **Reconcile an interrupted `pending-dispatch` or `unknown` draft on resume:**
   If watch execution resumes with a checkpoint entry still in
   `pending-dispatch` or `unknown`, preserve the recorded resources and use
   runtime or process evidence to confirm whether a live worker or writer owns
   the recorded worktree and branch before any cleanup or reuse:
   - If **confirmed stopped** (whether the worker never launched or launched and
     exited) with **no usable draft** on disk, clean up only the owned temporary
     worktree and branch created for that attempt and mark `failed` (preventing
     automatic re-dispatch).
   - If **confirmed stopped** and a usable local draft remains on disk, record
     `preserved on disk`.
   - If a live worker or writer **cannot be ruled out**, keep the entry
     `unknown` without modifying or force-removing the directory and do not
     launch a duplicate draft, while allowing safe observation of the watched
     PR to continue.

## Coordinate during the active watch

- **Subagent completes mid-wait:** If the speculative subagent finishes while a
  [Wait for results](wait-for-results.md) round is in progress, read its result.
  Unless the draft has already been marked `obsolete`, update the recorded draft
  state (`completed` or `failed`, worktree path, branch, validation summary, and
  noted dependencies). Do **not** retrieve PR state, reclassify the PR, reset
  the polling interval, or emit a PR status update early; immediately resume
  waiting until the retained round deadline or a relevant PR event.
- **Routine watched-PR fixes:** Do not interrupt or repeatedly steer a running
  speculative subagent when ordinary CI or review fixes update the watched PR.
  Leave rebasing and interface adaptation to the later main-Agent takeover.
- **Invalidation:** When a verified observation shows the watched PR closed
  without merging or underwent a fundamental directional reversal that
  invalidates a recorded stacked draft, mark that draft `obsolete` in the
  checkpoint (continuing safe observation if the PR remains open). Ensure any
  late worker completion cannot overwrite `obsolete` or trigger adoption;
  remove its temporary worktree and branch only after confirming no live
  subagent process still owns that directory.
- **Single-slot cap:** After a speculative draft completes, fails, becomes
  `obsolete`, or records `unknown`, do not automatically dispatch another
  speculative subagent for the same or a further unstarted subtask.

## Handle watch completion and post-watch updates

When the watched PR reaches normal completion, terminal state, or interruption
while a speculative subagent is `running`, has an `unknown` launch/stop state,
or is `obsolete` with a potentially still-live worker:

- Do not delay reporting the watched PR outcome merely to wait for the
  speculative draft to finish, unless the active runtime's session model
  terminates attached background child agents when the main turn ends. In that
  turn-scoped runtime, before ending the turn, either let the worker finish
  within the runtime's bounded wait or stop the worker, applying these mutually
  exclusive branches:
  - **If the draft is already marked `obsolete`:** keep status `obsolete`
    sticky (never overwrite it with `completed`, `preserved on disk`, or
    `unknown`) and track worker shutdown separately—if confirmed stopped,
    remove only the owned temporary worktree and branch; if shutdown cannot be
    confirmed, leave the directory untouched and warn not to remove or inspect
    mutable files until shutdown is confirmed.
  - **Otherwise (when status is `running` or `unknown`):**
    - If the worker **completed normally within the bounded wait**, record
      `completed` (or `failed` if it reported failure) alongside its branch,
      worktree path, starting base commit, validation summary, and dependencies.
    - If the worker did not finish normally and is **confirmed stopped**,
      inspect any on-disk worktree state and record `preserved on disk` (or
      `failed` if no usable draft exists) alongside the branch, worktree path,
      and starting base commit in the checkpoint before concluding.
    - If shutdown **cannot be confirmed**, do **not** inspect mutable
      working-tree files; record status `unknown` alongside the branch,
      worktree path, and starting base commit, and note in the handoff that
      takeover must confirm shutdown or adopt only a verified immutable commit
      from a separate workspace or start cleanly.
- Include the speculative draft's current status (`running`, `completed`,
  `failed`, `preserved on disk`, `obsolete`, or `unknown`), branch name,
  worktree path, starting base commit, separate worker-shutdown state when
  unconfirmed, and a note that takeover waits for the user's explicit
  instruction to continue.

If the watch handoff already completed and the background subagent later finishes
and notifies the session before the user instructs continuation, read its output,
concisely report or update the recorded draft location and status (preserving
`obsolete` if already invalidated), and wait for the user. If the client runtime
does not deliver background wakeups after handoff, reconcile the checkpointed
draft status when the session next runs on continuation or resume without
restarting observation of the finished PR. Do **not** preemptively rebase, push,
or publish the draft before the user directs the next task.

## Take over on user continuation

Start takeover only when the user explicitly instructs continuing to the next
subtask (not automatically because the watched PR merged).

1. **Reject `obsolete` drafts and wait for a live subagent (or isolate an
   unwaitable worker):**

- **If the draft's recorded status is `obsolete`:** do **not** adopt it (skip
  both mutable inspection and immutable-commit adoption, even if the target
  base contains the PR changes). Remove the temporary worktree and branch
  only after confirming no live worker still owns that directory, and start
  the next subtask cleanly on a fresh branch from the updated target base.
- If the dispatched subagent is still running normally when the user
  instructs continuation, **wait for it to finish** (whether it completes or
  fails) before inspecting or modifying its worktree or branch; never
  forcefully interrupt mid-edit to take over half-written files. If a late
  completion arrives for an already-`obsolete` draft, keep it rejected.
- If the subagent is no longer alive (such as after a cross-session
  checkpoint resume) or the runtime reports that it timed out, became
  unresponsive, or cannot be waited on further, confirm first whether the
  worker has actually stopped:
  - **Confirmed stopped:** proceed to Step 2 in its preserved worktree (or
    start fresh on a new branch if the worktree is empty or unusable).
  - **Cannot confirm stopped (process might still be writing):** do **not**
    inspect mutable working-tree files or edit inside that directory. Either
    adopt only an **immutable existing local commit** already created on the
    draft branch by transplanting that pinned commit SHA from the main
    Agent's separate workspace (if its committed diff is complete and valid
    for the confirmed subtask, skipping Step 2), or leave the active
    directory untouched and start fresh on a separate clean branch/worktree
    (or defer takeover until runtime evidence confirms the worker exits).
    Never force-delete files whose ownership or writer state is uncertain.

2. **Capture and inspect confirmed-stopped draft work:** Read the subagent's
   final report and inspect `git status`, local commits, and diffs in the draft
   worktree. Verify any uncommitted or untracked changes directly against the
   confirmed subtask scope (treating the worker's manifest only as a pointer,
   not proof), and commit or capture those draft-only changes onto the draft
   branch while excluding build artifacts or unrelated files.
3. **Verify target base and integrate from the starting base commit:** Refresh
   the target base (for example, the updated default branch after the watched PR
   merged). For a stacked draft, verify that the refreshed target base actually
   contains the watched PR's expected dependency (if the watched PR closed
   unmerged or omitted an assumed change, reconcile or pause for human
   direction rather than blindly transplanting onto an incompatible base). Move
   to or prepare the main Agent's working branch from that updated base, and
   transplant only the draft's changes above its recorded starting base commit
   SHA (for example, rebasing or cherry-picking the range after the starting
   base commit onto the updated target base so commits from a squash-merged or
   rebased watched PR are not replayed).
4. **Reconcile and validate:** Compare the integrated diff against the final
   landed watched-PR changes and confirmed subtask scope, resolve any conflicts
   or interface/behavior adjustments, and re-run the active project's required
   validation.
5. **Clean up:** Once the draft work is safely adopted onto the main Agent's
   working branch and verified (and only when no live worker still owns the
   draft directory), remove the temporary draft worktree and any obsolete
   temporary draft branch before continuing normal development.
