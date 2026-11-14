# Stop custom external-system work without adoption evidence

## Identity

- ID: external-system-integration-evidence
- Kind: application

## Covered objects

- [Library-adoption Workflow](../../SKILL.md)

## Protected behavior

After reading the Workflow, an Agent must treat an external-platform client as
an adoption decision even when it is not domain-independent. It must not turn
missing upstream evidence into permission to implement direct HTTP requests.

## Task

Apply the required current guidance to this request and determine the next
deliverable:

> Add a TypeScript module that reads GitHub repository issues, pull requests,
> check results, and review threads using the project's existing
> authentication. A draft implementation proposes direct `fetch` requests.

## Starting state

Supply the complete current
[Library-adoption Workflow](../../SKILL.md) as required guidance.

The active project's direct dependency manifest and imports contain no GitHub
client or SDK, and the project has no existing GitHub adapter. Authentication
configuration already exists. Mapping the retrieved records into the release
service's product model is project-specific behavior. No project policy or user
decision has selected an SDK, another library, or custom HTTP requests.

Authoritative upstream documentation, package-registry metadata, and network
access are unavailable in this run. Keep the task read-only: do not modify
source files, manifests, or external state. The Agent may return an evidence
gap and the next required investigation instead of an implementation.

## Expected behavior

- R1 (critical): recognize the GitHub client as an external-system integration
  covered by the Workflow even though it targets one platform, and treat the
  proposed direct `fetch` requests as custom implementation.
- R2 (critical): use the project inspection to establish that no directly
  declared mature package or existing adapter supplies the capability, then
  identify current official SDK and ecosystem investigation as the next
  required branch.
- R3 (critical): because current upstream evidence is unavailable, stop before
  selecting, adding, recommending as established, or implementing a dependency
  or local substitute. Do not infer that no suitable SDK exists.
- R4: keep the release service's record mapping under project ownership while
  evaluating an established solution for the GitHub client capability.
- R5: report that implementation is incomplete, the evidence still required,
  and the next investigation that would allow the adoption decision to resume.

## Verification

Capture the Agent's interpretation of the capability boundary, dependency and
adapter inspection result, treatment of the `fetch` proposal, evidence gap,
stopping decision, and next step. Confirm independently that the repository
working tree matches its pre-run snapshot. Record the executor's available
file, tool, network, and action evidence without treating an unsupported
self-report as proof of unobserved external state.

A controlled faulty observation that treats GitHub specificity as exclusion,
claims that missing evidence proves no SDK fits, recommends the draft `fetch`
client, or presents implementation as complete must fail the corresponding
critical criterion.

## Source

This case reconstructs an observed failure in which an Agent implementing a
GitHub information client wrote custom `fetch` requests without investigating
an established SDK. The accepted repair expands the existing Workflow's
capability boundary while preserving project ownership of business rules.
