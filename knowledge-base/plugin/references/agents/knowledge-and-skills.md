# Classifying Knowledge and Skill material

## Scope

This reference supports workflow steps that distinguish authoritative Knowledge,
Workflow Skills, Handbook Skills, and their supporting references, then classify
source material as one of those responsibilities, mixed, or neither.

## When to update

Update this reference when Agent capabilities or a real classification case
exposes an ambiguity in subject ownership, execution ownership, required-reading
routing, supporting references, or mixed and neither material.

## Roles

### Knowledge

Knowledge preserves understanding about a subject with a concrete reading need
arising from the user's work, subject, or current material. The need exists
before a Workflow Skill makes the decisions that the understanding informs and
remains if every consuming Workflow and Handbook is removed. A route may bundle
several Knowledge documents at reading time without merging their authoritative
responsibilities or maintenance lifecycles.

### Workflow Skill

A Workflow Skill owns an independently invoked user task. It controls the
execution decisions, actions, tool use, failure and stopping behavior, outputs,
and completion criteria that produce the user's result.

### Handbook Skill

A Handbook Skill is an installed reading entrypoint for one user task family,
technical domain, or stable platform context. It owns when canonical Knowledge
must be read, including a common foundation and cumulative conditional packages,
but does not own the user's task procedure or completion. Its lifecycle follows
the reading scene and routes rather than the subjects explained by the Knowledge.

### Skill reference

A Skill reference supplies facts, criteria, examples, or decision support to a
particular Skill step. The executing Skill selects it after invocation. It may
be shared by several Skills without acquiring an independent Knowledge reading
responsibility, and its lifecycle follows the selecting behavior.

## Boundary

Classify content by subject, execution, and routing responsibility rather than
Markdown form or expository style. Algorithms, criteria, and principles can be
Knowledge when user work independently gives an Agent reason to retrieve them.
The same forms are Skill references when their only route is a Skill step. A
list of Knowledge links becomes a Handbook only when it owns a coherent reading
scene and executable selection obligations; topic similarity alone does not
create that responsibility.

Apply four tests to each distinct part:

1. **Reading origin:** Does the user's work, subject, or current material expose
   a need for the understanding without first entering a Workflow Skill?
2. **Workflow removal:** If every Workflow Skill disappeared, would a concrete
   reason to retrieve the understanding remain?
3. **Owned behavior:** Does the part explain a subject, execute a user task,
   select required reading for a coherent scene, or support one selected step?
4. **Lifecycle:** Does the part become stale when the subject changes, the user
   task procedure changes, the reading scene or routes change, or one selecting
   step changes?

Knowledge passes the first two tests, owns subject explanation in the third,
and follows the subject lifecycle in the fourth. A Workflow owns task execution.
A Handbook owns the reading scene and route. A Skill reference lacks an
independent reading origin or follows one selecting step. Rewriting a Workflow
step as `Read when ...` does not make the material Knowledge, and combining
several Knowledge links does not make their subjects one Handbook responsibility.

## Classifying material

1. Start from the user's work, the decisions the user or Agent must make, and
   the understanding required before those decisions. Separate parts with
   distinct responsibilities instead of assigning one category to the whole
   source.
2. For each part, identify its consumers, reading or invocation origin, owned
   behavior, and maintenance lifecycle, then apply the four boundary tests.
3. Classify independently retrievable subject understanding as Knowledge and
   preserve one authoritative Knowledge owner for each responsibility.
4. Classify task decisions, actions, failure behavior, outputs, and completion
   as a Workflow Skill.
5. Classify selection and mandatory reading obligations as a Handbook Skill only
   when one user task family, technical domain, or stable platform context forms
   a coherent native entry. First compare existing Handbooks; add another only
   for an independently useful scene, not for each Knowledge leaf or condition.
6. Classify step-selected supporting material as an in-file or disclosed Skill
   reference. Keep canonical Knowledge direct rather than copying it into a
   Workflow, Handbook, or reference.
7. Treat material containing several responsibilities as mixed and separate the
   authoritative subject explanation, task execution, reading route, and
   step-local support before choosing artifacts.
8. Keep material matching none of these responsibilities in the artifact type
   that actually owns it rather than forcing it into Knowledge or a Skill.

## Examples

| Knowledge                                                                                     | Handbook Skill                                                                                                  | Workflow Skill or Skill reference                                                     |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Test effectiveness and trustworthy execution, maintained as separate subject responsibilities | Automated-testing reading that requires both for ordinary test work and adds cost guidance for performance work | A workflow that writes or reviews tests and the criteria selected by one of its steps |
| Chromium iOS architecture                                                                     | A Chromium platform entry with a conditional iOS interface package                                              | A procedure that implements and validates a Chromium UI change                        |
| Filesystem identity semantics                                                                 | A filesystem entry that bundles general pathname understanding and adds Node.js material when applicable        | A migration procedure and its step-specific compatibility checklist                   |
