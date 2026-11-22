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
instructions, and prompts. Enforce
[repository architecture](AGENTS.md#repository-architecture)
(dependency boundaries, one-way delegation from `.agents/` to
`knowledge-base/plugins/knowledge-base/`, symmetric downstream-project independence and
domain-model neutrality for general-purpose plugin packages, and isolation of
product-interface contracts to explicit product-interaction workflows)
alongside [plugin authoring rules](knowledge-base/AGENTS.md).

For pull requests that add or substantively revise maintained Knowledge,
Workflow Skills, Handbook Skills, Skill references, maintained Agent
instructions or prompts, or behavioral regression cases (excluding ordinary
engineering code, tooling, or CI implementation pull requests), verify that the
pull-request description satisfies the repository's unified
[behavioral and documentation change evidence](AGENTS.md#behavioral-and-documentation-change-evidence)
rule. Check generic Skill design and behavioral evidence against
[Prepare pull-request and handoff evidence](knowledge-base/plugins/knowledge-base/references/agents/skill-authoring.md#prepare-pull-request-and-handoff-evidence),
Knowledge-plugin Knowledge, Workflow Skill, and Handbook Skill evidence against
[Prove Handbook and Workflow behavior](.agents/skills/maintain-knowledge-base/references/maintain-skill.md#prove-handbook-and-workflow-behavior),
cross-model reader-understanding observations against
[Verify reader understanding](knowledge-base/plugins/knowledge-base/references/agents/reader-understanding.md#required-evidence),
and behavioral regression evidence against
[Behavioral regression cases](.agents/references/agent-regression-tests.md).

When reviewing a Skill selection trigger or internal routing condition, apply
[Design selection triggers](knowledge-base/plugins/knowledge-base/references/agents/selection-triggers.md)
for generic coverage, earliest-observable-point drafting, and blind request
checks. For Knowledge-plugin Knowledge, Workflow Skill, and Handbook Skill
responsibility boundaries, Handbook modeling, and product-specific description
or package conditions, apply
[Choose the Skill responsibility](.agents/skills/maintain-knowledge-base/references/maintain-skill.md#choose-the-skill-responsibility),
[Handbook and Workflow selection triggers](.agents/skills/maintain-knowledge-base/references/maintain-skill.md#handbook-and-workflow-selection-triggers),
and [plugin Skills and references](knowledge-base/AGENTS.md#skills-and-references).

For changes to content claim scope or organization, apply
[Assess contribution scope](knowledge-base/plugins/knowledge-base/references/agents/contribution-scope-assessment.md).

Review every applicable repository-specific dimension:

1. Classification, ownership, retrieval routes, maintenance lifecycle, package
   boundaries, symmetric downstream-project independence and domain-model
   neutrality, product-interface isolation, and the dependency-boundary and
   one-way delegation rule for repository-maintenance workflows.
2. Skill task sufficiency, invocation conditions, decisions, instruction
   authority, progressive disclosure, tool use, failure handling, output
   contracts, and completion criteria, applying
   [Agent Skill authoring](knowledge-base/plugins/knowledge-base/references/agents/skill-authoring.md#prove-the-behavior)
   for generic Skill proof and
   [Prove Handbook and Workflow behavior](.agents/skills/maintain-knowledge-base/references/maintain-skill.md#prove-handbook-and-workflow-behavior)
   for Knowledge-plugin Workflow/Handbook boundaries, Handbook packages, and
   direct Knowledge reading.
3. The smallest coherent current model for every affected responsibility unit.
   Apply
   [Maintained document quality](knowledge-base/plugins/knowledge-base/knowledge/documentation/maintained-document-quality.md#validate-the-result)
   and, for Skills,
   [review the composed bundle](knowledge-base/plugins/knowledge-base/references/agents/skill-authoring.md#review-the-composed-bundle)
   alongside
   [Prove Handbook and Workflow behavior](.agents/skills/maintain-knowledge-base/references/maintain-skill.md#prove-handbook-and-workflow-behavior)
   for Knowledge-plugin Knowledge reading and package traces.
   For Knowledge, Skills, and Skill references under `knowledge-base/plugins/*/`, apply the
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
