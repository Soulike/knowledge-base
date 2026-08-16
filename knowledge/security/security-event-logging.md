# Security event logging

## Scope

This document defines implementation-independent principles for choosing, shaping, protecting, and retaining security events, including the boundary between preventive controls and detection evidence, event taxonomy and fields, instrumentation decisions, sensitive-content handling, pipeline access, and logging-failure semantics.

## When to update

Update this document when an incident, investigation, privacy review, compliance change, or logging-pipeline failure changes which security decisions require evidence, which fields are safe and sufficient, or how event access, retention, integrity, and failure are controlled.

## Log the authoritative decision

Security logging supports detection, investigation, and accountability. It does not authenticate, authorize, validate, or contain an operation. Emit the event at the component that owns the decision or side effect so the record describes what actually happened rather than what a caller intended.

Record both successful and rejected security-relevant decisions when each has investigative value. Common families include authentication, authorization, privilege use or escalation, sensitive-data access, protected-data modification, and changes to the logging or security-control state. Treat these as a design checklist, not a universal mandated taxonomy.

Background activity should earn its event volume. A periodic refresh with no user action or security-state change may add noise, while its terminal authentication failure can be the actionable event. Document intentional omissions so missing events are not mistaken for instrumentation gaps.

## Design a stable event contract

A security event commonly needs a timestamp, stable event type, outcome, bounded reason, severity, actor or subject, source boundary, target resource, and enough environment or software-version context to interpret the decision. Use structured fields with explicit schemas rather than free-form messages as the primary contract.

Keep event names and reason codes stable across implementations. Bound strings, nested details, and batch size; reject or sanitize unknown content at the emission boundary. Version the schema when consumers cannot safely ignore an addition.

## Record meaning without protected content

Prefer identifiers and decision metadata over payloads. Keep credentials, tokens, prompts, document contents, command output, raw request bodies, and sensitive resource values out of events unless a separately approved investigation requirement makes them necessary.

Scrub or transform sensitive fields before the first durable write, not only before upload. Central sanitization reduces drift, but the emitter still owns choosing data that can be logged safely. A stable hash can remain identifying and linkable; apply [Privacy-preserving telemetry](../privacy/privacy-preserving-telemetry.md) before treating transformed values as low risk.

## Protect the evidence pipeline

Security events may share storage or transport machinery with operational telemetry, but they need an independently enforceable route, access policy, retention decision, and query audience. Restrict who can read or alter the evidence, preserve ordering and source identity when they matter, and prevent failed uploads from causing unbounded local growth.

Define what happens when emission or transport fails. If an operation is permitted only when an audit record is durable, couple the two outcomes transactionally. Otherwise surface the logging failure and preserve bounded retry evidence without claiming that the event was recorded. Do not let a best-effort logger become an accidental authorization oracle or an unbounded availability risk.
