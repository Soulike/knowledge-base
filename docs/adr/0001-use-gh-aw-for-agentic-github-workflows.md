# 0001: Use gh-aw for Agentic GitHub workflows

## Status

Accepted

## Context

The repository runs Agents in GitHub Actions for scheduled content verification
and pull-request review. The workflows had independently accumulated engine
setup, tool installation, permission handling, retries, output transport, and
GitHub publication behavior. A Copilot event-format change broke the custom
content-verification result adapter even though the Agent process completed,
while the pull-request reviewer still gave its Agent a token capable of direct
review mutations.

The tasks share an execution problem but not one task contract. Scheduled
content verification produces advisory maintenance issues and may accept a
best-effort completion signal. Pull-request review is a required, fail-closed
gate bound to an exact head revision. Combining those meanings would make the
shared layer responsible for incompatible completion and verdict semantics.

[`gh-aw`](https://github.com/github/gh-aw) provides a compiler-managed Agentic
workflow runtime with a read-only Agent boundary, sandboxed tools, and safe
outputs applied by separate permission-controlled jobs. It remains in Public
Preview and has had security-sensitive releases, so adopting it transfers
substantial implementation ownership while retaining an upstream and update
risk.

## Decision

Use a fixed stable `gh-aw` compiler and its generated lock workflows as the
shared [Agentic workflow runtime](../../CONTEXT.md#agentic-workflow-runtime).
Commit the generated workflows and action lock data, and update them through
reviewed changes rather than allowing the runtime definition to drift between
runs.

Keep content verification and pull-request review as separate
[task contracts](../../CONTEXT.md#task-contract). Share engine invocation,
sandboxing, remote research and GitHub read tools, retry infrastructure, and
safe-output transport only where their responsibilities genuinely coincide.

The Agent never receives GitHub write permission for the selected effects.
Issue creation, pull-request review submission, and similar effects use
[safe outputs](../../CONTEXT.md#safe-output). Repository-specific validation
remains outside the shared runtime; in particular, pull-request verdict labels
and the required exact-head conclusion remain owned by a trusted
[publication gate](../../CONTEXT.md#publication-gate).

Keep runtime pinning intentionally narrow. The `gh-aw` compiler and generated
action references are fixed. GitHub Copilot CLI, external review-reference
Skills, the trusted-main knowledge-base plugin, and the Tavily remote service
follow their current trusted sources at run time. Tavily is consumed as a
remote MCP service so the workflow does not execute an unpinned local Tavily
package with a repository secret.

Migrate the scheduled and pull-request workflows directly in one reviewed
change. Scheduled issue publication becomes active after the change reaches
the default branch and remains fail-closed behind the trusted content gate.
Pull-request review becomes active at the same time; repository administrators
may use the existing ruleset bypass to repair a gate failure that could not be
exercised by the workflow-changing pull request itself.

## Consequences

- The repository owns concise Agentic workflow sources plus generated lock
  workflows, while `gh-aw` owns most engine, sandbox, retry, and safe-output
  implementation detail.
- Updating `gh-aw` requires regenerating and reviewing its lock workflows and
  action pins. Runtime policy may reject a compiler version that upstream has
  revoked or made obsolete.
- Floating Copilot, Skill, knowledge, and remote-service behavior favors current
  review capability over bit-for-bit reproducibility. Failures from those
  sources remain visible workflow failures rather than reasons to weaken the
  task contract.
- Content verification no longer proves that every target produced one
  structured result. It must explicitly request an issue, report incomplete
  work, or declare that no action is needed.
- Pull-request review continues to bind its verdict to the exact reviewed head.
  Safe review submission replaces direct Agent mutation but does not replace
  the repository-owned publication gate.
- A maintainer must provision the Tavily credential before workflows that need
  web research can complete.
