# 0005: Package plugins as independent monorepo directories

## Status

Accepted.

The repository hosts independently installable Agent plugins. Keeping one
plugin at the repository root made its documentation and content paths overlap
with repository-wide development facilities. Place every plugin under
`plugins/<plugin-name>/`, including `knowledge-base`, so each package owns its
manifest, installed content, user documentation, and domain-specific design.

Keep the marketplace, contributor workflows, CI, and development tooling at
the repository root. Repository-authoring workflows may inspect plugin sources;
installed plugins remain self-contained and cannot depend on sibling packages
or repository-only files. Preserve the marketplace and existing plugin names
while changing the source directory used for installation.

Use the [glossary map](../../GLOSSARY-MAP.md) to route maintenance and plugin
contexts. Root ADRs own repository-wide decisions; plugin-specific decisions
belong within the affected plugin. This trades a one-time path migration for
clear document ownership and independently maintainable plugin packages.
