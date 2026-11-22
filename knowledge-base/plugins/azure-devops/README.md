# azure-devops

An optional Azure DevOps plugin from the `knowledge-base` marketplace for
Codex and GitHub Copilot CLI. It packages curated Azure DevOps Knowledge
together with [`handbook-azure-devops`](skills/handbook-azure-devops/SKILL.md)
to select required reading when working in Azure DevOps or understanding Azure
DevOps behavior.

Keep the `knowledge-base` base plugin (`knowledge-base@knowledge-base`)
installed alongside this plugin for shared collaboration and reading-lifecycle
principles. Packaged guidance is supplemental: instructions, requirements,
context, and Skills in the Agent's active working directory take precedence when
they conflict.

## How it works

- **Knowledge** records curated Azure DevOps understanding with a reading
  reason independent of any Skill. The [Knowledge catalog](knowledge/index.md)
  is this plugin's complete file-and-type maintenance inventory.
- **Handbook Skill**
  ([`handbook-azure-devops`](skills/handbook-azure-devops/SKILL.md)) selects
  matching Azure DevOps reading packages from observable work without inventing
  guidance or implying exhaustive coverage.

This directory is the complete `azure-devops` plugin. Its Knowledge lives in
[knowledge/](knowledge/), and its installed Skill lives in [skills/](skills/).

## Install with Codex

Add the marketplace if needed, then install the plugin alongside
`knowledge-base@knowledge-base`:

```bash
codex plugin marketplace add Soulike/knowledge-base
codex plugin add azure-devops@knowledge-base
```

To update an existing installation, refresh the marketplace snapshot:

```bash
codex plugin marketplace upgrade knowledge-base
```

## Install with GitHub Copilot CLI

Add the marketplace if needed, then install the plugin alongside
`knowledge-base@knowledge-base`:

```bash
copilot plugin marketplace add Soulike/knowledge-base
copilot plugin marketplace browse knowledge-base
copilot plugin install azure-devops@knowledge-base
```

To update an existing installation:

```bash
copilot plugin marketplace update knowledge-base
copilot plugin update azure-devops@knowledge-base
```

If the current Agent session does not discover newly installed or updated
Skills, start a new session.

## Browse the contents

Browse the [Knowledge catalog](knowledge/index.md) or the
[Skills directory](skills/).

## Compatibility

This plugin targets Codex and GitHub Copilot CLI and uses the Agent Plugins v1
format. Claude Code compatibility is outside its scope.

This is a personal, curated collection rather than official Microsoft or Azure
DevOps documentation. Follow the active project's requirements and verify current
upstream behavior when it can change over time.

## License

[MIT](LICENSE)
