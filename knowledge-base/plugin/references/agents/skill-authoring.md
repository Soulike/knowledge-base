# Agent Skill authoring

## Scope

Use this reference when writing or reviewing a reusable Agent Skill. An Agent
Skill packages reusable task workflows, domain guidance, or supporting
resources so an Agent can recognize when the guidance applies and carry it out
reliably. This reference explains how to model a Skill's responsibility,
structure its bundle, write clear instructions and selection descriptions,
review the composed Skill, and support material changes with behavioral
evidence.

## When to update

Update this document when a real authoring or review case exposes a missing or
incorrect rule for Skill responsibility boundaries, task or guidance modeling,
research, placement, selection, bundle structure, execution, or validation.

## Model the Skill and its boundaries

Start from the user's work and the decisions or understanding it requires, not
from a requested file type, the first wording of a request, or an existing Skill
boundary. Before designing a Skill, establish:

- the observable user result or guidance scope and realistic starting inputs,
  from minimal or disorganized requests to already settled specifications;
- the investigation, judgment, creative or technical decisions, actions, and
  quality control a competent practitioner performs;
- which facts the Agent can establish, which consequential choices require the
  user, which low-risk gaps the Agent may fill, and which conflicts or missing
  evidence must stop the work;
- adjacent tasks or scopes whose different input, result, or completion state
  makes them separate invocations; and
- success, failure, and stopping states by which the user can tell whether the
  task completed when the Skill guides execution.

Treat these as design questions, not a form to copy into the Skill or a
questionnaire to impose on the user. Reuse settled conversation, artifacts,
project decisions, and prior work without making the Skill repeat settled
research or decisions. Research the professional task before assuming the
current repository or author knowledge is complete. Read applicable
authoritative subject guidance and use current authoritative sources when the
task depends on unfamiliar, specialized, evolving, or quality-sensitive subject
matter. Prefer primary technical sources, professional institutions, established
subject references, and first-party practitioner material as appropriate to the
domain. Convert research into decisions and criteria the Skill can express or
execute; a source or vocabulary list is not a model.

Treat a professional responsibility as required only when evidence ties it to
the promised result and omission creates an observable failure. A preferred
technique, optional enhancement, or subjective taste is not a blocking
requirement. A genuinely mechanical transformation may need little domain
research, but establish that from the task model rather than inferring it from a
short request or simple output format.

Draw Skill boundaries around independently useful user tasks or cohesive
guidance scopes. Match the Skill's boundary to what it owns: a task-executing
Skill owns decisions, actions, stopping behavior, and completion for one
triggering task and one complete result, even when it branches over input
states; a guidance-only Skill supplies criteria or curated reading without
inventing a task procedure or completion gate, and a mere reading list should
not be packaged as an execution workflow. Separate Skills that have different
accepted input states, results, completion states, privileged effects, or
maintenance lifecycles even when they share subject matter. Different
professional domains can remain branches when the user task and Skill are the
same, while similar subject matter remains separate when its direction or
completion differs. Do not use Skill-to-Skill orchestration as a substitute for a
clear boundary or progressive disclosure.

## Organize the bundle and ownership

Keep reusable Skills portable. Resolve bundled resources relative to the Skill,
read shared packaged files directly, and discover project paths, policies,
domain rules, and external authorities from the active working directory. Do
not embed one downstream project's layout or private infrastructure in an
installed Skill. Treat packaged guidance as supplemental when active-project
instructions, requirements, Skills, or domain decisions conflict.
When a textual reference to another Skill is necessary, use its registered name
rather than an installation path.

Organize the bundle by responsibility, selection timing, consumers, and
maintenance lifecycle. Keep one authoritative copy of each rule. Split a
reference only when its selecting decision, consumers, responsibility, or
lifecycle differs; merge references when those properties coincide. File
length, step count, and reference count are not structural rules.

## Name and assemble the entrypoint

Follow the owning package and target clients' established entrypoint location,
manifest, frontmatter, and naming conventions. Choose a stable, descriptive
registered name that makes the owned user task or guidance context recognizable
without requiring readers to know the bundle's internal organization.

Keep the entrypoint and its supporting resources self-contained under the
distribution boundary that will travel together. When an authorized change
renames, replaces, or removes an entrypoint, update every known invocation and
consumer, remove superseded authoritative copies, and handle any compatibility
obligation through the owning package's explicit contract rather than assuming
one universal directory or naming scheme.

## Write the description

Apply [Design selection triggers](selection-triggers.md) before drafting and
retain its request cases for final checks.

