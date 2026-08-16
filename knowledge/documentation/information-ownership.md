# Engineering information ownership

## Scope

This document defines authoritative ownership of engineering information: the artifact responsible for keeping a meaning correct, the stability criteria for selecting that artifact, and the routing behavior of artifacts that do not own the meaning.

## When to update

Update this document when evidence changes how an artifact type defines or maintains engineering meaning or when a recurring ownership decision exposes an ambiguity in the authority, stability, or routing criteria.

## Give authority to the defining artifact

An artifact is authoritative when it directly defines, enforces, or is explicitly designated to own a meaning. A hand-maintained restatement is not a second authority; it is a cache that can drift. The artifact that can keep the meaning correct with the least duplication should own it.

Project-specific contracts may refine the mapping, but a useful default is:

| Artifact                                                                            | Meaning it can authoritatively own                                                                                                   |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Code, configuration, schemas, CLI help, or generated references                     | Current behavior and executable contracts                                                                                            |
| Source comments and docstrings                                                      | Non-obvious intent, rationale, invariants, and failure modes attached to an implementation                                           |
| Tests or executable examples                                                        | Evidence that a contract holds; the contract itself only when the project explicitly designates them as its executable specification |
| Maintained engineering documentation                                                | Stable invariants, boundaries, domain models, rationale, and non-obvious facts that have no narrower executable owner                |
| Routing maps and indexes                                                            | Need-to-destination mappings, while destination facts remain at their owners                                                         |
| Agent Skills                                                                        | Decisions, tool use, ordered work, and completion criteria for a recurring Agent task                                                |
| User documentation and runbooks                                                     | Procedures people must understand or perform independently of an Agent                                                               |
| Issues, pull requests, design proposals, implementation plans, and incident records | Plans, status, TODOs, history, evidence, validation records, and rollout state                                                       |

Transient records may explain why a durable decision was made, but the surviving constraint belongs with the artifact responsible for maintaining it after the record closes.

## Choose the narrowest stable owner

Prefer the implementation, domain, package, or module that can keep the meaning correct. Cross-file guidance within one owner can live in that owner's local documentation, while stable consumer orientation can live at its package or module entry point. Broader documentation is appropriate when a meaning crosses independent owners or no narrower location can own it without duplication.

Narrowness alone is insufficient: a location routinely renamed, regenerated, or bypassed is not a stable owner. Before its substantive body, every hand-maintained engineering-guidance document must state a content boundary precise enough to accept or reject a proposed block and a maintenance condition that identifies changes capable of making that block stale. Extend an existing owner when its boundary already covers the meaning; create another owner only for a distinct responsibility.

## Let non-owners route

An artifact that helps an audience find a meaning should point to the authoritative owner instead of restating it. A routing map owns only its need-to-destination edges and may point to a narrower map when each mapping boundary remains focused. Its reading conditions should be evaluable before opening a destination and should name the task, decision, changed artifact, or failure condition together with the stable boundary that makes the destination relevant. A scope states one responsibility and level of detail; neither a scope nor a reading condition should become a contents inventory.

An always-loaded Agent instruction file should keep the mandatory rules it authoritatively owns plus stable task-based routes to conditional detail. Repeat a minimal safety imperative only when the cost of missing it justifies duplication. The active instruction hierarchy determines whether narrower instructions may override, refine, or only strengthen broader policy.

A changing inventory belongs in hand-maintained guidance only when completeness affects an outcome and generation or mechanical validation keeps it complete. Otherwise, route readers to the live source that owns the inventory.
