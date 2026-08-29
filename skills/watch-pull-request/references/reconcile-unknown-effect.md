# Reconcile an unknown effect

A timeout, lost response, or connection failure after a mutation does not
establish whether it completed. Query the exact destination for the intended
push, reply, resolution, metadata update, CI replay, or explicitly authorized
follow-up issue before attempting it again. Retrieve only the resource state
needed to establish that result; the normal next observation cycle reconciles
the complete PR.

Retry only when non-completion is established, the operation remains
authorized under the current state, and replay cannot duplicate or overwrite a
completed effect. Otherwise preserve the evidence and require human
intervention.

For a push, completion is established when the source ref equals the intended
head or descends from it with every intended fix commit reachable. A descendant
means the push completed before another ordinary advance; start a new
observation cycle without replaying it. When the source ref still equals the
exact pre-push head, non-completion is established, but another attempt still
requires a fresh pre-push check. Treat a missing, divergent, or otherwise
unexplained ref as human intervention required.

For a reply, query the target comment or thread for the intended Agent-authored
reply before posting another copy. For a resolution, query the target thread's
current resolved state before repeating the mutation. For metadata or CI,
identify the intended version or replay attempt rather than inferring success
from a generic PR summary.

For a follow-up issue, query the authorized repository for an issue created by
the expected identity that matches the approved source finding and intended
content. Treat one exact match as completion. Retry only when the provider can
establish that no matching issue was created; treat multiple matches or
inconclusive visibility as human intervention required rather than risking a
duplicate.

Finish only when the mutation has one known result: completed, proven not to
have completed and safe to reconsider from fresh state, or unreconcilable and
handed to a human.
