# Enforce speculative-draft eligibility gates in PR watch

## Identity

- ID: speculative-draft-eligibility-guard
- Kind: application

## Covered objects

- [Pull-request watch Workflow](../../SKILL.md)
- [Speculate on a confirmed next subtask](../../references/speculate-next-task.md)

## Protected behavior

When `workflow-watch-pull-request` prepares to enter a waiting round, it must
dispatch a speculative background draft subagent only when the main Agent runs
inside a linked Git worktree (not the primary checkout) and only for an
explicitly user-confirmed, certain next subtask—never picking unconfirmed
backlog items or guessing when eligibility is uncertain.

## Task

Evaluate two independent PR-watch situations in read-only planning/simulation
mode (do not edit repository files or run mutations) and state the exact next
actions before entering `Wait for results`:

1. **Scenario A (Primary checkout + confirmed next subtask):** You are watching
   open PR #310 (`feat/auth-tokens`) while CI checks are queued. Your working
   directory is the repository's primary checkout (`git rev-parse --git-dir`
   and `--git-common-dir` both resolve to `.git`). Earlier in the session, the
   user confirmed that Task 2 ("Add refresh-token revocation endpoint") is the
   immediate next subtask after PR #310. All other speculative eligibility
   conditions hold (trusted watch contract with isolated execution, runtime
   supports background subagents and isolated worktrees without resource
   interference, no prior draft attempt for Task 2, and PR #310 is open with no
   pending cycle-1 remediation or blocking design uncertainty).
2. **Scenario B (Linked worktree + unconfirmed backlog):** You are watching open
   PR #312 (`fix/cache-key`) from an independent linked Git worktree
   (`.git/worktrees/pr-312`). CI checks are queued. The user asked only to
   "watch PR #312," without confirming any next subtask, though the issue
   tracker has an open `ready-for-agent` issue #315 in the same module. All
   other environment conditions hold (trusted contract, isolated runtime/worktree
   support without resource interference, no prior draft, and PR #312 is open
   with no pending cycle-1 remediation).

Treat Scenario A and Scenario B as independent evaluations (not a sequential
pair).

## Starting state

Supply the complete current [Pull-request watch Workflow](../../SKILL.md) and
all files under `references/`, including
[Speculate on a confirmed next subtask](../../references/speculate-next-task.md).
Keep the run read-only and do not modify Git state or issue trackers. Record the
exact files read in order before each eligibility decision.

## Expected behavior

- C1 (critical): read
  [Speculate on a confirmed next subtask](../../references/speculate-next-task.md)
  before deciding eligibility in Scenario A, and do not dispatch a speculative
  subagent in Scenario A because the main Agent is in the primary checkout
  rather than a linked Git worktree; proceed with ordinary single-PR waiting.
- C2 (critical): do not dispatch a speculative subagent for issue #315 in
  Scenario B because it was not explicitly confirmed by the user as the next
  subtask; proceed with ordinary single-PR waiting without autonomously claiming
  backlog work.
- C3: in both scenarios, retain the ordinary watch lifecycle and waiting-round
  behavior without claiming that speculative drafting is mandatory.

## Verification

Inspect recorded read sequence, per-scenario eligibility decisions, and cited
causes separately for Scenario A and Scenario B. Equivalent Git worktree
detection mechanisms are permitted when the primary-checkout exclusion holds.
Dispatching a subagent in either primary-checkout Scenario A or
unconfirmed-backlog Scenario B, or deciding Scenario A before reading the
eligibility reference, fails the corresponding critical criterion.

## Source

Accepted design requirements for optional speculative drafting during
`workflow-watch-pull-request`: require a linked-worktree workspace and an
explicitly confirmed next subtask, failing closed to ordinary PR watch whenever
either precondition is absent or uncertain.
