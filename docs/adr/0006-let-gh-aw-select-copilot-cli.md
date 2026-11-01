# 0006: Let gh-aw select the Copilot CLI

## Status

Accepted. This decision supersedes the floating Copilot CLI portion of
[ADR 0001](0001-use-gh-aw-for-agentic-github-workflows.md).

## Context

The scheduled content-verification workflows use a fixed gh-aw compiler and
commit its generated lock workflows for review. The repository previously
queried the latest stable `github/copilot-cli` release during every run, passed
that result as an explicit `engine.version`, and checked the installed version
before Agent execution. This prevented an older runner cache from satisfying a
floating `latest` request.

gh-aw later began authenticating Copilot CLI downloads with release-manifest
digests reviewed into its compiler and setup action. An official Copilot CLI
release can become latest before the fixed gh-aw runtime contains its reviewed
digest. In that state, the repository resolver selects a version the installer
must reject. [Issue #207](https://github.com/Soulike/knowledge-base/issues/207)
observed this failure before Agent execution when Copilot CLI `1.0.105` was
newer than the reviewed versions available to gh-aw `v1.0.1`.

The repository-level resolver also bypassed gh-aw's compatibility selection.
Its installed-version check proved binary identity, but it did not establish
compatibility with the fixed compiler, Agent Workflow Firewall, or generated
runtime.

## Decision

Do not set `engine.version` in the three scheduled content-verification
workflows and do not resolve a Copilot CLI release at run time. Let the fixed
gh-aw compiler select its reviewed default Copilot CLI version and
release-manifest digest when it generates the lock workflows.

Use the same compiler-generated installation command for the Agent and threat
detection. Review changes to that command and digest as part of every gh-aw
compiler upgrade. An exceptional repository-owned version override requires a
concrete compatible version, an independently authenticated manifest digest,
and a reviewed source change; a floating latest-release resolver is not an
override mechanism.

Keep installation failures fail closed and visible through the existing
workflow status and failure reporting. Generated lock workflows remain
compiler-owned and must not be edited directly.

## Consequences

- Copilot CLI upgrades normally follow reviewed gh-aw compiler upgrades instead
  of new upstream releases immediately.
- The selected CLI stays inside the compiler's reviewed installation and
  compatibility contract, and its download remains authenticated when an exact
  runner cache entry is unavailable.
- A newly published Copilot CLI cannot break scheduled verification merely by
  becoming the latest stable release.
- The repository no longer needs a release-resolution job or a second exact
  version check before Agent execution.
- Upgrading gh-aw can change the selected Copilot CLI, so generated installer
  and digest changes remain part of the upgrade review and hosted validation.
