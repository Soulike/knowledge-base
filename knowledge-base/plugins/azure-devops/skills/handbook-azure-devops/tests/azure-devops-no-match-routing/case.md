# Preserve valid no-match Azure DevOps routing

## Identity

- ID: azure-devops-no-match-routing
- Kind: journey

## Covered objects

- [Azure DevOps Handbook](../../SKILL.md)

## Protected behavior

The Azure DevOps Handbook may be applicable from metadata even though its
current curated packages do not cover a narrower Azure Boards topic. The Agent
must select `handbook-azure-devops` from metadata, then accept an empty package
result without applying the pull-request diagram package, inventing guidance,
or implying exhaustive Azure DevOps coverage. Protect this valid no-match
boundary while allowing future packages to make Azure Boards scenarios match
after an authorized change.

## Task

Choose applicable installed guidance for the request below from the current
candidate metadata. After recording the choice, inspect the chosen Handbook
and identify its matching required-reading packages, if any:

Configure Azure Boards swimlanes for a team's sprint workflow.

Do not answer the unsupported platform question from general knowledge. Report
only the guidance selection, package result, and any documented coverage gap.

## Starting state

Construct the current candidate set from the frontmatter of installed Skill
entrypoints in a realistic session containing the installed base
`knowledge-base` plugin Skills together with the `azure-devops` plugin Skill
entrypoints (including `handbook-azure-devops`). Supply the natural request and
candidate names and descriptions without opening candidate bodies. Permit
read-only access to the supplied plugin snapshot after the choice.

Record candidate choices before opening any candidate body. Then allow the
executor to read the complete body and direct routes of its chosen Skill only
far enough to determine package selection. Record the selected candidates,
selected and excluded packages, files read, and final report.

## Expected behavior

- R1 (critical): select `handbook-azure-devops` from the metadata for the Azure
  Boards request before opening any body.
- R2 (critical): after reading `handbook-azure-devops`, select no package and
  exclude the pull-request diagram package.
- R3: state that current curated Azure DevOps coverage has no matching package
  and continue without borrowing another Handbook, applying unrelated narrow
  material, inventing an answer, or claiming Azure DevOps is comprehensively
  documented.

## Verification

Inspect native candidate selection and post-body package selection separately.

A controlled faulty observation that loads the pull-request diagram package,
misses `handbook-azure-devops` in metadata selection, or answers from invented
Azure Boards guidance must fail the corresponding criterion.

## Source

Split from the retired cross-plugin `sparse-platform-no-match` case (originally
from GitHub issues #242 and #246) per #303 and #308 so the Azure DevOps
Handbook owns its standalone metadata-selection and zero-package no-match
journey. Requires a fresh replay against the single-plugin boundary.
