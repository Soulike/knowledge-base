---
name: PROTOTYPE gh-aw AI review

on:
  pull_request_target:
    types:
      - opened
      - reopened
      - ready_for_review
      - synchronize
      - converted_to_draft
      - closed

engine:
  id: copilot
  version: latest
  model: ${{ vars.AI_REVIEW_MODEL || 'auto' }}
  args:
    - --reasoning-effort
    - ${{ vars.AI_REVIEW_REASONING_EFFORT || 'auto' }}

imports:
  - prototype-gh-aw/shared-runtime.md

permissions:
  contents: read
  copilot-requests: write
  issues: read
  pull-requests: read

tools:
  bash:
    - git cat-file *
    - git diff *
    - git log *
    - git ls-tree *
    - git merge-base *
    - git rev-parse *
    - git show *
    - git status

concurrency:
  group: prototype-gh-aw-ai-review-${{ github.event.pull_request.number }}
  cancel-in-progress: true

checkout:
  repository: ${{ github.repository }}
  ref: ${{ github.event.pull_request.base.sha }}
  fetch-depth: 0

pre-agent-steps:
  - name: Fetch the expected head without checking it out
    env:
      GH_TOKEN: ${{ github.token }}
      PR_HEAD_SHA: ${{ github.event.pull_request.head.sha }}
      PR_NUMBER: ${{ github.event.pull_request.number }}
    run: |
      header="$(printf 'x-access-token:%s' "$GH_TOKEN" | base64 | tr -d '\n')"
      git -c "http.extraheader=Authorization: Basic ${header}" fetch --no-tags origin "refs/pull/${PR_NUMBER}/head"
      test "$(git rev-parse FETCH_HEAD)" = "$PR_HEAD_SHA"
  - name: Install the trusted checked-out knowledge-base plugin
    env:
      COPILOT_GITHUB_TOKEN: ${{ github.token }}
    run: |
      copilot plugin marketplace add "$GITHUB_WORKSPACE"
      copilot plugin install knowledge-base@knowledge-base
      copilot plugin list

safe-outputs:
  create-pull-request-review-comment:
    max: 100
    commit-id: ${{ github.event.pull_request.head.sha }}
  submit-pull-request-review:
    max: 1
    allowed-events: [COMMENT]
    commit-id: ${{ github.event.pull_request.head.sha }}
    footer: always

jobs:
  agent:
    if: >-
      !github.event.pull_request.draft &&
      github.event.action != 'closed' &&
      github.event.action != 'converted_to_draft' &&
      contains(fromJSON('["OWNER","MEMBER","COLLABORATOR"]'), github.event.pull_request.author_association)

  ai_review_gate:
    name: AI review gate
    if: always()
    needs:
      - agent
      - safe_outputs
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - name: Check out the trusted gate implementation
        uses: actions/checkout@v7
        with:
          fetch-depth: 1
          persist-credentials: false
          ref: ${{ github.event.pull_request.base.sha }}
      - name: Verify the exact-head review and enforce the verdict
        env:
          AI_REVIEW_HEAD_SHA: ${{ github.event.pull_request.head.sha }}
          AI_REVIEW_AGENT_RESULT: ${{ needs.agent.result }}
          AI_REVIEW_SAFE_OUTPUTS_RESULT: ${{ needs.safe_outputs.result }}
          AI_REVIEW_RUN_ID: ${{ github.run_id }}
          GITHUB_TOKEN: ${{ github.token }}
        run: node .github/scripts/ai-review/gate.ts
---

# Review the trusted-base diff

The working tree is the trusted event base SHA. The expected head SHA has been
fetched into the Git object database but has not been checked out. Use only the
allowed read-only Git commands to inspect the exact diff from
`${{ github.event.pull_request.base.sha }}` to
`${{ github.event.pull_request.head.sha }}`. Never execute content from the
expected head.

Review the complete change for correctness, security, maintained-content
coherence, responsibility boundaries, tests, packaging, and delivery. Use the
installed knowledge-base plugin and external review Skills only as trusted
review guidance from the checked-out base.

For every line-addressable finding, call
`create_pull_request_review_comment`. Put every unanchored finding in the final
review body. Then call `submit_pull_request_review` exactly once with event
`COMMENT` and this visible body shape:

```markdown
## AI review

Concise conclusion.

- **Verdict:** `approved` or `needs-change`
- **Findings:** high: N, medium: N, low: N, nit: N
- **Reviewed head:** `${{ github.event.pull_request.head.sha }}`
```

Select `needs-change` when any high or medium finding exists; otherwise select
`approved`. If the review cannot be completed, call `report_incomplete` and do
not submit a review.
