---
name: handbook-automation
description: Use when building, maintaining, reviewing, diagnosing, or understanding CI/CD, scheduled jobs, and multi-step automated workflows.
---

# Automation handbook

Use this Handbook to load the understanding required for automated workflow
work. It owns required-reading selection, not the procedure or completion of
the user's task. Resolve every packaged link relative to this `SKILL.md`, and
apply the selected Knowledge as supplemental guidance under the instructions,
requirements, Skills, and project-specific decisions in the active working
directory.

## Read the required material

For primary automation work, including building, maintaining, reviewing, or
diagnosing a CI/CD pipeline, scheduled job, or other multi-step automated
workflow, read this complete foundation:

- [Outcome integrity in automated
  workflows](../../knowledge/automation/workflow-outcome-integrity.md)
- [Failure and recovery in externally observable
  operations](../../knowledge/software-design/operation-failure-and-recovery.md)
- [Evidence for investigating check findings and
  failures](../../knowledge/software-design/failure-diagnostic-evidence.md)

For focused learning or explanation without a concrete automation artifact,
read every matching foundation subject without forcing the other foundation
files:

- When the request concerns whether a workflow's reported completion or
  authorization is justified by required work and its successful execution
  evidence, including applicability decisions, skips, and missing check
  results, read [Outcome integrity in automated
  workflows](../../knowledge/automation/workflow-outcome-integrity.md).
- When the request concerns an externally observable automated operation's
  effects or retained work after non-success, or safe retry, continuation,
  reconciliation, or repair, read [Failure and recovery in externally observable
  operations](../../knowledge/software-design/operation-failure-and-recovery.md).
- When the request concerns which evidence an automated check or workflow must
  preserve for later investigation, read [Evidence for investigating check
  findings and
  failures](../../knowledge/software-design/failure-diagnostic-evidence.md).

For example, explaining why a cancelled check cannot establish successful
validation selects outcome integrity. Explaining which effects a cancelled
publication left behind, or whether it can be retried safely, selects failure
and recovery. A request about both questions requires both files.

Then evaluate every condition below. Every match is required and cumulative
with the applicable foundation reading and any other matching package.

- When an automated decision compares branches, pull requests, or Git
  revisions, or when the user asks to learn or explain how such a comparison
  should work, read [Git change-comparison
  semantics](../../knowledge/git/change-comparison-semantics.md).

A focused learning or explanation request reads only its matching foundation
subjects and conditional packages when no primary automation work is present.
Do not copy or infer rules in place of reading the linked canonical material.
