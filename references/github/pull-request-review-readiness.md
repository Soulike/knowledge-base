# Pull request review readiness

Use this reference when a contribution or pull-request watch must decide
whether a pull request may enter review and how to publish that state safely.

## Establish review-progression authority

A request to watch an intentionally unfinished draft or only observe its state
does not authorize review progression. Treat the accepted intent as authorizing
entry into review when the user asks the Agent to finish and watch the pull
request, handle its review and CI activity, stay with it until human input is
needed, or otherwise progress a completed change through review. An explicit
instruction to retain draft state overrides that implication.

This authority covers creating the requested pull request ready for review or
performing one transition of an existing pull request from draft to ready. It
does not authorize conversion back to draft, requesting reviewers, approving,
enabling auto-merge, or merging.

Grant one readiness publication attempt per accepted review-progression intent.
For an existing pull request, record the complete ready-for-review and
convert-to-draft event history as the authority baseline and record whether the
attempt has been consumed. Invoking the provider operation consumes the
authority regardless of success, failure, or an unknown result. Preserve that
state in every contribution report and wait or handoff checkpoint. Creating a
ready pull request consumes the authority inherited by a watch under the same
accepted request. A resumed watch or a request merely to continue watching does
not renew it; only a new explicit user instruction may authorize another
attempt.

## Gate readiness

Before publishing a ready state, require all of these conditions:

1. The canonical repository, target repository, ref, and expected SHA, source
   repository, ref, and expected SHA are fixed and still match the accepted
   request. For an existing pull request, its identity and current draft state
   and complete draft-transition history must also match the captured state,
   and the one-shot authority must remain unconsumed.
2. The published aggregate change completely implements the accepted intent,
   no unpublished local work remains, and the complete change has not
   accumulated ambiguous scope or risk.
3. Every applicable validation that can run before review has passed. A check
   that runs only after the ready state is published may remain pending as an
   expected effect.
4. No current finding, comment, conflict, or failed check has executable work,
   and no unresolved product, design, architecture, security, compatibility,
   policy, scope, or risk decision remains.
5. The title and description accurately describe the complete change, and
   publication is expected to trigger only ordinary review, CI, and
   notification effects. A known deployment, release, spending action, or other
   high-impact effect requires a human decision.

Keep or create the pull request as a draft and report the blocking condition
when any requirement does not hold.

## Publish once and verify the result

Some providers, including GitHub, cannot atomically bind creation or a
ready-for-review transition to the expected source SHA. This workflow accepts
the resulting bounded check-then-act race only after the readiness gate passes.

Immediately before publication, retrieve the exact target and source refs
again. For an existing pull request, also retrieve its draft state and complete
base and source identity. Cancel the operation and return to classification
when any value differs from the readiness snapshot. Otherwise invoke the
provider's dedicated creation or ready-for-review operation exactly once.
Mark the one-shot authority consumed immediately before invoking it.

Before performing any dependent mutation, retrieve the resulting pull request
and compare its state and complete identity with the expected ready state:

- The expected pull request in ready state at the expected target and source
  SHAs establishes success. Begin a new complete observation cycle.
- A ready pull request with an unexpected base or source repository, ref, or
  SHA is an unexpected external effect. Freeze every further mutation and hand
  off the observed state to a human; do not convert it back to draft, push,
  reply, request review, or retry.
- After a known successful response, any other state indicates a concurrent
  change or inconsistent result. Freeze every further mutation and hand off
  immediately; do not continue otherwise independent work before the human
  resolves the state.
- A definitive provider rejection or other known failure ends the readiness
  attempt. Record the failure, freeze every further mutation, and hand off
  immediately; do not invoke the creation or ready operation again or continue
  otherwise independent work before the human responds.
- After a timeout, lost response, or other unknown result, the exact expected
  ready state establishes completion. Any other observation, including an
  unchanged draft or no uniquely identifiable pull request, is ambiguous
  because the operation may have completed and then been reversed. Freeze every
  further mutation and hand off immediately; do not retry or continue with
  otherwise independent work before the human resolves the state.

The post-publication check limits further Agent effects; it cannot undo review,
CI, or notifications already triggered during the accepted race window.
