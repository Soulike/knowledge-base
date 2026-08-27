# Publish fixes

The established watch contract grants standing authority for an ordinary
non-force push to the existing PR source branch when the selected work passed
the autonomy gate. A push needs a new human decision only when the fix or a
known publication effect crosses that boundary.

Before publication, inspect the intended source diff, complete the validation
required by the active project, and apply the destination, credential,
execution, side-effect, and side-band boundaries established by the watch
contract.

## Prepare focused commits

Partition the completed work into independently reviewable fix units. Create
one focused ordinary commit for each independently remediable concern. When
several comments or review threads identify the same concern, let one commit
own that concern. Combine concerns only when they share a root cause or must
change together to preserve a coherent invariant, and keep that coupled fix in
one commit.

Name the technical result in each commit message so the corresponding replies
can identify the commit that handled their concern. Prepare every commit for
the current observation cycle before the pre-push check; the cycle publishes
all of them together with one push.

## Run the pre-push check

Immediately before every push attempt:

1. Take the source repository, ref, and SHA recorded by the current observation
   cycle as the expected source identity.
2. Fetch that exact remote source ref through the trusted destination.
3. Compare the fetched source SHA with the expected SHA.
4. If its SHA differs, do not push. Preserve the local work, return to a
   complete PR observation, and understand the remote changes before deciding
   whether the fix still applies.
5. If the ref is missing, do not recreate it. Retrieve the complete PR state
   and hand off the deleted source branch as human intervention unless the PR
   has become terminal.
6. If they match, perform one ordinary non-force push of the prepared commits
   to that exact existing ref.

Every push attempt requires a new pre-push check. A rejected push means the
source changed after the check; do not retry from the stale cycle. Return to a
complete observation and classification.

After a source change, the Agent may revise, rebase, or regenerate unpublished
local work on the new head only after reviewing the new state, checking the
resulting diff, and repeating relevant validation. Never rewrite published
history. Do not recreate a deleted source ref, use force or force-with-lease,
or bypass a non-fast-forward rejection.

An ordinary successful push proceeds directly to the next applicable cycle
step; it does not require an intervening complete PR retrieval. When the push
result is unknown, reconcile that exact effect before replying or attempting
another push.
