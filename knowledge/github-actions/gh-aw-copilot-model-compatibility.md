# Model compatibility in gh-aw Copilot workflows

## Scope

This document explains how to determine whether a gh-aw workflow using the Copilot engine can use a selected model with the intended API protocol, reasoning effort, and context limits. It distinguishes provider access from client configuration, identifies the model-information sources used by the execution environment, and defines what configuration and runtime evidence can establish. The scope follows the Copilot engine, regardless of the model vendor; other gh-aw engines have different execution paths.

## When to update

Update this document when gh-aw or its Agent Workflow Firewall (AWF) changes model discovery, alias resolution, protocol selection, or CLI installation; when Copilot CLI or SDK changes BYOK capability resolution, reasoning or context handling, or effective-configuration inspection; or when GitHub changes the authentication and model-metadata contracts used by workflows. Recheck the applicable execution path after changing any of those components rather than assuming an earlier model compatibility result still holds.

## Define what model compatibility means

A model being available to an account, a workflow completing successfully, and the requested configuration being honored are different claims. A suitable model must be permitted by the provider for the workflow's actual identity **and** usable by the execution environment with the capabilities the task requires. Neither a subscription's model list nor gh-aw's built-in catalog establishes both conditions.

For example, a provider may accept a new model identifier while the client uses a generic 128K prompt budget. A successful request then proves callability, not that an expected larger context tier was used. Conversely, a model with known client configuration can still be unavailable to the workflow's credential. Treat model names as candidates to evaluate, not a portable whitelist.

The implementation details below were checked on 2026-09-05 against gh-aw v0.87.10/v0.88.2, AWF v0.28.10/v0.28.12, and Copilot CLI v1.0.80/v1.0.83. These are evidence boundaries, not recommended version pins or a promise about every later release.

## Identify the actual execution path

Establish the gh-aw compiler and generated runtime versions, the AWF version, the CLI binary actually launched, CLI-only versus SDK execution, and the provider/authentication route. Record the selected model and any resolved provider or wire-model identity along with the reasoning effort and context requirements. Two sessions with the same model name can have different capabilities when any of these inputs differ.

