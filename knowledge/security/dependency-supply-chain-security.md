# Dependency and supply-chain security

## Scope

This document defines package-ecosystem-independent principles for evaluating third-party dependency introduction, resolution, installation, update, removal, and vulnerability findings. It owns dependency admission, manifest intent, resolved-graph evidence, provenance and integrity, install-time execution, release-policy evidence, consumer compatibility, package-specific finding evidence, and remediation choices; general security-finding disposition, ecosystem commands, registry configuration, organizational approval policy, and application trust boundaries are outside its scope.

## When to update

Update this document when package-manager behavior, a supply-chain incident, a dependency remediation, or vulnerability-triage evidence changes how manifest intent, resolved occurrences, artifact provenance, installation effects, compatibility, reachability, or exceptions must be established.

## Admit only a necessary dependency

Add a dependency only when its capability is needed and its ownership and maintenance are credible enough for the boundary it will enter. First check whether an existing dependency or a reasonably small local implementation can provide the capability without weakening security, provenance, compatibility, or maintenance guarantees.

Evaluate the privilege the dependency and its installation receive, the sensitivity of data it processes, its release and incident history, and the cost of removing or replacing it. A convenient API is not by itself evidence that the new supply-chain and update surface is justified.

## Separate intent from the resolved graph

A manifest states what a project requests; a lockfile or equivalent resolution records what installations receive. Review both. A direct version change can leave a vulnerable transitive occurrence elsewhere, while a lockfile-only change can hide which declared dependency introduced it.

For each material dependency, trace every affected resolved node through its top-level parent to every runtime, build, test, or release consumer. Keep the graph reproducible and reviewable. Remove unused dependencies and regenerate resolution metadata through the ecosystem's package manager rather than treating individual resolved entries as independent declarations.

An override changes the graph without changing each consumer's stated intent. Keep it narrow, prove every affected consumer is compatible, and use it only when removal or a supported parent or direct-dependency update cannot express the secure graph.

## Treat supply-chain inputs as untrusted

Package names, versions, registry responses, manifests, archives, signatures, integrity fields, and generated lockfile content all cross a trust boundary. Accept artifacts only through the configured source, provenance, and integrity controls. An installation failure is not a reason to widen a registry or integrity exception.

Install-time code is a privileged effect. Keep automatic lifecycle execution disabled by default and permit native builds, generators, or other package-supplied code only through a narrow reviewed allowlist or equivalently enforceable policy. Review what executes, under which identity, with which network, filesystem, credential, and environment access.

## Establish freshness and compatibility independently

A clean installation proves that a graph can currently be fetched and installed; it does not prove that the selected releases satisfy the project's freshness or security policy. Evaluate the configured policy at the merge or release boundary and record the evidence used.

For an update, inspect advisories, behavior changes, runtime and toolchain requirements, and every consumer of the resolved version. Forcing a secure-looking transitive release that violates a parent's supported range or runtime contract can replace a reported vulnerability with an untested incompatibility.

## Establish package-specific finding evidence

Apply [Security finding disposition](security-finding-disposition.md) to scanner, audit, and advisory concerns. For a dependency concern, additionally confirm every affected resolved node, the vulnerable behavior, reachability, attacker preconditions, impact, existing controls, and the advisory or release evidence that defines the affected range. Preserve enough graph and consumer detail to reevaluate a disposition when the package or deployment changes.

## Prefer structural remediation

Remove an unused dependency chain when its top-level parent and every consumer are proven unnecessary. Otherwise prefer a supported direct or parent upgrade that moves every affected occurrence outside the vulnerable range. Use containment when the vulnerable behavior can be excluded at an owned boundary and no compatible update exists; make the residual risk explicit.

After remediation, prove the selected nodes are absent or outside the affected range, compare security-audit output with the prior baseline, and validate all affected consumers. Unrelated findings remain visible but should not silently expand or obscure the selected remediation scope.

## Related Knowledge

- [Security boundaries and trust transitions](security-boundaries.md) owns reachability and enforcement at application boundaries.
- [Security finding disposition](security-finding-disposition.md) owns general scanner evidence, suppression, and accepted-risk rules.
- [Test effectiveness](../software-testing/test-effectiveness.md) owns evidence that a compatibility or security regression test can catch its named fault.
