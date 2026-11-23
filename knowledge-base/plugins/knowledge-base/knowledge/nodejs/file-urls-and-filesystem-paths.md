# Node.js file URLs and filesystem paths

## Scope

This document defines how Node.js code converts between `file:` URLs and
operating-system filesystem paths, when Node.js APIs accept a `URL` object
directly versus an explicit OS path conversion, why `URL.pathname` and raw URL
string concatenation fail, and what path-validation boundaries remain after
conversion. It also states the scope boundary for `import.meta.dirname` and
`import.meta.filename` when resolving paths relative to a `file:` ES module;
general ESM module-loader semantics, `FileHandle` identity primitives, and
generic filesystem race protection are outside its scope.

## When to update

Update this document when supported Node.js releases change `node:url`
conversion APIs (`fileURLToPath`, `fileURLToPathBuffer`, `pathToFileURL`),
change `<URL>` parameter support on core filesystem, module, or child-process
APIs, or change `import.meta.dirname` or `import.meta.filename` stability or
protocol restrictions.

## Never treat `URL.pathname` as an OS filesystem path

A WHATWG `URL` represents structured URL components rather than an
operating-system pathname. Reading `.pathname` on a `file:` `URL` (such as
`new URL('./cli.ts', import.meta.url).pathname`) produces broken filesystem
paths across ordinary inputs and platforms:

- **Percent-encoding stays encoded:** Spaces remain `%20` and non-ASCII UTF-8
  characters remain percent-encoded bytes (for example, `/%E6%B5%8B%E8%AF%95`),
  causing `ENOENT` or mismatched paths when passed to `node:fs` or child
  processes.
- **Windows drive letters keep a leading slash:**
  `new URL('file:///C:/repo/a.ts').pathname` yields `'/C:/repo/a.ts'`, which is
  not a valid Windows drive path.
- **Windows UNC hosts are lost:** `new URL('file://server/share/a.ts').pathname`
  yields `'/share/a.ts'`, silently dropping the `server` host component.

## Pass `file:` `URL` objects directly where `<URL>` is documented

Pass a `URL` object directly to Node.js APIs whose documented parameter
accepts `<URL>` for a filesystem path—such as `node:fs` and `node:fs/promises`
path parameters, `module.createRequire()`, and `child_process` `options.cwd`
(similarly, `new Worker()` accepts `file:` and `data:` `URL` objects):

```mjs
import { readFile } from "node:fs/promises";

const config = await readFile(
  new URL("./config.json", import.meta.url),
  "utf8",
);
```

`import.meta.url` itself is a `string`, not a `URL` object. For APIs whose
parameter accepts `<URL>` alongside OS-path strings (such as `node:fs`
`<string> | <Buffer> | <URL>` paths and `child_process` `options.cwd`
`<string> | <URL>`), passing `import.meta.url` directly treats it as a literal
OS path string rather than a `file:` URL; wrap relative references with
`new URL(..., import.meta.url)` or `new URL(import.meta.url)` (remembering that
`options.cwd` requires a **directory** `URL` such as
`new URL(".", import.meta.url)`—passing the module's own file URL fails with
a platform-dependent error such as `ENOTDIR` on POSIX or `ENOENT` on Windows). By contrast, `module.createRequire(filename)` explicitly accepts a
`file:` URL string directly (`createRequire(import.meta.url)`). Node.js
filesystem and `cwd` `<URL>` parameters accept only the `file:` scheme
(non-`file:` URLs fail), and passing a `URL` derived from untrusted input does
not bypass authorization or symlink/containment checks.

## Convert `file:` URLs to OS paths with `fileURLToPath()`

When an API or parameter requires an operating-system path string—such as the
executable or argument array of `child_process.execFile` or `spawn`,
`node:path` joins, logging and display, or third-party libraries expecting a
`string`—convert with `fileURLToPath(url[, options])` from `node:url`:

```mjs
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("./cli.mjs", import.meta.url));
execFile(process.execPath, [script]);
```