The workflow's inference credential is not necessarily the local user's Copilot login. gh-aw supports Actions-token inference through `copilot-requests: write` and other authentication arrangements; use the applicable [gh-aw authentication contract](https://github.github.com/gh-aw/reference/auth/) to establish whose model availability and policy apply. Local subscription access does not by itself establish access for a workflow's identity.

Normal Copilot authentication and bring-your-own-key (BYOK) mode are also different paths. In the inspected sandboxed CLI path, AWF supplies a proxy endpoint through Copilot's BYOK configuration while retaining the upstream inference credential outside the agent. The upstream can still be GitHub Copilot: BYOK here describes the client's connection mode, not necessarily a different model vendor. Do not assume that a locally authenticated model picker and this proxy-backed client use the same capability metadata. [AWF agent environment](https://github.com/github/gh-aw-firewall/blob/v0.28.12/docs/api-proxy-sidecar.md#agent-container), [Copilot BYOK configuration](https://github.com/github/gh-aw/blob/v0.88.2/docs/src/content/docs/reference/engines.md#copilot-bring-your-own-key-byok-mode).

An engine setting of `version: latest` does not establish the launched CLI version. The inspected gh-aw installer checks runner caches before downloading; without an explicit version it can instead consult a compatibility matrix and then a baked-in default. Confirm the actual executable/version from the run, especially after an upgrade. A compiler upgrade does not alone prove that the CLI changed. [Version-resolution implementation](https://github.com/github/gh-aw/blob/v0.88.2/actions/setup/sh/install_copilot_cli.sh#L539-L595).

## Keep model-information sources separate

| Source                                    | What it can establish                                                                                   | What it does not establish                                               |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Provider model metadata and access policy | Models and capabilities advertised for the relevant identity and integration                            | That a client has consumed or correctly applied those capabilities       |
| gh-aw model catalog and aliases           | Known metadata and model-resolution choices in that gh-aw version                                       | A complete provider allowlist or the CLI's effective context budget      |
| Copilot CLI's BYOK capability resolution  | Client behavior and limits selected from explicit configuration, known model configuration, or defaults | Provider entitlement or a guarantee that defaults satisfy the task       |
| AWF runtime discovery and pricing         | Provider routes, discovered model data, and prices available to the proxy                               | That the agent's CLI uses the same data for protocol, effort, or context |

`gh aw models` reports catalog entries, aliases, and observed model data; it is useful for finding candidates and understanding resolution, not for certifying that every listed model is usable by an account or correctly configured by a CLI. Check the installed command's help and the [model-report implementation](https://github.com/github/gh-aw/blob/v0.88.2/pkg/cli/models_command.go).

For BYOK, the inspected CLI's `copilot help providers` describes token-limit precedence as explicit environment values, then its built-in model catalog, then defaults. It identifies `COPILOT_PROVIDER_MODEL_ID` as the model used for behavior/capability lookup, while `COPILOT_PROVIDER_WIRE_MODEL` can name the provider's deployment or wire identifier. A known base model can be appropriate for a deployment of that model; substituting an unrelated known model merely to remove a warning does not establish compatible behavior. The [SDK provider identity contract](https://github.com/github/copilot-sdk/blob/v1.0.13/nodejs/src/types.ts#L3147-L3161) makes the same distinction; its [BYOK model-discovery documentation](https://github.com/github/copilot-sdk/blob/v1.0.13/docs/auth/byok.md#custom-model-listing) also warns that the client may not know the provider's supported models.

An unlisted model is therefore not automatically unusable, and a listed model is not automatically safe to use with every parameter. Unknown variants require evidence for the required capabilities rather than an assumption that their name implies the base model's configuration.

## Check the settings that affect execution

### Model identity and API protocol

Distinguish a concrete model identifier from a selector such as `auto` or a gh-aw alias. A selector intentionally delegates model choice; it is not evidence that one fixed model will run. When a task requires a particular model, compare the resolved identity with that requirement and inspect later proxy rewriting as well as initial selection.

The inspected gh-aw harness respects an already-set `COPILOT_PROVIDER_WIRE_API`; otherwise it looks for the selected model's `wire_api` in its catalog. A missing entry leaves the variable unset. **If no other layer supplies it**, OpenAI-compatible and Azure BYOK providers default to `completions`; this includes the inspected AWF-to-Copilot proxy route. Consequently, a provider can recognize a model while the client sends it to an unsupported API. Inspect the resolved environment rather than inferring the protocol from catalog membership alone. [Harness selection](https://github.com/github/gh-aw/blob/v0.88.2/actions/setup/js/copilot_harness.cjs#L443-L481), [provider-type and wire-API contract](https://github.com/github/copilot-sdk/blob/v1.0.13/nodejs/src/types.ts#L3079-L3088).

Provider type determines the request family. For OpenAI-compatible and Azure BYOK providers, an explicit `COPILOT_PROVIDER_WIRE_API` selects the wire format; it does not discover one and is not a generic protocol switch for other provider types. Use the contract of the actual provider/model combination, not the model vendor alone. Setting every model to `responses`, or changing only a URL path without changing request format, is not a general compatibility fix.

Similarly, a setting named `model-fallback` is not a blanket prohibition on every substitution. In the inspected AWF versions, disabling it stops middle-power fallback but does not remove all alias or model-family resolution. That switch does not govern the CLI's generic token-limit defaults. Check the owner and exact semantics of each fallback relevant to a fixed-model requirement. [AWF model resolution](https://github.com/github/gh-aw-firewall/blob/v0.28.12/containers/api-proxy/model-resolver.js#L93-L153).

### Reasoning effort and context limits

An effort string accepted by the CLI's argument parser is not necessarily supported by the selected model and provider. Verify model-specific support and how the actual execution path applies the setting. Do not treat a stored or echoed `high`/`xhigh` value as proof that the eventual request uses it.

Likewise, `--context long_context` expresses a tier selection, not a numeric-capacity guarantee. Distinguish the client prompt limit, output-token limit or reserve, and total context window. A 1M total window is not automatically a 1M input budget. Check that the effective limits correspond to the intended tier; a successful small request cannot demonstrate that a large context budget was retained.

The BYOK overrides `COPILOT_PROVIDER_MAX_PROMPT_TOKENS` and `COPILOT_PROVIDER_MAX_OUTPUT_TOKENS` can make those limits explicit. Values must come from the applicable model/provider capability contract, not from a desired capacity or a model-name guess. An override configures the client; it cannot enlarge the provider's actual capacity. Recheck the effective behavior after changing models, CLI versions, or execution modes. [Documented token-limit overrides](https://github.com/github/gh-aw/blob/v0.88.2/docs/src/content/docs/reference/engines.md#copilot-bring-your-own-key-byok-mode).

### AIC admission is a separate check

Missing an entry in gh-aw's catalog does not necessarily mean missing AI Credits (AIC) pricing. The inspected AWF implementation can use provider-supplied runtime pricing, other catalog data, or configured fallback prices. When its per-run AIC limit is active, required pricing cannot be resolved, and no default pricing is configured, it rejects the model with `unknown_model_ai_credits` instead of permitting unaccounted inference. [Pricing resolution and rejection](https://github.com/github/gh-aw-firewall/blob/v0.28.12/containers/api-proxy/guards/ai-credits-guard.js).

Passing that check establishes neither protocol nor context compatibility. Disabling a budget check does not repair either one. Diagnose a missing-pricing rejection separately from a request-format error or a client warning followed by continued execution.

## Interpret validation evidence narrowly

Use evidence from the intended execution path, not merely a similar local session. In particular:

- A successful workflow does not prove that no configuration was downgraded. Read relevant startup warnings and effective settings where the runtime exposes them; document what remains unverified.
- A model appearing in a provider response or local picker does not prove that a BYOK client has its capability configuration.
- A separate SDK session's configuration snapshot does not automatically certify a later ordinary CLI invocation, even when both use the same executable. SDK v1.0.13 exposes experimental session snapshots, but their represented fields and initialization conditions limit what they prove. Establish equivalence before using such a probe as a gate; do not infer that independent preflight is either universally reliable or permanently impossible. [SDK session snapshot contract](https://github.com/github/copilot-sdk/blob/v1.0.13/nodejs/src/generated/rpc.ts#L6916-L6942).
- Evidence for the main agent does not automatically cover a separate threat-detection process or a sub-agent that selects another model or effort. Identify the invocation whose configuration is being assessed.

For a candidate model, distinguish confirmed compatibility for the required configuration, a demonstrated incompatibility, and unresolved configuration behavior. Treat unresolved behavior as an explicit validation limit, not as a positive result. Re-evaluate the affected settings when the provider metadata, authentication route, runtime versions, or model selector changes.
