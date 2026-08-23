# Enforcing TypeScript coding principles

## Scope

This document maps TypeScript type-safety principles to compiler options, typescript-eslint rules, dedicated plugin rules, suppression controls, tests, and CI gates. It owns the enforcement coverage and known gaps of those mechanisms; the coding principles themselves and project-specific toolchain policy remain outside its scope.

## When to update

Update this document when TypeScript compiler options, ESLint configuration semantics, typescript-eslint rules or typed-linting setup, suppression controls, or supported parser syntax change the enforcement coverage described here, or when a real violation bypasses the recommended controls.

## Enforce a semantic rule, not a convenient approximation

Start from the concrete invariant being enforced, such as preserving a possible missing state or rejecting an assertion that supplies no runtime evidence, then choose the narrowest supported mechanism that enforces it. [TypeScript coding principles](coding-principles.md) owns the underlying design rationale; the mappings below state the enforcement coverage needed here. A compiler or lint rule is useful only for the cases it actually rejects. Record residual cases as review responsibilities instead of implying that a partial check proves the whole principle.

Use established TypeScript and typescript-eslint capabilities before creating a custom rule. Add a dedicated plugin rule only for a stable policy that existing rules cannot express accurately.

## Use compiler options to preserve uncertain states

A strict TypeScript baseline should include these options when the supported code permits them:

```json
{
  "compilerOptions": {
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true
  }
}
```

`strict` enables the strict family of type checks, including nullability analysis unless the project explicitly overrides an individual option. `exactOptionalPropertyTypes` distinguishes an omitted optional property from an explicitly assigned `undefined` value. `noUncheckedIndexedAccess` adds `undefined` to undeclared indexed members so callers must account for a missing entry.

These options cannot decide whether absence is valid in the business domain. They can preserve a distinction expressed by the model, but an Agent or reviewer must still reject an optional property introduced only to bypass initialization or assignment errors.

## Combine policy rules with typed linting

After configuring typescript-eslint's current [typed linting](https://typescript-eslint.io/getting-started/typed-linting/) support, apply an enforcement fragment equivalent to:

```js
{
  linterOptions: {
    reportUnusedDisableDirectives: "error",
  },
  rules: {
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/consistent-type-assertions": [
      "error",
      { assertionStyle: "never" },
    ],
    "@typescript-eslint/no-unsafe-type-assertion": "error",
  },
}
```

The responsibilities of these rules differ:

| Principle or risk                               | Enforcement mechanism                                                            | Coverage boundary                                                                                                                                                                |
| ----------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Postfix non-null assertion such as `value!`     | `@typescript-eslint/no-non-null-assertion`                                       | Rejects expression assertions; it does not reject definite-assignment assertions on declarations.                                                                                |
| Ordinary type assertions are exceptional        | `@typescript-eslint/consistent-type-assertions` with `assertionStyle: "never"`   | Rejects ordinary `as T` and angle-bracket assertions while retaining `as const`; an approved exception needs a narrow suppression.                                               |
| Narrowing and chained assertions are unsafe     | `@typescript-eslint/no-unsafe-type-assertion`                                    | Uses type information to reject narrowing assertions, including the unsafe step in common `as unknown as T` and `as never as T` bridges; it requires typed linting.              |
| Definite-assignment assertions are prohibited   | A dedicated plugin rule such as `policy/no-definite-assignment-assertion`        | No typescript-eslint rule above owns declaration assertions such as `field!: T` or `let value!: T`; cover every supported declaration node and parser version in the rule tests. |
| Every syntactically chained assertion is banned | A dedicated plugin rule such as `policy/no-chained-type-assertions`, when needed | A syntax rule can reject nested assertions regardless of type compatibility; indirect bridges through variables require type-aware analysis or the unsafe-assertion rule.        |

Do not encode shared declaration or chaining policies as additional selectors in `no-restricted-syntax`. In layered configurations, a later value for that one rule key can replace the earlier selector list. Use independently named plugin rules as described in [Composable ESLint policy rules](../eslint/composable-policy-rules.md).

## Make exceptional assertions visible

An ordinary assertion that survives the default prohibition must be local, reviewable, and backed by a concrete invariant. Disable only the rules that reject that one assertion and include a description after `--`:

```ts
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion -- The decoder validates every Account field; TypeScript cannot retain the branded identifier refinement.
return decoded as Account;
```

Prefer a test that fails when the stated invariant stops holding. When a useful test cannot be written, the adjacent description must identify the evidence that establishes the runtime shape, explain why TypeScript cannot express it, and explain why a safer model or runtime validation boundary does not fit. A vague explanation such as “TypeScript cannot infer this” is not sufficient.

Enable `reportUnusedDisableDirectives` so a suppression fails once it is no longer needed. A project may also adopt an established ESLint-comments plugin when it needs machine enforcement for suppression descriptions or restrictions on disabling particular rule IDs. Treat that as a separate dependency decision; the baseline rules do not prove that a description is accurate.

Do not permit suppressions for non-null assertions or chained assertions when the governing policy prohibits them absolutely. A downstream configuration can still disable any rule explicitly, so CI and review must treat changes to the enforcement configuration as policy changes rather than ordinary cleanup.

## Verify the effective enforcement

Run both the compiler and ESLint in CI, and make warnings fail:

```sh
tsc --noEmit
eslint . --max-warnings 0
```

Verify the effective configuration for representative TypeScript files with `eslint --print-config`. A successful lint command does not prove that typed rules applied to the intended files if a glob, ignore, parser option, or later configuration object excluded them.

Test each custom plugin rule with ESLint `RuleTester`. Include valid cases, every prohibited syntax form, parser-specific nodes, and near misses that must remain allowed. Add an integration fixture or configuration test that proves the exported preset enables every required rule after composition; asserting only that a configuration object contains a literal value does not prove that ESLint applies it.

Static tooling cannot determine whether an optional property is semantically correct, whether a runtime validator faithfully implements its declared predicate, or whether an assertion's documented invariant is true. Keep those residual decisions in code review and tests.

## References

- [TypeScript: `strict`](https://www.typescriptlang.org/tsconfig/strict.html)
- [TypeScript: `exactOptionalPropertyTypes`](https://www.typescriptlang.org/tsconfig/exactOptionalPropertyTypes.html)
- [TypeScript: `noUncheckedIndexedAccess`](https://www.typescriptlang.org/tsconfig/noUncheckedIndexedAccess.html)
- [typescript-eslint: Typed linting](https://typescript-eslint.io/getting-started/typed-linting/)
- [typescript-eslint: `no-non-null-assertion`](https://typescript-eslint.io/rules/no-non-null-assertion/)
- [typescript-eslint: `consistent-type-assertions`](https://typescript-eslint.io/rules/consistent-type-assertions/)
- [typescript-eslint: `no-unsafe-type-assertion`](https://typescript-eslint.io/rules/no-unsafe-type-assertion/)
- [ESLint: Configure rules](https://eslint.org/docs/latest/use/configure/rules)
