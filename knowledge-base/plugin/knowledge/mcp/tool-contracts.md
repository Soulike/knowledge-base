# Model Context Protocol tool contracts

## Scope

This document defines the protocol-level contracts for exposing and implementing
tools in a Model Context Protocol (MCP) server: `tools/list` discovery and
caching, JSON Schema conventions for `inputSchema` and `outputSchema`,
client-facing `ToolAnnotations`, unstructured and structured `CallToolResult`
payloads, stateful handles across stateless calls, and the separation between
JSON-RPC protocol errors and `isError: true` tool execution errors. It applies
the model-facing tool design principles to MCP wire semantics without covering
general non-MCP function-calling design or SDK-specific APIs.

## When to update

Update this document when the Model Context Protocol specification revises
`tools/list`, `tools/call`, `Tool` or `ToolAnnotations` definitions,
`outputSchema` or `structuredContent` compatibility rules, `InputRequiredResult`,
transport-parameter annotations such as `x-mcp-header`, or tool error handling.

## Keep tool discovery deterministic and collision-aware

Servers that expose tools must declare the `tools` capability (setting
`listChanged: true` only when emitting `notifications/tools/list_changed`).
Follow MCP's discovery invariants so clients and LLM prompt caches behave
predictably:

- **Return tools in a deterministic order:** When the available tool set has not
  changed, return the same sequence across `tools/list` responses so clients can
  cache definitions and preserve LLM prompt-cache hit rates.
- **Avoid connection-state variance:** The tool list must not change
  per connection or as a side effect of prior requests on that connection,
  though it may filter tools based on the per-request authorization presented.
- **Follow valid MCP tool naming and single-server scope:** Use 1–128
  case-sensitive characters from ASCII letters, digits, `_`, `-`, and `.`
  without spaces or commas. Tool names are unique only within one server;
  aggregating clients often prefix tools across servers (and `serverInfo.name`
  is not guaranteed globally unique), so keep names concise around domain
  resources and actions rather than duplicating redundant server branding,
  applying the naming and description principles in
  [agent tool interface design](../agents/tool-interface-design.md).

## Write strict JSON Schema input contracts

MCP tool arguments are always JSON objects (`type: "object"` at the root) and
default to JSON Schema 2020-12 unless an explicit `$schema` declares another
dialect:

- **Close parameterless inputs explicitly:** For tools accepting no arguments,
  use `{ "type": "object", "additionalProperties": false }` rather than bare
  `{ "type": "object" }`, which admits unexpected properties.
- **Keep composed schemas unambiguous:** MCP permits standard JSON Schema
  2020-12 composition keywords (`oneOf`, `anyOf`, `allOf`, `if`/`then`/`else`).
  As a schema-authoring recommendation from the MCP specification, declare
  `properties` at the root and keep branches to presence assertions such as
  `required`, because a subschema failing a type check cannot be distinguished
  from a branch that simply does not apply (so type constraints inside
  `oneOf` branches are not enforced for non-matching branches).
- **Protect sensitive inputs from transport headers:** Never mark passwords, API
  keys, tokens, or personal data with `x-mcp-header`, which mirrors arguments
  into `Mcp-Param-{name}` HTTP headers visible to network intermediaries on
  Streamable HTTP transport. Ensure any `x-mcp-header` value obeys HTTP
  token syntax and primitive-type rules, or compliant clients will exclude the
  entire tool from `tools/list`.

## Separate client hints (`ToolAnnotations`) from model guidance

MCP separates metadata read by the language model from metadata consumed by the
client host application:

- **Model-facing prompt surface:** `description`, parameter descriptions in
  `inputSchema`, and field descriptions in `outputSchema` guide the LLM's tool
  choice and arguments; author them using
  [agent tool interface design](../agents/tool-interface-design.md).
- **Client-facing display and risk hints:** `title` (display precedence:
  `title`, then `annotations.title`, then `name`) and `annotations`
  (`ToolAnnotations`) inform host UIs, confirmation dialogs, and session policy
  engines, and are not guaranteed to appear in the model prompt.

Set `ToolAnnotations` accurately rather than relying on omitted fields, because
MCP defines pessimistic defaults:

