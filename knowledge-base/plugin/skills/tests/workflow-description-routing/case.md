# Preserve Workflow selection boundaries

## Identity

- ID: workflow-description-routing
- Kind: selection

## Covered objects

- [Still-image prompt design Workflow](../../workflow-design-image-generation-prompts/SKILL.md)
- [Still-image prompt improvement Workflow](../../workflow-improve-image-generation-prompts/SKILL.md)
- [Image-to-video prompt design Workflow](../../workflow-design-image-to-video-prompts/SKILL.md)
- [Image-to-video prompt improvement Workflow](../../workflow-improve-image-to-video-prompts/SKILL.md)
- [Operation failure and recovery Workflow](../../workflow-design-operation-failure-recovery/SKILL.md)
- [Contribution proposal Workflow](../../workflow-propose-knowledge-base-contribution/SKILL.md)
- [Contribution publication Workflow](../../workflow-contribute-to-knowledge-base/SKILL.md)
- [Library-adoption Workflow](../../workflow-evaluate-library-adoption/SKILL.md)
- [Code-review feedback Workflow](../../workflow-handle-code-review-feedback/SKILL.md)
- [Documentation improvement Workflow](../../workflow-improve-dev-documentation/SKILL.md)
- [Web usability probe Workflow](../../workflow-probe-web-usability-with-agents/SKILL.md)
- [npm security remediation Workflow](../../workflow-remediate-npm-security/SKILL.md)
- [Codex Skill resolution Workflow](../../workflow-resolve-invoked-codex-skill/SKILL.md)
- [Local proxy retry Workflow](../../workflow-retry-via-local-proxy/SKILL.md)
- [Test review Workflow](../../workflow-review-and-improve-tests/SKILL.md)
- [Security review Workflow](../../workflow-review-security/SKILL.md)
- [User-answer wait Workflow](../../workflow-wait-for-user-answer/SKILL.md)
- [Pull-request watch Workflow](../../workflow-watch-pull-request/SKILL.md)
- [Documentation writing Workflow](../../workflow-write-dev-documentation/SKILL.md)
- [Effective-test writing Workflow](../../workflow-write-effective-tests/SKILL.md)

## Protected behavior

The execution Workflows must remain discoverable from their complete user tasks
after their names and descriptions are shortened. Protect broad and direct
requests, adjacent exclusions, recovery-only routes, and task-stage distinctions
while allowing unrelated Handbooks or Workflows to be selected when a request
independently needs them.

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
14. Codex was explicitly told to use `$deployment-audit`, but that exact Skill's
    instructions are missing from the current context. Resolve it before
    reporting that the Skill is unavailable.
15. Find any installed Skill that could help me brainstorm release notes; no
    exact Skill was invoked or required.
16. A read-only HTTPS request failed with DNS resolution, and a local proxy is
    available. Retry the same request safely through that proxy.
17. An HTTPS Git clone returned HTTP 403 while the server remained reachable.
18. An HTTPS Git clone timed out before reaching the server, and a local proxy
    is available.
19. Add an automated regression test for the production behavior behind a
    newly fixed order-state bug, deciding first what protection is actually
    owed.
20. Existing integration tests are intermittent and slow. Diagnose their
    protection and execution, then improve only the supported cases.
21. Implement an unrelated feature and run its unchanged existing test command
    as routine verification; no test addition or test review is requested.
22. In Codex, the next safe step depends on whether the user authorizes deletion
    of a production resource. Ask the question and keep dependent work pending
    until the user actually answers.
23. In Codex, the user already answered the pending migration question, so
    continue the dependent work from that answer.
24. Keep observing a pull request after an interrupted polling cycle and
    reconcile its current head, checks, reviews, and human gates.
25. Address one received review comment on the current change; no continuing
    pull-request watch was requested.
26. Inspect an existing codebase broadly for security vulnerabilities without
    starting from a known finding.
27. Design a new people-focused photorealistic still-image prompt. There is no
    existing prompt or generated result to evaluate.
28. Diagnose why an existing people-focused still-image prompt and generated
    result missed the requested composition, then produce an improved prompt.
29. Design a generated still-image prompt for an empty landscape with no people.
30. Edit the supplied portrait so that its background changes while the person
    remains pixel-identical.
31. Design a new people-focused continuous image-to-video shot from the supplied
    opening frame. There is no existing prompt or generated video to evaluate.
32. Diagnose and improve an existing people-focused image-to-video prompt and
    generated continuous shot.
33. Design a text-only generated video with no source image.
34. Turn the supplied source image into a three-shot sequence with two cuts.
35. Design a background export API that clients can submit, poll, and use to
    download a completed report.
36. Refactor a private pure helper whose result never crosses its owning module
    and has no externally observable effect.
37. We have reached a stable stopping point with evidence from a downstream
    task. Assess whether it supports a reusable knowledge-base contribution and,
    if so, prepare a sanitized proposal without publishing it.
38. Publish this already approved sanitized knowledge-base proposal as an issue
    from outside the canonical source checkout.

Return the chosen identifiers and a short reason for each request. Do not open
candidate bodies or perform the substantive tasks.

## Starting state

