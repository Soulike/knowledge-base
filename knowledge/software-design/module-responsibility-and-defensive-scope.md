# Module responsibility and defensive scope

## Scope

This document defines a responsibility-based model for deciding which behavior belongs in a software module, where its interface and seams should live, how adapters divide external translation from domain policy, and when defensive or future-facing behavior is supported by current scope. It evaluates module depth through caller leverage and hidden complexity without prescribing module size or requiring every adapter to be deep.

## When to update

Update this document when evidence from real module decompositions, external integrations, defensive failures, staged changes, or testing practice changes the relationship among semantic ownership, reasons to change, interface depth, seam placement, reachable runtime states, and production-behavior ownership.

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

## Measure depth by caller leverage

A useful module gives callers leverage: callers obtain meaningful capability while learning fewer concepts and carrying less coordination, policy, and failure handling themselves. Its implementation hides complexity that would otherwise be repeated or exposed across callers. Depth is therefore a relationship between caller value and interface burden, not a ratio of implementation lines to interface lines.

Implementation complexity creates no depth when it adds states, configuration, exports, or policy that callers must also understand without supplying a current capability. That is fake depth: the implementation grew, but the interface became at least as complicated and no required complexity was removed from callers.

As a diagnostic, imagine removing the module. If required knowledge and coordination would spread across callers, the module is concentrating useful complexity. If the behavior would disappear without any caller losing a current capability, it may be pass-through or speculative work. This deletion question is evidence rather than a universal gate. A deliberately thin adapter can still earn its place by isolating an external contract, translating representations and failures, or keeping technology volatility out of a deeper domain module.

## Keep translation and policy with their owners

At an external integration seam, start from the current local and upstream contracts. An adapter may invoke the external interface, translate representations, decode unchecked output, map relevant failures, and handle protocol details required by its local callers. It owns only the translation its interface promises; this list is not a mandatory checklist for every adapter.

Leave an upstream dependency's accepted-input language with that dependency when the local interface already adopts the upstream type or contract and no local interpretation or effect requires another rule. Reproducing the grammar locally creates a second authority that can reject supported inputs, accept unsupported inputs, or drift as the dependency evolves. Likewise, do not model missing methods or version states merely because a dynamic language could express them; establish that the supported runtime, loading path, or compatibility contract can actually produce the state.

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

## Distinguish staged scope from speculative scope

A current requirement need not already have a production caller. An explicitly approved stage can establish a module, interface, or compatibility path before a later stage switches consumers. The current stage must define the responsibility being established, the intended consumer or cutover, and the contract that this work must leave ready.

A merely possible future consumer supplies none of those constraints. Do not pre-implement its presumed validation, migration, trust, presentation, or compatibility policy. Revisit the design when an accepted requirement identifies the real consumer and decision owner.

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

| Situation                                                                                                                                                                | Owning decision                                                                                           | Result                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A typed SDK adapter calls supported methods and decodes unchecked responses, while a hypothetical future consumer might want trust scoring or migration normalization.   | The adapter owns current contract translation; future product policy has no current owner in the adapter. | Keep invocation, decoding, and relevant failure translation. Defer the speculative trust and migration rules and do not reproduce the SDK's accepted-input grammar. |
| A filesystem module accepts a pathname and performs a privileged mutation. A realistic admitted pathname can escape the intended resource set without a sink-side check. | The module interprets the value and owns the privileged effect.                                           | Validate at the effect-owning boundary even if a caller also checks earlier for feedback.                                                                           |
| An approved staged change establishes an interface in one delivery and switches a named consumer in the next.                                                            | The accepted stage owns leaving the defined interface ready for that cutover.                             | Implement the scoped interface before the production consumer changes; omit unrelated behavior imagined for other possible consumers.                               |
| A small external adapter translates one remote operation, while the consuming domain module owns eligibility, retries, and product decisions.                            | The adapter owns technology translation; the domain module owns product semantics.                        | Retain the legitimately thin adapter and evaluate the domain module's depth separately. Do not move policy into the adapter merely to make it larger.               |

## References

- [David L. Parnas, “On the Criteria To Be Used in Decomposing Systems into Modules”](https://doi.org/10.1145/361598.361623)
- [John Ousterhout, _A Philosophy of Software Design_](https://web.stanford.edu/~ouster/cgi-bin/book.php)
- [Alistair Cockburn, “Hexagonal Architecture: The Original 2005 Article”](https://alistair.cockburn.us/hexagonal-architecture)
- [Martin Fowler, “Yagni”](https://martinfowler.com/bliki/Yagni.html)
