---
name: Verify time-sensitive Knowledge

on:
  schedule:
    - cron: "17 3 1 * *"
  workflow_dispatch:

engine:
  id: copilot
  version: latest
  model: ${{ vars.CONTENT_VERIFICATION_MODEL || 'auto' }}
  args:
    - --context
    - long_context
    - --reasoning-effort
    - ${{ vars.CONTENT_VERIFICATION_REASONING_EFFORT }}

imports:
  - uses: shared/agentic-runtime.md
    with:
      reasoning_effort: ${{ vars.CONTENT_VERIFICATION_REASONING_EFFORT }}
  - uses: shared/content-verification-findings.md
    with:
      scope: time-sensitive-knowledge

permissions:
  all: read
  copilot-requests: write

safe-outputs:
  report-failure-as-issue: true
  report-failed-jobs: true
  noop: false
  jobs:
    add-finding:
      description: Add one current content-verification finding during the review phase, before issue-history search begins.
      max: 100
      runs-on: ubuntu-latest
      permissions:
        contents: read
      inputs:
        finding_id:
          description: Choose a concise identifier for this finding within this run. Reuse exactly this ID in any later update_finding or delete_finding call.
          required: true
          type: string
        target_id:
          description: Primary target id from the manifest reviewTargetIds subset.
          required: true
          type: string
        classification:
          description: Whether current evidence establishes a required modification or leaves verification inconclusive.
          required: true
          type: choice
          options: [modification-required, verification-inconclusive]
        finding:
          description: Free-form Markdown describing one coherent finding and the evidence or reasoning needed to act on it.
          required: true
          type: string
        related_target_ids:
          description: Optional comma-separated target ids from the manifest catalog affected by the same coherent remediation. Do not pass JSON.
          required: false
          type: string
      steps:
        - name: Record add-finding events
          run: ":"
    update-finding:
      description: Fully replace one active finding added earlier in this run.
      max: 100
      runs-on: ubuntu-latest
      permissions:
        contents: read
      inputs:
        finding_id:
          description: Exact run-local identifier chosen in the earlier add_finding call.
          required: true
          type: string
        target_id:
          description: Complete replacement primary target id from the manifest reviewTargetIds subset.
          required: true
          type: string
        classification:
          description: Complete replacement classification for the finding.
          required: true
          type: choice
          options: [modification-required, verification-inconclusive]
        finding:
          description: Complete replacement free-form Markdown for the finding.
          required: true
          type: string
        related_target_ids:
          description: Complete replacement comma-separated related target ids from the manifest catalog. Omit when none; do not pass JSON.
          required: false
          type: string
      steps:
        - name: Record update-finding events
          run: ":"
    delete-finding:
      description: Delete one active finding after review or issue history shows that it should not be published.
      max: 100
      runs-on: ubuntu-latest
      permissions:
        contents: read
      inputs:
        finding_id:
          description: Exact run-local identifier chosen in the earlier add_finding call.
          required: true
          type: string
      steps:
        - name: Record delete-finding events
          run: ":"
  missing-tool:
    create-issue: false
  missing-data:
    create-issue: false
  report-incomplete:
    create-issue: false

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
    run: node .github/scripts/content-verification/prepare-agentic.ts

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
[Knowledge index](knowledge/index.md); the selected ids are the complete
required scope. Treat every selected target independently and preserve its
exact `id` in all notes and safe outputs.

## Analysis phase

1. Read the root [repository instructions](AGENTS.md), the
   [Knowledge index](knowledge/index.md), the target manifest, and every
   file named by every selected target. If a target is missing, duplicated, or
   unreadable, the manifest revision differs from the checked-out revision, or
   you cannot inspect the complete scope, stop and call `report_incomplete`
   exactly once.
2. For every target, verify each substantive externally dependent claim against
   current authoritative sources. Use Tavily search to locate candidates and
   Tavily extraction to inspect the source that supports the conclusion. A
   reachable URL or search snippet is not sufficient evidence.
3. Check that the Knowledge leaf's Scope, When to update, index routing entry,
   and body still agree. Also assess whether the leaf remains necessary and is
   one coherent current account rather than accumulated obsolete wording,
   duplicated authority, patch-layered exceptions, or edit-history structure.
4. Identify each current `modification-required` or
   `verification-inconclusive` finding. A required correction must identify the
   current evidence, the smallest coherent change, and acceptance criteria.
   Never turn uncertainty into a proposed change.

Every evidence-backed issue must retain the authoritative source URLs needed by
a maintainer to evaluate the finding.
