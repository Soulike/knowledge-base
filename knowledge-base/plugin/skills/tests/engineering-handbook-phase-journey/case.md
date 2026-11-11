# Apply engineering packages to independent work

## Identity

- ID: engineering-handbook-phase-journey
- Kind: application

## Covered objects

- [Software-engineering Handbook](../../handbook-software-engineering/SKILL.md)
- [Automated-testing Handbook](../../handbook-automated-testing/SKILL.md)
- [JavaScript and TypeScript Handbook](../../handbook-javascript-typescript/SKILL.md)
- [Filesystems Handbook](../../handbook-filesystems/SKILL.md)
- [Development-tooling Handbook](../../handbook-development-tooling/SKILL.md)

## Protected behavior

The engineering Handbooks own domain foundations and conditional packages for
runtime file operations, automated tests, test cost, and executable lookup.
Protect each domain decision and application without a long task whose later
messages require shared reading-lifecycle behavior.

## Task

Treat these as independent requests, all known from the start:

1. Design an in-process TypeScript Node.js background operation that coordinates
   several requested files concurrently, opens each once, records its
   modification time, reads it, and reports every settled result even when some
   files fail. This is application runtime work, not an automation workflow.
2. Design automated protection for that stated behavior and explain what
   evidence would make the test run trustworthy. No execution-cost concern is
   asserted in this request.
3. A test suite is reported to be slow and memory-heavy. Describe how to measure
   feedback cost and choose a justified improvement. No suite or measurements
   are supplied, so distinguish the method from measured results.
4. The supplied runner and its spawned child select the wrong SDK from PATH.
   Diagnose executable lookup, correct the fixture, and verify actual caller
   and child execution while preserving the caller environment.

## Starting state

Supply all requests and necessary task facts up front, the complete current
covered guidance, and normal read-only access to its direct packaged routes.
Use a fresh supported lower-capability model with the expanded executor guard
and a task-appropriate bounded allowance established before dispatch. Keep the
case, expected choices, previous outputs, and evaluator discussion private.

Before opening Knowledge, record selected and excluded reading units separately
for each independent request. Then permit the union of required direct reads
and perform the tasks. Record source identity, model/configuration, choices,
actual file or section reads, outputs, and action limits. The per-request
choices test domain conditions; a shared executor's union of reads does not
prove that a document was never loaded in another request. Do not stage a task
change or score reassessment, reading reuse, or rereading in this case.

For request 4 supply an isolated copy of the
[PATH fixture](fixtures/path-environment/runner.mjs), its wrong/intended
executable directories, and [child process](fixtures/path-environment/child.mjs).
Start with wrong/bin before intended/bin in PATH. Permit commands and writes
only inside that fixture; no real SDK installation or external effect is owed.
For the other requests permit read-only design work.

## Expected behavior

- R1 (critical): request 1 matches software engineering, JavaScript/TypeScript,
  and filesystems. Select their applicable foundations plus reliability,
  async/concurrency, Promise, date/time, and Node.js filesystem packages.
- R2: apply the complete general filesystem foundation with the Node.js
  primitives; use one handle for identity-sensitive facts and reads, preserve
  every settled result, and distinguish per-file failures.
- R3 (critical): request 2 matches test effectiveness and trustworthy test
  execution. Choose protection at owned seams and state collection/execution
  evidence; do not assign test-execution-cost merely because tests exist.
- R4 (critical): request 3 matches the applicable test foundation plus
  test-execution-cost; the cost unit does not replace effective or trustworthy
  test execution. Establish a comparable
  measurement basis and trustworthy execution, preserve effective protection,
  and do not invent measurements.
- R5 (critical): request 4 matches development-tooling and executable-environment
  guidance. Establish the executable that ran, correct lookup in the caller's
  scoped environment, propagate it to wrappers/children, preserve or restore
  the caller environment, and verify actual execution.
- R6: within each request require every matching foundation/package and follow
  direct canonical routes without invoking one Handbook through another.

## Verification

Use the application dispatch protocol. Inspect the per-request package choices,
actual direct reads, and domain application as separate evidence. Give the
capable reviewer the current covered content, this contract, and raw
observations without the coordinator's verdict. Judge every criterion
independently and retain all attempts. This case does not claim native client
selection or reading-lifecycle behavior.

For request 4 inspect actual before/after command output and environment
evidence. A plausible PATH string alone is not execution evidence. Judge
controlled faulty choices such as test cost for request 2, only the Node.js
leaf for request 1, or PATH diagnosis without actual execution as failures.

## Source

GitHub issues #242 and #245 establish engineering domain overlap, cumulative
packages, Node.js filesystem foundations, trustworthy tests, cost guidance,
and executable propagation. These independent application contexts preserve
that distinct protection under the existing case identity.
