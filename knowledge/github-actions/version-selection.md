# GitHub Actions version selection

## Scope

This document defines how to verify and select versions for third-party actions, runtimes, and tools declared in GitHub Actions workflows. It covers source freshness, compatibility with the active repository, version-reference policy, and failure behavior when current upstream information cannot be verified; dependency management outside workflow files and step-specific configuration are outside its scope.

## When to update

Update this document when GitHub Actions, upstream release channels, or repository pinning practices change how current versions are discovered or evaluated, or when a real workflow change exposes an unhandled verification, compatibility, or failure case.

## Verify current upstream state

Verify the current upstream state before writing, retaining, or recommending a version in a created, edited, or reviewed workflow. Model memory, cached examples, search-result snippets, and version references copied from unrelated repositories may identify candidates, but they do not establish what is current.

Open an authoritative source during the task. For an action, consult its publisher's official repository, releases, tags, and documentation. For a runtime or tool, consult its official release and support information together with the documentation for the action that installs or configures it. Establish the current stable or supported release line, confirm that the exact proposed reference exists, and distinguish retrieved facts from inference.

## Select in repository context

Treat the latest verified release as an input to version selection, not as an unconditional target. Follow requirements and version policy in the active working directory, including compatibility constraints, supported runner environments, runtime declarations, reference-form policy, and intentional pins. Check breaking changes before crossing a major or support boundary.

Use the latest verified compatible version when the repository does not impose a different constraint, and explain any deliberate choice not to use the latest available release. A version already present in the workflow is evidence of repository state, not proof that the upstream reference remains current or supported.

For a third-party action, select the workflow reference form separately from the upstream release. Follow an explicit repository policy or an established intentional convention for reference mutability and update behavior. Existing workflow references can provide evidence of a convention, but one incidental literal does not establish one.

When neither the repository nor the task establishes that choice, consult [GitHub's current security guidance for third-party actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions#using-third-party-actions) and use the reference form it recommends as safest. Verify that the exact reference belongs to the action's official repository and, when it represents a release, resolves to the selected release. Keep a readable release identifier beside an opaque reference when that helps review and updates. Choose a mutable reference only when an explicit update requirement justifies its movement. The absence of a local policy is not itself a blocker; inability to verify the current guidance or exact reference is.

## Handle verification failure

Never invent a version when current upstream information cannot be verified. For a workflow edit that does not require a version change, preserve the existing reference and report that its freshness remains unverified. When the task requires adding or changing a version, report the verification blocker instead of committing a guessed value.
