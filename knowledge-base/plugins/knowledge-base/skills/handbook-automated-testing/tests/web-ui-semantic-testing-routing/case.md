# Route and apply Web UI accessible-semantics testing

## Identity

- ID: web-ui-semantic-testing-routing
- Kind: application

## Covered objects

- [Automated-testing Handbook](../../SKILL.md)

## Protected behavior

Automated Web UI test tasks and focused-learning requests must match the Web
user-interface package in the Automated-testing Handbook, apply its semantic
selector priority and evidence boundaries, and keep non-UI tests out of that
package while allowing different test frameworks and wording.

## Task

Handle these three independent requests:

1. Plan automated component tests for our web checkout form and confirmation
   modal, including how controls should be queried, what states should be
   asserted, and what the component tests do not establish on their own.
2. Explain why automated web UI tests should query by accessible role and name
   instead of CSS classes or DOM structure, and what those tests still fail to
   prove.
3. Plan automated tests for a database migration CLI command that reads
   migration files and updates a local schema table.

For each request, record which parts of the Automated-testing Handbook apply
before reading its linked Knowledge, read the matching documents in full, and
then give a concise plan or explanation grounded in that reading.

## Starting state

Supply the complete current [Automated-testing Handbook](../../SKILL.md) and
read-only access to its linked canonical Knowledge files under the plugin
snapshot. Keep the three requests independent and do not modify repository
files.

## Expected behavior

- R1 (critical): request 1 selects the test-work foundation and the Web
  user-interface package, excludes Test execution cost, and reads both
  foundation files plus the Web UI semantic testing document before answering.
- R2 (critical): request 1 prioritizes accessible role and name/label over
  visible text and explicit test-hook fallbacks, avoids internal DOM/CSS
  selectors, asserts exposed accessible states alongside application behavior,
  and explicitly excludes visual layout/clipping, pointer reachability, and
  real keyboard focus or assistive-technology proof from what headless
  component tests establish.
- R3 (critical): request 2 matches the Web user-interface package directly as
  focused learning without forcing the test-work foundation, and accurately
  explains selector priority, dual behavioral-plus-accessibility protection, and
  semantic-tree evidence limits.
- R4 (critical): request 3 selects the test-work foundation and excludes both
  the Web user-interface package and Test execution cost.

## Verification

Inspect recorded package choices, read files, and final answers for each of the
three independent requests separately. A faulty observation that omits the Web
UI package for request 1 or 2, forces the test-work foundation for request 2,
or loads the Web UI package for the CLI test in request 3 must fail the
corresponding critical criterion.

## Source

GitHub issue #275 adds Web UI accessible-semantics testing Knowledge and routes
it conditionally from the Automated-testing Handbook without loading it for
non-UI tests or forcing the artifact-work foundation for focused learning.
