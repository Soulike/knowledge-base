# generative-media

An optional generative-media plugin from the `knowledge-base` marketplace for
Codex and GitHub Copilot CLI. It bundles curated still-image and continuous-shot
design Knowledge, prompting guidance, shared Skill references, Handbook Skills,
and prompt design/improvement Workflow Skills for people-focused media work.

Install `generative-media` alongside the always-installed `knowledge-base`
base plugin, which provides general collaboration principles and shared reading
lifecycle rules. Packaged guidance is supplemental: instructions,
requirements, context, and Skills in the Agent's active working directory take
precedence when they conflict.

## What is included

- **Knowledge** in [knowledge/](knowledge/) (indexed in the
  [Knowledge catalog](knowledge/index.md)): people-focused still-image,
  photographic, anime-illustration, continuous-shot, photographic-video, and
  anime-animation design alongside natural-language still-image,
  image-to-video, and Gemini App prompting guidance.
- **Skill references** in [references/](references/): execution-target
  clarification, image/source-material prompt contracts, and natural-language
  prompt format rules.
- **Handbook Skills** in [skills/](skills/):
  [`handbook-still-image-creation`](skills/handbook-still-image-creation/SKILL.md)
  and [`handbook-video-creation`](skills/handbook-video-creation/SKILL.md).
- **Workflow Skills** in [skills/](skills/):
  [`workflow-design-image-generation-prompts`](skills/workflow-design-image-generation-prompts/SKILL.md),
  [`workflow-improve-image-generation-prompts`](skills/workflow-improve-image-generation-prompts/SKILL.md),
  [`workflow-design-image-to-video-prompts`](skills/workflow-design-image-to-video-prompts/SKILL.md),
  and
  [`workflow-improve-image-to-video-prompts`](skills/workflow-improve-image-to-video-prompts/SKILL.md).

## Install with Codex

Add the marketplace (if not already added), then install the plugin alongside
`knowledge-base@knowledge-base`:

```bash
codex plugin marketplace add Soulike/knowledge-base
codex plugin add generative-media@knowledge-base
```

To update an existing installation, refresh the marketplace snapshot:

```bash
codex plugin marketplace upgrade knowledge-base
```

## Install with GitHub Copilot CLI

Add the marketplace (if not already added), browse its plugins, then install the
plugin alongside `knowledge-base@knowledge-base`:

```bash
copilot plugin marketplace add Soulike/knowledge-base
copilot plugin marketplace browse knowledge-base
copilot plugin install generative-media@knowledge-base
```

To update an existing installation:

```bash
copilot plugin marketplace update knowledge-base
copilot plugin update generative-media@knowledge-base
```

If the current Agent session does not discover newly installed or updated
Skills, start a new session.

## Browse and contribute

Browse the [Knowledge catalog](knowledge/index.md) or the complete
[Skills directory](skills/).

For source development or contribution proposals, visit the
[source repository](https://github.com/Soulike/knowledge-base).

## Compatibility

The plugin targets Codex and GitHub Copilot CLI and uses the Agent Plugins v1
format. Claude Code compatibility is outside its scope.

This is a personal, curated collection rather than official provider or
third-party product documentation. Follow the active project's requirements and
verify current upstream behavior when it can change over time.

## License

[MIT](LICENSE)
