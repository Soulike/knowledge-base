# Add engineering reading as a task changes phase

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

A long engineering task must accumulate required reading from independently
applicable Handbooks and packages as its language, filesystem operation,
testing phase, and executable environment become observable. Earlier current
reading may be reused, while a phase change must not be handled from memory of
the initial selection alone.

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
new body, then record every selected and excluded package before supplying
expected choices. Permit read-only access to direct canonical routes and no
external effects.

Use one fresh supported lower-capability model with the expanded executor guard
and a twelve-minute total allowance. Keep this case, its expected behavior,
prior attempts, and evaluator conclusions private. Record the source snapshot,
model and configuration, initial candidate set, each phase message, choices,
file and section reads, evolving result, and observation limits.

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
- R3 (critical): phase 2 re-evaluates selection and adds automated testing. It
  reads test effectiveness and trustworthy execution, chooses protection at
  the owning seams, and explains collection and execution evidence. It does not
  load test-execution-cost merely because tests now exist.
- R4 (critical): phase 3 adds the test-execution-cost package, establishes a
  comparable measurement basis and trustworthy execution before attributing
  cost, and preserves earlier test protection.
- R5 (critical): phase 4 re-evaluates development tooling and adds the
  executable-environment package. It establishes which executable actually
  ran, corrects lookup at the caller environment, propagates it to wrappers and
  child processes, restores the caller environment when temporary, and verifies
  actual execution.
- R6: every matching package accumulates, current readings are reused without
  false reread claims, and no Handbook is invoked through another Handbook.
- R7: active project instructions and accepted task requirements take
  precedence over shared guidance throughout the journey.

## Verification

Use the journey dispatch protocol, preserving the natural message sequence.
Inspect phase-by-phase choices, route reads, and the evolving design. Give the
capable reviewer the exact source, bodies, Knowledge routes, messages, raw
observations, and this contract after the journey completes. Judge native
selection, package selection, actual reading, application, and later additions
as separate evidence.

Controlled faulty observations that load test cost during phase 2, omit the
testing Handbook after phase 2, diagnose PATH without checking the executable
that ran, or replace the general filesystem package with only the Node.js leaf
must fail the corresponding criterion.

## Source

GitHub issues #242 and #245 require overlap and phase-change evidence, cumulative
packages, Node.js filesystem reading without Handbook dependencies, trustworthy
test work, focused cost guidance, and executable lookup propagation. This case
reconstructs that accepted journey before implementation and requires fresh
evidence against the final content.
