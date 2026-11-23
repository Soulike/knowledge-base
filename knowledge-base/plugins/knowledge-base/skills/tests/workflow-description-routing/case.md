# Preserve base Workflow selection boundaries

## Identity

- ID: workflow-description-routing
- Kind: selection

## Covered objects

- [Operation failure and recovery Workflow](../../workflow-design-operation-failure-recovery/SKILL.md)
- [Contribution publication Workflow](../../workflow-contribute-to-knowledge-base/SKILL.md)
- [Library-adoption Workflow](../../workflow-evaluate-library-adoption/SKILL.md)
- [Code-review feedback Workflow](../../workflow-handle-code-review-feedback/SKILL.md)
- [Development-documentation Workflow](../../workflow-maintain-dev-documentation/SKILL.md)
- [Automated-testing management Workflow](../../workflow-manage-automated-tests/SKILL.md)
- [Web usability probe Workflow](../../workflow-probe-web-usability-with-agents/SKILL.md)
- [npm security remediation Workflow](../../workflow-remediate-npm-security/SKILL.md)
- [Security review Workflow](../../workflow-review-security/SKILL.md)
- [Pull-request watch Workflow](../../workflow-watch-pull-request/SKILL.md)

## Protected behavior

The 10 base `knowledge-base` execution Workflows must remain discoverable from
their complete user tasks after their names and descriptions are shortened.
Protect broad and direct requests, adjacent exclusions, recovery-only routes,
and task-stage distinctions while allowing unrelated Handbooks or Workflows to
be selected when a request independently needs them.

## Task

For each independent request or task state below, choose the applicable
installed guidance from the current candidate metadata, or choose none:

1. I developed reusable Agent guidance in another project and want to submit a
   sanitized proposal to the canonical knowledge base without cloning it.
2. I am already editing the canonical knowledge-base source checkout; implement
   its accepted Skill-content ticket locally.
3. Before we build a reusable cross-project parsing facility, evaluate whether
   an established maintained library already provides it.
4. Add one customer-specific eligibility rule inside this product's existing
   domain module; no reusable technical capability is being introduced.
5. A reviewer challenged the failure handling in my unpushed local patch.
   Investigate the feedback and apply it only if it is correct and authorized.
6. Resume watching pull request 418 through new reviews and CI results until a
   human-owned approval or another terminal watch condition is reached.
7. The repository's developer guide has accumulated confusing organization and
   stale examples. Audit it and improve the maintained content.
8. A new CLI flag is implemented and its README entry and source docstring now
   need the known corresponding update.
9. The checkout flow is operable in a safe web prototype. Have Agents attempt
   its critical task path and report evidence-backed usability risks.
10. Critique the visual hierarchy of a static design image that has no
    interactive web task path.
11. Fix an npm audit finding in a transitive dependency through a supported
    upgrade or removal of the unused dependency chain.
12. Review an authentication middleware change for vulnerabilities and validate
    whether its proposed security fix closes the trust-boundary failure.
13. Upgrade an ordinary npm dependency to obtain a new feature; there is no
    security finding.
14. Add an automated regression test for the production behavior behind a
    newly fixed order-state bug, deciding first what protection is actually
    owed.
15. Existing integration tests are intermittent and slow. Diagnose their
    protection and execution, then improve only the supported cases.
16. Implement an unrelated feature and run its unchanged existing test command
    as routine verification; no test addition or test review is requested.
17. Keep observing a pull request after an interrupted polling cycle and
    reconcile its current head, checks, reviews, and human gates.
18. Address one received review comment on the current change; no continuing
    pull-request watch was requested.
19. Inspect an existing codebase broadly for security vulnerabilities without
    starting from a known finding.
20. Design a background export API that clients can submit, poll, and use to
    download a completed report.
21. Refactor a private pure helper whose result never crosses its owning module
    and has no externally observable effect.
22. Publish this already approved sanitized knowledge-base proposal as an issue
    from outside the canonical source checkout.
23. Add a TypeScript module that reads GitHub repository issues, pull requests,
    check results, and review threads using the project's existing
    authentication, then expose the results to our release service.
24. An accepted production behavior change made an existing test fail. Update
    the test to match the new behavior.
25. Rename a button label on the settings page and add a read-only `/healthz`
    endpoint that returns `200 OK`.
26. Audit our checkout confirmation and webhook delivery flow for partial
    failures, unconfirmed payment states, and safe consumer retry.

Return the chosen identifiers and a short reason for each request. Do not open
candidate bodies or perform the substantive tasks.

