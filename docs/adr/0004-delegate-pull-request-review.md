# 0004: Delegate pull-request review to the shared workflow

## Status

Accepted

## Context

The repository originally owned its complete pull-request review workflow,
including engine setup, review publication, result authentication, and the
required gate. Those responsibilities are reusable across repositories and
contain security-sensitive behavior that should have one maintenance owner.

The public `Soulike/ai-review-workflow` repository now provides that reusable
implementation and consumes it itself. This repository still needs its own
review criteria for Knowledge, Skills, plugin packaging, and maintained Agent
content. Its three scheduled content-verification workflows continue to use the
locally maintained shared Agentic runtime and have a different task contract.

## Decision

Call `Soulike/ai-review-workflow/.github/workflows/ai-review.yml@main` from a
small `pull_request_target` workflow. The consumer caller owns scheduling,
concurrency, the permission ceiling, explicit secret mapping, model and
reasoning settings, and the path to repository review criteria. The reusable
workflow owns review setup, execution, safe publication, the structured verdict,
and the review gate.

Keep repository-specific review criteria in a prompt read from the exact event
base. The prompt extends the shared review criteria without redefining execution,
publication, severity, or verdict behavior.

Replace the local reviewer and its generated workflow, gate implementation, and
dedicated tests in one pull request. That migration pull request is evaluated by
the previously deployed reviewer. After merge, verify the reusable workflow on
a fresh pull-request event, then change the required status check from
`AI review gate` to `Review / Engine / AI review gate`.

The scheduled content-verification workflows retain their local gh-aw sources,
shared runtime, compiler contract, generated workflows, and tests.

## Consequences

- Fixes to shared review execution, publication, and gate behavior reach this
  repository through `main` without copying implementation changes here.
- Changes to the repository's review policy remain ordinary prompt changes in
  this repository and take effect after reaching the default branch.
- Repository checks validate prompt links and the remaining locally compiled
  workflows. GitHub validates the caller configuration, and a fresh hosted
  pull-request run validates the reusable workflow's deployed event context,
  permissions, publication, and qualified check name.
- The repository depends on the availability and current behavior of the shared
  workflow's `main` branch. Recovery from a broken shared workflow requires a
  reviewed upstream fix or revert.
