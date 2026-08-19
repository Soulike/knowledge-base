---
name: remediate-npm-security
description: Remediate npm dependency-security findings through supported upgrades or removal of proven-unused dependency chains. Use for Dependabot alerts, npm audit findings, npm security advisories, vulnerable transitive packages, or security-driven npm dependency updates.
---

# Remediate npm dependency security

## Establish authority and scope

1. Follow instructions, requirements, and project-specific security and
   dependency policy from the active working directory when they conflict with
   this plugin's packaged Knowledge or workflow references.
2. Resolve paths relative to this `SKILL.md`, then read
   [Dependency and supply-chain security](../../references/security/dependency-supply-chain-security.md).
   Remediate only through a dependency update, a narrow compatible override,
   or removal of a proven-unused dependency chain. Keep containment,
   suppression, risk acceptance, and remote alert disposition outside this
   workflow.
3. Fix the repository revision and discover its npm client, workspace layout,
   manifests, lockfile, configured package sources, audit command, and required
   validation from the working tree. Do not substitute a public registry for a
   configured source that lacks a candidate release.
4. Honor findings the user already selected. Otherwise enumerate the available
   open findings without changing them and group findings that one dependency-
   graph change can remediate into one unit.
5. Report each unit's identifiers, advisory, package, manifest or workspace,
   severity, direct or transitive status, affected resolved occurrences, and
   known fixed range.
6. Unless the request already makes the scope explicit, present these choices
   without recommending one: a single finding by identifier, one or more
   remediation units by identifier, or all units. Ask the user to choose.

Finish this step only when the selected findings or units and authorized action
scope are explicit. Make no dependency changes before then.

## Establish dependency evidence

Within every selected unit:

1. Apply the package-specific finding, resolved-graph, provenance, reachability,
   compatibility, and consumer evidence requirements in Dependency and
   supply-chain security.
2. Assign every concern one canonical disposition. Only confirmed concerns
   enter remediation. For “not a finding,” a demonstrated false positive, or a
   hypothesis, report the decisive or missing evidence and remove that concern
   from the remediation unit; stop the unit without claiming a fix when none
   remain confirmed.
3. Record the current audit baseline so unrelated findings remain visible
   without expanding the selected scope.
4. Identify the lowest compatible release that clears the vulnerable range and
   verify that exact artifact is available through the project's configured
   source with its required provenance and integrity evidence.

Finish this step only when every selected concern has an evidence-backed
disposition and each confirmed finding has complete package, graph, advisory,
availability, and compatibility evidence or a stated blocker.

## Choose the remediation

Apply the structural-remediation order and evidence in Dependency and
supply-chain security within this Skill's narrower action boundary: removal of
a proven-unused chain, a supported direct or parent update, or a narrow
compatible override.

1. Before a breaking or major upgrade, identify required consumer changes and
   obtain the user's approval for that expanded scope.
2. Use an override only after proving that removal and supported parent or
   direct upgrades cannot express a secure graph, every affected consumer is
   compatible, and the user explicitly approves the compatibility and ongoing
   maintenance tradeoff. The override must resolve the confirmed finding; this
   approval is not acceptance of unresolved security risk. Keep the override
   scoped to the affected parent or occurrence where npm permits.

Leave a unit unchanged when no authorized remediation is currently available.
Finish this step with one evidence-backed remediation or blocker per unit.

## Apply the selected graph change

Use the repository's declared npm workflow from its owning root. Change the
manifest intent and regenerate resolution metadata with the package manager;
do not hand-edit resolved lockfile entries. Preserve unrelated user work and
limit compatibility edits to the approved units.

Inspect the resulting manifests, resolved graph, lifecycle behavior, and diff
before validation. If the remediation changes application behavior or needs a
security regression test, read
[Test effectiveness](../../references/software-testing/test-effectiveness.md)
and follow the active project's testing workflow.

## Validate the local remediation

For every changed unit:

1. Apply the post-remediation graph proof and audit-baseline requirements in
   Dependency and supply-chain security.
2. Run the dependency, consumer, static, and behavioral checks required by the
   affected scope.
3. Inspect the final diff for unintended manifest, lockfile, lifecycle, or
   consumer changes.

Report unavailable or environmental checks without converting them into
passing evidence.

## Report completion

Report each selected concern's disposition and the evidence assembled above,
then report the graph change, approvals, graph proof, audit comparison, project
validation, blockers, and unrelated findings that remain.

Claim only that the selected local dependency graph is remediated when all
required evidence passes. Stop after reporting the local result. Leave commits,
pushes, pull requests, and remote alert disposition to a separate user-directed
workflow.
