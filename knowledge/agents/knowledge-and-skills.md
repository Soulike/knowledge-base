# Knowledge and Skills

## Scope

This document defines the roles, boundary, and dependency relationship of reusable Knowledge and Agent Skills in Agent systems, including how to classify and split source material; repository layouts, plugin packaging, and project-specific authoring workflows are outside its scope.

## When to update

Update this document when changes in Agent capabilities alter the role of Knowledge or Skills, or when a real classification case exposes an ambiguity in the boundary, canonical ownership, mixed-content split, or dependency rules described here.

## Roles

### Knowledge

Knowledge is reusable, relatively static content that records facts, concepts, principles, constraints, explanations, and references. “Static” means that the content provides understanding rather than controlling an Agent's execution; it can still be revised as its subject changes. Knowledge should remain useful when read directly and may support multiple Skills.

### Skill

An Agent Skill is task-facing behavior that tells an Agent when and how to accomplish a particular outcome. It owns invocation triggers, decisions, execution steps, tool use, and completion criteria. A Skill may retrieve and apply Knowledge, but should reference the canonical Knowledge rather than reproduce it.

## Boundary

Classify content by responsibility, not by its Markdown form or writing style. A Knowledge document may contain examples, algorithms, criteria, or domain procedures when they explain the subject. Content belongs in a Skill when its responsibility is to control how an Agent recognizes, performs, and completes a task.

| Question                                 | Knowledge                                             | Skill                                                                     |
| ---------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------- |
| What is its primary purpose?             | Preserve reusable understanding.                      | Produce a task outcome.                                                   |
| Does it stand alone?                     | It remains useful outside a particular workflow.      | It is invoked in response to a task or trigger.                           |
| What behavior does it own?               | It informs decisions without orchestrating execution. | It orchestrates decisions, tools, steps, and completion.                  |
| How should other artifacts depend on it? | Multiple Skills and direct readers may use it.        | It reads canonical Knowledge instead of becoming another source of truth. |

## Canonical ownership

Assign each reusable concept and responsibility to one canonical Knowledge document. Make document Scopes and routing conditions such as `When to Read` expose distinct ownership. Multiple documents may match the same compound task when each contributes different Knowledge; when two documents would answer the same question with the same responsibility, merge them or redraw their boundaries instead of maintaining parallel sources of truth.

## Classifying material

1. Separate the source into parts with distinct responsibilities instead of assigning one category to the whole source.
2. Classify material that preserves reusable understanding as Knowledge.
3. Classify material that controls an Agent's task execution as a Skill.
4. Treat material containing both responsibilities as mixed: extract the canonical Knowledge first, then make the Skill reference and apply it.
5. Keep material matching neither responsibility in the artifact type that actually owns it rather than forcing it into Knowledge or a Skill.

## Examples

| Knowledge                                                 | Skill                                                         |
| --------------------------------------------------------- | ------------------------------------------------------------- |
| Security principles, threat models, and risk explanations | A security-review workflow that applies those principles      |
| API contracts and behavioral constraints                  | A migration workflow that uses those contracts                |
| A catalog of available Knowledge and read conditions      | A retrieval workflow that selects and applies catalog entries |
