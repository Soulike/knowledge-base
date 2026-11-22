# Preserve valid no-match Codex routing

## Identity

- ID: codex-no-match-routing
- Kind: journey

## Covered objects

- [Codex Handbook](../../SKILL.md)

## Protected behavior

The Codex Handbook may be applicable from metadata even though its current
curated packages do not cover Codex MCP server configuration. The Agent must
select `handbook-codex` from metadata, then accept an empty package result
without applying the Copilot Enterprise provider package, inventing guidance,
or implying exhaustive Codex coverage. Protect this valid no-match boundary
while allowing future packages to make Codex MCP configuration match after an
authorized change.

## Task

Choose applicable installed guidance for the request below from the current
candidate metadata. After recording the choice, inspect the chosen Handbook
and identify its matching required-reading packages, if any:

Configure an MCP server in Codex without using a GitHub Copilot Enterprise
custom model provider.

Do not answer the unsupported platform question from general knowledge. Report
only the guidance selection, package result, and any documented coverage gap.

## Starting state

Construct the current candidate set from the frontmatter of installed Skill
entrypoints in a realistic session containing the installed base
`knowledge-base` plugin Skills together with the `codex` plugin Skill
entrypoints (including `handbook-codex`). Supply the natural request and
candidate names and descriptions without opening candidate bodies. Permit
read-only access to the supplied plugin snapshot after the choice.

Record candidate choices before opening any candidate body. Then allow the
executor to read the complete body and direct routes of its chosen Skill only
far enough to determine package selection. Record the selected candidates,
selected and excluded packages, files read, and final report.

## Expected behavior

- R1 (critical): select `handbook-codex` from the metadata for the Codex MCP
  request before opening any body.
- R2 (critical): after reading `handbook-codex`, select no package and exclude
  the Copilot Enterprise provider package.
- R3: state that current curated Codex coverage has no matching package and
  continue without borrowing another Handbook, applying unrelated narrow
  material, inventing an answer, or claiming Codex is comprehensively
  documented.

## Verification

Inspect native candidate selection and post-body package selection separately.

A controlled faulty observation that loads the Copilot Enterprise provider
package, misses `handbook-codex` in metadata selection, or answers from invented
Codex MCP guidance must fail the corresponding criterion.

## Source

Split from the retired cross-plugin `sparse-platform-no-match` case (originally
from GitHub issues #242 and #246) per #303 and #308 so the Codex Handbook owns
its standalone metadata-selection and zero-package no-match journey. Requires a
fresh replay against the single-plugin boundary.
