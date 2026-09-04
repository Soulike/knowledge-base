# 0003: Use mutable finding events for content verification

## Status

Accepted

## Context

Scheduled content verification must judge each maintained-content target as a
complete responsibility, including whether later edits have left duplicated
authority, superseded wording, patch-layered exceptions, or structure shaped by
edit history. The existing terminal result model freezes findings before issue
search and requires separate publication shapes for modification and
inconclusive outcomes. That makes history review a second disposition protocol
instead of letting the Agent refine the finding it already understands.

The Agentic workflow runtime records safe-output calls in an append-only output
artifact. Its typed tools can validate required direct parameters, but they do
not provide one stateful server shared across calls. Publication still needs a
credentialed boundary after the Agent completes.

## Decision

Represent content-verification work as an ordered stream of `add_finding`,
`update_finding`, and `delete_finding` events. The Agent chooses each concise
run-local finding ID and reuses it in later events. Add and update carry direct
parameters: one primary review target, one classification, free-form finding
Markdown, and optional related target IDs from the same revision's canonical
target catalog. Update is full replacement rather than a partial patch.

A deterministic reducer validates the trusted manifest and replays the
append-only stream after Agent completion. Primary targets must belong to the
workflow's review subset; related targets may belong to the wider repository
catalog. The reducer rejects malformed transitions and incomplete execution,
while accepting an empty stream as a successful no-action result. Findings-only
transport intentionally does not claim mechanically proven coverage for every
target.

After reduction, a trusted publisher constructs issue identity, title, body,
labels, revision and run links, and checks for an exact open publication race
immediately before each write. The Agent performs semantic issue-history
comparison by updating or deleting findings and never receives issue-write
credentials. One final finding produces one issue even when its coherent
remediation affects several targets.

Deliver the migration of all three scheduled scopes on one integration branch
and one pull request. During that migration,
[ADR 0002](0002-resolve-inconclusive-content-verification-through-trusted-issues.md)
remains accepted for every scope that still uses the legacy terminal contract.
After the final scope migrates, remove the legacy model and mark ADR 0002 as
superseded without rewriting its historical context.

## Consequences

- Review can refine findings before and during history deduplication without a
  second rigid disposition structure.
- Finding prose remains readable and adaptable while target identity,
  classification, event transitions, subject identity, and publication effects
  remain deterministic.
- A malformed event or incomplete run fails the workflow and publishes no
  partial result; published findings are successful content outcomes.
- The migration temporarily carries two contracts, but the delivery is not
  complete until the legacy validator, publisher, safe outputs, tests, and
  documentation are removed.
