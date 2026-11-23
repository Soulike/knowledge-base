# utilities

An optional Skill-only utility plugin in the `knowledge-base` marketplace for
Codex and GitHub Copilot CLI. It ships operational utility Agent Workflow Skills
without a `knowledge/` directory or Knowledge Catalog.

Keep the always-installed `knowledge-base` base plugin
(`knowledge-base@knowledge-base`) installed alongside this plugin at runtime so
its collaboration Handbook continues to supply general collaboration principles,
shared reading-lifecycle rules, and informed cooperation across tasks. Packaged
guidance is supplemental: instructions, requirements, context, and Skills in
the Agent's active working directory take precedence when they conflict.

## What is included

- **Workflow Skill**:
  [`workflow-retry-via-local-proxy`](skills/workflow-retry-via-local-proxy/SKILL.md)
  retries a proxy-capable request through a detected local proxy after an
  eligible direct connection, DNS, timeout, TLS, or HTTP 403 failure (limiting
  HTTP(S) Git clones to timeout failures), with replay-safety checks.

## Install with Codex

Add the marketplace (if not already added), then install both the base
`knowledge-base` plugin and this optional `utilities` plugin:

```bash
codex plugin marketplace add Soulike/knowledge-base
codex plugin add knowledge-base@knowledge-base
codex plugin add utilities@knowledge-base
```

To update an existing installation, refresh the marketplace snapshot:

```bash
codex plugin marketplace upgrade knowledge-base
```

## Install with GitHub Copilot CLI

Add the marketplace (if not already added), browse its plugins, then install
both the base `knowledge-base` plugin and `utilities`:

```bash
copilot plugin marketplace add Soulike/knowledge-base
copilot plugin marketplace browse knowledge-base
copilot plugin install knowledge-base@knowledge-base
copilot plugin install utilities@knowledge-base
```

To update an existing installation:

```bash
copilot plugin marketplace update knowledge-base
copilot plugin update utilities@knowledge-base
```

If the current Agent session does not discover newly installed or updated
Skills, start a new session.

## Browse and contribute

Browse the [Skills directory](skills/). Because `utilities` is a Skill-only
plugin, it has no `knowledge/` directory or Knowledge Catalog.

For source development or contribution proposals, use the base
`knowledge-base` plugin's contribution workflow or visit the
[source repository](https://github.com/Soulike/knowledge-base).

## Compatibility

This plugin targets Codex and GitHub Copilot CLI using the Agent Plugins v1
format. Claude Code compatibility is outside its scope.

## License

[MIT](LICENSE)
