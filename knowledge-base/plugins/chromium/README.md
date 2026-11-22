# chromium

An optional curated Chromium Knowledge plugin for Codex and GitHub Copilot CLI
from the `knowledge-base` marketplace.

Install this plugin alongside the always-installed `knowledge-base` base plugin
(`knowledge-base@knowledge-base`), which supplies shared collaboration
principles and reading-lifecycle behavior across tasks. Packaged guidance is
supplemental: instructions, requirements, context, and Skills in the Agent's
active working directory take precedence when they conflict.

## Contents

- **Knowledge** in [knowledge/](knowledge/) records curated Chromium
  architecture understanding (currently non-exhaustive), inventoried in the
  [Knowledge catalog](knowledge/index.md).
- **Handbook Skill**
  [`handbook-chromium`](skills/handbook-chromium/SKILL.md) in
  [skills/](skills/) selects required Chromium Knowledge when developing,
  maintaining, reviewing, diagnosing, or understanding Chromium or a
  Chromium-derived browser.

## Install with Codex

Add the marketplace (if not already added), then install both the base
`knowledge-base` plugin and `chromium`:

```bash
codex plugin marketplace add Soulike/knowledge-base
codex plugin add knowledge-base@knowledge-base
codex plugin add chromium@knowledge-base
```

To update an existing installation, refresh the marketplace snapshot:

```bash
codex plugin marketplace upgrade knowledge-base
```

## Install with GitHub Copilot CLI

Add the marketplace (if not already added), browse its plugins, then install
both the base `knowledge-base` plugin and `chromium`:

```bash
copilot plugin marketplace add Soulike/knowledge-base
copilot plugin marketplace browse knowledge-base
copilot plugin install knowledge-base@knowledge-base
copilot plugin install chromium@knowledge-base
```

To update an existing installation:

```bash
copilot plugin marketplace update knowledge-base
copilot plugin update chromium@knowledge-base
```

If the current Agent session does not discover newly installed or updated
Skills, start a new session.

## Compatibility

This plugin targets Codex and GitHub Copilot CLI and uses the Agent Plugins v1
format. Claude Code compatibility is outside its scope.

This is a personal, curated collection rather than official Chromium
documentation. Follow the active project's requirements and verify current
upstream behavior when it can change over time.

For source development and contribution instructions, see the
[source repository](https://github.com/Soulike/knowledge-base).

## License

[MIT](LICENSE)
