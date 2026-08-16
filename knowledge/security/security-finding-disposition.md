# Security finding disposition

## Scope

This document defines implementation-independent evidence and exception principles for concerns reported by security scanners, audits, generated reviews, or manual investigation, including lead-versus-finding status, disposition categories, evidence thresholds, suppression, accepted risk, and exception maintenance.

## When to update

Update this document when a false positive, missed vulnerability, stale exception, risk-acceptance failure, or review incident changes the evidence needed to confirm, reject, suppress, accept, or revisit a security concern.

## Treat reports as leads

A tool maps observed input to rules and known patterns. Confirm the actual data or control flow, reachable effect, attacker preconditions, impact, and existing controls before calling its output a finding. Review each new concern independently; a nearby exception does not establish safety. A clean result is supporting evidence rather than proof that the reviewed behavior is secure.

Use one evidence-backed disposition:

- a confirmed finding with a reachable control failure and concrete impact;
- not a finding because a required unsafe effect, path, or precondition is absent;
- a demonstrated false positive in the detecting rule or its input; or
- a hypothesis whose missing evidence must be investigated before disposition.

Do not promote a hypothesis because a fix seems cheap, and do not demote a confirmed finding because remediation is difficult.

## Keep exceptions narrow and owned

Fix a valid finding at the boundary that owns the failed control. Do not tune detection around reachable vulnerable behavior.

Suppress only a demonstrated false positive or a risk explicitly accepted by the active project's authorized decision-maker. Bind the exception to the smallest rule, location, input, version, or deployment scope supported by its evidence. Record the durable reason beside the configuration that enforces the exception so later reviewers can distinguish intent from accidental silence.

Keep accepted risk with its threat model, attacker preconditions, impact, compensating controls, owner, and reevaluation condition. A suppression records a detection decision; it does not itself reduce the underlying risk. Revisit the disposition when the protected boundary, deployment, detector, dependency, or supporting evidence changes.
