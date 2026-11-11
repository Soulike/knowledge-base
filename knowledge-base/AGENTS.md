# Knowledge-base plugin authoring

Use the [plugin glossary](GLOSSARY.md) for Knowledge, Workflow Skills, Handbook
Skills, and Skill references. This directory is the primary product's source
module. Its [plugin/](plugin/) directory is the complete installed package and
must remain useful without the rest of this source module, a repository
checkout, or another plugin.

## Reader understanding

Write Knowledge, Workflow Skills, Handbook Skills, and Skill references for
both humans and Agents with different background knowledge and comprehension
abilities. Assume readers have the subject's stated prerequisites, but have not
participated in authoring and do not know internal terminology. Supply the
context they need using
[Maintained document quality](plugin/knowledge/documentation/maintained-document-quality.md#design-for-reader-use).
The author's ability to understand a passage does not establish that its readers
can understand or apply it.

Every addition or substantive revision to these artifacts requires the
cross-model reader-understanding check in the
[maintenance workflow](../.agents/skills/maintain-knowledge-base/SKILL.md).
Purely mechanical edits may use simplified validation after confirming that
meaning and structure are unchanged.

## Knowledge

[plugin/knowledge/](plugin/knowledge/) contains canonical Knowledge organized
by domain. A leaf's concrete reading need must follow from the user's work,
subject, or current material before a Workflow Skill makes the decisions that
the understanding informs. Removing every consuming Workflow or Handbook must
not remove that reason to read it.

Keep [plugin/knowledge/index.md](plugin/knowledge/index.md) as the complete
maintenance inventory of Knowledge. List every leaf directly with its
`time-sensitive` or `evergreen` Knowledge Type. Catalog link labels use
plugin-root-relative paths; their targets resolve relative to the catalog file.
Use subdirectories for organization rather than nested catalogs.

Every leaf must remain reachable from at least one installed Workflow or
Handbook through direct package-local Markdown links and eligible packaged
references. Runtime traversal stops at Knowledge; Catalog membership,
repository-authoring content, tests, research, README files, and links between
Knowledge leaves do not establish an installed reading route. The required
`pnpm knowledge:check` command enforces this contract.

Each leaf must supply enough context for its independent reading responsibility
and for every complete-file or context-sufficient-section route that selects
it. Do not add `Related Knowledge`, `See also`, or similar leaf indexes. When a
claim actually depends on another leaf, link it inline where the dependency is
applied and state the necessary context there.

## Skills and references

[plugin/skills/](plugin/skills/) owns installed Workflow and Handbook
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
family, domain, or platform context, not for each Knowledge leaf or narrow
scenario.

A Handbook may define a foundation required for its primary artifact work and
conditional required-reading packages selected from observable work, material,
language, platform, or task stage. Read the entire foundation when it applies
and every matching package cumulatively. A valid Handbook may have no
foundation when no current Knowledge is common to the family. Give a direct
learning or explanation request about a package's subject its own matching
route, without forcing an unrelated artifact-work foundation. Use complete canonical files or complete
context-sufficient sections as reading units. The collaboration Handbook's
required [shared reading lifecycle](plugin/references/agents/independent-collaboration.md#keep-guidance-current)
owns reuse, rereading, and reassessment as work or context changes. Keep that
policy at its shared owner rather than copying it into each subject Handbook;
verify its independent selection and application alongside them.

Resolve packaged links relative to each Skill's `SKILL.md`. Handbooks and
Workflows read canonical packaged files directly; a Handbook must not invoke,
depend on, or hide a required route through another Handbook. Treat packaged
guidance as supplemental to instructions, requirements, Skills, and domain
decisions in the Agent's active working directory.

[plugin/references/](plugin/references/) holds non-indexed supporting material
shared by this plugin's Skills, including references also read by
repository-authoring workflows. Keep a reference used by only one Skill inside
that Skill's own `references/` directory. Select each reference at the Skill
step that needs it; reuse does not turn step-selected material into Knowledge.

## Development support

[lib/](lib/) contains source-only modules consumed through imports.
[tools/](tools/) contains executable development and release entrypoints. Tools
may import libraries, while libraries must not depend on tools. Repository
automation may import libraries or call tools. These source-only facilities may
inspect canonical plugin content, but files under [plugin/](plugin/) must not
depend on them.
