# Route and apply MCP server architecture and testing boundaries

## Identity

- ID: mcp-server-architecture-routing
- Kind: journey

## Covered objects

- [Agents Handbook](../../skills/handbook-agents/SKILL.md)
- [Model Context Protocol server architecture](../../knowledge/mcp/server-architecture.md)
- [Model Context Protocol tool contracts](../../knowledge/mcp/tool-contracts.md)
- [Tool interface design for AI agents](../../knowledge/agents/tool-interface-design.md)

## Protected behavior

MCP server architecture, factory-lifecycle, layering, and in-process protocol
testing requests must select `handbook-agents` and route to
`mcp/server-architecture.md` (loading it alone for pure architecture/testing
questions, or cumulatively with `agents/tool-interface-design.md` and
`mcp/tool-contracts.md` when designing/reviewing an MCP server end-to-end),
while plain non-MCP HTTP server refactoring excludes `handbook-agents`. Protect
those selection, cumulative-reading, stateless-factory, layering, and
protocol-versus-boundary testing-seam invariants (including distinguishing
`2026-07-28` `createMcpHandler(createServer).fetch` + concurrent-request checks
from `2025`-era `InMemoryTransport`) while tolerating different valid directory
layouts, SDK v1/v2 syntax, and equivalent prose.

## Task

Handle these three independent requests:

1. Our TypeScript MCP server passes single-request manual tests, but under
   Streamable HTTP concurrent requests fail with `-32603` internal server
   error. Currently `server.ts` exports a module-level singleton `McpServer`,
   reads `process.env` inside tool handlers, puts `outputSchema` descriptions
   and Markdown formatting inside `services/api.ts`, and calls
   `serveStdio` at top level without an entry-point guard. Explain the cause
   and propose the target module structure and test seams.
2. Build a new TypeScript MCP server wrapping our internal incident HTTP API
   (`search_incidents`, `get_incident`), covering startup/transports (`stdio`
   and Streamable HTTP), server factory, tool contracts, error handling, and
   tests.
3. Refactor a plain TypeScript Express REST API so `process.env` reads stay in
   `index.ts` and route handlers receive injected service clients instead of
   reading globals. No AI agents or MCP are involved.

## Starting state

Construct the candidate selection set from the frontmatter of every direct
installed Skill entrypoint under `knowledge-base/plugins/knowledge-base/skills/*/SKILL.md` in
the tested snapshot. Supply only registered names, descriptions, and paths for
the initial selection step before opening any Skill body. Record the Skill
choices for all three requests before permitting read-only access to the
complete chosen Skill bodies and their direct canonical Knowledge routes. Keep
the three requests independent and do not modify repository files.

## Expected behavior

- R1 (critical): select `handbook-agents` natively for requests 1 and 2, and
  exclude `handbook-agents` for non-MCP REST request 3 (`handbook-software-engineering`
  and `handbook-javascript-typescript` apply to request 3 instead).
- R2 (critical): inside `handbook-agents`, read
  [server-architecture.md](../../knowledge/mcp/server-architecture.md) without
  forcing
  [tool-interface-design.md](../../knowledge/agents/tool-interface-design.md) or
  [tool-contracts.md](../../knowledge/mcp/tool-contracts.md) for request 1, and
  cumulatively read all three leaves for request 2.
- R3 (critical): for request 1, identify that reusing one singleton `McpServer`
  causes `-32603` under per-request Streamable HTTP (`createMcpHandler`),
  require a stateless `createServer(deps)` factory returning a fresh `McpServer`
  per call, isolate `process.env` + `isEntryPoint` (`realpathSync`) +
  `stderr`-only `stdio` logging + Streamable HTTP `Host`/`Origin`/auth checks at
  the entry boundary, move `@modelcontextprotocol/*` + Markdown/error
  presentation out of `services/api.ts`, and distinguish the `2026-07-28`
  in-process `StreamableHTTPClientTransport` -> `createMcpHandler(createServer).fetch`
  seam (explicitly negotiating `2026-07-28` via `versionNegotiation: { mode: { pin: "2026-07-28" } }`
  or `mode: "auto"` + asserting `getProtocolEra() === "modern"`, with
  overlapping/concurrent request coverage for fresh server creation) from
  `2025`-era `InMemoryTransport.createLinkedPair()` (which bypasses the HTTP
  per-request factory) alongside thin `isEntryPoint` / HTTP boundary checks.
- R4 (critical): for request 2, combine stateless `createServer(deps)`,
  deterministic `tools/index.ts` registration, pure `services/` with
  `AbortSignal.any` cancellation, presenter separation, model-facing
  descriptions/schemas/`ToolAnnotations`/`outputSchema`+`structuredContent`+`TextContent`/`isError: true`,
  and protocol-appropriate tests (`createMcpHandler.fetch` with explicit
  `2026-07-28` negotiation + concurrent request check, `InMemoryTransport` for
  `2025`-era/v1, and thin entry/transport checks).

## Verification

Inspect native Skill selection, post-body `handbook-agents` package choices,
file-read traces, and the final answer for each request separately. A faulty
observation that selects `handbook-agents` for request 3, omits
[server-architecture.md](../../knowledge/mcp/server-architecture.md) for request
1 or 2, forces [tool-contracts.md](../../knowledge/mcp/tool-contracts.md) for
pure architecture request 1, recommends a default `Client` without explicit
`2026-07-28` era negotiation for `2026-07-28` coverage, or keeps a singleton
`McpServer` or `services/` presentation coupling must fail the corresponding
critical criterion.

## Source

Reconstructed from GitHub issue #297 and primary MCP server patterns in
`modelcontextprotocol/servers` and `anthropics/skills`, complementing
[agent-tool-interface-routing](../agent-tool-interface-routing/case.md).
This is newly authored protection requiring fresh final validation rather than
a historical failure replay.
