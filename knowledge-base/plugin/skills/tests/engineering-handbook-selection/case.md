# Select engineering Handbooks from natural work

## Identity

- ID: engineering-handbook-selection
- Kind: selection

## Covered objects

- [Software-engineering Handbook](../../handbook-software-engineering/SKILL.md)
- [Automated-testing Handbook](../../handbook-automated-testing/SKILL.md)
- [JavaScript and TypeScript Handbook](../../handbook-javascript-typescript/SKILL.md)
- [Filesystems Handbook](../../handbook-filesystems/SKILL.md)
- [Development-tooling Handbook](../../handbook-development-tooling/SKILL.md)
- [Automation Handbook](../../handbook-automation/SKILL.md)
- [GitHub Actions Handbook](../../handbook-github-actions/SKILL.md)

## Protected behavior

The software-engineering, automated-testing, JavaScript/TypeScript, filesystem,
and development-tooling Handbooks form the five-engineering-Handbook group.
They must be discoverable from the user's work or
current material without naming internal Knowledge. Their descriptions must
support broad, direct, focused-learning, overlap, and nearby negative requests
while tolerating wording changes and legitimate selection of unrelated Workflow
Skills.

## Task

For each request below, start a separate selection-only context and choose every
applicable candidate from the supplied real Skill metadata. Record the choices
before opening any candidate body.

1. `Add CSV export to this service and review the implementation before I ship it.`
2. `Write automated tests for the webhook retry behavior and make sure their results are trustworthy.`
3. `Why can Promise.allSettled be safer than Promise.all when several independent requests may fail?`
4. `Implement a Node.js operation that opens a user-selected file, validates it, and then reads it without switching to a different filesystem object.`
5. `Set up shared TypeScript and ESLint checks for this monorepo and diagnose why typed linting exhausts memory in CI.`
6. `Our npm ci job restores a warm npm cache but still contacts the registry. Evaluate whether the install command should change.`
7. `Write an engineering accomplishment report for the leadership review.`
8. `Improve this people-focused image prompt for the Gemini App.`
9. `For a manual pull-request review, compare the feature head with its target so I see exactly what the branch contributed after divergence. The target advanced independently afterward.`
10. `Explain which Git revisions answer what a branch contributed after it diverged. This is a standalone analysis, not CI/CD or an automated workflow.`
11. `Design a local non-automation script that reports the files contributed by a branch relative to its merge base for a human reviewer.`
12. `Design a confirmation-before-delete flow that previews the exact target and consequences and performs the effect only after a current human decision.`
13. `Design automated tests proving that approval of a replaced proposal cannot authorize or consume the replacement proposal.`
14. `Explain how to name Git branches consistently. No comparison, review, analysis, or script is requested.`
15. `Design a GitHub Actions pull-request workflow that checks out the current head, sets up its runtime, lets an Agent inspect it, and posts the decision as a PR comment. Rerun when the head changes; later jobs must not act on stale, failed, or incomplete results.`

## Starting state

Construct the candidate set from every installed Skill entrypoint in the exact
tested source snapshot. Supply only registered names, descriptions, paths, and
the normal client metadata visible before selection. Do not expose Skill bodies,
expected selections, this case, or evaluator annotations. Use a fresh supported
lower-capability model with the expanded executor guard and a four-minute total
allowance for the fifteen independent choices.

Record the source snapshot, client or dispatch mechanism, model, configuration,
candidate count, any metadata truncation, and each raw choice. Selection-only
dispatch must not claim that a client loaded the chosen bodies.

## Expected behavior

- R1 (critical): request 1 selects `handbook-software-engineering` and excludes
  the other four engineering Handbooks because the request does not yet establish a
  language, automated-test, filesystem, or development-tooling task.
- R2 (critical): request 2 selects `handbook-automated-testing`; selection of
  `handbook-software-engineering` for the test code is allowed.
- R3 (critical): request 3 selects `handbook-javascript-typescript`. It may also
  select `handbook-software-engineering`, but must not select testing,
  filesystems, or development tooling merely because the explanation concerns
  code.
- R4 (critical): request 4 selects `handbook-software-engineering`,
  `handbook-javascript-typescript`, and `handbook-filesystems`.
- R5 (critical): request 5 selects `handbook-javascript-typescript` and
  `handbook-development-tooling`.
- R6 (critical): request 6 selects `handbook-development-tooling` without
  requiring JavaScript or TypeScript source work.
- R7: requests 7 and 8 exclude all five engineering Handbooks. Other applicable
  installed Handbooks or Workflow Skills are allowed.
- R8: the choices are based on the semantic task and current material rather
  than literal Handbook names or hidden package contents.
- R9 (critical): requests 9 through 11 select
  `handbook-software-engineering` and exclude `handbook-automation`; manual
  review, standalone analysis, and a local comparison script must not require
  an automated-workflow scene. Request 14 excludes
  `handbook-software-engineering`; merely mentioning Git without a source-change
  task does not activate that route. Other independently applicable guidance is
  allowed.
- R10 (critical): requests 12 and 13 select
  `handbook-software-engineering`. Request 13 also selects
  `handbook-automated-testing`; testing guidance does not replace the software
  authorization route.
- R11 (critical): request 15 independently selects both `handbook-automation`
  and `handbook-github-actions`; neither the general automation scene nor the
  platform scene replaces the other.

## Verification

Use the selection dispatch template and keep every request independent. Give
the capable reviewer the exact candidate metadata, raw choices, model and
client details, and this contract only after all choices are recorded. Judge
each request separately; a correct choice on one request does not offset a
missed critical route or unrelated selection on another.

For rubric calibration, controlled faulty observations that omit the only
required covered Handbook for requests 1, 2, 5, or 6, or that select one of the
five for requests 7 or 8, must fail the corresponding criterion. Omitting
software engineering for requests 9 through 13, requiring automation for
requests 9 through 11, or selecting software engineering for request 14 must
also fail the corresponding critical criterion. These copies test the reviewer
rather than the Handbooks.

## Source

GitHub issues #242 and #245 establish the five Handbook boundaries and require
broad, direct, focused-learning, overlap, and adjacent-negative evidence against
the real candidate set. The final review also requires preservation of the old
Git-comparison route for manual review, analysis, and non-automation scripts and
the human-authorization route for design and testing. This case reconstructs
those accepted requests before implementation and requires fresh evidence
against the final source.
