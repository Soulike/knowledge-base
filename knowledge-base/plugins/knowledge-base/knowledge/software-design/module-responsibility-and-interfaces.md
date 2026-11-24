# Module responsibility and interfaces

## Scope

This document defines a responsibility-based model for deciding which behavior belongs in a software module, how its interfaces, seams, and cohesion keep changes local, behavior testable, and implementations replaceable, and how to evaluate module depth through caller leverage and hidden complexity. It covers semantic ownership, objects versus data records, internal navigation, and interface extension pressures without prescribing module size or requiring every adapter to be deep.

## When to update

Update this document when evidence from real module decompositions, interface designs, cohesion reviews, or component replacements changes the relationship among semantic ownership, reasons to change, interface exposure, seam placement, change locality, testability, replaceability, and caller leverage.

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

## Diagnose cohesion before splitting

Cohesion is the extent to which a module's operations and state support one
meaning. In a class, examine which methods need which fields and why those
relationships exist. Operations that maintain the same valid state or implement
the same rule can belong together even when each method uses only some fields.
Making every method touch every field does not prove that the class has one
responsibility.

Disjoint groups of fields and methods can reveal independent responsibilities,
but they can also represent legitimate phases of one operation. Trace the
rules and reasons to change before splitting. A class with a few methods can
still combine a calculation rule, presentation format, and destination-writing
policy that have different owners. A longer class can remain coherent when its
operations serve the same contract.

For example, changing a report's numerical calculation need not change its page
layout, and changing its destination need not change either. Separate those
decisions when their current contracts and callers establish that independence;
keep a coordinating operation when it owns the complete report task. Choosing
smaller classes should let a reader understand and change one needed decision
without reconstructing unrelated details, not merely move each method behind
another interface.

Shared fields deserve a lifetime reason as well as a cohesion reason. Moving
per-call values into class fields solely to shorten helper parameter lists can
make calls depend on hidden initialization order and interfere with one another.
Keep such values local or pass a coherent value group unless the object actually
owns that state across the relevant lifetime. Assess a proposed split by the
caller concepts and coordination it removes and introduces; class count, method
count, and a short class description are diagnostics rather than correctness
criteria.

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

Use dependency inversion to express the capability a policy module needs in a
contract that concrete dependency code supplies. This keeps the policy from
carrying technology-specific details. A calculation using changing external
rates can depend on a rate-provider contract: controlled rates exercise the
calculation, while the real adapter and integration need their own relevant
verification. The seam earns its place by isolating an established source of
change or unpredictable input. Adding an interface to every method does not
provide that isolation; choose the contract and supported substitution mechanism
from the actual need.

An implementation is replaceable to the extent that its actual consumers can keep relying on the same contract while it changes. Before claiming replacement is cheap, walk through a plausible rewrite and identify the callers, persisted data, observable failures, and material performance constraints that must stay valid. A file boundary or component tree alone does not establish replaceability.

Good boundaries do not make internal quality optional. Code that is hard to understand or modify can hide defects and make testing, maintenance, and eventual replacement costly even when callers are insulated. Keep the implementation correct and comprehensible for its current use. Treat a rough edge as an explicit, bounded tradeoff only after checking its effects; do not defer a known correctness, data, performance, or platform-contract defect on the assumption that the component can later be rewritten.

## Measure depth by caller leverage

A useful module gives callers leverage: callers obtain meaningful capability while learning fewer concepts and carrying less coordination, policy, and failure handling themselves. Its implementation hides complexity that would otherwise be repeated or exposed across callers. Depth is therefore a relationship between caller value and interface burden, not a ratio of implementation lines to interface lines.

Implementation complexity creates no depth when it adds states, configuration, exports, or policy that callers must also understand without supplying a current capability. That is fake depth: the implementation grew, but the interface became at least as complicated and no required complexity was removed from callers.

As a diagnostic, imagine removing the module. If required knowledge and coordination would spread across callers, the module is concentrating useful complexity. If the behavior would disappear without any caller losing a current capability, it may be pass-through or speculative work. This deletion question is evidence rather than a universal gate. A deliberately thin adapter can still earn its place by isolating an external contract, translating representations and failures, or keeping technology volatility out of a deeper domain module.

## References

- Robert C. Martin, “Objects and Data Structures,” chapter 6 in _Clean Code: A Handbook of Agile Software Craftsmanship_, ISBN 978-0-13-235088-4. Chinese edition: _代码整洁之道_, translated by 韩磊, 人民邮电出版社, 2010, ISBN 978-7-115-21687-8.
- Robert C. Martin with Jeff Langr, “Classes,” chapter 10 in _Clean Code: A Handbook of Agile Software Craftsmanship_ (same editions).
- [Philip Wadler, “The Expression Problem”](https://homepages.inf.ed.ac.uk/wadler/papers/expression/expression.txt)
- [David L. Parnas, “On the Criteria To Be Used in Decomposing Systems into Modules”](https://doi.org/10.1145/361598.361623)
- [John Ousterhout, _A Philosophy of Software Design_](https://web.stanford.edu/~ouster/cgi-bin/book.php)
- [underreacted, “slop lasagna”](https://underreacted.leaflet.pub/3mdjygm2p5s2c)
