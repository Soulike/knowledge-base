---
name: handbook-software-engineering
description: Use when software work requires reasoning about behavior, state or effect contracts, source code, APIs, architecture, runtime design, or the semantic change set between revisions, including during review or test design.
---

# Software engineering Handbook

This Handbook supplies required understanding for software-engineering work. It
selects reading rather than owning the user's task. Treat the guidance as
supplemental to instructions, requirements, Skills, and project-specific
decisions in the active working directory.

## Select the required reading

1. Resolve every link relative to this `SKILL.md`.
2. For primary code or developer-facing API work, read the complete foundation
   before making dependent design, implementation, diagnosis, or review
   decisions. A direct learning or explanation request about one foundation
   subject may read its matching unit without loading the rest of the
   foundation when no software artifact work is present.
3. Evaluate every conditional package from the observable work and current
   materials. Read every matching package cumulatively; do not choose only the
   closest match. A direct learning or explanation request about a package's
   subject also matches that package without automatically loading the general
   code-work foundation.
4. Reuse a reading unit that is already loaded, current, and available. Read it
   again when its content changed or after recovery or compaction when its
   necessary basis can no longer be established.
5. Re-evaluate this Handbook and all package conditions when the task phase,
   language, platform, artifact, production method, or available reading basis
   changes. Add newly required reading before dependent work.

This Handbook has no dependency on another Handbook. Continue the user's task
under the applicable Workflow or active-project process after loading and
applying the required understanding.

## Foundation for code work

For developing, maintaining, restructuring, reviewing, or diagnosing software
code or developer-facing APIs, read these complete documents:

- [Meaningful names in code](../../knowledge/programming/meaningful-naming.md)
- [Understandable function interfaces and decomposition](../../knowledge/programming/function-design.md)
- [Source-code layout for reading](../../knowledge/programming/source-code-layout.md)
- [Exhaustive branching over finite variants](../../knowledge/programming/exhaustive-branching.md)
- [Failure signals and handling in code](../../knowledge/programming/failure-signals-and-handling.md)

From the module-responsibility document, read the Scope and each complete
section below, including all of their subsections:

- [Scope](../../knowledge/software-design/module-responsibility-and-defensive-scope.md#scope)
- [Organize a module around owned meaning](../../knowledge/software-design/module-responsibility-and-defensive-scope.md#organize-a-module-around-owned-meaning)
- [Distinguish the module, interface, seam, and adapter](../../knowledge/software-design/module-responsibility-and-defensive-scope.md#distinguish-the-module-interface-seam-and-adapter)
- [Diagnose cohesion before splitting](../../knowledge/software-design/module-responsibility-and-defensive-scope.md#diagnose-cohesion-before-splitting)
- [Choose what an interface exposes](../../knowledge/software-design/module-responsibility-and-defensive-scope.md#choose-what-an-interface-exposes)
- [Design for local change, testability, and replacement](../../knowledge/software-design/module-responsibility-and-defensive-scope.md#design-for-local-change-testability-and-replacement)
- [Measure depth by caller leverage](../../knowledge/software-design/module-responsibility-and-defensive-scope.md#measure-depth-by-caller-leverage)

Treat the Scope and the six following sections as two noncontiguous reading
units: the module document's intervening `When to update` section is outside
this foundation. Every section after `Measure depth by caller leverage` is also
outside the foundation. Read those excluded sections only when another
applicable package requires the complete file.

## Conditional required-reading packages

### Components and composition

When planning, evaluating, or restructuring software components and their
composition, or directly learning or explaining that subject, read these
complete documents:

- [Module responsibility and defensive scope](../../knowledge/software-design/module-responsibility-and-defensive-scope.md)
- [Application composition](../../knowledge/software-design/application-composition.md)

The complete module document satisfies the foundation's section-level reading;
do not reread those sections separately when the full file is already current
and available.

### Features and externally observable operations

When developing or maintaining a user feature, API, externally observable
operation, or background task, or directly learning or explaining their failure
and recovery behavior, read these complete documents:

- [Failure and recovery in externally observable operations](../../knowledge/software-design/operation-failure-and-recovery.md)
- [Communicating failures to users and API consumers](../../knowledge/software-design/user-facing-failure-communication.md)
- [Diagnostic evidence for failed operations](../../knowledge/software-design/failure-diagnostic-evidence.md)

### Asynchronous and concurrent behavior

When working with asynchronous or concurrent behavior, or directly learning or
explaining its lifecycle and coordination, read these complete documents:

- [Cancellation of asynchronous operations](../../knowledge/software-design/asynchronous-operation-cancellation.md)
- [Shared-state concurrency](../../knowledge/software-design/shared-state-concurrency.md)
- [Admitting overlapping mutations](../../knowledge/software-design/overlapping-mutation-admission.md)

### Human authorization

When designing, implementing, testing, or reviewing an approval, consent,
confirmation, or preview-before-effect flow, or directly learning or explaining
software authorization by a human decision, read
[Human decisions that authorize software effects](../../knowledge/software-design/human-decision-authorization.md)
in full.

### Source-change comparisons

When designing, implementing, reviewing, or diagnosing a pull-request or
Git-revision comparison used by a script, workflow, review, or analysis, or
directly learning or explaining which revisions answer that comparison, read
[Git change-comparison
semantics](../../knowledge/git/change-comparison-semantics.md) in full.

### External commands

When calling command-line tools from code, migrating shell behavior into a
language runtime, or directly learning or explaining those choices and lookup
environments, read these complete documents:

- [Runtime APIs and external commands](../../knowledge/software-design/runtime-apis-and-external-commands.md)
- [Executable selection and PATH](../../knowledge/software-design/executable-selection-and-path.md)

### GitHub API permissions

When integrating with the GitHub API and choosing or diagnosing operation
permissions, or directly learning or explaining those permissions, read
[GitHub Actions permissions](../../knowledge/github-actions/permissions.md) in
full.
