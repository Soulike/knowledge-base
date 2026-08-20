# Copilot CLI pull-request review

The [`AI review` workflow](../../workflows/ai-review.yml) runs one integrated
Copilot CLI review when a collaborator adds the `Ready for Review` label to an
open pull request. The label is a one-shot request: the workflow removes it at
the beginning of the run, so a collaborator can add it again after another
change or to request a human retry.

## Trust and permission boundary

The workflow uses `pull_request_target` so it always executes the workflow,
prompt, scripts, Agent instructions, and knowledge-base plugin from the trusted
`main` branch. It never checks out, installs dependencies from, or executes the
pull-request head. The review job fetches the complete Git history and the PR
head into the local object database while its working tree remains at trusted
review tooling. Copilot reads commits, diffs, and repository files with local,
read-only Git commands, then uses GitHub tools to retrieve PR metadata and the
complete review history that Git does not contain.

Copilot may use every CLI tool and network destination, but its job token can
only read repository and pull-request content and make Copilot requests. A
separate publisher job receives the model response as untrusted data, validates
its complete schema and changed-line locations, rechecks the pull-request
revision, and owns every review, thread-resolution, and label mutation.

The workflow uses GitHub's short-lived `GITHUB_TOKEN`; it does not require a
personal access token. Repository policy must permit Copilot CLI requests from
GitHub Actions.

This design assumes the repository continues to restrict pull-request creation
to trusted collaborators. Copilot deliberately receives unrestricted tools and
network access, so maintainers must reassess the workflow before allowing
untrusted authors to supply pull-request content.

## Configuration

Create these repository labels:

| Label              | Meaning                                                          |
| ------------------ | ---------------------------------------------------------------- |
| `Ready for Review` | Consume once to request a review.                                |
| `AI Approved`      | No active AI-owned `medium` or `high` finding remains.           |
| `AI Need Change`   | At least one active AI-owned `medium` or `high` finding remains. |

Set these Actions variables to choose Copilot behavior:

| Variable                     | Value                                                                  |
| ---------------------------- | ---------------------------------------------------------------------- |
| `AI_REVIEW_MODEL`            | A Copilot model identifier or `auto`.                                  |
| `AI_REVIEW_REASONING_EFFORT` | `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, `max`, or `auto`. |

`auto` model selection is passed to Copilot. `auto` reasoning effort omits the
CLI option so Copilot chooses the default supported by the selected model.
Missing variables also default to `auto`.

The workflow deliberately installs the latest Copilot CLI, Skills CLI, and
Matt Pocock review-reference Skills on every run. It installs the knowledge-base
plugin from the trusted `main` checkout and records the exact versions and
commit in the submitted review.

Tracking those latest releases and external Skill contents accepts upstream
drift as a maintainer-owned supply-chain tradeoff. Installation occurs before
the analysis token enters the step environment, and the write-capable publisher
runs on a fresh runner without those packages. Reassess this choice if review
reproducibility becomes required, an upstream incident occurs, or the trusted
author policy changes.

## Review and verdict lifecycle

The maintained [review prompt](prompts/review.md) gives Copilot the PR identity
and expected base and head rather than a prepared diff. It requires Copilot to
inspect the locally fetched repository history and retrieve all pages of review
history itself. Copilot returns JSON only; malformed output fails the run
without an automatic retry or partial publication.

The publisher submits one `COMMENT` review for each successfully published
review request. Every `nit`, `low`, `medium`, and `high` finding becomes an
inline thread, and the repository's thread-resolution rule therefore blocks
merging until each is resolved. Only active `medium` and `high` findings select
`AI Need Change`; otherwise the publisher selects `AI Approved`. The publisher
may resolve only its own marked threads that Copilot explicitly verifies as
fixed, and it posts the model's evidence as a reply before resolving the thread.
Human-owned threads are never resolved by this workflow.

The run removes both verdict labels before analysis. The publisher records a
verdict only after it has completed the review and label updates and confirmed
that the pull-request head is still current. A final gate passes `AI Approved`
and fails the workflow for `AI Need Change`; the failed check preserves the
published review and `AI Need Change` label. A missing or invalid verdict also
fails closed. Re-running the same workflow run is idempotent after publication,
while removing and adding `Ready for Review` creates a new auditable review
request.
