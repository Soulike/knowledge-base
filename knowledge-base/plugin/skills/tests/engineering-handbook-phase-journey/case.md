# Apply engineering guidance as work changes phase

## Identity

- ID: engineering-handbook-phase-journey
- Kind: journey

## Covered objects

- [Software-engineering Handbook](../../handbook-software-engineering/SKILL.md)
- [Automated-testing Handbook](../../handbook-automated-testing/SKILL.md)
- [JavaScript and TypeScript Handbook](../../handbook-javascript-typescript/SKILL.md)
- [Filesystems Handbook](../../handbook-filesystems/SKILL.md)
- [Development-tooling Handbook](../../handbook-development-tooling/SKILL.md)

## Protected behavior

One concrete engineering task moves from runtime file-operation design to its
automated protection, that test suite's feedback cost, and executable lookup.
Protect the domain foundations, cumulative packages, direct routes, and
application required by each phase. The collaboration owner separately protects
the generic reading lifecycle, including reuse, rereading, interruption, and
recovery behavior.

## Task

Work through these messages in one task, receiving the next only after the
previous response and observations are recorded:

1. `Design an in-process TypeScript Node.js background operation that coordinates several requested files concurrently, opens each one once, records its modification time, reads it, and reports every settled result even when some files fail. This is application runtime work, not CI/CD, a scheduled job, or an automation workflow.`
2. `Now design automated protection for the behavior and explain how you will know the test run is trustworthy.`
3. `The suite is too slow and memory-heavy. Measure the feedback cost and propose a justified improvement.`
4. `CI is also selecting the wrong SDK executable from PATH. Diagnose the lookup environment and make the intended executable reach child processes.`

Return the evolving design, the added testing and measurement plan, and the
executable-selection correction with the evidence needed to validate each
phase.

## Starting state

Use the exact final installed Skill candidate metadata and current Handbook
bodies from the tested source. Begin with only message 1 and no expected
selection. At each phase, record applicable Handbook choices before opening a
new body, then record every selected and excluded package before opening newly
required Knowledge. Permit read-only access to direct canonical routes and no
external effects.

Use one fresh supported lower-capability model with the expanded executor guard
and a twelve-minute total allowance. Keep this case, its expected behavior,
prior attempts, and evaluator conclusions private. Record the source snapshot,
model and configuration, initial candidate set, each phase message, choices,
file and section reads, evolving result, and observation limits.

This case observes the engineering guidance required by each phase. Do not
score generic reading reuse, rereading, guidance-change, interruption, or
recovery behavior here.

When phase 4 begins, also supply an isolated copy of the
[PATH fixture](fixtures/path-environment/runner.mjs), including its `wrong/` and
`intended/` executable directories and [child process](fixtures/path-environment/child.mjs).
Start with `wrong/bin` before `intended/bin` in `PATH`. Permit commands only
inside that fixture so the executor can observe the executable selected by the
caller and child, apply an operation-scoped correction, and confirm the parent
shell environment afterward. The fixture is starting material rather than
evaluator-only content.

## Expected behavior

- R1 (critical): phase 1 selects software engineering, JavaScript and
  TypeScript, and filesystems. It reads their applicable foundations; adds the
  software reliability and asynchronous/concurrent packages, the Promise and
  date-time packages, and the Node.js filesystem package; and applies every
  match cumulatively.
- R2: phase 1 keeps the Node.js primitives together with the general filesystem
  foundation, uses one handle for identity-sensitive facts and reads, preserves
  each settled result, and distinguishes per-file failures without inventing
  complete success.
- R3 (critical): phase 2 adds automated testing for the concrete operation. It
  reads test effectiveness and trustworthy execution, chooses protection at
  the owning seams, and explains collection and execution evidence. It does not
  load test-execution-cost merely because tests now exist.
- R4 (critical): phase 3 concerns the concrete suite designed in phase 2. Test
  effectiveness and trustworthy execution remain applicable, and
  test-execution-cost is additionally required. Establish a comparable
  measurement basis and trustworthy execution before attributing cost, preserve
  effective protection, and do not invent measurements.
- R5 (critical): phase 4 adds development-tooling and executable-environment
  guidance. Establish which executable actually ran, correct lookup at the
  caller environment, propagate it to wrappers and child processes, preserve or
  restore the caller environment, and verify actual execution.
- R6: select every foundation and package required by R1–R5 from the observable
  work and read it through direct canonical routes, without invoking one
  Handbook through another. This criterion does not require unrelated domain
  guidance or score generic reading lifecycle behavior.

## Verification

Use the journey dispatch protocol, preserving the natural message sequence.
Inspect phase-by-phase choices, direct route reads, domain application, and the
evolving result as separate evidence. Give the capable reviewer the exact
source, current bodies and routes, messages, raw observations, and this contract
after the journey completes. Judge each criterion independently and retain all
attempts.

For phase 4 inspect actual before/after command output and environment evidence.
A plausible PATH string alone is not execution evidence. Controlled faulty
observations that load test cost during phase 2, treat phase 3 as cost-only
learning unrelated to the concrete suite, diagnose PATH without checking the
executable that ran, or replace the general filesystem package with only the
Node.js leaf must fail the corresponding criterion.

Do not judge generic reassessment, reading reuse, rereading, interruption, or
route-restoration behavior in this case; those assertions belong to the
[collaboration lifecycle case](../../../tests/collaboration-guidance-recovery/case.md).

## Source

GitHub issues #242 and #245 require engineering domain overlap, staged additions,
cumulative packages, Node.js filesystem reading without Handbook dependencies,
trustworthy concrete test work, cost guidance for that suite, and executable
lookup propagation. This case retains that accepted engineering journey while
leaving shared reading-lifecycle assertions at their collaboration owner.
