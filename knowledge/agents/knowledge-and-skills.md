# Knowledge and Skills

## Scope

This document defines how to distinguish reusable Knowledge from Agent Skills and classify source material as Knowledge, Skill, mixed, or neither.

## When to update

Update this document when changes in Agent capabilities or a real classification case expose an ambiguity in the distinction between reusable understanding and task-facing behavior or in handling mixed or neither material.

## Roles

### Knowledge

Knowledge is reusable, relatively static content whose responsibility is to preserve understanding through facts, concepts, principles, constraints, explanations, and references. “Static” means that the content informs rather than controls execution; it can still be revised as its subject changes.

### Skill

An Agent Skill is task-facing behavior whose responsibility is to produce an outcome. It owns invocation triggers, decisions, execution steps, tool use, and completion criteria.

## Boundary

Classify content by responsibility, not by its Markdown form or writing style. A Knowledge document may contain examples, algorithms, criteria, or domain procedures when they explain the subject. Content belongs in a Skill when its responsibility is to control how an Agent recognizes, performs, and completes a task.

Explanatory prose does not become Knowledge merely because it states a reusable-looking principle. Keep material as a Skill's in-file or disclosed reference when its only consumer is that workflow, it changes with that workflow, and no independent task or decision would cause a reader to retrieve it. An independent direct-reading responsibility is the deciding signal for Knowledge; use by multiple Skills or readers is strong evidence for that responsibility, but is not required.

| Question                     | Knowledge                                         | Skill                                                        |
| ---------------------------- | ------------------------------------------------- | ------------------------------------------------------------ |
| What is its primary purpose? | Preserve reusable understanding.                  | Produce a task outcome.                                      |
| What selects it?             | An independent direct-reading task or decision.   | A task or trigger that asks the Agent to produce an outcome. |
| What controls its lifecycle? | Changes in the subject it explains.               | Changes in the workflow it implements or supports.           |
| What behavior does it own?   | Inform decisions without orchestrating execution. | Orchestrate decisions, tools, steps, and completion.         |

## Classifying material

1. Separate the source into parts with distinct responsibilities instead of assigning one category to the whole source.
2. For each part, identify its consumers, what changes would make it stale, and whether a concrete task or decision would cause it to be read outside a particular workflow.
3. Classify material with an independent direct-reading responsibility that preserves reusable understanding as Knowledge.
4. Classify material that controls an Agent's task execution, plus supporting explanation local to that workflow, as a Skill or Skill reference.
5. Treat material containing both responsibilities as mixed: separate reusable understanding into Knowledge and task execution into a Skill that applies it.
6. Keep material matching neither responsibility in the artifact type that actually owns it rather than forcing it into Knowledge or a Skill.

## Examples

| Knowledge                                                 | Skill                                                         |
| --------------------------------------------------------- | ------------------------------------------------------------- |
| Security principles, threat models, and risk explanations | A security-review workflow that applies those principles      |
| API contracts and behavioral constraints                  | A migration workflow that uses those contracts                |
| A catalog of available Knowledge and read conditions      | A retrieval workflow that selects and applies catalog entries |
