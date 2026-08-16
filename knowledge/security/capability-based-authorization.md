# Capability-based authorization

## Scope

This document defines reusable security principles for a host or broker that grants an extension, agent tool, service, subprocess, or other less-trusted subject authority to perform privileged operations, including request and grant separation, layered policy, human confirmation, exact binding, grant lifecycle, local-process assumptions, and replay limits.

## When to update

Update this document when a permission bypass, confused-deputy failure, stale or replayed grant, confirmation error, local-process attack, or new broker architecture changes the evidence required to bind, consume, revoke, or enforce a privileged capability.

## A request is not a grant

A manifest, tool call, generated instruction, UI message, or self-reported identity can request authority but cannot grant it. Derive source trust independently of subject-controlled content. Permission is necessary but may still require user consent, deployment policy, and method-specific checks at the host that owns the side effect.

Keep privileged effects behind a host-mediated interface. Sandboxing one presentation surface does not sandbox a backend process or the host itself, and parsing an untrusted request does not make its requested destination trusted.

## Make policy deterministic and non-bypassable

Authorize the final subject, action, resource, and destination. Mandatory protections must run before broad convenience modes, stored allowlists, or default approvals so a permissive mode cannot bypass self-protection or another non-negotiable boundary.

Use narrow grant keys that preserve every dimension needed to prevent privilege expansion. Replacing a specific tool or resource grant with a generic dispatcher grant requires a new authorization decision. Validate dispatcher arguments against the selected operation's schema before invocation.

Fail closed on an unknown request kind, malformed decision, missing policy input, or unrecognized confirmation response. A model's desire to retry after rejection does not create authority.

## Bind human confirmation to one request

A confirmation is an authorization event only when it is correlated to the exact pending request and its rendered action, resource, destination, and relevant risk. Validate the response action and make approve-once, session-scoped, persistent, and reject outcomes distinct.

Session and persistent grants need explicit scope, storage ownership, revocation, and inspection. Reconnection, replay, cancellation, timeout, and replacement must not let a response authorize a different request or let an expired pending request regain authority.

## Bind delegated grants before use

Create a delegated grant for an exact eligible subject and operation. Bind the subject, action, resource, destination, parent or issuer, and expiry before returning usable authority. Keep its lifetime no longer than the operation requires, and consume or revoke it earlier when its purpose ends. Discovery information and routing addresses are not bearer credentials.

Keep short-lived enrollment authority separate from the persistent identity used after enrollment. Bind identity at the authenticated transport boundary instead of accepting a later self-reported name as the source of truth.

A destructive lifecycle transition requires an exact authenticated decision from the authority that owns it. A disconnect, timeout, authentication failure, or generic policy rejection can end current access, but it does not by itself authorize self-removal, data deletion, or another irreversible cleanup action. Preserve the resource or enter a recoverable denied state until the explicit removal or revocation signal is established.

When creation of a child operation and binding of its grant must agree, perform them in one atomic transition. A later check should verify the existing binding rather than choose or rebind the subject. Consume a single-use grant through an authenticated compare-and-swap transition, and apply the same ownership discipline to revocation and expiry.

## Treat local reachability as a limited control

Loopback binding removes remote network reachability; it does not exclude another process running as the same local account. A sandboxed browser origin, sibling process, inherited environment, or leaked local endpoint can require an independent check.

Use per-process or per-session credentials when local peers need authentication, restrict inherited credentials to the owned child, and couple process authority to its supervised lifecycle. Parent disappearance, restart, or replacement must not leave a child with ambiguous standing.

## State replay and containment limits explicitly

Encryption and authentication can protect a stored grant's confidentiality and integrity without preventing replay of an older, once-valid state. Rollback resistance requires an external monotonic generation, append-only authority, or another freshness mechanism outside the replayable record. Expiry checked against a trusted clock can bound the replay window but does not make state monotonic.

A generation number carried by a lease is not fencing unless the resource owner compares it at every privileged effect. A grant authorizes its bound operation; it is not a process sandbox, general delegation channel, or proof that unrelated behavior is safe.
