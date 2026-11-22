# TypeScript and JavaScript coding principles

## Scope

This document defines project-independent correctness principles for writing, modifying, and reviewing TypeScript and JavaScript code. It explains how to preserve uncertainty, establish runtime facts, make control flow and asynchronous responsibility explicit, and handle exceptional type assertions and diagnostic suppressions. TypeScript-specific syntax and modeling are identified separately from principles shared with JavaScript.

## When to update

Update this document when language semantics change the behavior of narrowing, assertions, optional properties, initialization, control flow, or Promises, or when recurring failures reveal a missing distinction, safer modeling technique, or exception boundary.

## Principles shared with JavaScript

Apply these principles while writing code, even when the project has not enabled the corresponding checks. Compiler and lint settings provide a second line of protection; [the enforcement reference](enforcing-coding-principles.md) owns their coverage, configuration, and limitations. Prefer practical checks for common mistakes and explicit modeling over attempts to make the entire program statically provable.

JavaScript can use runtime validation and explicit control flow directly. Later sections use TypeScript-only annotation, `satisfies`, and assertion syntax. JavaScript can express some of the same type models with JSDoc, with the checking limits described in [JavaScript applicability](enforcing-coding-principles.md#javascript-applicability).

### Make runtime evidence visible

A type annotation cannot make an unchecked runtime value safe. Validate external data before treating it as a trusted application value. In TypeScript, receive uncertain inputs as `unknown` and narrow them; avoid explicit `any` and propagation of `any` from parsers or dependency declarations. JavaScript still needs the runtime validation even when its tooling cannot detect a missing check.

A type predicate or assertion function is only as sound as its implementation. Its runtime checks must establish every property promised by its signature, and tests should exercise both accepted and rejected values. A generic return type such as `decode<T>(input): T` supplies no evidence that the input actually has the caller's chosen shape.

### Preserve missing values and meaningful falsy values

An array or open dictionary lookup may return `undefined`. Check the value before using it, or use an iteration or data model that establishes its presence. Prefer `for...of` when the task needs array elements rather than an index. Do not invent a default merely to silence a missing-value error when the domain requires failure.

Distinguish a presence test from a truthiness test. For a value that may be absent, `if (count)` excludes both absence and zero. Use `count !== undefined` when zero is valid, an explicit nullish check when both `null` and `undefined` are possible, and `enabled === true` when only true should enable behavior. Truthiness of an ordinary string or number remains appropriate when empty string or zero intentionally means false.

### Keep control flow and override intent explicit

Handle every member when dispatching over a statically closed set of variants. [Exhaustive branching](../programming/exhaustive-branching.md) defines the closed-set boundary: list each variant, avoid a catch-all that silently accepts new variants, and validate external values before treating them as members of the closed type.

When a function produces a result, return the intended result or fail explicitly on every applicable path. Leave no executable statements after an unconditional exit. Group switch labels deliberately and terminate each implemented case rather than accidentally falling through. In TypeScript classes, mark intentional overrides with `override` so a base-class change exposes a lost override; checked JavaScript can express the intent with JSDoc `@override`.

### Give each Promise a responsible caller or failure handler

Await a Promise, return it to a caller that owns its outcome, or attach a rejection handler at an intentional background-work boundary. `void doWork()` does not handle a rejection. A deliberate background call can use `void doWork().catch(reportError)` when `reportError` owns the failure response; a catch that does nothing merely hides the failure.

Do not pass a Promise as a condition or put an asynchronous function into a callback whose consumer expects a synchronous `void` result unless that consumer actually manages asynchronous failures. Use an adapter that handles rejection when integrating such an API.

When the current `try`/`catch` must handle an asynchronous rejection, await before leaving that scope:

```ts
async function loadWithFallback() {
  try {
    return await loadPrimary();
  } catch (error: unknown) {
    reportError(error);
    return loadFallback();
  }
}
```

Returning `loadPrimary()` without awaiting it would leave this catch unable to handle a later rejection. The await can also matter when `finally` owns cleanup that must follow settlement. Outside such an error-handling or resource-lifetime requirement, returning a Promise directly is valid. In JavaScript, omit the `: unknown` annotation; the runtime ordering is the same.

Treat caught and rejected values as unknown until checked: a rejection need not be an `Error`. TypeScript's strict catch-variable checking does not by itself type the parameter of `promise.catch(...)`; annotate that callback parameter as `unknown` and narrow it as needed.

## TypeScript type modeling

### Prefer checked construction and narrowing

Prefer these techniques before a type assertion:

- declare the intended type at the value's construction boundary;
- use `satisfies` to check a value without replacing its inferred type;
- narrow with control flow, discriminants, type predicates, or assertion functions;
- validate unknown external data before returning an application type; and
- redesign an API when its types cannot express initialization or state transitions.

### Establish non-null and initialization facts at runtime

Do not use the postfix non-null assertion in an expression:

```ts
const accountId = session.account!.id;
```

The `!` removes `null` and `undefined` from the static type but emits no runtime check. Establish the invariant where the value becomes required. Use the mechanism appropriate to the environment, such as `node:assert`, an explicit check followed by a throw, or an existing validator. The check must execute, stop invalid state before use, provide useful diagnostic context, and let TypeScript retain the established fact:

```ts
const account = session.account;
if (account === undefined) {
  throw new Error("Expected the session to contain an account");
}

const accountId = account.id;
```

This example assumes the declared missing state is `undefined`; check `null` too when the contract permits it.

Do not use a definite-assignment assertion on a class field or variable to suppress initialization analysis:

```ts
class Client {
  private connection!: Connection;
}
```

Initialize the field in the constructor, represent the uninitialized state in its type, or redesign the lifecycle so code cannot observe an invalid object.

### Do not chain assertions to escape a type disagreement

Do not write consecutive ordinary type assertions or use assertion bridges between incompatible types:

```ts
const request = input as unknown as Request;
const response = input as never as Response;
```

The intermediate type supplies no runtime evidence. The same objection applies to any intermediate type and to an equivalent bridge stored in a variable or hidden in a helper. Correct the model, translate through an adapter, validate the value, or change the boundary contract. Keep `as const` as a standalone const assertion, optionally followed by `satisfies`, rather than using another assertion to replace its result type.

### Treat an ordinary assertion as a proof obligation

A single `value as T` follows TypeScript's assertion compatibility rules but still performs no runtime validation. Avoid it unless the program already establishes an invariant that TypeScript cannot express and safer designs have been considered.

An exceptional assertion must satisfy all of these conditions:

1. Annotations, `satisfies`, narrowing, runtime validation, and API redesign do not adequately express the result.
2. The assertion is confined to the smallest boundary that owns the invariant.
3. The invariant is concrete: identify what makes the runtime value satisfy the asserted type and where that guarantee comes from.
4. Prefer an executable test that would fail if the invariant stopped holding. When a useful test cannot be written, record the invariant, its evidence, the type-system limitation, and why no safer design fits beside the assertion.

A test or comment makes the safety argument reviewable; it does not make an assertion safe by itself. When the assertion also requires suppressing a diagnostic, the [user-approval rule](#diagnostic-suppressions-require-explicit-user-approval) applies. A lint rule's acceptance does not prove that the underlying invariant is true.

`as const` retains literal information and readonly structure; it does not claim that a runtime value has an unrelated shape. `satisfies` also performs no runtime validation, so neither substitutes for validating external data.

### Use optional only for independently optional fields

Use an optional property when omitting that field remains valid independently of the object's other fields:

```ts
interface SearchOptions {
  caseSensitive?: boolean;
}
```

When another field determines whether a property must exist, an optional property erases that relationship:

```ts
interface LoadState<T> {
  status: "loading" | "ready" | "failed";
  value?: T;
  error?: Error;
}
```

This permits a ready state without a value and a loading state with a result. Represent mutually exclusive states with a discriminated union:

```ts
type LoadState<T> =
  | { status: "loading" }
  | { status: "ready"; value: T }
  | { status: "failed"; error: Error };
```

Each member now declares that state's required fields, and narrowing exposes only fields available in the selected state. Do not make a required property optional to defer initialization or silence an assignment error.

`property?: T` allows the property to be absent. `property: T | undefined` requires its presence while allowing an undefined value. Property presence is observable through the `in` operator, `Object.keys()`, and object spread. A serializer preserves the distinction only if its format records presence: `JSON.stringify` omits undefined object properties, so it produces the same output for those two absence cases.

`exactOptionalPropertyTypes` preserves this assignment distinction: an optional property accepts an explicitly assigned `undefined` only when its value type includes it. The domain distinction matters even when the compiler does not enforce it.

## Diagnostic suppressions require explicit user approval

Suppression mechanisms are available but strongly discouraged. An Agent must not add `eslint-disable`, `@ts-ignore`, `@ts-nocheck`, `@ts-expect-error`, bulk suppression entries, or equivalent diagnostic bypasses on its own. This includes negative type tests: a legitimate testing purpose does not itself authorize a directive.

First attempt to fix the implementation, model, or boundary. If a suppression remains necessary, explain the exact diagnostic and location, the invariant and evidence, the alternatives considered, and the proposed scope. Obtain the user's explicit agreement before applying it. General permission to implement a feature, a comment claiming safety, and a passing test are not approval for the suppression. Do not turn off a check elsewhere to avoid this decision.

An approved exception must stay as narrow as agreed and include a concrete reason. Ordinary assertion exceptions still need the [proof obligation](#treat-an-ordinary-assertion-as-a-proof-obligation). An exception cannot supply missing runtime evidence or turn a chained assertion into validation. Tool configuration can detect many mistakes and stale directives; it cannot establish that the user approved an exception.

## References

- [TypeScript: Type assertions and non-null assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)
- [TypeScript: Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript: Assertion functions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)
- [TypeScript: Optional properties](https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties)
- [TypeScript: `satisfies`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator)
- [TypeScript: JavaScript checking and JSDoc](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html)
- [typescript-eslint: `return-await`](https://typescript-eslint.io/rules/return-await/)
