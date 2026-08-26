# Exhaustive branching over finite variants

## Scope

This document defines how code should dispatch over a closed, finite set of variants so that changes to that set prompt each affected handler to be reconsidered. It applies across languages with multi-way branching, uses available static tooling to support the convention, and keeps unchecked external values outside the statically closed domain.

## When to update

Update this document when broadly used language semantics or static-analysis capabilities change the guarantees available for exhaustive branching, or when a real control-flow change exposes an unhandled distinction between closed variants, open predicates, and unchecked runtime values.

## Use multi-way branching for a closed set

A branch subject is closed when its type declaration identifies a finite set of possible variants and the language's compiler or static analyzer can determine that complete set. Common representations include enumerations, discriminated or tagged unions, sealed hierarchies, and algebraic data types.

When behavior depends on which one of those variants is present, use the language's `switch`, `match`, or equivalent multi-way construct. Do not express the same dispatch as an `if`/`else` or `if`/`else if` chain against the discriminator. A single multi-way branch makes the common subject explicit and gives static tooling one boundary at which to check completeness.

Use `if` statements when the conditions are not a finite partition of one value, such as ranges, relational predicates, independently meaningful Boolean conditions, or an open value domain. An ordinary Boolean decision is a predicate rather than a multi-variant dispatch; keep `if` for it unless the Boolean is hiding domain states that should be modeled explicitly.

## Name every variant and omit the catch-all

List every declared variant with an explicit case. Cases may share an implementation when the language supports grouped labels, but each handled variant must still be named.

Do not use `default`, `else`, a top-level `_`, or another catch-all arm that stands for unnamed variants in a branch over a closed set. An ordinary catch-all accepts newly added variants without requiring the branch to be reconsidered. Explicit cases instead turn a type change into a list of affected dispatch sites that must each make a deliberate decision about the new variant.

Do not add a catch-all merely to throw an “unreachable” error. Validate the exhaustive structure statically. If an unknown value is possible at runtime, handle that uncertainty at the boundary rather than weakening every internal dispatch.

## Use static tooling to support the convention

Use the language compiler, linter, or analyzer to automate the parts of this convention that it can express reliably. Useful checks include:

- an `if`/`else` or `if`/`else if` chain that dispatches on a closed finite type instead of using the language's exhaustive multi-way construct;
- a branch over a closed set that omits a declared variant; and
- a catch-all branch that can conceal a later addition to that set.

Prefer a compiler check when the language provides the needed guarantee. Existing lint rules that recognize common syntax are also useful even when they cannot determine exactly whether every reported or unreported branch concerns a closed type. Configure adopted checks to fail CI, but document their coverage boundary instead of treating partial automation as proof that the whole convention holds.

Do not create or maintain a custom analyzer solely to achieve complete enforcement unless recurring violations justify that cost. Code review owns the semantic cases that the available toolchain does not cover and decides how each new variant should behave. Runtime tests also should not duplicate a property that the static toolchain already proves across every checked dispatch site.

## Keep runtime uncertainty at the boundary

A statically closed type does not prove that data from a network, file, database, deserializer, foreign-function interface, or version-skewed peer contains only declared variants. Parse or validate such input before converting it to the closed domain type.

When “unknown” is a valid state that the program must carry, represent it as an explicit variant and handle it by name. When unknown input is invalid, reject it at the decoding boundary. This preserves exhaustive internal branching without pretending that external data is safer than it is.

## References

- [TypeScript ESLint: `switch-exhaustiveness-check`](https://typescript-eslint.io/rules/switch-exhaustiveness-check/)
- [Rust: Patterns and matching](https://doc.rust-lang.org/book/ch19-00-patterns.html)
- [Swift: Control flow](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/controlflow/)
- [Java: Switch expressions and statements](https://docs.oracle.com/en/java/javase/26/language/switch-expressions-statements.html)
