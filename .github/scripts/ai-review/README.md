# Copilot CLI pull-request review

The [`AI review` workflow](../../workflows/ai-review.yml) reviews every
non-draft pull request from an `OWNER`, `MEMBER`, or `COLLABORATOR`. It runs when
the pull request opens, reopens, becomes ready for review, or receives a new
push. A per-pull-request concurrency group cancels the older run when another
push arrives.

Draft and closed events skip Copilot and remove the AI verdict labels. The gate
fails while a pull request is a draft, then the pull request starts its first
review when it becomes ready for review. A closed pull request is not
applicable to the gate.

## Trust and permission boundary

The workflow uses `pull_request_target` and checks out the pull request's
trusted base revision. It never checks out, installs, or executes the proposed
head. The trusted job fetches the proposed commits into the local Git object
database so Copilot can inspect them with read-only Git commands while the
working tree remains at the base revision.

Copilot has unrestricted internal tools and network access. The built-in GitHub
MCP server is disabled; Copilot uses the authenticated GitHub CLI to retrieve
complete pull-request and review history. Its token can read repository and
issue data and can write pull-request reviews. The prompt authorizes exactly one
mutation: one atomic REST `COMMENT` review containing the summary and all inline
comments. It never approves, requests changes, changes labels, replies to
threads, or resolves threads.

The separate trusted gate owns label changes. It uses
[`@octokit/rest`](https://github.com/octokit/rest.js) for typed GitHub REST
endpoints and pagination, then authenticates the review by author, current head,
run identity, review state, visible verdict, and hidden marker. A malformed,
missing, duplicate, stale, or failed review clears both verdict labels and
fails closed.

This boundary assumes pull-request authors with the trusted associations are
allowed to provide content to an unrestricted reviewer. Reassess the design
before widening that author policy. GitHub does not expose a review-only job
permission: `pull-requests: write` also permits other pull-request mutations.
The prompt and trusted-author restriction limit that residual capability, while
the gate detects an invalid or missing review but cannot undo an unrelated
mutation.

## Configuration

Create these repository labels:

| Label            | Meaning                                                  |
| ---------------- | -------------------------------------------------------- |
| `AI Approved`    | The reviewed current code has no medium or high finding. |
| `AI Need Change` | The reviewed current code has a medium or high finding.  |

Set these Actions variables to choose Copilot behavior:

| Variable                     | Value                                                                  |
| ---------------------------- | ---------------------------------------------------------------------- |
| `AI_REVIEW_MODEL`            | A Copilot model identifier or `auto`.                                  |
| `AI_REVIEW_REASONING_EFFORT` | `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, `max`, or `auto`. |

Missing variables default to `auto`. `auto` model selection is passed to
Copilot; `auto` reasoning effort omits the CLI option so the selected model uses
its default.

Configure `AI review gate` as the required status check. The workflow must
already exist on the default branch before `pull_request_target` events can run
it.

## Review and verdict lifecycle

The maintained [review prompt](prompts/review.md) gives Copilot the pull-request
identity and expected base and head. Its
[repository guidance inventory](prompts/skills.md) keeps repository-owned Skill
and Knowledge routes link-checkable under their repository-root runtime
semantics. The runner injects that trusted inventory into the prompt. Copilot
loads the complete diff and review history itself, evaluates the current code,
and avoids duplicate findings. A fixed issue in an unresolved old thread does
not force `needs-change`.

Copilot posts every concrete `nit`, `low`, `medium`, and `high` finding as an
inline comment on a changed line. Current `medium` or `high` findings select
`needs-change`; otherwise the verdict is `approved`. The review remains a
`COMMENT` review in both cases, so the automation never changes GitHub's review
approval state.

The summary records the short model name or identifier reported by Copilot,
reviewed head SHA, visible verdict, severity counts, and this run marker. The
model field is informational rather than an authenticated statement from the
model backend; the gate requires exactly one well-formed field but does not
verify its value.

```html
<!-- knowledge-base-ai-review verdict=approved head=<sha> run-id=<id> run-attempt=<n> -->
```

After Copilot exits, the gate retrieves all submitted reviews through Octokit.
It accepts exactly one review from `github-actions[bot]` for the current run,
attempt, and head. The gate applies `AI Approved` or `AI Need Change`, rechecks
the pull-request revision, and succeeds only for `approved`. The review and
`AI Need Change` label remain visible when the verdict fails the check.

The workflow streams Copilot stdout and stderr directly into the Actions log,
including its progress and final submission result. It does not parse model
output or transfer JSON artifacts between jobs.

## Tool versions

Each run installs the latest Copilot CLI, Skills CLI, and selected external
review-reference Skills. It installs the knowledge-base plugin from the trusted
base checkout. Floating tool and Skill versions accept upstream drift as a
maintainer-owned supply-chain tradeoff; reassess this choice when reproducible
reviews are required or an upstream incident occurs.
