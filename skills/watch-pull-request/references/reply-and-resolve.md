# Reply and resolve

Account separately for every top-level comment and review thread handled in the
cycle, even when one fix addresses several items.

Reply after the selected work is complete. For a published fix, state what
changed, the published commit or head, validation performed, and any remaining
limitation. When no code change was appropriate, state the disposition, its
supporting evidence and applicable head, and any remaining limitation.

Do not post a holding reply merely to announce that a human decision is
pending. Hand off the decision and reply after it is available unless the
active project requires an interim status.

## Resolve a review thread

Resolve a thread without waiting for reviewer confirmation only when all of
these semantic criteria hold:

1. Its complete baseline from the observation cycle was read.
2. Its active concern was fixed or objectively answered.
3. The result was verified against the applicable published head.
4. The Agent's reply records the disposition and relevant evidence.
5. No part of the baseline thread remains unanswered.

After posting the reply, retrieve the complete current thread. Resolve it only
when its content and state are exactly the recorded baseline plus the Agent's
expected reply. If another reply, edit, resolution change, or other thread
change appears, leave the thread as it is and treat the new state as input to
the next observation cycle.

Keep the thread unresolved when the reply asks a question, proposes
alternatives, depends on a human decision, describes a partial fix, or cannot
be verified. An `outdated` marker does not establish that the concern was
addressed, and a resolved marker does not prove that the concern has not
reappeared elsewhere.

The workflow deliberately accepts the small race between the final thread read
and resolution because comments remain visible and resolution is reversible.
Do not add a compare-and-set requirement or an immediate post-resolution PR
retrieval solely to close that window. The next observation cycle and the
mandatory final handoff snapshot reconcile the actual state.

When a reply or resolution result is unknown, reconcile that exact effect
before replaying it or completing the cycle.
