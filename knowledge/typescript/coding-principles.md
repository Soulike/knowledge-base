# TypeScript coding principles

## Scope

This document defines project-independent TypeScript coding principles for representing absence and establishing runtime type facts without hiding uncertainty from the type system. It owns the use of non-null assertions, definite-assignment assertions, chained and ordinary type assertions, runtime narrowing, and optional object properties; tool configuration that enforces these principles is maintained separately.

## When to update

Update this document when TypeScript changes the semantics of assertions, control-flow narrowing, class-field initialization, or optional properties, or when a recurring TypeScript failure exposes a missing principle, exception boundary, or safer modeling technique within this scope.

## Make the runtime evidence visible

TypeScript can preserve and propagate facts that the program establishes, but an erased type annotation cannot make an unchecked runtime value safe. Model each state that the program can actually observe, validate data at trust boundaries, and let control-flow analysis carry the resulting evidence.

Prefer these techniques before a type assertion:

- declare the intended type at the value's construction boundary;
- use `satisfies` when an expression must be checked without replacing its inferred type;
- narrow unions with control flow, discriminants, type predicates, or assertion functions;
- validate unknown external data before returning a domain type; and
- redesign an API when its types cannot express its initialization or state transition.

A type predicate or assertion function is only as sound as its implementation. Its runtime checks must establish every property promised by its signature, and tests should exercise both accepted and rejected values.

## Do not use non-null assertions

Do not use the postfix non-null assertion in an expression:

```ts
const accountId = session.account!.id;
```

The `!` removes `null` and `undefined` from the static type but emits no runtime check. If the invariant is wrong, the failure moves away from the missing-value boundary and usually becomes harder to diagnose. Establish the invariant with a runtime check at the boundary where the value becomes required. Use the mechanism appropriate to the environment and codebase—for example, `node:assert` in Node.js, an explicit `if` followed by `throw` in frontend code, or an existing runtime validator. The specific form is not the rule: the check must execute at runtime, stop invalid state before it is used, provide useful diagnostic context, and let TypeScript preserve the established fact. For example:

```ts
const account = session.account;
if (account === undefined) {
  throw new Error("Expected the session to contain an account");
}

const accountId = account.id;
```

Do not use a definite-assignment assertion on a class field or variable either:

```ts
class Client {
  private connection!: Connection;
}
```

This assertion suppresses initialization analysis without changing the runtime state. Initialize the field in the constructor, represent the uninitialized state in its type, or redesign the lifecycle so code cannot observe an invalid object.

## Do not bridge incompatible types with chained assertions

Do not use two type assertions to cross a type incompatibility:

```ts
const request = input as unknown as Request;
const response = input as never as Response;
```

The intermediate type supplies no runtime evidence. This prohibition applies to every intermediate type, not only `unknown`, and to equivalent code that stores the intermediate value in a variable or hides the bridge in a helper.

When the source and target types are incompatible, find the disagreement instead. Correct the model, translate through an adapter, validate the runtime value, or change the boundary contract. A chained assertion hides exactly the information needed to choose the correct repair.

## Treat an ordinary assertion as a proof obligation

A single `value as T` is constrained by TypeScript's assertion rules, but it still performs no runtime validation. Avoid it unless the program already establishes an invariant that TypeScript cannot express and every safer design has been considered.

An exceptional assertion must satisfy all of these conditions:

1. Type annotations, `satisfies`, control-flow narrowing, runtime validation, and API redesign do not express the required result adequately.
2. The assertion is confined to the smallest boundary that owns the invariant.
3. The invariant is concrete: name what makes the runtime value satisfy the asserted type and where that guarantee comes from.
4. Prefer an executable test that would fail if the invariant stopped holding. When a useful test cannot be written, place a comment beside the assertion that records the invariant, its evidence, why the type system cannot retain it, and why no safer design fits.

A test or comment does not make an assertion safe by itself. It makes the safety argument executable or reviewable. Do not use the assertion when no underlying invariant can be identified.

`as const` is not an escape hatch under this rule. It asks TypeScript to retain literal information and readonly structure rather than claiming that a runtime value has an unrelated shape.

## Use optional only for independently optional fields

Use an optional property only when the field itself is optional within the represented domain state. Omitting it must remain valid independently of the object's other fields:

```ts
interface SearchOptions {
  caseSensitive?: boolean;
}
```

The boundary is not whether a field is absent in some runtime situations. Ask whether the field is optional within one state, or required in some states and absent in others. When another field or discriminator determines whether the field must exist, an optional property erases that relationship:

```ts
interface LoadState<T> {
  status: "loading" | "ready" | "failed";
  value?: T;
  error?: Error;
}
```

This type permits states such as `{ status: "ready" }`, `{ status: "loading", value: result }`, and `{ status: "ready", value: result, error: failure }` even though the domain may allow none of them. Model a finite set of mutually exclusive states as a discriminated union so each member declares exactly which fields that state requires:

```ts
type LoadState<T> =
  | { status: "loading" }
  | { status: "ready"; value: T }
  | { status: "failed"; error: Error };
```

The union enumerates the valid states, preserves the relationship between the discriminator and state-specific fields, and lets control-flow narrowing expose only the fields available in the selected state. Do not make a required property optional merely to defer initialization or silence an assignment error; represent the uninitialized state explicitly or redesign the lifecycle.

`property?: T` and `property: T | undefined` express different object shapes. The first permits the property to be absent. The second requires the property to exist while allowing its value to be `undefined`. That difference is observable through operations such as the `in` operator, `Object.keys()`, object spread, and serialization.

Compiler options affect how strictly assignments preserve this distinction. In particular, `exactOptionalPropertyTypes` rejects assigning `undefined` to `property?: T` unless `undefined` is part of the declared value type. The domain distinction remains relevant even when a project's compiler configuration does not enforce it.

## Keep enforcement aligned with the principle

Static checks should prevent accidental violations without becoming the source of the underlying design rule. When configuring TypeScript, ESLint, suppressions, or CI to enforce these principles, use [Enforcing TypeScript coding principles](enforcing-coding-principles.md) to distinguish complete checks from partial signals and review-only decisions.

## References

- [TypeScript: Type assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)
- [TypeScript: Non-null assertion operator](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-)
- [TypeScript: Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript: Assertion functions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)
- [TypeScript: Optional properties](https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties)
- [TypeScript: `exactOptionalPropertyTypes`](https://www.typescriptlang.org/tsconfig/exactOptionalPropertyTypes.html)