Build the target-model candidate set from every direct installed entrypoint
whose registered name begins with `handbook-` or `workflow-` under
`knowledge-base/plugin/skills/*/SKILL.md`. Confirm that this produces all 15
Handbooks and 20 Workflows, for 35 candidates. Keep the transitional
`load-knowledge-catalog` entrypoint installed and usable, but exclude it from
this target-model migration selection set. Supply all requests and candidate
names and descriptions without expected choices, target hints, this case, or
evaluator conclusions. Use a fresh supported lower-capability model with the
expanded executor guard and an eight-minute wall-clock allowance. A tool-free
model request that receives only this task and the exact candidate metadata is a
supported selection boundary; when repository access is available instead, keep
it read-only and do not open candidate bodies.

Record the exact source snapshot, model, configuration, complete candidate
metadata, and every choice before any candidate body is opened. Treat each
numbered request independently; a choice for one request must not teach later
requests the expected route.

## Expected behavior

- R1 (critical): select `workflow-contribute-to-knowledge-base` for request 1
  and exclude it for request 2 because publication from outside the canonical
  checkout and source-checkout implementation are different tasks.
- R2 (critical): select `workflow-evaluate-library-adoption` for request 3 and
  exclude it for request 4, whose capability is product-specific rather than a
  reusable domain-independent mechanism.
- R3 (critical): select `workflow-handle-code-review-feedback` for requests 5
  and 25. Select `workflow-watch-pull-request` for requests 6 and 24, and do not
  substitute one Workflow for the other merely because both may concern a pull
  request.
- R4 (critical): select `workflow-improve-dev-documentation` for the open-ended
  audit in request 7 and `workflow-write-dev-documentation` for the accepted
  Skill-content work in request 2 and known update in request 8.
- R5 (critical): select `workflow-probe-web-usability-with-agents` for request 9
  and exclude it for the non-interactive static design in request 10.
- R6 (critical): select `workflow-remediate-npm-security` for request 11 and
  exclude it for the ordinary dependency update in request 13.
- R7 (critical): select `workflow-review-security` for requests 12 and 26. Do
  not require a pre-existing diagnosis before selecting it for the broad review
  in request 26.
- R8 (critical): select `workflow-resolve-invoked-codex-skill` for request 14
  and exclude it for the generic discovery request in request 15.
- R9 (critical): select `workflow-retry-via-local-proxy` for requests 16 and 18
  and exclude it for the reachable HTTP 403 Git-clone failure in request 17.
- R10 (critical): select `workflow-write-effective-tests` for request 19 and
  exclude the existing-test review Workflow there; select
  `workflow-review-and-improve-tests` for request 20. Exclude both for routine
  unchanged test execution in request 21.
- R11 (critical): select `workflow-wait-for-user-answer` for request 22 and
  exclude it once the answer is available in request 23.
- R12 (critical): select `workflow-design-image-generation-prompts` for request
  27 and `workflow-improve-image-generation-prompts` for request 28. Exclude
  both for the non-people request 29 and existing-image edit request 30.
- R13 (critical): select `workflow-design-image-to-video-prompts` for request 31
  and `workflow-improve-image-to-video-prompts` for request 32. Exclude both for
  the text-only request 33 and multi-shot request 34.
- R14 (critical): select `workflow-design-operation-failure-recovery` for
  request 35 even though it describes only success, and exclude it for the
  consumer-invisible internal helper in request 36.
- R15 (critical): select `workflow-propose-knowledge-base-contribution` for
  request 37 and exclude the publication Workflow there. Select
  `workflow-contribute-to-knowledge-base` for request 38 and do not substitute
  proposal assessment for the requested publication task.
- R16: preserve independently applicable additional choices, but do not select
  a target Workflow merely because its subject noun appears in a request whose
  user task belongs to the adjacent route above.
- R17: report metadata choices only, without claiming that a client loaded or
  read a selected Skill or that any substantive task was completed.

## Verification

Use the selection dispatch template and capture one identifier list and reason
per numbered request. Give the capable reviewer this contract, the trusted
pre-rename descriptions from integration commit `e008e1a` for the first
fourteen Workflows, the six remaining pre-rename descriptions from integration
commit `d60172e`, the final candidate metadata, and the raw choices without the
coordinator's verdict. Compare every request against its trusted baseline and
the final metadata, then judge each criterion independently.

A controlled faulty observation that swaps either adjacent documentation,
testing, pull-request, or security route; applies the web probe to a static
design; resolves a Skill without an exact invocation; retries a Git-clone 403;
or advances past an unanswered question must fail the corresponding criterion.
The controlled copy calibrates the reviewer and is not another Agent run.

## Source

GitHub issues #242, #248, and #249 require all execution Workflows to use
`workflow-` names and concise semantic descriptions without losing established
broad, direct, adjacent-negative, recovery, or work-stage coverage. The
pre-rename descriptions at integration commit `e008e1a` remain the trusted
baseline for the first fourteen Workflows; integration commit `d60172e` is the
trusted baseline for the six Workflows added here. This reconstructed joint case
preserves the distinct selection boundaries without retaining compatibility
entrypoints.
