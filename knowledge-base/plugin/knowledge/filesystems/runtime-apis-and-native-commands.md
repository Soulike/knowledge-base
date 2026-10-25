# Runtime filesystem APIs and native commands

## Scope

This document explains the filesystem-specific API choices and host semantics
needed when selecting a runtime filesystem API or a native utility for a
filesystem effect. It owns the pathname, permission, and resource-identity
limits that remain after selecting the invocation interface.

## When to update

Update this document when runtime filesystem capabilities, native utility
invocation contracts, or observed cross-platform command behavior changes the
choice or its limits.

## Select the filesystem operation

Apply [Runtime APIs and external commands](../software-design/runtime-apis-and-external-commands.md)
to the required filesystem effect: prefer the runtime operation when its
semantics fit the supported hosts. A structured pathname argument avoids
utility-option interpretation while leaving filesystem behavior dependent on
the operation and platform.

For example, Node.js offers [`fsPromises.chmod(path, mode)` and
`filehandle.chmod(mode)`](https://nodejs.org/api/fs.html) for changing file
permissions, while Python offers
[`os.chmod(path, mode)`](https://docs.python.org/3/library/os.html#os.chmod).
These APIs avoid handing an option-like pathname to a `chmod` command. Choose
the pathname or handle form according to the operation's identity requirement,
and verify availability and permission semantics on the supported hosts.

## Verify a retained native utility

When retaining a native filesystem utility, verify its exact pathname grammar,
metadata effect, and error behavior on each supported host. A flag or option
terminator accepted by one implementation may have a different position or
meaning in another; an option-like pathname must still reach the intended
filesystem object as an operand.

## Preserve identity and permission requirements

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