Put the complete invocation boundary in the frontmatter description. For a
task-executing Skill, state the user-visible capability or result and a short
condition beginning with `Use when` or `Use before`, using `Use before` when
selection must precede a proposal or action the Skill constrains. For a
guidance-focused Skill, write one short semantic applicability rule based on the
user's work or current material so a reader can match it without knowing
internal terms or the registered name. Keep examples, internal steps, and
scenario lists out unless needed to distinguish an adjacent task. A single
sentence is acceptable when it expresses the boundary clearly.

## Write executable instructions

When the Skill guides a task, write the main path as ordered, direct,
imperative instructions. Keep the invocation contract, primary states and
decisions, supporting-file selectors, failure and stopping behavior, output
contract, and completion criteria in `SKILL.md`. Disclose supporting material
when a step selects it and keep enough local context to reach it at the right
time, including when delayed retrieval improves a long sequence or overgrown
information hierarchy. When a Skill instead routes conditional guidance or
criteria without owning a task procedure, state that it remains supplemental to
the active project, define each selection condition from observable work, and
link directly to complete files or self-contained sections.

Make each consequential decision owned and observable. Tell the Agent when to
investigate facts, inspect evidence, ask the user, follow an existing project
decision, make a low-risk choice, or stop. Do not describe required professional
dimensions as optional examples, and do not turn conditional attention into a
fixed checklist.

Bind each consequential action whose omission or incorrect execution could
still leave a plausible result to an observable postcondition before dependent
work advances. Identify the acted-on object and revision when relevant, the
postcondition, the observation that establishes it, and reconciliation or
stopping behavior for missing, partial, contradictory, or unknown results.
Re-observe after the action and compare the result with the postcondition. A
plan or instruction to act, the Agent's memory or assertion, and the mere
existence of an artifact are not evidence that the action completed. After
interruption or resume, re-observe current state from the last confirmed
boundary before continuing.

Define completion as the promised user result with material constraints
satisfied, not merely creation of an artifact. Include the quality or feasibility
checks a competent practitioner performs before delivery. Keep output
requirements close enough to the completion gate that later branches cannot
silently bypass them.

## Review the composed bundle

