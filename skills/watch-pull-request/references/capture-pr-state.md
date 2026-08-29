# Capture the PR state

Retrieve one complete current snapshot from every applicable PR surface:

- PR number, state, draft or terminal state, title, description, and
  writeability;
- base repository, ref, and SHA, together with source repository, ref, and SHA;
- complete base-to-current-head commit history and aggregate diff, including
  changes published by earlier observation cycles;
- submitted reviews, aggregate review decision, requested reviewers and teams,
  and required approval state;
- the complete paginated ready-for-review and convert-to-draft event history,
  including actor and time, and the watch contract's one-shot readiness
  authority state;
- complete paginated review threads and replies, including resolved and
  outdated state;
- top-level PR comments;
- required and optional CI checks, conclusions, details, attempts, and the head
  SHA each result applies to; and
- provider mergeability and conflicts, merge queue or auto-merge state, and
  every visible branch or merge requirement.

Use a thread-aware interface when thread state matters. A flat comment list or
summary is not a complete snapshot. Record the complete content and state of
each review thread so a later reply-and-resolve step can compare it with this
baseline.

Inspect the aggregate diff and commit history as one current artifact even when
the latest activity concerns only one commit, comment, or thread. Supply that
complete change as evidence to the autonomy gate's cumulative-drift decision;
the latest incremental diff is not a substitute.

Treat the PR number and state, base repository/ref/SHA, and source
repository/ref/SHA as one complete PR identity. Separately record the source
repository, ref, and SHA as the publication baseline. A stable source SHA does
not make the rest of the snapshot current.

Resolved, outdated, and older-head items are diagnostic history rather than
proof that their underlying concerns are gone. Bind every conclusion to the
identity and head where its evidence applies.

If the base repository or ref changed, freeze mutation and require a human
decision about the new PR target. If only the base SHA changed, pin the new SHA
and return to contract establishment before another mutation. Reload the
governing instructions and reassess the accepted intent and current work. When
the user selected a control revision other than the former base, require a
human decision to retain it or replace it with the new base.

Return to contract establishment when the trusted control revision, effective
access, repository, PR, or source ref otherwise no longer matches the watch
contract. Finish capture only when every applicable surface was retrieved or a
specific visibility or operational blocker was recorded.

Treat unavailable visibility into applicable review or merge requirements as
human intervention required rather than evidence that the PR is ready.

The snapshot is the baseline for one observation cycle. It does not promise
that remote state remains unchanged after retrieval.
