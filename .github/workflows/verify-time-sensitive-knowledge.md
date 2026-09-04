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
  - uses: shared/content-verification.md
    with:
      scope: time-sensitive-knowledge
      modification_issue_title_prefix: "[time-sensitive Knowledge] "

permissions:
  all: read
  copilot-requests: write

concurrency:
  group: content-verification-time-sensitive-knowledge
  cancel-in-progress: false

jobs:
  content_verification_gate:
    name: Content verification gate
    needs:
      - agent
    if: always()
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - name: Check out the verified revision
        uses: actions/checkout@v7
        with:
          persist-credentials: false
          ref: ${{ github.sha }}

      - name: Set up Node.js
        uses: actions/setup-node@v7
        with:
          node-version: "lts/*"

      - name: Download Agent output and target manifest
        uses: actions/download-artifact@v8
        with:
          merge-multiple: true
          path: ${{ runner.temp }}/content-verification-gate
          pattern: "{agent,agent-output-fallback,content-verification-target-manifest}"

      - name: Enforce content verification result
        env:
          CONTENT_VERIFICATION_AGENT_RESULT: ${{ needs.agent.result }}
          CONTENT_VERIFICATION_ARTIFACT_DIRECTORY: ${{ runner.temp }}/content-verification-gate
          CONTENT_VERIFICATION_EXPECTED_REVISION: ${{ github.sha }}
          CONTENT_VERIFICATION_SCOPE: time-sensitive-knowledge
        run: node .github/scripts/content-verification/agentic-gate-cli.ts

  safe_outputs:
    needs:
      - content_verification_gate
    if: needs.content_verification_gate.result == 'success'

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

Verify every target in
`/content-verification-targets.json` at the exact revision
named by that manifest. The runner mounts this manifest read-only inside the
Agent sandbox. It was derived deterministically from tracked files and the
parsed [Knowledge index](knowledge/index.md); it is the complete required
scope. Treat every target independently and preserve its exact `id` in all
notes and safe outputs.

## Analysis phase

1. Read the root [repository instructions](AGENTS.md), the
   [Knowledge index](knowledge/index.md), the target manifest, and every
   file named by every target. If a target is missing, duplicated, or
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
