# Route Azure DevOps pull-request diagram guidance

## Identity

- ID: azure-devops-pr-diagram-routing
- Kind: application

## Covered objects

- [Azure DevOps Handbook](../../SKILL.md)

## Protected behavior

The Azure DevOps Handbook must route a pull-request diagram publication and
verification request directly to its pull-request diagram Knowledge without
borrowing another Handbook or treating that package as comprehensive Azure
DevOps guidance. Protect direct package selection, PNG attachment preservation,
and observation-boundary distinctions while allowing future independent
Azure DevOps packages and different answer wording. The replay must not
require an external publication effect that its starting state does not supply
or authorize.

## Task

Prepare a Mermaid architecture diagram for publication in an Azure DevOps
pull-request description and explain how to verify what reviewers receive.

Identify and read the matching package in the Azure DevOps Handbook, then give
a concise answer grounded in that material.

## Starting state

Supply the complete current [Azure DevOps Handbook](../../SKILL.md), its
permitted direct reading route, the task request, and read-only access to the
supplied plugin snapshot.

No Azure DevOps pull request, renderer, attachment endpoint, or publication
authorization is supplied. The request prepares editable source and the
verification procedure. The executor must distinguish that preparation from
unperformed rendering, attachment, stored-description, and reviewer-surface
observations instead of claiming those effects.

Ask the executor to record every selected and excluded package before reading,
then read the required current material and answer the request. Record package
choices, files read, final answer, and available action observations.

## Expected behavior

- R1 (critical): select and read the Azure DevOps pull-request diagram package
  via its direct canonical route before answering.
- R2 (critical): preserve Mermaid as editable source and explain that
  publication requires an inspected PNG attachment and its returned download
  URL.
- R3 (critical): distinguish local rendering and visual inspection, attachment
  upload and download verification, reading back stored Markdown, and observed
  reviewer rendering. Do not claim any of those unavailable observations
  occurred without a supplied renderer and publication target.
- R4: ground the answer in the Azure DevOps Handbook's canonical package
  without invoking or depending on another Handbook, and without implying that
  this one package covers the rest of Azure DevOps.
- R5: treat packaged guidance as supplemental to active project requirements
  and preserve report and version scope limits from the canonical material.

## Verification

Inspect package choices, file-read evidence, and the resulting answer
separately.

Controlled faulty answers that omit reading the pull-request diagram package,
advise publishing raw Mermaid without PNG attachment verification, or claim
publication or rendering observations without the specified verification
boundaries must fail the corresponding critical criterion.

## Source

Split from the retired cross-plugin `platform-package-routing` case (originally
reconstructed from GitHub issues #242 and #246) per #303 and #308 so the Azure
DevOps Handbook owns its standalone single-plugin package-routing protection.
Requires a fresh replay against the completed Handbook.
