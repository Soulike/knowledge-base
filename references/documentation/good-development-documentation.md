# Good development documentation

Good development documentation helps a specific reader complete a recurring
software development task without reconstructing important information from
scattered sources. Its quality depends on three choices: what deserves to be
documented, which form can keep that information current, and how clearly and
reliably the document explains it.

In this reference, development documentation means maintained explanatory or
instructional content for people or Agents working on software. It includes
standalone documents, source comments and docstrings, generated references,
how-to guides, runbooks, decision records, source indexes, Agent instructions,
and Skills. The content's purpose, rather than its location or file extension,
determines whether this guidance applies.

Put another way, this guidance applies to any maintained text—inside or outside
source files—whose purpose is to help people or Agents understand, change,
verify, use, or operate software.

## Contents

- [Document information readers will need again](#document-information-readers-will-need-again)
- [Choose a form that can keep the information current](#choose-a-form-that-can-keep-the-information-current)
- [Write so the reader can trust the explanation](#write-so-the-reader-can-trust-the-explanation)

## Document information readers will need again

Start by evaluating whether the reader's need can be met without maintained
documentation. Create or expand a document when current evidence identifies a
recurring audience, a task the document would support, information or
navigation for which it would be authoritative, and blocked work or meaningful
mistakes it would prevent. Once the need is justified, choose the lightest
suitable form and record only the information it owns.

Every maintained fact, rule, decision, or explanation should have one
authoritative source: the place expected to change when that information
changes. A document should state information only when the document is that
source. If code, configuration, a schema, CLI help, a generated reference, or
another document already provides the information, link to it instead of
restating or summarizing it. A hand-maintained copy becomes invalid as soon as
its authoritative source changes.

Code, configuration, schemas, CLI help, and generated references are usually
authoritative for facts that directly describe executable behavior. Maintained
prose should instead be authoritative for information those sources cannot
express clearly: concepts, boundaries, intent, rationale, interactions, failure
modes, or the way several sources fit together.

Sometimes the authoritative sources are accurate but scattered, difficult to
find, or unclear in how they divide responsibility. A source index can be
authoritative for the map between questions and sources: it identifies the
question each source answers, links to the source, and explains how the sources
relate. It must not repeat or summarize the facts held by those sources.

Plans, rollout status, investigation notes, and one-time evidence usually
belong in issues, pull requests, proposals, or incident records. A durable
constraint or rationale discovered there belongs in maintained documentation
only when future work still depends on it.

For example, copying a command's current default value from generated `--help`
into a guide creates a second fact that can drift. A guide is useful when it
explains why a reader would choose a non-default value, how that choice
interacts with other settings, or where to find the current value.

## Choose a form that can keep the information current

Choose the form whose normal maintainers and update triggers can keep the
information correct. That form becomes the authoritative source for the
information assigned to it and must not copy facts assigned elsewhere. These
are defaults; the active project decides the exact file, directory, owner, and
navigation.

| Information need                                                                      | Fitting form                                                  | Why it fits                                                                                    |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Current executable behavior or interface facts                                        | Code, configuration, schema, CLI help, or generated reference | The implementation or generator can keep the facts synchronized.                               |
| Authoritative sources that are scattered or difficult to discover                     | Source index                                                  | It owns the routing between questions and sources, not the answers.                            |
| Non-obvious intent, rationale, invariant, or failure mode local to one implementation | Source comment or docstring                                   | Readers encounter it while changing the code that can make it stale.                           |
| Evidence that a contract holds                                                        | Test or executable example                                    | The project can run the evidence against the implementation.                                   |
| Concepts, architecture, boundaries, or rationale used across implementation sites     | Maintained explanation or design document                     | It can own an explanation that no single implementation site provides.                         |
| Steps for a known development goal                                                    | How-to guide                                                  | It owns the sequence and decision guidance while linking to external interface facts.          |
| Operational response under concrete conditions                                        | Runbook                                                       | It owns the response sequence while linking to commands and interfaces defined elsewhere.      |
| A durable decision and the reasons known when it was made                             | Decision record                                               | Later readers need the choice and its context without treating old status as current behavior. |
| Decisions, tools, and completion criteria for a recurring Agent task                  | Agent Skill                                                   | The information controls execution rather than merely explaining a subject.                    |

A comment is a good home for an invariant coupled to one function; it is a poor
home for an architectural rule that readers need across several modules. A
separate guide has the opposite trade-off. Tests can demonstrate behavior, but
they explain a public contract only when the project treats them as that
contract or makes clear that readers should consult them.

Choosing a form does not choose its file path. Repository layout, naming,
ownership, and navigation are project decisions. When the project has not
selected a destination, leave that choice unresolved rather than inventing a
universal directory convention.

## Write so the reader can trust the explanation

### Ground claims in current evidence

Before writing a claim, decide whether the document is its authoritative source.
If it is, verify the claim against current evidence, state the conditions under
which it holds, and distinguish a required rule from an observation or example.
If another source owns the claim, replace it with a direct link to that source.
This applies even when the copied detail appears stable: ownership, not an
estimate of how often something changes, determines where it should be stated.

Keep maintained documentation aligned with the current state. When a fact,
rule, or design changes, rewrite the affected explanation so the document
remains correct as a whole. Replace superseded wording rather than appending
change notes or qualifications that make readers reconstruct its history.
Record history in version control, decision records, or changelogs when the
history itself matters.

### Make the reasoning easy to follow

Use concrete subjects and direct actions. Introduce a term before relying on
it, connect unfamiliar ideas to the reader's task, and move from a concrete
case to the more general rule. Headings should help readers find the question
they are trying to answer, and each paragraph should carry one main idea.

Prefer familiar, concrete words. Use a technical term only when it is more
precise than ordinary language and the intended reader needs it; define it
before use. Introduce an abstract concept only when it marks a real distinction
that changes how the reader understands or acts. Do not invent a label or
framework for an idea that can be stated directly. When a sentence hides the
actor, object, action, condition, or result behind abstract nouns, rewrite it
to name those things.

For example, “Authorize the resource at the use boundary” leaves both the
actor and action unclear. “Immediately before opening the file, check whether
the caller may perform the requested operation” states who checks what and
when.

### Use examples and analogies deliberately

An example should show a representative situation, the relevant choice, and
the resulting behavior. It should be small enough to understand without
unrelated setup and should not silently become the only supported case.

An analogy can give readers an intuitive starting point, but it cannot
establish a technical claim. Follow it with the literal rule and name the point
where the comparison stops matching. Saying “a pathname is like an address”
can introduce name-to-object lookup; it does not prove how renames, links, or
open handles behave on a real filesystem.

### Read the finished document as its audience

A reliable final review asks whether the intended reader can find the needed
answer, understand why it is true, recognize its conditions and limits, and
act without guessing at missing context. Claims, examples, links, headings,
and navigation should all support that task and describe the same current
behavior and design.
