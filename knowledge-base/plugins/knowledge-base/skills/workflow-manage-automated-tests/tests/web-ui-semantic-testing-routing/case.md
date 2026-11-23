# Route and apply Web UI accessible-semantics testing

## Identity

- ID: web-ui-semantic-testing-routing
- Kind: application

## Covered objects

- [Automated-tests management Workflow](../../SKILL.md)

## Protected behavior

Automated Web UI test planning must route to Web UI accessible-semantics
testing Knowledge, apply its selector priority (`role + name` over visible
text over explicit test hooks) and evidence boundaries, and exclude
`accessible-web-ui-testing.md` for non-UI CLI tests and `test-execution-cost.md`
when no runtime or resource tradeoff is present.

## Task

Handle these two independent requests in a read-only planning mode (do not edit
files or run commands):

1. Plan automated component tests for our web checkout form and confirmation
   modal, including how controls should be queried, what states should be
   asserted, and what the component tests do not establish on their own.
2. Plan automated tests for a database migration CLI command that reads
   migration files and updates a local schema table.

For each request, record which Knowledge and internal sub-flow references from
[Automated-tests management Workflow](../../SKILL.md) apply before reading the
linked Knowledge, read the matching documents in full, and then give a concise
plan grounded in that reading.

## Starting state

Supply the complete current
[Automated-tests management Workflow](../../SKILL.md), its
[Write effective tests](../../references/write-effective-tests.md) reference,
and read-only access to its linked canonical Knowledge files under the plugin
snapshot. Keep the two requests independent and do not modify repository
files.

## Expected behavior

- R1 (critical): request 1 selects
  [Write effective tests](../../references/write-effective-tests.md),
  [Test effectiveness](../../../../knowledge/software-testing/test-effectiveness.md),
  [Trustworthy test execution](../../../../knowledge/software-testing/trustworthy-test-execution.md),
  and
  [Testing web user interfaces through accessible semantics](../../../../knowledge/software-testing/accessible-web-ui-testing.md),
  excludes
  [Test execution cost](../../../../knowledge/software-testing/test-execution-cost.md),
  and reads the selected Knowledge documents before answering.
- R2 (critical): request 1 prioritizes accessible role and name/label over
  visible text and explicit test-hook fallbacks, avoids internal DOM/CSS
  selectors, asserts exposed accessible states alongside application behavior,
  and explicitly excludes visual layout/clipping, pointer reachability, and
  real keyboard focus or assistive-technology proof from what headless
  component tests establish.
- R3 (critical): request 2 selects
  [Write effective tests](../../references/write-effective-tests.md),
  [Test effectiveness](../../../../knowledge/software-testing/test-effectiveness.md),
  and
  [Trustworthy test execution](../../../../knowledge/software-testing/trustworthy-test-execution.md),
  and excludes both
  [Testing web user interfaces through accessible semantics](../../../../knowledge/software-testing/accessible-web-ui-testing.md)
  and
  [Test execution cost](../../../../knowledge/software-testing/test-execution-cost.md).

## Verification

Inspect recorded route choices, read files, and final plans for each of the two
independent requests separately. A faulty observation that omits the Web UI
package for request 1, skips accessible selector priority or headless evidence
limits, loads the Web UI Knowledge for the CLI test in request 2, or loads
test-execution-cost for either request must fail the corresponding critical
criterion.

## Source

GitHub issue #275 adds Web UI accessible-semantics testing Knowledge and routes
it conditionally without loading it for non-UI tests. Relocated and adapted
from the retired `handbook-automated-testing` case per #320 and #329 to retain
non-UI exclusion and standard Web UI selector-priority protection under
`workflow-manage-automated-tests` (retiring only the standalone non-workflow
conceptual-learning request).
