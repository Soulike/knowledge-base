# Privacy-preserving telemetry

## Scope

This document defines reusable design principles for collecting and transporting operational measurements without retaining unnecessary user content or raw identities. It owns capture minimization, pseudonymous correlation, bounded and strict records, explicit missing coverage, relay validation, single-writer authority, and rolling compatibility; organization-specific consent, retention, analytics infrastructure, security-event semantics, and product measurement definitions are outside its scope.

## When to update

Update this document when a privacy incident, telemetry-schema change, upstream SDK behavior, transport evolution, or rolling-upgrade failure changes what may be captured, how identity is transformed, how missing coverage is represented, or where records must be bounded and validated.

## Define the allowed record before capture

Start with the measurement decision the telemetry must support, then define the smallest fields that answer it. An available SDK event or transport field is not automatically appropriate to retain.

Prohibit content categories that the decision does not need before they enter shared collector state. Prompts, messages, reasoning, summaries, tool inputs and outputs, paths, provider identifiers, credentials, and raw application identifiers should not cross a telemetry boundary merely because they are convenient context.

Give one component authority for durable emission and consent enforcement. Local collectors and remote relays should produce the same canonical record rather than writing independent variants with different privacy behavior.

## Treat hashing as pseudonymization

Hashing can support stable joins without transporting a raw identifier, but a stable digest remains linkable and may be reversible by guessing a small input space. It is pseudonymization, not proof of anonymity.

Canonicalize an identifier once, define the exact byte representation, and transform it before storing it in collector state or sending it across a process or network boundary. Add a correlation dimension only when the measurement decision needs that join. Keep unrelated record families free of the identifier rather than copying it everywhere.

## Bound and validate every record

Bound records per batch, string lengths, collection sizes, and numeric ranges. Accept only finite measurements in the meaningful domain. Reject unexpected nested fields at each untrusted relay and at the durable writer so a permissive intermediary cannot smuggle prohibited content into an otherwise canonical envelope.

Use an explicit schema for canonical records and preserve it across local and remote paths. Dynamic property bags do not remove the need to validate field names, types, and bounds before storage.

## Distinguish missing coverage from zero

No observed measurement can mean genuine zero activity, an unsupported source, a failed collector, an unsafe delta, a dropped relay, or an older peer. Emit a bounded coverage-status record or equivalent state that distinguishes these cases. Keep the reason specific enough to diagnose the missing path without embedding raw errors or user data.

The absence of a capability advertisement means unknown coverage, not zero. Deduplicate repeated coverage notices at an appropriate lifecycle boundary so the signal remains visible without becoming event noise.

## Negotiate rolling compatibility

Advertise capture and field capabilities explicitly between peers. Send a new optional dimension only when the receiver declares support, or when the base schema guarantees unknown fields are safely ignored. A newer sender should omit unsupported additions rather than sacrificing an otherwise valid batch.

Keep compatibility decisions close to the transport boundary and validate again at the durable writer. Historical rows and older peers should remain meaningful with the documented absence semantics for optional fields.

## Related Knowledge

- [Security event logging](../security/security-event-logging.md) owns events whose primary purpose is security detection and investigation.
- [Security boundaries and trust transitions](../security/security-boundaries.md) owns trust decisions around collectors, relays, and durable sinks.
