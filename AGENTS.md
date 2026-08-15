# Repository conventions

## Plugin compatibility

Target Codex and GitHub Copilot. Claude Code compatibility is out of scope.

Keep the single canonical marketplace at `.claude-plugin/marketplace.json`;
both target clients discover this path. Package every plugin as an Agent
Plugins v1.0.0 directory with a root `plugin.json`. Put portable behavior in
`skills/` and, when needed, a root `mcp.json`. Keep client-specific components
outside the portable core.

Use this minimal layout:

```text
.
├── .claude-plugin/
│   └── marketplace.json
└── plugins/
    └── example-plugin/
        ├── plugin.json
        └── skills/
            └── example-skill/
                └── SKILL.md
```

`.claude-plugin/marketplace.json`:

```json
{
  "name": "knowledge-base",
  "owner": {
    "name": "Soulike"
  },
  "plugins": [
    {
      "name": "example-plugin",
      "source": "./plugins/example-plugin"
    }
  ]
}
```

`plugins/example-plugin/plugin.json`:

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "example-plugin"
}
```

`plugins/example-plugin/skills/example-skill/SKILL.md`:

```markdown
---
name: example-skill
description: Use when the example workflow is requested.
---

Perform the example workflow.
```

Keep the marketplace entry name, plugin manifest name, and plugin directory
name identical.

## Authoritative sources

- [OpenAI: local marketplace discovery](https://developers.openai.com/plugins/build/plugins#how-local-marketplaces-work)
- [GitHub: Copilot CLI plugin and marketplace reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)
- [Agent Plugins v1 specification](https://agent-plugins.org/specification)
- [Agent Plugins compatible clients](https://agent-plugins.org/compatible-clients)
