# Engineering information ownership

## Scope

This reference supports workflow steps that match engineering information to an artifact type capable of keeping it correct. It recommends artifact roles while leaving concrete files, directories, modules, and routing structures to the active project.

## When to update

Update this document when evidence changes how an information type's audience, change lifecycle, or semantic coupling affects its fit with an engineering artifact type, or when a recurring artifact-fit decision exposes an ambiguity in the current recommendations.

## Match information to an artifact role

Artifact fit is the match between a meaning and an artifact type whose normal audience and change lifecycle can keep that meaning useful and current. Ownership at this level recommends a kind of artifact, not an address in a repository.

Project-specific contracts may replace these defaults:

| Artifact type                                                                       | Information it is generally suited to maintain                                                                                            |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Code, configuration, schemas, CLI help, or generated references                     | Current behavior and executable contracts                                                                                                 |
| Source comments and docstrings                                                      | Non-obvious intent, rationale, invariants, and failure modes coupled to one implementation                                                |
| Tests or executable examples                                                        | Evidence that a contract holds; the contract itself only when the project designates them as its executable specification                 |
| Maintained engineering documentation                                                | Concepts, boundaries, domain models, rationale, and cross-cutting facts that readers need independently of one implementation site        |
| Routing maps and indexes                                                            | Need-to-destination mappings when the project chooses to maintain such a map; destination facts remain in their project-designated source |
| Agent Skills                                                                        | Decisions, tool use, ordered work, and completion criteria for a recurring Agent task                                                     |
| User documentation and runbooks                                                     | Procedures people must understand or perform independently of an Agent                                                                    |
| Issues, pull requests, design proposals, implementation plans, and incident records | Plans, status, TODOs, history, evidence, validation records, and rollout state                                                            |

An implementation-local invariant that changes with its code is usually a better fit for a source comment or docstring than for a separate guide. A contract or concept needed across implementations or independently of source code is usually a better fit for maintained documentation than for one local comment.

Transient records may explain why a durable decision was made, but they are a poor fit for a constraint that must remain discoverable and current after the record closes.

An artifact is a poor fit when it is routinely regenerated, bypassed, or maintained on a lifecycle disconnected from the meaning. When a project-selected target has that risk, surface it as a quality concern rather than selecting another address.

A changing inventory fits hand-maintained guidance only when completeness affects an outcome and generation or mechanical validation keeps it complete. Otherwise, a live project source is the better artifact type for that inventory.

Every hand-maintained engineering-guidance document must make its content boundary precise enough to accept or reject a proposed block and identify the changes capable of making its content stale. The active project determines how and where the document expresses that boundary and maintenance condition.

## Keep routing artifacts focused

A routing map or index is a fit for need-to-destination edges, not for restating destination facts. A reading condition should be evaluable before opening its target and name the task, decision, changed artifact, or failure condition together with the stable boundary that makes the destination relevant. A scope should state one responsibility and level of detail rather than inventory the target's contents.

An always-loaded Agent instruction artifact is a fit for mandatory rules and stable task-based routes to conditional detail. Conditional detail belongs behind project-defined pointers, while a minimal safety imperative may be repeated when the cost of missing it justifies duplication. The active project's instruction hierarchy determines how broader and narrower instructions interact.

## Separate evidence from presentation

The artifact that establishes a claim and the artifact that explains it to an audience may differ. Executable source can prove current behavior while a comment or maintained document explains intent, rationale, or usage. The explanatory artifact should add the understanding its audience needs rather than present a hand-maintained restatement as another source of executable truth.

## Let the project choose the address

After selecting a suitable artifact type, resolve its concrete file, directory, module, and routing only from the active project's explicit instructions and standards or from explicit user requirements. Treat the destination and routing topology as separate project decisions. When the destination, the routing topology, or both remain undetermined, surface each unresolved decision with the viable artifact types instead of inventing a project structure.

Use the project's established routing conventions when another audience needs access to the meaning. When those conventions do not determine the required route, leave that routing decision unresolved. Artifact-fit guidance does not choose a broad or narrow owner, introduce a routing hierarchy, or decide where the project places a fitting artifact.
