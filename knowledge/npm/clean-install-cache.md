# npm clean-install cache reuse

## Scope

This document defines how npm's cache interacts with lockfile-driven clean
installations and how to evaluate cache-preference changes without altering the
selected dependency graph, verified package content, installation policy, or
recovery behavior.

## When to update

Update this document when npm changes its clean-install contract, cache or
registry-fetch behavior, integrity or audit behavior, configuration scope, or
when `actions/setup-node` changes what npm data it caches, or when real
clean-install optimization work exposes a missing behavior invariant,
applicability condition, or efficiency proof.

## Verify the current behavior

The mappings in this document were verified against
[npm CLI 12.0.2](https://github.com/npm/cli/tree/v12.0.2) and
[`actions/setup-node` at commit `94196ee`](https://github.com/actions/setup-node/tree/94196ee1d15439c1b6651cd87ef14e88ec435966).
Before changing an installation that uses another version, verify its current
clean-install, cache, network-fallback, integrity, audit, and configuration
semantics against the authoritative upstream documentation or source.

## Distinguish cached data from the installed tree

npm's cache is a content-addressable store for HTTP request data and other
package-related data. npm verifies content when inserting it into and extracting
it from the cache, but does not guarantee that previously cached content remains
available indefinitely. Treat a restored or shared cache as an opportunity for
reuse, not as proof that every required artifact is present.

`actions/setup-node` caches the directory reported by `npm config get cache`.
It explicitly does not cache `node_modules`, and its normal cached-install
example still runs `npm ci` after restoring the package-manager data. Other
cache mechanisms need the same distinction: reusing npm's cache can reduce
fetching work, but it does not supply an installed dependency tree.

`npm ci` requires an existing lockfile, rejects disagreement between the
lockfile and `package.json`, removes the existing `node_modules`, installs the
complete project, and does not update the manifest or lockfile. Restoring npm's
cache does not remove that reconstruction work.

## Select a fetch mode without changing the install contract

Plain `npm ci` already uses npm's cache. The relevant modes differ in how they
treat cached data and missing data, not in whether caching exists:

| Invocation                | Cached data                                                    | Missing data                       |
| ------------------------- | -------------------------------------------------------------- | ---------------------------------- |
| `npm ci`                  | Reuses eligible cached responses and may revalidate stale ones | Fetches from the registry          |
| `npm ci --prefer-offline` | Bypasses staleness checks for cached data                      | Fetches from the registry          |
| `npm ci --offline`        | Uses only data already available locally                       | Fails instead of using the network |

Use `--prefer-offline` as the candidate optimization when a lockfile-driven
clean install restores or shares npm cache data and must retain recovery for a
cache miss. Strict `--offline` is a different operational contract: use it only
when cache completeness is independently enforced and failure on any missing
or unusable entry is intended.

Cache preference does not disable integrity verification. With
`--prefer-offline`, missing package data can still be fetched, and enabled
install-time audit behavior can make its own requests. In npm CLI 12.0.2,
strict `--offline` instead suppresses the install-time audit report even when
audit is enabled. A project that requires that security gate must retain an
online install mode or run a separate online audit step.

## Preserve the protected installation behavior

Fix one comparison baseline for the candidate and control: source revision,
manifest and lockfile, npm version and configuration, platform, registry
inputs, environment, and installation-script policy. The protected result is
the same lockfile-selected dependency graph and the same accepted
integrity-verified package content. Changing that result is a correctness
failure, not an acceptable performance tradeoff.

First establish that this fixed baseline satisfies the project's intended
installation behavior. Matching control and candidate results do not validate
a baseline made incomplete by a separate npm-version, configuration, or
installation-policy change.

Preserve every tree-shaping flag used to create the lockfile and the project's
existing policies for lifecycle scripts, approved native builds, registry and
authentication settings, audit, and failure recovery. `--prefer-offline`
changes registry-fetch cache preference; it does not replace any of these
responsibilities. Because `npm ci` removes the prior installed tree before
reconstruction completes, a failed run still requires a successful install to
recover.

Do not require byte-for-byte equality of the final `node_modules` tree unless
the project separately owns that contract. Lifecycle scripts and native builds
can produce environment-dependent files or metadata even when both commands
select and verify the same packages. Compare project-owned generated artifacts
when their equivalence is required.

## Keep the preference on the intended clean-install path

Prefer the command-scoped `npm ci --prefer-offline` when only a particular CI,
test, deployment, or isolated-workspace clean installation is being optimized.
A project `.npmrc` applies to npm operations in that project, while user and
global configuration have wider reach. Persist `prefer-offline=true` only when
every affected npm operation is intended to bypass cached-data staleness checks;
ordinary dependency discovery or freshness-sensitive work may need the normal
policy.

The option name is not a portable package-manager contract. Do not translate
this npm recommendation to another package manager without verifying that
manager's lockfile, installed-tree, cache, network-fallback, integrity, and
script semantics from its current authoritative sources.

## Establish higher efficiency before adoption

Define which efficiency metric the task values, such as wall-clock duration,
registry requests or transferred bytes, or another resource cost. A reduction
in one metric does not establish a reduction in another.

Avoid claiming that plain `npm ci` ignores a warm cache. `--prefer-offline`
removes eligible stale-cache revalidation work; it cannot remove deletion,
unpacking, linking, audit, lifecycle scripts, native compilation, or cache
misses. Cached responses that are still HTTP-fresh may already avoid
revalidation under plain `npm ci`, and non-fetch work can dominate the elapsed
time.

Mechanism-level evidence can justify a command-scoped change when the actual
path reuses cached responses that would otherwise be revalidated and the change
adds no material setup or maintenance work. Measure the target workload when
that condition cannot be established directly, when cache restoration or other
workflow changes add cost, or before making an end-to-end or quantitative
performance claim.

Apply the comparability principles in
[Test execution cost](../software-testing/test-execution-cost.md) when the
installation belongs to test or CI setup. For this installation comparison,
use the protected-behavior comparison baseline above, then also hold the
hardware and starting `node_modules` state constant. Define the cache warm-up
policy and cache contents, and start every control and candidate run from the
same defined cache baseline. Interleave or randomize the variants, repeat both,
and report a distribution or repeated aggregate. Measure cache restoration
separately when the workflow pays that cost, and record registry requests or
transferred bytes when they help establish the proposed mechanism.

Adopt the candidate only when the protected behavior remains consistent and
the complete relevant workflow is more efficient. Keep conclusions scoped to
the measured environment, and leave the existing command unchanged when either
condition is false or cannot be established.

## References

- [npm cache documentation](https://github.com/npm/cli/blob/v12.0.2/docs/lib/content/commands/npm-cache.md)
- [npm ci documentation](https://github.com/npm/cli/blob/v12.0.2/docs/lib/content/commands/npm-ci.md)
- [npm cache-preference definitions](https://github.com/npm/cli/blob/v12.0.2/workspaces/config/lib/definitions/definitions.js)
- [npm registry-fetch cache-mode mapping](https://github.com/npm/cli/blob/v12.0.2/node_modules/npm-registry-fetch/lib/index.js)
- [npm offline audit behavior](https://github.com/npm/cli/blob/v12.0.2/workspaces/arborist/lib/audit-report.js)
- [`actions/setup-node` cache documentation](https://github.com/actions/setup-node/blob/94196ee1d15439c1b6651cd87ef14e88ec435966/README.md)
- [`actions/setup-node` npm cache implementation](https://github.com/actions/setup-node/blob/94196ee1d15439c1b6651cd87ef14e88ec435966/src/cache-utils.ts)
