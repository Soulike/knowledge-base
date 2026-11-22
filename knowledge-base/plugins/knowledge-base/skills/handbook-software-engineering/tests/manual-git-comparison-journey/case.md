# Extend focused Git analysis into script design

## Identity

- ID: manual-git-comparison-journey
- Kind: journey

## Covered objects

- [Software-engineering Handbook](../../SKILL.md)

## Protected behavior

The software-engineering Handbook must route manual review and standalone Git
analysis to change-comparison semantics without forcing its code-work
foundation. When the same analysis becomes a local comparison script, the
already-selected Handbook must add its code-work foundation and any applicable
external-command guidance. Protect that foundation becoming applicable after
initial selection, while allowing different script designs that preserve the
comparison contract.

## Task

Receive the second request after the first answer and its reading are observed:

1. For a manual review, explain which revisions identify exactly what a feature
   branch contributed after divergence while its target advanced independently.
   Explain what this comparison does and does not establish about merging the
   branch. This is standalone analysis, not an automated workflow.
2. Now design a local non-automation script that reports that contributed file set
   for a human reviewer. Supply a validation plan with a small divergent Git
   history, exact comparison endpoints, and an expected representative file set.

## Starting state

Begin with request 1 and current installed Skill metadata. Permit read-only
access to selected Skill bodies and their direct packaged routes. Supply
request 2 only after the focused comparison explanation, package choices, and
actual reads are captured. Both requests are planning work; no script execution
or repository mutation is required.

## Expected behavior

- R1 (critical): select the software-engineering Handbook from request 1 before
  body access; Automation is not a prerequisite for either phase.
- R2 (critical): request 1 reads
  [Git change-comparison semantics](../../../../knowledge/git/change-comparison-semantics.md)
  without loading the general code-work foundation or unrelated packages.
- R3: define the review question, distinguish target tip, head, merge base, and
  integration result, compare merge base to head for branch contribution, and
  carry immutable revision identities after discovery.
- R4 (critical): after request 2, add and read the primary code-work foundation
  through the same Handbook's direct routes before making dependent script-design
  decisions. Also read external-command guidance before dependent decisions when
  the design meets that route's condition, such as calling command-line tools
  from code. Its earlier focused selection does not settle foundation
  applicability for code work.
- R5: give the script explicit target/head inputs, resolve immutable commits,
  and keep every diff-dependent input on the declared comparison contract.
- R6: the validation plan has independent target advancement, exact endpoints
  and file expectations, and does not treat two-dot and three-dot syntax as
  interchangeable recipes.

## Verification

Observe the initial metadata choice, focused reading and explanation before
revealing request 2. Then inspect the newly applicable foundation, applicable
command reading, script design, and validation plan. A reader that assigns the
foundation correctly in a separate script task but skips it in this continuation
fails R4. The case does not assert generic reread counts or interruption recovery.

## Source

GitHub issues #242 and #251 require the Git-comparison route for manual review,
standalone analysis, and local non-automation scripts. The case retains these
domain boundaries. The maintainer's review of pull request #258 retains the
focused-analysis-to-code-work transition because it activates a foundation in
an already-selected Handbook.
