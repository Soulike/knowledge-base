# Executable selection and PATH

## Scope

This document defines how application and automation code ensures that an
external command runs the required program while keeping temporary changes to
its lookup environment local to the operation.

## When to update

Update this document when evidence about command lookup, environment
inheritance, or tool activation changes how an operation can establish and
verify the program it runs without altering the caller's environment.

## Establish which program must run

When correctness depends on a particular installation or version, make that
requirement part of the invocation contract. A tool being installed or an
activation command succeeding does not establish that a later command name
will resolve to it.

`PATH` supplies directories for executable lookup. Its inherited contents and
order may reflect the user's other tools. A selected tool's directory can be
present while an earlier directory still supplies the same command name.
Directory membership alone does not establish the required priority.

Use the lookup rules of the actual execution interface. `PATH` controls only
part of lookup: shells can also resolve aliases or functions before external
programs, as documented by [Bash](https://www.gnu.org/software/bash/manual/html_node/Command-Search-and-Execution.html)
and [PowerShell](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_command_precedence).

## Control lookup for the operation

Use an explicit path to the required executable, or establish the required
`PATH` order in the operation's execution environment. If the selected
directory already appears later, give it the needed priority rather than
skipping the adjustment because it is present. When adjusting an inherited
search path, preserve unrelated entries unless the operation's contract calls
for a replacement search environment.

An explicit path controls that invocation. A wrapper, script interpreter, or
child command may look up another program by name. Carry the required lookup
environment to those calls too; selecting the first executable does not select
every later one. Process-launch APIs can differ in how they perform lookup and
apply a supplied environment, so verify their contract rather than assuming
shell behavior. [Python's subprocess documentation](https://docs.python.org/3/library/subprocess.html#subprocess.Popen)
illustrates these platform-dependent lookup differences.

For example, a build selects SDK B, but a custom directory containing another
`compiler` remains earlier in `PATH`. Successful activation and B's presence
in the path are insufficient. The build can invoke B's compiler by its explicit
path, or move B's directory ahead for the build and its dependent commands.

## Keep temporary changes local

Scope tool activation and lookup adjustments together. Prefer supplying a
child-process environment or running activation and invocation in an isolated
process or subshell, so the caller's environment is unaffected.
[Bash's execution-environment rules](https://www.gnu.org/software/bash/manual/html_node/Command-Execution-Environment.html)
describe this isolation for subprocesses and subshells.

When the operation must change the caller's environment, restore the original
values, including whether a variable was unset, on success, failure, and early
returns. Resetting to a default or deactivating a tool does not by itself
restore the state that existed on entry.

## Observe execution

Verify that the program actually executed satisfies the operation's selection
requirements. Check its version or installation identity only when the
contract depends on those properties. Neither activation output nor a
constructed `PATH` proves which program runs. If the operation cannot establish
its required selection, stop dependent work and report the mismatch.

Protect this behavior with an earlier conflicting executable, including a case
where the selected directory already appears later in `PATH`. Observe which
program runs, using a distinct output or effect, rather than only asserting the
constructed path. Exercise downstream lookup when the operation relies on it,
and verify that temporary adjustments leave the caller's environment unchanged
after both successful and failed work.
