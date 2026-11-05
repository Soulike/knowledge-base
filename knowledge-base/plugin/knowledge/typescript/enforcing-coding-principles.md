# Enforcing TypeScript and JavaScript coding principles

## Scope

This document provides a project-independent reference for choosing compiler and ESLint correctness checks beyond a recommended baseline, primarily for TypeScript with explicit JavaScript applicability. It owns preset coverage, recommended and optional checks, compatible configuration examples, suppression controls, and verification of effective enforcement.

## When to update

Update this document when supported major versions, compiler defaults, ESLint presets, typescript-eslint rules, parser interfaces, or compatibility ranges change, or when observed configuration behavior changes the coverage or tradeoffs described here.

## Baseline and supported versions

Choose checks for their ability to catch common mistakes at a reasonable cost. [Coding principles](coding-principles.md) owns the underlying rules and safe alternatives, including the requirement for explicit user approval before an Agent uses a diagnostic suppression. Partial static coverage is useful; complete prevention of deliberate bypasses is not a prerequisite for adoption.

Support the latest two TypeScript majors and ESLint majors, using the latest stable release within each major. Compare defaults against the older supported major and identify newer-major differences. Select rule-plugin versions from their official compatibility ranges rather than assuming every version combination works.

The verified baseline on 2026-11-05 is:

| Component         | Support target and comparison baseline                                                     | Compatibility boundary                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript        | Majors 6/7; defaults compared against 6, with compiler examples checked on 6.0.3 and 7.0.2 | TS 6 defaults strict checking on; keep `strict: true` explicit and inspect individual overrides.                                                                  |
| ESLint            | Majors 9/10; recommended rules compared against 9                                          | Use a corresponding supported `@eslint/js` version. ESLint 10 adds `no-unassigned-vars`, `no-useless-assignment`, and `preserve-caught-error` to recommended.     |
| typescript-eslint | Verified with 8.72.1; select a compatible release                                          | Its declared range is TypeScript `>=4.8.4 <6.1.0` and ESLint `^8.57.0 \|\| ^9.0.0 \|\| ^10.0.0`. TS 7 typed lint is not yet officially supported by this release. |

