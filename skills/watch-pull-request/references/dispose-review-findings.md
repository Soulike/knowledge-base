# Dispose review findings

Map the results of the shared
[Code review feedback handling](../../../references/code-review/feedback-handling.md)
to PR effects. The shared reference owns investigation, technical disposition,
source-remediation need, scope, and remedy criteria; this reference owns the
watch's operational disposition.

## Consume the handling result

Require the shared pre-mutation record for every finding before an edit,
commit, push, reply promising a change, or other dependent mutation. Its scope
basis must come from the watch contract's trusted authorities, and its evidence
must apply to the captured PR identity and head. Return stale or incomplete
results to shared handling before selecting an operation.

Record the resulting cycle disposition and why the handling result and watch
contract authorize it. When source-remediation need remains undetermined,
select `human decision required` and preserve the affected source. When the
shared handling cannot establish one materially reasonable proportionate
response, also select `human decision required`, preserve the affected work,
and either stop the affected remediation or apply the PR-wide mutation freeze
selected by the PR-state classification. Otherwise enter the corresponding
branch below.

## No technically required source change

Use this branch when shared handling establishes that no source remediation is
required. An optional improvement does not authorize a source edit in this
watch. A reply explaining a fix already on the captured head belongs here; a
reply reporting or promising a current-cycle source change requires the
source-change branch.

- When one factual response follows from the handling evidence and accepted
  intent and a reply is appropriate, select `autonomous work` for that reply
  only. The reply must not promise a source change, and its operation must pass
  the autonomy gate.
- When no reply is needed, classify the finding as non-actionable.
- When reply content requires a material choice or lacks sufficient evidence,
  select `human decision required`. When the response is known but publishing
  it needs unavailable authority, access, or credentials, select
  `human intervention required`.

No disposition in this branch applies a PR-wide mutation freeze.

## Technically required source change

Use this branch when shared handling establishes that source remediation is
required. Apply its scope disposition and selected remedy as follows:

- When the required change is outside accepted PR intent, select
  `human decision required` and apply a PR-wide mutation freeze even when the
  remedy is obvious. Hand off the choices to expand intent and reassess the
  complete change, authorize a follow-up issue as a separate external mutation,
  or defer the finding without creating one. Create an issue only after the
  user authorizes its repository and scope. Re-establish intent and the mutation
  boundary before resuming; preserve a scope-expansion prohibition unless the
  user explicitly revises it.
- When the recorded accepted intent and trusted authority require this PR to
  act, the finding's relationship to the PR supports that application, and every
  autonomy-gate condition passes, including the shared handling's complete
  remediation-chain and proportionality decision, select `autonomous work` for
  the selected source mutation.
- When the required result is known but the operation needs unavailable
  authority, access, credentials, infrastructure, or another human-only effect,
  select `human intervention required`.
- Require a human decision when materially reasonable remedies differ in a
  product, quality, architecture, compatibility, policy, or risk choice that
  trusted requirements do not settle; when the choice is between accepting a
  limitation and funding a broader guarantee; or for conflicting requests, an
  undetermined or expanded scope, risk acceptance, insufficient evidence, or a
  conflict with accepted requirements. The Agent may select among equivalent
  technical implementations when the ordinary autonomy gate determines the
  required result and selection criteria.

Topic alone does not make implementation human-only. The Agent may implement a
previously selected high-impact approach, but selection of a new production
dependency, public or compatibility contract, stored-data migration,
authentication or permission model, deployment or spending commitment, license
policy, security tradeoff, or similar policy requires a human. Treat
suppression, reduced assertions, skipped validation, increased retries or
timeouts, disabled required checks, and concealed failures as policy changes
unless accepted intent independently justifies that exact change.

## Continue or stop the review cycle

A follow-up review verifies the handled findings and their aggregate remedies.
Send every net-new finding through shared handling before applying this
operational gate. A PR-induced regression may proceed when the gate passes;
a valid defect requiring out-of-scope remediation freezes mutation for the
human decision. A confirmed observation that requires no source change follows
the no-source-change branch.

For a proportionality handoff, retain the original concern and realistic
impact, the applicable guarantee or quality standard and whether it is
violated, the permanent responsibility already introduced or required next,
the causal relationship among later findings and earlier remedies, the viable
options and their consequences, and the Agent's recommendation. Preserve local
work and do not choose rollback as a substitute for the human decision.

For example, during a behavior-preserving refactor a reviewer identifies a
pre-existing bug. Shared handling confirms it on both the trusted base and
current head, with no evidence the PR worsens it, makes it reachable, or owns
its remediation. The watch preserves the source, freezes mutation, and hands
off whether to expand the PR, create an authorized follow-up issue, or defer
the finding.
