# codex

An optional Codex platform plugin in the `knowledge-base` marketplace. It
provides curated Codex Knowledge together with the Codex Handbook and
Codex-specific Agent Workflow Skills.

Keep the base `knowledge-base` plugin installed alongside this plugin so the
collaboration Handbook continues to supply general collaboration principles,
shared reading lifecycle, and informed cooperation across tasks. Packaged
guidance is supplemental: instructions, requirements, context, and Skills in
the Agent's active working directory take precedence when they conflict.

## What is included

- **Knowledge** in [knowledge/](knowledge/), inventoried by the
  [Knowledge catalog](knowledge/index.md).
- **Handbook Skill**: [`handbook-codex`](skills/handbook-codex/SKILL.md)
  routes curated Codex configuration and troubleshooting Knowledge when
  applicable.
- **Workflow Skills**:
  - [`workflow-resolve-invoked-codex-skill`](skills/workflow-resolve-invoked-codex-skill/SKILL.md)
    resolves an invoked or required Skill against documented Codex Skill
    sources before reporting it unavailable.
  - [`workflow-wait-for-user-answer`](skills/workflow-wait-for-user-answer/SKILL.md)
    keeps dependent work pending in Codex until the user answers a question or
    explicitly authorizes a fallback.

## Install with Codex

Add the marketplace, then install the base `knowledge-base` plugin and this
optional `codex` plugin:

```bash
codex plugin marketplace add Soulike/knowledge-base
codex plugin add knowledge-base@knowledge-base
codex plugin add codex@knowledge-base
```

To update an existing installation, refresh the marketplace snapshot:

```bash
codex plugin marketplace upgrade knowledge-base
```

If the current Codex session does not discover newly installed or updated
Skills, start a new session.

## Use this plugin

Describe your Codex task normally so Codex selects the applicable Handbook or
Workflow Skill from its description, or ask explicitly:

- “Use the Codex Handbook while configuring Codex for GitHub Copilot Enterprise.”

## Browse the contents

Browse the [Knowledge catalog](knowledge/index.md) or the [Skills directory](skills/).

## Contribute

Use the base `knowledge-base` plugin's contribution workflow or follow the
contributor instructions in the
[source repository](https://github.com/Soulike/knowledge-base).

## Compatibility

This plugin targets Codex and uses the Agent Plugins v1 format. It is a
personal, curated collection rather than official OpenAI or GitHub
documentation. Follow the active project's requirements and verify current
upstream behavior when it can change over time.

## License

[MIT](LICENSE)
