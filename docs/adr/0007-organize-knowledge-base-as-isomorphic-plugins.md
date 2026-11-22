# 0007: Organize knowledge-base as isomorphic plugins

## Status

Accepted. Supersedes
[ADR 0005](0005-organize-the-primary-product-as-a-top-level-source-module.md).

## Context

[ADR 0005](0005-organize-the-primary-product-as-a-top-level-source-module.md)
organized the primary `knowledge-base` product as a single installable
package at `knowledge-base/plugin/` while reserving a separate top-level
`plugins/<plugin-name>/` directory for auxiliary plugins. In practice, placing
every Knowledge domain and client-specific Workflow into that single package
accumulates more Skills and description metadata than host prompt budgets can
reliably disclose together, causing tail Skills to be truncated in Codex and
Copilot CLI sessions.

Several self-contained domains and client-specific Workflows—such as generative
media, Chromium, Azure DevOps, and Codex—have zero cross-links with the rest
of the knowledge base, yet the single-package structure forces every session to
load them. Meanwhile, the separate `plugins/` directory remained empty and
introduced an artificial structural split between the primary plugin and
sibling Knowledge plugins that share the same Agent Plugins format, Knowledge
Catalog model, Skill conventions, verification targets, and product-owned
tooling.

Additionally, an earlier authoring fallback instructed Handbooks in any bundle
lacking a co-packaged collaboration Handbook to duplicate reading-lifecycle
rules locally. Because `knowledge-base` itself is the always-installed base
plugin that owns the collaboration Handbook, duplicating lifecycle prose in
optional sibling plugins would create unnecessary drift.

## Decision

Organize all installable Knowledge plugins as isomorphic peer packages under
`knowledge-base/plugins/<plugin-name>/`, registered through the shared
[marketplace](../../.claude-plugin/marketplace.json). Remove the unused
top-level `plugins/` placeholder and its workspace reference.

Keep shared product-specific development facilities—`knowledge-base/lib/`,
`knowledge-base/tools/`, `knowledge-base/AGENTS.md`,
`knowledge-base/GLOSSARY.md`, and `knowledge-base/docs/`—in the top-level
`knowledge-base/` source module beside `knowledge-base/plugins/`. Installed
plugins must remain independent of those development facilities and of a
repository checkout.

Establish the **base-versus-optional runtime contract** alongside strict
static package isolation:

1. **Isomorphic package structure.** Every plugin under
   `knowledge-base/plugins/<name>/` follows the same self-contained layout:
   `plugin.json`, `README.md`, `LICENSE`, `knowledge/index.md` (its own
   Knowledge Catalog), `knowledge/` leaves, `skills/` entrypoints, optional
   `references/`, and optional collocated `tests/`.
2. **Always-installed base plugin.** `knowledge-base`
   (`knowledge-base/plugins/knowledge-base/`) is the always-installed base
   plugin with its stable marketplace selector (`knowledge-base@knowledge-base`).
   It owns `handbook-collaboration` and the shared reading-lifecycle rules in
   [Keep guidance current](../../knowledge-base/plugins/knowledge-base/references/agents/independent-collaboration.md#keep-guidance-current).
3. **Optional sibling plugins.** Optional plugins under
   `knowledge-base/plugins/<name>/` assume the base `knowledge-base` plugin is
   installed at runtime for shared collaboration reading-lifecycle behavior and
   do not duplicate those rules locally.
4. **Strict static intra-package isolation.** Every plugin under
   `knowledge-base/plugins/<name>/` must remain strictly self-contained on disk:
   no Markdown link or runtime reading route inside any plugin may cross into a
   sibling plugin or source-module tooling. Contribution Workflows whose
   explicit user-facing task inspects the whole knowledge base may read the
   canonical GitHub repository remotely via the manifest `repository` field
   without creating static cross-plugin dependencies.

Generalize repository Knowledge format and reachability validation, independent
date-based plugin versioning, and content-verification target discovery to
treat every marketplace-registered plugin under `knowledge-base/plugins/<name>/`
uniformly.

## Consequences

- `knowledge-base` keeps its marketplace name and `knowledge-base@knowledge-base`
  selector while relocating from `knowledge-base/plugin/` to
  `knowledge-base/plugins/knowledge-base/`.
- Optional domain and client plugins can be split into sibling directories under
  `knowledge-base/plugins/<name>/` without inventing a second plugin layout,
  format checker, or verification contract.
- Optional Handbooks remain concise without duplicating collaboration
  reading-lifecycle rules, because the always-installed base plugin owns them
  at runtime while static package reachability enforces zero cross-plugin links.
- Each plugin maintains its own Knowledge Catalog and independent date-based
  version derived from changes to its own `knowledge/`, `references/`, and
  `skills/` directories.
