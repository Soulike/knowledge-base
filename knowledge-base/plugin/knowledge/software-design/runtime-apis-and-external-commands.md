# Runtime APIs and external commands

## Scope

This document defines how to choose between a runtime or platform API and an
external command for a required capability in application or automation code.
It owns the semantic-fit assessment, the costs of command interpretation and
execution, and the justification for retaining that interface when code is
introduced, reviewed, or migrated into a language runtime.

## When to update

Update this document when evidence from interface selection, command failures,
or automation migrations changes the criteria for semantic fit, command-boundary
cost, justified retention, or verification of the selected interface.

## Start from the capability

Identify what the operation must accomplish, who consumes its result or
effects, and which inputs, outputs, failures, lifecycle, performance, and
supported environments belong to that contract. Use inherited commands to
discover those requirements and integration points. Their presence in the old
implementation does not establish that the target design needs the same
executable or invocation structure.

Compare available runtime and platform APIs with the command against that
contract. Prefer a built-in API when it supplies the required semantics across
the supported environments and removes an unnecessary command boundary.
Verify semantic fit rather than matching an operation name: error behavior,
redirects, streaming, cancellation, resource ownership, and compatibility can
change the result. Preserve current requirements rather than every incidental
behavior of an inherited utility.

Removing an executable dependency does not establish portability. Check the
selected API's actual availability and behavior for the runtime versions and
platforms the application supports.

## Account for the command boundary

A command adds executable discovery, version and platform expectations,
utility-specific argument grammar, environment and locale inputs, process
lifetime, exit status, and interpretation of stdout and stderr. Constructed
shell text adds shell parsing and quoting. Pass an argument vector without a
shell where the execution interface permits it; the utility still interprets
its own options and operands.

These costs belong in the comparison even when an existing subprocess helper
makes invocation short. Conversely, a supported command can be the appropriate
interface when the runtime lacks the capability or required semantics, the
executable's behavior must itself be exercised, or the command is a justified
integration choice under the current operational and maintenance constraints.

Requiring a real external system does not by itself require its CLI. An API and
a command may both reach that system. Establish why the selected interface
satisfies the contract at an acceptable ownership cost rather than using the
system's existence as the command's justification.

## Keep retained execution with its owner

Keep command translation at the seam that owns the external contract. Use an
existing suitable boundary; introduce an adapter when it isolates a live
translation or source of change, following
[Module responsibility and defensive scope](module-responsibility-and-defensive-scope.md#keep-translation-and-policy-with-their-owners).
A separate wrapper for each invocation is not evidence of useful isolation.

Make executable availability, supported versions and hosts, argument and output
interpretation, relevant exit statuses, and diagnostic preservation explicit
where they affect callers. Account for output consumption and resource cleanup
as part of execution rather than treating a successful spawn as completion.

Define lifetime from the operation's contract. A bounded operation needs its
deadline to reach the work that can consume the budget; a deliberately
long-running process needs an owner and a shutdown condition. Apply
[Asynchronous operation cancellation](asynchronous-operation-cancellation.md)
to carry cancellation to the owned work and establish its required completion
before dependent cleanup or reuse. Requesting cancellation or sending a
termination signal does not establish that execution and effects have ended.

## Verify the selected semantics

Check both APIs and commands at the seam that owns the required behavior. For
an HTTP readiness operation, a deadline may need to cover connection, headers,
response-body consumption, and repeated attempts. If earlier work consumed the
remaining budget, do not start another attempt. Verify how the selected
interface interprets a computed timeout: zero, rounding, units, and defaults can
change an intended expiry into a different lifetime.

Preserve relevant diagnostics and test the required failure, cancellation, and
cleanup outcomes as well as success. When a compatibility claim depends on host
command or interpreter behavior, apply
[Trustworthy test execution](../software-testing/trustworthy-test-execution.md):
exercise the real supported integration on that platform and report unavailable
platform evidence as unverified.

For example, moving orchestration into a language runtime can replace separate
HTTP and structured-data utilities with runtime operations when their semantics
fit. A harness whose contract includes exercising an installed container CLI
retains that CLI and its real integration coverage. A harness concerned only
with daemon behavior must still compare interfaces; either choice needs a
current justification beyond surviving the shell implementation.
