# gh-aw pull-request review

The [`AI review` source](../../workflows/ai-review.md) and its
[generated workflow](../../workflows/ai-review.lock.yml) review every non-draft
pull request from an `OWNER`, `MEMBER`, or `COLLABORATOR`. The workflow runs when
the pull request opens, reopens, becomes ready, or receives a new push. A
per-pull-request concurrency group cancels the older run when another push
arrives.

Draft and closed events skip the Agent and safe outputs. The trusted gate removes
both verdict labels and fails while a pull request is a draft. A closed pull
request is not applicable and leaves the gate successful after label cleanup.

## Trust and publication boundary

The workflow uses `pull_request_target` because the repository-owned gate and
safe-output publisher need trusted base code and pull-request write permission.
The Agent job checks out the event's exact base SHA with credentials removed. A
trusted pre-Agent step fetches `refs/pull/<number>/head` into `FETCH_HEAD`,
verifies the expected SHA, and never checks it out. The Agent may inspect the
proposed objects through an allowlist of read-only Git commands, but must not
install, execute, apply, merge, or source the proposed tree.

The Agent reads pull-request state and history through the read-only GitHub
proxy. The prompt requires complete title, description, issue, commit, diff,
review, inline comment, reply, top-level comment, and review-thread state before
publication. Tavily is available only for current external evidence needed by
the review.

Before inference, the trusted base checkout installs:

- the current knowledge-base plugin from that checkout; and
- the latest selected external review-reference Skills.

Neither is compile-time pinned. Copilot CLI also remains at `latest`; the
repository pins only the gh-aw compiler and generated runtime contract.

The Agent has no general pull-request write credential. It can request only:

- at most 100 inline review comments pinned to the expected head; and
- exactly one consolidated review pinned to the expected head and restricted to
  the `COMMENT` event.

Every unanchored finding and every line-addressable finding beyond the inline
limit remains in the review body and contributes to the visible severity counts
and verdict. The Agent cannot approve, request changes, reply, resolve a thread,
alter a branch, or merge through safe outputs. gh-aw threat detection must
succeed before the permission-isolated safe-output job publishes the atomic
review.

## Trusted verdict gate

The custom job named exactly `AI review gate` remains the required status check.
It retrieves the current pull-request state, every submitted review, and the
jobs for the current workflow run attempt. A review is accepted only when all of
these facts agree:

- the pull request is still open at the event base and expected head;
- the author is `github-actions[bot]`, the state is `COMMENTED`, and the API
  commit id is the expected head;
- the gh-aw-owned attribution footer names the `AI review` workflow, workflow id
  `ai-review`, current run id, and exact run URL;
- the review was submitted during the one successful `safe_outputs` job in the
  current run attempt; and
- the body contains exactly one model, verdict, four-level finding count, and
  reviewed-head field, with `needs-change` selected exactly when `high` or
  `medium` is nonzero.

The gate never trusts an Agent-authored hidden marker; gh-aw sanitizes the Agent
body before appending its own attribution. A missing, malformed, duplicate,
stale, failed, or prior-attempt review clears both verdict labels and fails
closed. After applying `AI Approved` or `AI Need Change`, the gate reads the pull
request, reviews, and attempt jobs again. A head change removes the newly applied
label. `AI Need Change` remains visible while the required check fails.

## Configuration

Create these repository labels:

| Label            | Meaning                                                  |
| ---------------- | -------------------------------------------------------- |
| `AI Approved`    | The reviewed current code has no medium or high finding. |
| `AI Need Change` | The reviewed current code has a medium or high finding.  |

Set these Actions variables:

| Variable                     | Value                                                                 |
| ---------------------------- | --------------------------------------------------------------------- |
| `AI_REVIEW_MODEL`            | A Copilot model identifier or `auto`; missing defaults to `auto`.     |
| `AI_REVIEW_REASONING_EFFORT` | One of `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, or `max`. |

The reasoning effort is mandatory and must not be `auto`. The shared preflight
rejects a missing, `auto`, or unsupported value before inference because gh-aw
passes the configured value to Copilot CLI's explicit `--reasoning-effort`
option.

The workflow also uses the `TAVILY_API_KEY` Actions secret. Configure
`AI review gate` as the required status check. A `pull_request_target` workflow
must exist on the default branch before pull-request events can run it.

## Generated workflow contract

The repository compiles the source with gh-aw `v0.87.10`. Regenerate and verify
the committed lock workflow with the commands documented in the
[scheduled-verification runtime](../content-verification/README.md#generated-workflow-contract).
