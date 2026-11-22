# Knowledge-base product source

This directory owns the isomorphic `knowledge-base` plugins and the development
facilities that change with their Knowledge model.

## Layout

- `plugins/<plugin-name>/` holds the self-contained Agent Plugins packages
  selected by the marketplace, anchored by the always-installed base
  [knowledge-base plugin](plugins/knowledge-base/). Each plugin contains its
  own manifest, user guide, Knowledge Catalog, Knowledge leaves, installed
  Skills, optional shared Skill references, and packaged license.
- [lib/](lib/) contains source-only libraries consumed through imports by
  product tools and repository automation.
- [tools/](tools/) contains source-only executable checks and release tools.
- [AGENTS.md](AGENTS.md) defines content-authoring rules, and
  [GLOSSARY.md](GLOSSARY.md) owns the product's domain vocabulary.

Each installable package under `plugins/<plugin-name>/` must remain usable on
disk without `lib/`, `tools/`, the repository root, or static links into
another plugin. Optional sibling plugins assume the base `knowledge-base`
plugin is installed at runtime for shared collaboration reading-lifecycle
behavior. Repository-wide automation may consume the source-only facilities
through the root pnpm workspace.

For installation and use, see the
[base plugin guide](plugins/knowledge-base/README.md). For repository-wide
contribution commands and architecture, return to the
[repository README](../README.md).
