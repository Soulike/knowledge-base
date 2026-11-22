# Selecting Git change comparison endpoints

## Scope

This document defines how to translate a task that depends on a Git change set
into the revisions or derived trees that must be compared, then preserve that
comparison through file selection, analysis, review, and downstream decisions.
It focuses on pull-request and branch comparisons whose plausible endpoint
choices can produce different results.

## When to update

Update this document when Git comparison semantics, repository-hosting change
models, or a real diff-dependent failure exposes a missing distinction among
task intent, revision identity, comparison endpoints, or validation evidence.

## Define the question before selecting revisions

A request involving a pull request or branch does not by itself establish one
universal diff. First state the question that the comparison must answer, the
subject revision, and the two trees or commits whose relationship supplies that
answer. Ask for clarification only when plausible interpretations would change
the selected changes or a consequential downstream decision.

Common questions require different comparisons:

| Question                                                           | Comparison that answers it                                                                                                    |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| What did this branch contribute after it diverged from its target? | The merge base of target and head against the head tree.                                                                      |
| How do these two exact revisions differ?                           | The first revision's tree directly against the second revision's tree.                                                        |
| What would integrating this change do to the current target?       | The current target tree against the actual or faithfully simulated integration result.                                        |
| What change set should a review evaluate?                          | The exact comparison promised by that review's task contract, using immutable identities for both endpoints or derived trees. |

Treat branch names, default branches, and ambient checkout state as ways to
discover revisions rather than as comparison semantics. Once selected, carry
immutable commit identities so a moving branch cannot silently change the
subject or starting point.

## Keep revision identities distinct

Use precise names for the identities participating in the task:

- the **target tip** is the current commit of the branch that would receive the
  change;
- the **head** is the source revision being proposed or analyzed;
- the **merge base** is a best common ancestor used for a three-way comparison;
  and
- an **integration result** is the tree produced by an actual or simulated
  merge, rebase, squash, or other integration policy.

These identities can coincide in a linear history and diverge later. A field or
variable called `base` may mean a target ref, its current tip, a merge base, or
another product-specific starting point. Establish its contract instead of
inferring its identity from the name. Hosted pull-request pages, compare pages,
event payloads, and synthetic merge refs may also expose different identities;
consult the platform's current contract when reproducing one of those views or
events.

Git's diff syntax reflects two common comparisons. `git diff A B` and
`git diff A..B` compare the trees at `A` and `B` directly, while
`git diff A...B` compares `merge-base(A, B)` with `B`. In `git diff`, the dot
forms select endpoints rather than the commit ranges used by revision-walking
commands ([Git diff documentation](https://git-scm.com/docs/git-diff)). A merge
base is a best common ancestor and more than one can exist in some histories
([Git merge-base documentation](https://git-scm.com/docs/git-merge-base)).

## Apply one comparison contract to each decision

Every input to one diff-dependent decision must describe the same comparison.
If a check identifies changed files from the merge base to the head, then reads
a manifest, policy, version, or other baseline value to judge those changes,
read that baseline from the revision selected by the same task question. Mixing
a merge-base file set with metadata from the moving target tip creates a result
that neither comparison defines.

A larger workflow may legitimately answer several questions with different
comparisons. Name each comparison, keep its inputs and conclusions separate,
and transfer a fact between them only when its revision identity remains valid.
For example, deciding what a pull request contributed and deciding whether a
release identifier conflicts with current external state are separate decisions
even when one workflow performs both.

For an automated review, bind the prompt, checkout or object reads, changed-file
selection, annotations, and final verdict to the review's selected comparison.
A successful review run proves that the process completed; it does not prove
that the process reviewed the intended change set. A hosting platform may
expose its pull-request file view and workflow checkout through different
derived revisions. Inspect both contracts rather than assuming that ambient
revision names identify the review subject; GitHub, for example, documents
[pull-request comparisons](https://docs.github.com/en/pull-requests/reference/branches#three-dot-and-two-dot-git-diff-comparisons)
and
[Actions pull-request event identities](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request)
separately.

## Validate with histories that distinguish the choices

A linear history often makes the target tip and merge base identical, allowing
an incorrect comparison to pass ordinary tests. Use a small divergent history
where the target advances independently after the source branch diverges. Then
assert the exact revision identities, selected files or hunks, baseline values,
and downstream result required by the task.

Choose the expected behavior from the question rather than from the
implementation. A contribution-scoped result should remain stable when only
the target advances; a current-tree comparison should change. For review
automation, verify the compared identities and representative change set as
well as publication or verdict success. This scenario exposes endpoint
substitution and mixed-baseline defects that a green happy-path run cannot.
