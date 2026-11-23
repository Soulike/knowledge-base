# Enforce cross-artifact parity by exclusion rather than allowlist

## Identity

- ID: cross-artifact-parity-assertions
- Kind: application

## Covered objects

- [Automated-testing management Workflow](../../skills/workflow-manage-automated-tests/SKILL.md)
- [Test effectiveness](../../knowledge/software-testing/test-effectiveness.md)

## Protected behavior

When designing an automated parity test for variant artifacts whose contract
requires everything to remain identical except a bounded set of documented
differences (`serviceName` and `endpoint`), the Agent must read
[Test effectiveness](../../knowledge/software-testing/test-effectiveness.md),
avoid an allowlist of known shared keys (which silently misses newly added
shared fields), validate the required excluded paths, strip only those
justified difference paths, and assert structural equality across the remaining
governed fields and surrounding body—while permitting legitimate edits to the
excluded differences and tolerating valid parser/test-framework choices.

## Task

A deployment template was split into two variant files,
[variant-a.md](fixtures/variant-a.md) and
[variant-b.md](fixtures/variant-b.md). By project requirement, both variants
must remain identical in all configuration options and Markdown instructions
except for `serviceName` and `endpoint`, which are required on both variants
and intentionally differ between them. Downstream deployment tooling reads both
files as authoritative inputs and assumes any shared option or runbook text
stays synchronized.

In a read-only planning mode (do not edit repository files or run commands),
design the automated test and provide the complete test code (Node.js/TypeScript
or equivalent) to enforce this parity contract. State:

1. Which contract requirement the test protects and what it does not protect;
2. How the test parses and compares the two files, including how `serviceName`
   and `endpoint` are handled; and
3. What realistic change must make the test fail and what permitted change
   must leave it passing.

## Starting state

Supply the complete current
[Automated-testing management Workflow](../../skills/workflow-manage-automated-tests/SKILL.md),
its
[Write effective tests](../../skills/workflow-manage-automated-tests/references/write-effective-tests.md)
reference, read-only access to its linked canonical Knowledge files under the
plugin snapshot, and the two fixture files
[variant-a.md](fixtures/variant-a.md) and
[variant-b.md](fixtures/variant-b.md). Keep the task read-only.

## Expected behavior

- R1 (critical): read
  [Test effectiveness](../../knowledge/software-testing/test-effectiveness.md)
  before finalizing the test design.
- R2 (critical): establish why synchronization is required from the stated
  downstream consumer requirement, and note that parity alone does not detect a
  defect shared identically by both variants.
- R3 (critical): do not verify parity by enumerating an allowlist of known
  shared fields (such as `["timeout", "retries", "permissions"]`); instead,
  parse both artifacts structurally, validate that the required excluded paths
  (`serviceName` and `endpoint`) are present on both variants, remove or mask
  only those two paths, and assert deep structural equality across the entire
  remaining frontmatter object and equality on the remaining Markdown body.
- R4 (critical): identify that adding a new unshared field (or modifying the
  Markdown body) on only one variant must fail the test, while changing
  `serviceName` or `endpoint` on either variant must leave the test passing.
- R5: keep the task read-only without modifying repository files.

## Verification

Inspect files read, the test design explanation, and the complete proposed test
code. A faulty observation that checks only an allowlist of shared keys, omits
presence validation for `serviceName`/`endpoint`, omits the Markdown body from
comparison, or treats parity as proof that shared values are semantically
correct must fail the corresponding critical criterion.

## Source

Derived from [GitHub issue #300](https://github.com/Soulike/knowledge-base/issues/300)
and the parity-assertion guidance added to
[Test effectiveness](../../knowledge/software-testing/test-effectiveness.md).
This is newly authored protection requiring fresh validation against the
current Knowledge and Workflow.
