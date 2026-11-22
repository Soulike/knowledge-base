# Path-length compatibility

## Scope

This document defines how to assess and test path-length compatibility for
pathname-based filesystem operations across supported platforms and consumers.
It owns complete-path and component limits, path growth across roots and output
layouts, operation-scoped compatibility settings, and evidence for successful
operation, deliberate rejection, and cleanup.

## When to update

Update this document when supported operating systems, filesystems, runtimes,
or tools change their path-length limits, accepted pathname forms, or long-path
opt-ins, or when an observed failure exposes an unhandled path-growth,
consumer-compatibility, cleanup, or verification case.

## Assess long-path behavior for every pathname-based operation

Whenever an operation creates, opens, inspects, copies, moves, extracts, or
removes filesystem entries through pathnames, assess path-length compatibility
and protect the required behavior with tests. This assessment belongs in design
and review before a long-path failure has been reported.

Define the admitted pathname inputs, supported environments, participating
consumers, and required outcomes. Paths within the supported contract must
complete the required operation; paths outside it need deliberate rejection
and the required cleanup. Place regression protection at the boundary that owns
path construction, admission, or compatibility policy so its callers share the
same protection.

## Evaluate the complete paths delivered to each consumer

A relative pathname or a successful operation beneath a short root does not
establish that the same entry remains usable elsewhere. Account for the actual
root, separators, temporary and staging directories, nested outputs, generated
names, backup suffixes, and rollback locations at every materialization point.
When targeting another revision or payload, inspect its admitted paths rather
than using the current checkout as the inventory. Dependency installation and
build steps can introduce additional paths beyond that inventory.

Check both whole-path and component limits using the representation and units
the consumer actually accepts. A shorter root can reduce total path length but
cannot repair an overlong filename component. Treat length calculations as
preflight evidence; they do not prove that the real consumer can use the path.

## Verify every participating consumer

Operating-system APIs, language runtimes, version-control tools, shells,
package managers, archive libraries, native programs, and cleanup utilities
can have different pathname capabilities on one machine. Establish each
required consumer's supported path forms, limits, and opt-ins. One consumer's
successful operation does not transfer its capabilities to the next.

For example, [Microsoft's Windows path-length documentation](https://learn.microsoft.com/en-us/windows/win32/fileio/maximum-file-path-limitation)
describes traditional `MAX_PATH` limits, extended-length pathname forms, and
the system configuration and application opt-in required to remove that limit
for affected Win32 functions. Component limits remain relevant, and the shell
can differ from filesystem APIs. There is no universal compatibility check
equivalent to comparing a language string's length with 260.

[Git for Windows](https://gitforwindows.org/git-cannot-create-a-file-or-directory-with-a-long-path.html)
documents that long-path support is disabled by default and that
`core.longpaths` enables it for C-based Git commands; scripted commands can
still fail. That option establishes no compatibility promise for a package
manager, build tool, runtime, or separate cleanup utility.

## Carry compatibility policy through cleanup and rollback

Scope application-owned compatibility options to the operation instead of
requiring changes to global user or machine configuration. Git's
[`-c <name>=<value>` option](https://git-scm.com/docs/git#Documentation/git.txt--cnamevalue)
supplies configuration for one invocation. When an application relies on
`git -c core.longpaths=true`, apply that policy to every owned Git invocation
that needs it, including creation and removal.

When any required consumer remains incompatible, select a supported shorter
root owned by the application or reject the operation before publishing
partial state as the result. Preflight known constraints before materializing
paths; later dependency or generated-output failures still require cleanup of
operation-owned staging state. Verify the cleanup path's compatibility too.
Preserve the failing stage and underlying diagnostic so a path failure can be
attributed to its actual consumer.

## Protect the compatibility contract with tests

Select cases from the supported inputs, root policy, consumers, and failure
behavior. Exercise representative long paths near the relevant supported
boundary, including required prefix and suffix growth. Cover:

- successful creation, access, and removal through the owning operation;
- a root change that makes an otherwise unchanged relative path longer;
- deliberate rejection or a supported shorter-root choice when a required
  consumer cannot accept the path; and
- cleanup and rollback after a later stage fails, including any independently
  configured cleanup consumer.

Assertions should observe the required outcome and resulting filesystem state.
Apply [Test effectiveness](../software-testing/test-effectiveness.md): a
regression test should detect a realistic loss of compatibility, such as a
missing required option, incorrect root construction, or incompatible cleanup.
An option-forwarding test can protect the application's invocation contract,
while successful native path handling requires evidence beyond the argument
list.

For host- or tool-dependent claims, apply
[Trustworthy test execution](../software-testing/trustworthy-test-execution.md):
exercise the production integration with the real component on the supported
platform. Record the platform, relevant tool versions, pathname form, root,
and exercised lifecycle. A simulated Windows value or a passing run elsewhere
does not establish Windows behavior. Report unavailable platform evidence as
unverified.

For example, an updater's checkout works beneath a short root, while its
temporary worktree adds enough prefix to cross a Git for Windows default path
limit. Its tests should exercise the target paths beneath the actual staging
root, verify required Git options at the owned invocation boundary, and obtain
Windows evidence for real worktree creation, required use, and removal. A
forced later-stage failure should also verify cleanup. Each subsequent package
or build tool needs its own applicable compatibility evidence before the
updater can claim that the complete workflow supports those paths.
