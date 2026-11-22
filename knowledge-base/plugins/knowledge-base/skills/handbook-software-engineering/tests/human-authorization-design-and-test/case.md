# Apply human-authorization guidance during design and testing

## Identity

- ID: human-authorization-design-and-test
- Kind: application

## Covered objects

- [Software-engineering Handbook](../../SKILL.md)

## Protected behavior

Designing and testing approval, consent, confirmation, and
preview-before-effect behavior must load the human-authorization package before
dependent conclusions. Protect both work stages independently, including the
binding between reviewed content and later effects, while allowing different
interfaces, implementations, and test frameworks.

## Task

Treat these as independent scenarios:

1. Design a confirmation-before-effect flow for deleting a production data set.
   A person must see the exact target, action, and consequences before deciding,
   and a replacement proposal may appear before the response arrives. Produce
   the design only; do not implement or review existing code.
2. Design automated protection for an existing approval flow in which a stable
   request ID can point to replacement content. Prove that approval of the old
   proposal cannot authorize the replacement, cannot consume the replacement's
   pending decision, and cannot start its protected effect. Produce the test
   design only; do not implement or review the flow.

## Starting state

For each scenario, supply the complete current Software-engineering Handbook,
its permitted direct canonical routes, the natural request, and read-only access
to the supplied repository snapshot. For scenario 2, also supply the complete
current Automated-testing Handbook and its direct routes so independently
required test guidance is available. Keep the two scenarios isolated from one
another.

Ask the executor to record every selected and excluded package before opening
Knowledge, then produce the requested design. Record package choices, files and
sections read, the final design, and available action observations for each
scenario.

## Expected behavior

- R1 (critical): both scenarios select and read [Human decisions that authorize
  software
  effects](../../../../knowledge/software-design/human-decision-authorization.md).
  The package must match design-only and test-only work, not only implementation
  or review.
- R2: scenario 1 binds the decision to the canonical target, permitted action,
  and immutable proposal identity or generation; validates it at the
  effect-owning boundary; rejects missing, stale, mismatched, or revoked
  authority before protected effects or decision consumption; and keeps the
  checked proposal bound through execution.
- R3: scenario 2 uses an independently worked replacement-generation example
  and asserts that a stale response is rejected before effect or consumption,
  leaves the replacement decision pending, and cannot pass through an
  asynchronous check-then-use gap.
- R4: apply the software foundation and other genuinely matching packages for
  primary design or test-code work, and apply the automated-testing foundation
  in scenario 2. Do not load command, Git-comparison, GitHub API, concurrency,
  or unrelated packages merely because the flow is consequential.
- R5: distinguish authentication and permission from the content-bound human
  decision; neither identity nor permission alone authorizes replacement
  content.

## Verification

Inspect package choice, actual reading, and the resulting design separately for
each isolated scenario.

A controlled faulty observation that omits the authorization package from
either scenario, checks only a stable request ID, consumes the replacement
decision on stale input, or tests only a caller-side disabled control must fail
the corresponding criterion.

## Source

GitHub issues #242 and #245 require the human-authorization package to apply
before approval, consent, confirmation, and preview-before-effect behavior is
designed or tested. This case protects those two stages independently.
