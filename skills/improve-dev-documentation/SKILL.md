---
name: improve-dev-documentation
description: Improve existing software development documentation. Use when an architecture or design document, developer guide, runbook, source comment or docstring, Agent instruction, or Skill is the subject of an audit, cleanup, simplification, readability rewrite, correctness fix, or reorganization. Use write-dev-documentation when the task starts from new or changed engineering information rather than concern about an existing document.
---

# Improve development documentation

## Understand the document

1. Follow the active project's documentation instructions and standards. Use
   the linked guidance for questions the project does not cover.
2. Resolve linked paths relative to this `SKILL.md`, then read
   [Good development documentation](../../references/documentation/good-development-documentation.md).
3. Read the target as a whole, the sources that establish its factual claims,
   and the links or navigation by which its readers find it. Identify the
   document's intended readers and the recurring tasks it should support.
4. Read
   [Classifying Knowledge and Skill material](../../references/agents/knowledge-and-skills.md)
   when Knowledge or a Skill is a possible form. Read
   [Agent Skill authoring](../../references/agents/skill-authoring.md) whenever
   a Skill is being reviewed or changed.

## Choose the work

1. Use the user's requested scope, actions, and order when they are specified.
   Otherwise inspect the whole target and use the default sequence below.
2. Evaluate complete removal first. Apply the shared reference and retain the
   document only when the evidence supports an ongoing need. For a retained
   document, define its smallest useful scope and record every problem to fix.
3. For a review-only request, report the evidence and proposed action for every
   finding without editing.
4. When edits are authorized, use the agreed findings as the scope. Report newly
   discovered problems or project choices before expanding it.

## Delete, correct, then move

Unless the user requested a different order, complete each stage before starting
the next:

1. **Delete.** Remove every document or part that has no justified ongoing need.
   Reconcile the prose and every link, index, prompt, or navigation entry affected
   by the deletion.
2. **Correct.** Bring the remaining content into agreement with its authoritative
   sources and rewrite it as one clear account of the current state. When its
   useful role is to help readers find scattered authoritative sources, turn it
   into a focused source index instead of retaining copied explanations.
3. **Move.** Apply the active project's standards to content whose document form
   or current location is unsuitable. Split content with distinct responsibilities
   and move each part to the project- or user-selected destination. Resolve every
   required destination and navigation choice before moving it.
4. Reconcile every remaining affected heading, link, index, prompt, example,
   comment, document, and navigation entry.

## Verify the result

1. Compare the original document with the final state. Account for every agreed
   finding and resolve any unintended loss or change in strength, scope,
   conditions, or exceptions.
2. For a retained document, apply the shared reference's final audience review.
3. Search for stale terminology, competing explanations, and broken links or
   navigation.
   Run the project's formatter, link or anchor checks, Skill validation, and
   other applicable checks.

Finish when the selected outcome is complete, every agreed finding, affected
document, and navigation entry has been reconciled, and every required check
passes.
