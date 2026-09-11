# Knowledge-base review criteria

Protect this repository as a trustworthy source of Agent Knowledge and
workflows, including the implementation and delivery tooling that validates,
packages, installs, and maintains them.

Classify each changed artifact by its repository responsibility: Knowledge,
repository-authoring Skill, installed usage Skill, Skill reference, plugin
packaging or delivery, implementation code, repository automation, tests, or
human-facing documentation. Use that classification to select the applicable
rules and review dimensions.

For a new or materially changed Skill, reconstruct the user task and verify that
the pull-request description provides the design and behavioral evidence
required by [Agent Skill authoring](references/agents/skill-authoring.md). Use
the [knowledge-base maintenance workflow](.agents/skills/maintain-knowledge-base/SKILL.md)
to evaluate changes to Knowledge, Skills, Skill references, maintained Agent
instructions, and prompts.

Review every applicable repository-specific dimension:

1. Classification, ownership, retrieval routes, maintenance lifecycle, package
   boundaries, and downstream-project independence.
2. Skill task sufficiency, invocation conditions, decisions, instruction
   authority, progressive disclosure, tool use, failure handling, output
   contracts, and completion criteria.
3. The smallest coherent current model for every affected responsibility unit.
   Check whether deletion, rewriting, merging, splitting, or movement is more
   appropriate than adding another qualification or competing authority.
4. Packaging and delivery completeness across affected plugin, marketplace,
   manifest, version, reference, installation, and automation paths.
5. Historical dispositions recorded by trusted collaborators in closed issues.
   Apply one only when the finding and its premises still match, and recheck it
   when its recorded trigger has occurred.

For every added or materially changed inline link between Knowledge leaves,
apply the
[inline-dependency test](.agents/skills/maintain-knowledge-base/references/maintain-knowledge.md#admit-inline-knowledge-dependencies).
Report a finding when no named source claim's correctness, authority, or
application depends on the target; the target supplies related or optional
material rather than a canonical premise, decision, or mapping on which that
claim relies; or the pointer introduces an independently retrievable language-,
platform-, product-, or implementation-specific branch. Accept the dependency
only when it belongs within the source's existing scope and the source states
enough local context to remain independently usable.

Do not report a defect that a required CI check deterministically detects for
the same revision. Still report behavior outside CI coverage, weakened or
silently skipped validation, and semantic defects that mechanical checks miss.
Report only concrete, actionable issues introduced by the pull request.
