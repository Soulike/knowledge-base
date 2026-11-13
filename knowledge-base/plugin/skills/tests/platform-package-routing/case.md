# Route the current sparse platform packages

## Identity

- ID: platform-package-routing
- Kind: application

## Covered objects

- [Azure DevOps Handbook](../../handbook-azure-devops/SKILL.md)
- [Chromium Handbook](../../handbook-chromium/SKILL.md)
- [Codex Handbook](../../handbook-codex/SKILL.md)

## Protected behavior

Each sparse platform Handbook must route its current narrow package directly
when observable work matches it, without borrowing another Handbook or treating
that package as comprehensive platform guidance. Protect direct package
selection and useful application while allowing future independent packages
and different answer wording. The replay must not require an external
publication effect that its starting state does not supply or authorize.

## Task

Handle these three independent requests:

1. Configure Codex to use a GitHub Copilot Enterprise subscription through a
   custom model provider without storing the GitHub token in the configuration.
   The command-backed GitHub authentication succeeds, but a small test request
   then reports an unsupported request shape. Diagnose that failure boundary
   without changing unrelated provider settings.
2. Prepare a Mermaid architecture diagram for publication in an Azure DevOps
   pull-request description and explain how to verify what reviewers receive.
3. Review a proposed Chromium iOS UI feature in which a view controller fetches
   a profile service directly and uses `CommandDispatcher` for a feature-local
   presentation request.

For each request, identify and read the matching package, then give a concise
answer grounded in that material.

## Starting state

Supply the complete current Azure DevOps, Chromium, and Codex Handbooks, their
permitted direct reading routes, the three task requests, and read-only access
to the supplied repository snapshot.

No Azure DevOps pull request, renderer, attachment endpoint, or publication
authorization is supplied. The Azure request prepares editable source and the
verification procedure. The executor must distinguish that preparation from
unperformed rendering, attachment, stored-description, and reviewer-surface
observations instead of claiming those effects.

Ask the executor to record every selected and excluded package before reading,
then read the required current material and answer each request. Record package
choices, files read, final answers, and available action observations.

## Expected behavior

- R1 (critical): select and read the Codex Copilot Enterprise provider package
  only for the Codex request. Use the verified endpoint and Responses protocol,
  command-backed GitHub CLI authentication, current model availability, secret
  boundary, and boundary-specific diagnosis without presenting a remembered
  model as a durable recommendation.
- R2 (critical): select and read the Azure DevOps pull-request diagram package
  only for the Azure request. Preserve Mermaid as editable source and explain
  that publication requires an inspected PNG attachment and its returned
  download URL. Distinguish local rendering and inspection, attachment
  verification, stored Markdown, and observed reviewer rendering. Do not claim
  any of those unavailable observations occurred without a supplied renderer
  and publication target.
- R3 (critical): select and read the Chromium iOS UI architecture package only
  for the Chromium request. Move profile-service access and model adaptation to
  an injected mediator boundary, keep composition and presentation in the
  coordinator, and use an injected local command handler instead of the shared
  dispatcher for the feature-local request.
- R4: link each answer to its own platform's canonical package without invoking
  or depending on another Handbook. Do not imply that any one package covers
  the rest of its platform.
- R5: treat packaged guidance as supplemental to active project requirements
  and preserve version or observation limits from the canonical material.

## Verification

Inspect package choices, file-read evidence, and each resulting answer
separately.

Controlled faulty answers that hard-code a stale Codex model, publish raw
Mermaid or claim publication without the specified verification boundaries, or keep model access in
the Chromium view controller must fail the corresponding critical criterion.

## Source

GitHub issues #242 and #246 assign the current Copilot Enterprise provider,
Azure DevOps pull-request diagram, and Chromium iOS UI architecture material to
three independent platform Handbooks with direct canonical routes. This
reconstructed case requires a fresh replay against the completed Handbooks.
