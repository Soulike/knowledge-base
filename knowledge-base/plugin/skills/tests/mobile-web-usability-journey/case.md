# Extend mobile Web recovery work into usability evaluation

## Identity

- ID: mobile-web-usability-journey
- Kind: journey

## Covered objects

- [Product-experience Handbook](../../handbook-product-experience/SKILL.md)
- [Operation failure and recovery Workflow](../../workflow-design-operation-failure-recovery/SKILL.md)

## Protected behavior

An interactive mobile-browser operation must receive the product-experience
foundation plus mobile and Web packages, and its operation Workflow must read
the corresponding direct recovery routes without consulting the maintenance
Catalog. When the
same task later becomes usability evaluation, the applicable observation and
Agent-evidence reading must be added without loading home-page or navigation
guidance for an isolated product flow.

## Task

Implement a mobile-browser flow that lets a patient reschedule an appointment,
including the narrow-screen layout, action labels, confirmation, and recovery
from failed, pending, and unknown outcomes. Once the prototype works, evaluate
whether people can complete the rescheduling task and decide which usability
problems to fix first. Agent trials may supplement the evaluation, but their
evidence limits must be clear.

## Starting state

Provide a small temporary browser prototype with a rescheduling form, narrow
viewport constraints, and one intentionally ambiguous confirmation state.
Supply the controlled [recovery context](fixtures/product-recovery-context.json)
as current product material. Its status resolver and clinic channel are demo
fixtures, not real services or authorization for an external effect; the
prototype may use them to make pending and unknown-result continuations
observable without claiming a real appointment changed.
Supply active project instructions and the current 35-candidate Handbook and
Workflow metadata. Reveal the evaluation phase only after the implementation
selection, reading choices, direct reads, and artifact are captured.

Make `knowledge/index.md` unavailable as a runtime input. Permit normal access to selected current Skill
bodies and their direct packaged routes. Use a fresh supported lower-capability
model with the expanded executor guard and a bounded writable allowance limited
to the prototype. Keep evaluator-only materials private. Record source identity,
blind selections, every reading choice, observable reads, implementation
evidence, evaluation method, and later re-evaluation.

## Expected behavior

- P1 (critical): select `handbook-collaboration`,
  `handbook-product-experience`, and
  `workflow-design-operation-failure-recovery` from the implementation request
  before body access.
- P2 (critical): before implementing, read the complete information-hierarchy,
  interaction-clarity, user-goodwill, and layout-resilience foundation plus the
  mobile-interface and Web layout/accessibility packages.
- P3 (critical): through the operation Workflow's direct routes, read operation
  failure and recovery, user-facing failure communication, test effectiveness,
  interaction clarity, user goodwill, mobile-interface usability,
  content-resilient Web layouts, and Web accessibility while the maintenance
  Catalog is unavailable as a runtime route.
- P4: exclude home-page purpose and site-navigation reading because the task is
  an isolated product flow rather than a website entry-point or navigation
  restructuring task.
- P5: apply the initial readings to the observable prototype and its truthful
  outcome, effect-certainty, feedback, and continuation behavior rather than
  merely listing principles.
- P6 (critical): when evaluation begins, add task-based usability observation
  and Agent-evidence guidance while retaining or reusing the four foundation
  readings as one complete six-document usability package.
- P7: use task-success observations to prioritize improvements and distinguish
  Agent findings from evidence about human usability.

## Verification

Capture native selection before body access, then reading choices before
expected routes. Inspect actual reads and the prototype, introduce the
evaluation phase, and record supplementary reading and the evaluation result.
Confirm that the direct operation routes worked with the Catalog unavailable.
Give the capable reviewer the contract and raw evidence without the
coordinator's verdict. Judge native selection, direct Workflow reading,
application, every cumulative package, and phase-change reading separately.

## Source

[GitHub issue #242](https://github.com/Soulike/knowledge-base/issues/242)
accepts the interface foundations and full usability package. [GitHub issue
#247](https://github.com/Soulike/knowledge-base/issues/247) requires
interface implementation and evaluation, mobile-Web overlap, and stage-change
coverage. [GitHub issue
#249](https://github.com/Soulike/knowledge-base/issues/249) requires the
operation Workflow's interactive, mobile, Web, and evaluation routes to read
canonical Knowledge directly without the Catalog.
