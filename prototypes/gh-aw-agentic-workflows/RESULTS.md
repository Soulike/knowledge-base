# gh-aw v0.87.10 integration prototype results

## Scope and baseline

This throwaway prototype started from `origin/main` at `fb4d96d` and used the
verified compiler at `/private/tmp/ghaw-proxy.yMx7pz/darwin-arm64`, whose
SHA-256 is
`12c36a8037822fac5b7a8b217eea3f98f21310c2ee4c7acb2af7c05bc0e5056e`.
Every compiler or download command that accessed GitHub set `HTTP_PROXY` and
`HTTPS_PROXY` to `http://127.0.0.1:1087` for that command only.

The prototype sources are:

- [shared-runtime.md](../../.github/workflows/prototype-gh-aw/shared-runtime.md);
- [prototype-gh-aw-verify-time-sensitive.md](../../.github/workflows/prototype-gh-aw-verify-time-sensitive.md);
- [prototype-gh-aw-verify-evergreen.md](../../.github/workflows/prototype-gh-aw-verify-evergreen.md);
- [prototype-gh-aw-verify-agent-content.md](../../.github/workflows/prototype-gh-aw-verify-agent-content.md); and
- [prototype-gh-aw-pr-review.md](../../.github/workflows/prototype-gh-aw-pr-review.md).

Their generated lock files and the generated
[action lock](../../.github/aw/actions-lock.json) are committed with the sources.
The prototype also excludes generated `*.lock.yml` files from Prettier because
running Prettier over compiler output makes the repository format check and
compiler reproducibility disagree.

## Final compiler result

The following command compiled and validated all four workflows:

```bash
HTTP_PROXY=http://127.0.0.1:1087 \
HTTPS_PROXY=http://127.0.0.1:1087 \
/private/tmp/ghaw-proxy.yMx7pz/darwin-arm64 compile \
  --gh-aw-ref v0.87.10 \
  --strict \
  --validate
```

The result was `Compiled 4 workflows: 4 succeeded, 5 warnings`. Four warnings
are the expected supply-chain warnings for the settled floating
`engine.version: latest`; the other is the expected `pull_request_target`
risk warning. The resolved gh-aw action SHA is
`ff62cdbec36230acbae869ddb28806e8eca01ea1`.

## Answers

### 1. Shared runtime, scheduled workflows, and staged mode

Yes. All three scheduled sources import
[shared-runtime.md](../../.github/workflows/prototype-gh-aw/shared-runtime.md),
and their generated lock files contain
`GH_AW_SAFE_OUTPUTS_STAGED: ${{ vars.GH_AW_STAGED == 'true' }}`. The same
expression is also rendered into activation metadata as `GH_AW_INFO_STAGED`.

The shared component can own tools, MCP servers, network policy,
`pre-agent-steps`, and safe-output foundations. It cannot own the Copilot
engine identity, version, or model: v0.87.10 imports accept only `engine.mcp`
from a shared component. Each task workflow therefore retains its own
`engine: { id: copilot, version: latest, model: ... }` task contract.

### 2. Tavily HTTP MCP

Yes. The compiled MCP gateway configuration contains:

```json
{
  "type": "http",
  "url": "https://mcp.tavily.com/mcp/",
  "headers": {
    "Authorization": "Bearer ${TAVILY_API_KEY}"
  },
  "allowed": ["tavily_search", "tavily_extract"]
}
```

The lock-file manifest lists only `tavily_extract` and `tavily_search` for the
Tavily server, and the generated Copilot arguments allow exactly those two MCP
tools. The secret is passed to the MCP gateway and excluded from the Agent
container environment. No live Tavily request was made.

### 3. Floating external Skills in a trusted pre-agent step

Yes. The imported pre-agent step survives compilation after base-folder
restoration and before MCP startup. It runs `npx --yes skills@latest add
mattpocock/skills ...` without a frontmatter `skills:` entry, so v0.87.10 does
not resolve the external repository to a compile-time SHA.

An isolated local execution of the same command, with GitHub access through the
required proxy, installed `codebase-design`, `tdd`, and `writing-for-agents`
under `.agents/skills/`. `skills list --agent github-copilot --json` reported
all three as project-scoped GitHub Copilot Skills. The generated Agent job
mounts the workspace into the sandbox after this step.

### 4. Trusted base checkout and head-object fetch

Yes, with a compiler-driven correction. The final PR lock checks out
`${{ github.event.pull_request.base.sha }}` with `fetch-depth: 0` and
`persist-credentials: false`. A later trusted pre-agent step receives the PR
number and expected head through step environment variables, fetches
`refs/pull/${PR_NUMBER}/head` into `FETCH_HEAD`, and verifies that
`git rev-parse FETCH_HEAD` equals the expected head. It never runs `git
checkout`, `git switch`, or an equivalent operation on the head.

The Agent receives only these Git command prefixes: `git cat-file`, `git diff`,
`git log`, `git ls-tree`, `git merge-base`, `git rev-parse`, `git show`, and
`git status`. Copilot CLI uses prefix matching for these `shell(...)` grants.

