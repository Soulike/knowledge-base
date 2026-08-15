# knowledge-base

Personal AI knowledge base for reusable skills, workflows, and tools.

The repository uses the Claude Code plugin marketplace format so each knowledge
module can be maintained and installed independently.

## Structure

```text
.
├── .claude-plugin/
│   └── marketplace.json
└── plugins/
    └── <plugin>/
        ├── .claude-plugin/
        │   └── plugin.json
        └── skills/
            └── <skill>/
                └── SKILL.md
```

## Use the marketplace

Add the marketplace in Claude Code:

```text
/plugin marketplace add Soulike/knowledge-base
```

Install a published plugin:

```text
/plugin install <plugin>@knowledge-base
```

Refresh the catalogue:

```text
/plugin marketplace update knowledge-base
```

## Add knowledge

1. Create a plugin under `plugins/` with its manifest and skills.
2. Register it in `.claude-plugin/marketplace.json`.
3. Keep each plugin focused enough to install and evolve independently.

## License

[MIT](LICENSE)
