# Agent run state and reruns in GitHub Actions

## Scope

This document defines state, transport, validation, publication, and rerun invariants for GitHub Actions workflows that ask an Agent to inspect a selected subject and carry its decisions into later steps, jobs, safe-output handlers, or external effects. It owns the relationships among subject identity, declared capabilities, target coverage, result or effect-request transport, execution attempts, publication gates, and replay identity across those boundaries.

## When to update

Update this document when a real multi-stage, safe-output, publication, or rerun failure exposes an unhandled subject substitution, prompt/runtime mismatch, incomplete decision, transport ambiguity, effect-authorization bypass, attempt mix-up, repeated publication, or partial-publication recovery case within this scope, or when stronger evidence changes one of these invariants.

## Define one run contract

Treat the Agent invocation and every consumer of its decisions as participants in one run contract. Before launching the Agent, establish:

- the immutable identity of the subject being inspected;
- the complete set of targets or review surface the Agent must account for;
- the repository, network, history, and remote-service capabilities available to it;
- the decision states and transport accepted downstream; and
- the later operation, status, or external effect associated with each accepted state.

Render the prompt from this contract and give its other consumers the same values. Do not let the prompt, launcher, transport, validator, safe-output handler, or publisher independently reconstruct the subject or target set from a moving branch, ambient workspace, or current remote state. Agreement by convention is weaker than carrying and checking the same identity at every boundary.

## Keep the prompt and runtime truthful

The prompt must describe the environment the runner actually provides. State which revision is visible, whether repository history exists, which local and remote operations are available, and whether the Agent can request or directly cause side effects. Configure the launcher to expose that same capability set.

A prompt that requires unavailable evidence makes a complete decision impossible. A runtime capability that the prompt does not account for makes the Agent's operating boundary ambiguous. Change the prompt and launcher together when the capability contract changes; current command flags and tool names remain executable configuration rather than facts to copy into this document.

## Separate transcript, decision transport, and effect

An Agent process may emit commentary, progress, tool calls, retries, usage records, and a final answer through one process output. Disabling incremental streaming or instructing the Agent to return only a structured value does not turn that complete transcript into one result payload. Treat the transcript as protocol data rather than content to pass directly to a result parser.

Use a decision transport with machine-detectable framing. Depending on the task, this may be a structured terminal answer, a dedicated result artifact, or calls to narrowly scoped safe-output tools. Define how the consumer identifies one completed terminal state. Reject missing, duplicate, out-of-order, ambiguous, malformed, and unsupported envelopes. Do not recover a result by stripping expected prose or code fences, or by searching unframed text for a likely structured substring.

A safe-output request is still untrusted Agent output. Removing the privileged credential from the Agent narrows the reachable effect, but it does not make the requested action, subject, destination, or body authoritative. The safe-output transport may enforce schema, cardinality, fixed fields, sanitization, and permission separation; a repository-specific gate must still decide whether the accepted request satisfies the task contract.

Validate the transport envelope before validating the selected result or requested effect. Keep those responsibilities separate so a transport change cannot silently weaken subject, scope, coverage, domain, or publication checks.

## Claim only the coverage the transport represents

Choose a result representation that can prove the completion claim the workflow needs. A task that requires a decision for every target should carry one authenticated entry per target and reject missing, duplicate, or unknown entries. A task that transports only requested effects and a terminal `no action` or `incomplete` signal can prove effect shape and terminal-state selection, but it does not mechanically prove an unrepresented per-target classification.

Define exact allowed fields for each state so success, required change, inconclusive work, and execution failure cannot be mistaken for one another. Use one canonical validator whenever model output or a transferred artifact is deserialized. Recheck the subject, scope, represented coverage, exact shape, and state invariants rather than transferring trust from an earlier process. Within one validation boundary, downstream consumers should receive the validated representation instead of reinterpreting raw model text or applying a second, weaker contract.

When the transport deliberately omits detailed classifications, document that validation limit and make incomplete work a distinct failing terminal state. Do not describe a passing transport check as proof of analysis the transport does not encode.

## Put publication policy at the privileged boundary

The component that owns an external effect must authorize the canonical subject, operation, destination, and complete effect immediately before using its credential. Validate injected fields and reject extra fields that would widen the effect. Bind issue, review, comment, label, branch, or other destinations to trusted workflow state rather than accepting an Agent-supplied identifier merely because it parses.

Prefer a publication gate before the effect when the complete requested effect is available for validation. When a platform or safe-output runtime publishes first and a repository gate can only authenticate the resulting object afterward, treat the published object as a residual effect that a failing gate may leave visible. The later gate can still own a required status, derived labels, and current-subject authentication, but it does not make the earlier publication transactional.

Authenticate post-publication state from properties the Agent cannot forge alone: API-reported author and object state, an exact subject revision, framework-owned attribution appended after sanitization, and current remote state. Do not trust a hidden marker supplied inside the Agent body when the Agent controls that marker or the transport may remove it.

Recheck mutable subject state after applying derived labels or conclusions. If the subject changed, remove effects that the gate itself owns and fail. Do not claim cleanup of an external effect that the gate cannot safely identify or undo.

## Carry producer-selected state across jobs

The job that selects and inspects the subject owns the resulting subject identity. Export that identity together with any artifact identity, and embed the subject and scope inside transferred artifacts. A consuming job retrieves the named artifact, establishes which subject it is operating on, and compares artifact metadata with the producer-selected values before using it.

When the producer cannot supply a validated decision, route the consumer through an explicit execution-failure path. A fallback checkout may provide trusted tooling for reporting that failure, but it must not turn a missing producer identity or artifact into a result attributed to a different subject.

## Give each identity one purpose

Several identifiers can coexist in a rerunnable workflow, but they answer different questions:

| Identity             | Question it answers                                             |
| -------------------- | --------------------------------------------------------------- |
| Subject identity     | Which immutable content or change did the Agent inspect?        |
| Execution identity   | Which concrete invocation or rerun attempt produced evidence?   |
| Transport identity   | Which attempt-local handoff or safe-output stream is consumed?  |
| Publication identity | Which external effect should a retry recognize as already done? |

Choose publication identity from the semantics of the effect. Some effects belong to one concrete attempt and should include its execution identity. Others represent one logical result for a subject, scope, and target and should remain stable when the same run is retried. Do not reuse an attempt-local artifact name as a publication key unless the external effect is intentionally attempt-specific.

A workflow run identifier may remain stable across rerun attempts. When publication must come from the current attempt, also authenticate attempt-specific evidence such as the producing job instance and its time window. A run marker alone cannot distinguish an earlier attempt.

## Make partial publication resumable

A workflow can fail after publishing some units but before publishing the rest. Give each independently publishable unit a durable publication identity, include that identity in the owned external effect, and check the current destination before retrying it. A rerun can then skip effects already completed for the same identity and continue with the unpublished units.

Keep replay detection separate from semantic deduplication. Semantic deduplication decides whether a current external item already represents the same finding; replay detection decides whether this workflow already performed the selected create or update. Both decisions may inspect the same destination, but they answer different questions and need not use the same identity.
