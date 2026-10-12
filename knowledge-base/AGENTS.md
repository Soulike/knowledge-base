# Knowledge-base plugin authoring

Use the [plugin glossary](GLOSSARY.md) for Knowledge, Skills, and Skill
references. This directory is the primary product's source module. Its
[plugin/](plugin/) directory is the complete installed package and must remain
useful without the rest of this source module, a repository checkout, or another
plugin.

## Knowledge

[plugin/knowledge/](plugin/knowledge/) contains canonical Knowledge organized by domain.
A leaf's concrete reading trigger must follow from the user's task, technical
subject, or current engineering artifact before selecting a workflow. Removing
every consuming Skill must not remove that reason to read it.

Keep [plugin/knowledge/index.md](plugin/knowledge/index.md) as the only Knowledge index.
List every leaf directly with its `time-sensitive` or `evergreen` Knowledge
Type. Index link labels use plugin-root-relative paths; their targets resolve
relative to the index. Use subdirectories for organization rather than nested
indexes.

Each leaf must supply enough context for its `When to Read` condition without
requiring another leaf first. Keep routing in the index rather than adding
`Related Knowledge`, `See also`, or similar leaf appendices. When a claim
actually depends on another leaf, link it inline where the dependency is
applied and state the necessary context there.

## Skills and references

[plugin/skills/](plugin/skills/) owns installed workflows. Resolve packaged file references
relative to each Skill's `SKILL.md`; for example, a Skill reaches the
[Knowledge index](plugin/knowledge/index.md) through `../../knowledge/index.md`.
Read the index, then only matching documents. Read shared files directly;
Skill-to-Skill invocation is not a portable execution contract.

[plugin/references/](plugin/references/) holds non-indexed supporting material shared by
this plugin's Skills, including references also read by repository-authoring
workflows. Keep a reference used by only one Skill inside that Skill's own
`references/` directory. Select each reference at the workflow step that needs
it; reuse does not turn workflow-selected material into Knowledge.

## Development support

[tooling/](tooling/) contains checks and release tooling whose behavior changes
with the knowledge-base product. [packages/](packages/) contains libraries
shared by that tooling and repository automation. These source-only facilities
may inspect canonical plugin content, but files under [plugin/](plugin/) must not
depend on them.
