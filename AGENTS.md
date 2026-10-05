# Repository conventions

## Agent skills

Engineering specs and tickets use [GitHub Issues](docs/agents/issue-tracker.md)
and the [five-role triage vocabulary](docs/agents/triage-labels.md).
Before design or implementation, follow the
[domain-document instructions](docs/agents/domain.md) and select the applicable
context from the [glossary map](GLOSSARY-MAP.md).

## Repository architecture

This repository is a marketplace and source monorepo for independent Agent
plugins. Every plugin lives under `plugins/<plugin-name>/`; the repository root
owns shared development tooling, automation, and contributor instructions.
The [knowledge-base plugin](plugins/knowledge-base/README.md) owns its
Knowledge, installed Skills, and supporting references. When authoring or reviewing that
package, read its [authoring rules](plugins/knowledge-base/AGENTS.md).

- Keep each plugin self-contained, with its own manifest, user documentation,
  Skills, references, and runtime implementation. Installed content must not
  depend on repository-root files, development tooling, or sibling plugins.
- Keep plugin-specific development instructions and domain documents inside the
  plugin. Root [docs/](docs/) owns repository-wide development rules and
  architectural decisions. Create plugin glossaries, design documents, and
  ADRs only when there is content to maintain.
- [`.agents/skills/`](.agents/skills/) contains repository-authoring workflows;
  `.agents/references/` holds references shared only by those workflows.
  Authoring workflows may read canonical plugin content from the checkout;
  this does not make that content a dependency of another installed plugin.
- [packages/](packages/) contains repository development libraries, and
  [.github/](.github/) owns repository automation. Share development tooling
  through the [pnpm workspace](pnpm-workspace.yaml); each installed plugin
  must remain usable without that workspace.

Choose a Skill's location by its audience and lifecycle, and keep one
authoritative copy. Put authoring Skills under `.agents/skills/<skill-name>/`
and installed usage Skills under `plugins/<plugin-name>/skills/<skill-name>/`.
A reference used by one Skill belongs in that Skill's `references/` directory.
A reference shared by Skills in the same plugin belongs under that plugin's
`references/<domain>/`. Route directly from the consuming workflow step and do
not create reference indexes. Sharing across plugin packages requires
reconsidering ownership rather than adding a repository-global route.

Knowledge and installed usage Skills must preserve **downstream-project
independence**. They may target a product, platform, protocol, or engineering
domain, but must not require a particular downstream repository, path layout,
domain model, organization policy, or private infrastructure. Generalize
project-derived material only when it remains correct without that project;
otherwise leave it in the source project. Repository-authoring Skills are
outside this user-facing boundary.

A contribution Skill may read its plugin manifest's `repository` field, use
that explicit identity to inspect the canonical source and issue history
remotely, and publish a sanitized issue or confirmed sanitized incremental
comment without a source checkout. Treat the installed plugin as a read-only
runtime artifact. Source modification, Git refs, pull requests, and issue
activity after the publication terminal result are outside that workflow.

Use [maintain-knowledge-base](.agents/skills/maintain-knowledge-base/SKILL.md)
whenever an authorized change adds, corrects, rewrites, splits, merges, moves,
or removes Knowledge, a Skill, a Skill reference, or maintained Agent
instructions and prompts that govern them. It classifies every affected
responsibility before selecting authoring workflows and the smallest coherent
operation.

## Markdown references

Outside `.github/scripts/*/prompts/`, write every prose reference to another
statically known repository file or to a document heading as a Markdown link
whose target is relative to the document that contains it. The link text may
show the repository-root-relative path when that helps the reader, but an
inline-code pathname alone does not satisfy this requirement.

Markdown under `.github/scripts/*/prompts/`, Agentic workflow sources under
`.github/workflows/*.md` except `.github/workflows/README.md`, and shared
Agentic workflow components under `.github/workflows/shared/*.md` are consumed
with the repository root as their path base. Use repository-root-relative
Markdown link targets there, and do not use `..` components. `pnpm links:check`
validates document-relative links outside these prompt sources; `pnpm
prompt-links:check` separately validates their repository-root-relative links
and headings.

A pathname used as a literal command operand, a path pattern, or an entry in a
directory-layout diagram is not a prose reference. A pathname resolved only
after selecting or creating a runtime workspace, including a path inside an
isolated checkout, is not a static reference to the source document's
repository.

## Markdown tests

Tests that inspect Markdown documents must use the repository's existing
Markdown parser and assert against the parsed structure. Treat Markdown source
text only as parser input; do not infer Markdown structure by matching,
splitting, or replacing raw text.

## Skill change evidence

A pull request that adds a Skill or materially changes Skill behavior must
include the design and behavioral evidence required by
[Agent Skill authoring](plugins/knowledge-base/references/agents/skill-authoring.md). Put that concise
evidence summary in the pull-request description so a reviewer can evaluate the
task model, research, responsibility boundaries, and observed behavior
independently. When authoring stops before a pull request exists, preserve the
same summary in the handoff. Keep lasting rules and subject understanding in
their authoritative Skill, Knowledge, or reference rather than adding a
document that records design history. A mechanical-only change may use reduced
evidence only when its summary explains why behavior is unchanged.

## Plugin compatibility

Target Codex and GitHub Copilot. Claude Code compatibility is out of scope.

Keep the single marketplace at
[`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json). This
legacy-compatible path is a compatibility bridge accepted by both target
clients; it is neither client's native marketplace format and is not part of
Agent Plugins v1.

Package every plugin as an Agent Plugins v1.0.0 directory with its own
`plugin.json`. Put portable behavior in its `skills/` and, when needed, an
`mcp.json` at the plugin root. Keep client-specific components outside the
portable core. Match each marketplace entry's name, plugin manifest name, and
plugin directory name. Keep the marketplace name `knowledge-base` and its
existing `knowledge-base` plugin identity stable.

The [marketplace](.claude-plugin/marketplace.json) selects the
[knowledge-base manifest](plugins/knowledge-base/plugin.json) through
`./plugins/knowledge-base`. Relative links inside installed Skills resolve
from their own `SKILL.md`, independently of the repository checkout location.

## Authoritative sources

- [OpenAI: local marketplace discovery](https://developers.openai.com/plugins/build/plugins#how-local-marketplaces-work)
- [GitHub: Copilot CLI plugin and marketplace reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)
- [Agent Plugins v1 specification](https://agent-plugins.org/specification)
- [Agent Plugins compatible clients](https://agent-plugins.org/compatible-clients)
