# Human decision authorization

## Scope

This document defines how a human approval, consent, or confirmation binds later
software effects to the target, action scope, and proposal the person reviewed,
and how that authority survives transport without transferring to replacement
content.

## When to update

Update this document when a real approval, consent, confirmation, supersession,
or execution failure changes the durable relationship among reviewed content,
decision identity, authority lifetime, and enforcement at the effect owner.

## Define what the decision authorizes

Establish the canonical target, permitted actions, and relevant state or
proposal presented to the person. A decision about one proposal authorizes that
proposal within its stated scope. A stable target or request identifier names
the logical decision slot; it does not identify which content was reviewed.
Different generations can retain the same target and action identifiers while
changing their parameters, consequences, or relevant preconditions.

Represent the reviewed proposal with an immutable identity, content binding,
or generation whose meaning the decision owner controls. Advance a generation
when a change invalidates what the person reviewed. Unrelated cache eviction,
refresh, or presentation changes do not invalidate approval unless they change
that same semantic basis. Avoid reusing an identity for different content,
including after a record is deleted and recreated.

Some decisions explicitly grant a range of actions or standing authority rather
than approval of one snapshot. Preserve that declared scope and lifetime;
do not infer a broader grant from an approval of one proposal. Authentication,
the person's permission to authorize the action, and current execution policy
remain separate requirements. A matching generation establishes neither
identity nor permission by itself.

## Carry the binding to the decision owner

Every supported command that relies on the human decision must carry enough
identity to recover and check the reviewed proposal at the boundary that owns
the protected decision state or effect. This includes preflight checks,
execution, and responses that consume, dismiss, or otherwise change a pending
decision. Verify the canonical target, action scope, decision identity, and
applicable authority lifetime there.

A schema can establish that a generation is present and well formed. It cannot
establish freshness when a handler discards that value and looks up whichever
proposal is current under the stable request identifier. Trace the accepted
identity through adapters and handlers to the comparison that admits the
protected effect. Caller-side validation and a disabled control do not replace
that comparison.

Reject missing, stale, mismatched, or no-longer-authorized decisions before
consuming the current decision, invoking protected callbacks, writing protected
state, or starting effects that rely on the approval. A stale command must leave
the replacement decision intact. Diagnostic logging can record rejection
without granting or consuming authority. Define a recoverable result so the
caller can obtain the current proposal and request a new decision rather than
silently applying the old response to replacement content.

## Keep the checked proposal bound through execution

Make the freshness check and the protected state transition one enforceable
boundary. A check followed by an asynchronous gap and a lookup of current
content permits substitution after the check. Use an atomic conditional
transition, transaction, or equivalent owner-controlled mechanism, or bind
execution to the exact immutable proposal that passed the check while enforcing
its relevant mutable preconditions. An immutable payload alone does not make
revoked or superseded authority valid.

A successful preflight check is evidence at that observation point. Recheck or
carry an enforceable precondition into later execution; do not treat an earlier
success as permission to execute whatever is current. Define when a decision
is consumed or expires and how retries recognize an already admitted result
without authorizing replacement content.

Stale-command rejection and stale-completion fencing protect different
boundaries. An obsolete command can arrive after replacement even when no
executions overlap. When previously admitted work can continue after its
authority changes, apply
[Overlapping mutation admission](overlapping-mutation-admission.md) to carry
the applicable fence to the mutation boundary and prevent that work's later
effects from violating the replacement's authority. Rejecting new stale
commands alone does not stop work already in progress.

## Example: a stable request with replacement content

A person reviews request X, generation 10, for an update. Before they respond,
the proposal changes and generation 11 replaces it under request X. The target
and logical action identifiers remain the same, but approval-relevant content
differs.

An old tab submits approval for X, generation 10. Looking up X and executing
generation 11 would apply the person's response to content they did not review.
The owner instead rejects the stale response before protected effects or
decision consumption, leaving generation 11 pending. A response for generation
11 can proceed only when its scope, authority, and execution preconditions also
hold at the owning boundary.

## References

- [OWASP Transaction Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html)
