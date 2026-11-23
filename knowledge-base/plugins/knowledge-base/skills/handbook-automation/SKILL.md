---
name: handbook-automation
description: Use when working with or understanding CI/CD, GitHub Actions, gh-aw, scheduled jobs, or multi-step automated workflows.
---

# Automation handbook

Use this Handbook to load the understanding required for automated workflow
work, including CI/CD pipelines, GitHub Actions, gh-aw, and scheduled jobs. Its
platform and automation coverage is intentionally non-exhaustive. It owns
required-reading selection, not the procedure or completion of the user's task.
Resolve every packaged link relative to this `SKILL.md`, and apply the selected
Knowledge as supplemental guidance under the instructions, requirements,
Skills, and project-specific decisions in the active working directory.

## Read the required material

For primary automation work, including building, maintaining, reviewing, or
diagnosing a CI/CD pipeline, GitHub Actions or gh-aw workflow, scheduled job, or
other multi-step automated workflow, read this complete foundation:

- [Outcome integrity in automated
  workflows](../../knowledge/automation/workflow-outcome-integrity.md)
- [Failure and recovery in externally observable
  operations](../../knowledge/software-design/operation-failure-and-recovery.md)
- [Evidence for investigating check findings and
  failures](../../knowledge/software-design/failure-diagnostic-evidence.md)

For focused learning or explanation without a concrete automation artifact,
read every matching foundation subject without forcing the other foundation
files or unrelated conditional packages:

- When the request concerns whether an automated, GitHub Actions, or gh-aw
  workflow's reported completion or authorization is justified by required work
  and its successful execution evidence—including applicability decisions,
  skips, and missing check results—read [Outcome integrity in automated
  workflows](../../knowledge/automation/workflow-outcome-integrity.md).
- When the request concerns an externally observable automated operation's
  effects or retained work after non-success, or safe retry, continuation,
  reconciliation, or repair, read [Failure and recovery in externally observable
  operations](../../knowledge/software-design/operation-failure-and-recovery.md).
- When the request concerns which evidence an automated check or workflow must
  preserve for later investigation, read [Evidence for investigating check
  findings and
  failures](../../knowledge/software-design/failure-diagnostic-evidence.md).

For example, explaining why a cancelled check or skipped GitHub Actions job
cannot establish successful validation selects outcome integrity alone without
forcing the other foundation files or unrelated GitHub Actions packages.
Explaining which effects a cancelled publication left behind, or whether it can
be retried safely, selects failure and recovery. A request about both questions
requires both files.

Then evaluate every condition below. Every match is required and cumulative
with the applicable foundation reading and any other matching package.

- When an automated decision compares branches, pull requests, or Git
  revisions, or when the user asks to learn or explain how such a comparison
  should work, read [Git change-comparison
  semantics](../../knowledge/git/change-comparison-semantics.md).
- When choosing or diagnosing `GITHUB_TOKEN` permissions or permission scopes
  for a GitHub API operation, or when the user asks to learn or explain those
  permissions, read [GitHub Actions
  permissions](../../knowledge/github-actions/permissions.md).
- When a GitHub Actions workflow declares a third-party Action, runtime, or
  tool version, or when the user asks to learn or explain how to select those
  versions, read [Version selection in GitHub Actions
  workflows](../../knowledge/github-actions/version-selection.md).
- When an Agent in GitHub Actions inspects a target and its decision or
  requested action affects later work, external state, publication, or reruns,
  or when the user asks to learn or explain that lifecycle, read [Agent run
  state and reruns in GitHub
  Actions](../../knowledge/github-actions/agent-run-state-and-reruns.md).
- When configuring, changing, reviewing, upgrading, or diagnosing model
  execution in a gh-aw workflow that uses the Copilot engine, or when the user
  asks to learn or explain that model compatibility, read [gh-aw Copilot model
  compatibility](../../knowledge/github-actions/gh-aw-copilot-model-compatibility.md).

A focused learning or explanation request reads only its matching foundation
subjects and conditional packages when no primary automation work is present. If
neither a foundation subject nor any current conditional package matches such a
request, the Handbook's reading selection is validly complete with no package to
read—continue without applying unrelated narrow material, inventing platform
guidance, or implying that this Handbook documents all of GitHub Actions, gh-aw,
or every automation platform. Do not copy or infer rules in place of reading the
linked canonical material.