Review the proposed and finished bundle as one selection graph using
[Maintained document quality](../../knowledge/documentation/maintained-document-quality.md#validate-the-result).
Trace realistic requests and starting states through native selection, body
instructions, every later routing or reference decision, and the behavior the
Skill owns. Establish whether each path receives its instructions at the time
needed and whether it must filter unrelated material. Account for information
hidden until after the decision that would need to select it.

Trace description selection, conditional reading or reference choices, actual
reading and application, actions, stopping behavior, outputs, and completion as
distinct events as applicable to the Skill's design. Remove obsolete routes,
superseded behavior, duplicated authority, patch-layered qualifications, and
references no current step selects. Intentional semantic change and reader
suitability require separate judgments.

## Prove the behavior

Treat a new Skill or material behavior change as incomplete until behavior is
demonstrated. Material changes include selection or exclusion, accepted inputs,
decision authority, professional responsibilities, states or branches, guidance
or reference selection, tools or effects, output contracts, failure behavior,
completion, or wording likely to change execution. Mechanical changes may use
reduced evidence only after semantics are confirmed unchanged.

Derive scenarios from the owned responsibility and realistic faults rather than
satisfying a fixed case count. Cover each applicable kind of evidence below or
explain concretely why it does not apply:

- **Native selection evidence:** in a fresh context with the real candidate set,
  use broad, direct, overlap, focused-learning, and adjacent negative requests
  as applicable. Record the choice before showing target bodies or expected
  selections.
- **Execution evidence:** when the Skill guides a task, exercise underspecified
  and settled inputs, the principal complex branch, material conflicts or
  missing evidence, and attempts to skip investigation, action verification, or
  stopping behavior. When the task has a consequential action with an
  observable postcondition, include an applicable omitted, partial, interrupted,
  wrong-target, or unknown-result action and verify that the Skill re-observes,
  reconciles, or stops instead of advancing as though the action completed.
- **Conditional routing evidence:** when the Skill selects internal references
  or conditional guidance, give a fresh reader the current body and task
  context and record every selected and excluded item before expected choices.
  Exercise multi-match combinations, valid no-match requests, and work-context
  changes that activate different conditions.
- **Reading and application evidence:** observe required file or section reads
  and their use in the task separately from metadata and routing choices. A
  link, invocation event, or plausible answer alone does not establish reading
  and application.
- **Output evidence:** when the Skill defines an output or completion state,
  verify the promised result, professional minimum, declared inputs,
  constraints, format, and completion gate.

Separate independent task scenarios unless a multi-stage transition exposes a
distinct connection risk—such as an ongoing task gaining a newly applicable
condition or changing targets. Before running evidence, select the comparison
model and the materially less capable executor baseline (and mark the result
incomplete when either cannot be established) using the model-selection rules in
[Prepare independent observations](reader-understanding.md#prepare-independent-observations),
and follow [Agent behavioral evaluation](behavioral-evaluation.md) for
fresh-context isolation, inherited boundary recording, evaluator-only
withholding, the canonical executor instructions guard, blind selection and
application dispatch templates, contamination handling, execution recording,
result classification, and attempt retention.

The lower-capability run must select or exclude the Skill correctly and follow
the behavior that the Skill owns, or take an explicit supported stop. Invented
procedure, skipped decisions, omitted mandatory reading, and premature
completion are failures rather than acceptable model limits. Use a capable
independent reviewer for professional correctness, final-content suitability,
semantic change, and reader understanding, applying
[Verify reader understanding](reader-understanding.md) to verify cross-model
reader comprehension through actual reader paraphrase, concrete application
decisions, and reported confusion or ambiguity observations, following
[its run-reuse and neutral-follow-up rules](reader-understanding.md#prepare-independent-observations).
Use the lower-capability run to test instruction self-sufficiency, not as the
sole judgment of professional correctness.
When the task itself exceeds the lower-capability model, a correct explicit stop
can demonstrate instruction robustness; the capable reviewer must still
establish procedure correctness and applicable output evidence.

Record every scenario, expected behavior, actual observation, source snapshot,
model and configuration, inherited environment, action evidence, and conclusion.
Include reasoning effort when available and the basis for treating each
lower-capability model as a suitable comparison, and retain all material
attempts per
[Agent behavioral evaluation](behavioral-evaluation.md#judge-and-retain-attempts).
Static checks establish frontmatter, links, formatting, metadata, packaging, and
route structure only within their actual boundaries. Compare trusted pre-change
and final bundles so every changed responsibility is intentional and reachable.

## Prepare pull-request and handoff evidence

For a pull request or handoff that adds a Skill or materially changes one,
prepare a concise, directly reviewable summary from the complete evidence
record established above. Retain every applicable part needed to judge whether
the change is complete:

- user work and starting inputs, Skill boundary, domain or task research,
  existing-Skill comparison, and authoritative guidance and reference placement;
- the final source snapshot and each material scenario's expected behavior,
  each executor and configuration that produced an observation, the actual
  observation, and conclusion across selection, application, reading, output,
  and reader understanding as applicable; for reader-understanding entries,
  preserve the
  [required observations](reader-understanding.md#required-evidence)—actual
  reader paraphrase, concrete application decisions, and reported confusion or
  ambiguity tied to the relevant passages—rather than topic-only notes or an
  aggregate pass summary;
- the material author, comparison model, lower-capability executor, and capable
  reviewer model identities, together with exposed provider and
  capability-relevant configuration such as reasoning effort and inherited
  context;
- the task-relevant capability evidence that establishes why the
  lower-capability executor is materially less capable than the comparison
  model while retaining the tools, modalities, and context the task requires;
  and
- material failed, contaminated, superseded, or incomplete attempts, the
  executor and configuration associated with each, their dispositions,
  independent judgments, unresolved evidence, and remaining limitations per
  [Agent behavioral evaluation](behavioral-evaluation.md#judge-and-retain-attempts).

Concision may remove raw transcripts, repeated procedure, and intermediate
author reasoning. It must not replace required identities, decision bases,
observations, attempt outcomes, or limits with an aggregate claim that checks
passed. A linked evidence record may carry supporting detail only when the
reviewer can access it and the pull request or handoff still identifies the
applicable final source, models, scenarios, conclusions, and limitations.
Within that summary, keep each scenario or attempt's executor and
capability-relevant configuration adjacent to its observation or outcome. A
separate model roster or machine-only sibling field does not establish that
association for a pull-request or handoff reader.

Keep review history in the pull request or handoff; keep lasting rules and
subject understanding in their authoritative Skill, documentation, or reference.
State why an evidence kind does not apply instead of silently omitting it.
Missing applicable design or behavioral evidence makes the change incomplete
even when the prose appears plausible.
