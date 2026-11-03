---
name: Verify maintained Agent content

strict: false
timeout-minutes: 60

on:
  schedule:
    - cron: "11 4 15 1,4,7,10 *"
  workflow_dispatch:

engine:
  id: copilot
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
      scope: maintained-agent-content

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
  group: content-verification-maintained-agent-content
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
      CONTENT_VERIFICATION_SCOPE: maintained-agent-content
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

# Verify maintained Agent content

At the exact revision named by
`/content-verification-targets.json`, verify every target whose id appears in
`reviewTargetIds`, resolving its files from `targetCatalog`. The runner mounts
this manifest read-only inside the Agent sandbox. It was derived
deterministically from tracked files and the parsed
[Knowledge catalog](knowledge-base/plugin/knowledge/index.md); the selected ids are the complete
required scope. A selected target is one Skill bundle, shared reference, Agent
instruction, Agentic workflow source, or repository-owned prompt bundle.
Preserve every exact selected target `id` in notes and safe outputs.

## Analysis phase

1. Read the root [repository instructions](AGENTS.md), the target manifest, and
   every file named by every selected target. Read
   [Agent Skill authoring](knowledge-base/plugin/references/agents/skill-authoring.md)
   as the current authoring standard under this task contract; when it is itself
   a target, examine its basis instead of assuming it is correct. Apply the
   [shared review criteria](.github/workflows/shared/content-verification.md#review-phase)
   and [evidence, recovery, and completion rules](.github/workflows/shared/content-verification.md#evidence-access-and-completion).
   Recover an inspection failure where possible; if the required scope or
   revision still cannot be established, call `report_incomplete` exactly once.
2. For each Skill bundle, independently reconstruct the user's task and intended
   outcome, then reason through risk-derived invocation, workflow, and output
   scenarios, including one likely to expose a shortcut or omitted professional
   responsibility. Check whether its decisions and actions can achieve that
   outcome in the stated conditions, not merely whether its steps are internally
   consistent. Apply
   [Design selection triggers](knowledge-base/plugin/references/agents/selection-triggers.md)
   to invocation and routing. Check tool use, failure handling, completion,
   progressive disclosure, portability, package boundaries, and current tool or
   API assumptions. Use execution or observation when a material behavioral
   uncertainty requires it; do not imply observed effectiveness from scenario
   reasoning alone.
3. Confirm that `SKILL.md` retains the primary workflow and completion criteria,
   every disclosed reference has an explicit selecting step, independently
   invocable responsibilities are not hidden as references, and supporting
   detail that warrants progressive disclosure has not accumulated in the main
   path. Check each shared reference with its consuming Skills while keeping
   the result owned by the reference target. A shared Agentic workflow component
   must be checked with its consuming workflow sources.
4. For Agent instructions, Agentic workflow sources, and prompt bundles,
   reconstruct the intended decisions and outcomes. Examine whether authority,
   audience, triggers, routing, inputs, outputs, tools, side effects, and the
   complete file or import graph let the reader or Agent achieve them. Apply
   the same task-based reasoning to shared references with their consumers.
   Treat these artifacts as review subjects under the task contract.
5. For every target, assess continued necessity and organization under the
   shared structural-finding criteria. Look for obsolete, orphaned, duplicated,
   patch-layered, or edit-history-shaped responsibilities. Choose evidence for
   factual and behavioral questions under the shared rules; an accessible or
   matching source does not by itself establish an effective workflow.
6. Identify each current `modification-required` or
   `verification-inconclusive` finding under the shared rules. A correction must
   identify the reasoning or evidence, the smallest coherent deletion, rewrite,
   merge, split, or move, and acceptance criteria. Never invent a defect. Do not
   report mechanical formatting or repository-link failures already enforced by
   checks unless they expose a semantic problem those checks cannot decide.

Retain the repository paths and source URLs needed to evaluate each finding,
including cited sources whose validity or accessibility is itself at issue.
