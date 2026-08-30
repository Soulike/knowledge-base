# Agent Skill authoring

## Scope

Use this reference when writing or reviewing a reusable Agent Skill. It defines
how to turn a real user task into a portable, reliably invoked workflow that
contains enough professional understanding, decisions, and behavioral evidence
to produce its promised result.

## When to update

Update this document when a real authoring or review case exposes a missing or
incorrect rule for task modeling, professional research, responsibility
placement, invocation, workflow behavior, bundle structure, or validation.

## Define the real task

Start from the result the user is trying to obtain, not from the requested file
type, the first wording of the request, or the boundaries of an existing Skill.
Before designing the workflow, establish:

- the observable user result and the range of realistic starting inputs, from
  minimal or disorganized requests to already settled specifications;
- the investigation, judgment, creative or technical decisions, and quality
  control a competent practitioner performs to produce that result;
- which facts the Agent can establish, which consequential choices require the
  user, which low-risk gaps the Agent may fill, and which conflicts or missing
  evidence must stop the work;
- the adjacent tasks whose different inputs, result, or completion state make
  them separate invocations; and
- the success, failure, and stopping states by which the user can tell whether
  the task was completed.

Treat those points as design questions, not as a form to copy into the Skill or
a questionnaire to impose on the user. Use information already available from
the conversation, artifacts, project, or prior work regardless of how it was
obtained, and do not make the workflow repeat settled research or decisions.

Research the professional task before treating the current repository or the
author's prior knowledge as complete. Read applicable existing Knowledge, then
use current authoritative sources when the task depends on unfamiliar,
specialized, evolving, or quality-sensitive subject matter. Prefer primary
technical sources, professional institutions, established subject references,
and first-party practitioner material as appropriate to the domain. Convert the
research into decisions the workflow can execute; a source list or vocabulary
list is not a substitute for professional task understanding.

Treat a professional responsibility as required only when current evidence ties
it to the promised result and its omission creates an observable failure. A
reviewer's preferred technique, optional enhancement, or subjective taste does
not establish a blocking requirement.

A Skill that performs a genuinely mechanical transformation may require little
domain research, but reach that conclusion from the task model rather than
assuming it from a short user request or simple output format.

## Assign knowledge and execution responsibilities

Use [Classifying Knowledge and Skill material](knowledge-and-skills.md) to place
each part by its retrieval and execution responsibility. Independently
retrievable subject understanding belongs in Knowledge, task execution belongs
in the Skill, and supporting material selected only after invocation belongs in
the Skill or a Skill reference. Complete missing Knowledge before finalizing a
workflow that depends on it.

Draw Skill boundaries around independently invoked user tasks. A separate Skill
needs its own triggering task, accepted input state, user-visible result, or
completion state. Different professional domains can remain branches of one
Skill when the user task and workflow are the same, while two tasks that share
the same Knowledge remain separate Skills when their direction or completion
differs. Do not use Skill-to-Skill orchestration as a substitute for a correct
task boundary or progressive disclosure.

Keep reusable Skills portable. Resolve bundled resources relative to the Skill,
read shared packaged files directly unless the client guarantees orchestration,
and discover project paths, policies, domain rules, and external authorities
from the active working directory. Do not embed one downstream project's layout
or private infrastructure in a usage Skill. When a textual reference to another
Skill is necessary, use its registered name rather than an installation path.

Organize the bundle by responsibility, selection timing, consumers, and
maintenance lifecycle rather than by edit history. Keep one authoritative copy
of each rule. Split a reference only when its selecting decision, consumers,
responsibility, or lifecycle differs; merge references when those properties
coincide. File length, step count, and reference count are not structural rules.

## Write the executable workflow

Put the complete general task condition and every distinct trigger branch in
the frontmatter description. Add examples only after the general condition and
only when they distinguish a boundary. A user should not need to know the Skill
name or repeat the description's terminology to invoke it.

Write the main path as ordered, direct, imperative task instructions. Keep the
invocation contract, primary states and decisions, reference selectors, failure
and stopping behavior, output contract, and completion criteria in `SKILL.md`.
Disclose supporting facts, criteria, or procedures when a workflow step selects
them, including when delayed retrieval improves a long sequence or overgrown
information hierarchy. Keep enough context in the main file to reach them at
the right time.

Make every consequential decision owned and observable. Tell the Agent when to
investigate facts, inspect supplied evidence, ask the user, follow an existing
project decision, make a low-risk choice, or stop. Do not describe important
professional dimensions merely as optional examples when omitting them can
prevent the promised result. At the same time, do not turn attention points
into a fixed checklist when their relevance depends on the task.

Define completion as the promised user result with its material constraints
satisfied, not merely as producing a file, prompt, report, or other artifact.
Include quality review or feasibility checks when a competent practitioner
would use them before delivery. Keep output requirements close enough to the
completion gate that later branches cannot silently bypass them.

Read the finished bundle as one selection graph. Remove obsolete routes,
superseded behavior, duplicated rules, patch-layered qualifications, and
references that no current workflow step selects. The result should present one
coherent current workflow without requiring the reader to reconstruct its edit
history.

## Prove the behavior

Treat a new Skill or a material behavior change as incomplete until its actual
behavior is demonstrated. A material change includes invocation or exclusion
conditions, accepted inputs, user or Agent decision authority, professional
responsibilities, workflow states or branches, Knowledge or reference
selection, tools or side effects, output contracts, failure behavior, completion
criteria, or any wording likely to change execution. Purely mechanical changes
may use proportionally smaller evidence only after confirming that semantics did
not change.

Derive scenarios from the task model and its risks rather than satisfying a
fixed case count. Cover each applicable kind of evidence or explain concretely
why it does not apply:

- **Invocation evidence:** in a fresh or isolated context with the real
  candidate set, use natural positive and adjacent negative requests without
  revealing the expected Skill name or the author's conclusion.
- **Workflow evidence:** exercise underspecified and already settled inputs, the
  principal complex branch, material conflicts or missing evidence, and inputs
  likely to tempt the Agent to skip investigation, decisions, or stopping
  behavior.
- **Output evidence:** verify the user-visible result, professional minimum,
  declared inputs, material constraints, format, and completion gate rather than
  checking only that an artifact was emitted.

Record the scenario, expected behavior, observed behavior, and conclusion.
Static validation still checks frontmatter, links, formatting, metadata,
packaging, and complete routes, but it cannot replace semantic evidence for
behavior it does not execute. Compare the trusted pre-change and final bundles
so every changed responsibility is intentional and remains reachable.

For a pull request that adds a Skill or materially changes one, summarize the
user result and realistic starting inputs, professional task and research,
responsibility boundaries and placement, and behavioral evidence. Keep this
review evidence in the pull request or handoff rather than creating a permanent
design-history document. Put every durable rule or subject insight in its
authoritative Skill, Knowledge, or reference. Missing applicable design or
behavioral evidence makes the change incomplete even when the prose appears
plausible.
