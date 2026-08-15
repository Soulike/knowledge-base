# knowledge-base

A personal collection of reusable knowledge and Agent workflows, distributed
as plugins for Codex and GitHub Copilot CLI.

The repository root is the primary `knowledge-base` plugin. Canonical static
content lives in `knowledge/`, while `skills/` provides Agent-facing retrieval
and workflow entry points. Independent, self-contained plugins may also live in
`plugins/`.

## Install with Codex

Add the marketplace, then install the primary plugin:

```bash
codex plugin marketplace add Soulike/knowledge-base
codex plugin add knowledge-base@knowledge-base
```

## Install with GitHub Copilot CLI

Add the marketplace, browse its plugins, then install the primary plugin:

```bash
copilot plugin marketplace add Soulike/knowledge-base
copilot plugin marketplace browse knowledge-base
copilot plugin install knowledge-base@knowledge-base
```

## License

[MIT](LICENSE)
