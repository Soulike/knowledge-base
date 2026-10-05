# Classifying Knowledge and Skill material

## Scope

This reference supports workflow steps that distinguish independently retrievable Knowledge from Agent Skills and their supporting references, then classify source material as Knowledge, Skill or Skill reference, mixed, or neither.

## When to update

Update this reference when changes in Agent capabilities or a real classification case expose an ambiguity in retrieval responsibility, workflow ownership, supporting references, or mixed and neither material.

## Roles

### Knowledge

Knowledge preserves understanding about a technical subject, product, platform, protocol, or engineering artifact. Its concrete reading trigger is observable from the task or subject before an Agent selects a workflow, and that trigger remains if every Skill that happens to use the Knowledge is removed.

### Skill

An Agent Skill is task-facing behavior whose responsibility is to produce an outcome. It owns invocation triggers, decisions, execution steps, tool use, and completion criteria.

### Skill reference

A Skill reference supplies facts, criteria, examples, or decision support to a workflow step. The executing Skill selects it only after the workflow has been invoked. It may be shared by several Skills without acquiring an independent reading responsibility.

## Boundary

Classify content by retrieval and execution responsibility rather than Markdown form or expository style. Algorithms, criteria, and principles can be Knowledge when a technical subject independently gives an Agent reason to retrieve them. The same forms are Skill references when their only route is a workflow decision.

Apply four tests:

1. **Retrieval origin:** Does the user task, technical subject, or current artifact expose the reading need without first entering a workflow?
2. **Workflow removal:** If every consuming Skill disappeared, would a concrete reason to retrieve this material remain?
3. **Routing order:** Can an Agent evaluate its reading trigger before choosing the workflow that may consume it?
4. **Lifecycle:** Does the material become stale when its subject changes, or when a workflow changes how it performs a step?

Knowledge has an affirmative answer to the first three tests and follows the subject lifecycle in the fourth. A Skill reference lacks that independent route or follows the workflow lifecycle. Rewriting a workflow step as a `Read when ...` condition does not make the trigger independent, and reuse by multiple Skills proves only that the reference may need shared ownership.

## Classifying material

1. Separate the source into parts with distinct responsibilities instead of assigning one category to the whole source.
2. For each part, identify its consumers, retrieval origin, routing order, and maintenance lifecycle, then apply the workflow-removal test.
3. Classify material that passes every boundary test and preserves independently retrievable understanding as Knowledge.
4. Classify material that controls execution as a Skill and material selected by its steps as an in-file or disclosed Skill reference.
5. Treat material containing both responsibilities as mixed: separate independently retrievable understanding into Knowledge and task execution with its supporting references into a Skill.
6. Keep material matching neither responsibility in the artifact type that actually owns it rather than forcing it into Knowledge or a Skill.

## Examples

| Knowledge                                                                 | Skill or Skill reference                                                           |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Chromium iOS architecture, retrieved for Chromium iOS development         | Criteria for determining documentation impact inside a maintenance workflow        |
| An API contract, retrieved whenever code uses that API                    | A migration procedure and the compatibility checklist selected by one of its steps |
| A platform's filesystem identity semantics, retrieved for relevant design | A test-review workflow and its supporting test-effectiveness criteria              |
