# Agentic GitHub workflows

This repository uses gh-aw for four Agentic GitHub Actions tasks. A shared runtime owns execution, sandbox, read tools, external research, and safe-output transport. The three scheduled content-verification tasks share the mutable-findings result and publication contract, while the required pull-request reviewer retains a separate task contract.

The shared runtime adoption is recorded in
[ADR 0001](../../docs/adr/0001-use-gh-aw-for-agentic-github-workflows.md).
[ADR 0003](../../docs/adr/0003-use-mutable-finding-events-for-content-verification.md)
records the current findings architecture and supersedes
[ADR 0002](../../docs/adr/0002-resolve-inconclusive-content-verification-through-trusted-issues.md)
without rewriting that record's historical context. The general state and trust
invariants are maintained as
[Agent run-state Knowledge](../../knowledge/github-actions/agent-run-state-and-reruns.md).

## Workflow inventory

| Task                     | Trigger and subject                                                              | Source and generated workflow                                                                       |
| ------------------------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Time-sensitive Knowledge | Monthly, every Knowledge leaf indexed as `time-sensitive`                        | [Source](verify-time-sensitive-knowledge.md), [generated](verify-time-sensitive-knowledge.lock.yml) |
| Evergreen Knowledge      | Quarterly, every Knowledge leaf indexed as `evergreen`                           | [Source](verify-evergreen-knowledge.md), [generated](verify-evergreen-knowledge.lock.yml)           |
| Maintained Agent content | Quarterly, maintained Skills, references, Agent instructions, and prompt bundles | [Source](verify-maintained-agent-content.md), [generated](verify-maintained-agent-content.lock.yml) |
| AI review                | Eligible non-draft pull requests and later pushes                                | [Source](ai-review.md), [generated](ai-review.lock.yml)                                             |

Every source declares `engine.version: latest`, leaving Copilot CLI selection floating at run time; gh-aw may reuse a compatible cached CLI. The repository variable selects the model. Each task selects Copilot's `long_context` tier and passes a mandatory concrete reasoning effort through `engine.args`; the shared preflight rejects a missing, `auto`, or unsupported effort before inference.

The source Markdown is maintained by people and Agents. The generated `*.lock.yml` files and [action lock](../aw/actions-lock.json) are committed review artifacts owned by the fixed compiler.

## Shared runtime boundary

All four tasks import [the shared runtime](shared/agentic-runtime.md). It provides:

- all GitHub read toolsets with read-only server credentials;
- the pinned local GitHub MCP server for pull-request threads, Actions runs,
  checks, artifacts, logs, and other GitHub reads;
- unrestricted Bash commands inside the Agent sandbox;
- the remote Tavily MCP service, exposing only search and extraction;
- a sandbox network boundary;
- the latest LTS Node.js release;
- repository dependencies installed from the trusted checkout before inference,
  with a lockfile-keyed pnpm store cache;
- the knowledge-base plugin from the checked-out repository revision;
- floating `codebase-design`, `tdd`, and `writing-for-agents` review-reference Skills;
- required reasoning-effort validation; and
- fail-closed threat detection before safe-output publication.

The shared source disables gh-aw per-run, threat-detection, and daily AI Credits
guardrails with `-1`. This removes the runtime dependency on gh-aw model-pricing
tables; it does not disable Copilot provider billing or token reporting.

The Agent does not receive the credential used for issue or review publication. It requests an allowed effect through safe-output tools. A separate job with only the required write permission validates and applies that request. Repository-owned gates then enforce task-specific subject, shape, verdict, or completion policy.

Unrestricted Bash applies only inside the disposable Agent sandbox. The runtime
excludes the Copilot, GitHub MCP, and Tavily environment credentials from that
container and fails before inference unless temporary Git credentials have been
removed from every checkout. Authenticated GitHub reads remain behind the
read-only MCP server, and GitHub publication remains behind safe outputs and
repository-owned gates.

Repository content under review, issue and pull-request text, and external pages remain untrusted evidence. Installing the checked-out plugin makes its Knowledge and usage Skills available without making reviewed content authoritative over the active task contract. The checked-out workflow source, root [repository instructions](../../AGENTS.md), and task-selected review material remain trusted guidance. The runtime boundary does not merge the four task contracts.

