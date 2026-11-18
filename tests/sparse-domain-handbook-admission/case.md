# Admit a sparse domain Handbook alongside a broader language Handbook

## Identity

- ID: sparse-domain-handbook-admission
- Kind: application

## Covered objects

- [Product authoring rules](../../knowledge-base/AGENTS.md)
- [Content-maintenance Skill](../../.agents/skills/maintain-knowledge-base/SKILL.md)
- [Knowledge-maintenance workflow](../../.agents/skills/maintain-knowledge-base/references/maintain-knowledge.md)
- [Skill-maintenance workflow](../../.agents/skills/maintain-knowledge-base/references/maintain-skill.md)
- [Classification reference](../../knowledge-base/plugin/references/agents/knowledge-and-skills.md)

## Protected behavior

Maintenance triage and Skill authoring must allow a distinct, self-contained
domain or framework context to begin sparsely with a single curated Knowledge
leaf rather than forcing it into a broader co-selecting language Handbook (such
as placing React guidance inside a JS/TS language Handbook), while continuing
to reject narrow 1:1 wrapper Handbooks scoped only to a single leaf's specific
practice. The case must tolerate different valid Handbook names, description
wording, and package phrasing for the accepted sparse entrypoint.

## Task

Suppose the installed Handbook catalog currently includes
`handbook-javascript-typescript` (covering JavaScript/TypeScript language
coding principles, module organization, Promise coordination, date/time, and
TS/ESLint checks), `handbook-software-engineering`, `handbook-product-experience`,
and `handbook-automated-testing`, and contains **no** React Handbook yet.

A contributor proposes adding **one** new React Knowledge document covering how
to isolate non-reactive callbacks from React `useEffect` dependencies across
React versions. Prepare a read-only placement and Skill-design assessment that
evaluates all three options:

1. Routing the single React leaf as a new conditional package inside the
   existing `handbook-javascript-typescript` Handbook;
2. Creating a new dedicated React Handbook starting sparsely with that one leaf;
3. Creating a narrow Handbook scoped specifically to `useEffect` callback
   isolation (for example `handbook-useeffect-callbacks`).

State which option is accepted, why the other two are rejected, and what
structure and coverage boundaries the accepted entrypoint must have. Do not
modify any repository files.

## Starting state

Supply the complete current five covered governance and authoring documents and
their required normative routes (including
[Skill-authoring reference](../../knowledge-base/plugin/references/agents/skill-authoring.md)
and
[Selection-trigger reference](../../knowledge-base/plugin/references/agents/selection-triggers.md)),
plus the description and package summary of `handbook-javascript-typescript`,
`handbook-software-engineering`, `handbook-product-experience`, and
`handbook-automated-testing` from the pre-React baseline stated in the task.

Keep the assessment grounded strictly in the covered authoring guidance and the
hypothetical pre-React baseline: do not inspect any React Knowledge or React
Handbook files that may exist in the surrounding checkout. Record the files
read and the decision rationale.

## Expected behavior

- R1 (critical): reject merging the React Knowledge route into
  `handbook-javascript-typescript` (option 1). Explain that React is a
  self-contained framework/domain system rather than JS/TS language-level
  guidance, and that co-selection of `handbook-javascript-typescript` on `.tsx`/`.jsx`
  code does not establish ownership of React's domain scene.
- R2 (critical): accept creating a dedicated `handbook-react` Handbook starting
  sparsely with the single curated React leaf (option 2), rejecting the
  misconception that a 1-leaf starting point is forbidden when the entrypoint
  owns a distinct, recognizable domain/framework context.
- R3 (critical): specify sparse-Handbook structure for the accepted entry under
  [Model a Handbook Skill](../../.agents/skills/maintain-knowledge-base/references/maintain-skill.md#model-a-handbook-skill)
  and
  [Skills and references](../../knowledge-base/AGENTS.md#skills-and-references):
  an empty foundation (no common React Knowledge across all React work yet), a
  cumulative conditional package for the Effect callback-isolation leaf (with
  its own focused-learning route), explicitly non-exhaustive coverage, and a
  valid no-match path for unrelated React work.
- R4 (critical): reject option 3 (`handbook-useeffect-callbacks`), explaining
  that while a distinct domain may start sparsely from 1 leaf, a Handbook must
  still not be scoped as a narrow 1:1 wrapper around a single leaf's specific
  topic or practice.

## Verification

Inspect the returned placement assessment and file-read list. A controlled
faulty assessment that forces the React leaf into
`handbook-javascript-typescript` merely because React uses JS/TS or because
only one leaf exists, that refuses any 1-leaf Handbook outright, or that accepts
a narrow `handbook-useeffect-callbacks` wrapper must fail the corresponding
critical criterion.

## Source

Reconstructed from maintenance triage of GitHub issue #278, where an initial
literal reading of "do not create a Handbook for one leaf" conflicted with
sparse-domain Handbook creation (`handbook-react`) alongside
`handbook-javascript-typescript`. GitHub issue #289 and ticket #293 reconciled
`Covered objects` and expectations after
[Model a Handbook Skill](../../.agents/skills/maintain-knowledge-base/references/maintain-skill.md#model-a-handbook-skill)
relocated from `skill-authoring.md` into `maintain-skill.md` alongside
[Product authoring rules](../../knowledge-base/AGENTS.md).
