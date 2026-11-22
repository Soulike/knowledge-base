# Model Context Protocol server architecture

## Scope

This document defines how to structure Node.js and TypeScript Model Context
Protocol (MCP) servers so startup and transport wiring, per-connection or
per-request server creation, deterministic tool registration, upstream service
clients, model-facing presentation, and automated test seams stay decoupled and
verifiable. It covers `@modelcontextprotocol/server` (v2) and
`@modelcontextprotocol/sdk` (v1) server patterns without repeating general
application-composition theory or model-facing tool copy rules.

## When to update

Update this document when official MCP TypeScript SDKs
(`@modelcontextprotocol/server` or `@modelcontextprotocol/sdk`), MCP server
transport or session semantics, or Node.js process and cancellation APIs
change recommended server-factory lifecycles, entry-point guards, HTTP origin
or auth boundaries, or in-process testing seams.

## Architecture overview

Structure an MCP server in four one-way layers so transport startup, MCP
protocol wiring, LLM-facing presentation, and upstream I/O can change and be
tested independently:

```text
  Production entry point (index.ts / http.ts)
  - Reads process.env, CLI flags, SERVER_VERSION; constructs long-lived deps
  - Guards startup with isEntryPoint; binds stdio (stderr logs) or HTTP (Host/Origin/auth)
        |
        | calls once per stdio connection, 2025-era session, or sessionless HTTP request
        v
  Stateless server factory (server.ts: createServer(deps))
  - Creates a fresh McpServer per call (no module-level session maps)
  - Registers tools, resources, prompts, and per-instance cleanup()
        |
        | deterministic registration order
        v
  Feature-sliced tools & presenters (tools/index.ts -> tools/<tool>.ts -> presenters/)
  - Owns @modelcontextprotocol/* SDK types, Zod schemas, ToolAnnotations
  - Formats Markdown/structuredContent and maps domain errors to isError: true
        |
        | passes validated args + AbortSignal
        v
  Pure upstream services (services/)
  - Owns HTTP/SDK calls, auth headers, timeouts, typed domain results & errors
  - Zero @modelcontextprotocol/* imports, process.env reads, or LLM copy

  Test seams:
  - 2026-07-28 HTTP: Client + StreamableHTTPClientTransport -> createMcpHandler(createServer).fetch (no socket; tests factory lifecycle)
  - 2025-era / v1:   Client <--> InMemoryTransport.createLinkedPair() <--> createServer(stubDeps) (bypasses HTTP handler factory)
```

Read each layer below for the specific invariants and failure modes it prevents.

## Keep startup and transport in a guarded entry point

