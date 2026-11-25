# Knowledge-base plugin authoring

Use the [plugin glossary](GLOSSARY.md) for Knowledge, Workflow Skills, Handbook
Skills, and Skill references. This directory is the `knowledge-base` product's
source module. Its isomorphic installable packages live under
`plugins/<plugin-name>/`, anchored by the always-installed base
[knowledge-base plugin](plugins/knowledge-base/). Every package under
`plugins/<plugin-name>/` is a complete installed plugin and must remain usable
without the rest of this source module, a repository checkout, or static links
into another plugin.

At runtime, optional sibling plugins under `plugins/<plugin-name>/` assume the
base `knowledge-base` plugin is installed for shared collaboration
reading-lifecycle behavior, while preserving strict static intra-package link
isolation.

Apply the
[dependency-boundary, domain-model neutrality, product-interface isolation, and one-way delegation rules](../AGENTS.md#repository-architecture)
to `plugins/<plugin-name>/`: keep general-purpose subject guidance, usage
Skills, and shared references inside the owning plugin package free of this
repository's layout, internal domain model, content taxonomy, and organization
policy, and keep dedicated product-interface contracts isolated to installed
workflows whose explicit user-facing task is interacting with this product.
Rules that exist only to define, classify, model, or validate this product's own
internal architecture belong in
[repository-maintenance workflows](../GLOSSARY.md#repository-maintenance-workflow)
under `.agents/`, delegating one-way to general-purpose craft in
[plugins/knowledge-base/](plugins/knowledge-base/).

## Reader understanding

Write Knowledge, Workflow Skills, Handbook Skills, and Skill references for
both humans and Agents with different background knowledge and comprehension
abilities. Assume readers have the subject's stated prerequisites, but have not
participated in authoring and do not know internal terminology. Supply the
context they need using
[Maintained document quality](plugins/knowledge-base/knowledge/documentation/maintained-document-quality.md#design-for-reader-use).
The author's ability to understand a passage does not establish that its readers
can understand or apply it.

Assess whether a change warrants a weak-model or blind probe using
[Verify reader understanding](plugins/knowledge-base/references/agents/reader-understanding.md)
to catch hidden prerequisites, ambiguous boundaries, or trigger confusion before
pull-request review. Low-risk edits skip probing; final suitability and
semantic review happens in pull-request AI review.

## Knowledge

Each plugin's `knowledge/` directory (starting with the base plugin's
[knowledge/](plugins/knowledge-base/knowledge/)) contains canonical Knowledge
organized by domain. A leaf's concrete reading need must follow from the user's
work, subject, or current material before a Workflow Skill makes the decisions
that the understanding informs. Removing every consuming Workflow or Handbook
must not remove that reason to read it.

Keep each plugin's `knowledge/index.md` (such as the base plugin's
[knowledge/index.md](plugins/knowledge-base/knowledge/index.md)) as that
plugin's complete maintenance inventory of Knowledge. List every leaf directly
with its `time-sensitive` or `evergreen` Knowledge Type. Catalog link labels use
plugin-root-relative paths; their targets resolve relative to the catalog file.
Use subdirectories for organization rather than nested catalogs. An optional
Skill-only plugin with no Knowledge leaves (such as
[`utilities`](plugins/utilities/README.md)) may omit `knowledge/` and its
catalog while still passing Skills-directory and isolation validation.

Every leaf must remain reachable from at least one installed Workflow or
Handbook in the same plugin package through direct package-local Markdown links
and eligible packaged references. Runtime traversal stops at Knowledge; Catalog
membership, repository-maintenance content, tests, research, README files,
sibling plugins, and links between Knowledge leaves do not establish an
installed reading route. The required `pnpm knowledge:check` command enforces
this contract across every marketplace-registered plugin.

Each leaf must supply enough context for its independent reading responsibility
and for every complete-file or context-sufficient-section route that selects
it. Do not add `Related Knowledge`, `See also`, or similar leaf indexes. When a
claim actually depends on another leaf, link it inline where the dependency is
applied and state the necessary context there.

## Skills and references

Each plugin's `skills/` directory (such as the base plugin's
[skills/](plugins/knowledge-base/skills/)) owns installed Workflow and Handbook
entrypoints. Keep each entrypoint in an immediate child directory with one
`SKILL.md`, and match the directory name to its frontmatter `name`. The target
model uses `workflow-` and `handbook-` prefixes without custom kind metadata,
aliases, wrapper Skills, or a prefix-kind checker. When an authorized change
renames, replaces, or removes an entrypoint, update every consumer and remove
the obsolete registered name rather than preserving a compatibility route.

