# Tool interface design for AI agents

## Scope

This document defines how to design the model-facing interface of tools invoked
by language-model agents—tool boundaries and grouping, names and descriptions,
input schemas and parameter descriptions, returned payloads, context budgets,
and model-facing error feedback—across function-calling APIs, agent SDKs, and
tool servers. It covers shaping tool definitions and outputs for
non-deterministic language-model consumers rather than human developers or
deterministic callers; transport-specific wire formats, client confirmation
hints, and protocol error envelopes belong to the consuming protocol
specification.

## When to update

Update this document when empirical agent evaluations, model tool-calling
behavior, or authoritative tool-use guidance changes how tool boundaries,
descriptions, parameter schemas, output representations, context limits, or
error messages affect model reliability.

## Design tools for non-deterministic callers

Traditional software APIs establish contracts between deterministic callers
that read reference documentation ahead of time and emit fixed requests. Agent
tools establish contracts between deterministic backends and non-deterministic
language models that select tools, synthesize arguments, and interpret results
at runtime inside a finite shared context window.

Design tool boundaries around the tasks and decisions an agent performs rather
than mirroring internal HTTP endpoints or database tables one-to-one:

- **Consolidate high-frequency multi-step lookups:** When an agent routinely
  chains several small calls just to gather one working context, combine those
  steps into a single task-oriented tool (for example, `search_contacts` rather
  than dumping `list_contacts`, or `get_customer_context` rather than forcing
  separate profile, transaction, and note calls). Merging intermediate calls
  keeps noisy payloads out of the model's context and reduces wrong-step risk.
- **Keep boundaries distinct:** Avoid creating multiple overlapping tools for
  the same job. Split operations when they require different authorization
  scopes, safety confirmation, or side-effect guarantees (such as read-only
  search versus an irreversible mutation).
- **Namespace consistently across large toolsets:** When an agent can see tools
  from several services or domains, group names consistently by service and
  resource (such as `billing_invoices_search` and `billing_customers_get`).
  Evaluate prefix versus suffix naming schemes on realistic tasks when routing
  accuracy matters, as different models respond differently to naming layout.

## Write descriptions to route and onboard the model

Treat every tool description as runtime prompt guidance for a teammate who has
never seen the backend implementation:

- **Describe intent and trigger conditions:** State what the tool accomplishes,
  when the model should choose it, and when it should _not_ use it—including
  explicit boundaries against sibling tools that could look interchangeable.
- **State missing capabilities and defaults:** Explicitly warn what the tool
  does _not_ return or support whenever its name could mislead (for example,
  that a search tool skips archived records, omits image results, or returns
  summaries without full page bodies by default).
- **Surface domain and syntax rules explicitly:** Explain specialized query
  operators, filter syntax, state-handle lifetimes, prerequisite calls, and
  resource relationships directly instead of assuming team-internal knowledge.
- **Keep guidance in one place:** State shared syntax or format rules once at
  the owning level (for example, in the tool description when rules span multiple
  parameters, or on the single owning parameter) rather than duplicating the
  same table in both places.

## Constrain inputs and guard against model biases

Enforce structural validity in the schema so the model receives exact typed
boundaries, then use parameter descriptions to resolve semantic ambiguity:

- **Use specific, unambiguous parameter names:** Prefer concrete names that
  reflect identity and representation (such as `user_id` over `user`, or
  `start_date_iso` over `start`).
- **Put structural rules in the schema:** Express types, `required` fields,
  `enum` choices, numeric bounds, and string formats in the JSON Schema rather
  than relying solely on prose reminders.
- **Document semantics, format examples, and behavioral impact:** Use each
  parameter's `description` to explain what the value means, supply concrete
  format examples (such as `"City and country, e.g. Bogota, Colombia"`), state
  defaults, and note when an option changes output shape or token cost. When
  the tool platform supports schema-validated input examples for complex nested
  arguments, supply representative examples there.
- **Counter observed model argument habits:** When evaluations show a model
  inventing optional inputs (such as fabricating a client IP address or session
  token) or injecting unwanted biases (such as appending the current year to
  search queries), add direct negative or conditional guidance telling the model
  not to supply those values unless explicitly provided or needed.

## Return high-signal, context-efficient payloads

Agent context capacity is scarce compared to ordinary application memory, so
every returned field competes with reasoning capacity and earlier conversation
state:

- **Return only decision-relevant fields:** Strip noisy internal metadata and
  uninformative low-level fields, keeping what informs downstream reasoning or
  follow-up tool calls.
