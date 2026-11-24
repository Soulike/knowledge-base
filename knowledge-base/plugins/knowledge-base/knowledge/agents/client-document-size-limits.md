# Client document size limits for AI agents

## Scope

This document defines the empirical file-read, tool-output truncation,
project-instruction, and Skill-injection UTF-8 byte limits enforced by GitHub
Copilot CLI and OpenAI Codex CLI, their observable failure modes, and the
resulting practical sizing and structuring practices for portable
Agent-consumed documentation and Skills. It covers runtime limits that govern
whether an Agent receives or can read a complete Markdown document reliably;
model-facing tool interface design and client-host configuration fall outside
its scope.

## When to update

Update this document when GitHub Copilot CLI changes its built-in file viewer
byte limit, measurement unit, or ranged-read behavior, or when OpenAI Codex CLI
changes its explicit Skill prompt byte cap, truncation behavior, shell or tool
output truncation policy, or project-instruction file cap.

## Evidence boundary

The GitHub Copilot CLI limits below were observed empirically on `v1.0.114` and
align with open upstream reports
([`github/copilot-cli#5476`](https://github.com/github/copilot-cli/issues/5476),
[`github/copilot-cli#5003`](https://github.com/github/copilot-cli/issues/5003)).
The OpenAI Codex CLI limits were verified in
[`openai/codex` commit `7ce4437`](https://github.com/openai/codex/tree/7ce4437488c69950fe87f1d8ab4b00bdb4bbd193).
Treat these figures as current empirical baselines rather than permanent client
guarantees, and re-verify when target clients release updates.

## Client limits overview

| Client             | Surface                                  | Limit                                                    | Unit            | Observable failure mode                                 |
| ------------------ | ---------------------------------------- | -------------------------------------------------------- | --------------- | ------------------------------------------------------- |
| GitHub Copilot CLI | Unranged file view (`view`)              | `20,480` B (`20 KiB`)                                    | UTF-8 bytes     | Read refused with zero file content returned            |
| OpenAI Codex CLI   | Explicit Skill prompt injection          | `8,000` B                                                | UTF-8 bytes     | Prefix slice only; no inline marker in injected content |
| OpenAI Codex CLI   | Shell / tool output (standard models)    | `~40,000` B (`10,000` approx. tokens at `4` bytes/token) | Approx. UTF-8 B | Middle truncation (`…N tokens truncated…`)              |
| OpenAI Codex CLI   | Shell / tool output (fallback models)    | `10,000` B                                               | UTF-8 bytes     | Middle truncation (`…N bytes truncated…`)               |
| OpenAI Codex CLI   | Project instructions (`AGENTS.md` chain) | `32,768` B (`32 KiB`) combined                           | UTF-8 bytes     | Combined chain truncated/skipped past budget            |

## GitHub Copilot CLI single-file reading

GitHub Copilot CLI's built-in `view` tool refuses unranged whole-file reads
strictly above `20,480` UTF-8 bytes (`20 * 1,024 = 20 KiB`). In empirical tests
on `v1.0.114`, a `20,480`-byte file returned complete contents, whereas a
`20,481`-byte file returned zero content alongside an error reporting that the
file is too large to read at once (`"File too large to read at once (20.0 KB)..."`).
This ceiling comes from the client's large-output setting
(`largeOutput.maxSizeBytes`, default `20 KiB`), shared with temporary-file
spilling for oversized tool output.

Three properties drive authoring risk:

- **Measured strictly in UTF-8 bytes, not characters or lines:** A document
  with multi-byte Unicode characters (for example CJK text, emojis, or box-drawing
  and typographic symbols at 2–4 UTF-8 bytes per character) exceeds `20,480`
  bytes well before reaching `20,480` characters. Conversely, a 2,000-line file
  totaling `10,000` UTF-8 bytes succeeds in one unranged read.
- **Unranged reads are the default Agent path:** Although ranged reads
  (`view_range`) bypass the whole-file limit, an Agent following a Markdown link
  or instruction typically attempts an unranged `view` call first.
- **Partial-recovery failure mode:** When an unranged read fails, Agents often
  recover only the opening lines or section headings—or abandon reading the
  document—leaving rules, exceptions, and tail constraints unread while
  appearing to have consulted the file.

## OpenAI Codex CLI Skill injection, shell reads, and project docs

OpenAI Codex CLI applies distinct limits across Skill prompt injection,
shell-based file inspection, and project instructions:

- **Silent prefix truncation on explicit Skill invocation (`8,000` UTF-8 bytes):**
  When a user explicitly invokes or mentions a Skill (such as `$skill`), Codex
  truncates the injected `SKILL.md` contents via
  [`truncate_main_prompt_contents`](https://github.com/openai/codex/blob/7ce4437488c69950fe87f1d8ab4b00bdb4bbd193/codex-rs/ext/skills/src/render.rs#L1206-L1208)
  against
  [`MAX_SKILL_PROMPT_BYTES = 8_000`](https://github.com/openai/codex/blob/7ce4437488c69950fe87f1d8ab4b00bdb4bbd193/codex-rs/ext/skills/src/render.rs#L25)
  at a UTF-8 character boundary. This limit applies both to Agent Plugin Skills
  in
  [`host_prompt.rs`](https://github.com/openai/codex/blob/7ce4437488c69950fe87f1d8ab4b00bdb4bbd193/codex-rs/ext/skills/src/host_prompt.rs#L84-L88)
  and to explicitly selected extension-managed Skills in
  [`extension.rs`](https://github.com/openai/codex/blob/7ce4437488c69950fe87f1d8ab4b00bdb4bbd193/codex-rs/ext/skills/src/extension.rs#L446-L451).
  Codex emits a truncation warning only as a host-side event for the client UI
  or logs; **no inline truncation marker is added to the model-visible
  `SkillInstructions.contents`**. Tail sections—commonly stopping rules,
  verification steps, output contracts, and completion gates—silently disappear
  unless the Agent separately reads the file from disk.
- **Shell and tool output truncation (`~40,000` B standard, `10,000` B fallback):**
  Because Codex CLI does not expose a dedicated built-in workspace file reader,
  Agents normally inspect linked references and project documentation via
  `shell_command` or `exec_command`. Standard cataloged models in `models.json`
  set a `10,000`-token output policy (`DEFAULT_MAX_OUTPUT_TOKENS`), converted
  using `APPROX_BYTES_PER_TOKEN = 4` in
  [`truncate.rs`](https://github.com/openai/codex/blob/7ce4437488c69950fe87f1d8ab4b00bdb4bbd193/codex-rs/utils/string/src/truncate.rs#L6)
  (`~40,000` UTF-8 bytes) with middle truncation (`…N tokens truncated…`).
  Fallback definitions used when a model lacks a matching built-in catalog
  entry in
  [`model_info.rs`](https://github.com/openai/codex/blob/7ce4437488c69950fe87f1d8ab4b00bdb4bbd193/codex-rs/models-manager/src/model_info.rs#L126)
  default to `TruncationPolicyConfig::bytes(10_000)` (`10,000` UTF-8 bytes).
  (Executor/cloud `skills.read` paginates separately up to
  `min(512 KiB, truncation_policy * 1.2)` with a `1 MiB` resource limit, but
  ordinary workspace and plugin document reads go through shell output.)
- **Aggregate project-instruction budget (`32 KiB` combined):**
  [`DEFAULT_PROJECT_DOC_MAX_BYTES`](https://github.com/openai/codex/blob/7ce4437488c69950fe87f1d8ab4b00bdb4bbd193/codex-rs/config/src/config_toml.rs#L76)
  caps loaded `AGENTS.md` project instructions at `32 * 1024` bytes (`32,768`
  bytes) via `project_doc_max_bytes`. In
  [`agents_md.rs`](https://github.com/openai/codex/blob/7ce4437488c69950fe87f1d8ab4b00bdb4bbd193/codex-rs/core/src/agents_md.rs#L69-L165),
  Codex walks from the project root down to the current working directory and
  subtracts each loaded file from one shared `project_doc_max_bytes` budget
  (across the root-to-working-directory chain and active environments). This is
  an **aggregate chain cap**, not a per-file allowance: once the combined
  budget is exhausted, later nested files are truncated or skipped with only a
  warning, discarding directory-specific constraints.

## Practical sizing implications for portable documentation and Skills

To preserve complete delivery across both clients without relying on ranged-read
workarounds or host-event warnings:

- **Keep every Skill entrypoint (`SKILL.md`) at or below `8,000` UTF-8 bytes.**
  Exceeding `8,000` UTF-8 bytes causes Codex CLI to drop tail instructions
  silently during explicit Skill invocation, while keeping the file below `8,000`
  bytes also clears Copilot CLI's `20,480`-byte read limit. Clients enforce the
  exact hard threshold with no built-in buffer, so avoid packing right up to
  `8,000` bytes when routine maintenance edits are expected.
- **Apply progressive disclosure in `SKILL.md`.** Keep invocation boundaries,
  primary state and decision flow, explicit reference selectors, failure and
  stopping rules, output contracts, and completion criteria inside `SKILL.md`.
  Move branch-only procedures, detailed checklists, templates, and worked
  examples into Skill-local supporting references read only when a step selects
  them.
- **Keep every on-demand reference and Agent-read guide at or below `20,480`
  UTF-8 bytes (`20 KiB`).** Keeping each standalone reference, guide, or
  knowledge document within `20,480` UTF-8 bytes ensures Copilot CLI returns the
  entire file in a single unranged `view` call and stays comfortably below Codex
  CLI's `~40,000`-byte standard shell output limit. When workflows also target
  fallback models with a `10,000`-byte shell cap, keep high-frequency single-read
  references under `10,000` bytes or chunked cleanly.
- **Budget the complete `AGENTS.md` instruction chain under `32,768` UTF-8 bytes
  (`32 KiB`), while keeping each file at or below `20,480` UTF-8 bytes.** In
  Codex CLI, the combined UTF-8 byte total of every `AGENTS.md` loaded along
  the path from the repository root to the deepest working directory must fit
  within `project_doc_max_bytes` (`32,768` bytes by default)—for example, two
  `18,000`-byte files individually pass per-file checks yet still exceed the
  `32 KiB` chain budget and lose tail content in the nested file. Distinct from
  that aggregate chain budget, GitHub Copilot CLI enforces its `20,480`-byte
  per-file `view` ceiling when an Agent reads any individual `AGENTS.md` file
  directly, so keep each file within `20,480` bytes and keep the full
  root-to-leaf chain comfortably below `32,768` bytes.
- **Measure in UTF-8 bytes and split by responsibility rather than dropping
  constraints.** Check UTF-8 byte length directly (`wc -c`,
  `Buffer.byteLength(text, "utf8")`, or `len(text.encode("utf-8"))`) rather than
  estimating from line count or string length, especially for non-ASCII prose
  or wide Markdown tables. When an existing document exceeds its client ceiling,
  shrink it through progressive disclosure or principled responsibility splits
  that keep each reading unit self-contained rather than deleting edge cases,
  preconditions, or stopping rules.

## References

- [`github/copilot-cli#5476`: Built-in `functions.view` returns no content for large files despite documenting automatic truncation](https://github.com/github/copilot-cli/issues/5476)
- [`github/copilot-cli#5003`: Large tool output is spilled to an OS temp file without a stable session artifact or paging interface](https://github.com/github/copilot-cli/issues/5003)
- [`openai/codex` commit `7ce4437`: Skill prompt truncation (`MAX_SKILL_PROMPT_BYTES`)](https://github.com/openai/codex/blob/7ce4437488c69950fe87f1d8ab4b00bdb4bbd193/codex-rs/ext/skills/src/render.rs#L25)
- [`openai/codex` commit `7ce4437`: Fallback model truncation policy (`model_info.rs`)](https://github.com/openai/codex/blob/7ce4437488c69950fe87f1d8ab4b00bdb4bbd193/codex-rs/models-manager/src/model_info.rs#L126)
- [`openai/codex` commit `7ce4437`: Project doc byte cap (`DEFAULT_PROJECT_DOC_MAX_BYTES`)](https://github.com/openai/codex/blob/7ce4437488c69950fe87f1d8ab4b00bdb4bbd193/codex-rs/config/src/config_toml.rs#L76) and [cumulative `AGENTS.md` chain loading (`agents_md.rs`)](https://github.com/openai/codex/blob/7ce4437488c69950fe87f1d8ab4b00bdb4bbd193/codex-rs/core/src/agents_md.rs#L69-L165)
