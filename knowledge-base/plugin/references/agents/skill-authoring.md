# Agent Skill authoring

## Scope

Use this reference when writing or reviewing a reusable Agent Skill. A
**Workflow Skill** owns the decisions and actions that produce a user's result.
A **Handbook Skill** owns mandatory reading for a recognizable work context but
does not execute the user's task. **Knowledge** is canonical subject guidance
maintained independently of either Skill. This reference explains how to author
both kinds while keeping them portable, reliably selected, and supported by
behavioral evidence.

## When to update

Update this document when a real authoring or review case exposes a missing or
incorrect rule for responsibility choice, task or reading-scene modeling,
research, placement, selection, bundle structure, execution, or validation.

## Choose the Skill responsibility

Start from the user's work and the decisions or understanding it requires, not
from a requested file type, the first wording of a request, or an existing Skill
boundary. Use
[Classifying Knowledge and Skill material](knowledge-and-skills.md) to separate
four responsibilities:

- canonical subject understanding belongs in Knowledge;
- decisions and actions that produce a user's result belong in a Workflow Skill;
- selection and mandatory reading for a coherent task family, technical domain,
  or stable platform context belong in a Handbook Skill; and
- material selected only by one Skill step belongs in the Skill or a Skill
  reference.

Do not put execution into a Handbook or turn a reading route into a Workflow
whose promised result is merely that files were loaded. Do not copy Knowledge
into either kind. When proposed material mixes responsibilities, split and
stabilize the Knowledge owners before finalizing Workflow or Handbook routes.

## Model a Workflow Skill

Before designing the workflow, establish:

- the observable user result and realistic starting inputs, from minimal or
  disorganized requests to already settled specifications;
- the investigation, judgment, creative or technical decisions, actions, and
  quality control a competent practitioner performs;
- which facts the Agent can establish, which consequential choices require the
  user, which low-risk gaps the Agent may fill, and which conflicts or missing
  evidence must stop the work;
- adjacent tasks whose different input, result, or completion state makes them
  separate invocations; and
- success, failure, and stopping states by which the user can tell whether the
  task completed.

Treat these as design questions, not a form to copy into the Skill or a
questionnaire to impose on the user. Reuse settled conversation, artifacts,
project decisions, and prior work without making the Workflow repeat settled
research or decisions. Research the professional task before assuming the
current repository or author knowledge is complete. Read applicable Knowledge
and use current authoritative sources when the task depends on unfamiliar,
specialized, evolving, or quality-sensitive subject matter. Prefer primary
technical sources, professional institutions, established subject references,
and first-party practitioner material as appropriate to the domain. Convert
research into decisions the workflow can execute; a source or vocabulary list
is not a task model.

Treat a professional responsibility as required only when evidence ties it to
the promised result and omission creates an observable failure. A preferred
technique, optional enhancement, or subjective taste is not a blocking
requirement. A genuinely mechanical transformation may need little domain
research, but establish that from the task model rather than inferring it from a
short request or simple output format.

Draw Workflow boundaries around independently invoked user tasks. One Workflow
needs one triggering task and one complete result, even when it branches over
input states. Separate tasks that have different accepted input states, results,
completion states, privileged effects, or maintenance lifecycles even when they
share Knowledge.
Different professional domains can remain branches when the user task and
Workflow are the same, while similar subject matter remains separate when its
direction or completion differs. Do not use Skill-to-Skill orchestration as a
substitute for a correct task boundary or progressive disclosure.

## Model a Handbook Skill

Start from concrete user work and the understanding needed to make its decisions.
Inventory the canonical Knowledge responsibilities first; keep them separate
when their subject ownership or maintenance lifecycle differs even when they
must be read together.

Compare the proposed reading scene with every existing Handbook. Reuse or extend
an existing owner when it already covers the same user task family, technical
domain, or stable platform context. Add a Handbook only for a distinct native
entry that readers can recognize before opening another Skill. Do not create
one Handbook per Knowledge leaf or narrow scenario, and do not use
Handbook-to-Handbook orchestration to compensate for a weak boundary.

A Handbook body may contain:

- a **foundation**: Knowledge required for the Handbook's primary artifact work;
  and
- **conditional required-reading packages**: complete reading units selected
  from observable work, current materials, language, platform, production
  method, or task stage.

