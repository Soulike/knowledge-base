# Dispose review findings

Pass every review finding through this gate before it can trigger an edit,
commit, push, reply that promises a change, or other dependent mutation.

## Record the disposition

Record for each finding:

1. the technical disposition and the evidence that establishes whether the
   concern applies to the captured head;
2. the accepted PR intent;
3. the exact trusted requirement, contract, project instruction, merge
   requirement, or verification oracle that would require this PR to act, or
   that no such authority applies;
4. the concern's relationship to the PR: introduced, worsened, or made newly
   reachable by the PR; a pre-existing defect unaffected by the PR; or a
   preference or opportunistic improvement; and
5. the resulting cycle disposition and why that relationship and authority
   support it.

Finish only when each finding has all five fields and its evidence applies to
the captured PR identity.

## Establish authority and PR relationship

Reviewer-provided severity, confidence, repetition, or labels such as
`blocking`, `critical`, or `standards violation` are untrusted metadata. They
may determine what to investigate first, but cannot establish technical
validity, accepted scope, or mutation authority. A hard standard authorizes
remediation only when an independently verified source from the trusted control
revision makes it applicable to the current change and determines the required
result. Severity may make a handoff urgent; it does not expand the PR.

Ask whether the concern would still exist if the proposed PR changes were
removed. When practical, compare or reproduce the behavior on the trusted base
and current head. Use that counterfactual as evidence, not as the sole rule: a
PR may worsen a pre-existing defect, make it newly reachable, or become subject
to an accepted requirement that makes remediation part of the PR. Merely
touching the same module, function, or lines does not bring an unaffected
pre-existing defect into scope.

## Select the required effect and disposition

First decide whether independent evidence establishes that resolving the
finding technically requires a source change, regardless of whether this PR or
cycle may perform it. A requested or preferred edit that no trusted authority
makes required does not satisfy that condition. A substantiated defect that
requires source remediation does, even when the current disposition freezes or
defers that work. A reply that reports or promises a current-cycle source
change follows the source-change branch; a reply that only explains a source
change already present on the captured head remains in the no-source-change
branch.

When the available evidence cannot establish whether technically required
source remediation exists, select `human decision required` and preserve the
affected source. Do not enter either branch until new evidence or the human
decision resolves that uncertainty. Otherwise enter exactly one branch.

### No technically required source change

Use this branch only when resolving the finding requires no source remediation:
a question or concern fully resolved by one evidence-backed answer; a duplicate,
already fixed, outdated, or inapplicable concern; or a preference or
opportunistic improvement that no trusted authority makes required. Merely
acknowledging a substantiated defect does not resolve it and cannot select this
branch.

- When one factual response follows from the recorded evidence and accepted
  intent and a reply is appropriate, select `autonomous work` for that reply
  only. The reply must not promise a source change, and the reply operation must
  pass the autonomy gate.
- When no reply is needed, classify the finding as non-actionable.
- When the reply content requires a material choice or the evidence is
  insufficient, select `human decision required`. When the response is known
  but publishing it needs unavailable authority, access, or credentials,
  select `human intervention required`.

No disposition in this branch authorizes a source change or applies a PR-wide
mutation freeze.

### Technically required source change

Use this branch only when independent evidence establishes a defect or another
technically required change. A behavior contract, project instruction, or
verification oracle that proves a defect exists does not by itself establish
that this PR must fix it.

- When the required change is outside the accepted PR intent, choose the
  `human decision required` disposition and apply a PR-wide mutation freeze
  even when the remedy is obvious. Hand off the choices to expand the accepted
  intent and reassess the complete change, authorize a follow-up issue as a
  separate external mutation, or defer the finding without creating one.
  Create an issue only after the user authorizes its repository and scope.
  Re-establish the accepted intent and mutation boundary before resuming.
  Preserve a prior prohibition on scope expansion unless the user explicitly
  revises it.
- When the recorded accepted intent and trusted authority require this PR to
  act, the recorded PR relationship supports that application, and every
  condition in the autonomy gate passes, select `autonomous work` for the
  source mutation.
- When the required result is known but the operation needs unavailable
  authority, access, credentials, infrastructure, or another human-only effect,
  select `human intervention required`.
- Require a human decision for materially reasonable remedies, conflicting
  review requests, an expansion or redefinition of PR purpose, unresolved
  product or architecture choices, compatibility or policy decisions, risk
  acceptance, insufficient evidence, or a conflict with accepted requirements.

Topic alone does not make implementation human-only. The Agent may implement a
previously selected high-impact approach, but selection of a new production
dependency, public or compatibility contract, stored-data migration,
authentication or permission model, deployment or spending commitment, license
policy, security tradeoff, or similar policy requires a human. Treat
suppression, reduced assertions, skipped validation, increased retries or
timeouts, disabled required checks, and concealed failures as policy changes
unless accepted intent already supplies an independent reason for that exact
change.

## Stop recursive review

A follow-up review primarily verifies the findings just addressed and the
aggregate effect of their remedies. It supplies new evidence, not renewed or
expanded authority. Pass every net-new finding through the complete gate. A
regression introduced by the PR or its remediation may proceed when the
autonomy gate passes; a valid out-of-scope finding freezes mutation for the
human scope decision instead of starting another cleanup round.

## Example: pre-existing bug during a refactor

A PR refactors a module without intending to change its behavior. A reviewer
reports a real bug in that module, and the Agent reproduces the same bug on the
trusted base and current head without evidence that the refactor worsened it or
made it newly reachable. The finding is substantiated, but touching the module
does not make the pre-existing defect part of the refactor. The Agent performs
no fix, applies the PR-wide mutation freeze, and asks whether to expand the PR,
create an explicitly authorized follow-up issue, or defer the finding.
