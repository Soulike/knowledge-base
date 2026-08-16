# Integration test harnesses

## Scope

This document defines reusable architecture principles for integration and end-to-end harnesses that run multiple real components or processes, including fidelity and claim boundaries, deterministic external seams, state and resource ownership, readiness, teardown, and validation tiers.

## When to update

Update this document when a real integration failure, escaped environmental dependency, cleanup incident, or new harness architecture changes the evidence needed to justify fidelity claims, isolate mutable state, establish ownership, report readiness, or divide required and advisory validation.

## Define the fidelity and claim boundary

Describe which production components, protocols, authentication paths, persistence layers, and lifecycle transitions the harness uses unchanged. Also name what it deliberately does not model, such as physical network boundaries, third-party control planes, device suspension, multi-day operation, or production-scale load.

Every validation claim must fit inside that boundary. A same-host topology can prove protocol, routing, authentication, reconnect, and process ownership without proving firewall behavior or cross-network reliability. Calling a suite “end to end” does not widen the evidence it produces.

## Keep the contract real and the uncertainty controlled

Use production transports and public surfaces for the behavior the harness claims to cover. Real processes are appropriate when startup, liveness, signals, process trees, authentication, or serialization are part of the contract. Replacing those components with mocks would remove the subject.

Place deterministic fixtures at external seams whose real behavior is costly, nondeterministic, credentialed, or outside the claim boundary. A model, cloud service, or remote peer can be replaced by a fixture with fixed responses and explicit controls while the application's discovery, launch, health, relay, cancellation, and cleanup paths remain real.

Expose controls that create meaningful states rather than timing races: hold or release a request, return a defined failure, emit an ordered event, or report that an input was consumed. Keep fixture-only control surfaces local and secret-free.

## Give one owner the complete topology

Return a single harness handle that owns every process, listener, temporary root, credential, log, and child fixture it creates. Give each run a unique contained state root and endpoints scoped to the topology, using ephemeral local endpoints when cross-host behavior is outside the claim. Redirect application data, configuration, caches, and temporary paths before importing components that cache those locations.

Avoid ambient developer state and global services. When network access is outside the claim, synthetic repositories and packages should have no remote capable of accidental access. When the topology uses credentials, apply [Security boundaries and trust transitions](../security/security-boundaries.md) and, for authenticated local peers, [Capability-based authorization](../security/capability-based-authorization.md). The harness-specific responsibility is to bind each credential to the owned run and peer through the production channel, constrain inherited authority to the owned child, include credential-bearing artifacts in lifecycle ownership, and verify any claimed containment independently.

When a runtime has process-global module state, enforce one harness per process or isolate it in a new process. Failing a second start is safer than silently sharing state between supposedly independent topologies.

## Make startup and teardown transactional

Startup succeeds only after every component reaches an observable ready state with the identity and connectivity the test will use. A failed partial start should tear down everything already provisioned through the same ownership-aware path.

Before terminating a process, confirm that its creation identity and command still match the recorded resource rather than trusting a recycled process identifier or executable name. Terminate the complete owned process tree. If ownership cannot be proved or cleanup fails, attempt every known safe cleanup, preserve diagnostic state when deletion would hide evidence or remove an uncertain resource, and fail explicitly.

Teardown assertions are behavior when resource ownership is part of the contract. Closing the parent while leaving descendants, credentials, listeners, or temporary roots behind is a harness failure even if the scenario assertions passed.

## Separate validation tiers by cost and fidelity

Keep the required suite narrow enough to be reliable while protecting the minimum integration contract. Place heavier real-process, browser, cross-platform, cross-host, or soak scenarios in explicit advisory or scheduled tiers when their cost or environmental sensitivity would make them poor per-change gates.

Each tier should state the behavior it uniquely proves, the topology it needs, and the gaps it leaves. Do not collapse a high-fidelity advisory scenario into a cheaper mocked suite and retain the original claim. Conversely, do not make every topology merge-blocking merely because it is realistic.

Executable configuration should remain the authority for actual suite membership and gate status. Architecture guidance owns why the tiers exist and what their results mean, not a duplicated inventory of current jobs.