Include a foundation only when its Knowledge is genuinely common to the primary
scene. A Handbook with no common current Knowledge has a valid empty foundation.
Evaluate every package condition and require every match cumulatively. A focused
learning or explanation request about a package's subject is its own matching
condition and reads that package without forcing an unrelated artifact-work
foundation. Conditions must not require a risk, exception, or diagnosis that
the Knowledge is meant to reveal.

Use a complete canonical file or a complete context-sufficient section as the
reading unit. A section includes the definitions, premises, subsections, and
important exceptions needed to apply it independently.

Give shared reading-lifecycle rules one authoritative home. When a shared
policy is independently required at task start and recovery, it may own reuse,
rereading, and reassessment as work or context changes across Handbooks. Verify
that the policy is selected and applied alongside the subject Handbooks; do not
make those Handbooks invoke each other. Where no such shared policy exists,
the owning Handbook must supply the lifecycle rules itself.

A Handbook owns selection and reading obligations only. It has no user-task
procedure, side-effect contract, task failure state, output artifact, or task
completion gate. A broad platform Handbook routes the curated material that
exists and does not claim exhaustive platform coverage.

## Assign Knowledge, references, and bundle ownership

Complete missing independently retrievable understanding as Knowledge before
finalizing a Skill that depends on it. Workflows may read canonical Knowledge
directly at the step that requires it. Handbooks must link every required
canonical reading unit directly; they may not invoke or depend on another
Handbook or hide a route behind an unguaranteed Skill-to-Skill call.

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
registered name that makes the owned user task or reading context recognizable
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

For a Workflow, put the complete task-based invocation boundary in the
frontmatter description. By default, state the user-visible capability or result
and a short condition beginning with `Use when` or `Use before`. Use `Use before`
when selection must precede a proposal or action the Workflow constrains. Keep
examples and scenario lists out unless needed to distinguish an adjacent task.
A single sentence is acceptable when it expresses both parts clearly.

For a Handbook, write one short semantic applicability rule based on the user's
work or current material. Identify the task family, technical domain, or stable
platform context without enumerating foundations, packages, Knowledge topics,
or internal conditions. A user should not need the registered name or the
Handbook's own terminology to make it applicable.

## Write the executable workflow

Write the main path as ordered, direct, imperative task instructions. Keep the
invocation contract, primary states and decisions, reference selectors, failure
and stopping behavior, output contract, and completion criteria in `SKILL.md`.
Disclose supporting material when a step selects it and keep enough local
context to reach it at the right time, including when delayed retrieval improves
a long sequence or overgrown information hierarchy.

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

## Write a Handbook body

State that the Handbook supplies required understanding and remains supplemental
to the active project. Tell the Agent to evaluate the foundation and every
package condition from current observable work, read all matches, and avoid
choosing only the nearest package. Route directly to each complete canonical
file or context-sufficient section.

Make foundation applicability, focused learning, and cumulative package selection
explicit. Keep reuse and reassessment at the shared lifecycle owner when one
governs the reading scene, rather than copying its policy into every Handbook.
If no package matches in a sparse platform Handbook, continue without
loading unrelated material or implying that the platform is comprehensively
documented. Do not add a task procedure, completion criteria, or hidden
dependency on another Handbook.

## Review the composed bundle

