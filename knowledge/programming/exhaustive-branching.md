# Exhaustive branching over finite variants

## Scope

This document defines when code should use an exhaustive multi-way branch over a closed, finite set of variants so that changes to the set prompt each affected handler to be reconsidered. It applies across languages with `switch`, `match`, or equivalent constructs.

## When to update

Update this document when a recurring control-flow change exposes a missing distinction between closed variants, open conditions, and unchecked runtime values.

## Use multi-way branching for a closed set

A branch subject is closed when its type defines a finite set of possible variants. Common representations include enumerations, discriminated or tagged unions, sealed hierarchies, and algebraic data types.

When behavior depends on which variant is present, prefer the language's multi-way branch over an `if`/`else` chain against the discriminator. The structure makes the common subject and the intended set of alternatives explicit.

Use `if` statements when the conditions are not a finite partition of one value, such as ranges, relational predicates, independently meaningful Boolean conditions, or an open value domain. An ordinary Boolean decision is a predicate rather than a multi-variant dispatch; keep `if` for it unless the Boolean is hiding domain states that should be modeled explicitly.

## List every variant explicitly

List every declared variant with an explicit case. Cases may share an implementation when the language supports grouped labels, but each handled variant must still be named.

Omit `default`, `else`, a top-level `_`, or another catch-all arm that stands for unnamed variants. A catch-all can accept a newly added variant without drawing attention to the branch. Explicit cases instead make each affected dispatch site reconsider how the new variant should behave; compilers and linters that support exhaustiveness checking can surface those sites automatically.

If values can arrive from an unchecked external source, validate them before treating them as the closed type. When “unknown” is a valid domain state, model it as an explicit variant and handle it by name.
