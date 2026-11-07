# Understandable function interfaces and decomposition

## Scope

This document supplies language-independent reasoning for designing function interfaces and dividing implementation steps so callers can understand inputs, results, effects, and the task being performed.

## When to update

Update this document when evidence from API use, refactoring, or maintenance changes how function responsibilities, abstraction levels, parameter relationships, effects, or decomposition affect understanding and safe modification.

## Keep one task visible

A function should express one coherent task at the level its callers need. Doing one task does not mean executing one statement: preparing, calculating, and returning a receipt can be steps of one operation. The question is whether the steps explain that operation or combine independent decisions that callers should be able to use and change separately.

Keep the function's main account at a consistent level of detail. A receipt-building function can describe selecting eligible entries, calculating totals, and formatting the result while helpers own their respective details. Mixing those steps with individual delimiter writes or low-level decoding forces readers to repeatedly switch between the task and its machinery.

Extract a helper when it gives a coherent detail a meaningful name and lets readers understand the caller without studying that detail. Do not extract merely to move lines elsewhere or replace an obvious expression with an equally long name. A readable helper sequence should reveal the main task first and make the next level of detail easy to locate.

Prefer functions small enough to understand and modify as a unit. Line count, nesting depth, and sections labelled with unrelated tasks are useful prompts to investigate; they are not proofs that a function must be split. A longer straightforward calculation may be clearer than many tiny wrappers that require readers to reconstruct data flow across files. Guard clauses and early returns can reduce nesting when they make the valid path clearer and preserve cleanup and other required behavior.

## Make inputs and outputs explain the call

Every parameter adds something a caller must understand. Evaluate the roles and relationships of the inputs rather than imposing a fixed maximum count.

- Use a named value or parameter group when its members form an actual concept, such as a rectangle's dimensions. Grouping unrelated options into a bag hides complexity without removing it.
- Make the order and roles of otherwise similar positional arguments clear through the language's labels, named options, or API structure. Two coordinates can have a familiar order; two unlabelled strings often do not.
- Prefer returning a transformation's result over quietly overwriting an argument that looks like an input. A deliberate in-place operation is appropriate when its contract and call make that effect clear.
- Keep dependencies and per-call inputs explicit. Moving them into shared mutable fields solely to reduce argument count creates hidden inputs, lifetime concerns, and ordering obligations.
- Treat variadic inputs according to their meaning. A collection of equivalent items is one conceptual input; a long positional list of unrelated roles remains difficult to understand even when the signature calls it one collection.

A boolean parameter may represent a genuine value, such as enabling a setting. A flag that selects between different operations deserves a different question: should the caller choose an explicitly named operation, a named mode, or leave an internal policy decision to the implementation? For example, `renderPreview(document)` and `renderPublished(document)` can make the caller's choice clearer than `render(document, true)`. Shared internal implementation can still avoid duplication. Separate public operations are unnecessary when the caller simply supplies a boolean value or has no authority to choose the policy.

## Make observable effects deliberate

A query answers a question without changing state that callers or other consumers can observe, such as a stored stock count. A command intentionally changes that state. Keeping this distinction clear makes queries safer to repeat, reorder, or use in conditions. An availability query that also reserves an item consumes stock when the caller only expected an answer; repeating the check can consume more items.

Expose intentional effects in the operation's contract and use. Do not hide unrelated changes in a predicate or computation. Prefer a returned result for a pure transformation; use an explicit operation when mutation is required. Mutating an owning object is not automatically safer than mutating an argument: either can violate the caller's expectations if the effect is concealed.

Command/query separation is a useful default, not a ban on returning results from mutations. An operation that removes and returns the next queue item can have a coherent contract. Likewise, do not split a check and a mutation when correctness requires one atomic decision: no other execution may change the relevant state between the check and its effect. For example, two callers can both see the last item available before either reserves it, so both can try to obtain the same item. Keep checking availability and reserving stock indivisible when the contract requires only one caller to succeed, and state the mutation and result together. A combined function name alone does not provide that guarantee.

## Consolidate repeated meaning at its owner

Extract repeated implementation when the occurrences express the same rule and must change together. [Module responsibility](../software-design/module-responsibility-and-defensive-scope.md#organize-a-module-around-owned-meaning) establishes ownership from shared meaning and reasons to change. Two output formats using the same rounding rule should follow the same change to that rule. Two calculations that happen to look alike but follow independently chosen policies need not change together. Apply that distinction before giving repeated code one helper; syntax alone does not justify a shared authority.

Repeated dispatch over the same discriminator, the value or field identifying which variant is present, can indicate that related variant-specific behavior should be owned together. It does not establish that every conditional needs subclasses. A variant set is statically closed when the language and versioning contract rule out unnamed variants and tooling can enumerate every case; merely having seen a fixed list so far is insufficient. For that closed set, [exhaustive branching](exhaustive-branching.md) deliberately makes each handler reconsider added cases. Unchecked input must be validated before treating it as a member of the closed type. Choose the abstraction from that contract and the actual source of change, rather than treating one syntax as inherently unclean.

## Separate normal work from failure handling when it helps

Make the successful sequence recognizable, and give substantial recovery or translation logic its own coherent helper when that improves the account. An exception boundary can coordinate normal work and recovery without forcing callers to inspect their details.

The failure contract determines what must propagate or be handled; function formatting does not. Neither a rule that every `try` must occupy the entire function nor a preference for exceptions over all result types establishes correct failure behavior. In an externally observable operation, preserve its [outcomes and recovery contract](../software-design/operation-failure-and-recovery.md#distinguish-outcomes-by-consequence) through any extraction: logging alone does not necessarily make a failure handled, and an earlier effect may survive a later failure.

## Refine structure without changing the promised behavior

Start from a working account of the required behavior, then improve decomposition, parameter roles, and names in manageable steps. Check representative calls as well as the implementation: a tidy body can still expose a confusing interface.

Preserve results, effects, ordering, failures, and resource lifetime unless changing them is part of the accepted task. [Test effectiveness](../software-testing/test-effectiveness.md#protect-behavior-not-inventory) treats existing tests and static gates as evidence for a behavior-preserving change; moving statements or renaming helpers does not itself require a new test. Seek new protection when an uncovered realistic contract violation is exposed, rather than equating line coverage or parameter combinations with proof of correctness.

## Sources

- Robert C. Martin, “Functions,” chapter 3 in _Clean Code: A Handbook of Agile Software Craftsmanship_, ISBN 978-0-13-235088-4. Chinese edition: _代码整洁之道_, translated by 韩磊, 人民邮电出版社, 2010, ISBN 978-7-115-21687-8.
- [Martin Fowler: Flag Argument](https://martinfowler.com/bliki/FlagArgument.html): caller intent, explicit operations, shared internal implementation, and boolean values.
- [Martin Fowler: Command Query Separation](https://martinfowler.com/bliki/CommandQuerySeparation.html): distinguishing observable mutations from queries and allowing deliberate exceptions.
