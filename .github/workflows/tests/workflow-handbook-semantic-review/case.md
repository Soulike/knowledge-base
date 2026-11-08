# Review Workflow, Handbook, and Knowledge semantics

## Identity

- ID: workflow-handbook-semantic-review
- Kind: application

## Covered objects

- [Shared content-verification contract](../../shared/content-verification.md)
- [Maintained-Agent verification source](../../verify-maintained-agent-content.md)
- [Evergreen Knowledge verification source](../../verify-evergreen-knowledge.md)
- [Time-sensitive Knowledge verification source](../../verify-time-sensitive-knowledge.md)

## Protected behavior

Semantic content verification must distinguish Workflow execution from Handbook
required-reading selection, then trace real installed consumers and
context-sufficient reading units for Knowledge. Static reachability, actual
selection, reading, and application are separate evidence. Protect these
judgments while allowing different report structure, scenario choices, and
prompt wording.

## Task

Review the supplied final-candidate plugin slice as the maintained-Agent,
evergreen Knowledge, and time-sensitive Knowledge verifiers would. Return one
concise report that classifies the Skill responsibilities, maps every Knowledge
leaf to valid installed consumers and selection timing, assesses linked-section
sufficiency, distinguishes static routes from observed reading and application,
and identifies current semantic findings. Do not edit the supplied materials.

## Starting state

Supply isolated copies of the fixture [Knowledge catalog](fixtures/plugin/knowledge/index.md),
[documentation Workflow](fixtures/plugin/skills/workflow-write-dev-documentation/SKILL.fixture.md),
[documentation Handbook](fixtures/plugin/skills/handbook-documentation/SKILL.fixture.md),
and [consumer observations](fixtures/plugin/consumer-observations.md). Permit
read-only traversal of their complete fixture tree and require every fixture
file to be inspected before the route map is finalized. The slice uses the final
`workflow-` and `handbook-` naming model and intentionally contains direct,
same-Workflow-reference, complete-fragment, incomplete-fragment, Catalog-only,
test-only, and Knowledge-to-Knowledge routes.

Before dispatch, copy the two replay-only `SKILL.fixture.md` sources to their
corresponding canonical `SKILL.md` paths in the isolated task workspace and omit
the replay-only filenames there. This reconstructs the installed entrypoint
shape without registering fixture Skills as maintained-content targets in the
repository checkout.

Supply the complete current covered verification sources as required guidance,
but keep this case, its expected behavior, prior attempts, and evaluator
conclusions private. Use a fresh supported lower-capability model with the
expanded executor guard, read-only access, and a six-minute allowance. Record
the tested source snapshot, model and configuration, files and sections read,
the complete report, and available action observations.

## Expected behavior

- R1 (critical): classify `workflow-write-dev-documentation` as an execution
  Workflow with decisions, actions, output, failure handling, and completion.
  Classify `handbook-documentation` as required-reading selection only. Do not
  require the Handbook to contain a primary workflow or completion gate, and
  recognize that every matching Handbook package is cumulative.
- R2 (critical): identify the direct Workflow and Handbook routes to
  `maintained-document-quality.md`, the explicit Workflow-reference route to
  `delivery-evidence.md`, the direct Handbook fragment route to
  `route-review.md`, and the direct conditional Handbook route to
  `current-renderer.md`. Record the consuming step or package and when it must
  be read.
- R3 (critical): reject the Catalog, the Workflow's `tests/` link, and the link
  from one Knowledge leaf as installed runtime consumers. Report
  `catalog-only.md`, `test-only.md`, and `knowledge-only.md` as lacking a valid
  installed Workflow or Handbook route.
- R4 (critical): judge `route-review.md#complete-route-assessment` sufficient
  because it contains its definitions, decision, and exception. Judge
  `delivery-evidence.md#acceptance` insufficient because its required premises
  live outside the linked section. Treat file-level reachability as only the
  first check and propose a complete reading unit rather than inventing a new
  authority.
- R5: distinguish the available static paths from the supplied observations.
  Attribute selection, file or section reads, and application only to events
  actually recorded for those runs. Do not claim that a Catalog entry, link,
  or reachability result proves that an Agent selected, read, or applied the
  material.
- R6: retain the Catalog as inventory and type authority. Apply evergreen
  reasoning and applicability review to evergreen leaves and current-fact or
  evolving-dependency review to `current-renderer.md`; do not use the Catalog's
  `When to Read` text as a runtime consumer route.

## Verification

Use the application dispatch template with the current verifier sources and
fixture inputs, without supplying this case file. Inspect the returned route
map, responsibility classifications, fragment judgments, findings, and claims
about observed behavior. Give the capable reviewer this contract, exact final
sources and fixtures, source/model identity, and raw report without the
coordinator's verdict. Judge every criterion independently and include case
value and organization in that same review.

For rubric calibration, a controlled faulty report that requires a Handbook
workflow, treats Catalog or test links as runtime consumers, accepts the
incomplete fragment, or infers reading from static reachability must fail the
corresponding criterion. The controlled copies are judge inputs, not
additional Agent executions.

## Source

GitHub issues #242 and #250 require the existing semantic verifiers to review
the final Workflow, Handbook, Knowledge, and reference responsibilities and
their real reading routes without changing the verification architecture. This
case reconstructs the accepted final-candidate distinctions and requires fresh
cross-model evidence.
