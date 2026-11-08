# Classify and design a Handbook Skill

## Identity

- ID: handbook-skill-authoring
- Kind: application

## Covered objects

- [Repository authoring rules](../../AGENTS.md)
- [Product authoring rules](../../knowledge-base/AGENTS.md)
- [Product glossary](../../knowledge-base/GLOSSARY.md)
- [Content-maintenance Skill](../../.agents/skills/maintain-knowledge-base/SKILL.md)
- [Knowledge-maintenance workflow](../../.agents/skills/maintain-knowledge-base/references/maintain-knowledge.md)
- [Skill-maintenance workflow](../../.agents/skills/maintain-knowledge-base/references/maintain-skill.md)
- [Classification reference](../../knowledge-base/plugin/references/agents/knowledge-and-skills.md)
- [Selection-trigger reference](../../knowledge-base/plugin/references/agents/selection-triggers.md)
- [Skill-authoring reference](../../knowledge-base/plugin/references/agents/skill-authoring.md)

## Protected behavior

Knowledge-base maintenance must distinguish canonical subject understanding,
task execution, and scenario-based reading obligations. A proposed installed
reading entry must become or join a Handbook Skill without absorbing the
Knowledge it routes or inventing a Workflow procedure. Protect cumulative
conditional reading, direct canonical routes, downstream portability, the
repository-owned product placement policy, and the maintenance-only Catalog and
strict reachability contract while allowing different Handbook names, prose,
package labels, and plan structure.

## Task

维护者提议为自动化测试工作增加一个可安装的可复用 Skill。用户编写、审查、排查具体自动化测试或解释其行为与执行时，它应要求阅读测试有效性与可信测试执行的权威 Knowledge；测量、分析或改进测试运行时间或资源成本时，还要阅读测试执行成本。单独学习或解释测试执行成本时，只读匹配的成本包，不强制无关的具体测试工作基础；具体测试工作同时涉及成本时，三份材料累积必读。这个 Skill 只提供理解与必读路由，不接管用户的测试编写或审查流程。Knowledge Catalog 只保留文件路径和 Knowledge Type；运行时阅读必须由安装后的 Handbook 或 Workflow 直接路由，并通过严格可达性检查。

请准备分类与作者计划，说明权威职责、复用或新增判断、Skill 类型与边界、选择条件、阅读结构与重新评估、包与路径约束、Catalog 清单与严格可达性、验证证据，以及任何停止条件或未决点。不要修改文件。

## Starting state

Supply the complete current covered guidance, its required normative routes,
the three named software-testing Knowledge documents, the current Knowledge
Catalog, and installed Skill names and descriptions needed to compare owners.
Use a fresh supported lower-capability model with the expanded executor guard,
read-only access to the supplied repository snapshot, and a six-minute
wall-clock allowance. Keep this case, its expected behavior, prior attempts,
and evaluator conclusions private. Do not supply the parent specification or
research note; the maintained guidance must make the behavior usable.

The task is planning only. No Skill, Knowledge, Catalog, or test mutation is
permitted. Record the exact source snapshot, model, configuration, files read,
and available action observations.

## Expected behavior

- R1 (critical): keep the three subject documents as authoritative Knowledge;
  classify the reading entry as a Handbook Skill, not a Workflow Skill or Skill
  reference, and keep user task procedure and completion outside it.
- R2: begin from the user work and required understanding. Compare existing
  Handbook scenes before adding one, and justify a new entry only when no
  existing task family, technical domain, or stable platform context owns the
  reading scene. Do not create one Skill per Knowledge leaf.
- R3 (critical): design one semantic Handbook applicability rule from
  observable user work or current materials, then make the two generally
  required test documents the foundation
  for primary automated-test work and test-cost guidance a conditional required
  package. Require every matching package cumulatively and allow a focused
  learning or explanation request about test cost to read its matching package
  without forcing an unrelated foundation. Do not enumerate packages in the
  description or require a diagnosis the Handbook should help discover.
- R4: use direct links to complete canonical files or context-sufficient
  sections, prohibit Handbook-to-Handbook dependencies, reuse already loaded
  current material, and re-evaluate applicable Handbooks and packages when the
  task stage, language, platform, artifact, or production method changes or the
  earlier reading basis is no longer available.
- R5: keep the installed Handbook as a flat immediate child of the package
  Skill directory with matching `handbook-` registered and directory names
  because the repository's product rules and maintenance workflow require that
  target layout. Attribute this placement and naming policy to those
  repository-owned sources rather than presenting it as a universal rule for
  reusable Agent Skills. Update every invocation pointer and consumer for an
  authorized rename or removal, delete the obsolete entrypoint, and do not add
  aliases or wrappers.
- R6 (critical): keep the Catalog as a two-column file-and-type maintenance
  inventory with no runtime condition or loader. Require every Knowledge leaf
  to remain reachable from an installed Workflow or Handbook through the
  accepted package-local graph. Do not present static reachability or Handbook
  authoring as proof that client selection, reading, or application occurred.
- R7: plan distinct evidence for native description selection, internal package
  choice, actual reading and application, later-stage supplementary reading,
  adjacent negative loading, and relevant historical case replay. Static links
  or a plausible final answer alone must not be reported as behavioral proof.
- R8 (critical): keep the installed reusable authoring reference understandable
  without repository history and portable to another project. It may define
  generic Workflow and Handbook responsibilities and bundle ownership, but it
  must not prescribe this repository's
  [repository-authoring Skill location](../../AGENTS.md#repository-architecture),
  primary plugin flat layout, or `workflow-` and `handbook-` naming convention
  to an unrelated downstream project.

## Verification

Use the current application dispatch template with only the task, permitted
starting materials, current guidance, source identity, and expanded executor
guard. Inspect the returned plan and file-read account, then give the capable
reviewer this contract and the raw observation without the coordinator's
verdict. Judge every criterion separately and retain every attempt.

For rubric calibration, a controlled faulty plan that calls the proposal a
Workflow, replaces the three Knowledge files with copied prose, treats the
cost package as optional, adds a runtime condition to the Catalog, or leaves a
Knowledge leaf without an installed Skill route must fail the corresponding
critical criterion. A plan that cites the portable authoring reference as
universal authority for the
[repository-authoring Skill location](../../AGENTS.md#repository-architecture)
or the product's prefixes must fail R8. These copies test the reviewer; they are
not additional Agent runs or evidence about maintained guidance.

## Source

GitHub issues #242 and #251 establish the final Workflow and Handbook
responsibility model, cumulative reading contract, maintenance-only Catalog,
strict reachability gate, and required evidence. A pre-change replay at commit
`740842b` supplies the historical TDD baseline; the revised case requires fresh
final evidence against the completed contract.
