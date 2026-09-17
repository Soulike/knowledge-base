# Update PR metadata

Assess eligibility when classification identifies a possible factual title or
description change. Execute the selected update only after the complete
classification admits it. This reference owns the metadata operation; return
changed evidence and operation outcomes to the watch for classification.

## Assess eligibility and perform the update

An autonomous title or description update may correct stale wording, document
implemented behavior or verification, or update an accurate checklist. It
must preserve relevant human-authored context and linked issues.

For an ordinary metadata update, require the provider to reject the write when
the observed title or description changed. Keep the update human-only when the
provider has no conditional write, the framing or scope is disputed, or the
change would introduce a release, compatibility, policy, or risk commitment.

A title or description update needed to finish remediation of an automated
review finding may instead use a bounded refresh-write-verify sequence without
a provider conditional write. Treat that narrow metadata as reproducible
remediation output rather than protected state. Apply the exception only when
every condition holds:

1. The finding passed the complete review-finding disposition gate, its
   remediation is inside the accepted PR intent, and the source change,
   validation, evidence collection, or other substantive work is complete and
   verified.
2. The completed remediation makes the current title or description factually
   stale or incomplete, and the exact replacement follows from the published
   head and recorded evidence without a new framing, scope, product, design,
   architecture, compatibility, security, release, policy, or risk choice.
3. Immediately before writing, retrieve the complete current PR identity,
   source head, title, description, and any provider-exposed metadata revision
   or update timestamp. Require the canonical repository, PR number and state,
   base repository, ref, and SHA, and source repository, ref, and SHA to match
   the classified remediation baseline exactly. A mismatch returns to complete
   observation or contract establishment without invoking the update.
   Construct the update from the freshly retrieved title and description rather
   than from an earlier snapshot, preserving every unrelated human-authored
   statement, linked issue, and still-current fact.
4. Change only the title, description, or both. Do not use this exception to
   mutate any other PR metadata or to rewrite content unrelated to the handled
   finding.
5. Invoke the update once, then retrieve the complete PR identity, source head,
   title, and description again. Completion requires the classified remediation
   identity and head plus the exact intended metadata. Reconcile a failed or
   unknown result before considering another attempt.

The exception accepts the small race in which any checked PR identity, state,
head, title, or description changes after the refresh but before the write. It
does not authorize adopting a changed identity or make automated review output
authoritative: the finding and remediation must still be independently
established, scoped, and verified. When an eligibility or allowed-content
condition in items 1, 2, or 4 fails, keep the update human-only and preserve the
current metadata. A pre-write mismatch follows item 3's return to observation
or contract establishment, while a failed or unknown invocation follows item
5's reconciliation path. After a known successful response, any unexpected
identity, state, head, title, or description is an inconsistent result that
freezes further mutation and requires human intervention rather than a retry.
