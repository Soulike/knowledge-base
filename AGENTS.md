# Repository conventions

## Agent skills

Engineering specs and tickets use [GitHub Issues](docs/agents/issue-tracker.md)
and the [five-role triage vocabulary](docs/agents/triage-labels.md).
Before design or implementation, follow the
[domain-document instructions](docs/agents/domain.md) and select the applicable
context from the [glossary map](GLOSSARY-MAP.md).

## Repository architecture

This repository is a marketplace and source monorepo centered on the
`knowledge-base` product. Its [source module](knowledge-base/README.md) owns
all installable isomorphic plugins under `knowledge-base/plugins/<plugin-name>/`
(including the always-installed base
[knowledge-base plugin](knowledge-base/plugins/knowledge-base/README.md) and
optional domain or client plugins), alongside product-specific development
tooling, libraries, and domain documents. The repository root owns shared
automation, marketplace metadata, and contributor instructions. When authoring
or reviewing Knowledge plugins, read the
[authoring rules](knowledge-base/AGENTS.md).

- Keep each marketplace-selected plugin package self-contained, with its own
  manifest, user documentation, Knowledge Catalog, Skills, references, and
  runtime implementation. Installed content must not depend on its source
  module's development tooling, repository-root files, or static links into
  sibling plugins.
- Designate `knowledge-base` (`knowledge-base/plugins/knowledge-base/`) as the
  always-installed base plugin owning `handbook-collaboration` and shared
  reading-lifecycle rules. Optional sibling plugins assume the base plugin is
  installed at runtime without duplicating those lifecycle rules locally or
  adding static cross-plugin links.
- Keep product-specific development instructions, domain documents, tooling,
  and libraries in the owning source module beside `knowledge-base/plugins/`.
  Root [docs/](docs/) owns repository-wide development rules and architectural
  decisions. Create plugin-specific glossaries, design documents, and ADRs only
  when there is content to maintain.
