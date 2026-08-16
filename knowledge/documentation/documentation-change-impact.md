# Documentation impact of semantic changes

## Scope

This document defines documentation impact as the set of instructions, Skills, comments, examples, pointers, and other representations whose correctness depends on a changed engineering meaning.

## When to update

Update this document when evidence changes how semantic dependencies propagate across engineering artifacts or when a recurring change exposes an unaddressed consistency relationship between a meaning and its representations.

## Follow meaning rather than file categories

Documentation impact follows changed meaning, not the kinds of files present in a diff. A behavior, contract, name, path, or invariant can invalidate prose even when no documentation file was edited. Conversely, a code change needs no prose update when the authoritative contract and every route to it remain complete and correct.

Assess each changed meaning against every audience and recurring task that depends on it. Include representations outside the proposed change rather than treating the diff as the dependency boundary.

## Reconcile dependent representations

Rewrite an affected semantic block in place and remove the wording it supersedes. The final artifact should present one coherent current model rather than preserve its revision history as layers of exceptions or qualifications.

Every dependent representation must remain correct, move with its [authoritative owner](information-ownership.md#give-authority-to-the-defining-artifact), become a pointer to that owner, or be removed. Here the owner is the artifact responsible for keeping the meaning correct. Stale names, paths, headings, examples, summaries, and prompts preserve competing versions of the meaning even when the primary documentation was updated correctly.

## Treat recorded invariants as consistency sets

When documentation claims that a system enforces an invariant, the invariant, its enforcement mechanism, and the evidence that demonstrates it form one consistency set. A change to any member requires reassessing the others. Evolve the set together or state explicitly that the enforcement or evidence no longer establishes the documented claim.
