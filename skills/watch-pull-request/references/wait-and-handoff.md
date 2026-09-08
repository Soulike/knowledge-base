# Wait and hand off

Use the waiting path when no autonomous or human-only work remains and every
active item is a current-head CI check, requested review, or other expected
external result. Use the handoff path when the PR is terminal, ready for merge,
or at an accepted draft stopping point, or when any remaining current item
needs a human decision or human intervention.

## Wait and resume

An observation cycle enters the waiting path only after retrieving and
classifying one complete current PR state and finding that every active item is
waiting for an expected external result. Within one persistent execution,
retain that waiting state and its scheduled polling interval until the next
observation classifies the current state.

Prefer a runtime mechanism that can wake on a relevant event without
periodically retrieving provider state. Treat a monitor that refreshes provider
state periodically as polling and apply the polling cadence below. Race a
relevant event against the scheduled poll. When either wakes the watch, cancel
any remaining scheduled poll, retrieve one complete current PR state, and begin
a new observation cycle. The event is only a wake-up signal; the newly
retrieved complete state remains authoritative.

When an observation enters or returns to waiting, schedule a five-minute poll
if no preceding waiting state is retained from the current execution. When a
preceding state exists, restart with a five-minute interval if a semantic change
affects an active item's identity, status, content, or disposition. Passage of
time and provider metadata that does not affect classification do not reset the
interval.

When the observation returns to waiting with unchanged state, determine the
next interval as follows:

1. For each active item, use recent completed samples already available through
   the normal watch when they represent the same awaited result under
   materially comparable conditions. Estimate the typical total time to that
   result and subtract the current elapsed time measured from the corresponding
   boundary. Choose the completion unit from the awaited result rather than a
   fixed provider object: when one complete review is the result, its internal
   jobs or checks are stages of that sample rather than separate completion
   samples.
2. When an item's estimate has passed, give it a five-minute candidate. When
   estimated time remains, use
   `clamp(estimated remaining time / 2, 5 minutes, 10 minutes)`.
3. When no credible estimate is available for an item, give it a candidate five
   minutes longer than the previous polling interval, capped at ten minutes.
4. Schedule the shortest candidate across all active items.

This produces a deterministic fallback of five minutes and then ten minutes
while allowing applicable duration patterns observed during the watch to
shorten a later interval. Do not create a separate mandatory history-retrieval
loop or post periodic or no-op status comments.

When persistent waiting is unavailable or execution stops, checkpoint the
watch contract, last complete PR identity, safe workspace and local work,
published commits and replies, handled item identities, validation evidence,
remaining dispositions, the readiness transition-history baseline and consumed
one-shot authority, and every mutation with an unknown result. State that
monitoring stopped; never claim to remain watching after execution ends.

On resume, verify workspace ownership, reconcile unknown effects, and return to
the observation cycle immediately. Preserve local state whose ownership or
publication result cannot be established and require human intervention when
it cannot be made safe.

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