## Scheduled content verification

Each scheduled task also supports manual dispatch and keeps its own name, schedule, scope, and concurrency identity. Before inference, a trusted step derives an immutable target manifest from `git ls-files`, the parsed [Knowledge index](../../knowledge/index.md), and the checked-out revision. Target discovery is implemented in [the content-verification scripts](../scripts/content-verification/targets.ts).

Task-specific sources own what to analyze. All three import the
[shared content-verification contract](shared/content-verification.md).

A Knowledge target owns one leaf. A Skill target owns its `SKILL.md` and tracked files below the same directory. Package-level references and `.github/workflows/shared/*.md` components are independent shared-reference targets. Each otherwise unowned `AGENTS.md`, root `CONTEXT.md`, and file under `docs/agents/` is an instruction target. Each root `.github/workflows/*.md` source except this README is an Agentic workflow target, and each `.github/scripts/*/prompts/` directory is one prompt target. An invalid index, mutable revision, empty scope, duplicate target, or duplicate file ownership fails before the Agent runs.

The three tasks apply different review standards:

- time-sensitive Knowledge verifies every evolving claim against current authoritative sources;
- evergreen Knowledge verifies reasoning, internal consistency, continued necessity, and whether external evolution has made the classification time-sensitive; and
- maintained Agent content reviews invocation, routing, decisions, tool use, failure handling, completion, progressive disclosure, portability, package boundaries, current assumptions, and maintenance lifecycle.

All three distinguish `modification-required`, when current reasoning or
evidence establishes a content defect and coherent correction, from
`verification-inconclusive`, when the required analysis completed but available
evidence cannot confirm or invalidate the finding.

Each workflow adds and fully replaces findings during review, then updates or
deletes them while comparing issue history. Each finding has one primary review
target and may name related targets from the same revision's repository catalog
when one remediation affects several responsibilities. An empty event stream
is a successful no-action result and does not claim mechanically proven
per-target coverage.

The [finding reducer](../scripts/content-verification/finding-events.ts)
validates that append-only stream after Agent completion. The
[trusted finding publisher](../scripts/content-verification/finding-publication.ts)
runs only after Agent success, the canonical gate, and threat detection. It
constructs all issue identity and boilerplate, publishes one issue per remaining
finding, and suppresses only an exact open publication race. Run-local finding
IDs coordinate add, update, and delete calls but are not durable publication
identity. The Agent has no issue-write credential.

The pinned gh-aw runtime uploads the same Agent output in a dedicated fallback
artifact and its broader Agent artifact. The gate keeps those artifacts
separate and requires every discovered copy to be byte-identical before
reduction. gh-aw also continues to advertise its system `noop` facility because
threat detection is imported from the shared runtime; the content-verification
contract requires an empty stream instead, and the reducer rejects `noop`.

gh-aw `v0.87.10` also does not merge imported safe-output scripts and injects a
default `create_issue` tool when every custom tool comes only from imports. The
shared contract therefore owns the larger add and update schemas, while each
task source repeats only the one-parameter delete script as a thin compiler
adapter. Generated-workflow tests require the same three finding tools and no
`create_issue` tool in every task.

### Status and failure issues

Actions status represents the health of the verification mechanism, not whether
content needs attention. An empty result, published findings, and exact
publication duplicates complete successfully. `report_incomplete`, malformed
or unauthenticated output, threat-detection failure, the repository gate, the
trusted publisher, issue publication, artifact handling, and other unexpected
job failures make the workflow fail.

Each workflow enables gh-aw's global failure-issue reporter and failed-job
reporter. Agent and framework failures, including `report_incomplete`, use the
runtime's failure identity and 24-hour reuse window. The conclusion job also
inspects repository-owned jobs such as the content gate and finding publisher.
The dedicated `report-incomplete` issue handler remains disabled, so incomplete
work does not create a second issue beside the global failure report. These
operational issues remain separate from content findings.

