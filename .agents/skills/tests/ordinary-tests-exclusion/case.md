# Keep ordinary code tests outside knowledge-base authoring

## Identity

- ID: ordinary-tests-exclusion
- Kind: selection

## Covered objects

- [Case-maintenance Skill](../../maintain-knowledge-base-tests/SKILL.md)
- [Content-maintenance Skill](../../maintain-knowledge-base/SKILL.md)

## Protected behavior

Knowledge-base authoring workflows must not take ownership of an ordinary
downstream code-test request. Protect this adjacent negative route while allowing
a suitable general test-writing workflow to be chosen.

## Task

给业务模块新增一个 Node 单元测试，保护刚修复的订单状态错误。

## Starting state

Build the same complete current authoring and primary-product Skill metadata set
as for a natural selection task: `.agents/skills/*/SKILL.md` and
`knowledge-base/plugin/skills/*/SKILL.md`. Supply no candidate bodies. Request
selection only, with no code edits. Record inherited instructions and candidate
construction.

## Expected behavior

- R1 (critical): neither knowledge-base authoring Skill owns this request.
- R2: choose a relevant general test-writing workflow when present in the actual
  candidates, with a reason tied to the business-module task.
- R3: report a choice without claiming client loading or completed code work.

## Verification

Capture JSON `owner` and `reason`. Judge R1 from the actual identifier and R2
from the real candidates plus the request. Use the positive case-only routing
case as a separate control so an empty or broken candidate set cannot establish
useful exclusion evidence.

A faulty observation assigning this request to case maintenance must fail R1.

## Source

The maintainer-approved boundary keeps this authoring Skill distinct from
ordinary automated testing. This request is recovered from the 2026-11-07 fresh
positive/negative selection observations at commits `c6e796a` and `201e279`.
Re-run it against current metadata; earlier successful exclusion is provenance.
