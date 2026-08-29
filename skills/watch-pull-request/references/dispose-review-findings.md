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

## Select the action

Evaluate these action paths in order and select exactly one:

- When the concern is duplicate, already fixed, outdated, or inapplicable,
  select an evidence-backed no-change reply as `autonomous work` when a reply
  is appropriate; otherwise classify that concern as non-actionable. Neither
  path authorizes a source change.
- When evidence establishes only a preference or opportunistic improvement,
  classify an evidence-backed no-change reply as `autonomous work` when a reply
  is appropriate; otherwise classify the finding as non-actionable. Neither
  disposition authorizes a source change or freezes the PR.
- For a substantiated defect or other technically required change outside the
  accepted PR intent, choose the `human decision required` disposition and
  apply a PR-wide mutation freeze even when the remedy is obvious. Hand off the
  choices to expand the accepted intent and reassess the complete change,
  authorize a follow-up issue as a separate external mutation, or defer the
  finding without creating one. Create an issue only after the user authorizes
  its repository and scope. Re-establish the accepted intent and mutation
  boundary before resuming. Preserve a prior prohibition on scope expansion
  unless the user explicitly revises it.
- Select an autonomous source mutation only when the recorded accepted intent
  and trusted authority require this PR to act, the recorded PR relationship
  supports that application, and every condition in the autonomy gate passes.
  A behavior contract, project instruction, or verification oracle that proves
  a defect exists does not by itself establish that this PR must fix it.
- Require a human decision for materially reasonable alternatives, conflicting
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
