# Software-development documentation

## Scope

This document defines the authority, synchronization, and validation
responsibilities created when maintained documentation describes executable,
versioned, or operated software. It covers public contracts, implementation and
runtime behavior, declarations and machine-readable descriptions, generated
references, executable evidence, source commentary, operational guidance,
decision records, and documentation impact from software changes.

## When to update

Update this document when evidence changes the durable relationship among
software contracts, implementation or runtime behavior, machine-enforced
descriptions, generated documentation, executable evidence, operational
response, decision history, or software-change impact.

## Assign authority by claim facet

No artifact is the universal source of truth for every software claim. First
identify the exact facet a reader depends on, then establish which source owns
the intended claim and which evidence can show whether it currently holds.

| Artifact                                           | What it can establish                                                                                         | What it does not establish by itself                                                     |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Public API specification or contract documentation | Caller-visible guarantees, constraints, failures, and compatibility commitments assigned to it by the project | Whether each implementation currently conforms                                           |
| Implementation and observed runtime                | What one version and environment does                                                                         | Whether that behavior is intended, supported, portable, or promised                      |
| Type or interface declaration                      | Names, signatures, types, and represented structure                                                           | Rationale, temporal behavior, side effects, operational limits, or many relationships    |
| Enforced schema or configuration                   | Constraints and defaults the consuming system actually validates or applies                                   | Meaning or behavior not enforced by that consumer                                        |
| Parser metadata and derived CLI help               | Options, operands, usage, and defaults generated from the parser's owned data                                 | Goal-oriented choice, interactions, or operational consequences omitted by the generator |
| Generated reference                                | A mechanically derived view of its inputs at generation time                                                  | Independent authority for missing semantics or unsuitable exposed detail                 |
| Test or executable example                         | Evidence for the exercised cases and environment                                                              | The complete intended contract, unsupported cases, or rationale                          |
| Maintained prose                                   | Concepts, intent, decisions, task guidance, failure models, and relationships assigned to it                  | Automatic synchronization with executable behavior                                       |

Establish the basis and scope of each obligation from a supported consumer,
public guarantee, compatibility commitment, or accepted project decision.
State required values and outcomes separately from the mechanisms that produce
them; prescribe a mechanism only when the owning contract requires it.
Distinguish obligations from recommendations and example-specific choices. A
concrete recipe can prescribe names and values; make clear which prerequisites
belong to that recipe and which belong to the underlying interface. Readers
adapting the example retain the choices that the interface permits.

When sources disagree, determine whether the defect belongs to the
implementation, documentation, generator, test, or an unresolved contract
decision. Evaluate a stated requirement's basis as well as whether the code
implements it. Do not silently choose the implementation merely because it
executes, or the prose merely because it states an intention.

Treat a declared field according to what its consumer enforces. A schema
annotation, example, or stated default does not prove validation or defaulting
behavior. Conversely, a machine-enforced constraint can own its represented
facet while leaving rationale, cross-field meaning, and operational consequences
to maintained explanation.

## Separate public contracts from implementation commentary

Public reference documentation owns a systematic caller-facing surface when a
project assigns it contractual authority. Cover observable behavior, inputs,
outputs, boundaries, defaults, side effects, failures, lifecycle status, and
compatibility commitments without turning incidental implementation detail into
a promise.

Reader confusion can expose missing information or a design problem. Ambiguous
names, mixed responsibilities, or unnecessary distinctions may warrant a design
finding before more prose preserves the confusion. Explain necessary complexity
and supported architectural distinctions; needing an explanation does not by
itself establish a design defect. Reporting a design finding does not authorize
an implementation change.

Source comments instead explain non-obvious local intent, assumptions,
invariants, ownership, synchronization, lifetime, tradeoffs, or failure modes.
Place them beside the smallest implementation boundary that supplies their
context and can make them stale. Do not restate mechanics already apparent from
the code.

A docstring can serve either responsibility. Its location beside a declaration
does not decide whether it is a public contract, generated-reference input, or
maintainer explanation; the language and active project's contract do. Update
or remove commentary when the implementation or public contract invalidates it.

## Derive and test documentation carefully

Generate reference facts from declarations, schemas, interface descriptions,
parser metadata, or other executable sources only when those inputs really own
the represented facts and generation is part of their update path. Review the
generated result separately for omitted semantics, misleading organization,
unsafe examples, and internal detail that should not become public.

Validate an executable example when the cost of drift or reader reuse justifies
it. Check its described facts against their respective authorities while
preserving choices that the contract permits. Editorial review also checks
whether the example is representative, safe, and comprehensible.

Before enforcing equality between artifacts, establish why their synchronization
is required. A generation relationship, compatibility commitment, or deliberate
promise to publish a matching example can justify it. Evaluate that promise's
reader or product value before retaining it; current equality or an author's
claim that the check prevents drift does not establish the need. Update the
promise and its validation together when that need changes.

Treat tests as evidence for their exercised cases and asserted relationships.
Establish expected behavior independently: artifacts can agree while sharing a
defect. A justified equality check protects synchronization; compilation,
execution, and output comparisons provide only the protection their cases and
assertions establish. None supplies the complete intended contract.

## Give operational and decision records distinct jobs

A software runbook or playbook owns response under concrete operational
conditions. State the trigger, affected system and impact, prerequisites and
access, safe diagnostics, mitigation, recovery or resolution, verification,
escalation, and stop conditions that responders need. Reassess it when alerts,
topology, dependencies, permissions, commands, or production behavior change.
When responders repeatedly execute a deterministic procedure, consider moving
that behavior into automation while retaining the judgment and failure handling
that still need guidance.

An architectural decision record owns why a consequential decision was made in
its original context, the alternatives considered, and the consequences. Keep
its historical state and mark rejection or supersession rather than rewriting
it as though the latest choice was always in force. A current architecture
explanation instead owns the coherent present model.

## Treat documentation impact as software-change impact

For every change to implementation, public interfaces, configuration semantics,
schemas, CLI behavior, feature exposure, deprecation, operational procedure, or
test or example expectations, identify which maintained claims and generated
views can become false. For each affected facet:

1. identify its authority and current consumers;
2. determine whether the update can be derived or checked mechanically;
3. update the explanations, task guidance, migration material, and operational
   procedures that still require human judgment; and
4. define the publication point at which software behavior and documentation
   become consistent for readers.

Deliver documentation with the behavior when readers can encounter the change
immediately. Versioned products or staged releases may need separate publication
mechanics, but they still require an explicit synchronization point.