A Workflow Skill owns an independently invoked user task's decisions, actions,
failure and stopping behavior, outputs, and completion criteria. Its description
selects that task from the user's requested result. A Workflow may read
canonical Knowledge directly when an execution step requires it and cannot
safely depend on native co-selection of a Handbook.

A Handbook Skill owns required reading for one user task family, technical
domain, or stable platform context. Its description is one short semantic
applicability rule decidable from the user's work or current material; it does
not enumerate internal Knowledge or package branches. Reuse an existing
Handbook when it already owns the reading scene. Add another only for a distinct
task family, technical domain, or stable platform context—never as a narrow
1:1 wrapper for one Knowledge leaf's specific practice. A distinct,
self-contained domain, framework, or platform entry may start sparsely with a
single curated Knowledge leaf (and explicitly non-exhaustive coverage) even when
a broader language or engineering Handbook also co-selects on the same work,
provided that broader Handbook does not itself own that specialized domain
scene. A sparse domain or platform entry must include a valid no-match path for
unrelated work within that domain or platform.

A Handbook may define a foundation required for its primary artifact work and
conditional required-reading packages selected from observable work, material,
language, platform, or task stage. Read the entire foundation when it applies
and every matching package cumulatively. A valid Handbook may have no
foundation when no current Knowledge is common to the family. Give a direct
learning or explanation request about a package's subject its own matching
route, without forcing an unrelated artifact-work foundation. Use complete
canonical files or complete context-sufficient sections as reading units. The
always-installed base plugin's collaboration Handbook and its required
[shared reading lifecycle](plugins/knowledge-base/references/agents/independent-collaboration.md#keep-guidance-current)
own reuse, rereading, and reassessment as work or context changes. Keep that
policy at its shared owner rather than copying it into each subject Handbook
(including in optional sibling plugins), and verify its independent selection
and application alongside them.

Resolve packaged links relative to each Skill's `SKILL.md`. Handbooks and
Workflows read canonical packaged files directly; a Handbook must not invoke,
depend on, or hide a required route through another Handbook. Treat packaged
guidance as supplemental to instructions, requirements, Skills, and domain
decisions in the Agent's active working directory.

Each plugin's `references/` directory (such as the base plugin's
[references/](plugins/knowledge-base/references/)) holds non-indexed supporting
material shared by that plugin's Skills, including references also read one-way
by repository-maintenance workflows. Keep a reference used by only one Skill
inside that Skill's own `references/` directory. Select each reference at the
Skill step that needs it; reuse does not turn step-selected material into
Knowledge.

## Agent document size limits

Every installed Skill entrypoint (`plugins/<plugin-name>/skills/<skill-name>/SKILL.md`)
must stay at or below `8,000` UTF-8 bytes, and every Knowledge leaf and Skill
reference (`plugins/<plugin-name>/knowledge/**/*.md`,
`plugins/<plugin-name>/references/**/*.md`, and non-entrypoint
`plugins/<plugin-name>/skills/**/*.md`) must stay at or below `20,480` UTF-8
bytes. `pnpm agent-doc-size:check` (included in `pnpm check`) enforces these
ceilings; see [Agent document size limits](../AGENTS.md#agent-document-size-limits)
for the repository-wide scope (including repository-maintenance workflows and
references).

When a document approaches or exceeds its ceiling, keep `SKILL.md` concise via
progressive disclosure into Skill-local references, and tighten or split
oversized Knowledge by independent reader responsibility rather than dropping
rules or edge cases. See
[Client document size limits for AI agents](plugins/knowledge-base/knowledge/agents/client-document-size-limits.md)
for the client read and truncation limits behind these thresholds.

## Development support

[lib/](lib/) contains source-only modules consumed through imports.
[tools/](tools/) contains executable development and release entrypoints. Tools
may import libraries, while libraries must not depend on tools. Repository
automation may import libraries or call tools. These source-only facilities may
inspect canonical plugin content, but files under `plugins/<plugin-name>/` must
not depend on them.
