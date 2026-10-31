---
name: Verify evergreen Knowledge

strict: false
timeout-minutes: 60

on:
  schedule:
    - cron: "43 3 8 1,4,7,10 *"
  workflow_dispatch:

engine:
  id: copilot
  version: ${{ needs.resolve_copilot_version.outputs.version }}
  model: ${{ vars.CONTENT_VERIFICATION_MODEL || 'auto' }}
  args:
    - --reasoning-effort
    - ${{ vars.CONTENT_VERIFICATION_REASONING_EFFORT }}

imports:
  - uses: shared/agentic-runtime.md
    with:
      reasoning_effort: ${{ vars.CONTENT_VERIFICATION_REASONING_EFFORT }}
  - uses: shared/content-verification.md
    with:
      scope: evergreen-knowledge

sandbox:
  agent:
    version: v0.29.1
    checksums-sha256: "8a27270a7980f9c5070c9e55ed8a9b6abb9cb7cb98f811b0861420c15df19d46"
    images:
      squid: ghcr.io/github/gh-aw-firewall/squid:0.29.1@sha256:575f5c30c08cfb195bad95363b8f50705dbf0c371082074425389230ec7061e0
      agent: ghcr.io/github/gh-aw-firewall/agent:0.29.1@sha256:564d747d7ca15fa9cc20b3694d3c4b6aa82efdd6965b8835de5456344662a08b
      api-proxy: ghcr.io/github/gh-aw-firewall/api-proxy:0.29.1@sha256:2600d581c3ba6c5846480ee371015c4ab9bfaa5508b2601c3497dbf9e1ebd5e1
      cli-proxy: ghcr.io/github/gh-aw-firewall/cli-proxy:0.29.1@sha256:a294dc213a2a74ef8e87e0648545e8250fa541e5b566c1a8bfae385009208036

permissions:
  all: read
  copilot-requests: write

concurrency:
  group: content-verification-evergreen-knowledge
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
      CONTENT_VERIFICATION_SCOPE: evergreen-knowledge
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

# Verify evergreen Knowledge

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
   [Knowledge catalog](knowledge-base/plugin/knowledge/index.md), the target manifest, and every
   file named by every selected target. If a target is missing, duplicated, or
   unreadable, the manifest revision differs from the checked-out revision, or
   you cannot inspect the complete scope, stop and call `report_incomplete`
   exactly once.
2. For every target, verify its reasoning, scope, internal consistency,
   continued necessity, and `evergreen` classification. Check whether ordinary
   external evolution has introduced an evolving dependency that now requires
   time-sensitive maintenance. Use `tavily_search` and `tavily_extract` when a
   current authoritative source is necessary to decide
   that question; a reachable URL or search snippet is not sufficient evidence.
3. Check that the Knowledge leaf's Scope, When to update, catalog routing entry,
   and body still agree. Also assess whether the leaf is one coherent current
   account rather than accumulated obsolete wording, duplicated authority,
   patch-layered exceptions, or edit-history structure.
4. Identify each current `modification-required` or
   `verification-inconclusive` finding. A required correction must identify the
   reasoning or evidence, the smallest coherent change, and acceptance
   criteria. Never turn uncertainty into a proposed change.

Every evidence-backed issue must retain the repository paths and authoritative
source URLs needed by a maintainer to evaluate the finding.
