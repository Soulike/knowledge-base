# Extend mobile-Web recovery into usability evaluation

## Identity

- ID: mobile-web-usability-journey
- Kind: journey

## Covered objects

- [Product-experience Handbook](../../handbook-product-experience/SKILL.md)
- [Operation failure and recovery Workflow](../../workflow-design-operation-failure-recovery/SKILL.md)

## Protected behavior

The product-experience Handbook and operation Workflow own the complete mobile,
Web, recovery, and usability reading required by an interactive product task.
Protect those cumulative conditions and direct routes when the already-running
operation Workflow later gains a usability-evaluation responsibility. Loading
its initial interactive recovery routes must not settle its later conditional
reading. Different prototype implementations and evaluation methods are allowed.

## Task

1. Implement a mobile-browser flow that lets a patient reschedule an
   appointment. Include narrow-screen layout, action labels, confirmation, and
   recovery from failed, pending, and unknown outcomes.
2. Once the prototype works, evaluate whether people can complete the
   rescheduling task and decide which usability problems to fix first. Agent
   trials may supplement the evaluation, with their evidence limits made clear.

## Starting state

Provide a small temporary rescheduling prototype with narrow-viewport
constraints and one ambiguous confirmation state. Supply the controlled
[recovery context](fixtures/product-recovery-context.json), active project
instructions, and current installed Skill metadata. Allow selected Skill bodies
and their direct routes.
The status resolver and clinic channel are demo fixtures, not real services or
authority for an external effect. Make the maintenance Catalog unavailable.
Project instructions scope the first delivery to implementation and functional
browser verification; usability evaluation begins with request 2.

Permit writes only to the isolated prototype. Begin with request 1; reveal
request 2 after its reading, implementation, and browser behavior are captured.
Keep the same prototype for the evaluation. The demo status resolver can confirm
the active appointment; its outcome controls must remain observable without
contacting a real clinic.

## Expected behavior

- P1: select the product-experience Handbook and operation-failure-and-recovery
  Workflow from the implementation request before body access.
- P2 (critical): select and read the complete information-hierarchy,
  interaction-clarity, user-goodwill, and layout-resilience foundation plus the
  mobile and Web layout/accessibility packages before implementation.
- P3 (critical): use the Workflow's direct operation failure/recovery,
  user-facing failure communication, test-effectiveness, interaction-clarity,
  goodwill, mobile, content-resilient layout, and Web-accessibility routes
  without the Catalog. Interactive recovery alone does not require the two
  usability-evaluation documents.
- P4: exclude home-page and navigation guidance for this isolated product flow.
- P5: apply the reading to observable layout, feedback, effect certainty, and
  continuation behavior rather than only listing principles.
- P6 (critical): after request 2, the same Handbook matches the complete
  six-document usability package: its four foundation documents plus task-based
  observation and Agent-evidence guidance. The running operation Workflow must
  also follow its newly applicable direct evaluation routes before evaluating
  the prototype. Earlier interactive reading does not satisfy those new routes.
- P7: prioritize from task-success observations and distinguish Agent findings,
  operator checks, and evidence about human usability.

## Verification

Capture initial Skill and package choices, direct reads, the prototype, and
narrow-browser outcome/recovery observations before revealing the evaluation
request. Then inspect the additional evaluation reading and task-success
evidence from that prototype. A Workflow that checks conditional routes only on
initial entry must fail P6. Generic reading counts and recovery after lost
context are outside this case.

## Source

GitHub issues #242 and #247 establish the interface foundation, mobile/Web
overlap, and full usability package. GitHub issue #249 establishes the
operation Workflow's direct interactive, mobile, Web, and evaluation routes.
The maintainer's review of pull request #258 preserves the Workflow's delayed
evaluation branch as distinct protection, rather than supplying evaluation
intent at task start.
