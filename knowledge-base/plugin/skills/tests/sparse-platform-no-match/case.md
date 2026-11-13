# Preserve valid no-match platform routing

## Identity

- ID: sparse-platform-no-match
- Kind: journey

## Covered objects

- [Azure DevOps Handbook](../../handbook-azure-devops/SKILL.md)
- [Chromium Handbook](../../handbook-chromium/SKILL.md)
- [Codex Handbook](../../handbook-codex/SKILL.md)
- [GitHub Actions Handbook](../../handbook-github-actions/SKILL.md)

## Protected behavior

A broad platform Handbook may be applicable even though its current curated
packages do not cover the user's narrower platform topic. The Agent must select
the platform entry from metadata, then accept an empty package result without
applying the only available package, inventing guidance, or implying exhaustive
coverage. Protect all four sparse-platform boundaries while allowing future
packages to make an individual scenario match after an authorized change.

## Task

For each independent request below, choose applicable installed guidance from
the current candidate metadata. After recording the choice, inspect each chosen
Handbook and identify its matching required-reading packages, if any:

1. Configure Azure Boards swimlanes for a team's sprint workflow.
2. Diagnose tab restoration in Chromium for Android.
3. Explain GitHub Actions artifact-retention limits without creating or editing
   a workflow.
4. Configure an MCP server in Codex without using a GitHub Copilot Enterprise
   custom model provider.

Do not answer the unsupported platform questions from general knowledge. Report
only the guidance selection, package result, and any documented coverage gap.

## Starting state

Build the current candidate set from the frontmatter of every direct installed
Skill entrypoint under `knowledge-base/plugin/skills/*/SKILL.md`. Supply the
four natural requests and candidate names and descriptions without opening
candidate bodies. Permit read-only access to the supplied repository snapshot
after the choices.

Record candidate choices for all four requests before opening any candidate
body. Then allow the executor to read the complete bodies and direct routes of
its chosen Skills only far enough to determine package selection. Record the
selected candidates, selected and excluded packages, files read, and final
report.

## Expected behavior

- R1 (critical): select `handbook-azure-devops` for the Azure Boards request,
  then select no package and exclude the pull-request diagram package.
- R2 (critical): select `handbook-chromium` for the Chromium Android request,
  then select no package and exclude the iOS UI architecture package.
- R3 (critical): select `handbook-github-actions` for the focused
  artifact-retention question, then select no foundation or conditional
  package. The request is not primary workflow artifact work and does not match
  permissions, version selection, Agent lifecycle, or gh-aw model execution.
- R4 (critical): select `handbook-codex` for the Codex MCP request, then select
  no package and exclude the Copilot Enterprise provider package.
- R5: for every request, state that current curated coverage has no matching
  package and continue without borrowing another Handbook, applying unrelated
  narrow material, inventing an answer, or claiming the platform is
  comprehensively documented.

## Verification

Inspect native candidate selection and post-body package selection separately
for each request.

A controlled faulty observation that loads the only package in each sparse
Handbook, applies the GitHub Actions foundation to the focused retention
question, or answers from invented platform guidance must fail the corresponding
criterion.

## Source

GitHub issues #242 and #246 require broad platform discovery, explicitly
non-exhaustive coverage, and valid no-match Azure DevOps, Chromium, GitHub
Actions, and Codex tasks. This reconstructed case requires a fresh replay
against the completed Handbooks.
