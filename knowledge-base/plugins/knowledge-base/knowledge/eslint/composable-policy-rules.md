# Composable ESLint policy rules

## Scope

This document defines how to represent reusable syntax and static-analysis policies in layered ESLint configurations without allowing unrelated configuration additions to replace existing restrictions accidentally. It owns the boundary between `no-restricted-syntax` and dedicated plugin rules, semantic rule granularity, local versus distributed plugins, shareable presets, and behavioral verification of configuration composition.

## When to update

Update this document when ESLint changes flat-configuration merging, plugin or shareable-configuration interfaces, selector handling, `RuleTester`, effective-configuration inspection, or suppression behavior, or when a shared policy is lost or misapplied through a configuration composition case not covered here.

## One rule key has one effective configuration

When several ESLint configuration objects match a file, ESLint merges them in order and later objects override earlier objects when the same key conflicts. Rule entries have one special merge behavior: different rule IDs compose independently, and a later configuration that supplies only severity for the same rule ID retains existing options. A later configuration that supplies options replaces the earlier options.

For example, after an earlier configuration sets `semi: ["error", "never"]`, these later values produce different effective configurations:

| Later rule value     | Effective rule configuration |
| -------------------- | ---------------------------- |
| `"warn"`             | `["warn", "never"]`          |
| `["warn"]`           | `["warn", "never"]`          |
| `["warn", "always"]` | `["warn", "always"]`         |

`no-restricted-syntax` stores every selector in the option array of one rule ID. A downstream configuration that adds another selector by assigning that rule again does not append to the inherited list:

```js
export default [
  {
    rules: {
      "no-restricted-syntax": [
        "error",
        { selector: "WithStatement", message: "Do not use with." },
      ],
    },
  },
  {
    rules: {
      "no-restricted-syntax": [
        "error",
        { selector: "DebuggerStatement", message: "Do not commit debugger." },
      ],
    },
  },
];
```

For files matched by both objects, only the later `DebuggerStatement` restriction remains. This makes `no-restricted-syntax` fragile as a container for independent policies owned by a base config, multiple packages, or downstream consumers.

## Keep `no-restricted-syntax` local and final

Use `no-restricted-syntax` when a restriction is local to one final configuration layer, has no independent reuse or evolution, and can be reviewed together with the complete selector array. It is a lightweight fit for a one-off ban, not a stable extension point for a growing policy set.

Do not require every use of `no-restricted-syntax` to become a plugin. Promote a restriction when at least one of these conditions applies:

- several configurations or packages must compose it with other restrictions;
- the policy needs a semantic name, documentation, options, or diagnostics of its own;
- syntax coverage spans several AST node kinds or parser versions;
- false positives and allowed exceptions require focused tests; or
- losing the restriction silently would weaken a correctness or security invariant.

## Give each invariant its own plugin rule

Represent each independently maintained policy with a distinct rule ID:

```js
{
  rules: {
    "policy/no-definite-assignment-assertion": "error",
    "policy/no-chained-type-assertions": "error",
  },
}
```

A later configuration can add another rule without replacing these entries because the rule IDs do not collide. A downstream consumer can still explicitly disable or reconfigure one of them; the plugin prevents accidental replacement by an unrelated policy, not intentional override.

Keep one invariant per rule. A plugin containing one configurable “all restrictions” rule recreates the same collision and ownership problem behind a different name. Separate rule IDs also give suppressions, diagnostics, documentation, tests, and release notes a precise subject.

For example, a TypeScript policy that forbids declaration assertions should own `PropertyDefinition`, `AccessorProperty`, and `VariableDeclarator` nodes whose parser representation marks them as definite. A separate chained-assertion rule should own nested assertion expressions. Their detailed use belongs in the TypeScript enforcement mapping, while the plugin structure follows the general composition rule defined here.

## Prefer existing rules before owning a plugin

Search ESLint, the language-aware plugin already used by the project, and mature ecosystem plugins before implementing a custom rule. An established rule usually offers broader syntax coverage, diagnostics, documentation, and compatibility testing at lower local maintenance cost.

Create a local plugin when the missing rule expresses policy for one repository or tightly controlled workspace. A local flat-config plugin can be an ordinary imported JavaScript object; it does not need to be published. Package and distribute a plugin only when several independent repositories need the rule and its compatibility and release lifecycle justify a shared dependency.

When a custom rule remains necessary:

- use parser AST nodes rather than matching source text;
- request type information only when syntax alone cannot decide the violation;
- report the smallest node that explains the problem;
- provide an automatic fix only when it preserves program meaning;
- document supported parsers and syntax versions; and
- keep policy-specific options small enough that configuration composition remains understandable.

## Export presets without hiding ownership

A reusable plugin may export named configurations such as `recommended` or `strict`. Keep plugin registration and rule enablement together in the supported preset, and give each configuration object a descriptive name so error messages and Config Inspector identify its source.

Treat the preset as a default policy selection, not an immutable layer. Consumers can override it, so changes to downstream rule severities or suppressions still require review under the consuming project's policy.

## Test behavior and composition

Use ESLint `RuleTester` to verify each rule independently. Cover valid cases, each prohibited node shape, parser-specific syntax, allowed near misses, message locations, and fixes or suggestions when present.

Also test the configuration seam. Compose the exported preset with a later configuration that adds an unrelated rule, calculate or print the effective configuration for a representative file, and confirm that both rule IDs remain enabled. Include a lint fixture that violates each required policy so a missing parser mapping, file glob, or preset entry fails observably.

`eslint --print-config` is useful for diagnosis and manual verification. An automated test should assert the effective behavior or calculated configuration at the public seam rather than matching the source text of the configuration file.

## References

- [ESLint: Configuration files](https://eslint.org/docs/latest/use/configure/configuration-files)
- [ESLint: `no-restricted-syntax`](https://eslint.org/docs/latest/rules/no-restricted-syntax)
- [ESLint: Create plugins](https://eslint.org/docs/latest/extend/plugins)
- [ESLint: Custom rules](https://eslint.org/docs/latest/extend/custom-rules)
- [ESLint: `RuleTester`](https://eslint.org/docs/latest/integrate/nodejs-api#ruletester)
