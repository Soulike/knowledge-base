# Exhaustive branching over finite variants

## Scope

This document defines a coding suggestion for dispatch over a value whose language contract and static tooling expose a complete, closed set of variants. Exhaustive multi-way branching makes changes to that set visible at each affected handler.

## When to update

Update this document when a recurring control-flow change exposes a missing distinction between statically closed variants, open or evolvable domains, and unchecked runtime values.

## Use multi-way branching for a closed set

A branch subject is closed only when the language, type, module, and versioning contracts rule out unnamed or future variants for the checked code, and the compiler or linter can determine the complete set. Closed enumerations, discriminated or tagged unions, sealed hierarchies, and algebraic data types can meet this condition; representations that admit other runtime values or future cases do not.

When behavior depends on which variant is present, prefer the language's multi-way branch over an `if`/`else` chain against the discriminator. The structure makes the common subject and the intended set of alternatives explicit.

Use `if` statements for ranges, relational predicates, and independently meaningful conditions rather than variant dispatch. When a variant set can evolve independently of the checked code, retain the multi-way branch and follow the language's future-case convention.

## List every variant explicitly

List every declared variant with an explicit case. Cases may share an implementation when the language supports grouped labels, but each handled variant must still be named.

Prefer omitting `default`, `else`, a top-level `_`, or another catch-all arm that can handle or ignore a newly added variant. Explicit cases instead make each affected dispatch site reconsider how the new variant should behave. If a language requires a statically checked unreachable or fail-closed sentinel to preserve that guarantee, use its standard idiom rather than a fallback that accepts the new value.

If values can arrive from an unchecked external source, validate them before treating them as the closed type. When “unknown” is a valid domain state, model it as an explicit variant and handle it by name.