- [`.agents/skills/`](.agents/skills/) contains
  [repository-maintenance workflows](GLOSSARY.md#repository-maintenance-workflow);
  `.agents/references/` holds references shared only by those workflows.
  Maintenance workflows may read canonical plugin content from the checkout;
  this does not make that content a dependency of another installed plugin.
- [.github/](.github/) owns repository-wide automation. Product-specific
  tooling and libraries live in their source module and are shared with root
  automation through the [pnpm workspace](pnpm-workspace.yaml); each installed
  plugin must remain usable without that workspace.

Choose a workflow or Skill's location by its **dependency boundary**, and keep
one authoritative copy. Any guidance, judgment criterion, or workflow that
remains valid independently of this repository's layout, catalog, versioning,
CI gates, and this product's own internal domain model, content taxonomy, and
organization policy belongs in `knowledge-base/plugins/<plugin-name>/` (using
the base [knowledge-base plugin](knowledge-base/plugins/knowledge-base/) for
general-purpose cross-domain guidance) under its `skills/<skill-name>/` or
`references/` directory—including when it originates while maintaining this
repository. Only repository-coupled rules, maintenance orchestration, and rules
that exist only to define, classify, model, or validate this product's own
internal architecture belong in `.agents/`: put repository-maintenance workflows
under `.agents/skills/<skill-name>/`, and put their repository- and
product-specific references in each workflow's `references/` directory or
`.agents/references/` when shared across those workflows.

Repository-maintenance workflows and their references delegate **one-way** to
`knowledge-base/plugins/knowledge-base/` (or the owning plugin under
`knowledge-base/plugins/`) without restating, paraphrasing, splitting, or
locally overriding general-purpose guidance, quality rules, or evaluation
procedures owned there. Within any plugin package, a reference used by one Skill
belongs in that Skill's `references/` directory, and a reference shared by
Skills in the same plugin belongs under that plugin's `references/<domain>/`.
Route directly from the consuming Skill step and do not create reference
indexes. Sharing across plugin packages requires reconsidering ownership rather
than adding a repository-global route.

General-purpose installed plugin content—installed subject guidance, usage
Skills, and shared references—must preserve symmetric **downstream-project
independence** and **domain-model neutrality**. It may target a product,
platform, protocol, or engineering domain, but must not require a particular
downstream repository, path layout, domain model, organization policy, or
private infrastructure—and, symmetrically, must remain valid independently of
this product's own internal domain model, content taxonomy, and organization
policy. Generalize project-derived material only when it remains correct
without that project; otherwise leave it in the source project.

Only installed workflows whose explicit user-facing task is interacting with
this product (such as contributing to it) and their dedicated
product-interface contracts may rely on this product's internal model;
general-purpose installed Skills and shared references must not depend on,
assume, or route to those product-interface contracts.

A contribution Skill may read its plugin manifest's `repository` field, use
that explicit identity to inspect the canonical source and issue history
remotely, and publish a sanitized issue or confirmed sanitized incremental
comment without a source checkout. Treat the installed plugin as a read-only
runtime artifact. Source modification, Git refs, pull requests, and issue
activity after the publication terminal result are outside that workflow.

Use [maintain-knowledge-base](.agents/skills/maintain-knowledge-base/SKILL.md)
when assessing a contribution's classification, ownership, or placement, and
whenever an authorized change adds, corrects, rewrites, splits, merges, moves,
or removes Knowledge, a Workflow Skill, a Handbook Skill, a Skill reference, or
maintained Agent instructions and prompts that govern them. It classifies every
affected responsibility before selecting repository-maintenance workflows and
the smallest coherent operation; assessment alone does not authorize edits.

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

## Behavioral and documentation change evidence

A pull request or handoff that adds or substantively revises maintained
Knowledge, Workflow Skills, Handbook Skills, Skill references, or maintained
Agent instructions or prompts must include a concise, directly reviewable
evidence summary in the pull-request description (or in the handoff when
authoring stops before a pull request exists). Ordinary engineering code,
tooling, or CI implementation pull requests are excluded from this
behavioral-prose evidence requirement.

Assemble the unmodified observations produced by the applicable authorities
without collapsing them into topic-only notes or aggregate pass claims:

- **Skills:** include the evidence required by
  [Prepare pull-request and handoff evidence](knowledge-base/plugins/knowledge-base/references/agents/skill-authoring.md#prepare-pull-request-and-handoff-evidence)
  and, for Knowledge-plugin Workflow and Handbook Skills,
  [Prove Handbook and Workflow behavior](.agents/skills/maintain-knowledge-base/references/maintain-skill.md#prove-handbook-and-workflow-behavior).
- **Reader understanding:** for Knowledge-plugin Knowledge, Skills, and Skill
  references requiring cross-model verification, preserve the
  [required reader-understanding evidence](knowledge-base/plugins/knowledge-base/references/agents/reader-understanding.md#required-evidence).
- **Other maintained instructions and prompts:** for semantic or structural
  changes, include affected responsibilities, final-content suitability and
  independent review conclusions, and remaining limitations.

Top-level repository maintenance
([maintain-knowledge-base](.agents/skills/maintain-knowledge-base/SKILL.md))
assembles these unmodified observations into the pull-request description so a
reviewer can evaluate responsibility boundaries, reader comprehension, and
observed behavior independently. Concision may remove raw transcripts and
repeated procedure, but not required identities, configuration, comparison
basis, observations, attempt outcomes, or limitations. Keep lasting rules and
subject understanding in their authoritative Knowledge, Skill, or reference
rather than adding a document that records design history. A purely mechanical
edit may use reduced evidence only when its summary confirms that meaning,
structure, and required reader actions are unchanged.

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
portable core. Match each marketplace entry's name with its plugin manifest
name. Keep the marketplace name `knowledge-base` and its existing
`knowledge-base` plugin identity stable.

The [marketplace](.claude-plugin/marketplace.json) selects the base
[knowledge-base manifest](knowledge-base/plugins/knowledge-base/plugin.json)
through `./knowledge-base/plugins/knowledge-base`, alongside any optional
sibling plugins under `./knowledge-base/plugins/<plugin-name>`. Relative links
inside installed Skills resolve from their own `SKILL.md`, independently of the
repository checkout location.

## Authoritative sources

- [OpenAI: local marketplace discovery](https://developers.openai.com/plugins/build/plugins#how-local-marketplaces-work)
- [GitHub: Copilot CLI plugin and marketplace reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference)
- [Agent Plugins v1 specification](https://agent-plugins.org/specification)
- [Agent Plugins compatible clients](https://agent-plugins.org/compatible-clients)
