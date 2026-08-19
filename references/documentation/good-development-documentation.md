# Good development documentation

Good development documentation helps a specific reader complete a recurring
software development task without reconstructing important information from
scattered sources. Its quality depends on three choices: what deserves to be
documented, which form can keep that information current, and how clearly and
reliably the document explains it.

In this reference, development documentation means maintained explanatory or
instructional material for people or Agents working on software. It can appear
in standalone documents, source comments and docstrings, examples, prompts,
Agent instructions, and Skills. Its purpose, rather than its file extension or
location, determines whether this guidance applies.

## Contents

- [Document information readers will need again](#document-information-readers-will-need-again)
- [Choose a form that can keep the information current](#choose-a-form-that-can-keep-the-information-current)
- [Write so the reader can trust the explanation](#write-so-the-reader-can-trust-the-explanation)

## Document information readers will need again

Start by asking whether the reader's need can be met without maintained
documentation. Create or retain documentation when current evidence identifies
a recurring audience and task, information or navigation that the audience
cannot recover reliably from existing sources, and a meaningful mistake or
blocked task that the documentation would prevent. Choose the lightest form
that meets the justified need.

Every maintained fact, rule, decision, or explanation has one authoritative
source: the place expected to change when that information changes. A document
states information only when it is that source. When code, configuration, a
schema, CLI help, a generated reference, or another document owns the
information, link readers to that source. A hand-maintained restatement becomes
wrong as soon as its source changes.

A generated reference may project facts from another source when regeneration
is part of the same update path. It remains a mechanically synchronized view,
not an independently maintained explanation.

Code, configuration, schemas, CLI help, and generated references usually own
facts about executable behavior. Maintained prose is useful when it owns
understanding those sources cannot express clearly: concepts, boundaries,
intent, rationale, interactions, failure modes, or the way responsibilities are
divided.

A source index closes a different gap. It owns mappings from readers' questions
to authoritative sources when those sources are scattered or difficult to
discover. For each question, name and link the source that answers it; leave the
answer and its explanation in that source. Organize entries so readers can
choose a destination before opening it.

Plans, rollout status, investigation notes, and one-time evidence usually
belong in issues, pull requests, proposals, or incident records. Move a durable
constraint or rationale into maintained documentation only when future work
still depends on it.

For example, copying a command's current default value from generated `--help`
into a guide creates a second fact that can drift. A guide adds durable value
when it explains why a reader would choose a non-default value, how that choice
interacts with other settings, or where to find the current value.

## Choose a form that can keep the information current

Choose the form whose normal readers, maintainers, and update triggers match
the information. The form becomes authoritative only for the information
assigned to it.

| Information need                                                                      | Fitting form                                                  | Why it fits                                                                                         |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Current executable behavior or interface facts                                        | Code, configuration, schema, CLI help, or generated reference | The implementation or generator can keep the facts synchronized.                                    |
| Authoritative sources that are scattered or difficult to discover                     | Source index                                                  | It owns question-to-source mappings while the linked sources own the answers.                       |
| Non-obvious intent, rationale, invariant, or failure mode local to one implementation | Source comment or docstring                                   | Readers encounter it while changing the code that can make it stale.                                |
| Evidence that a contract holds                                                        | Test or executable example                                    | The project can run the evidence against the implementation.                                        |
| Concepts, architecture, boundaries, or rationale used across implementation sites     | Maintained explanation or design document                     | It can own understanding that no single implementation site provides.                               |
| Steps for a known development goal                                                    | How-to guide                                                  | It owns the sequence and decisions while linking to commands and interfaces defined elsewhere.      |
| Operational response under concrete conditions                                        | Runbook                                                       | It owns the response sequence while linking to current operational interfaces.                      |
| A durable decision and the reasons known when it was made                             | Decision record                                               | Later readers need the choice and its context without treating old status as current behavior.      |
| Stable project rules and routes that must affect matching Agent tasks                 | Agent instruction                                             | It keeps mandatory rules in the instruction hierarchy and routes conditional detail to its sources. |
| Decisions, tools, and completion criteria for a recurring Agent task                  | Agent Skill                                                   | The information controls execution rather than merely explaining a subject.                         |

Use a live or generated source for a changing inventory. A hand-maintained
inventory fits only when completeness affects an outcome and generation or
mechanical validation keeps it complete.

Choosing a form does not choose its address. The active project decides the
file, directory, owner, and navigation. Leave an undetermined destination as a
project decision.

Make each document's responsibility and maintenance boundary apparent. A
reader should be able to tell which question the document answers and which
changes require it to be reviewed. Immediate context may supply that boundary
for a local artifact; a standalone document usually states it explicitly.

## Write so the reader can trust the explanation

### Ground claims in current evidence

Before writing a claim, determine which source owns it. Verify a claim owned by
the document against current evidence, state the conditions under which it
holds, and distinguish required rules from observations and examples. Replace
a claim owned elsewhere with a direct link to its source.

When documentation says the system enforces an invariant, check the documented
rule, its enforcement mechanism, and the evidence that demonstrates it as one
claim. A change to any member requires reassessing the other two.

### Write source comments and docstrings at the implementation boundary

Use a source comment or docstring for non-obvious intent, rationale, invariant,
or failure mode local to one implementation. Place it beside the smallest code
boundary that supplies its context and can make it stale. Use a separate
explanation for architecture, boundaries, or rationale shared across
implementation sites. When a docstring forms part of a public API contract,
follow that contract and the project's language and documentation tooling.

State the reason, condition, or consequence that changes how a maintainer
should understand or modify the code. Leave mechanics already apparent from
the implementation to the implementation. Prefer claims that survive
incidental file names, symbol names, or counts. A claim of precedent such as
“matches another implementation” should identify evidence actually inspected.

Treat a factual comment or docstring as an assertion about the implementation.
Check it against both the code and the source that owns the relevant contract.
Update it in the same change when its assertion changes, and delete it when the
implementation makes its information clear or the information no longer serves
a recurring need. Sweep existing source prose whenever a code change can make
it false.

### Describe the current state as one coherent account

Keep maintained documentation aligned with the current state. When a fact,
rule, or design changes, rewrite the affected explanation so the document is
correct as a whole. Replace superseded wording instead of appending revision
notes or qualifications. Record history in version control, decision records,
or changelogs when the history itself matters. Record proposed behavior as a
tracked future action rather than a present property of the system.

### Make the reasoning easy to follow

Use concrete subjects and direct actions. Introduce a term before relying on
it, connect unfamiliar ideas to the reader's task, and move from a concrete
case to the more general rule. Use headings that help readers find their
question, and give each paragraph one main idea.

Prefer familiar, concrete words. Use a technical term only when it is more
precise than ordinary language and the intended reader needs it; define it
before use. Introduce an abstract concept only when it marks a distinction that
changes how the reader understands or acts. Rewrite sentences that hide the
actor, object, action, condition, or result behind abstract nouns.

For example, “Authorize the resource at the use boundary” leaves both the actor
and action unclear. “Immediately before opening the file, check whether the
caller may perform the requested operation” states who checks what and when.

### Use examples and analogies deliberately

An example should show a representative situation, the relevant choice, and
the resulting behavior. Keep it small enough to understand without unrelated
setup, and state the broader rule so the example does not silently become the
only supported case.

An analogy can give readers an intuitive starting point, but it cannot
establish a technical claim. Follow it with the literal rule and name where the
comparison stops matching. Saying “a pathname is like an address” can
introduce name-to-object lookup; it does not prove how renames, links, or open
handles behave on a real filesystem.

### Read the finished document as its audience

Check whether the intended reader can find the needed answer, understand why
it is true, recognize its conditions and limits, and act without guessing at
missing context. Claims, examples, links, headings, and navigation should all
support that task and describe the same current behavior and design.
