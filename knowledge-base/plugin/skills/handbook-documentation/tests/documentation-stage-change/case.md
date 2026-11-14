# Synchronize maintained software documentation

## Identity

- ID: documentation-stage-change
- Kind: application

## Covered objects

- [Documentation Handbook](../../SKILL.md)

## Protected behavior

Software-documentation maintenance requires general document quality and
software-specific authority, synchronization, and executable evidence together.
Protect that combined reading and the resulting guide, example, and source
explanation without loading accomplishment-report guidance. Different useful
wording and guide organization are permitted when they match current behavior.

## Task

A command-line option changed from `--cache` to `--cache-dir`. Update the
maintained setup guide, its executable example, and the affected source
docstring so they describe the current behavior. Verify the documented command.

## Starting state

Copy the [command implementation](fixtures/cache_tool.py) and
[old setup guide](fixtures/setup-guide.md) into a temporary project. The parser
implements the current option, while the guide and docstring still describe the
old one. Active project instructions assign CLI behavior to the parser and
require the maintained guide/example/docstring to agree with it. Permit writes
and command execution only in that project; preserve executable behavior.

Supply the complete current Documentation Handbook with its direct packaged
routes. Observe reading choices before Knowledge access. No accomplishment
report or later audience change is part of this task.

## Expected behavior

- D1 (critical): select and read maintained-document quality
  and software-development documentation through the Handbook's direct routes.
- D2 (critical): exclude accomplishment-report reading from this maintenance task.
- D3: synchronize the guide, executable example, and source explanation with
  current behavior and verify the documented command; preserve useful reader
  context rather than replacing tokens alone.

## Verification

Inspect selected/excluded packages, complete direct reads, the three maintained
artifacts, and actual execution of the documented command. A token replacement
that leaves an incorrect example or removes necessary usage context fails D3.

## Source

[GitHub issue #242](https://github.com/Soulike/knowledge-base/issues/242)
establishes domain package choice, direct reading, and application evidence.
[GitHub issue #247](https://github.com/Soulike/knowledge-base/issues/247)
distinguishes maintained guidance, software explanations, and accomplishment
reports. The maintainer split the combined case into this maintenance behavior
and [independent accomplishment reporting](../documentation-accomplishment-report/case.md).
This stable identity retains D1–D3; the reporting case retains D4–D5.
