# knowledge-base

A personal marketplace and source monorepo for independent Codex and GitHub
Copilot CLI plugins. Each plugin owns its installed content and documentation;
the repository provides shared development tooling and automation.

## Available plugins

| Plugin                                             | Purpose                                                                             |
| -------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [knowledge-base](plugins/knowledge-base/README.md) | Curated Knowledge and Agent workflows that discover and apply it during real tasks. |

See the plugin's [installation and usage guide](plugins/knowledge-base/README.md#install-with-codex)
for Codex and GitHub Copilot CLI. The marketplace and plugin selector remain
`knowledge-base` and `knowledge-base@knowledge-base`.

## Repository layout

- [plugins/](plugins/) contains self-contained plugin packages, each with its
  own manifest, README, Skills, references, and any runtime implementation.
- [docs/](docs/) contains repository-wide contributor instructions and
  architectural decisions. Plugin-specific documentation stays in its package.
- [.agents/](.agents/) contains repository-authoring Skills and their references.
- [packages/](packages/) and [.github/](.github/) contain development libraries,
  checks, and automation.
- [.claude-plugin/marketplace.json](.claude-plugin/marketplace.json) is the shared
  marketplace consumed by both supported clients.

Domain vocabulary and decision ownership are routed through the
[glossary map](GLOSSARY-MAP.md). Repository rules and plugin boundaries live in
[AGENTS.md](AGENTS.md).

## Contribute

To propose a Knowledge or Skill contribution from an installed plugin, use
[contribute-to-knowledge-base](plugins/knowledge-base/skills/contribute-to-knowledge-base/SKILL.md).
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
