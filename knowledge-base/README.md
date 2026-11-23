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

## Available plugins

| Plugin                                                 | Role            | Selector                          | Purpose                                                                                             |
| ------------------------------------------------------ | --------------- | --------------------------------- | --------------------------------------------------------------------------------------------------- |
| [knowledge-base](plugins/knowledge-base/README.md)     | Base plugin     | `knowledge-base@knowledge-base`   | Curated Knowledge, collaboration principles, and reusable Agent workflows for general tasks.        |
| [generative-media](plugins/generative-media/README.md) | Optional plugin | `generative-media@knowledge-base` | People-focused still-image and continuous-shot design Knowledge, prompting guidance, and workflows. |
| [chromium](plugins/chromium/README.md)                 | Optional plugin | `chromium@knowledge-base`         | Curated Chromium architecture Knowledge and Handbook guidance.                                      |
| [azure-devops](plugins/azure-devops/README.md)         | Optional plugin | `azure-devops@knowledge-base`     | Curated Azure DevOps Knowledge and Handbook guidance.                                               |
| [codex](plugins/codex/README.md)                       | Optional plugin | `codex@knowledge-base`            | Curated Codex platform Knowledge, Handbook guidance, and Codex-specific workflows.                  |
| [utilities](plugins/utilities/README.md)               | Optional plugin | `utilities@knowledge-base`        | Optional Skill-only utility Agent workflows, including local proxy fallback.                        |

For installation and use, start with the
[base plugin guide](plugins/knowledge-base/README.md) (`knowledge-base@knowledge-base`)
and install any needed optional plugins alongside it using their READMEs. For
repository-wide contribution commands and architecture, return to the
[repository README](../README.md).
