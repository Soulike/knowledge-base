# 0005: Organize the primary product as a top-level source module

## Status

Accepted.

## Context

The repository root previously served as both the development workspace and the
complete `knowledge-base` plugin. Plugin-specific manifests, user documentation,
domain rules, Knowledge, Skills, and references therefore appeared to be
repository-wide facilities. Adding more plugins would make that ownership
ambiguous.

Putting `knowledge-base` under `plugins/` would create a self-contained package,
but it would also present the repository's primary product as one peer among
auxiliary plugins.

## Decision

Place the primary product source in the top-level `knowledge-base/` directory.
Its `plugin/` child is the self-contained Agent Plugins package selected by the
marketplace. Its product-specific tooling, development libraries, authoring
rules, and domain documents remain beside that package under the same owner.

Keep independent auxiliary plugins under `plugins/<plugin-name>/`. The
asymmetry expresses the repository's product structure while preserving a
separate distribution boundary for every installed plugin.

Keep marketplace metadata, repository-authoring workflows, shared CI, and
repository-wide automation at the repository root. Put installed content and
user documentation in the selected package root. Use the
[glossary map](../../GLOSSARY-MAP.md) to route repository-maintenance and plugin
contexts.

## Consequences

The marketplace selects the primary plugin from `./knowledge-base/plugin`,
while its marketplace name, manifest name, and installation selector remain
unchanged. Product-specific tools and libraries no longer appear to be global,
and the installed package does not include or depend on them. Repository tools
that inspect the primary plugin must resolve its package path explicitly.
Future auxiliary plugins can be added without making knowledge-base-specific
documents appear global or implying that all plugin packages have the same
role.
