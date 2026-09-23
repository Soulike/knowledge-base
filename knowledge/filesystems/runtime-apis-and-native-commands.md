# Runtime filesystem APIs and native commands

## Scope

This document explains how to choose between a language runtime's filesystem
API and a native command-line utility for a filesystem effect. It owns the
additional interpretation boundary of command execution, the conditions for
preferring a structured API, and the precautions needed when a native command
remains necessary.

## When to update

Update this document when runtime filesystem capabilities, native utility
invocation contracts, or observed cross-platform command behavior changes the
choice or its limits.

## Prefer an operation the runtime already provides

When the runtime exposes an operation with the required semantics on the
supported platforms, use it directly rather than spawning a native utility.
The pathname remains an API value instead of becoming part of a command line.
A command adds executable lookup, utility-specific options and operands,
environment and locale effects, and exit-status handling. Constructing a shell
command also adds shell parsing and quoting. Removing that extra boundary
reduces compatibility work; it does not make the underlying filesystem
operation platform-independent.

For example, Node.js offers [`fsPromises.chmod(path, mode)` and
`filehandle.chmod(mode)`](https://nodejs.org/api/fs.html) for changing file
permissions, while Python offers
[`os.chmod(path, mode)`](https://docs.python.org/3/library/os.html#os.chmod).
These APIs avoid handing an option-like pathname to a `chmod` command. Choose
the pathname or handle form according to the operation's identity requirement,
and verify availability and permission semantics on the supported hosts.

## When a native command is necessary

Use a native utility when the runtime lacks the required operation or the
utility's behavior is itself part of the contract. Pass an argument vector
without constructing shell text where the runtime permits it. This removes
shell interpretation, but the utility still parses its own options and
operands. Do not assume that a flag or option terminator accepted by one
implementation has the same position or meaning in another. Verify the exact
utility grammar and error behavior on each supported platform whose behavior
the application promises.

Choosing a runtime API does not pin the object named by a pathname. When
separate observations and changes must concern the same object, use the
handle-bound and namespace safeguards described in
[Pathnames and filesystem resource identity](pathnames-and-resource-identity.md).
Likewise, changing permissions after writing sensitive bytes does not protect
their earlier exposure, and a later permission failure does not undo the
write. Establish creation, rewrite, and failure behavior from the application's
storage contract. When compatibility depends on host behavior, use the real
platform evidence required by
[Trustworthy test execution](../software-testing/trustworthy-test-execution.md);
an unavailable platform remains unverified.
