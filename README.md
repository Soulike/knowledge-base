# knowledge-base

A personal marketplace centered on the `knowledge-base` plugin, with room for
independent auxiliary plugins. The repository provides shared development
tooling and automation while each installed plugin remains self-contained.

## Available plugins

| Plugin                                            | Purpose                                                                             |
| ------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [knowledge-base](knowledge-base/plugin/README.md) | Curated Knowledge and Agent workflows that discover and apply it during real tasks. |

See the plugin's [installation and usage guide](knowledge-base/plugin/README.md#install-with-codex)
for Codex and GitHub Copilot CLI. The marketplace and plugin selector remain
`knowledge-base` and `knowledge-base@knowledge-base`.

## Repository layout

- [knowledge-base/](knowledge-base/) is the primary product source module. Its
  `plugin/` directory is the installable package; its tooling, libraries, and
  domain documents stay beside that package under the same product owner.
- [plugins/](plugins/) contains independent auxiliary plugin packages.
- [docs/](docs/) contains repository-wide contributor instructions and
  architectural decisions. Plugin-specific documentation stays with its owner.
- [.agents/](.agents/) contains repository-authoring Skills and their references.
- [.github/](.github/) contains repository-wide checks and automation.
- [.claude-plugin/marketplace.json](.claude-plugin/marketplace.json) is the shared
  marketplace consumed by both supported clients.

Domain vocabulary and decision ownership are routed through the
[glossary map](GLOSSARY-MAP.md). Repository rules and package boundaries live in
[AGENTS.md](AGENTS.md).

## Contribute

To propose a Knowledge or Skill contribution from the installed primary plugin,
use
[contribute-to-knowledge-base](knowledge-base/plugin/skills/contribute-to-knowledge-base/SKILL.md).
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