- **Pair readable labels with required chaining IDs:** Models reason more
  reliably over meaningful names, labels, and explicit status strings than
  opaque internal codes. When downstream calls still require stable technical
  identifiers or state handles, retain those identifiers alongside readable
  context—or provide a granularity parameter (such as `response_format` with
  `"concise"` and `"detailed"`) so the model defaults to low-token readable
  output and requests identifiers only when chaining further calls.
- **Explain scales and prefer explicit absence:** For new tool schemas, prefer
  omitting absent fields, nullable types, or explicit status fields over
  ambiguous numeric sentinels such as `-1`. When exposing upstream numeric
  scores or legacy sentinels that callers cannot eliminate, document the score
  range, units, thresholds, and sentinel meanings in the output field
  descriptions.
- **Bound payload volume at design time:** Do not assume upstream APIs cap
  responses or that host runtimes handle oversized outputs uniformly. Hosts
  enforce varied, relatively tight tool-result limits (commonly around
  10k–25k tokens or tens of kilobytes before warning, truncating, or spilling to
  disk) that are much smaller than the model's full context window, and token
  density varies widely across languages and formats. Choose an explicit
  bounding strategy matched to upstream capabilities, request cost, and result
  shape:
  - **Filter upstream first:** Prefer server-side query filtering, reranking,
    or field selection when the backend supports it so irrelevant data never
    enters the payload.
  - **Shape bounds to the data and cost:** For ordered multi-item results,
    prefer keeping top-ranked entries intact within the budget (falling back to
    truncating the first entry when it alone exceeds the budget) over
    truncating every entry mid-record; for single large documents or blobs,
    consider offset/range parameters (with optional short-lived server-side
    caching only when upstream lacks pagination, bills or rate-limits strictly
    per call, and brief staleness is acceptable), granularity controls, a
    simple hard cap, or lazy resource references when the host and protocol
    support deferred fetch.
- **Truncate safely with steering feedback:** Never truncate silently. State
  what was omitted and how the model can narrow the query or fetch remaining
  slices, and cut text at safe character boundaries so multi-byte sequences or
  UTF-16 surrogate pairs are not split.
- **Validate the serialization format against evaluations:** Structured JSON,
  Markdown, or XML can perform differently across models and tasks; select the
  response structure based on observed task accuracy and token cost rather than
  assuming one universal format.

## Return actionable, honest tool execution errors

Tool errors sent back to a model serve as steering feedback for its next step,
not debug dumps for a human operator. Apply the facts, uncertainty, and safe
retry rules in
[user-facing failure communication](../software-design/user-facing-failure-communication.md#start-from-the-users-decision):
report only established failure facts, keep uncertain side effects explicit on
state-changing calls, and recommend repeating an attempt only when the
operation's effect contract makes repetition safe.

Separate failures the model can resolve, transient faults, and failures owned by
a user or operator:

- **Model-recoverable failures:** For malformed query operators, invalid dates,
  out-of-range limits, unreachable target URLs, or expired state handles, state
  what failed, why it failed, and concrete valid examples or alternative next
  calls (such as narrowing a filter, trying a different URL, or requesting a
  fresh handle).
- **Transient faults and rate limits:** For temporary rate limits or transient
  upstream outages, state that the failure is temporary and permit a bounded
  retry only when the operation's effect contract confirms that repetition is
  safe (idempotent or already reconciled).
- **Terminal or user-owned failures:** For missing credentials, insufficient
  permissions, or exhausted quotas/billing limits (such as HTTP 402), state
  explicitly that the model must **not** retry the call, name the prerequisite
  or role required to resolve it without exposing secrets or internal topology,
  and surface only safe diagnostic identifiers.

## Evaluate tool specs against real traces

Because model behavior cannot be predicted reliably from static API review
alone, test prototypes against realistic multi-step tasks before finalizing
descriptions or defaults. Inspect raw tool-call traces alongside model reasoning
to spot tool confusion, fabricated optional arguments, parameter validation
failures, oversized payloads, and futile retry loops, then refine tool
boundaries, descriptions, schemas, and error text iteratively.

## References

- [Anthropic Engineering: Writing effective tools for AI agents](https://www.anthropic.com/research/writing-tools-for-agents)
- [Anthropic Claude Docs: Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools)
- [OpenAI Developers: Define tools](https://developers.openai.com/plugins/plan/tools)
- [OpenAI API Docs: Function calling](https://developers.openai.com/api/docs/guides/function-calling)
