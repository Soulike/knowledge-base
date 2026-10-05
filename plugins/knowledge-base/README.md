# knowledge-base

A personal, curated knowledge base for Codex and GitHub Copilot CLI. It combines reusable Knowledge with Agent Skills that discover, apply, and maintain that Knowledge during real tasks.

Install the `knowledge-base` plugin and work normally. Its catalog Skill checks which Knowledge may apply, then reads only the matching documents. Knowledge from this repository is supplemental: instructions, requirements, context, and Skills in the Agent's active working directory take precedence when they conflict.

## How it works

- **Knowledge** records understanding with a reading reason independent of any workflow. [`knowledge/index.md`](knowledge/index.md) is its only routing catalog.
- **Skills** tell an Agent when and how to perform a task.
- **Skill references** support particular workflow steps. Shared references live in a package-level `references/` directory and are routed directly by their consuming Skills rather than by the Knowledge catalog.

User-facing Knowledge and Skills are independent of any particular downstream project. They may target a general product, platform, protocol, or engineering domain, while discovering project-specific structure and requirements from the Agent's active working directory.

This directory is the complete `knowledge-base` plugin. Its Knowledge lives in
[knowledge/](knowledge/), shared workflow references in
[references/](references/), and installed Agent workflows in [skills/](skills/).

## Install with Codex

Add the marketplace, then install the plugin:

```bash
codex plugin marketplace add Soulike/knowledge-base
codex plugin add knowledge-base@knowledge-base
```

To update an existing installation, refresh the marketplace snapshot:

```bash
codex plugin marketplace upgrade knowledge-base
```

## Install with GitHub Copilot CLI

Add the marketplace, browse its plugins, then install the plugin:

```bash
copilot plugin marketplace add Soulike/knowledge-base
copilot plugin marketplace browse knowledge-base
copilot plugin install knowledge-base@knowledge-base
```

To update an existing installation:

```bash
copilot plugin marketplace update knowledge-base
copilot plugin update knowledge-base@knowledge-base
```

If the current Agent session does not discover newly installed or updated Skills, start a new session.

## Use the knowledge base

No special command or repository path is required in normal use. Describe the task to the Agent as usual; [`load-knowledge-catalog`](skills/load-knowledge-catalog/SKILL.md) checks the catalog at the beginning of the task and routes the Agent to relevant Knowledge.

You can also ask explicitly when you want to inspect or control that process:

- “Load the Knowledge catalog and tell me which entries apply to this task.”
- “Use the knowledge base while configuring Codex for GitHub Copilot Enterprise.”
- “Contribute this correction to the knowledge base.”

## Browse the contents

Browse the [Knowledge catalog](knowledge/index.md) or the complete [Skills directory](skills/).

## Contribute

The easiest route is to ask an Agent to submit a contribution proposal. The installed [`contribute-to-knowledge-base`](skills/contribute-to-knowledge-base/SKILL.md) Skill locates the canonical repository, removes source-project and sensitive details, and publishes a triage-ready issue for maintainers.

For source development, follow the contributor instructions in the
[source repository](https://github.com/Soulike/knowledge-base). Plugin-specific
content rules live in [AGENTS.md](AGENTS.md), with terminology in
[GLOSSARY.md](GLOSSARY.md).

## Compatibility

The repository targets Codex and GitHub Copilot CLI and packages plugins using the Agent Plugins v1 format. Claude Code compatibility is outside its scope.

This is a personal, curated collection rather than official OpenAI, GitHub, or third-party product documentation. Follow the active project's requirements and verify current upstream behavior when it can change over time.

## License

[MIT](LICENSE)
