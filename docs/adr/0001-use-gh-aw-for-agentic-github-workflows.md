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
content verification produces advisory maintenance and human-confirmation
issues. It distinguishes a completed inconclusive finding from incomplete
execution and can use authenticated issue history without treating issue prose
as trusted instructions. Pull-request review is a required, fail-closed gate
bound to an exact head revision. Combining those meanings would make the shared
layer responsible for incompatible completion and verdict semantics.

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
Give the three scheduled verification tasks one imported content-verification
component for their shared result states, issue-history rules, terminal output
contract, and inconclusive publisher; keep their analysis standards in their
individual workflow sources.

The Agent never receives GitHub write permission for the selected effects.
Issue creation, pull-request review submission, and similar effects use
[safe outputs](../../CONTEXT.md#safe-output). Repository-specific validation
remains outside the shared runtime. Modification requests use gh-aw's built-in
issue publisher after the repository gate. Each
[verification-inconclusive](../../CONTEXT.md#verification-inconclusive) finding
uses one custom safe-output tool with a create-or-do-not-create decision. Its
trusted job re-validates the complete Agent output, authenticates cited issue
and comment state, and constructs any confirmation issue at the write boundary.
The Agent retains semantic comparison responsibility; deterministic code does
not interpret collaborator prose or launch a second Agent. The pull-request
reviewer's required exact-head conclusion remains owned by its separate trusted
[publication gate](../../CONTEXT.md#publication-gate).

Treat current, modification-required, and verification-inconclusive findings
as successful content outcomes. Reserve failed workflow status for incomplete
execution, malformed or unauthenticated output, threat detection, trusted-gate
or publication failure, and other unexpected mechanism errors. Enable gh-aw's
global failure-issue and failed-job reporters for every scheduled verification
workflow. Keep the dedicated incomplete-result issue handler disabled so one
failure does not create two operational issues.

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
  work, declare that no action is needed, or make one structured decision for
  every inconclusive finding.
- Current, modification-required, and verification-inconclusive content
  outcomes are completed analysis. Incomplete execution remains a separate
  terminal state.
- A closed confirmation issue constrains later verification only through an
  applicable no-change reply from an `OWNER`, `MEMBER`, or `COLLABORATOR` that
  explains the information's basis and its next revalidation trigger. An open
  issue can prevent a duplicate but is not a historical disposition.
- The inconclusive publisher authenticates repository objects and performs an
  exact publication-time duplicate check. It does not create a permanent
  finding key, group findings, parse the meaning of maintainer replies, or turn
  a maintainer's content change into a disposition.
- A red scheduled verification run denotes incomplete or failed execution, not
  content cleanliness. gh-aw creates or reuses an operational failure issue for
  Agent and framework failures and reports failed repository-owned jobs from the
  conclusion job. Those issues remain distinct from content-result issues.
- Failure-issue publication remains best effort at the fixed runtime boundary.
  The failed-job reporter creates per-run issues rather than sharing the
  Agent/framework reporter's 24-hour reuse window and excludes the built-in
  safe-output job. A fatal built-in modification-issue publication failure can
  therefore remain visible through red Actions status and normal notification
  without a corresponding failure issue. The repository accepts that limitation
  instead of adding a second failure parser or persistent aggregator.
- Pull-request review continues to bind its verdict to the exact reviewed head.
  Safe review submission replaces direct Agent mutation but does not replace
  the repository-owned publication gate.
- A maintainer must provision the Tavily credential before workflows that need
  web research can complete.
