# Security boundaries and trust transitions

## Scope

This document defines technology-independent principles for moving untrusted data or requests across a security boundary into a privileged side effect. It owns contextual trust, boundary ownership, canonical representations, authentication and authorization separation, sink-specific safety, final-target validation, closed failure, and secret and sensitive-data lifecycle constraints; dependency supply chains, capability-grant lifecycle, security-event design, telemetry privacy, and filesystem-specific race mechanics belong to their dedicated documents.

## When to update

Update this document when a real vulnerability, bypass, exposure, or security-design review exposes an unhandled trust transition, ambiguous representation, misplaced authorization decision, unsafe sink, mutable destination, partial failure, or secret or sensitive-data lifecycle assumption within this scope.

## Treat trust as contextual

Control of one environment does not make every value entering it trusted. Network input, repository content, imported artifacts, remote-service data, dependency metadata, generated content, model output, tool output, and retrieved instructions remain untrusted until the boundary that interprets them establishes the property it needs.

Trust does not transfer automatically between representations or purposes. A string validated as a display name is not necessarily a safe pathname, command argument, URL, database value, or resource identifier. Parsing proves only the constraints the parser actually enforces.

Authentication establishes an identity. Authorization grants that identity a particular action on a particular resource under current policy. Possession of an identifier, successful parsing, a trusted transport, or a valid login does not supply the missing authorization decision.

Generated instructions and model decisions are data, not authority. They may propose an operation, but deterministic code at the privileged boundary must decide whether that exact operation is allowed.

## Put the trust transition at the owner

The component that assigns a security-sensitive meaning or owns a privileged effect must be safe for every value its interface admits. Validation by a caller can reject bad input earlier, but it is defense in depth unless the interface makes that validation a non-bypassable part of the contract.

Define one accepted input grammar, reject unknown or ambiguous forms, decode into a canonical representation, validate that representation, and carry it to the sink. Authorize the canonical subject, action, resource, and destination on the trusted side of the boundary. Reconstructing a value after authorization can create a different object from the one that was checked.

Shared validation and policy are useful when every privileged path must pass through them. A convention about current callers or call order is not an enforcement boundary.

## Trace the complete side effect

A useful security trace is:

```text
source → trust boundary → canonical value → sink → side effect
```

Follow successful, failed, retried, redirected, and asynchronous paths until the final externally visible effect. Confirm that the value checked at the boundary is the value consumed by the sink, and identify the concrete attacker preconditions needed to reach it under the actual deployment model. When the behavior is not naturally a data flow, trace the equivalent control path from request through policy decision to effect.

Existing controls matter only at the boundary they actually protect. Establish whether each control is mandatory, whether another path bypasses it, what happens when it is unavailable, and whether mutable state can invalidate its decision before use.

## Use sink-safe operations

Prefer APIs whose structure preserves the boundary decision: parameterized database operations, argument-vector process execution, context-specific output encoding, explicit network-destination policy, and filesystem operations bound to a canonical root or opened resource.

Redirects, aliases, symbolic links, rebinding, and concurrent state changes can replace an authorized destination. Recheck or bind the final object immediately before the side effect, using an atomic or handle-bound primitive when a separate check would race. Apply [Pathnames and filesystem resource identity](../filesystems/pathnames-and-resource-identity.md) when a filesystem name can change between decision and use.

## Fail closed without partial privilege

When parsing, validation, authentication, authorization, or policy evaluation is unavailable or inconclusive, deny the privileged effect. A rejected operation should not leave a partial grant, durable mutation, disclosed secret, or externally visible side effect that can be mistaken for success.

Make multi-step privileged work transactional where practical. Otherwise define compensating cleanup that proves resource ownership before undoing anything and surfaces both the primary and cleanup failures.

Diagnose a protected ingress without weakening the control that protects it. Keep authentication, authorization, and access policy active while tracing listener readiness, route or port mapping, name resolution, identity selection, and the authenticated request path. Making an endpoint anonymous or broadening its ACL changes the boundary under diagnosis and cannot prove that the protected path works.

## Minimize secrets and sensitive data across the lifecycle

Collect and retain only the secrets and sensitive data the operation requires, with the narrowest scope, lifetime, and exposure that work permits. Keep protected values out of source, command lines, logs, errors, responses, telemetry, and broadly inherited process environments unless a channel is explicitly required and authorized for that data.

For secrets, choose storage from the host threat model rather than from a universal ranking. A process environment is suitable only when it is private to the intended service identity. A file requires an owner-controlled directory, a hardened creation or rewrite path, and a plan for existing files: changing write permissions does not retroactively harden bytes already on disk. Rotation or regeneration can invalidate subscriptions, sessions, encrypted state, or other dependents and must be treated as a migration.

Continuing with an ephemeral secret after persistence fails trades availability against stable identity and recovery. Make that behavior explicit and observable rather than silently treating it as equivalent storage.

Security logging can reveal abuse and failed controls, but it does not replace prevention. Apply [Security event logging](security-event-logging.md) when deciding what evidence the boundary should emit.

## Related Knowledge

- [Dependency and supply-chain security](dependency-supply-chain-security.md) owns third-party graph, provenance, installation, and vulnerability decisions.
- [Capability-based authorization](capability-based-authorization.md) owns requested privileges, grants, confirmation, binding, consumption, and revocation.
- [Privacy-preserving telemetry](../privacy/privacy-preserving-telemetry.md) owns minimization and validation of operational measurements.
