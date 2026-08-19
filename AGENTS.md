# Repository conventions

## Repository architecture

The repository root is the primary `knowledge-base` plugin. In this repository,
**knowledge base** means the complete repository and plugin, **Knowledge** means
independently retrievable content under `knowledge/`, **Skill** means an Agent
workflow, and **Skill reference** means supporting content selected by a step in
one or more Skills.

- `knowledge/` contains canonical Knowledge organized by domain. A Knowledge
  leaf must have a concrete reading trigger that follows from the user's task,
  technical subject, or current engineering artifact before an Agent selects
  or enters a workflow. Removing every Skill that uses the leaf must not remove
  that reason to read it. Keep
  `knowledge/index.md` as the only index and list every leaf Knowledge document
  there directly with its `time-sensitive` or `evergreen` Knowledge Type. Use
  subdirectories for organization, not nested indexes. Each leaf must provide
  enough context to serve its root-index `When to Read` condition without
  requiring another leaf as a prerequisite. Keep Knowledge routing in the root
  index rather than adding `Related Knowledge`, `See also`, or similar routing
  appendices to leaves. When a claim genuinely depends on another leaf, link it
  inline at the point where the dependency is applied and state the necessary
  context there.
- `references/` contains non-indexed Skill references shared by multiple root
  plugin Skills, or by root plugin Skills and repository-authoring Skills.
- `.agents/skills/` contains workflows used while authoring and maintaining
  this repository. `.agents/references/` contains references shared only by
  multiple repository-authoring Skills.
- `skills/` contains workflows used after installing the primary plugin. Keep a
  reference used by only one Skill in that Skill's `references/` directory.

A Skill reference is retrieved because an executing workflow reaches the step
that needs it. Reuse by several Skills does not turn it into Knowledge, and a
workflow step rewritten as a `When to Read` condition does not create an
independent reading responsibility. Put a genuinely shared reference at the
smallest common package boundary under `references/<domain>/`; keep routing in
the consuming Skills, link the file directly at the steps that need it, and do
not create a reference index.

Knowledge and installed usage Skills must preserve **downstream-project
independence**. They may target a product, platform, protocol, or engineering
domain, but must not require a particular downstream repository, path layout,
domain model, organization policy, or private infrastructure. Generalize
material extracted from a project only when it remains correct without that
project; otherwise leave it in the source project. Repository-authoring Skills
are outside this user-facing boundary; the narrow contribution exception is
described below.

## Markdown tests

Tests that inspect Markdown documents must use the repository's existing
Markdown parser and assert against the parsed structure. Treat Markdown source
text only as parser input; do not infer Markdown structure by matching,
splitting, or replacing raw text.

## Skill scopes

Choose a Skill's location by its audience and lifecycle, not by its subject.
Keep one authoritative copy of each workflow.

### Repository-authoring Skills

Put repository-authoring Skills in `.agents/skills/<skill-name>/`. They guide
Agents working in a source checkout and may inspect or edit `knowledge/`,
plugin Skills, manifests, indexes, and repository tooling. They are development
instructions, not capabilities exposed by the installed primary plugin.

Use `.agents/skills/add-to-knowledge-base/SKILL.md` whenever new material must
be integrated into this repository. It first classifies the material as
Knowledge, Skill or Skill reference, mixed, or out of scope, then loads only
the applicable authoring workflow.

### Plugin usage Skills

Put primary-plugin usage Skills in `skills/<skill-name>/`. They are portable
Agent-facing entry points that retrieve Knowledge or orchestrate tasks for a
user of the installed plugin. Ordinary usage Skills must remain useful without
a source checkout, Git state, `.agents/`, or repository development tooling.

A contribution Skill may read the primary manifest's `repository` field,
create an isolated checkout of that canonical source repository, and then read
the authoring instructions under `.agents/` in the checkout. Treat the
installed plugin as a read-only runtime artifact; use the cloned repository as
the only authoring target.

Resolve usage-Skill file references relative to the Skill's `SKILL.md`. A root
usage Skill can therefore read the shared index through a path such as
`../../knowledge/index.md`. Prefer progressive disclosure: read the root index,
then only the matching documents. Read shared files directly; do not rely on
Skill-to-Skill invocation as a portable contract.

An independent plugin's `skills/` also contains usage Skills, but those Skills
belong solely to that plugin and follow its package boundary.

Optional independent plugins may live under `plugins/<plugin-name>/`. Each is
a self-contained package: it must not reference the root `knowledge/`, root
`references/`, root `skills/`, or a sibling plugin. Put shared Skill references
for that plugin under its own `references/` directory. A proposed reference
shared across package boundaries requires reconsidering package ownership
rather than introducing a repository-global route.

Use this layout:

```text
.
├── plugin.json
├── .agents/
│   ├── references/
│   └── skills/
│       └── add-to-knowledge-base/
│           ├── SKILL.md
│           └── references/
│               ├── add-knowledge.md
│               └── add-skill.md
├── knowledge/
│   ├── index.md
│   └── chromium/
│       └── ios-ui-architecture.md
├── references/
│   └── agents/
│       └── knowledge-and-skills.md
├── skills/
│   ├── contribute-to-knowledge-base/
│   │   └── SKILL.md
│   └── load-knowledge-catalog/
│       └── SKILL.md
├── plugins/
│   └── example-plugin/
│       ├── plugin.json
│       ├── references/
│       └── skills/
│           └── example-skill/
│               └── SKILL.md
└── .claude-plugin/
    └── marketplace.json
```

## Plugin compatibility

Target Codex and GitHub Copilot. Claude Code compatibility is out of scope.

Keep this repository's single shared marketplace at
`.claude-plugin/marketplace.json`. OpenAI documents this path as
legacy-compatible, and GitHub Copilot CLI includes it among its marketplace
lookup locations. This repository uses it as a compatibility bridge so both
target clients consume one marketplace definition; it is neither client's
native marketplace format and is not part of Agent Plugins v1. Package the root
plugin and every independent plugin as Agent Plugins v1.0.0 directories with a
root `plugin.json`. Put portable behavior in `skills/` and, when needed, a root
`mcp.json`. Keep client-specific components outside the portable core.

`.claude-plugin/marketplace.json`:

```json
{
  "name": "knowledge-base",
  "owner": {
    "name": "Soulike"
  },
  "plugins": [
    {
      "name": "knowledge-base",
      "source": "./"
    },
    {
      "name": "example-plugin",
      "source": "./plugins/example-plugin"
    }
  ]
}
```

Root `plugin.json`:

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "knowledge-base",
  "repository": "https://github.com/Soulike/knowledge-base"
}
```

`plugins/example-plugin/plugin.json`:

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "example-plugin"
}
```

`plugins/example-plugin/skills/example-skill/SKILL.md`:

```markdown
---
name: example-skill
description: Use when the example workflow is requested.
---

Perform the example workflow.
```

Keep the root marketplace entry and root manifest name identical to the
marketplace name: `knowledge-base`. For an independent plugin, keep its
marketplace entry name, manifest name, and directory name identical.

## Authoritative sources

- [OpenAI: local marketplace discovery](https://developers.openai.com/plugins/build/plugins#how-local-marketplaces-work)
- [GitHub: Copilot CLI plugin and marketplace reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)
- [Agent Plugins v1 specification](https://agent-plugins.org/specification)
- [Agent Plugins compatible clients](https://agent-plugins.org/compatible-clients)
