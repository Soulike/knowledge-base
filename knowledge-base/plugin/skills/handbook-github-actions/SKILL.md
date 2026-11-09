---
name: handbook-github-actions
description: Use when creating, maintaining, reviewing, diagnosing, or understanding GitHub Actions and gh-aw workflows.
---

# GitHub Actions handbook

This platform Handbook routes the curated GitHub Actions and gh-aw guidance
currently available in this plugin. Its coverage is intentionally
non-exhaustive. It owns required-reading selection, not the procedure or
completion of the user's task. Resolve every packaged link relative to this
`SKILL.md`, and apply selected Knowledge as supplemental guidance under the
instructions, requirements, Skills, and project-specific decisions in the
active working directory.

## Read the required material

For primary artifact work that creates, maintains, reviews, or diagnoses a
GitHub Actions or gh-aw workflow, read [Outcome integrity in automated
workflows](../../knowledge/automation/workflow-outcome-integrity.md) as the
foundation.

For focused learning or explanation about whether required work, skips,
evidence, and final status honestly establish a GitHub Actions or gh-aw
workflow's outcome, read that foundation without requiring a concrete workflow
artifact.

Then evaluate every condition below. Every match is required and cumulative
with the foundation when it applies and with every other matching package.

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

A focused learning or explanation request reads the foundation or packages
whose subjects match without an unrelated primary-work foundation. If neither
the foundation nor any current package matches, continue the task without
applying unrelated narrow material or implying that this Handbook documents all
of GitHub Actions or gh-aw. Do not copy or infer rules in place of reading the
linked canonical material.

Re-evaluate this Handbook and every package condition when the task stage,
platform, artifact, production method, or available reading basis changes.
Reuse a reading unit that is still current and available; reread it when it
changed or its necessary context is no longer available. If required material
cannot be read, report the gap and its effect on the task instead of inventing
or silently omitting the guidance.
