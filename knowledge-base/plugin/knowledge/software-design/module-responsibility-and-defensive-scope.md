# Module responsibility and defensive scope

## Scope

This document defines a responsibility-based model for deciding which behavior belongs in a software module, how its interfaces and seams keep changes local, behavior testable, and implementations replaceable, how adapters divide external translation from domain policy, and when defensive or future-facing behavior is supported by current scope. It evaluates module depth through caller leverage and hidden complexity without prescribing module size or requiring every adapter to be deep.

## When to update

Update this document when evidence from real module decompositions, replacements, external integrations, defensive failures, staged changes, or testing practice changes the relationship among semantic ownership, reasons to change, interface depth, seam placement, change locality, testability, reachable runtime states, and production-behavior ownership.

## Organize a module around owned meaning

A module owns a semantic decision that its callers can rely on. Group behavior when its correctness is governed by the same meaning and a change to that meaning would belong to the same authority. A shared feature name, domain noun, file location, or data type can help discover related code, but does not establish one responsibility.

Treat a reason to change as a semantic test rather than a count of possible events. The same module can receive correctness fixes, performance work, or platform adaptations while retaining one responsibility. Split or move behavior when an independent product rule, trust decision, migration policy, presentation choice, compatibility commitment, or external contract can change without changing the meaning the module otherwise owns.

The semantic owner is the module whose contract must state the decision and whose consumers depend on that decision. Put behavior there even when another module already has the same domain noun in its name. Co-location by topic otherwise makes integration modules absorb unrelated policy and gives future changes several competing places to land.

## Distinguish the module, interface, seam, and adapter

Use these concepts separately when drawing a design:

- A **module** is a unit that presents an interface and hides an implementation. It can be a function, class, package, process, or larger subsystem.
- An **interface** is everything a caller must know to use the module correctly, including operations, values, invariants, ordering, failures, side effects, and material performance constraints.
- An **implementation** is the behavior hidden behind an interface.
- A **seam** is a chosen interaction point where one side can vary, be substituted, or be isolated without requiring the other side to understand its implementation.
- An **adapter** is an implementation role at a seam that translates between the interface on one side and an external technology or contract on the other.

These concepts do not impose one physical shape. A module can expose several purpose-specific interfaces, and an adapter can be justified even when only one production implementation currently exists. The design question is whether the seam isolates a real contract or source of change, not how many classes, methods, or implementations have been created.

## Choose what an interface exposes

Distinguish an object that owns behavior from a record intended to expose data.
A behavior-owning object offers operations through which callers use its
meaning without coordinating its internal representation. A data record makes
an agreed shape available for inspection, transfer, or transformation. Either
can use classes, accessors, immutable values, or other language mechanisms;
choose from the contract, not the syntax.

Private fields and automatically generated getters and setters do not alone
hide a representation. If callers must know which stored quantities to read,
how to combine them, and which setters to sequence, they still depend on that
representation. Expose the capability callers need and the facts the contract
actually promises. An accessor is useful when that fact is part of the intended
contract, including a computed value that need not match a stored field.

For example, an inventory object can own reserving available stock and report
the resulting availability without letting callers edit its storage counters.
When several values must satisfy one invariant—a condition that must remain
true—offer an operation that establishes a valid combination rather than
making each caller coordinate independent setters through invalid states.
This interface shape does not itself establish synchronization under concurrent
access; the promised state transitions still need an implementation that
preserves the invariant.

A record used to transfer an inventory snapshot can deliberately expose its
quantities. Its consumer needs the agreed data, not authority to mutate the
live inventory. Construction checks or serialization support do not turn that
record into the owner of inventory policy. Establish which values are a
snapshot and which operations affect live state so the two contracts are not
confused.

### Compare the changes the design must support

Consider both adding a new kind of value and adding a new operation over the
existing kinds. In a conventional design with behavior implemented by each
object kind, adding a kind can leave existing operations alone, while adding
an operation can require updating every kind. With explicit data cases and
separate functions over them, adding an operation can leave the data definitions
alone, while adding a case can require updating the functions that interpret
those cases.

