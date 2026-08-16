# When documentation is needed

## Scope

This document defines the information-need test for deciding whether a recurring engineering task requires durable documentation or whether current authoritative sources and routes already make the required meaning reliable.

## When to update

Update this document when evidence changes the conditions under which an engineering information gap warrants durable documentation or when a recurring information need exposes an ambiguity in the current test.

## Start from the reader's task

A request for a file is not evidence that documentation is needed. Identify the exact meaning a reader must recover, the audience that needs it, and the recurring task that depends on it. Documentation is warranted only when the active project's authoritative sources and existing routes leave a consequential information gap. Use [Engineering information ownership](information-ownership.md#match-information-to-an-artifact-role) to test whether maintained documentation is a fitting artifact type without treating that recommendation as a project-specific location decision.

## Apply the information-need test

A durable semantic block earns a place only when all three conditions hold:

1. A recurring task has a specific audience for the information.
2. The audience cannot recover the information reliably from authoritative sources or existing routes.
3. The gap can cause a concrete mistake, unsafe outcome, or blocked task.

A routing map is the narrow exception to this test. It may be worthwhile when its need-to-destination edges materially reduce repeated discovery work even though every destination remains independently discoverable.

A definition, pointer, or minimal example may support an admitted block without requiring a separate justification. Treat a rule together with only the rationale or example needed to apply it as one block.

Satisfy an admitted need by improving or directly exposing a project-defined authoritative source, generating a reference from it, or adding only the definition, pointer, or example needed to make its meaning recoverable. Durable prose is one possible response to an information need, not the default response.

“No documentation change” is the correct outcome when authoritative sources and existing routes already make the meaning reliable.

## Distinguish reliability from convenience

Documentation should close a reliability gap rather than cache an inconvenient lookup. The routing-map exception reduces discovery cost without authorizing a hand-maintained summary of destination facts. A summary is not justified merely because consulting the source takes effort; it creates another representation that can drift.
