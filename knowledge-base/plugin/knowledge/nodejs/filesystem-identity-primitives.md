# Node.js filesystem identity primitives

## Scope

This document maps the filesystem identity invariants in [Pathnames and filesystem resource identity](../filesystems/pathnames-and-resource-identity.md) to the documented Node.js `node:fs` and `node:fs/promises` APIs. It owns `FileHandle` use, handle lifetime, open flags, error boundaries, atomic pathname primitives, and the absence of directory-relative APIs in Node.js; the general invariants, operating-system guarantees themselves, and application-specific storage rules are outside its scope.

## When to update

Update this document when a supported Node.js release changes `FileHandle`, explicit resource management, filesystem constants, streams, error behavior, or the availability of directory-relative operations such as `openat`, or when supported operating systems expose materially different behavior through these APIs.

## Keep identity-sensitive work on one `FileHandle`

`fsPromises.open()` returns a `FileHandle`, which wraps a numeric file descriptor. Once a file is open, use that handle for every fact or effect that must apply to the same file:

- `filehandle.stat()` instead of a later `stat(path)`;
- `filehandle.read()`, `filehandle.readFile()`, or `filehandle.createReadStream()` instead of reopening the path;
- `filehandle.chmod()` instead of `chmod(path)`; and
- metadata derived from the same handle that will supply the bytes.

Design identity-sensitive interfaces around ownership of the handle. Returning `{handle, metadata}` prevents a downstream caller from accidentally resolving the pathname again; returning `{path, metadata}` makes that regression easy. Document whether the caller must close the handle or transfers it to a stream that will close it.

A minimal ownership pattern is:

```ts
import { open } from "node:fs/promises";

const handle = await open(candidatePath, flagsForTheTargetPlatform);
try {
  const stats = await handle.stat();
  if (!stats.isFile()) throw new Error("expected a regular file");
  const bytes = await handle.readFile();
  // Use facts and bytes from this handle.
} finally {
  await handle.close();
}
```

Where the JavaScript runtime and toolchain support explicit resource management, `await using handle = await open(...)` invokes `filehandle[Symbol.asyncDispose]()` at scope exit. Do not rely on Node.js garbage collection to close a leaked handle. When ownership crosses a scope or enters a stream, make the transfer and the stream's `autoClose` policy explicit.

## Select flags and validate after opening

Numeric flags from `fs.constants` expose operating-system facilities; their availability and behavior are platform-specific.

On POSIX systems, `O_NOFOLLOW` refuses a symbolic link only in the final pathname component. Earlier components can still be links, so this flag does not secure a mutable parent directory. `O_NONBLOCK` can prevent an open of a planted FIFO from waiting for another endpoint, but it does not prove that the opened object is a regular file. Inspect `await handle.stat()` and reject directories, devices, and other unexpected kinds before performing content work.

Choose the access mode needed by the handle operation rather than by the pathname operation. For example, changing mode through `filehandle.chmod()` is an identity-bound operation even when the handle was opened read-only on a platform that permits it.

Opening and validating a handle fixes which object subsequent handle calls address, but does not freeze its content. A `filehandle.stat()` size followed by `filehandle.readFile()` still needs an independent immutability or bounded-read guarantee when concurrent writers are possible. Also remember that `filehandle.readFile()` starts at the handle's current position; prior reads without an explicit position may change what it returns.

## Account for the parent-directory gap

As of the Node.js v26.7.0 API documentation, `node:fs` does not expose POSIX `openat`, `fstatat`, `renameat`, `linkat`, or `unlinkat` equivalents. On supporting POSIX platforms, Node.js can therefore open a full pathname with `O_NOFOLLOW`, but it cannot pin a directory handle and resolve the final name relative to that directory through the documented API.

On platforms where `dev` and `ino` are meaningful identities, rechecking a parent before and after opening a child can detect a replacement that persists, but it only narrows the race: a parent can be swapped for the open and restored before the recheck. State this residual explicitly. If the security boundary requires closing it, use a platform facility exposed through another trusted component or redesign so untrusted actors cannot mutate the parent namespace.

## Use pathname primitives for directory-entry effects

Node.js `link`, `rename`, and `unlink` operate on pathnames because the directory entry is the object being created, moved, or removed. Keep their check/use sequence as small as possible and prefer a primitive whose single operation enforces the needed conflict rule.

For example, an exclusive `open` using `O_CREAT | O_EXCL` can claim a new pathname, while `fsPromises.link()` can place a hard link and report `EEXIST` when the destination is already occupied on systems with the documented POSIX behavior. Hard links require compatible filesystem and platform support. A JavaScript mutex can serialize cooperating Node.js callers, but it does not protect against another process; keep the filesystem's atomic conflict check even when a mutex also protects quota or other process-local state.

## Classify filesystem errors narrowly

Node.js surfaces operating-system failures through error objects whose `code` values vary by operation and platform. Map only codes that the application has defined as an expected outcome. `ENOENT` can represent an absent path and `EEXIST` a naming conflict; failures such as `EACCES`, `EIO`, or an unsupported flag should normally remain operational errors rather than being laundered into “missing.”

The error from refusing a final symlink is also platform-dependent. Do not assume one code without verifying every supported operating system, and keep error classification separate from the post-open `stats.isFile()` type check.

## References

- [Node.js file system documentation](https://nodejs.org/api/fs.html)
- [Node.js `FileHandle`](https://nodejs.org/api/fs.html#class-filehandle)
- [Node.js file open constants](https://nodejs.org/api/fs.html#file-open-constants)
- [Node.js `fsPromises.open()`](https://nodejs.org/api/fs.html#fspromisesopenpath-flags-mode)
- [Node.js `filehandle[Symbol.asyncDispose]()`](https://nodejs.org/api/fs.html#filehandlesymbolasyncdispose)
