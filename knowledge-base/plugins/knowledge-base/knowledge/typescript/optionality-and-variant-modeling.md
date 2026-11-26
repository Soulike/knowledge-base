# Modeling optionality and variants in TypeScript

## Scope

This document defines project-independent principles for modeling optionality
and variant shapes in TypeScript and JSDoc-checked JavaScript. It explains when
optional syntax (`?`, `| undefined`, `Partial<...>`, and `?.`) preserves
independent domain absence versus when it weakens required invariants across
object fields, utility types, function and callback parameters, tuple elements,
generic signatures, contract methods, and member access, and how to choose
discriminated unions, function overloads, separate operations, or explicit types
instead.

## When to update

Update this document when TypeScript or JSDoc semantics change the behavior of
optional properties, `exactOptionalPropertyTypes`, discriminated unions,
function overloads, conditional tuple arguments, or optional chaining, or when
recurring defects reveal a missing optionality-bypass pattern or safer modeling
alternative.

## Use optionality only for independent domain absence

Optionality—whether declared with `?`, `| undefined`, or `Partial<...>`, or
consumed with `?.`—is valid only when absence is independently permitted by the
domain contract. Never introduce optionality merely to make a call site compile,
defer initialization, simplify a test fixture, share an implementation signature,
or silence a type error.

TypeScript and linters check consistency against the types you declare, not
whether those types express the real invariant. Once an author weakens a type to
optional, rules such as `@typescript-eslint/no-unnecessary-condition` treat
`undefined` as expected and stop catching missing-value assumptions, turning
domain violations into silent bugs or defensive fallbacks.

