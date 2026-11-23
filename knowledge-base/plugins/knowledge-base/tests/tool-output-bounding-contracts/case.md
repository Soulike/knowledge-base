# Design bounded agent tool outputs and schema-valid MCP responses

## Identity

- ID: tool-output-bounding-contracts
- Kind: journey

## Covered objects

- [Agents Handbook](../../skills/handbook-agents/SKILL.md)
- [Tool interface design for AI agents](../../knowledge/agents/tool-interface-design.md)
- [Model Context Protocol tool contracts](../../knowledge/mcp/tool-contracts.md)

## Protected behavior

When designing bounded outputs for model-invoked tools and MCP tools declaring
`outputSchema`, Agents must select `handbook-agents`, route cumulatively to
`agents/tool-interface-design.md` and `mcp/tool-contracts.md`, choose an
explicit design-time bounding strategy fitted to upstream capabilities, request
cost, and result shape, preserve safe character boundaries with steering
feedback on truncation, and bound both `content` and `structuredContent`
consistently without violating `outputSchema` (while keeping undeclared
truncation notices out of strict `structuredContent`). Protect those selection,
routing, design-criteria, and schema-consistency invariants while tolerating
different concrete budget numbers, caching vs. hard-cap tradeoffs, and valid
equivalent schema or helper designs.

## Task

Design the output-handling contract for a TypeScript MCP server wrapping a
third-party web search and page-fetch API whose upstream endpoints impose no
response-size cap, offer no offset pagination, and charge per upstream call:

1. `search_pages`: returns up to 10 ranked results. It declares
   `outputSchema` as `{ type: "object", additionalProperties: false, required: ["results"], properties: { results: { type: "array", items: { type: "object", additionalProperties: false, required: ["title", "url", "snippet"], properties: { title: { type: "string" }, url: { type: "string" }, snippet: { type: "string" } } } } } }`
   alongside a Markdown `TextContent` list. When callers request long excerpts,
   combined bodies can exceed 150 KB.
2. `fetch_page`: returns the extracted Markdown of a single web page, which can
   exceed 200 KB and contains multi-byte CJK text and emoji.

Specify how each tool bounds output size, handles oversized results and
truncation feedback, and ensures `content` and `structuredContent` remain valid
and bounded.

## Starting state

Construct the candidate selection set from the frontmatter of every direct
installed Skill entrypoint under `knowledge-base/plugins/knowledge-base/skills/*/SKILL.md`
in the tested snapshot. Supply only registered names, descriptions, and paths
for the initial selection step before opening any Skill body. Record the Skill
choices before permitting read-only access to the complete chosen Skill bodies
and their direct canonical Knowledge routes. Do not modify repository files.

## Expected behavior

- C1 (critical): select `handbook-agents` natively and read both
  [Tool interface design for AI agents](../../knowledge/agents/tool-interface-design.md)
  and
  [Model Context Protocol tool contracts](../../knowledge/mcp/tool-contracts.md)
  (co-selection of `handbook-software-engineering` or
  `handbook-javascript-typescript` is allowed).
- C2 (critical): require explicit design-time output bounds calibrated to finite
  host tool-result limits (rather than relying on upstream defaults or
  unbounded host handling), accounting for language/format token density.
- C3 (critical): tailor the bounding strategy to result shape and upstream
  constraints rather than one fixed recipe—for `search_pages`, prefer keeping
  top-ranked entries intact within budget (falling back to truncating the first
  entry if it alone exceeds budget) rather than slicing every entry
  mid-record; for `fetch_page`, address the unpaginated, per-call-billed
  upstream tradeoff (such as hard cap, granularity control, or `start_index` +
  `max_length` with explicit short-lived caching caveats/staleness tradeoff, or
  lazy resource references if supported).
- C4 (critical): require explicit non-silent truncation feedback (what was
  omitted and how to narrow or continue) and safe character-boundary slicing
  that does not split multi-byte characters or UTF-16 surrogate pairs.
- C5 (critical): for `search_pages` under `outputSchema`, bound `content`
  (`TextContent`) and `structuredContent` consistently from the same bounded
  subset so full unbounded payloads do not leak through `structuredContent`,
  while keeping `structuredContent` strictly valid against `outputSchema`
  (do not replace typed fields with plain-text error banners or inject an
  undeclared `truncated` field under `additionalProperties: false`; keep
  undeclared truncation notices in `TextContent` or extend `outputSchema`
  explicitly if structured metadata is desired).

## Verification

Inspect native Skill selection, post-body `handbook-agents` package choices,
file-read traces, and the design proposal. A response that omits
`handbook-agents` or either Knowledge leaf, leaves outputs unbounded, truncates
silently, splits UTF-16 surrogate pairs, truncates only `TextContent` while
leaving all results in `structuredContent`, or injects undeclared
fields/strings into strict `structuredContent` must fail the corresponding
critical criterion.

## Source

Derived from [GitHub issue #315](https://github.com/Soulike/knowledge-base/issues/315)
and [GitHub issue #316](https://github.com/Soulike/knowledge-base/issues/316) to
protect design-time output bounding criteria and synchronized `outputSchema`
bounding invariants.
