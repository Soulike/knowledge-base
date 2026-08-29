# Wait and hand off

Use the waiting path when no autonomous or human-only work remains and every
active item is a current-head CI check, requested review, or other expected
external result. Use the handoff path when the PR is terminal, ready for merge,
or at an accepted draft stopping point, or when any remaining current item
needs a human decision or human intervention.

## Wait and resume

Use the runtime's native waiting or monitoring mechanism when available. On a
relevant event or poll result, retrieve a new complete PR state and begin a new
observation cycle. Do not post periodic or no-op status comments.

When persistent waiting is unavailable or execution stops, checkpoint the
watch contract, last complete PR identity, safe workspace and local work,
published commits and replies, handled item identities, validation evidence,
remaining dispositions, the readiness transition-history baseline and consumed
one-shot authority, and every mutation with an unknown result. State that
monitoring stopped; never claim to remain watching after execution ends.

On resume, verify workspace ownership, reconcile unknown effects, and retrieve
a complete current PR state before starting work. Preserve local state whose
ownership or publication result cannot be established and require human
intervention when it cannot be made safe.

## Verify the handoff state

Before handing off, retrieve one final complete paginated PR snapshot. Compare
the actual PR identity, head, comments, review threads, CI, reviews, and merge
requirements with the Agent's expected state.

Return to a new observation cycle when the snapshot differs from that
expectation or exposes executable autonomous work. Wait instead when only an
expected external result is pending. Hand off only when the complete current
state supports one of these outcomes:

- **PR terminal:** another actor merged or closed the PR. Report the observed
  terminal state and stop without reopening it.
- **Accepted draft stopping point:** the user explicitly asked to retain draft
  state and no autonomous, waiting, or human-only item remains. Report the
  verified draft identity and stop without implying that monitoring continues.
- **Human decision required:** a valid technical, product, design, policy, or
  risk choice remains.
- **Human intervention required:** the correct next action is known but needs
  unavailable authority, access, credentials, infrastructure, or another
  human-only operation.
- **Ready for human merge:** no known autonomous work, unresolved defect, or
  other blocker remains; every visible required review and merge condition is
  satisfied except the merge operation itself.

The consolidated handoff identifies the PR and current head; summarizes CI,
reviews, merge requirements, published fixes, validation, replies, and resolved
threads; links every remaining blocker; explains why each crosses the autonomy
boundary; presents concrete options, consequences, and a recommendation; and
identifies cumulative drift or deferred work. Confirm that no other executable
autonomous work remains.

After the human answers, apply only the decisions and interventions they
authorized, then ask whether to continue watching. A request to continue does
not authorize merge.
