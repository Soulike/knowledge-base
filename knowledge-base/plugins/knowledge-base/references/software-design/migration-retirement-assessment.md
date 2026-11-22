# Migration retirement assessment

## Scope

This reference supplies the investigation, disposition, and completion procedure
selected by a consuming workflow when its task includes assessing artifacts as
migration obligations change or end. The workflow retains ownership of its
scope, authority, permitted edits, and user-visible result.

## When to update

Update this reference when a real migration assessment changes how affected
artifacts, obligation evidence, dispositions, verification, or completion must
be established within a consuming workflow.

## Establish the assessment

1. Identify the accepted task, current migration stage, supported target
   contract, obligation that changed, and sources establishing those facts.
   Discover the active project's requirements and paths. For a final assessment,
   account for obligations ended across the migration rather than only the
   last diff.
2. Apply
   [Module responsibility and defensive scope](../../knowledge/software-design/module-responsibility-and-defensive-scope.md#justify-responsibilities-throughout-staged-changes)
   to judge whether affected code and its arrangement remain justified.
   Apply
   [Test effectiveness](../../knowledge/software-testing/test-effectiveness.md#remove-spent-migration-scaffolding)
   when test protection or scaffolding is affected.
3. Trace related callers, dependencies, and support artifacts beyond the changed
   files. Inspect the tests, adapters, configuration, scripts, dependencies, or
   documentation that participate in the affected chain. Bound discovery by the
   changed obligation; record artifacts outside the task's edit authority
   without treating discovery as permission to change them.
   When the affected chain contains external command invocations, or the stage
   moves shell automation into a language runtime, read
   [Runtime APIs and external commands](../../knowledge/software-design/runtime-apis-and-external-commands.md)
   to assess the required capabilities and whether the command interfaces
   remain justified before assigning dispositions.

## Decide and apply dispositions

1. For each affected artifact, record its role, requirement or obligation,
   supporting evidence, and a disposition: retain, remove, simplify, relocate,
   or unresolved. For retention, identify why both the capability and its
   arrangement remain justified. For relocation, identify the current semantic
   owner. For unresolved obligations, preserve the artifact and name the missing
   evidence or decision.
2. Pass the dispositions to the consuming workflow's decision and mutation
   gates. Apply only authorized changes. A scoped test review or feedback batch
   can report a production finding without acquiring authority to edit that
   code or finish the surrounding migration.
3. Verify the actual result at the relevant owned seams and project-declared
   entrypoints. Confirm that retired paths and support no longer remain in the
   affected chain and that retained contract protection still executes. When
   cleanup is only proposed, partially applied, interrupted, or unverified,
   report that state rather than treating the disposition as completed work.

## Reassess and complete

Repeat the applicable assessment when a stage changes or ends an obligation,
and perform a final pass before reporting the migration complete. Re-observe
affected artifacts and requirements after an interruption or changed stage
instead of relying on earlier dispositions.

Report each disposition, its evidence, changes actually verified, unresolved
obligations, and any task-authority boundary. An assessment-only or narrower
task can finish its own result with that account while identifying remaining
migration work. When the accepted task owns migration cleanup or completion,
it remains incomplete for required cleanup that is outside its authority,
unresolved, unfinished, or unverified. Declaring the migration complete requires
completing related cleanup established to be necessary and resolving affected
obligation decisions. A follow-up issue or a plan to clean up is not completion
evidence.
