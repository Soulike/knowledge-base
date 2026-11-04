# Agentic GitHub workflows

This repository maintains three scheduled content-verification workflows with
gh-aw and delegates pull-request review to the reusable
[Soulike/ai-review-workflow](https://github.com/Soulike/ai-review-workflow).
The scheduled workflows share a local runtime and mutable-findings contract.
The reusable workflow owns review execution, publication, and its required gate,
while this repository owns its review criteria and caller configuration.

The shared runtime adoption is recorded in
[ADR 0001](../../docs/adr/0001-use-gh-aw-for-agentic-github-workflows.md).
[ADR 0006](../../docs/adr/0006-let-gh-aw-select-copilot-cli.md) records the
compiler-owned Copilot CLI selection that replaced the earlier floating
release policy.
[ADR 0003](../../docs/adr/0003-use-mutable-finding-events-for-content-verification.md)
records the current findings architecture and supersedes
[ADR 0002](../../docs/adr/0002-resolve-inconclusive-content-verification-through-trusted-issues.md)
without rewriting that record's historical context. The general state and trust
invariants are maintained as
[Agent run-state Knowledge](../../knowledge-base/plugin/knowledge/github-actions/agent-run-state-and-reruns.md).
[ADR 0004](../../docs/adr/0004-delegate-pull-request-review.md) records the
pull-request review delegation and consumer boundary.

## Workflow inventory

| Task                     | Trigger and subject                                                              | Maintained configuration                                                                            |
| ------------------------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Time-sensitive Knowledge | Monthly, every Knowledge leaf listed as `time-sensitive`                         | [Source](verify-time-sensitive-knowledge.md), [generated](verify-time-sensitive-knowledge.lock.yml) |
| Evergreen Knowledge      | Quarterly, every Knowledge leaf listed as `evergreen`                            | [Source](verify-evergreen-knowledge.md), [generated](verify-evergreen-knowledge.lock.yml)           |
| Maintained Agent content | Quarterly, maintained Skills, references, Agent instructions, and prompt bundles | [Source](verify-maintained-agent-content.md), [generated](verify-maintained-agent-content.lock.yml) |
| AI review                | Ready pull requests and later pushes                                             | [Caller](ai-review.yml), [repository criteria](../scripts/ai-review/prompts/review.md)              |

The fixed gh-aw compiler selects its reviewed default Copilot CLI version and
release-manifest digest when it generates the scheduled workflows. The Agent
and threat-detection jobs receive the same concrete CLI installation command.
The installer may reuse an exact-version runner cache entry; otherwise it
verifies the downloaded release against the generated digest. The workflows do
not query or install a newly published CLI merely because it became the latest
stable release.

Repository variables select the model and concrete reasoning effort for the
scheduled workflows, whose local preflight validates those values. The AI review
caller passes its variables to the upstream interface; the upstream repository
owns their accepted values and behavior.

The scheduled source Markdown is maintained by people and Agents. Its generated
`*.lock.yml` files and [action lock](../aw/actions-lock.json) are committed
review artifacts owned by the fixed compiler.

## Shared runtime boundary

The three scheduled tasks import
[the shared runtime](shared/agentic-runtime.md). It provides:

- all GitHub read toolsets with read-only server credentials;
- the local GitHub MCP server mounted as a read-only CLI proxy for pull-request
  threads, Actions runs, checks, artifacts, logs, and other GitHub reads;
- unrestricted Bash commands for the main Agent and delegated content researchers
  inside the Agent sandbox;
- the remote Tavily MCP service for external source discovery and page
  extraction;
- Playwright for authoritative pages that require JavaScript or resist ordinary
  extraction;
- a sandbox network boundary using gh-aw's `defaults` and `github` domain sets,
  plus Tavily, Mozilla, Chromium Gitiles, and `https://www.w3.org`;
- the latest LTS Node.js release;
- one compiler-selected, checksum-authenticated Copilot CLI version shared by
  Agent and threat detection;
- repository dependencies installed from the trusted checkout before inference,
  with a lockfile-keyed pnpm store cache;
- the knowledge-base plugin from the checked-out repository revision;
- floating `codebase-design`, `tdd`, and `writing-for-agents` review-reference Skills;
- required reasoning-effort validation; and
- fail-closed threat detection before safe-output publication.

The main Agent and delegated researchers follow the same
[Tavily → Shell → Playwright retrieval order](shared/agentic-runtime.md#external-source-retrieval)
for external pages. Escalate only while the relevant substantive content is
unavailable; retrieved evidence that does not support a claim is evaluated
without repeating retrieval through every tool.

Each scheduled task sets a 60-minute Agent execution timeout in its frontmatter;
the shared runtime sets a separate 75-minute Agent job timeout. The job budget
includes setup and artifact collection as well as inference. The execution
timeout stays in each task because the pinned compiler does not inherit that
field from imports. The reusable pull-request review workflow owns its own
execution budgets.

The shared source sets the per-run, threat-detection, and daily AI Credits
budgets to `-1`. Each scheduled workflow pins AWF `v0.29.1`, its release
checksum, and immutable container images: the AWF version bundled with gh-aw
`v1.0.1` [rejects the disabled budget](https://github.com/github/gh-aw/issues/72523),
whereas [`v0.29.1` accepts it](https://github.com/github/gh-aw-firewall/pull/10828).
gh-aw does not inherit these sandbox version and image settings from imports,
so each workflow must declare them. Recheck the override when upgrading gh-aw.

AWF treats `-1` as no configured budget, removing the dependency on known
model prices for that budget. AWF still enforces a 10,000-credit hard cap on
accounted usage, but unpriced usage is excluded from that total. Copilot
provider billing and token reporting still apply.

The Agent does not receive the credential used for issue or review publication. It requests an allowed effect through safe-output tools. A separate job with only the required write permission validates and applies that request. Repository-owned gates then enforce task-specific subject, shape, verdict, or completion policy.

Unrestricted Bash applies only inside the disposable Agent sandbox. The runtime
excludes the Copilot, GitHub MCP, and Tavily environment credentials from that
container and fails before inference unless temporary Git credentials have been
removed from every checkout. Authenticated GitHub reads remain behind the
read-only MCP server, and GitHub publication remains behind safe outputs and
repository-owned gates. Delegated researchers may use shell commands,
read-only MCP CLI proxies, and Playwright for evidence collection; the task
contract reserves completion and publication requests to the main Agent.

The GitHub read policy uses `allowed-repos: all`, `min-integrity: approved`, and
an explicit `github.token` credential. This keeps public upstream research
available while limiting private access to this repository through the run
token's permissions; it does not adopt a cross-repository token from Actions
secrets. Reassess the repository scope before replacing that credential.

The policy explicitly trusts `github-actions[bot]` so automation-authored issue
history meets the `approved` threshold. This
[author exception](https://github.com/github/gh-aw/blob/0627fdbe4beb5f3b71aa569f8d97150b87f2111a/docs/src/content/docs/reference/integrity.md#trusting-specific-users)
applies across allowed repositories; other authors' comments retain their own
integrity classification. Readable content remains evidence under the task's
instructions.

gh-aw treats paths under `.github/workflows/` as private data even in public
repositories. The shared runtime sets `private-to-public-flows: allow` so public
upstream workflow files can be read and contribute to this repository's logs
and findings. This explicitly disables the gateway's forced public-only scope
and default sink-visibility enforcement for all MCP servers. The run token's
access boundary, read-only server, credential isolation, threat detection, and
publication gates remain in force. Read access does not make upstream content
trusted instructions. The scheduled tasks handle external source-access
limitations under their
[evidence-access and completion rules](shared/content-verification.md#evidence-access-and-completion).

Repository content under review, issue and pull-request text, and external pages remain untrusted evidence. Installing the checked-out plugin makes its Knowledge and usage Skills available without making reviewed content authoritative over the active task contract. The checked-out workflow source, root [repository instructions](../../AGENTS.md), and task-selected review material remain trusted guidance. The runtime boundary does not merge the three verification scopes.

## Scheduled content verification

Each scheduled task also supports manual dispatch and keeps its own name, schedule, scope, and concurrency identity. Before inference, a trusted step derives an immutable target manifest from `git ls-files`, the parsed [Knowledge catalog](../../knowledge-base/plugin/knowledge/index.md), and the checked-out revision. The [content-verification contract](../scripts/content-verification-contract/targets.ts) owns target discovery and result authentication. Its internal adapters distinguish primary-product Knowledge from repository-wide maintained Agent content.

Task-specific sources own what to analyze. All three import the
[shared content-verification contract](shared/content-verification.md).

A Knowledge target owns one leaf. A Skill target owns its `SKILL.md` and tracked files below the same directory. Package-level references and `.github/workflows/shared/*.md` components are independent shared-reference targets. Each otherwise unowned `AGENTS.md`, root or plugin `GLOSSARY.md` and
`GLOSSARY-MAP.md`, and file under root or plugin `docs/agents/` is an instruction
target. Each root `.github/workflows/*.md` source except this README is an Agentic workflow target, and each `.github/scripts/*/prompts/` directory is one prompt target. An invalid catalog, mutable revision, empty scope, duplicate target, or duplicate file ownership fails before the Agent runs.

All three tasks review correctness, effectiveness for the reader's actual tasks,
and appropriate organization. The Agent reads every selected target completely,
reconstructs the reader's task independently, and uses situations, boundaries,
and counterexamples to challenge facts, reasoning, assumptions, and practical
consequences. Investigation depth follows risk and uncertainty; neither finding
quotas nor executing every recommendation are required. Structural findings
need a concrete reader or maintenance cost and a coherent correction.

The tasks retain distinct emphases:

- time-sensitive Knowledge rechecks evolving dependencies and the current facts,
  guarantees, or empirical claims needed to judge its advice;
- evergreen Knowledge emphasizes reasoning, applicability, and whether external
  evolution requires time-sensitive maintenance; and
- maintained Agent content examines whether invocation, decisions, execution,
  failure handling, completion, and organization can achieve the intended task.

The [shared review and evidence rules](shared/content-verification.md#review-phase)
select evidence for the question: contracts for requirements, implementation or
observations for behavior, and reasoning or counterexamples for explanations
and applicability. Empirical effectiveness, recurrence, and causation need
suitable evidence; a bounded suggestion is not invalid merely because official
documentation or measured benefits are absent. Source agreement alone does not
establish content correctness or usefulness.

`modification-required` identifies an established content or source defect and
coherent correction. `verification-inconclusive` identifies a material unresolved
claim or citation, including source-access limitations. An invalid or
inaccessible cited source is reported even when other evidence supports the
content. The Agent distinguishes established source defects from run-specific
access limits, continues reviewing other targets and comparing issue history,
and publishes remaining findings normally without making the workflow fail.

Before declaring incomplete execution, the Agent diagnoses inspection or tool
failures and attempts applicable recovery within existing permissions and
integrity policy. A corrected invocation or recovered capability lets review
continue. A genuinely unavailable required target, manifest, or capability, a
revision mismatch, or unfinished required review or history work remains
incomplete and publishes no content findings. Recovery instructions do not
permit lower coverage, control bypasses, or invented evidence.

The main Agent is the sole safe-output producer. It may delegate investigation
to the tool-restricted `content-verification-researcher` profile defined in the
[shared contract](shared/content-verification.md). Researchers return evidence
and limitations to the main Agent, may use shell commands and Playwright for
read-only evidence collection, and must not invoke safe outputs or further
delegation. The main Agent consolidates their reports, assigns finding ids,
compares issue history, and decides the complete run's result.

History comparison uses finding-scoped `search_issues` queries across open and
closed issues, followed by reads of plausible matches and relevant comments.
The Agent refines queries, follows relevant pagination, and retries failed
reads. A completed search with no plausible match completes comparison without
enumerating the repository's entire issue history. The
[shared history rules](shared/content-verification.md#history-phase) define when
unresolved search or reading failures make the run incomplete.

Each workflow adds and fully replaces findings during review, then updates or
deletes them while comparing issue history. Each finding has one primary review
target and may name related targets from the same revision's repository catalog
when one remediation affects several responsibilities. Add, update, and delete
each allow up to 100 events per run. When completed review leaves no active
findings, including after deleting every finding, the main Agent declares
`noop` exactly once as the final safe output. A no-action declaration with
active findings, any output after `noop`, or an empty stream without a
completion declaration fails validation. These results do not claim
mechanically proven per-target coverage.

The [finding reducer](../scripts/content-verification-contract/finding-events.ts)
validates that append-only stream after Agent completion. Its existing argument
limits are also stated in the shared review prompt, including the 12000-unit
limit on finding Markdown measured by JavaScript `String.length`. The finding
tools describe the Markdown limit and the add tool's identifier rules before
the Agent submits events. The Agent checks arguments and event state before
submission: the reducer examines the full stream after completion, so a later
valid call cannot erase an earlier malformed event or incomplete signal.
The compiler runs the gate only after the detection job succeeds and reports `detection_success: true`.
A failed detection job skips the gate and publisher, and Actions reports the
failure.

The [trusted finding publisher](../scripts/content-verification-publication/finding-publication.ts)
runs only after Agent success, the canonical gate, and threat detection. It
constructs all issue identity and boilerplate, publishes one issue per remaining
finding, and suppresses only an exact open publication race. Run-local finding
IDs coordinate add, update, and delete calls but are not durable publication
identity. The Agent has no issue-write credential.

The [content-verification CLI adapters](../scripts/content-verification-cli/findings-gate-cli.ts)
translate GitHub Actions environment variables and gh-aw artifacts into the
contract and publication interfaces. The gate and publisher remain runnable
from a checkout without installing workspace dependencies.

The pinned gh-aw runtime uploads the same Agent output in a dedicated fallback
artifact and its broader Agent artifact. The gate keeps those artifacts
separate and requires every discovered copy to be byte-identical before
reduction. The task accepts gh-aw's `noop` completion signal for the whole
run, with a maximum of one call and issue reporting disabled. A research
assignment cannot declare no action for the complete run.

The shared contract defines all three finding tools as job-based recording
handlers, which support explicit event limits; the pinned compiler's script
handlers do not. Generated-workflow tests require the same three finding tools
and no `create_issue` tool in every task.

### Status and failure issues

Actions status represents the health of the verification mechanism, not whether
content needs attention. A valid `noop`, published findings, and exact
publication duplicates complete successfully. `report_incomplete`, malformed
or unauthenticated output, threat-detection failure, the repository gate, the
trusted publisher, issue publication, artifact handling, and other unexpected
job failures make the workflow fail.

Each workflow enables gh-aw's global failure-issue reporter and failed-job
reporter. Agent and framework failures, including `report_incomplete`, use the
runtime's failure identity and 24-hour reuse window. The conclusion job also
inspects repository-owned jobs such as the content gate and finding publisher.
The dedicated `report-incomplete` issue handler remains disabled. When
incomplete work also fails the repository gate, the failed-job reporter may
create a separate operational issue in addition to the global failure report.
These operational issues remain separate from content findings.

Failure-issue publication is best effort within the fixed gh-aw runtime.
Failed-job reports are created per run rather than using the
Agent/framework reporter's 24-hour reuse window, and the reporter excludes the
built-in `safe_outputs` and `detection` jobs. Actions status and normal
notifications remain the complete operational signal; this repository does not
add a second failure parser or persistent aggregator.

## Required pull-request review

The [caller](ai-review.yml) invokes the public reusable workflow for the
repository's `pull_request_target` lifecycle and cancels superseded work for the
same pull request. It passes the selected model, required reasoning effort,
Tavily extraction secret, and the
[repository review criteria](../scripts/ai-review/prompts/review.md). Those
criteria cover the repository's Knowledge, Skill, plugin, documentation, and
delivery responsibilities.

The [upstream repository](https://github.com/Soulike/ai-review-workflow) owns
the callable interface, review execution, publication, verdict behavior, and
recovery guidance. Human approval, last-push approval, and thread resolution
remain repository rules here.

The expected required check is `Review / Engine / AI review gate`, qualified by
the caller and nested reusable jobs. After changing review execution, verify a
fresh event against the deployed default-branch caller before updating the
repository ruleset to require that check.

## Repository configuration

Set these Actions variables:

| Variable                                | Requirement                                                                             |
| --------------------------------------- | --------------------------------------------------------------------------------------- |
| `CONTENT_VERIFICATION_MODEL`            | Copilot model identifier or `auto`; missing defaults to `auto`.                         |
| `CONTENT_VERIFICATION_REASONING_EFFORT` | Concrete Copilot effort: `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, or `max`. |
| `AI_REVIEW_MODEL`                       | Model value passed to the upstream review interface.                                    |
| `AI_REVIEW_REASONING_EFFORT`            | Required reasoning value passed to the upstream review interface.                       |

All four tasks use the `TAVILY_API_KEY` Actions secret for external web
research. Set it directly in the repository's Actions secrets UI or enter it
through GitHub CLI without placing the value on the command line:

```bash
gh secret set TAVILY_API_KEY --repo Soulike/knowledge-base
```

Configure `Review / Engine / AI review gate` as a required status check after a
fresh deployed run establishes that exact check. The scheduled verification
workflows require the `automated-verification` and `modification-required`
labels.

## Compile and validate

The repository pins gh-aw `v1.0.1` for the three scheduled workflows. If gh-aw
is already installed, remove it first; `--force` may ignore `--pin` for an
existing extension ([GitHub CLI issue](https://github.com/cli/cli/issues/13551)):

```bash
gh extension remove gh-aw
```

Install the exact compiler and regenerate the workflows with:

```bash
gh extension install github/gh-aw --pin v1.0.1
pnpm agentic:compile
```

For a separately verified compiler binary, set `GH_AW_COMPILER` to its path. The
wrapper rejects every compiler version except `v1.0.1`.

Each scheduled source explicitly sets `strict: false` because gh-aw rejects
`private-to-public-flows` in strict mode. The wrapper retains schema and action
validation while allowing each source to select its strictness; new sources
keep gh-aw's strict default unless they explicitly opt out. Do not pass
`--strict` when regenerating the scheduled workflows, because it overrides their
frontmatter and rejects the configured upstream reading policy.

Run:

```bash
pnpm agentic:check
pnpm check
git diff --check
```

`pnpm agentic:check` recompiles and rejects modified, deleted, or untracked generated artifacts. Generated lock workflows are excluded from Prettier because gh-aw is their authoritative formatter.

The compiler warns about the intentional private-to-public policy described
under [Shared runtime boundary](#shared-runtime-boundary).

The reusable AI-review caller is ordinary GitHub Actions YAML and is not compiled
by the local gh-aw toolchain. Its repository prompt is covered by the prompt-link
check and maintained-content verification. A fresh pull-request event after the
caller reaches the default branch establishes its hosted execution, publication,
and check name.
