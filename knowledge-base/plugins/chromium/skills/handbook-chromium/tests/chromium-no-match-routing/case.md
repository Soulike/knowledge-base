# Preserve valid no-match Chromium routing

## Identity

- ID: chromium-no-match-routing
- Kind: journey

## Covered objects

- [Chromium Handbook](../../SKILL.md)

## Protected behavior

The Chromium Handbook may be applicable from metadata even though its current
curated packages do not cover a narrower Chromium for Android topic. The Agent
must select `handbook-chromium` from metadata, then accept an empty package
result without applying the iOS UI architecture package, inventing guidance, or
implying exhaustive Chromium coverage. Protect this valid no-match boundary
while allowing future packages to make Android scenarios match after an
authorized change.

## Task

Choose applicable installed guidance for the request below from the current
candidate metadata. After recording the choice, inspect the chosen Handbook
and identify its matching required-reading packages, if any:

Diagnose tab restoration in Chromium for Android.

Do not answer the unsupported platform question from general knowledge. Report
only the guidance selection, package result, and any documented coverage gap.

## Starting state

Construct the current candidate set from the frontmatter of installed Skill
entrypoints in a realistic session containing the installed base
`knowledge-base` plugin Skills together with the `chromium` plugin Skill
entrypoints (including `handbook-chromium`). Supply the natural request and
candidate names and descriptions without opening candidate bodies. Permit
read-only access to the supplied plugin snapshot after the choice.

Record candidate choices before opening any candidate body. Then allow the
executor to read the complete body and direct routes of its chosen Skill only
far enough to determine package selection. Record the selected candidates,
selected and excluded packages, files read, and final report.

## Expected behavior

- R1 (critical): select `handbook-chromium` from the metadata for the Chromium
  for Android request before opening any body.
- R2 (critical): after reading `handbook-chromium`, select no package and
  exclude the iOS UI architecture package.
- R3: state that current curated Chromium coverage has no matching package and
  continue without borrowing another Handbook, applying unrelated narrow
  material, inventing an answer, or claiming Chromium is comprehensively
  documented.

## Verification

Inspect native candidate selection and post-body package selection separately.

A controlled faulty observation that loads the iOS UI architecture package,
misses `handbook-chromium` in metadata selection, or answers from invented
Chromium Android guidance must fail the corresponding criterion.

## Source

Split from the retired cross-plugin `sparse-platform-no-match` case (originally
from GitHub issues #242 and #246) per #303 and #308 so the Chromium Handbook
owns its standalone metadata-selection and zero-package no-match journey.
Requires a fresh replay against the single-plugin boundary.
