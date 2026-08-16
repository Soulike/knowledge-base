# Knowledge and Skills

## Scope

This document defines the roles, boundaries, canonical ownership, and dependency relationship of reusable Knowledge and Agent Skills in Agent systems, including how to classify and split source material.

## When to update

Update this document when changes in Agent capabilities alter the role of Knowledge or Skills, or when a real classification case exposes an ambiguity in the boundary, canonical ownership, mixed-content split, or dependency rules described here.

## Roles

### Knowledge

Knowledge is reusable, relatively static content that records facts, concepts, principles, constraints, explanations, and references. “Static” means that the content provides understanding rather than controlling an Agent's execution; it can still be revised as its subject changes. Each Knowledge document should provide enough context to serve its direct-reading responsibility without requiring another Knowledge document as a prerequisite, and it may support multiple Skills.

### Skill

An Agent Skill is task-facing behavior that tells an Agent when and how to accomplish a particular outcome. It owns invocation triggers, decisions, execution steps, tool use, and completion criteria. A Skill may retrieve and apply Knowledge, but should reference the canonical Knowledge rather than reproduce it.

## Boundary

Classify content by responsibility, not by its Markdown form or writing style. A Knowledge document may contain examples, algorithms, criteria, or domain procedures when they explain the subject. Content belongs in a Skill when its responsibility is to control how an Agent recognizes, performs, and completes a task.

Explanatory prose does not become Knowledge merely because it states a reusable-looking principle. Keep material as a Skill's in-file or disclosed reference when its only consumer is that workflow, it changes with that workflow, and no independent task or decision would cause a reader to retrieve it. An independent direct-reading responsibility is the deciding signal for Knowledge; use by multiple Skills or readers is strong evidence for that responsibility, but is not required.

| Question                                 | Knowledge                                                    | Skill                                                                     |
| ---------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------- |
| What is its primary purpose?             | Preserve reusable understanding.                             | Produce a task outcome.                                                   |
| Does it stand alone?                     | It has an independent direct-reading task or decision.       | It is invoked in response to a task or trigger.                           |
| What controls its lifecycle?             | Changes in the subject it explains.                          | Changes in the workflow it implements or supports.                        |
| What behavior does it own?               | It informs decisions without orchestrating execution.        | It orchestrates decisions, tools, steps, and completion.                  |
| How should other artifacts depend on it? | Skills and direct readers reference its canonical ownership. | It reads canonical Knowledge instead of becoming another source of truth. |

## Canonical ownership

Assign each reusable concept and responsibility to one canonical Knowledge document. Make document Scopes and routing conditions such as `When to Read` expose distinct ownership. Multiple documents may match the same compound task when each contributes different Knowledge; when two documents would answer the same question with the same responsibility, merge them or redraw their boundaries instead of maintaining parallel sources of truth.

A catalog owns routing among Knowledge documents. When one document genuinely depends on another, place the link in the explanation that applies the dependency and state the local context needed to use it. A detached list of neighboring documents is routing rather than part of a leaf document's subject.

## Classifying material

1. Separate the source into parts with distinct responsibilities instead of assigning one category to the whole source.
2. For each part, identify its consumers, what changes would make it stale, and whether a concrete task or decision would cause it to be read outside a particular workflow.
3. Classify material with an independent direct-reading responsibility that preserves reusable understanding as Knowledge.
4. Classify material that controls an Agent's task execution, plus supporting explanation local to that workflow, as a Skill or Skill reference.
5. Treat material containing both responsibilities as mixed: extract the canonical Knowledge first, then make the Skill reference and apply it.
6. Keep material matching neither responsibility in the artifact type that actually owns it rather than forcing it into Knowledge or a Skill.

## Examples

| Knowledge                                                 | Skill                                                         |
| --------------------------------------------------------- | ------------------------------------------------------------- |
| Security principles, threat models, and risk explanations | A security-review workflow that applies those principles      |
| API contracts and behavioral constraints                  | A migration workflow that uses those contracts                |
| A catalog of available Knowledge and read conditions      | A retrieval workflow that selects and applies catalog entries |
