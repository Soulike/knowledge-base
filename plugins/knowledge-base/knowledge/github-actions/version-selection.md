# GitHub Actions version selection

## Scope

This document defines how to verify and select versions for third-party actions, runtimes, and tools declared in GitHub Actions workflows. It covers source freshness, compatibility with the active repository, version-reference policy, and failure behavior when current upstream information cannot be verified; dependency management outside workflow files and step-specific configuration are outside its scope.

## When to update

Update this document when GitHub Actions, upstream release channels, or repository pinning practices change how current versions are discovered or evaluated, or when a real workflow change exposes an unhandled verification, compatibility, or failure case.

## Verify current upstream state

Verify the current upstream state before writing, retaining, or recommending a version in a created, edited, or reviewed workflow. Model memory, cached examples, search-result snippets, and version references copied from unrelated repositories may identify candidates, but they do not establish what is current.

Open an authoritative source during the task. For an action, consult its publisher's official repository, releases, tags, and documentation. For a runtime or tool, consult its official release and support information together with the documentation for the action that installs or configures it. Establish the current stable or supported release line, confirm that the exact proposed reference exists, and distinguish retrieved facts from inference.

## Select in repository context

Treat the latest verified release as an input to version selection, not as an unconditional target. Follow requirements and version policy in the active working directory, including compatibility constraints, supported runner environments, runtime declarations, immutable-SHA or moving-tag conventions, and intentional pins. Check breaking changes before crossing a major or support boundary.

Use the latest verified compatible version when the repository does not impose a different constraint. Preserve the repository's reference style and explain any deliberate choice not to use the latest available release. A version already present in the workflow is evidence of repository state, not proof that the upstream reference remains current or supported.

## Handle verification failure

Never invent a version when current upstream information cannot be verified. For a workflow edit that does not require a version change, preserve the existing reference and report that its freshness remains unverified. When the task requires adding or changing a version, report the verification blocker instead of committing a guessed value.
