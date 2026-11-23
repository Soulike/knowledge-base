# knowledge-base

A personal marketplace for the `knowledge-base` Knowledge plugin collection.
The repository provides shared development tooling and automation while each
installed plugin remains self-contained.

## Available plugins

| Plugin                                                                | Role            | Selector                          | Purpose                                                                                             |
| --------------------------------------------------------------------- | --------------- | --------------------------------- | --------------------------------------------------------------------------------------------------- |
| [knowledge-base](knowledge-base/plugins/knowledge-base/README.md)     | Base plugin     | `knowledge-base@knowledge-base`   | Curated Knowledge, collaboration principles, and reusable Agent workflows for general tasks.        |
| [generative-media](knowledge-base/plugins/generative-media/README.md) | Optional plugin | `generative-media@knowledge-base` | People-focused still-image and continuous-shot design Knowledge, prompting guidance, and workflows. |
| [chromium](knowledge-base/plugins/chromium/README.md)                 | Optional plugin | `chromium@knowledge-base`         | Curated Chromium architecture Knowledge and Handbook guidance.                                      |
| [azure-devops](knowledge-base/plugins/azure-devops/README.md)         | Optional plugin | `azure-devops@knowledge-base`     | Curated Azure DevOps Knowledge and Handbook guidance.                                               |
| [codex](knowledge-base/plugins/codex/README.md)                       | Optional plugin | `codex@knowledge-base`            | Curated Codex platform Knowledge, Handbook guidance, and Codex-specific workflows.                  |
| [utilities](knowledge-base/plugins/utilities/README.md)               | Optional plugin | `utilities@knowledge-base`        | Optional Skill-only utility Agent workflows, including local proxy fallback.                        |

Keep the base `knowledge-base@knowledge-base` plugin installed alongside any
optional plugins from this marketplace (`<name>@knowledge-base`). See the base
plugin's
[installation and usage guide](knowledge-base/plugins/knowledge-base/README.md#install-with-codex)
for Codex and GitHub Copilot CLI, and each optional plugin's README for its
installation commands and client compatibility (`codex` targets Codex). The
marketplace and base plugin selector remain `knowledge-base` and
`knowledge-base@knowledge-base`.

## Repository layout

- [knowledge-base/](knowledge-base/) is the product source module. Its
  `plugins/<plugin-name>/` directory holds all isomorphic installable packages
  (starting with [knowledge-base](knowledge-base/plugins/knowledge-base/));
  its tooling, libraries, and domain documents stay beside `plugins/` under the
  same product owner.
- [docs/](docs/) contains repository-wide contributor instructions and
  architectural decisions. Plugin-specific documentation stays with its owner.
- [.agents/](.agents/) contains repository-maintenance workflows and their
  references.
- [.github/](.github/) contains repository-wide checks and automation.
- [.claude-plugin/marketplace.json](.claude-plugin/marketplace.json) is the shared
  marketplace consumed by both supported clients.

Domain vocabulary and decision ownership are routed through the
[glossary map](GLOSSARY-MAP.md). Repository rules and package boundaries live in
[AGENTS.md](AGENTS.md).

## Contribute

To propose a Knowledge or Skill contribution from the installed base plugin,
use
[workflow-contribute-to-knowledge-base](knowledge-base/plugins/knowledge-base/skills/workflow-contribute-to-knowledge-base/SKILL.md).
It locates the canonical repository and publishes a sanitized issue for review.

For a source checkout, use Node.js 24 or later and pnpm 11:

```bash
pnpm install --frozen-lockfile
pnpm check
```

Run `pnpm check` before opening a pull request. Use the
[maintenance workflow](.agents/skills/maintain-knowledge-base/SKILL.md) for
Knowledge, Skills, references, and maintained Agent instructions. The
[Agentic GitHub workflows](.github/workflows/README.md) run scheduled content
verification and the required pull-request review.

## Compatibility

The plugins target Codex and GitHub Copilot CLI using Agent Plugins v1
packaging. Claude Code compatibility is outside this repository's scope.

## License

[MIT](LICENSE)
