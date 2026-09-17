# Hand off

Use the outcome selected by the main workflow: normal completion, a terminal
PR, or an interruption. This reference verifies and reports that outcome; it
does not introduce another stopping rule.

## Verify the final state

Reconcile unknown operation results before dependent actions or claiming their
completion. For every outcome, retrieve one final complete paginated PR snapshot and compare the
identity, head, comments, review threads, CI, automated review publication,
reviews, and merge requirements with the expected state. Apply the main
workflow's cycle decision to the actual snapshot again.

Return to observation when the state differs or the decision selects more
work or waiting. Preserve any governing freeze while reclassifying new items.
Finish the handoff only when the actual state supports the selected outcome.
If the interruption itself prevents reconciliation or a complete final capture,
report the last confirmed state, unavailable evidence, and unknown effects
explicitly; do not describe an interrupted watch as normally complete.

## Report the outcome

Begin the handoff with the PR identity, current head, and selected outcome.
Summarize relevant automatic results and
published review evidence, remaining merge requirements, published fixes,
validation, replies, resolved threads, and deferred work. Distinguish:

- **Normal completion:** the main completion gate passes. Report the concrete
  human decisions or interventions that remain, an accepted draft stopping
  point, or readiness for human merge. Definite failed checks can remain only
  with their non-autonomous disposition and blocker explained; they do not make
  the PR ready for merge. Human merge readiness requires every other visible
  merge condition to be satisfied.
- **PR terminal:** another actor merged or closed it. Report the observed
  terminal state without reopening it or waiting for irrelevant later jobs.
- **Interrupted:** execution or necessary observation could not continue, the
  runtime stopped, or unsettled automation requires human intervention and no
  independent work or expected result can advance. Identify the missing
  results and preserve the contract's resume checkpoint. Do not report that
  the normal completion gate passed.

For each human-owned item, link the blocker, explain the authority or decision
boundary, and present concrete viable options, consequences, and a
recommendation. For required out-of-scope remediation, the choices may be to
expand intent and reassess the whole change, authorize one separately scoped
follow-up issue, or defer without creating an issue. Issue creation still
requires the contract's exact one-shot authority.

For a proportionality decision, include the original concern and realistic
impact; the applicable guarantee or quality standard and whether it is
violated; permanent state, coordination, lifecycle, testing, or maintenance
responsibility already introduced or required next; and the causal relationship
between later findings and earlier remedies. Explain whether accepting the
limitation, selecting a smaller sufficient remedy, or funding the broader
guarantee remains viable. Identify preserved work and its dependencies.

State that monitoring has ended. Normal completion describes all known relevant
automatic results having been handled; it does not promise that future external
activity cannot change the PR. After a human answer, apply only the authorized
decisions and interventions, then ask whether to resume watching unless the
same message already requests it. Continuing never authorizes merge.