Failure-issue publication is best effort within the fixed gh-aw runtime. In
`v0.87.10`, failed-job reports are created per run rather than using the
Agent/framework reporter's 24-hour reuse window, and the reporter excludes the
built-in `safe_outputs` job. Actions status and normal notifications remain the
complete operational signal; this repository does not add a second failure
parser or persistent aggregator.

## Required pull-request review

The AI reviewer uses `pull_request_target` and runs its Agent only for pull requests authored by an `OWNER`, `MEMBER`, or `COLLABORATOR`. It checks out the exact event base with credentials removed. A trusted pre-Agent step fetches `refs/pull/<number>/head` into `FETCH_HEAD`, verifies the event head SHA, and never checks out, installs, or executes the proposed tree.

The Agent reads the exact diff and surrounding files with allowlisted Git commands. It reads complete pull-request, review, comment, reply, and thread state through read-only GitHub tools, including paginated GraphQL `reviewThreads`. The shared runtime installs the current trusted-base knowledge-base plugin, while the external review-reference Skills remain floating.

Safe outputs buffer one atomic `COMMENT` review pinned to the expected head:

- at most 100 accurately anchored inline comments; and
- exactly one consolidated review body.

Unanchored findings and line-addressable findings beyond the inline limit remain under `Findings not posted inline`, contribute to the visible severity counts, and affect the verdict. No safe output permits approval, request-changes, reply, thread resolution, branch mutation, or merge.

The custom job named exactly `AI review gate` remains the repository's required check. The [gate implementation](../scripts/ai-review/review-gate.ts) accepts exactly one `github-actions[bot]` `COMMENTED` review only when its API commit, gh-aw-owned attribution, current pull-request state, and current run-attempt `safe_outputs` time window agree. It paginates that review's inline comments, parses their severity together with body-only findings, and requires their exact sum to equal the visible four-level counts before applying the count-derived verdict. `high` or `medium` findings select `needs-change`; otherwise the verdict is `approved`.

The gate is read-only and does not project its verdict into pull-request labels. The authenticated review remains the human-readable record, while the head-bound `AI review gate` check is the only machine-enforced verdict. A new head requires its own check, and a `needs-change` review remains visible while that check fails. The workflow does not run for pull-request closure.

## Repository configuration

Set these Actions variables:

| Variable                                | Requirement                                                                             |
| --------------------------------------- | --------------------------------------------------------------------------------------- |
| `CONTENT_VERIFICATION_MODEL`            | Copilot model identifier or `auto`; missing defaults to `auto`.                         |
| `CONTENT_VERIFICATION_REASONING_EFFORT` | Concrete Copilot effort: `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, or `max`. |
| `AI_REVIEW_MODEL`                       | Copilot model identifier or `auto`; missing defaults to `auto`.                         |
| `AI_REVIEW_REASONING_EFFORT`            | Concrete Copilot effort: `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, or `max`. |

All four tasks use the `TAVILY_API_KEY` Actions secret. Set it directly in the repository's Actions secrets UI or enter it through GitHub CLI without placing the value on the command line:

```bash
gh secret set TAVILY_API_KEY --repo Soulike/knowledge-base
```

Configure `AI review gate` as a required status check and create the `automated-verification` and `modification-required` labels.

## Compile and validate

The repository pins gh-aw `v0.87.10`. Install that exact compiler and regenerate all sources with:

```bash
gh extension install github/gh-aw --pin v0.87.10
pnpm agentic:compile
```

For a separately verified compiler binary, set `GH_AW_COMPILER` to its path. The wrapper rejects every compiler version except `v0.87.10`.

Run:

```bash
pnpm agentic:check
pnpm check
git diff --check
```

`pnpm agentic:check` recompiles and rejects modified, deleted, or untracked generated artifacts. Generated lock workflows are excluded from Prettier because gh-aw is their authoritative formatter.

The expected compile warnings are the deliberate floating Copilot version and the `pull_request_target` security warning. The latter is bounded by explicit job permissions, the trusted-author filter, trusted-base checkout, exact unexecuted head objects, read-only Agent credentials, permission-isolated safe outputs, and the repository-owned verdict gate.
