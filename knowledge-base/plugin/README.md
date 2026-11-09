# knowledge-base

A personal, curated knowledge base for Codex and GitHub Copilot CLI. It combines
reusable Knowledge with Agent Skills that execute user tasks or route the
understanding those tasks require.

Install the `knowledge-base` plugin and work normally. Workflow Skills own
complete user tasks, while Handbook Skills select required reading for a task
family, technical domain, or platform context. The collaboration Handbook
supplies principles for independent judgment and informed cooperation on every
task. Packaged guidance is supplemental: instructions, requirements, context,
and Skills in the Agent's active working directory take precedence when they
conflict.

## How it works

- **Knowledge** records understanding with a reading reason independent of any
  Workflow or Handbook. The [Knowledge catalog](knowledge/index.md) is the
  complete file-and-type maintenance inventory; installed Skills own runtime
  reading routes.
- **Workflow Skills** tell an Agent when and how to perform a task.
- **Handbook Skills** select required Knowledge and references for a coherent task family, technical domain, or platform context without taking over the task procedure.
- **Skill references** support particular workflow steps. Shared references live in a package-level `references/` directory and are routed directly by their consuming Skills rather than by the Knowledge catalog.

User-facing Knowledge and Skills are independent of any particular downstream project. They may target a general product, platform, protocol, or engineering domain, while discovering project-specific structure and requirements from the Agent's active working directory.

This directory is the complete `knowledge-base` plugin. Its Knowledge lives in
[knowledge/](knowledge/), shared Skill references in
[references/](references/), and installed Agent Skills in [skills/](skills/).

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

No special command or repository path is required in normal use. Describe the
task to the Agent as usual. The Agent selects Workflow and Handbook Skills from
their descriptions. [`handbook-collaboration`](skills/handbook-collaboration/SKILL.md)
applies to every task, while other Handbooks add required reading for the work
described by their semantic applicability rules. Workflows may also read
canonical Knowledge directly when an execution step requires it. Installation
alone does not guarantee that a client loads every applicable entrypoint.

You can also ask explicitly when you want to inspect or control that process:

- “Use the collaboration Handbook before working on this task.”
- “Use the software engineering Handbook while restructuring this module.”
- “Use the knowledge base while configuring Codex for GitHub Copilot Enterprise.”
- “Contribute this correction to the knowledge base.”

## Browse the contents

Browse the [Knowledge catalog](knowledge/index.md) or the complete [Skills directory](skills/).

## Contribute

The easiest route is to ask an Agent to submit a contribution proposal. The installed [`workflow-contribute-to-knowledge-base`](skills/workflow-contribute-to-knowledge-base/SKILL.md) Skill locates the canonical repository, removes source-project and sensitive details, and publishes a triage-ready issue for maintainers.

For source development, follow the contributor instructions in the
[source repository](https://github.com/Soulike/knowledge-base). The repository
routes maintainers to the product's authoring rules and domain vocabulary.

## Compatibility

The plugin targets Codex and GitHub Copilot CLI and uses the Agent Plugins v1
format. Claude Code compatibility is outside its scope.

This is a personal, curated collection rather than official OpenAI, GitHub, or third-party product documentation. Follow the active project's requirements and verify current upstream behavior when it can change over time.

## License

[MIT](LICENSE)