Checked JavaScript using JSDoc type annotations follows the same principles
with `[param]`, optional `@property` tags, union `@typedef` types, and
`/** @overload */` blocks, subject to the checking limits described in
[JavaScript applicability](enforcing-coding-principles.md#javascript-applicability).

## Object fields and utility-type shortcuts

### Use optional only for independently optional fields

Use an optional property when omitting that field remains valid independently of
the object's other fields:

```ts
interface SearchOptions {
  caseSensitive?: boolean;
}
```

When another field determines whether a property must exist, an optional
property erases that relationship:

```ts
interface LoadState<T> {
  status: "loading" | "ready" | "failed";
  value?: T;
  error?: Error;
}
```

This permits a ready state without a value and a loading state with a result.
Represent mutually exclusive states with a discriminated union:

```ts
type LoadState<T> =
  | { status: "loading" }
  | { status: "ready"; value: T }
  | { status: "failed"; error: Error };
```

Each member now declares that state's required fields, and narrowing exposes
only fields available in the selected state. Do not make a required property
optional to defer initialization or silence an assignment error.

`property?: T` allows the property to be absent. `property: T | undefined`
requires its presence while allowing an undefined value. Property presence is
observable through the `in` operator, `Object.keys()`, and object spread. A
serializer preserves the distinction only if its format records presence:
`JSON.stringify` omits undefined object properties, so it produces the same
output for those two absence cases.

`exactOptionalPropertyTypes` preserves this assignment distinction: an optional
property accepts an explicitly assigned `undefined` only when its value type
includes it. The domain distinction matters even when the compiler does not
enforce it.

### Avoid `Partial<T>` on required contracts and closed mappings

`Partial<T>` marks every property optional, erasing required identifiers,
discriminators, and field coupling across the whole type:

- **Patch, creation, and fixture types:** Do not accept or pass `Partial<T>`
  merely to let callers or tests omit fields that the operation still requires.
  Define an explicit input type using `Pick`, `Omit`, or a dedicated interface.
- **Exhaustive closed-union tables:** When every member of a closed union must
  have an entry, use `Record<Status, Handler>` rather than
  `Partial<Record<Status, Handler>>`. Making the map `Partial` hides missing
  entries when a new variant is added and forces callers to handle an artificial
  `undefined` lookup result.

### Split optional contract methods when capabilities differ

Do not mark a method optional on a contract interface (`dispose?(): void`,
`validate?(): boolean`) merely so some implementations or test doubles can omit
it. Callers end up invoking `adapter.dispose?.()`, turning a missing required
capability into a silent no-op. Split separate capability interfaces or model
explicit capability variants instead.

## Function parameters and overloads

### Use optional parameters only for independent arguments

Use an optional parameter (`param?: T`, or a default value when omission
substitutes a valid independent value) only when omitting that argument remains
valid independently of the function's other parameters and return contract. Do
not make a parameter optional merely to satisfy a call site, share an
implementation signature across distinct shapes, or silence a type error.

When one parameter controls whether another is required or valid, or when
distinct parameter shapes produce different return types, optional parameters
erase those rules:

```ts
// Avoid: permits publish("apply") without target and publish("dry", "prod"),
// and forces every caller to narrow DryReport | PublishResult
function publish(
  mode: "dry" | "apply",
  target?: string,
): DryReport | PublishResult {
  // ...
}
```

Model distinct or coupled parameter shapes with the simplest mechanism that
preserves those invariants:

- **Separate named functions** when different parameter shapes correspond to
  distinct operations or caller intents (such as `previewPublish()` and
  `applyPublish(target)` instead of one mode-switched function).
- **A discriminated union parameter** when one operation's inputs fit in a
  single object whose fields depend on one another.
- **Function overloads** when one conceptual operation needs distinct
  positional arities (for example, accepting 1 or 3 arguments, never 2),
  multiple coupled positional parameters, or argument shapes that determine
  different return types (rather than varying only one parameter's type with the
  same return type).

When callers pass an options object with a shared return contract, prefer a
discriminated union parameter over function overloads: callers can also hold
and forward a variable typed as `PublishRequest` without failing overload
resolution:

```ts
type PublishRequest = { mode: "dry" } | { mode: "apply"; target: string };

function publish(request: PublishRequest): DryReport | PublishResult {
  // ...
}
```

Use function overloads when one function keeps positional parameters or returns
a narrower result type per input shape:

```ts
function publish(mode: "dry"): DryReport;
function publish(mode: "apply", target: string): PublishResult;
function publish(
  mode: "dry" | "apply",
  target?: string,
): DryReport | PublishResult {
  if (mode === "dry") {
    return buildDryReport();
  }
  if (target === undefined) {
    throw new Error("Expected target when publishing in apply mode");
  }
  return applyPublish(target);
}
```

When using function overloads, account for TypeScript's resolution rules:

- **Write at least two overload signatures above the implementation
  signature.** External callers see only the overload signatures, never the
  implementation signature. Inside the implementation body, narrow combined
  optional or union parameters safely (as with the `target === undefined` guard
  above) rather than asserting them non-null.
- **Collapse single-position unions and trailing optionals into one
  signature.** Do not write separate overloads that differ only in trailing
  optional parameters with the same return type (replace
  `diff(a: string): number; diff(a: string, b: string): number;` with
  `diff(a: string, b?: string): number`), or only in one parameter's type with
  the same return type (replace
  `formatId(id: string): string; formatId(id: number): string;` with
  `formatId(id: string | number): string`), unless separate object-type
  overloads are specifically required for excess property checking. TypeScript
  resolves each call to a single overload and will not distribute a union
  argument across separate overloads.
- **Order specific overloads before general ones.** TypeScript picks the first
  overload signature whose parameters match the call.

In checked JavaScript, do not mark coupled JSDoc `[param]` tags optional to
pass type checking; use separate functions, union `@typedef` parameter objects,
or `/** @overload */` blocks instead.

## Callbacks, tuples, and generic arguments

### Keep callback parameters required when always supplied

In a callback type, an optional parameter means the invoker may call the
callback _without_ that argument—not that the callback implementation may ignore
it:

```ts
// Avoid: forces callbacks to guard against undefined even when index is always passed
function forEachItem<T>(
  items: readonly T[],
  callback: (item: T, index?: number) => void,
): void {
  // ...
}
```

Because TypeScript already permits passing a callback that accepts fewer
parameters, declare every always-supplied callback parameter as required
(`(item: T, index: number) => void`). Likewise, avoid dual-optional error-first
callbacks such as `(err?: Error, data?: T) => void`, which allow neither or
both arguments; pass a single discriminated result or separate success and
failure callbacks instead.

### Use union tuples instead of coupled optional tuple elements

Do not use optional tuple elements (`[number, number?, number?]` or
`[tag: string, payload?: Payload]`) when only specific lengths or paired
variants are valid. Express the valid positional shapes as a union of fixed
tuples (`[number] | [number, number, number]` or
`["ping"] | ["upload", Uint8Array]`).

### Avoid optional generic parameters when keys dictate requirement

When a generic key determines whether an accompanying payload is required or
absent, marking the parameter optional lets callers omit required payloads:

```ts
type Events = { ping: void; created: { id: string } };

// Avoid: permits emit("created") without a payload
function emitBad<K extends keyof Events>(event: K, payload?: Events[K]): void {
  // ...
}

// Prefer: requires payload only when Events[K] is not void
function emit<K extends keyof Events>(
  event: K,
  ...args: Events[K] extends void ? [] : [payload: Events[K]]
): void {
  // ...
}
```

Alternatively, pass a single discriminated union object (`{ type: "ping" } | { type: "created"; id: string }`) when callers construct and forward event values.

## Optional chaining on required values

Do not use optional chaining (`session.account?.id`, `onCommit?.()`)—with or
without a fallback `??`—to silence `strictNullChecks` or
`noUncheckedIndexedAccess` when the value or callback is required by the
contract. Turning a missing required invariant into `undefined` or a silent
no-op hides defects instead of failing where the invariant broke. Validate
presence explicitly and throw or return an explicit failure when missing; reserve
`?.` for contracts where absence is legitimately valid and skipping the access
is the intended outcome.

## References

- [TypeScript: Optional properties](https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties)
- [TypeScript: Utility types (`Partial`, `Pick`, `Omit`, `Record`)](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [TypeScript: More on functions — overloads and callbacks](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads)
- [TypeScript: Declaration Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html#function-overloads)
- [TypeScript: JavaScript checking and JSDoc](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html)
- [TypeScript: `@overload` in JSDoc](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#overload-support-in-jsdoc)
