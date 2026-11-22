# Runtime filesystem APIs and native commands

## Scope

This document explains the filesystem-specific API choices and host semantics
needed when selecting a runtime filesystem API or a native utility for a
filesystem effect. It owns the pathname, permission, and resource-identity
limits that remain after selecting the invocation interface.

## When to update

Update this document when runtime filesystem capabilities, native utility
invocation contracts, or observed cross-platform command behavior changes the
choice, pathname transfer, or its limits.

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

## Preserve pathname data between consumers

A pathname can change before any filesystem lookup if an output parser or API
interprets its characters differently. Select the producer's documented
machine-readable format and follow its encoding, escaping, and record
boundaries. Prefer NUL-delimited pathname fields when the producer supports
them and they fit the admitted pathname forms. A delimiter separates records;
it does not by itself establish the encoding or interpretation of their fields.

For example, [`git worktree list --porcelain -z`](https://git-scm.com/docs/git-worktree)
uses NUL rather than newline terminators. Parse the documented attributes and
record separators instead of treating every line as one pathname. This keeps
a newline inside a pathname from becoming a record boundary.

Remove only the terminators and formatting that the selected format declares.
Generic whitespace trimming can alter a valid pathname: `project ` and
`project` can name distinct directories on a supported host. Preserve the
pathname field through parsing and subsequent calls rather than repairing it
with trimming or separator replacement.

Verify the receiving API's pathname grammar as well as the producer's format.
Disabling wildcard expansion does not establish that separators retain their
native filesystem meaning. PowerShell's
[`Test-Path -LiteralPath`](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/test-path#-literalpath)
avoids wildcard interpretation, but its
[Unix cmdlets accept both slash forms as directory separators](https://learn.microsoft.com/en-us/powershell/scripting/whats-new/unix-support).
A literal backslash in a Unix filename can therefore be interpreted as a
separator by a cmdlet. Select an API whose grammar supports the admitted names;
do not infer equivalence from another API finding the directory.

Protect admitted pathname forms with round-trip and real operation tests at
the owning boundary. Where the supported host permits them, include names
containing newlines, literal backslashes, and trailing spaces. Assert that the
parsed value is unchanged and that the subsequent operation reaches the
intended entry. Include a distinct existing sibling when testing a transformation
such as trimming, so an existence-only assertion cannot conceal wrong-target
access. Obtain evidence on each supported host whose semantics matter; a
passing run elsewhere does not establish that host's behavior.

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
