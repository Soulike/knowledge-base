# Publish and verify the issue

Use this procedure when publication is confirmed or authorized under the Step 2
pre-approved draft rule.

## Publish via `gh`

1. Publish each confirmed issue or incremental comment with the corresponding
   `gh issue` operation against the explicit canonical repository, passing
   public text through standard input (write a file only when the user
   explicitly requested an export).
2. Create any new issue before separately requesting the `needs-triage` label so
   a label-permission failure does not discard a successfully published proposal.
   Do not add other labels unless the user explicitly requests them.
3. If authentication, repository access, issue availability, or publication
   permission blocks the operation, return the complete sanitized draft,
   requested label, target repository, and exact blocker. Do not clone, fork,
   create a branch, push, or open a pull request as a fallback.
4. Record the exact returned issue or comment identifier, publishing identity,
   public text, and every provider-exposed revision value needed to bind
   verification or a possible repair to that published object.

## Verify, reconcile, or repair

1. Using the same explicit canonical repository identity or the verified
   canonical issue URL, re-read the exact returned issue or comment and verify
   its repository, identifier, author, number, expected open state for a new
   issue, title when applicable, exact public text, revision, and label result.
   Bind every reconciliation search and repair operation to that same object
   and canonical identity.
2. When publication has an unknown result, search the canonical repository for
   the exact approved content and reconcile the outcome before considering a
   retry.
3. If verification reveals unapproved sensitive content, restore the last
   approved sanitized draft only when the current identifier, author, public
   text, and revision still exactly match the recorded publication and `gh` can
   bind the update conditionally to that revision. Re-read and verify the
   repaired object, then stop and report `exposure-repaired` alongside the
   potential exposure without claiming that the correction retracted
   notifications, caches, or other copies.
4. When ownership, content, revision, or conditional-update support cannot
   establish a safe repair, perform no further mutation and report
   `exposure-repair-blocked`.
5. For any other identity, state, or content mismatch, perform no further
   mutation and report `publication-mismatch`.
