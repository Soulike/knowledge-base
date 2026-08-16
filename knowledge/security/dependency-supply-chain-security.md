# Dependency and supply-chain security

## Scope

This document defines package-ecosystem-independent principles for evaluating third-party dependency introduction, resolution, installation, update, removal, and vulnerability findings. It owns manifest intent, resolved-graph evidence, provenance and integrity, install-time execution, release-policy evidence, consumer compatibility, scanner interpretation, and remediation choices; ecosystem commands, registry configuration, organizational approval policy, and general application trust boundaries are outside its scope.

## When to update

Update this document when package-manager behavior, a supply-chain incident, a dependency remediation, or vulnerability-triage evidence changes how manifest intent, resolved occurrences, artifact provenance, installation effects, compatibility, reachability, or exceptions must be established.

## Separate intent from the resolved graph

A manifest states what a project requests; a lockfile or equivalent resolution records what installations receive. Review both. A direct version change can leave a vulnerable transitive occurrence elsewhere, while a lockfile-only change can hide which declared dependency introduced it.

For each material dependency, trace every affected resolved node through its top-level parent to every runtime, build, test, or release consumer. Keep the graph reproducible and reviewable. Remove unused dependencies and regenerate resolution metadata through the ecosystem's package manager rather than treating individual resolved entries as independent declarations.

An override changes the graph without changing each consumer's stated intent. Keep it narrow, prove every affected consumer is compatible, and use it only when removal or a supported parent or direct-dependency update cannot express the secure graph.

## Treat supply-chain inputs as untrusted

Package names, versions, registry responses, manifests, archives, signatures, integrity fields, and generated lockfile content all cross a trust boundary. Accept artifacts only through the configured source, provenance, and integrity controls. An installation failure is not a reason to widen a registry or integrity exception.

Install-time code is a privileged effect. Disable automatic lifecycle execution where the workflow permits and require an explicit, reviewed decision for native builds, generators, or other package-supplied code. Review what executes, under which identity, with which network, filesystem, credential, and environment access.

## Establish freshness and compatibility independently

A clean installation proves that a graph can currently be fetched and installed; it does not prove that the selected releases satisfy the project's freshness or security policy. Evaluate the configured policy at the merge or release boundary and record the evidence used.

For an update, inspect advisories, behavior changes, runtime and toolchain requirements, and every consumer of the resolved version. Forcing a secure-looking transitive release that violates a parent's supported range or runtime contract can replace a reported vulnerability with an untested incompatibility.

## Treat scanner output as a lead

A scanner maps observed metadata to known rules and advisories. Confirm the affected resolved nodes, vulnerable behavior, reachability, attacker preconditions, impact, and existing controls before deciding disposition. Review each new finding independently; a nearby exception does not establish safety. A clean scan is supporting evidence, not proof that the graph or its install behavior is secure.

Suppress only a demonstrated false positive or an explicitly accepted risk. Keep the exception as narrow as the evidence, state the durable reason beside the enforcing configuration, and preserve enough graph and reachability detail to reevaluate it when the dependency or deployment changes.

## Prefer structural remediation

Remove an unused dependency chain when its top-level parent and every consumer are proven unnecessary. Otherwise prefer a supported direct or parent upgrade that moves every affected occurrence outside the vulnerable range. Use containment when the vulnerable behavior can be excluded at an owned boundary and no compatible update exists; make the residual risk explicit.

After remediation, prove the selected nodes are absent or outside the affected range, compare security-audit output with the prior baseline, and validate all affected consumers. Unrelated findings remain visible but should not silently expand or obscure the selected remediation scope.

## Related Knowledge

- [Security boundaries and trust transitions](security-boundaries.md) owns reachability and enforcement at application boundaries.
- [Test effectiveness](../software-testing/test-effectiveness.md) owns evidence that a compatibility or security regression test can catch its named fault.
