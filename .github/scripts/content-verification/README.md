# Scheduled content verification

Three scheduled tasks verify the default branch without editing it:

| Task                                                                                                                                                                     | Scope                                     | Schedule                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- | ------------------------------ |
| [Time-sensitive source](../../workflows/verify-time-sensitive-knowledge.md) and [generated workflow](../../workflows/verify-time-sensitive-knowledge.lock.yml)           | Knowledge indexed as `time-sensitive`     | Monthly, day 1 at 03:17 UTC    |
| [Evergreen source](../../workflows/verify-evergreen-knowledge.md) and [generated workflow](../../workflows/verify-evergreen-knowledge.lock.yml)                          | Knowledge indexed as `evergreen`          | Quarterly, day 8 at 03:43 UTC  |
| [Maintained Agent content source](../../workflows/verify-maintained-agent-content.md) and [generated workflow](../../workflows/verify-maintained-agent-content.lock.yml) | Skills, references, instructions, prompts | Quarterly, day 15 at 04:11 UTC |

Each task also supports manual dispatch. Target discovery uses tracked files and
the parsed Knowledge index. A Skill bundle contains its `SKILL.md` and tracked
files below the same directory. References inside a Skill belong to that
bundle. Each tracked reference under a package-level `references/` directory
is verified once as its own unit. Each tracked `AGENTS.md` not already owned by
a Skill or shared-reference target is an Agent-instruction unit. Markdown files
under one `.github/scripts/*/prompts/` directory form one prompt unit.

## Shared Agentic runtime

All three tasks import the
[shared Agentic workflow runtime](../../workflows/shared/agentic-runtime.md).
Before inference, the runtime rejects a missing, `auto`, or unsupported
`CONTENT_VERIFICATION_REASONING_EFFORT`. Each task then derives an immutable
manifest from `git ls-files`, the parsed
[Knowledge index](../../../knowledge/index.md), and the checked out revision.
An invalid index, duplicate ownership, empty scope, or mutable revision fails
before the Agent runs.

The tasks share target discovery, a read-only GitHub tool boundary, remote
Tavily search and extraction, floating external review Skills, staged safe
outputs, and a repository-owned publication gate. Their names, schedules,
scopes, concurrency identities, and review standards remain task-specific:

- time-sensitive Knowledge verifies externally dependent claims against current
  authoritative sources;
- evergreen Knowledge verifies reasoning, scope, internal consistency, and
  whether the content remains correctly classified as evergreen; and
- maintained Agent content reviews Skill bundles, shared references, Agent
  instructions, and prompt bundles for invocation, workflow, output, tooling,
  portability, routing, package, and lifecycle responsibilities.

Each Agent must finish content analysis before it searches open and closed
issue history. A closed issue constrains an unchanged finding only when a
trusted maintainer explicitly says the disposition should govern later
verification while its premises remain unchanged; closure alone does not.
Changed evidence or repository behavior may justify a new issue that cites the
prior decision.

Completion is carried by gh-aw safe outputs rather than a parsed final answer:

- `create_issue` requests at most one combined maintenance issue per affected
  target;
- `noop` declares that no new issue is required; and
- `report_incomplete` fails the workflow when evidence, tools, targets, or
  analysis are incomplete.

A trusted gate runs after the Agent and before publication. It validates the
manifest shape for the selected scope and rejects
`report_incomplete`, missing-tool/data signals, malformed terminal output,
unknown targets, duplicate issues for one target, and issue bodies that are not
bound to the manifest revision. The safe-output job cannot run unless this gate
succeeds.

The Agent has no issue-write credential. The separate safe-output job applies
accepted issue requests with the `automated-verification` and
`modification-required` labels and assigns them to `Soulike`. Threat detection
must succeed before that job runs.

Publication is fail-closed. Safe outputs remain staged previews unless the
repository variable `CONTENT_VERIFICATION_ISSUE_PUBLICATION_ENABLED` is exactly
`true`; the gh-aw conclusion job is also suppressed while publication is
disabled so framework failure or threat-detection reporting cannot create an
issue outside staged safe outputs. The workflow also requires the
`TAVILY_API_KEY` Actions secret before external research can complete.

## Generated workflow contract

The repository compiles Agentic workflow sources with gh-aw `v0.87.10`. The
generated `*.lock.yml` workflow and
[action lock](../../aw/actions-lock.json) are committed review artifacts.
Install that exact compiler and regenerate them with:

```bash
gh extension install github/gh-aw --pin v0.87.10
pnpm agentic:compile
```

For a reviewed standalone compiler binary, set `GH_AW_COMPILER` to its path;
the wrapper still rejects any version other than `v0.87.10`.

`pnpm agentic:check` recompiles and rejects generated drift. CI runs this check
before the repository's type, lint, formatting, link, Knowledge-format, and
test gates. Generated lock workflows are excluded from Prettier because gh-aw
is their authoritative formatter.

`CONTENT_VERIFICATION_MODEL` remains optional and defaults to `auto`. A concrete
`CONTENT_VERIFICATION_REASONING_EFFORT` configures all three tasks and is
mandatory; `auto` is rejected before inference because gh-aw forwards the value
to Copilot CLI's explicit `--reasoning-effort` option.
