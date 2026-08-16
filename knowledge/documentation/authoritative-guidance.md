# Authoritative engineering guidance

## Scope

This document explains project-independent principles for deciding when durable engineering guidance is warranted, assigning each meaning to an authoritative artifact and stable owner, routing readers to it, and keeping it current. It does not orchestrate a documentation change, prescribe prose style, or duplicate the specific boundaries owned by [Knowledge and Skills](../agents/knowledge-and-skills.md) and [Source comments and docstrings](../software-engineering/source-comments.md).

## When to update

Update this document when evidence changes the admission, authority, ownership, routing, or maintenance principles for durable engineering guidance, or when a recurring artifact type exposes an ambiguity that the current model cannot resolve.

## Admit an information need, not a document request

A proposed file is not evidence that documentation is needed. Start from the meaning a reader must recover and the recurring task that depends on it. A durable semantic block earns a place when all three conditions hold:

1. A recurring task has a specific audience for the information.
2. The audience cannot recover the information reliably from its authoritative sources.
3. The gap can cause a concrete mistake, unsafe outcome, or blocked task.

A definition, routing pointer, or minimal example may support an admitted block without needing an independent justification. A routing map may also be worthwhile when it materially reduces repeated discovery work, even though every destination remains independently discoverable.

Treat a rule together with only the rationale or example needed to apply it as one semantic block. “No documentation change” is the correct outcome when existing authoritative sources already make the meaning reliable.

An authoritative source directly defines or owns a meaning. A hand-maintained restatement is not a second authority and creates a cache that can drift. Satisfy an admitted need by improving or directly exposing the authoritative source, generating a reference from it, or adding a routing pointer, definition, or minimal example that supports the authoritative meaning. A merely expensive lookup does not justify a hand-maintained summary.

## Match authority to purpose

The artifact that can keep a meaning correct with the least duplication should own it. Project-specific contracts may refine this mapping, but a useful default is:

| Artifact                                                                            | Appropriate authority                                                                                                                  |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Code, configuration, schemas, CLI help, or generated references                     | Current behavior and executable contracts                                                                                              |
| Source comments and docstrings                                                      | Non-obvious intent, rationale, invariants, and failure modes attached to an implementation                                             |
| Tests or executable examples                                                        | Evidence that a contract holds; they own the contract only when the project explicitly designates them as its executable specification |
| Maintained engineering documentation                                                | Stable invariants, boundaries, domain models, rationale, and non-obvious facts that have no narrower executable owner                  |
| Routing maps and indexes                                                            | Need-to-destination mappings, while destination facts remain at their owners                                                           |
| Agent Skills                                                                        | Decisions, tool use, ordered work, and completion criteria for a recurring Agent task                                                  |
| User documentation and runbooks                                                     | Procedures people must understand or perform independently of an Agent                                                                 |
| Issues, pull requests, design proposals, implementation plans, and incident records | Plans, status, TODOs, history, evidence, validation records, and rollout state                                                         |

Transient records may explain why a durable decision was made, but the surviving constraint belongs with the artifact responsible for maintaining it after the record closes.

## Prefer the narrowest stable owner

Put guidance beside the implementation or domain that can keep it correct. Cross-file guidance within one owner can live in that owner’s local documentation; stable consumer orientation can live at a package or module entry point. Broader documentation is appropriate when a meaning crosses independent owners or no narrower location can own it without duplication.

Narrowness alone is insufficient: a location that is routinely renamed, regenerated, or bypassed is not a stable owner. Each hand-maintained engineering-guidance document must place, before its substantive body, a content boundary precise enough to accept or reject a proposed block and a maintenance condition that identifies changes capable of making it stale. Extend an existing owner when its boundary already covers the meaning; create a new owner only for a distinct responsibility.

## Route without restating

Keep each meaning in one authoritative home and link to it when routing is useful. A broad routing map may point to a narrower map when that keeps each mapping boundary focused; each map owns only its need-to-destination edges, while destination facts remain at their authoritative sources. A reading trigger should be evaluable before opening its target: name the task, decision, changed artifact, or failure condition and the stable boundary that makes the target relevant. A list of the target’s contents belongs in its scope, not in the trigger.

Always-loaded Agent instruction files benefit from the same discipline. Keep them to mandatory rules and stable task-based triggers, disclose conditional detail behind pointers, and repeat only a minimal safety imperative when the cost of missing it justifies duplication. The project’s active instruction hierarchy determines whether narrower instructions may override, refine, or only strengthen broader policy.

A changing inventory belongs in hand-maintained guidance only when completeness affects an outcome and generation or mechanical validation keeps it complete. Otherwise, route readers to the live source that owns the inventory.

## Propagate meaning changes

Documentation impact follows changed meaning rather than file categories. A change can affect instructions, Skills, examples, pointers, comments, or user guidance even when none appears in the proposed diff. Conversely, a code change may require no prose update when the authoritative contract and existing routes remain complete.

When a meaning changes, every secondary representation must either remain correct, move with its authority, become a pointer, or be removed. Updating the authoritative home while leaving stale names, paths, headings, examples, or summaries preserves two competing versions of the meaning. Prefer pruning obsolete guidance to accumulating qualifications around it.

When documented guidance claims that the system enforces an invariant, treat the invariant, its enforcement mechanism, and the evidence that demonstrates it as one consistency set. A change to any member requires reassessing the others: evolve them together, or surface explicitly that the enforcement or evidence no longer establishes the documented claim.
