# Agentic GitHub workflows

This repository uses gh-aw for four Agentic GitHub Actions tasks. A shared runtime owns execution, sandbox, read tools, external research, and safe-output transport. Three scheduled content-verification tasks and one required pull-request reviewer retain separate subjects, completion rules, and publication gates.

The architectural rationale is recorded in [ADR 0001](../../docs/adr/0001-use-gh-aw-for-agentic-github-workflows.md). The general state and trust invariants are maintained as [Agent run-state Knowledge](../../knowledge/github-actions/agent-run-state-and-reruns.md).

## Workflow inventory

| Task                     | Trigger and subject                                                              | Source and generated workflow                                                                       |
| ------------------------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Time-sensitive Knowledge | Monthly, every Knowledge leaf indexed as `time-sensitive`                        | [Source](verify-time-sensitive-knowledge.md), [generated](verify-time-sensitive-knowledge.lock.yml) |
| Evergreen Knowledge      | Quarterly, every Knowledge leaf indexed as `evergreen`                           | [Source](verify-evergreen-knowledge.md), [generated](verify-evergreen-knowledge.lock.yml)           |
| Maintained Agent content | Quarterly, maintained Skills, references, Agent instructions, and prompt bundles | [Source](verify-maintained-agent-content.md), [generated](verify-maintained-agent-content.lock.yml) |
| AI review                | Eligible non-draft pull requests and later pushes                                | [Source](ai-review.md), [generated](ai-review.lock.yml)                                             |

Every source declares `engine.version: latest`, so gh-aw installs the current Copilot CLI at run time. The repository variable selects the model. Each task passes a mandatory concrete reasoning effort through `engine.args`; the shared preflight rejects a missing, `auto`, or unsupported value before inference.

The source Markdown is maintained by people and Agents. The generated `*.lock.yml` files and [action lock](../aw/actions-lock.json) are committed review artifacts owned by the fixed compiler.

## Shared runtime boundary

All four tasks import [the shared runtime](shared/agentic-runtime.md). It provides:

- a read-only GitHub proxy;
- the remote Tavily MCP service, exposing only search and extraction;
- a sandbox network boundary;
- Node.js 24;
- floating `codebase-design`, `tdd`, and `writing-for-agents` review-reference Skills;
- required reasoning-effort validation; and
- fail-closed threat detection before safe-output publication.

The Agent does not receive the credential used for issue or review publication. It requests an allowed effect through safe-output tools. A separate job with only the required write permission validates and applies that request. Repository-owned gates then enforce task-specific subject, shape, verdict, or completion policy.

Repository content under review, issue and pull-request text, and external pages remain untrusted evidence. The checked-out workflow source, root [repository instructions](../../AGENTS.md), and explicitly installed review material are trusted guidance. The runtime boundary does not merge the four task contracts.

## Scheduled content verification

Each scheduled task also supports manual dispatch and keeps its own name, schedule, scope, and concurrency identity. Before inference, a trusted step derives an immutable target manifest from `git ls-files`, the parsed [Knowledge index](../../knowledge/index.md), and the checked-out revision. Target discovery is implemented in [the content-verification scripts](../scripts/content-verification/targets.ts).

A Knowledge target owns one leaf. A Skill target owns its `SKILL.md` and tracked files below the same directory. Package-level references and `.github/workflows/shared/*.md` components are independent shared-reference targets. Each otherwise unowned `AGENTS.md`, root `CONTEXT.md`, and file under `docs/agents/` is an instruction target. Each root `.github/workflows/*.md` source except this README is an Agentic workflow target, and each `.github/scripts/*/prompts/` directory is one prompt target. An invalid index, mutable revision, empty scope, duplicate target, or duplicate file ownership fails before the Agent runs.

The three tasks apply different review standards:

- time-sensitive Knowledge verifies every evolving claim against current authoritative sources;
- evergreen Knowledge verifies reasoning, internal consistency, continued necessity, and whether external evolution has made the classification time-sensitive; and
- maintained Agent content reviews invocation, routing, decisions, tool use, failure handling, completion, progressive disclosure, portability, package boundaries, current assumptions, and maintenance lifecycle.

All three use the same decision order. The Agent completes and freezes content analysis before searching issues. It then searches both open and closed history for each actionable finding. An open issue suppresses a duplicate only when it covers the same target, premise, change, and acceptance outcome. A closed issue constrains a future run only when a trusted maintainer explicitly records that the same disposition should govern future verification while its premises remain unchanged. Closure alone is not a durable decision.

Each run ends with exactly one terminal safe-output pattern:

- one combined `create_issue` request for each affected target without a matching open issue;
- one `noop` when no new issue remains; or
- one `report_incomplete` when a target, tool, source, or analysis step is unavailable.

The [content publication gate](../scripts/content-verification/agentic-gate.ts) runs after the Agent and before the issue-write job. It authenticates manifest revision and scope, target shape, terminal output, exact issue keys, scope-specific title, per-target cardinality, and target/revision body binding. It rejects incomplete, missing-tool, missing-data, malformed, unknown, duplicate, or expanded effects.

When the gate succeeds, gh-aw publishes the validated issue requests directly. Framework-failure, missing-tool, missing-data, and incomplete-result paths cannot publish issues. Published maintenance issues receive `automated-verification` and `modification-required`, and are assigned to `Soulike`.

## Required pull-request review

The AI reviewer uses `pull_request_target` and runs its Agent only for pull requests authored by an `OWNER`, `MEMBER`, or `COLLABORATOR`. It checks out the exact event base with credentials removed. A trusted pre-Agent step fetches `refs/pull/<number>/head` into `FETCH_HEAD`, verifies the event head SHA, and never checks out, installs, or executes the proposed tree.

The Agent reads the exact diff and surrounding files with allowlisted Git commands. It reads complete pull-request, review, comment, reply, and thread state through read-only GitHub tools, including paginated GraphQL `reviewThreads`. The trusted base checkout installs the current knowledge-base plugin, while the external review-reference Skills remain floating.

Safe outputs buffer one atomic `COMMENT` review pinned to the expected head:

- at most 100 accurately anchored inline comments; and
- exactly one consolidated review body.

Unanchored findings and line-addressable findings beyond the inline limit remain under `Findings not posted inline`, contribute to the visible severity counts, and affect the verdict. No safe output permits approval, request-changes, reply, thread resolution, branch mutation, or merge.

The custom job named exactly `AI review gate` remains the repository's required check. The [gate implementation](../scripts/ai-review/review-gate.ts) accepts exactly one `github-actions[bot]` `COMMENTED` review only when its API commit, gh-aw-owned attribution, current pull-request state, and current run-attempt `safe_outputs` time window agree. It paginates that review's inline comments, parses their severity together with body-only findings, and requires their exact sum to equal the visible four-level counts before applying the count-derived verdict. `high` or `medium` findings select `needs-change`; otherwise the verdict is `approved`.

The gate owns `AI Approved` and `AI Need Change`. It clears both labels for missing, failed, malformed, stale, draft, or untrusted review paths; a closed pull request is not applicable. After applying a verdict label, it re-reads the pull request, reviews, and current-attempt jobs. A head change removes the newly applied label. A `needs-change` review and label remain visible while the required check fails.

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

Configure `AI review gate` as a required status check and create the `AI Approved`, `AI Need Change`, `automated-verification`, and `modification-required` labels.

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
