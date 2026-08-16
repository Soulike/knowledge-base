# Documentation impact of semantic changes

## Scope

This reference supports workflow steps that derive documentation impact from the instructions, Skills, comments, examples, pointers, and other representations whose correctness depends on a changed engineering meaning.

## When to update

Update this document when evidence changes how semantic dependencies propagate across engineering artifacts or when a recurring change exposes an unaddressed consistency relationship between a meaning and its representations.

## Follow meaning rather than file categories

Documentation impact follows changed meaning, not the kinds of files present in a diff. A behavior, contract, name, path, or invariant can invalidate prose even when no documentation file was edited. Conversely, a code change needs no prose update when the authoritative contract and every project-defined route to it remain complete and correct.

Assess each changed meaning against every audience and recurring task that depends on it. Include representations outside the proposed change rather than treating the diff as the dependency boundary.

## Reconcile dependent representations

Rewrite an affected semantic block in place and remove the wording it supersedes. The final artifact should present one coherent current model rather than preserve its revision history as layers of exceptions or qualifications.

Every dependent representation must be reconciled so that it remains correct and no longer competes with the current meaning. Choose the quality action needed to keep, rewrite, remove, or replace it with a pointer. When that action requires a concrete destination or route, resolve it only from the active project's standards or explicit user requirements; record any destination or route those sources do not determine as an unresolved project decision. Stale names, paths, headings, examples, summaries, and prompts preserve competing versions of the meaning even when the primary documentation was updated correctly.

## Treat recorded invariants as consistency sets

When documentation claims that a system enforces an invariant, the invariant, its enforcement mechanism, and the evidence that demonstrates it form one consistency set. A change to any member requires reassessing the others. Evolve the set together or state explicitly that the enforcement or evidence no longer establishes the documented claim.
