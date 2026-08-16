# GitHub Copilot Enterprise provider for Codex

## Scope

This document records a verified Codex custom-provider configuration for using models made available through a GitHub Copilot Enterprise subscription. It covers the provider endpoint and protocol, optional Copilot CLI request identification, command-backed GitHub authentication, model selection boundaries, secret handling, and failure classification; GitHub enterprise provisioning, model recommendations, and unrelated transport, retry, timeout, or WebSocket tuning are outside its scope.

## When to update

Update this document when Codex changes its custom-provider or command-backed authentication schema, GitHub changes the Copilot Enterprise endpoint, its Responses API compatibility, or the Copilot CLI integration headers, the GitHub CLI changes how credentials are obtained, or observed model discovery, access, or error behavior no longer matches the guidance here.

## Preconditions

The GitHub account authenticated by the GitHub CLI for `github.com` must have access to the relevant Copilot Enterprise subscription and model. Confirm the selected account with `gh auth status -h github.com`. Authentication and subscription access are separate from the Codex configuration: a syntactically valid provider does not grant either one.

Codex supports custom model providers and command-backed authentication as general configuration mechanisms. The GitHub-specific endpoint and combination below are based on verified operation rather than an OpenAI guarantee about GitHub Copilot Enterprise compatibility.

## Configuration

Add the following configuration to `~/.codex/config.toml`, replacing the model placeholder with an identifier currently available to the authenticated account:

```toml
model_provider = "github-copilot-enterprise"
model = "<currently-supported-model>"

[model_providers.github-copilot-enterprise]
name = "GitHub Copilot Enterprise"
base_url = "https://api.enterprise.githubcopilot.com"
wire_api = "responses"

[model_providers.github-copilot-enterprise.auth]
command = "gh"
args = ["auth", "token", "-h", "github.com"]
```

The top-level `model_provider` selects the custom provider. `wire_api = "responses"` makes Codex use the Responses protocol expected by this endpoint. The nested `auth` table makes Codex obtain the credential from the GitHub CLI instead of storing a token in the configuration file.

## Identify requests as Copilot CLI

To identify requests sent through this provider as Copilot CLI, add `http_headers` to the existing provider table:

```toml
[model_providers.github-copilot-enterprise]
name = "GitHub Copilot Enterprise"
base_url = "https://api.enterprise.githubcopilot.com"
wire_api = "responses"
http_headers = { "Copilot-Integration-Id" = "copilot-developer-cli", "Editor-Version" = "CopilotCLI/1.0" }
```

Use this block in place of the provider block in the main example rather than declaring `[model_providers.github-copilot-enterprise]` twice. These headers identify the integration but do not authenticate the request or change entitlement, model availability, endpoint, or protocol requirements; keep the command-backed `auth` table and the other provider settings unchanged. Omit `http_headers` when Copilot CLI identification is not intended.

## Select a model from current availability

Treat model identifiers as dynamic provider and account state. Resolve the model from current GitHub Copilot model availability and the enterprise policy applied to the authenticated account; do not infer it from Codex defaults, remembered model names, or another account's access. Keep the placeholder in reusable examples rather than turning a model that worked once into a durable recommendation.

A provider connection can authenticate successfully while rejecting the configured model. Classify a model-not-found or model-access error separately from endpoint and authentication failures, then verify the identifier, subscription availability, and enterprise policy before changing the provider configuration.

## Protect the credential boundary

The authentication command must write only the credential expected by Codex to standard output. Do not copy the output of `gh auth token -h github.com` into `config.toml`, documentation, logs, issues, or pull requests. Prefer `gh auth status -h github.com` when checking login state because it verifies the selected host and account without printing the token.

If the command fails, repair the GitHub CLI login for `github.com` rather than replacing command-backed authentication with a hard-coded credential. A `401` or `403` after the command succeeds can instead indicate expired or insufficient credentials, missing Copilot Enterprise entitlement, enterprise policy, or endpoint access.

## Diagnose by boundary

After changing the configuration, start a new Codex session and make a small request through the provider. Diagnose failures at the boundary indicated by the evidence:

- A command execution or empty-credential error belongs to GitHub CLI authentication.
- An HTTP `401` or `403` belongs to credential, entitlement, policy, or endpoint authorization.
- A model-not-found or model-access error belongs to current model availability or enterprise policy.
- A request-shape or unsupported-protocol error belongs to Responses API compatibility and `wire_api` configuration.
- Connection stability, retry counts, timeouts, and WebSocket support are separate transport concerns and should not be added to this provider setup without independent evidence.

Do not change several boundaries at once. Preserve the verified endpoint, protocol, and dynamic authentication while testing the failing boundary independently.
