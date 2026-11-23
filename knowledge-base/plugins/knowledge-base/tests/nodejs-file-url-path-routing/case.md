# Route and apply Node.js file URL and filesystem path conversions

## Identity

- ID: nodejs-file-url-path-routing
- Kind: journey

## Covered objects

- [Node.js Handbook](../../skills/handbook-nodejs/SKILL.md)
- [Filesystems Handbook](../../skills/handbook-filesystems/SKILL.md)
- [Node.js file URLs and filesystem paths](../../knowledge/nodejs/file-urls-and-filesystem-paths.md)

## Protected behavior

Node.js tasks converting between `file:` URLs and OS filesystem paths (including
`import.meta.url`-derived script or data paths, dynamic `import()` of arbitrary
OS paths, and untrusted `file:` URI handling) must route to the `file:` URL
Knowledge through every selected Handbook among `handbook-nodejs` and
`handbook-filesystems` without relying on `URL.pathname`, raw `file://` string
concatenation, or unvalidated `fileURLToPath()` outputs, while ordinary Node.js
OS-path `fs` tasks must not misroute into the `file:` URL package.

## Task

Handle these three independent requests:

1. Review a Node.js ES module test helper that locates a sibling CLI script
   using `const script = new URL('./cli.ts', import.meta.url).pathname` and
   passes `[script]` to `child_process.execFile(process.execPath, [script])`,
   while loading a JSON fixture next to the module via `fs.promises.readFile`.
   Identify every path- and URL-conversion failure mode across Linux, macOS, and
   Windows, and recommend the exact Node.js APIs for both calls.
2. Explain how to convert an arbitrary user-configured filesystem path into a
   `file:` URL for dynamic `import()` on Windows and POSIX, and what security
   boundary applies when converting an untrusted `file:` URI from an external
   client back to an OS path with `fileURLToPath()`.
3. Review a standalone Node.js script that calls
   `fsPromises.readFile('/var/log/service.log', 'utf8')` to inspect a service
   log file.

## Starting state

Construct the candidate selection set from the frontmatter of every direct
installed Skill entrypoint under
`knowledge-base/plugins/knowledge-base/skills/*/SKILL.md` in the tested
snapshot. Supply only registered names, descriptions, and paths for the initial
selection step before opening any Skill body. Record the Skill choices for all
three requests before permitting read-only access to the complete chosen Skill
bodies and their direct canonical Knowledge routes. Keep the three requests
independent and do not modify repository files.

## Expected behavior

- R1 (critical): select `handbook-nodejs` and `handbook-filesystems` natively
  for request 1 and request 3, and select `handbook-nodejs` (and optionally
  `handbook-filesystems`) natively for request 2. Co-selection of other
  applicable Skills (`handbook-javascript-typescript`,
  `handbook-software-engineering`, `handbook-documentation`,
  `workflow-manage-automated-tests`, `workflow-review-security`) is allowed.
- R2 (critical): inside every selected Handbook among `handbook-nodejs` and
  `handbook-filesystems`, match and read
  [Node.js file URLs and filesystem paths](../../knowledge/nodejs/file-urls-and-filesystem-paths.md)
  for requests 1 and 2, and exclude that package in both `handbook-nodejs` and
  `handbook-filesystems` for request 3 (while still selecting the applicable
  async/filesystem guidance for request 3).
- R3 (critical): for request 1, explain that `URL.pathname` keeps percent
  encoding intact (`%20`, UTF-8 bytes), retains a leading slash before Windows
  drive letters (`/C:/...`), and drops UNC hosts (`file://server/share/...`);
  recommend `fileURLToPath(new URL('./cli.ts', import.meta.url))` (or
  `join(import.meta.dirname, 'cli.ts')` when restricted to supported `file:` ES
  modules) for `execFile`, and passing `new URL('./...', import.meta.url)`
  directly to `fs.promises.readFile`.
- R4 (critical): for request 2, recommend `pathToFileURL(path).href` (avoiding
  `` `file://${path}` `` or `new URL(path, 'file:')` because of Windows `C:`
  scheme parsing, `#`/`?` fragment/query splitting, and `%` percent-escape
  interpretation), and state that URL parsing recognizes and resolves `%2e`/
  `%2e%2e` into `.`/`..` before/during conversion—so `fileURLToPath()` does not
  prevent directory traversal without explicit path validation and containment
  checks (without claiming blanket encoded-separator rejection across modes or
  converters).

## Verification

Inspect native Skill selection, post-body per-Handbook package choices and
canonical read evidence for every selected Handbook among `handbook-nodejs` and
`handbook-filesystems`, and the final response for each of the three requests
separately. A faulty observation that omits `handbook-nodejs` on request 1 or 2,
loads [Node.js file URLs and filesystem paths](../../knowledge/nodejs/file-urls-and-filesystem-paths.md)
for request 3, recommends `.pathname` or raw `file://` concatenation, or claims
`fileURLToPath()` prevents directory traversal must fail the corresponding
critical criterion. Equivalent valid alternatives (such as explicit runtime
`new URL(import.meta.url)` notes or `options.windows`) are permitted.

## Source

Derived from GitHub issue #317 (originally surfaced in PR #314 review on
`execFile` script paths and broadened during triage to bidirectional `file:` URL
and OS filesystem path conversion). Requires fresh behavioral evidence against
the final Knowledge and Handbook files.
