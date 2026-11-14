---
name: Verify time-sensitive Knowledge

strict: false
timeout-minutes: 60

on:
  schedule:
    - cron: "17 3 1 * *"
  workflow_dispatch:

engine:
  id: copilot
  model: ${{ vars.CONTENT_VERIFICATION_MODEL || 'auto' }}
  args:
    - --allow-all-urls
    - --reasoning-effort
    - ${{ vars.CONTENT_VERIFICATION_REASONING_EFFORT }}

imports:
  - uses: shared/agentic-runtime.md
    with:
      reasoning_effort: ${{ vars.CONTENT_VERIFICATION_REASONING_EFFORT }}
  - uses: shared/content-verification.md
    with:
      scope: time-sensitive-knowledge

permissions:
  all: read
  copilot-requests: write

concurrency:
  group: content-verification-time-sensitive-knowledge
  cancel-in-progress: false

pre-agent-steps:
  - name: Set up pnpm
    uses: pnpm/action-setup@v6
    with:
      version: latest
      cache: true
      cache_dependency_path: pnpm-lock.yaml

  - name: Install repository dependencies
    run: pnpm install --frozen-lockfile --ignore-scripts

  - name: Generate content verification target manifest
    env:
      CONTENT_VERIFICATION_SCOPE: time-sensitive-knowledge
      CONTENT_VERIFICATION_TARGET_MANIFEST: ${{ runner.temp }}/gh-aw/content-verification-targets.json
    run: node .github/scripts/content-verification-cli/prepare-agentic.ts

post-steps:
  - name: Upload trusted target manifest
    if: always()
    uses: actions/upload-artifact@v7
    with:
      if-no-files-found: error
      name: content-verification-target-manifest
      path: ${{ runner.temp }}/gh-aw/content-verification-targets.json
---

# Verify time-sensitive Knowledge

At the exact revision named by
`/content-verification-targets.json`, verify every target whose id appears in
`reviewTargetIds`, resolving its files from `targetCatalog`. The runner mounts
this manifest read-only inside the Agent sandbox. It was derived
deterministically from tracked files and the parsed
[Knowledge catalog](knowledge-base/plugin/knowledge/index.md); the selected ids are the complete
required scope. Treat every selected target independently and preserve its
exact `id` in all notes and safe outputs.

## Analysis phase

1. Read the root [repository instructions](AGENTS.md), the
   [plugin content rules](knowledge-base/AGENTS.md), the
   [Knowledge catalog](knowledge-base/plugin/knowledge/index.md), the target
   manifest, and every file named by every selected target. Apply the
   [shared review criteria](.github/workflows/shared/content-verification.md#review-phase)
   and [evidence, recovery, and completion rules](.github/workflows/shared/content-verification.md#evidence-access-and-completion).
   Recover an inspection failure where possible; if the required scope or
   revision still cannot be established, call `report_incomplete` exactly once.
2. For every target, evaluate its correctness and usefulness for the reader's
   tasks, challenging reasoning, assumptions, applicability, and practical
   recommendations. Identify external dependencies and investigate the current
   facts or guarantees needed to judge them. Choose evidence for those questions
   under the shared rules rather than treating source agreement as the review's
   conclusion. Recheck evolving behavior and product-specific empirical claims
   with evidence appropriate to their stated scope.
3. Check the leaf's continued necessity, organization, `time-sensitive`
   classification, and agreement among Scope, When to update, and body.
   Investigate whether these boundaries conceal a supported reading need or
   impose an unsupported limit; apply the shared structural-finding criteria.
4. Use the catalog as the complete leaf inventory and Knowledge Type authority,
   then search for actual incoming routes from installed primary-plugin
   Workflows and Handbooks. A Workflow may select the leaf directly or through
   an explicitly selected same-package reference; a Handbook must link it
   directly. Trace the consumer, selecting condition or step, task stage, and
   complete file or context-sufficient section. A catalog entry,
   repository-authoring Skill, README or research document, test or fixture,
   another plugin, or another Knowledge leaf does not establish an installed
   runtime consumer. Report static reachability separately from observations of
   selection, reading, and application.
5. Identify each current `modification-required` or
   `verification-inconclusive` finding under the shared rules. A correction must
   identify its reasoning or evidence, the smallest coherent change, and
   acceptance criteria. Never turn uncertainty into a proposed change.

Retain the repository paths and source URLs needed to evaluate each finding,
including cited sources whose validity or accessibility is itself at issue.