The direct configuration
`checkout.fetch: ${{ github.event.pull_request.head.sha }}` is not usable in
v0.87.10 strict mode. The compiler rendered that expression directly inside
its generated `git fetch` shell command and failed with `CTR-006: template
injection vulnerabilities detected in compiled workflow`. Production should
retain the explicit environment-variable pre-agent fetch until the compiler
path is fixed upstream.

### 5. Review safe outputs, jobs, permissions, and schema

There is no unlimited inline-comment mode. The schema accepts 1 through 100;
the prototype uses the maximum, 100. The generated tool description says
`Maximum 100 review comment(s) can be created`, while the consolidated review
maximum is one and its dynamically injected event enum is only `COMMENT`.

With fail-closed threat detection enabled, the PR lock contains this DAG and
permission set:

| Job              | Needs                                                                | Permissions                                                                        |
| ---------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `pre_activation` | none                                                                 | none                                                                               |
| `activation`     | `pre_activation`                                                     | `actions: read`, `contents: read`                                                  |
| `agent`          | `activation`                                                         | `contents: read`, `copilot-requests: write`, `issues: read`, `pull-requests: read` |
| `detection`      | `activation`, `agent`                                                | `contents: read`, `copilot-requests: write`                                        |
| `safe_outputs`   | `activation`, `agent`, `detection`                                   | `pull-requests: write`                                                             |
| `ai_review_gate` | `agent`, `safe_outputs`                                              | `contents: read`, `pull-requests: write`                                           |
| `conclusion`     | `activation`, `agent`, `ai_review_gate`, `detection`, `safe_outputs` | `actions: read`, `issues: write`, `pull-requests: write`                           |

The generated safe-output configuration pins both review handlers to
`${{ github.event.pull_request.head.sha }}`, sets inline `max` to 100, sets
review `max` to 1, and restricts `allowed_events` to `COMMENT`. The generated
validator requires `path`, positive `line`, and sanitized `body` for inline
comments; it validates optional `start_line`, `side` (`LEFT` or `RIGHT`), PR
number, and repository. Review bodies are sanitized strings of at most 65,000
characters, review events are enum-validated, and PR numbers and repositories
are validated separately.

### 6. Repository-owned `AI review gate`

Yes. A top-level custom job with ID `ai_review_gate`, display name exactly
`AI review gate`, `if: always()`, and explicit `needs: [agent, safe_outputs]`
compiles without a dependency cycle. The compiler then automatically makes its
generated `conclusion` job depend on the gate as well. The gate can check out
the trusted base SHA and run the repository-owned exact-head/verdict program.

### 7. Attribution after review-body sanitization

An Agent-supplied hidden marker is not viable. A direct v0.87.10 sanitizer
execution removed this entire suffix while retaining the visible Markdown
fields:

```markdown
<!-- knowledge-base-ai-review verdict=approved head=... run-id=... run-attempt=... -->
```

The trustworthy surviving attribution is gh-aw's own
`<!-- gh-aw-agentic-workflow: ... id: RUN_ID, workflow_id: ..., run: URL -->`
marker. The safe-output runtime appends it after sanitizing the Agent-provided
review body. The gate should use that framework-owned run ID and review author,
query the current run-attempt jobs through the Actions API to exclude a review
from an older attempt, require the review's API `commit_id` to equal the event
head, and parse the visible sanitized verdict/count/head fields. It must not
trust a hidden marker authored by the Agent.

`github.run_attempt` itself is also not accepted by v0.87.10's workflow
expression allowlist. An attempted review-body/footer expression failed
compilation as `1 unauthorized expressions found` for `github.run_attempt`.
The gate should use its runner-provided `GITHUB_RUN_ATTEMPT` and the Actions API
instead of trying to interpolate that context into the Agent body.

### 8. Model, reasoning effort, and floating Copilot CLI

Yes, with one runtime limitation. `engine.version: latest` compiles to
`install_copilot_cli.sh latest`, so Copilot CLI remains floating rather than
being pinned by this repository. `engine.model` accepts the repository-variable
expression and compiles to `COPILOT_MODEL`.

v0.87.10 has no native reasoning-effort field. The repository variable can be
forwarded only through `engine.args`, which renders an unconditional
`--reasoning-effort VALUE`. Current Copilot CLI accepts `none`, `minimal`,
`low`, `medium`, `high`, `xhigh`, and `max`, but not `auto`. Therefore the
existing `auto` behavior cannot be represented faithfully without a wrapper
that omits both arguments. Production must either use a concrete validated
effort value, omit the argument entirely, or introduce and own such a wrapper.

## Production design corrections

1. Keep the shared runtime below the engine/task-contract boundary; repeat the
   small engine stanza in each workflow.
2. Replace “unlimited inline comments” with an explicit maximum of 100, or add
   a deliberate truncation/failure policy if more findings are possible.
3. Fetch the PR head in a trusted environment-variable step and verify
   `FETCH_HEAD`; do not use v0.87.10's expression-valued `checkout.fetch` path.
4. Authenticate reviews from gh-aw's post-sanitization attribution marker and
   GitHub API state, not an Agent-authored hidden marker.
5. Do not pass `auto` to `--reasoning-effort`; choose a concrete value, omit the
   option, or add a conditional wrapper.
6. Exclude generated gh-aw lock files from Prettier while continuing to compile
   them with strict validation.
