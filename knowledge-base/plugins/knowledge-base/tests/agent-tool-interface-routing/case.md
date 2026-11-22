# Route and apply agent tool design and MCP tool contracts

## Identity

- ID: agent-tool-interface-routing
- Kind: journey

## Covered objects

- [Agents Handbook](../../skills/handbook-agents/SKILL.md)
- [Tool interface design for AI agents](../../knowledge/agents/tool-interface-design.md)
- [Model Context Protocol tool contracts](../../knowledge/mcp/tool-contracts.md)

## Protected behavior

Agent tool-interface and MCP server-tool requests must select `handbook-agents`,
route cumulatively to the general tool-design leaf and/or MCP tool-contract leaf
(with focused MCP wire-contract questions reading only the MCP leaf), and apply
trigger boundaries, bias guards, token-efficient outputs, client vs model
metadata separation, `structuredContent` compatibility, and `isError` vs
JSON-RPC error separation, while unrelated agent architecture requests produce a
valid sparse no-match inside `handbook-agents`. Protect those selection,
routing, and contract invariants while tolerating different valid tool names,
schema layouts, and equivalent phrasing.

## Task

Handle these four independent requests:

1. Review an MCP server exposing `web_search` and `fetch_page`. Currently
   `fetch_page` says `"Fetch a web page using the Fetch API."`, `web_search`
   duplicates query-operator prose in both the tool and parameter descriptions
   without noting that image search is unsupported or full page bodies are off
   by default, returns raw numeric `rerank_score` and `authority: -1` in text
   only without `outputSchema` or `ToolAnnotations`, models fabricate an
   optional `client_ip` parameter, and HTTP 402 quota exhaustion returns `"HTTP
402"` via a JSON-RPC protocol error. Propose concrete fixes.
2. Design non-MCP function-calling tools for a TypeScript customer-support
   agent (`search_tickets`, `get_ticket`, `issue_refund`), specifying tool
   boundaries, parameter schemas, response shaping, and failure behavior.
3. Explain in the Model Context Protocol when a tool failure should return
   `isError: true` versus a JSON-RPC protocol error, and how `ToolAnnotations`,
   `outputSchema`, and `structuredContent` work.
4. Explain strategies for episodic memory compaction and multi-agent handoff
   orchestration in a long-running coding agent. No tool calling or MCP server
   is involved.

## Starting state

Construct the candidate selection set from the frontmatter of every direct
installed Skill entrypoint under `knowledge-base/plugins/knowledge-base/skills/*/SKILL.md` in
the tested snapshot. Supply only registered names, descriptions, and paths for
the initial selection step before opening any Skill body. Record the Skill
choices for all four requests before permitting read-only access to the
complete chosen Skill bodies and their direct canonical Knowledge routes. Keep
the four requests independent and do not modify repository files.

## Expected behavior

- R1 (critical): select `handbook-agents` natively for all four requests
  (co-selection of `handbook-software-engineering` or
  `handbook-javascript-typescript` where applicable is allowed).
- R2 (critical): inside `handbook-agents`, read both
  [tool-interface-design.md](../../knowledge/agents/tool-interface-design.md)
  and [tool-contracts.md](../../knowledge/mcp/tool-contracts.md) for request 1;
  read
  [tool-interface-design.md](../../knowledge/agents/tool-interface-design.md)
  without
  [tool-contracts.md](../../knowledge/mcp/tool-contracts.md) for request 2;
  read
  [tool-contracts.md](../../knowledge/mcp/tool-contracts.md)
  (with optional
  [tool-interface-design.md](../../knowledge/agents/tool-interface-design.md)
  only if needed, and never forcing an unrelated foundation) for request 3;
  and match no package (excluding both Knowledge files) for request 4 without
  claiming `handbook-agents` covers agent memory or orchestration.
- R3 (critical): for request 1, cover positive/negative selection boundaries
  between search and fetch, explicit unsupported capabilities (no image search,
  summaries by default), deduplicated operator guidance, anti-fabrication guard
  for `client_ip`, `outputSchema` (documenting `rerank_score` scale and either
  replacing sentinel `-1` with explicit absence/nullability or documenting its
  meaning) plus `structuredContent` with backwards-compatible `TextContent`,
  client-facing `ToolAnnotations` (`readOnlyHint: true`, `openWorldHint: true`)
  with their untrusted-hint boundary, and returning HTTP 402 via
  `isError: true` with explicit non-retry user/operator-action guidance rather
  than a JSON-RPC protocol error.
- R4 (critical): for request 2, define workflow-oriented boundaries (splitting
  read-only lookups from irreversible `issue_refund`), concrete parameter names
  and JSON Schema constraints, context-efficient responses with chaining IDs or
  granularity controls, and model-recoverable vs non-retryable refund errors
  without inventing MCP protocol envelopes or `ToolAnnotations`.
- R5 (critical): for request 3, distinguish JSON-RPC protocol errors (unknown
  tool, malformed `CallToolRequest`, server faults) from `isError: true` tool
  execution errors (model-visible validation, business logic, expired handles,
  upstream failures), explain `ToolAnnotations` as untrusted client-facing
  hints with pessimistic defaults, and state `outputSchema` + `structuredContent`
  - backwards-compatible `TextContent` rules.

## Verification

Inspect native Skill selection, post-body `handbook-agents` package choices,
file-read traces, and the final answer for each of the four requests
separately. A faulty observation that omits `handbook-agents`, loads
[tool-contracts.md](../../knowledge/mcp/tool-contracts.md) for non-MCP
request 2, loads either Knowledge leaf for request 4, treats `ToolAnnotations`
as security enforcement or model prompts, or omits `TextContent` compatibility
for `structuredContent` must fail the corresponding critical criterion.

## Source

Derived from GitHub issue #296 and its maintainer-accepted split into
[general agent tool interface design](../../knowledge/agents/tool-interface-design.md)
and
[MCP server tool contracts](../../knowledge/mcp/tool-contracts.md)
under a sparse `handbook-agents` domain Handbook.
