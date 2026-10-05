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

Run focused validation for each fix unit before creating its commit. The
validation must directly cover the concern that the commit owns and preserve
the active project's required checks.

Name the technical result in each commit message so the corresponding replies
can identify the commit that handled their concern. Prepare every commit for
the current observation cycle before the pre-push check.

Before that check, inspect the complete aggregate diff from the captured base
SHA through the proposed local head. Include both fixes published by earlier
cycles and every unpublished commit from the current cycle. Run the aggregate
validation required by the active project, then reapply the autonomy gate and
its cumulative-drift and proportionality criteria to the proposed result. Each
commit passing on its own does not establish that their combined result remains
within the accepted intent and mutation boundary. Compare the actual
responsibilities and effects with the scope basis recorded for review handling,
including explicit deferrals and the complete causal remediation chain. Tests
passing or the latest comment being resolved cannot establish that an
additional consumer, policy, or permanent coordination mechanism belongs in the
PR.

When that recheck changes admission, preserve the unpublished work and return
the new evidence to classification before any dependent operation. Apply its
stop scope to the publication candidate:

- For a local stop, withhold the affected units. Prepare a new candidate from
  the captured source head containing only independent admitted fix units,
  without discarding stopped work or rewriting published history. Repeat
  focused and aggregate validation and the complete gate for this candidate.
  If the units cannot be separated without changing another disposition,
  preserve them and return the dependency to classification.
- For a PR-wide freeze, preserve every unpublished commit and perform no push
  or dependent reply. Return to the main workflow with the governing cause.

When the complete gate passes, publish all admitted prepared commits together
with one push. Publication outcomes do not independently terminate the watch.

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
   and return the deleted source branch as human intervention unless the PR
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
