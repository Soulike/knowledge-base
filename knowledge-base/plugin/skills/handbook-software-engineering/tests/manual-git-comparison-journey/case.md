# Compare source changes outside automation

## Identity

- ID: manual-git-comparison-journey
- Kind: journey

## Covered objects

- [Software-engineering Handbook](../../SKILL.md)

## Protected behavior

Manual pull-request and branch review, standalone Git change analysis, and a
non-automation comparison script must retain the pre-cutover change-comparison
route. The route must work through software-engineering selection without
requiring CI/CD or another automation artifact, while adding the code-work
foundation only when the task later becomes script implementation.

## Task

Work through these messages in one task, receiving the second only after the
first response and observations are recorded:

1. `For a manual review, explain which revisions I should compare to identify exactly what a feature branch contributed after it diverged from its target. The target advanced independently afterward. This is a standalone analysis, not CI/CD, a scheduled job, or an automated workflow.`
2. `Now design a local non-automation script that reports that contributed file set for a human reviewer and verifies its behavior with a small divergent Git history.`

Return the comparison explanation first, then the script design and validation
plan after the task changes.

## Starting state

Supply message 1 and the exact current 35-candidate metadata without expected
choices, target hints, this case, or evaluator conclusions. Use a fresh
supported lower-capability model with the expanded executor guard, read-only
access to the supplied repository snapshot, and an eight-minute total
allowance.

Record candidate choices before opening bodies. Then supply the complete bodies
of chosen Skills and permit read-only access to their direct canonical routes.
Ask the executor to record every selected and excluded package before opening
Knowledge and before answering message 1. Only after that observation, send
message 2 and record re-evaluated Handbook, foundation, and package choices
before the script design. Record the exact source snapshot, model,
configuration, candidate metadata, both messages, choices, files and sections
read, both results, and available action observations.

## Expected behavior

- R1 (critical): message 1 selects `handbook-software-engineering` and excludes
  `handbook-automation` before seeing bodies; automation is not a prerequisite
  for manual review or standalone analysis.
- R2 (critical): message 1 selects and reads [Git change-comparison
  semantics](../../../../knowledge/git/change-comparison-semantics.md) without the
  general code-work foundation or unrelated software packages.
- R3: define the review question before selecting endpoints, use the merge base
  of target and head against the head tree for branch contribution, distinguish
  target tip, head, merge base, and integration result, and carry immutable
  revision identities after discovery.
- R4 (critical): message 2 re-evaluates the same Handbook, adds its primary
  code-work foundation before designing the script, and reuses the still-current
  Git comparison reading. It still does not select or depend on the Automation
  Handbook.
- R5: design the script around an explicit target and head, resolve immutable
  commits, compute the comparison that answers the declared question, and keep
  every diff-dependent input on that same comparison contract.
- R6: validate with a bounded divergent history in which the target advances
  independently, assert the exact endpoints and representative file set, and
  avoid treating two-dot and three-dot syntax as interchangeable recipes.

## Verification

Use the journey dispatch protocol. Inspect initial native selection, focused
package choice, actual reading and explanation, then later foundation addition,
reading reuse, and script application as separate observations. Give the
capable reviewer this contract, the final Handbook and direct routes, the exact
candidate metadata, both messages, and raw observations without the
coordinator's verdict. Judge every criterion independently and retain every
attempt.

A controlled faulty observation that selects Automation as a prerequisite,
loads the software foundation during message 1, compares the moving target tip
directly with the head for the contribution question, or omits the divergent
history must fail the corresponding criterion. The controlled copy calibrates
the reviewer and is not another Agent run.

## Source

Before the routing cutover, the Catalog selected Git change-comparison
semantics for comparisons used by a script, workflow, review, or analysis.
GitHub issues #242 and #251 require preserving that natural task coverage while
moving runtime reading into installed Skills. This case protects the
non-automation paths that the initial cutover omitted.
