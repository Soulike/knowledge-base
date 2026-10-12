# Knowledge-base product source

This directory owns the primary `knowledge-base` plugin and the development
facilities that change with its Knowledge model.

## Layout

- [plugin/](plugin/) is the complete Agent Plugins package selected by the
  marketplace. It contains the manifest, user guide, Knowledge, installed
  Skills, shared Skill references, and packaged license.
- [tooling/](tooling/) contains source-only checks and release tooling owned by
  the knowledge-base plugin.
- [packages/](packages/) contains source-only libraries shared by that tooling
  and repository automation.
- [AGENTS.md](AGENTS.md) defines content-authoring rules, and
  [GLOSSARY.md](GLOSSARY.md) owns the plugin's domain vocabulary.

The installable package must remain usable without `tooling/`, `packages/`, the
repository root, or another plugin. Repository-wide automation may consume the
source-only facilities through the root pnpm workspace.

For installation and use, see the [plugin guide](plugin/README.md). For
repository-wide contribution commands and architecture, return to the
[repository README](../README.md).
