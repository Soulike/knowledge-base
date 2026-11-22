# Route Chromium iOS UI architecture guidance

## Identity

- ID: chromium-ios-ui-routing
- Kind: application

## Covered objects

- [Chromium Handbook](../../SKILL.md)

## Protected behavior

The Chromium Handbook must route a Chromium iOS UI architecture review request
directly to its iOS UI architecture Knowledge without borrowing another Handbook
or treating that package as comprehensive Chromium guidance. Protect direct
package selection, layer separation, and local-vs-shared command routing while
allowing future independent Chromium packages and different answer wording.

## Task

Review a proposed Chromium iOS UI feature in which a view controller fetches a
profile service directly and uses `CommandDispatcher` for a feature-local
presentation request.

Identify and read the matching package in the Chromium Handbook, then give a
concise answer grounded in that material.

## Starting state

Supply the complete current [Chromium Handbook](../../SKILL.md), its permitted
direct reading route, the task request, and read-only access to the supplied
plugin snapshot.

Ask the executor to record every selected and excluded package before reading,
then read the required current material and answer the request. Record package
choices, files read, final answer, and available action observations.

## Expected behavior

- R1 (critical): select and read the Chromium iOS UI architecture package via
  its direct canonical route before answering.
- R2 (critical): move profile-service access and model adaptation to an
  injected mediator boundary (with consumer or observable state and mutator
  protocols separating UI and model), keep feature composition and presentation
  in the coordinator, and use an injected local command handler instead of
  `CommandDispatcher` for the feature-local presentation request.
- R3: ground the answer in the Chromium Handbook's canonical package without
  invoking or depending on another Handbook, and without implying that this one
  package covers the rest of Chromium.
- R4: treat packaged guidance as supplemental to active project requirements
  and preserve version or observation limits from the canonical material.

## Verification

Inspect package choices, file-read evidence, and the resulting answer
separately.

Controlled faulty answers that omit reading the iOS UI architecture package,
keep model access in the Chromium view controller, or keep `CommandDispatcher`
for the feature-local request must fail the corresponding critical criterion.

## Source

Split from the retired cross-plugin `platform-package-routing` case (originally
reconstructed from GitHub issues #242 and #246) per #303 and #308 so the Chromium
Handbook owns its standalone single-plugin package-routing protection. Requires
a fresh replay against the completed Handbook.