These are design pressures, not guarantees for every language or pattern.
Visitors, dispatch tables, extensible case mechanisms, and other arrangements
can move the cost and introduce their own coordination. Choose the arrangement
from actual extension needs, required coverage, and understandable ownership;
inspect the affected callers and implementations before claiming that either
axis can change without edits or verification. Keeping data transparent for
several independent transformations can be useful, just as hiding a live
state transition behind an object can be useful.

### Keep internal navigation out of callers' responsibilities

If a caller traverses an object's internal collaborators to assemble a result
or carry out an operation, it can become coupled to the object's topology: how
those collaborators are connected. Ask what capability the caller actually
needs and which module should own the traversal. A report writer that must
discover an output store through several configuration objects may instead
need an operation that opens the intended report destination, with the
destination policy kept at its established owner.

Count dependencies on hidden relationships rather than dots in an expression.
Splitting a call chain into local variables does not remove those dependencies.
Navigating an intentionally exposed data record or using a documented fluent
API—a sequence of supported calls that builds or performs one operation—does
not inherently expose hidden internals. Judge the relationships the public
contract promises, not the expression's visual length.

Combining public data and behavior deserves inspection when callers can bypass
the very invariants the behavior claims to own. It is not a universal ban on
accessors or persistence models. For example, [Active Record](https://martinfowler.com/eaaCatalog/activeRecord.html)
explicitly combines database access with domain behavior. Decide whether its
contract and coupling fit the current responsibility rather than treating the
pattern name as proof that it is a passive transfer record or a design defect.

## Design for local change, testability, and replacement

A change is local when the module that owns a decision can revise its implementation without making unrelated callers understand or coordinate that decision. Give state, derived values, stored data, and side effects clear owners, and trace what crosses each interface. Putting code in one file or component does not create locality if callers depend on its hidden state or update order.

Design the contract so required behavior can be exercised and observed at the owning seam with controllable inputs and dependencies. If tests must coordinate unrelated global state or reach through callers into private implementation, inspect ownership and dependency direction. Testability does not require turning every helper into a public interface.

An implementation is replaceable to the extent that its actual consumers can keep relying on the same contract while it changes. Before claiming replacement is cheap, walk through a plausible rewrite and identify the callers, persisted data, observable failures, and material performance constraints that must stay valid. A file boundary or component tree alone does not establish replaceability.

Good boundaries do not make internal quality optional. Code that is hard to understand or modify can hide defects and make testing, maintenance, and eventual replacement costly even when callers are insulated. Keep the implementation correct and comprehensible for its current use. Treat a rough edge as an explicit, bounded tradeoff only after checking its effects; do not defer a known correctness, data, performance, or platform-contract defect on the assumption that the component can later be rewritten.

## Measure depth by caller leverage

A useful module gives callers leverage: callers obtain meaningful capability while learning fewer concepts and carrying less coordination, policy, and failure handling themselves. Its implementation hides complexity that would otherwise be repeated or exposed across callers. Depth is therefore a relationship between caller value and interface burden, not a ratio of implementation lines to interface lines.

Implementation complexity creates no depth when it adds states, configuration, exports, or policy that callers must also understand without supplying a current capability. That is fake depth: the implementation grew, but the interface became at least as complicated and no required complexity was removed from callers.

As a diagnostic, imagine removing the module. If required knowledge and coordination would spread across callers, the module is concentrating useful complexity. If the behavior would disappear without any caller losing a current capability, it may be pass-through or speculative work. This deletion question is evidence rather than a universal gate. A deliberately thin adapter can still earn its place by isolating an external contract, translating representations and failures, or keeping technology volatility out of a deeper domain module.

## Keep translation and policy with their owners

At an external integration seam, start from the current local and upstream contracts. An adapter may invoke the external interface, translate representations, decode unchecked output, map relevant failures, and handle protocol details required by its local callers. It owns only the translation its interface promises; this list is not a mandatory checklist for every adapter.

Compare validation ownership constraint by constraint on each supported execution path. Rely on a dependency to enforce a constraint when its configured, supported behavior satisfies the local requirement on that path before any interpretation or effect that would violate the local contract. Retain local checks for stricter requirements, different coercion or normalization rules, or paths that bypass that enforcement. When the original input's type or value matters, enforce that rule before the dependency can coerce or normalize it. A stricter local contract does not justify reimplementing every upstream check.

Translate recognized dependency validation failures into the caller's required result when that mapping satisfies the local failure contract; a different response format alone does not require duplicate validation beforehand. Reproducing an upstream accepted-input language creates a second authority that can reject supported inputs, accept unsupported inputs, or drift as the dependency evolves. Keep local validation where dependency enforcement and failure translation cannot satisfy an owned requirement.

Do not model missing methods or version states merely because a dynamic language could express them; establish that the supported runtime, loading path, or compatibility contract can actually produce the state.

Keep product eligibility, trust classification, migration normalization, presentation, and other domain policy with the modules whose contracts make those decisions. An adapter should carry such policy only when translation into or out of the external system is itself the current owned decision. Sharing a domain object or anticipating a future caller does not transfer ownership.

## Admit defensive behavior through a reachable owned effect

Defensive behavior is justified when a realistic value admitted by the actual interface can reach an interpretation or side effect the module owns. Before adding a guard, fallback, normalization, compatibility branch, or error state, trace:

1. the producer of the value or condition;
2. the interface that admits it;
3. the supported execution path that makes it reachable;
4. the incorrect interpretation or effect that would occur without handling; and
5. the module that owns preventing or defining that result.

Keep the behavior when that trace reaches the module's current contract. Unchecked network, file, database, deserialized, or human-authored values can require runtime decoding even when a type declaration describes their expected shape. A module that interprets a pathname and performs a privileged filesystem effect, for example, owns the validation needed to keep that effect within its contract.

Defer the behavior when the producer is hypothetical, the interface cannot admit the value, the supported execution path excludes it, an upstream contract already owns the decision, or another domain module would have to choose the policy. A test that can construct an impossible value does not make the value part of the production interface.

## Justify responsibilities throughout staged changes

A current requirement need not already have a production caller. An explicitly approved stage can establish a module, interface, or compatibility path before a later stage switches consumers. The current stage must define the responsibility being established, the intended consumer or cutover, and the contract that this work must leave ready.

A merely possible future consumer supplies none of those constraints. Do not pre-implement its presumed validation, migration, trust, presentation, or compatibility policy. Revisit the design when an accepted requirement identifies the real consumer and decision owner.

As a stage changes or ends an obligation, reassess whether the related code belongs in the supported target system. Ask: given current business requirements and supported operating conditions, if the system had started with the migrated design, what requirement would justify this code existing? Establish the requirement independently of the implementation, its callers, and its tests. Semantic compatibility preserves current commitments; an inherited arrangement needs its own continuing justification.

Include related active code and unchanged support artifacts in that assessment. A wrapper can still execute because a comparison fixture reconstructs an obsolete entry path, or a selection layer can still have callers after the system has committed to one implementation. References establish usage, but a chain whose members only sustain one another does not establish a current capability. Trace the chain to a supported consumer or explicit obligation before deciding what remains necessary.

Remove behavior and support whose only obligation has ended. When the capability remains required but its inherited arrangement does not, simplify or collapse that arrangement while preserving the current contract. Retain a module or seam when it still isolates a live decision or external contract; one current implementation does not by itself make an adapter unnecessary.

The diagnostic question does not prove that an obligation has ended. Supported older clients, persisted formats, security, reliability, and operational commitments remain requirements. Rollback and approved intermediate stages can require transitional behavior while those obligations remain live. Preserve affected code when a potentially real obligation is unresolved, and identify the missing evidence or decision. Bound the assessment by the changed obligation and its affected dependencies rather than unrelated opportunities to redesign the system.

## Let tests follow production ownership

Tests protect behavior whose production contract and owner have already been established. A proposed test, an easily constructed fixture, or a passing assertion is evidence about an implementation; it cannot grant a module a new production responsibility.

First decide whether the behavior is required, reachable, and owned at the tested seam. Then apply [Test effectiveness](../software-testing/test-effectiveness.md) to decide whether new automated protection is owed and which seam, oracle, layer, and doubles make that protection meaningful. Large setup or several unrelated test groups can reveal a misplaced or missing production seam, but they are reasons to inspect the design rather than automatic commands to split it.

## Decide where proposed behavior belongs

For each proposed branch, type, export, validation, fallback, compatibility rule, or test, answer:

1. What current requirement, concrete consumer, or explicitly approved delivery stage needs it?
2. What semantic decision does it make visible to callers?
3. Which module owns that decision and the contract that expresses it?
4. What independent event or policy change would require this behavior to change?
5. Does an upstream dependency or another domain module already own the behavior?
6. Can the state occur through the real interface and supported execution path?
7. If this module disappeared, would required complexity spread to callers, remain with another owner, or disappear because no current capability needs it?

Keep the behavior in the proposed module only when the answers identify one coherent current responsibility there. Otherwise move it to its semantic owner, rely on the authoritative upstream contract, include it in a defined staged responsibility, or defer it until a real requirement establishes the missing decision.

## Compare boundary cases

| Situation                                                                                                                                                                       | Owning decision                                                                                                                              | Result                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A typed SDK adapter calls supported methods and decodes unchecked responses, while a hypothetical future consumer might want trust scoring or migration normalization.          | The adapter owns current contract translation; future product policy has no current owner in the adapter.                                    | Keep invocation, decoding, and relevant failure translation. Defer the speculative trust and migration rules and do not reproduce the SDK's accepted-input grammar.                      |
| An API requires numeric integer date fields. Complete dates pass through a parser that checks calendar validity but permits coercion and truncation; partial queries bypass it. | The API owns strict field acceptance and validity on each supported path; the parser supplies calendar validation on the complete-date path. | Check types and integers before parsing, translate calendar failures for complete dates, and keep month bounds on the partial-query path. Do not duplicate the parser's calendar checks. |
| A filesystem module accepts a pathname and performs a privileged mutation. A realistic admitted pathname can escape the intended resource set without a sink-side check.        | The module interprets the value and owns the privileged effect.                                                                              | Validate at the effect-owning boundary even if a caller also checks earlier for feedback.                                                                                                |
| An approved staged change establishes an interface in one delivery and switches a named consumer in the next.                                                                   | The accepted stage owns leaving the defined interface ready for that cutover.                                                                | Implement the scoped interface before the production consumer changes; omit unrelated behavior imagined for other possible consumers.                                                    |
| A small external adapter translates one remote operation, while the consuming domain module owns eligibility, retries, and product decisions.                                   | The adapter owns technology translation; the domain module owns product semantics.                                                           | Retain the legitimately thin adapter and evaluate the domain module's depth separately. Do not move policy into the adapter merely to make it larger.                                    |

## References

- Robert C. Martin, “Objects and Data Structures,” chapter 6 in _Clean Code: A Handbook of Agile Software Craftsmanship_, ISBN 978-0-13-235088-4. Chinese edition: _代码整洁之道_, translated by 韩磊, 人民邮电出版社, 2010, ISBN 978-7-115-21687-8.
- [Philip Wadler, “The Expression Problem”](https://homepages.inf.ed.ac.uk/wadler/papers/expression/expression.txt)
- [David L. Parnas, “On the Criteria To Be Used in Decomposing Systems into Modules”](https://doi.org/10.1145/361598.361623)
- [John Ousterhout, _A Philosophy of Software Design_](https://web.stanford.edu/~ouster/cgi-bin/book.php)
- [Alistair Cockburn, “Hexagonal Architecture: The Original 2005 Article”](https://alistair.cockburn.us/hexagonal-architecture)
- [Martin Fowler, “Yagni”](https://martinfowler.com/bliki/Yagni.html)
- [Danilo Sato, “Parallel Change”](https://martinfowler.com/bliki/ParallelChange.html)
- [Ian Cartwright, Rob Horn, and James Lewis, “Transitional Architecture”](https://martinfowler.com/articles/patterns-legacy-displacement/transitional-architecture.html)
- [underreacted, “slop lasagna”](https://underreacted.leaflet.pub/3mdjygm2p5s2c)
