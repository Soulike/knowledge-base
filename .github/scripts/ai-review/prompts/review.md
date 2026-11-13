# Knowledge-base review criteria

Protect this repository as a trustworthy source of Agent Knowledge and
workflows, including the implementation and delivery tooling that validates,
packages, installs, and maintains them.

Classify each changed artifact by its repository responsibility: Knowledge,
repository-authoring Skill, installed usage Skill, Skill reference, plugin
packaging or delivery, implementation code, repository automation, tests, or
human-facing documentation. Use that classification to select the applicable
repository rules and review dimensions.

Use the
[knowledge-base maintenance workflow](.agents/skills/maintain-knowledge-base/SKILL.md)
to evaluate changes to Knowledge, Skills, Skill references, maintained Agent
instructions, and prompts. For a new or materially changed Skill, verify that
the pull-request description contains the concise design and behavioral evidence
summary required by the repository's
[Skill change evidence](AGENTS.md#skill-change-evidence) rule, using
[Agent Skill authoring](knowledge-base/plugin/references/agents/skill-authoring.md)
for the evidence criteria.

When reviewing a Knowledge reading trigger or Skill invocation condition,
apply [Design selection triggers](knowledge-base/plugin/references/agents/selection-triggers.md).

For changes to content claim scope or organization, apply
[Assess contribution scope](knowledge-base/plugin/references/agents/contribution-scope-assessment.md).

Review every applicable repository-specific dimension:

1. Classification, ownership, retrieval routes, maintenance lifecycle, package
   boundaries, and downstream-project independence.
2. Skill task sufficiency, invocation conditions, decisions, instruction
   authority, progressive disclosure, tool use, failure handling, output
   contracts, and completion criteria.
3. The smallest coherent current model for every affected responsibility unit.
   Apply
   [Maintained document quality](knowledge-base/plugin/knowledge/documentation/maintained-document-quality.md#validate-the-result)
   and, for Skills,
   [review the composed bundle](knowledge-base/plugin/references/agents/skill-authoring.md#review-the-composed-bundle).
   For primary-plugin Knowledge, Skills, and Skill references, apply the
   [reader requirements](knowledge-base/AGENTS.md#reader-understanding) and check
   that the required cross-model understanding evidence supports the revision.
4. Packaging and delivery completeness across affected plugin, marketplace,
   manifest, version, reference, installation, and automation paths.
5. Applicable
   [historical dispositions](GLOSSARY.md#historical-disposition), including
   their recorded premises and recheck triggers.

For every added or materially changed inline link between Knowledge leaves,
apply the
[inline-dependency test](.agents/skills/maintain-knowledge-base/references/maintain-knowledge.md#admit-inline-knowledge-dependencies).
