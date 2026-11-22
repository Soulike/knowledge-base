# Pathnames and filesystem resource identity

## Scope

This document defines language- and runtime-independent invariants for filesystem operations that resolve a pathname and then validate the resolved object, check access to it, inspect or read it, mutate its contents or metadata, create, move, or remove directory entries, or roll back a prior effect while another actor can change the filesystem namespace. It owns the distinction between names and resource identity, handle-bound operations, access checks at the point of use, namespace mutation, coordination, rollback, and race-focused testing; runtime API mappings, filesystem-specific atomicity guarantees, general asynchronous programming, and application storage policy are outside its scope.

## When to update

Update this document when broadly available filesystem primitives change the identity or namespace guarantees an application can rely on, or when a real failure exposes an unhandled check/use race, stale path authorization, coordination boundary, rollback hazard, or testing technique within this scope.

## A pathname is a lookup, not an identity

A pathname tells the filesystem how to look up an object at the instant an operation resolves it. The same pathname can identify a different object on the next operation because a file, symbolic link, or parent directory was renamed, removed, or replaced. Conversely, an opened object can remain usable after its former name is removed or rebound.

Every pathname-based call performs another lookup. A successful `stat` or `lstat` therefore says what the name identified during that call; it does not prove that a later `read`, `chmod`, `rename`, or `unlink` using the same text will reach the same object. Checking a final component for a symbolic link also does not pin its parent components.

An asynchronous suspension makes such interleavings easy to see, but is not the cause. Another thread, process, tool, or host can change the namespace between two synchronous system calls as well. Define the competing actors before choosing a safeguard.

## Resolve once, then operate through the opened handle

When correctness requires several observations or effects to concern the same object, open it once, validate it through the resulting descriptor or handle, and keep the dependent work on that handle whenever the platform permits. Typical handle-relative operations include reading, streaming, inspecting metadata, and changing file metadata.

This rule also belongs at API seams. Return an opened handle together with facts measured from that handle rather than returning a pathname and metadata that invite the caller to open the name again. Assign explicit ownership of the handle so exactly one component is responsible for closing or transferring it.

An opened handle usually pins object identity, not an immutable content snapshot. Another writer that already has access may still change the bytes or length. A strict content or size invariant can additionally require immutability, locking, a snapshot, or a bounded streaming read. The initial open also still resolves a pathname. A directory-handle-relative operation can anchor that lookup to an opened parent; when the parent is a containment boundary, separately require a platform primitive that prevents escape.

## Check access at the point of use

A pathname returned by an earlier list, search, metadata, or preview response is still untrusted when a later request asks to read or mutate it. The client can alter the request, and the namespace or server-side resource set can change between responses. An earlier response proves what was visible then; it is not a reusable authorization grant.

Resolve the current comparison base, root, tenant, or other owning context through one server-side authority, compute the permitted resource set for that context, resolve the requested pathname under the same contract, and check whether the caller may perform the requested operation on the resolved object immediately before the content operation. List and per-resource operations must agree on this resolution contract rather than reconstructing it independently in different routes or clients.

Containment, file type, size, count, and content-classification limits belong at the boundary that performs the read or mutation. A caller may apply the same checks for earlier feedback, but those checks are defense in depth and cannot replace enforcement at the sink.

## Treat namespace mutation as a separate class of operation

Some effects intentionally operate on a directory entry rather than on the opened object. Creating a name, removing a name, and moving a name cannot in general be replaced with an operation on the file's handle.

Prefer directory-handle-relative APIs such as the POSIX `*at` family when available, because a relative pathname starts from an already-open directory without resolving that directory's former name again. Ordinary `*at` calls are not containment boundaries: an absolute pathname ignores the directory handle, while `..` components or symbolic links can escape it. When resolution must remain beneath a root, use a platform facility that enforces that property, such as Linux [`openat2()`](https://man7.org/linux/man-pages/man2/openat2.2.html) with `RESOLVE_BENEATH` or `RESOLVE_IN_ROOT`. Otherwise use a single kernel operation with the required atomic property, revalidate the parent as close to the mutation as possible, and record any race that remains. A check followed by a pathname mutation is not made atomic merely by shortening the interval between them.

Atomicity is operation-, platform-, and filesystem-specific. Exclusive creation, no-replace renames, and hard-link placement have different availability and cross-filesystem behavior. Verify the exact primitive on every supported local or network filesystem instead of transferring a guarantee from another environment.

## Match coordination to every competing actor

An in-process mutex coordinates only code that acquires that mutex. It is appropriate when all competing operations are owned by the same process, but it cannot exclude another process or an external tool that writes the same directory.

Use filesystem-enforced atomic operations for conflicts with actors outside the lock domain. For invariants derived from directory state, such as unique-name selection, file counts, or byte quotas, couple admission to the final namespace mutation: observe committed state and perform the commit within one coordination boundary. Counting a temporary file before it is committed, or checking quota outside the placement boundary, creates a second state that can drift from the namespace.

## Make rollback identity-aware

Cleanup and rollback run after the original operation has already failed or lost a race, so the original pathname is especially untrustworthy. Undo through the original handle when possible. If rollback must resolve a name again, carry enough identity and prior-state information to prove that the name still denotes the object changed by the forward operation.

Skip the undo when the original object is gone, the parent directory changed, or the name now denotes a replacement. A best-effort cleanup that modifies a replacement is worse than leaving the original side effect in place. Preserve the primary failure as well: cleanup failure should not silently replace the reason the operation was already failing unless the cleanup error is itself the required outcome.

## Test the interleaving, not its probability

Race regression tests should force the relevant ordering with a barrier, hook, or controlled replacement rather than launching concurrent work and hoping the scheduler exposes the gap. Insert the competing action after the last validation and before the path-based use that is under test.

Exercise at least these distinct cases when they are in scope:

- replace the final entry with another regular file or a symbolic link;
- rename a validated parent directory and put another directory or link at its old name;
- substitute a directory, FIFO, or device for an expected regular file;
- interleave two cooperating API operations that should be serialized; and
- change or remove the object before identity-aware rollback begins.

Assert the safety property at the public seam: the replacement or out-of-scope object was not read or modified, the committed result describes the object actually used, cleanup did not touch a new occupant, and every opened handle was closed.

## References

- [MITRE CWE-367: Time-of-check Time-of-use Race Condition](https://cwe.mitre.org/data/definitions/367.html)
- [Linux `open(2)` and `openat(2)`](https://man7.org/linux/man-pages/man2/open.2.html)
- [Linux `openat2(2)`](https://man7.org/linux/man-pages/man2/openat2.2.html)
- [Linux `unlink(2)` and `unlinkat(2)`](https://man7.org/linux/man-pages/man2/unlink.2.html)