Keep `process.env` reads, CLI flag parsing, long-lived dependency setup,
`SIGINT`/`SIGTERM` shutdown handlers, and transport binding (`stdio` or
Streamable HTTP) in one startup boundary (`index.ts` and an optional `http.ts`
adapter). Following
[application composition](../software-design/application-composition.md#make-assembly-decisions-explicit),
inject configuration and clients from startup rather than reading `process.env`
inside tool handlers or service clients as an ad-hoc service locator.

- **Guard binary execution with realpath checking:** Wrap transport startup in
  an `isEntryPoint` check comparing `realpathSync(process.argv[1])` with
  `realpathSync(fileURLToPath(import.meta.url))`. Importing the module from
  tests or HTTP wrappers will not bind `stdin`/`stdout`, while symlinked CLI
  bins (`npx` or `node_modules/.bin`) still start normally.
- **Keep `stdout` pure under `stdio`:** Under `stdio`, `stdout` carries
  JSON-RPC frames exclusively. Send all startup, request, and error logs to
  `stderr` (`console.error`), because a single `console.log` corrupts the
  protocol stream.
- **Enforce host, origin, and auth boundaries on Streamable HTTP:** Bind
  loopback (`127.0.0.1`) by default and validate `Host` and `Origin` headers to
  prevent DNS rebinding attacks. When binding public interfaces, declare an
  explicit `allowedHosts` allowlist and attach bearer/OAuth verification
  middleware before the MCP HTTP handler, because `createMcpHandler` does not
  authenticate requests by itself.

## Export a stateless `createServer(deps)` factory

Export a `createServer(deps)` factory that constructs and returns a **fresh**
`McpServer` instance on every call. Register every tool, resource, and prompt
inside that factory, and read the advertised server version from one
authoritative source (`version.ts` or package metadata) instead of scattering
hardcoded version strings.

- **Match `McpServer` lifetime to the transport contract:** `serveStdio` calls
  `createServer` once per stdio connection, sessionful `2025`-era HTTP/SSE
  transports call it once per session, and sessionless Streamable HTTP
  (`createMcpHandler` on `2026-07-28`) calls it once per HTTP request. Never
  share one module-level singleton `McpServer` across concurrent sessions or
  across sessionless HTTP requests: a singleton passes sequential manual tests,
  then fails with `-32603` internal server errors when overlapping sessions or
  sessionless requests arrive.
- **Inject shared resources via `deps`:** Construct expensive HTTP clients,
  connection pools, caches, and intentionally process-shared state once in the
  composition root and pass them through `deps` (alongside a per-instance
  `cleanup()` hook when timers or subscriptions exist). Do not store
  per-session state in module-level maps keyed by session ID.

## Slice tools by feature and register deterministically

Centralize registration in `tools/index.ts` and invoke each tool or cohesive
domain module (`tools/<tool>.ts`) in a fixed order so `tools/list` preserves
the deterministic ordering required by
[Model Context Protocol tool contracts](tool-contracts.md#keep-tool-discovery-deterministic-and-collision-aware).

Give each tool module a `registerXxxTool(server, deps)` function that owns its
input and output schemas, `title`, `description`, `annotations`, and a thin
handler (`args -> service -> presenter/error mapping`). Confine
`@modelcontextprotocol/*` SDK imports and v1-versus-v2 differences—such as v2
`zod/v4` `z.object`/`z.strictObject` and `ctx.mcpReq.signal` versus v1 raw Zod
shapes and `extra.signal`—to this MCP layer.

## Separate pure upstream `services/` from presentation

Place external HTTP or SDK calls, authentication headers, bounded timeouts, and
upstream response validation inside pure domain clients under `services/`:

- **Propagate cancellation and bound waits:** Pass the request `AbortSignal`
  combined with a timeout (`AbortSignal.any([signal, AbortSignal.timeout(...)])`)
  per
  [asynchronous operation cancellation](../software-design/asynchronous-operation-cancellation.md#carry-the-request-to-avoidable-work).
- **Return typed domain results and errors:** Return validated domain objects
  and typed errors (`status`, `code`, `retryable`, `message`) from `services/`.
  Keep `services/` free of `@modelcontextprotocol/*` imports, `process.env`
  reads, Markdown formatting, and LLM prompt or self-correction wording.
- **Keep LLM presentation in the MCP adapter:** Format Markdown or text blocks,
  assemble `structuredContent`, and map domain failures into `isError: true`
  self-correction feedback (following
  [agent tool interface design](../agents/tool-interface-design.md#return-actionable-honest-tool-execution-errors))
  inside the tool module—or extract shared formatters into `presenters/` once
  multiple tools reuse them.

## Test at the protocol seam and thin transport boundaries

Choose the in-process protocol test seam that matches the protocol revision and
SDK lifecycle, supplying injected external boundary doubles (such as a stub
`fetch` or service client) and explicit test credentials without mutating
`process.env`:

- **Exercise `2026-07-28` servers through `createMcpHandler(createServer).fetch`:**
  In `@modelcontextprotocol/server` v2, connect a real `Client` and
  `StreamableHTTPClientTransport` whose `fetch` option calls
  `handler.fetch(new Request(url, init))` directly in process with no open
  socket. Include an overlapping/concurrent request test on that handler to
  verify that `createServer` returns a fresh `McpServer` per request rather
  than failing with `-32603` on a shared singleton.
- **Reserve `InMemoryTransport.createLinkedPair()` for `2025`-era and v1 coverage:**
  `InMemoryTransport.createLinkedPair()` connects two `2025`-era (or SDK v1)
  instances in memory to verify tools, schemas, `outputSchema`/`structuredContent`,
  and `isError: true` mapping without spawning a process, but it bypasses
  `createMcpHandler` and therefore cannot catch per-request HTTP factory reuse.

Keep startup and transport checks thin and focused at their owning boundaries
per [test effectiveness](../software-testing/test-effectiveness.md#test-at-the-owning-seam):

- Test `isEntryPoint` symlink resolution and transport startup error exit codes
  in process without spawning processes for every tool behavior.
- When Streamable HTTP is supported, test loopback binding, `Host`/`Origin`
  rejection (`403`), non-MCP path `404` responses, and `SIGINT`/`SIGTERM`
  shutdown on an ephemeral port (`port: 0`).
- When distributing a `stdio` CLI binary, keep a minimal spawned-process smoke
  test (`StdioClientTransport` or child process) verifying `bin` execution and
  clean `stdout` framing.

## References

- [MCP Reference Servers (`everything` factory and `sequentialthinking` entrypoint/HTTP/tests)](https://github.com/modelcontextprotocol/servers)
- [MCP TypeScript SDK v2: Test a server](https://ts.sdk.modelcontextprotocol.io/v2/testing.md)
- [Anthropic MCP Builder: Node/TypeScript Server v2 Guide](https://github.com/anthropics/skills/blob/main/skills/mcp-builder/reference/node_mcp_server_v2.md)
- [Anthropic MCP Builder: MCP Best Practices](https://github.com/anthropics/skills/blob/main/skills/mcp-builder/reference/mcp_best_practices.md)
- [Model Context Protocol Specification: Tools (`2026-07-28`)](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)