Review the proposed and finished bundle as one selection graph using
[Maintained document quality](../../knowledge/documentation/maintained-document-quality.md#validate-the-result).
Trace realistic requests and starting states through native selection, body
instructions, every later selection decision, and the behavior each kind owns.
Establish whether each path receives its instructions at the time needed and
whether it must filter unrelated material. Account for information hidden until
after the decision that would need to select it.

For Workflows, trace actions, stopping behavior, outputs, and completion. For
Handbooks, trace description selection, foundation and package choices, actual
reading, and application as distinct events. Trace later-stage reassessment,
reuse, and recovery at the owner of the reading lifecycle.
Remove obsolete routes, superseded behavior, duplicated authority, patch-layered
qualifications, and references no current step selects. Intentional semantic
change and reader suitability require separate judgments.

## Prove the behavior

Treat a new Skill or material behavior change as incomplete until behavior is
demonstrated. Material changes include selection or exclusion, accepted inputs,
decision authority, professional responsibilities, states or branches,
Knowledge or reference selection, tools or effects, output contracts, failure
behavior, completion, or wording likely to change execution. Mechanical changes
may use reduced evidence only after semantics are confirmed unchanged.

Derive scenarios from the owned responsibility and realistic faults rather than
satisfying a fixed case count. Cover each applicable kind of evidence below or
explain concretely why it does not apply:

- **Native selection evidence:** in a fresh context with the real candidate set,
  use broad, direct, overlap, focused-learning, and adjacent
  negative requests as applicable. Record the choice before showing target
  bodies or expected selections.
- **Workflow evidence:** exercise underspecified and settled inputs, the principal
  complex branch, material conflicts or missing evidence, and attempts to skip
  investigation, action verification, or stopping behavior. When the task has a
  consequential action with an observable postcondition, include an applicable
  omitted, partial, interrupted, wrong-target, or unknown-result action and
  verify that the Workflow re-observes, reconciles, or stops instead of
  advancing as though the action completed.
- **Handbook package evidence:** after selection, give a fresh reader the current
  body and task context and record every selected and excluded package before
  expected choices. Exercise cumulative matches, empty foundations, valid
  no-match platform work, and changes that activate different foundations or
  packages within the same Handbook.
- **Reading and application evidence:** observe required file or section reads
  and their use in the task separately from metadata and package choices. A
  link, invocation event, or plausible answer alone does not establish reading
  and application.
- **Output evidence:** for Workflows, verify the promised result, professional
  minimum, declared inputs, constraints, format, and completion gate.

Keep generic lifecycle policy and its unit-level protection at the authoritative
owner. Subject cases protect their own conditions, direct routes, and
application. Retain a representative journey when the connection itself has a
distinct realistic fault: a foundation can become applicable after focused
learning, an ongoing Workflow can gain a conditional route, or a later artifact
can require a different execution target. One shared policy does not establish
that these domain connections work.

Choose staged cases by the contract at that connection. Separate independent
tasks when their shared topic or chronology is the only reason to combine them.
Moving lifecycle policy alone does not justify changing a case's task or
retiring its distinct protection. Where lifecycle is owned locally, that
owner's case protects it locally. A Workflow's own clarification, action, and
verification steps remain its execution responsibility.

Before running evidence, identify the comparison model for the evaluated task.
When one or more models materially authored the behavior, use the most capable
of them for that task. For human-only authorship, select the most capable
supported model available to the authoring environment. Record the model, basis
for selecting it, and exposed capability-relevant configuration. Run the
required self-sufficiency evidence with a different supported model that is
materially less capable for the task while retaining needed tools, modalities,
and context. Justify that baseline from relevant capability evidence rather
than model name or price. A lower reasoning setting on the same model is
insufficient. If the comparison or evidence cannot be established, report the
result as incomplete.

The lower-capability run must select or exclude the Skill correctly and follow
the behavior that its kind owns, or take an explicit supported stop. Invented
procedure, skipped decisions, omitted mandatory reading, and premature
completion are failures rather than acceptable model limits. Use a capable
independent reviewer for professional correctness, final-content suitability,
semantic change, and reader understanding.
Use the lower-capability run to test instruction self-sufficiency, not as the
sole judgment of professional correctness.
When the task itself exceeds the lower-capability model, a correct explicit stop
can demonstrate instruction robustness; the capable reviewer must still
establish procedure correctness and applicable output evidence.

Record every scenario, expected behavior, actual observation, source snapshot,
model and configuration, inherited environment, action evidence, and conclusion.
Include reasoning effort when available and the basis for treating each
lower-capability model as a suitable comparison.
Static checks establish frontmatter, links, formatting, metadata, packaging, and
route structure only within their actual boundaries. Compare trusted pre-change
and final bundles so every changed responsibility is intentional and reachable.

For a pull request or handoff that adds a Skill or materially changes one,
summarize the user work and starting inputs, responsibility kind and boundary,
professional or reading-scene research, authoritative Knowledge and reference
placement, and behavioral evidence. Keep review history in the pull request or
handoff; keep lasting rules in their authoritative Skill, Knowledge, or
reference. Missing applicable design or behavioral evidence makes the change
incomplete even when the prose appears plausible.