The comparison baseline is `strict: true`, `@eslint/js` recommended, and typescript-eslint `recommendedTypeChecked`, with typed linting correctly configured. TypeScript's bare defaults, generated initial configuration, and typescript-eslint's untyped `recommended` are different baselines. This reference does not recommend upgrading to an unsupported compiler/plugin combination. Recheck compatibility when moving the two-major window. [TS 6 defaults](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html), [ESLint 10 changes](https://eslint.org/docs/latest/use/migrate-to-10.0.0), [typescript-eslint package compatibility](https://registry.npmjs.org/typescript-eslint/8.72.1).

### Already covered by the baseline

Keep these protections, but do not count them as extra rules:

| Existing protection                                                   | Baseline coverage and important qualification                                                                                                                                                                                                             |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Strict nullability, initialization, implicit any, and catch variables | The TS strict family provides these checks unless overridden; it does not include exact optional properties, unchecked indexed access, or Promise catch-callback parameters.                                                                              |
| Explicit `any` and TS error-suppression comments                      | `no-explicit-any` and `ban-ts-comment` are already recommended. The latter bans ts-ignore/ts-nocheck but permits described ts-expect-error by default; tool acceptance does not grant user approval.                                                      |
| Propagation of `any`                                                  | Typed recommended includes `no-unsafe-assignment`, `no-unsafe-argument`, `no-unsafe-call`, `no-unsafe-member-access`, and `no-unsafe-return`. These do not validate declarations or external data.                                                        |
| Promise mistakes                                                      | Typed recommended includes `no-floating-promises`, `no-misused-promises`, and `await-thenable`. Floating-Promise checking defaults to `ignoreVoid: true`; the recommendation below tightens that option.                                                  |
| Other existing correctness checks                                     | Recommended presets already cover unsafe optional chaining, accidental switch fallthrough, async Promise executors, unbound methods, invalid plus/template operations, and unnecessary type assertions. The last checks redundancy, not assertion safety. |

[Shared preset documentation](https://typescript-eslint.io/users/configs/) and the [released preset source](https://github.com/typescript-eslint/typescript-eslint/tree/v8.72.1/packages/eslint-plugin/src/configs/flat) define membership. `strictTypeChecked` includes more opinionated checks and tighter options; it is not every correctness rule and can change outside major releases. Select its useful increments deliberately rather than treating it as an interchangeable baseline.

## Recommended compiler increments

For TypeScript, add these to the strict baseline:

```json
{
  "compilerOptions": {
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noImplicitOverride": true,
    "allowUnreachableCode": false
  }
}
```

| Option                                                                                                  | Mistake it catches and practical cost                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`exactOptionalPropertyTypes`](https://www.typescriptlang.org/tsconfig/exactOptionalPropertyTypes.html) | Preserves omitted property versus explicitly assigned undefined. Object assembly and dependency types may need correction. It cannot decide whether a field is optional in the domain.                                              |
| [`noUncheckedIndexedAccess`](https://www.typescriptlang.org/tsconfig/noUncheckedIndexedAccess.html)     | Adds undefined to potentially missing array and open-dictionary reads. Prefer checks, element iteration, or precise keys; a general array length test does not always prove a particular access safe.                               |
| [`noImplicitReturns`](https://www.typescriptlang.org/tsconfig/noImplicitReturns.html)                   | Finds functions that return results on some paths but omit a return on others. It does not require every function to return a value or prove switch exhaustiveness.                                                                 |
| [`noImplicitOverride`](https://www.typescriptlang.org/tsconfig/noImplicitOverride.html)                 | Requires explicit override intent so base-class changes reveal lost overrides. It does not prove the overriding implementation is correct.                                                                                          |
| [`allowUnreachableCode: false`](https://www.typescriptlang.org/tsconfig/allowUnreachableCode.html)      | Makes syntactically unreachable statements compiler errors. This fills a real gap: typescript-eslint disables core no-unreachable for TS, while TS defaults to editor suggestions. It does not prove type-dependent unreachability. |

TS 6 also defaults `noUncheckedSideEffectImports` on; it is not an extra increment at this baseline. Compiler checks preserve distinctions in the declared model, not the truth of that model.

## Recommended ESLint increments

These additions are relative to typed recommended. “Strict” means `strictTypeChecked` already enables the check in 8.72.1; it does not mean the baseline includes it.

| Rule                                                                                                                   | Purpose, important option, and limitation                                                                                                                                                                                                  | Strict              |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| [`switch-exhaustiveness-check`](https://typescript-eslint.io/rules/switch-exhaustiveness-check/)                       | Enumerate closed union/enum members. Keep `considerDefaultExhaustiveForUnions: false`; use `allowDefaultCaseForExhaustiveSwitch: false` to reject redundant catch-alls. External values still need validation.                             | No                  |
| [`no-non-null-assertion`](https://typescript-eslint.io/rules/no-non-null-assertion/)                                   | Rejects expression `value!`; it does not cover declaration assertions such as `field!: T` or `let value!: T`. Keep those prohibited in coding and review without requiring a custom rule before adopting this one.                         | Yes                 |
| [`no-unsafe-type-assertion`](https://typescript-eslint.io/rules/no-unsafe-type-assertion/)                             | Rejects narrowing assertions and common unsafe `as unknown as T`, `as any as T`, and `as never as T` bridges. Allows safe widening; it is not a syntactic ban on every chain. Introduced in 8.15.0.                                        | No                  |
| [`strict-boolean-expressions`](https://typescript-eslint.io/rules/strict-boolean-expressions/)                         | Use default options: allow ordinary string/number truthiness and nullable-object presence tests, but require explicit treatment of nullable strings/numbers/booleans and any. This avoids conflating absence with meaningful falsy values. | No                  |
| [`no-floating-promises`](https://typescript-eslint.io/rules/no-floating-promises/) with `ignoreVoid: false`            | Tightens an existing baseline rule. `void task()` alone no longer silences the warning; await, return responsibility, or attach a meaningful rejection handler.                                                                            | Rule yes; option no |
| [`no-unnecessary-condition`](https://typescript-eslint.io/rules/no-unnecessary-condition/)                             | Finds conditions or optional chains contradicted by declared types. Use accurate types and unchecked-index checking first; erroneous declarations can otherwise make necessary runtime checks look redundant.                              | Yes                 |
| [`return-await`](https://typescript-eslint.io/rules/return-await/) with `error-handling-correctness-only`              | Requires awaiting where the current error-handling scope needs settlement, without requiring every returned Promise to be awaited.                                                                                                         | Yes                 |
| [`use-unknown-in-catch-callback-variable`](https://typescript-eslint.io/rules/use-unknown-in-catch-callback-variable/) | Requires unknown for Promise rejection callback parameters, where TS strict catch-variable checking does not apply. Narrow before reading properties.                                                                                      | Yes                 |

### Flat configuration example

This TypeScript example targets a compatible typescript-eslint 8.72.1 toolchain and the latest stable ESLint 9 or 10, with the matching `@eslint/js` package. Use a Node runtime supported by that ESLint release and exposing `import.meta.dirname`. The example uses stable v8 `projectService`; files must belong to an appropriate TS project. Merge the policy into the project's existing configuration rather than replacing unrelated rules.

```js
import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig({
  files: ["**/*.{ts,tsx,mts,cts}"],
  extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  linterOptions: {
    reportUnusedDisableDirectives: "error",
  },
  rules: {
    "@typescript-eslint/switch-exhaustiveness-check": [
      "error",
      {
        allowDefaultCaseForExhaustiveSwitch: false,
        considerDefaultExhaustiveForUnions: false,
      },
    ],
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-unsafe-type-assertion": "error",
    "@typescript-eslint/strict-boolean-expressions": "error",
    "@typescript-eslint/no-floating-promises": ["error", { ignoreVoid: false }],
    "@typescript-eslint/no-unnecessary-condition": "error",
    "@typescript-eslint/return-await": [
      "error",
      "error-handling-correctness-only",
    ],
    "@typescript-eslint/use-unknown-in-catch-callback-variable": "error",
    "no-restricted-syntax": [
      "error",
      {
        selector:
          ":matches(TSAsExpression, TSTypeAssertion) > :matches(TSAsExpression, TSTypeAssertion).expression",
        message: "Do not use chained type assertions.",
      },
    ],
  },
});
```

The selector rejects directly nested ordinary assertions, including angle-bracket forms and `as const as T`, while allowing standalone `as const` and `satisfies`. It does not detect every indirect bridge through other expressions or variables; the unsafe-assertion rule adds useful type-aware coverage. TypeScript's parser already supplies the AST, so no separate parser implementation is needed.

`no-restricted-syntax` is appropriate when the final local layer owns the complete selector list. A later assignment with options replaces its earlier options. If the project already uses this rule, preserve the complete list; for a policy distributed across independently layered configurations, use a separately named rule as described in [Composable ESLint policy rules](../eslint/composable-policy-rules.md). That composition requirement does not make a new plugin necessary for a local final configuration.

## Optional stricter or project-dependent checks

| Check                                                                                                                         | When it earns its cost                                                                                                                                                                                                                                     |
| ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`consistent-type-assertions`](https://typescript-eslint.io/rules/consistent-type-assertions/) with `assertionStyle: "never"` | A project wants all ordinary as/angle-bracket assertions to fail by default. It retains const assertions but increases the need for authorized local exceptions. This stronger policy is optional; the recommended unsafe-assertion check remains enabled. |
| [`noPropertyAccessFromIndexSignature`](https://www.typescriptlang.org/tsconfig/noPropertyAccessFromIndexSignature.html)       | Bracket syntax should signal access accepted only by an open index signature. Misspelled bracket keys remain possible; unchecked indexed access provides the missing-value protection.                                                                     |
| [`no-unnecessary-type-parameters`](https://typescript-eslint.io/rules/no-unnecessary-type-parameters/)                        | Flag generics that do not express a useful relationship. Public API compatibility and legitimate abstractions may need judgment. Already included in strictTypeChecked.                                                                                    |
| `checkThenables: true` on no-floating-promises                                                                                | The project uses PromiseLike/thenable APIs beyond standard Promise types. Verify their actual contract before choosing allowlists or exceptions.                                                                                                           |
| [`noFallthroughCasesInSwitch`](https://www.typescriptlang.org/tsconfig/noFallthroughCasesInSwitch.html)                       | Add compiler-side redundancy for a policy already covered by baseline ESLint no-fallthrough. Empty grouped labels remain valid; decide intentional fallthrough explicitly.                                                                                 |

Do not add full-function return annotations, unused-symbol checks, or stricter primitive-to-string policies merely to make this list longer. Choose them for their own contract or maintenance benefit; several already overlap existing lint coverage.

## JavaScript applicability

| Kind of protection                                                             | What a JavaScript project needs                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core syntax rules, such as accidental fallthrough and unsafe optional chaining | An ESLint configuration matching the JS files; no type information is needed.                                                                                                                                                                   |
| Promise misuse, unsafe any propagation, conditions, and other typed rules      | Type information from the typescript-eslint parser/project service, plus accurate inference or JSDoc. This does not automatically enable compiler diagnostics.                                                                                  |
| Compiler checks on JS                                                          | `allowJs` and `checkJs`, or the appropriate file-level ts-check setup, with JS files included in the TS project. Some intent uses JSDoc, such as `@override`. JS inference is more permissive in several areas, so verify representative cases. |
| TS assertion and property-modeling syntax                                      | JS does not have ordinary TS as/!/override syntax. Rules visiting those AST nodes do not provide equivalent protection for JSDoc casts. Optional-property and index guarantees depend on the actual JSDoc/declaration model.                    |

The example above deliberately selects TS files; retain a separate matching JS configuration and enable only the applicable typed checks when that project supplies type information. Do not assume that changing the file glob makes JS equivalent to strict TypeScript. [JavaScript checking](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html) and [typed linting](https://typescript-eslint.io/getting-started/typed-linting/) describe these separate mechanisms.

## Keep exceptional suppression authorized and visible

The [coding principles](coding-principles.md#diagnostic-suppressions-require-explicit-user-approval) require an Agent to obtain explicit user approval before adding any diagnostic suppression, including described ts-expect-error in negative type tests. A rule's built-in allowance is not permission. Prefer correcting the model or implementation; only after approval apply the agreed narrow exception and its concrete reason.

`reportUnusedDisableDirectives: "error"` detects stale ESLint disable directives. `ban-ts-comment` checks TS directives, not ESLint disable comments; its default described-expect-error allowance does not establish approval or prove a description true. A project may choose additional comment-policy checks when justified, but no custom approval checker is required here.

ESLint bulk suppressions are a separate channel: the default suppressions file can apply without an inline explanation. Keep assertion exceptions local and reviewable; do not use bulk suppressions for the assertion-policy rules. Treat configuration changes or bulk entries that weaken checks as policy changes, not routine error cleanup. Detailed [ESLint rule configuration](https://eslint.org/docs/latest/use/configure/rules) and [bulk suppression behavior](https://eslint.org/docs/latest/use/suppressions) do not replace the human approval boundary.

## Verify the effective enforcement

Run the compiler and ESLint in CI, with warnings treated as failures:

```sh
tsc --noEmit
eslint . --max-warnings 0
```

Inspect representative files with `eslint --print-config` and run small valid/invalid examples through the actual compiler and linter. Include each intended file kind and configuration layer. ESLint 10 finds configuration starting from the checked file's directory; verify the effective result rather than relying on a successful command that skipped files or lacked type information.

If the project owns a custom rule, verify it with `RuleTester` and an integration case that composes the exported policy with another configuration. Cover prohibited syntax, valid near misses, parser versions, and unchanged restrictions after composition. Do not introduce a custom rule solely to claim complete coverage of every possible bridge.

Review still owns whether absence is valid in the domain, a validator establishes its declared facts, an assertion has real evidence, and an exception was explicitly approved. Static checks do not prove these decisions.
