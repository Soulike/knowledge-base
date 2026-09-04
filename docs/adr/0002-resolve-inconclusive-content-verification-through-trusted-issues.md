# 0002: Resolve inconclusive content verification through trusted issues

## Status

Superseded by [ADR 0003](0003-use-mutable-finding-events-for-content-verification.md)

## Context

Scheduled content verification can complete its required research without
finding authoritative public evidence that confirms or invalidates an
experiential claim. Treating that result as incomplete execution made Actions
red and prevented unrelated evidence-backed maintenance issues from being
published. Adding provenance commentary to reader-facing Knowledge would also
burden its audience with workflow history rather than resolving the maintenance
decision.

GitHub issues already provide a durable place for a repository collaborator to
explain how such information was obtained, why it remains valid, and when it
must be verified again. Issue text remains untrusted Agent input, however, and
arbitrary comments must not suppress future maintenance work. The three
scheduled verification workflows also need one shared contract so their result
states, history rules, and issue publication behavior do not drift.

The fixed `gh-aw` runtime separates Agent output from write credentials and can
expose a custom safe-output job. Its built-in failure reporters have different
semantics: Agent and framework failures use a 24-hour reuse window, failed
repository jobs create per-run reports, and the built-in safe-output job is
excluded from failed-job reporting.

## Decision

Treat `current`, `modification-required`, and
[verification inconclusive](../../CONTEXT.md#verification-inconclusive) as
successful content outcomes. Reserve `report_incomplete` and failed workflow
status for analysis that could not be performed, malformed or unauthenticated
output, threat detection, trusted-gate or publication failure, and other
unexpected mechanism errors.

Give all three scheduled verification workflows one imported shared component
for result states, issue-history policy, terminal safe outputs, modification
issue configuration, and inconclusive publication. Keep each workflow's
subject-specific analysis rules in its own source. Preserve the existing
limitation that safe-output transport does not prove an unrepresented
classification for every target or finding.

Require exactly one `resolve_verification_inconclusive` call for each represented
inconclusive finding. The call either requests one new confirmation issue or
selects one of two no-create reasons: a matching open confirmation issue or an
applicable [historical disposition](../../CONTEXT.md#historical-disposition).
Do not group findings or add permanent finding identifiers.

The Agent completes and freezes current analysis before reading issue history.
It owns semantic comparison, conflict detection, disposition applicability, and
interpretation of revalidation triggers. Uncertainty creates a new confirmation
issue and cites relevant prior confirmation issues. Deterministic code does not
interpret collaborator prose or launch a second Agent.

At the privileged boundary, re-run the canonical output validation and re-read
every cited issue and comment from the workflow repository. Authenticate the
confirmation issue's bot author, fixed labels, scope-and-target title prefix,
trusted marker, non-pull-request type, state, and comment relationship. Only a
closed confirmation issue with a no-change reply from an `OWNER`, `MEMBER`, or
`COLLABORATOR` can support a historical disposition. Construct new issue titles,
labels, target and revision binding, run links, finding details, and maintainer
instructions in trusted code. Immediately before creation, suppress only an
exact open publication duplicate; do not perform semantic deduplication.

Enable gh-aw's global failure-issue and failed-job reporters while keeping its
dedicated incomplete-result issue handler disabled. Accept their fixed
best-effort boundary: failed-job issues do not share the 24-hour reuse window,
and a fatal built-in modification-issue publication failure can remain visible
through red Actions status and normal notifications without a corresponding
failure issue. Do not add a repository-owned failure parser or persistent
aggregator.

## Consequences

- An inconclusive finding creates or reuses a human confirmation issue without
  blocking unrelated maintenance issues or making Actions red.
- Maintainers either record a trusted no-change explanation with a revalidation
  trigger or change or delete the questioned content and close the issue. A
  content change affects the next verification through the new revision rather
  than becoming a historical disposition.
- Modification findings continue through gh-aw's built-in issue publisher;
  inconclusive findings use the custom trusted publisher. Both can publish in
  one run.
- Invalid references, untrusted replies, malformed output, publisher errors,
  and incomplete execution fail closed. Partial publication remains possible
  when one privileged effect succeeds before another fails.
- Red scheduled verification runs describe mechanism health rather than content
  cleanliness. Failure issues are best effort within the pinned runtime, while
  Actions status and notifications remain the complete operational signal.
- Pull-request review retains its separate task contract and is unchanged.