When a POSIX `file:` URL can contain percent-encoded byte sequences that are
not valid UTF-8, use `fileURLToPathBuffer(url[, options])` (added in Node.js
v24.3.0 / v22.18.0) instead of `fileURLToPath(url)` to obtain a raw `Buffer`
path—use it only with Node.js APIs that natively preserve `<Buffer>` pathnames
(such as `node:fs` path parameters), because child-process argument vectors
(`execFile` / `spawn` `args`) still require strings and cannot pass arbitrary
non-UTF-8 bytes verbatim.

**Security boundary:** Neither `fileURLToPath()` nor `fileURLToPathBuffer()`
is an authorization or traversal barrier. When a URL is parsed, the WHATWG URL
parser recognizes and resolves encoded dot segments (`%2e`, `%2e%2e`) into `.`
and `..`; `fileURLToPath()` and `fileURLToPathBuffer()` then operate on that
normalized pathname, where separator handling varies by converter and path mode
(`fileURLToPath()` rejects `%2F` on POSIX and `%2F`/`%5C` on Windows and
accepts `%5C` as a POSIX filename character, while `fileURLToPathBuffer()`
decodes percent-encoded bytes directly and can yield separator bytes in the
returned `Buffer`). When a `file:` URL comes from external or untrusted input,
enforce explicit path validation and containment checks on the converted path
before filesystem use, noting that lexical path checks alone do not establish
filesystem containment through symlinks.

## Convert OS paths to `file:` URLs with `pathToFileURL()`

Do not construct `file:` URLs by string interpolation (`` `file://${path}` ``),
`new URL(path)`, or `new URL(path, 'file:')`. On Windows, `new URL('C:\\repo\\a.mjs')`
interprets `C:` as a URL scheme; on all platforms, characters that are valid in
filenames behave as URL syntax—`#` and `?` split or truncate the pathname into
a fragment or query (for example, `new URL('/foo#1', 'file:').pathname` becomes
`'/foo'`), `%` is interpreted as a percent-escape prefix rather than a literal
character (altering decoding or failing on malformed escapes), and relative
paths are not resolved against the working directory.

Use `pathToFileURL(path[, options])` from `node:url` whenever an OS path must
become a `file:` URL—for example, passing an arbitrary filesystem path to
dynamic `import()`, constructing a `Worker` URL, or emitting a `file://` URI:

```mjs
import { pathToFileURL } from "node:url";

const moduleUrl = pathToFileURL(resolvedEntryPath).href;
const loaded = await import(moduleUrl);
```

`pathToFileURL()` interprets paths using the host operating system's rules by
default (or `options.windows`, added in Node.js v22.1.0 / v20.13.0, when
explicitly supplied) and resolves relative paths against the current working
directory. For the same reason, avoid calling
`new URL(untrustedSegment, import.meta.url)` with a dynamic filename that may
contain `#`, `?`, or `%`; resolve the path in OS pathname space (for example
with `node:path`) and convert with `pathToFileURL()` only if a `file:` URL is
needed.

## Boundary note on `import.meta.dirname` and `import.meta.filename`

In `file:` ES modules on Node.js v24.0.0 / v22.16.0+ (added in v20.11.0 /
v21.2.0), `import.meta.dirname` and `import.meta.filename` return OS paths
directly (with symlinks resolved on `import.meta.filename`), avoiding a `URL`
round-trip when no `URL` is otherwise needed. CommonJS cannot use
`import.meta`, and non-`file:` ES modules leave both `undefined`; use
`fileURLToPath(import.meta.url)` on older `file:` modules, or verify a `file:`
scheme before converting under custom loaders.

## References

- [Node.js `url.fileURLToPath()`](https://nodejs.org/api/url.html#urlfileurltopathurl-options)
- [Node.js `url.fileURLToPathBuffer()`](https://nodejs.org/api/url.html#urlfileurltopathbufferurl-options)
- [Node.js `url.pathToFileURL()`](https://nodejs.org/api/url.html#urlpathtofileurlpath-options)
- [Node.js `import.meta.url`, `import.meta.dirname`, and `import.meta.filename`](https://nodejs.org/api/esm.html#importmetaurl)
