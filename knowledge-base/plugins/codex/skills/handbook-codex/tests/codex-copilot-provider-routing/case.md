# Route Codex Copilot Enterprise provider guidance

## Identity

- ID: codex-copilot-provider-routing
- Kind: application

## Covered objects

- [Codex Handbook](../../SKILL.md)

## Protected behavior

The Codex Handbook must route a GitHub Copilot Enterprise custom-provider
configuration and boundary-diagnosis request directly to its Copilot Enterprise
provider Knowledge without borrowing another Handbook or treating that package
as comprehensive Codex guidance. Protect direct package selection, secret and
model boundaries, and boundary-specific failure diagnosis while allowing future
independent Codex packages and different answer wording.

## Task

Configure Codex to use a GitHub Copilot Enterprise subscription through a
custom model provider without storing the GitHub token in the configuration, and
explain how to choose a valid model identifier safely. The command-backed
GitHub authentication succeeds, but a small test request then reports an
unsupported request shape. Diagnose that failure boundary without changing
unrelated provider settings.

Identify and read the matching package in the Codex Handbook, then give a
concise answer grounded in that material.

## Starting state

Supply the complete current [Codex Handbook](../../SKILL.md), its permitted
direct reading route, the task request, and read-only access to the supplied
plugin snapshot.

Ask the executor to record every selected and excluded package before reading,
then read the required current material and answer the request. Record package
choices, files read, final answer, and available action observations.

## Expected behavior

- R1 (critical): select and read the Codex Copilot Enterprise provider package
  via its direct canonical route before answering.
- R2 (critical): use the verified endpoint and Responses protocol, command-backed
  GitHub CLI authentication, current model availability under the intended
  integration identity and enterprise policy, and the credential secret boundary
  without presenting a remembered model as a durable recommendation.
- R3 (critical): classify the unsupported request-shape failure at the
  Responses API compatibility and `wire_api` boundary without changing
  unrelated transport, retry, timeout, or WebSocket settings.
- R4: ground the answer in the Codex Handbook's canonical package without
  invoking or depending on another Handbook, and without implying that this one
  package covers the rest of Codex.
- R5: treat packaged guidance as supplemental to active project requirements
  and preserve compatibility and observation limits from the canonical material.

## Verification

Inspect package choices, file-read evidence, and the resulting answer
separately.

Controlled faulty answers that omit reading the Copilot Enterprise provider
package, hard-code a stale Codex model or token, or misdiagnose the
request-shape failure as authentication or add unrelated transport tuning must
fail the corresponding critical criterion.

## Source

Split from the retired cross-plugin `platform-package-routing` case (originally
reconstructed from GitHub issues #242 and #246) per #303 and #308 so the Codex
Handbook owns its standalone single-plugin package-routing protection. Aligned
during #314 after comparative `origin/main` vs. `HEAD` replay showed that
asking only for concise config and request-shape diagnosis left model-selection
criteria outside the prompt scope, while preserving all R1–R5 expectations
unchanged. Requires a fresh replay against the completed Handbook.