| Annotation        | Default if omitted | Meaning when set                                                                                 |
| ----------------- | ------------------ | ------------------------------------------------------------------------------------------------ |
| `readOnlyHint`    | `false`            | Set `true` when the tool does not modify its environment.                                        |
| `destructiveHint` | `true`             | Meaningful only when `readOnlyHint` is `false`; explicitly set `false` for additive-only writes. |
| `idempotentHint`  | `false`            | Meaningful only when `readOnlyHint` is `false`; set `true` only if repeated calls add no effect. |
| `openWorldHint`   | `true`             | Set `false` when the tool interacts only with a closed internal domain.                          |

Clients must treat annotations from untrusted servers as untrusted hints; never
rely on `ToolAnnotations` as an authorization or security enforcement boundary.
Enforce access controls, input validation, rate limits, and output sanitization
on the server.

## Return structured and backwards-compatible results

Tool results carry unstructured blocks in `content` (`text`, `image`, `audio`,
`resource_link`, or embedded `resource`, optionally annotated with `audience`,
`priority`, and `lastModified`) and optional JSON data in `structuredContent`:

- **Provide `structuredContent` with `outputSchema`:** When a tool declares an
  `outputSchema`, the server must return `structuredContent` conforming to that
  schema so clients can validate and integrate typed outputs. Note that
  `structuredContent` is server-produced result data and is unrelated to LLM
  constrained-decoding structured outputs.
- **Include compatible `TextContent`:** For backwards compatibility with clients
  that consume only `content`, a tool returning `structuredContent` should also
  include a `TextContent` block containing the serialized JSON (or a concise,
  equivalent text rendering), while avoiding unnecessary boilerplate wrappers.
- **Document output meanings in `outputSchema`:** Describe units, numeric score
  ranges, and legacy sentinel values directly on `outputSchema` properties while
  applying the high-signal payload rules in
  [agent tool interface design](../agents/tool-interface-design.md).
- **Reference large or subscribable data with links:** Prefer returning a
  `resource_link` block over inlining oversized payloads into `content` when
  clients can fetch or subscribe to the referenced resource on demand.
- **Use elicitation for mid-call user input:** When a tool requires additional
  interactive input (such as login or confirmation) before completing, return an
  `InputRequiredResult` (`resultType: "input_required"`) rather than failing
  the call prematurely.

## Manage stateful handles across stateless calls

MCP has no protocol-level session binding consecutive `tools/call` requests.
When a workflow spans calls (such as a multi-step cart, transaction, or browser
session), return an explicit handle from a creation tool and accept it as a
parameter on subsequent calls:

- Keep handles opaque so models and callers do not parse or guess internal
  structure.
- Enforce caller authorization on every handle-accepting call, or generate
  high-entropy bounded-lifetime bearer handles when the server is
  unauthenticated.
- Document handle retention and expiration rules in the creation tool's
  `description`, and return an actionable tool execution error when a handle is
  unknown or expired so the model can recover by creating a new one.

## Separate protocol errors from tool execution errors

MCP defines two distinct error channels with different recovery paths:

- **JSON-RPC protocol errors (`error`):** Use for structural or transport-level
  faults that a model normally cannot fix by editing tool arguments—unknown tool
  names, malformed `CallToolRequest` payloads failing protocol schema,
  unsupported capabilities, or unexpected server-internal faults. Clients are not
  required to surface protocol errors to the model.
- **Tool execution errors (`CallToolResult` with `isError: true`):** Use for
  failures originating inside tool execution that the model should see—invalid
  argument semantics (such as a past date or bad query filter), business-rule
  rejections, expired handles, and upstream API failures. Clients should pass
  `isError: true` results to the language model so it can self-correct or stop
  with clear user guidance according to
  [agent tool interface design](../agents/tool-interface-design.md).

## References

- [Model Context Protocol Specification: Tools (`2026-07-28`)](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)
- [Model Context Protocol Docs: Understanding MCP servers](https://modelcontextprotocol.io/docs/learn/server-concepts)
- [Model Context Protocol Blog: Tool Annotations as Risk Vocabulary](https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/)
