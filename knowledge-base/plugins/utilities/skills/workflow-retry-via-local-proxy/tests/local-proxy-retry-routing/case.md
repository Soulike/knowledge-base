# Preserve local-proxy retry Workflow selection boundaries

## Identity

- ID: local-proxy-retry-routing
- Kind: selection

## Covered objects

- [Local proxy retry Workflow](../../SKILL.md)

## Protected behavior

The `workflow-retry-via-local-proxy` Workflow description must remain
discoverable for eligible proxy-capable request failures and timed-out HTTP(S)
Git clones while excluding reachable HTTP 403 Git-clone failures from metadata
alone. Protect this positive and adjacent-negative selection boundary while
allowing unrelated Handbooks or Workflows to be selected when a request
independently needs them.

## Task

For each independent request below, choose the applicable installed guidance
from the current candidate metadata, or choose none:

1. A read-only HTTPS request failed with DNS resolution, and a local proxy is
   available. Retry the same request safely through that proxy.
2. An HTTPS Git clone returned HTTP 403 while the server remained reachable.
3. An HTTPS Git clone timed out before reaching the server, and a local proxy
   is available.

Return the chosen identifiers and a short reason for each request. Do not open
candidate bodies or perform the substantive tasks.

## Starting state

Build the target-model candidate set from the installed `utilities` plugin
Skill entrypoint (`workflow-retry-via-local-proxy`) together with the installed
`knowledge-base` base-plugin Skills. Supply all three requests and candidate
names and descriptions without opening candidate bodies. A request that receives
only this task and the exact candidate metadata is a supported selection
boundary; when repository access is available instead, keep it read-only and do
not open candidate bodies.

Record the complete candidate metadata and every choice before any candidate
body is opened. Treat each numbered request independently; a choice for one
request must not teach later requests the expected route.

## Expected behavior

- R1 (critical): select `workflow-retry-via-local-proxy` for requests 1 and 3,
  and exclude it for the reachable HTTP 403 Git-clone failure in request 2.
- R2: preserve independently applicable additional choices, but do not select
  `workflow-retry-via-local-proxy` merely because Git or HTTP appears in an
  excluded request.
- R3: report metadata choices only, without claiming that a client loaded or
  read a selected Skill or that any substantive task was completed.

## Verification

Capture one identifier list and reason per numbered request. Compare every
request with the trusted pre-rename description from integration commit
`e008e1a` and with the final candidate metadata.

A controlled faulty observation that omits `workflow-retry-via-local-proxy` for
request 1 or 3, or selects it for the reachable HTTP 403 Git-clone failure in
request 2, must fail the corresponding critical criterion.

## Source

Split from `workflow-description-routing` per #320 and #328 so the optional
`utilities` plugin owns the selection boundary for
`workflow-retry-via-local-proxy` (originally established in GitHub issues #242,
#248, and #249 against integration commit `e008e1a`).
