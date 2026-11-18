# Knowledge-base review criteria

Protect this repository as a trustworthy source of Agent Knowledge and
workflows, including the implementation and delivery tooling that validates,
packages, installs, and maintains them.

Classify each changed artifact by its repository responsibility: Knowledge,
repository-maintenance workflow, installed usage Skill, Skill reference, plugin
packaging or delivery, implementation code, repository automation, tests, or
human-facing documentation. Use that classification to select the applicable
repository rules and review dimensions.

Use the
[knowledge-base maintenance workflow](.agents/skills/maintain-knowledge-base/SKILL.md)
to evaluate changes to Knowledge, Skills, Skill references, maintained Agent
instructions, and prompts. For changes touching repository-maintenance workflows
or their references, enforce the
[dependency-boundary and one-way delegation rule](AGENTS.md#repository-architecture):
generalizable guidance, quality criteria, or evaluation procedures belong in
`knowledge-base/plugin/` (or the applicable plugin package), and `.agents/`
content must delegate one-way without restating, paraphrasing, splitting, or
locally overriding those authorities.

For pull requests that add or substantively revise maintained Knowledge,
Workflow Skills, Handbook Skills, Skill references, maintained Agent
instructions or prompts, or behavioral regression cases (excluding ordinary
engineering code, tooling, or CI implementation pull requests), verify that the
pull-request description satisfies the repository's unified
[behavioral and documentation change evidence](AGENTS.md#behavioral-and-documentation-change-evidence)
rule. Check Skill design and behavioral evidence against
[Prepare pull-request and handoff evidence](knowledge-base/plugin/references/agents/skill-authoring.md#prepare-pull-request-and-handoff-evidence),
cross-model reader-understanding observations against
[Verify reader understanding](knowledge-base/plugin/references/agents/reader-understanding.md#required-evidence),
and behavioral regression evidence against
[Behavioral regression cases](.agents/references/agent-regression-tests.md).

When reviewing a Knowledge reading trigger or Skill invocation condition,
apply [Design selection triggers](knowledge-base/plugin/references/agents/selection-triggers.md).

For changes to content claim scope or organization, apply
[Assess contribution scope](knowledge-base/plugin/references/agents/contribution-scope-assessment.md).

Review every applicable repository-specific dimension:

1. Classification, ownership, retrieval routes, maintenance lifecycle, package
   boundaries, downstream-project independence, and the dependency-boundary
   and one-way delegation rule for repository-maintenance workflows.
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