## Starting state

Build the target-model candidate set from the installed `knowledge-base` base
plugin Skill entrypoints (including all 10 base Workflows listed in `Covered
objects` alongside the base Handbooks; other installed plugins may also be
present in the session environment when active). Supply all requests and
candidate names and descriptions without opening candidate bodies. A request
that receives only this task and the exact candidate metadata is a supported
selection boundary; when repository access is available instead, keep it
read-only and do not open candidate bodies.

Record the complete candidate metadata and every choice before any candidate
body is opened. Treat each numbered request independently; a choice for one
request must not teach later requests the expected route.

## Expected behavior

- R1 (critical): select `workflow-contribute-to-knowledge-base` for request 1
  and exclude it for request 2 because publication from outside the canonical
  checkout and source-checkout implementation are different tasks.
- R2 (critical): select `workflow-evaluate-library-adoption` for requests 3 and 23. Request 23 must not be excluded merely because its client targets one
  external platform. Exclude the Workflow for request 4, whose change is only a
  product-specific business rule and introduces no reusable technical
  functionality or external-system integration.
- R3 (critical): select `workflow-handle-code-review-feedback` for requests 5
  and 18. Select `workflow-watch-pull-request` for requests 6 and 17, and do not
  substitute one Workflow for the other merely because both may concern a pull
  request.
- R4 (critical): select `workflow-maintain-dev-documentation` for the accepted
  Skill-content work in request 2, the open-ended audit in request 7, and the
  known update in request 8.
- R5 (critical): select `workflow-probe-web-usability-with-agents` for request 9
  and exclude it for the non-interactive static design in request 10.
- R6 (critical): select `workflow-remediate-npm-security` for request 11 and
  exclude it for the ordinary dependency update in request 13.
- R7 (critical): select `workflow-review-security` for requests 12 and 19. Do
  not require a pre-existing diagnosis before selecting it for the broad review
  in request 19.
- R8 (critical): select `workflow-manage-automated-tests` for requests 14, 15,
  and 24. Exclude it for routine unchanged test execution in request 16.
- R9 (critical): select `workflow-design-operation-failure-recovery` for
  request 20 even though it describes only success and for request 26, and
  exclude it for the consumer-invisible internal helper in request 21 and the
  routine label and read-only health-check change in request 25.
- R10 (critical): select `workflow-contribute-to-knowledge-base` for request 22
  to publish an approved sanitized proposal as an issue from outside the
  canonical checkout.
- R11: preserve independently applicable additional choices, but do not select
  a target Workflow merely because its subject noun appears in a request whose
  user task belongs to the adjacent route above.
- R12: report metadata choices only, without claiming that a client loaded or
  read a selected Skill or that any substantive task was completed.

## Verification

Capture one identifier list and reason per numbered request. Compare every
request with the trusted pre-rename descriptions from integration commits
`e008e1a` and `d60172e` and with the final candidate metadata.

A controlled faulty observation that swaps either adjacent documentation,
pull-request, or security route; selects the testing workflow for routine
unchanged test execution; or applies the web probe to a static design must fail
the corresponding criterion.

## Source

GitHub issues #242, #248, and #249 require all execution Workflows to use
`workflow-` names and concise semantic descriptions without losing established
broad, direct, adjacent-negative, recovery, or work-stage coverage (with
`e008e1a` and `d60172e` as the original pre-rename description baselines). Per
#303 and #308, Codex-specific and generative-media Workflows were split into
their own selection cases (`codex-workflow-description-routing` and
`generative-media-workflow-negative-boundaries`). Per #320, #325, #326, and
#328, the documentation and testing Workflows were consolidated into
`workflow-maintain-dev-documentation` and `workflow-manage-automated-tests`,
`workflow-propose-knowledge-base-contribution` was removed, and the local-proxy
retry Workflow moved into `local-proxy-retry-routing` under `utilities`, leaving
this case protecting the 10 base `knowledge-base` Workflows. Per #319,
`workflow-design-operation-failure-recovery` was narrowed to failure-prone,
multi-state, background, or explicit recovery work while excluding routine
non-recovery changes (requests 25 and 26). Request 23
reconstructs an observed failure in which a GitHub information client was
implemented with custom HTTP requests without first evaluating an established
SDK or library. Request 24 reconstructs an observed failure during pull request
#270 in which a compiler-owned generated-output test was mechanically updated
after production ownership changed, before the test's continued value was
reassessed.
