# Preserve Codex Workflow selection boundaries

## Identity

- ID: codex-workflow-description-routing
- Kind: selection

## Covered objects

- [Codex Skill resolution Workflow](../../workflow-resolve-invoked-codex-skill/SKILL.md)
- [User-answer wait Workflow](../../workflow-wait-for-user-answer/SKILL.md)

## Protected behavior

The Codex-specific Workflows must remain discoverable from their intended Codex
tasks while excluding generic discovery and already-answered follow-up states.
Protect exact-invocation resolution and pending-question gating while allowing
unrelated Handbooks or Workflows to be selected when a request independently
needs them.

## Task

For each independent request or task state below, choose the applicable
installed guidance from the current candidate metadata, or choose none:

1. Codex was explicitly told to use `$deployment-audit`, but that exact Skill's
   instructions are missing from the current context. Resolve it before
   reporting that the Skill is unavailable.
2. Find any installed Skill that could help me brainstorm release notes; no
   exact Skill was invoked or required.
3. In Codex, the next safe step depends on whether the user authorizes deletion
   of a production resource. Ask the question and keep dependent work pending
   until the user actually answers.
4. In Codex, the user already answered the pending migration question, so
   continue the dependent work from that answer.

Return the chosen identifiers and a short reason for each request. Do not open
candidate bodies or perform the substantive tasks.

## Starting state

Build the target-model candidate set from the installed `codex` plugin Skill
entrypoints (`handbook-codex`, `workflow-resolve-invoked-codex-skill`, and
`workflow-wait-for-user-answer`) together with the installed `knowledge-base`
base-plugin Skills. Supply all four requests and candidate names and
descriptions without opening candidate bodies. A request that receives only
this task and the exact candidate metadata is a supported selection boundary;
when repository access is available instead, keep it read-only and do not open
candidate bodies.

Record the complete candidate metadata and every choice before any candidate
body is opened. Treat each numbered request independently; a choice for one
request must not teach later requests the expected route.

## Expected behavior

- R1 (critical): select `workflow-resolve-invoked-codex-skill` for request 1
  and exclude it for the generic discovery request in request 2.
- R2 (critical): select `workflow-wait-for-user-answer` for request 3 and
  exclude it once the answer is available in request 4.
- R3: preserve independently applicable additional choices, but do not select
  either target Workflow merely because its subject noun appears in an excluded
  request.
- R4: report metadata choices only, without claiming that a client loaded or
  read a selected Skill or that any substantive task was completed.

## Verification

Capture one identifier list and reason per numbered request. Compare every
request with the trusted pre-rename descriptions from integration commits
`e008e1a` (for `workflow-resolve-invoked-codex-skill`) and `d60172e` (for
`workflow-wait-for-user-answer`) and with the final candidate metadata.

A controlled faulty observation that resolves a Skill without an exact
invocation, omits `workflow-resolve-invoked-codex-skill` on an exact missing
invocation, omits `workflow-wait-for-user-answer` before an answer, or selects
it to advance past an already-answered question must fail the corresponding
criterion.

## Source

Split from `workflow-description-routing` per #303 and #308 so the `codex`
plugin owns its Codex-only Workflow description-routing boundaries (originally
established in GitHub issues #242, #248, and #249 against integration commits
`e008e1a` and `d60172e`).
