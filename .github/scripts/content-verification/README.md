# Scheduled content verification

Three workflows verify the default branch without editing it:

| Workflow                                                                                     | Scope                                     | Schedule                       |
| -------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------ |
| [`verify-time-sensitive-knowledge.yml`](../../workflows/verify-time-sensitive-knowledge.yml) | Knowledge indexed as `time-sensitive`     | Monthly, day 1 at 03:17 UTC    |
| [`verify-evergreen-knowledge.yml`](../../workflows/verify-evergreen-knowledge.yml)           | Knowledge indexed as `evergreen`          | Quarterly, day 8 at 03:43 UTC  |
| [`verify-skills.yml`](../../workflows/verify-skills.yml)                                     | Skill bundles and shared Skill references | Quarterly, day 15 at 04:11 UTC |

Each workflow also supports manual dispatch. A Skill bundle contains its
`SKILL.md` and tracked files below the same directory. References inside a Skill
belong to that bundle. Each tracked reference under a package-level
`references/` directory is verified once as its own unit.

The verifier installs `codebase-design`, `tdd`, and `writing-for-agents` as
review-only guidance. The model can read the exact checked-out revision, search
and fetch unrestricted current authoritative web sources, and read open issues
for final deduplication. It has no shell or Git-history access. Deterministic
orchestration verifies the revision, discovers tracked targets, and checks that
the workspace remains clean. The model must return one validated result for
every discovered unit. It does not install the knowledge-base plugin because
that plugin is the review subject. The publisher runs as a separate job with
issue-write permission and revalidates the result before changing GitHub state.

Results use these statuses:

- `current`: no issue is created or updated.
- `modification-required`: comment on the matching open issue selected by the
  verifier, or create an assigned `modification-required` issue.
- `verification-failed`: comment on the matching open issue selected by the
  verifier, or create an assigned `verification-failed` issue, then fail the
  workflow.

One open issue may match several review units. The publisher groups those units
into one comment after confirming that the issue remains open, is not a pull
request, and names each reviewed unit ID in its title or body. A unit that
fails this check receives a new issue instead.

Operational failures also create or update an open failure issue and fail the
workflow. Verification searches only open issues. If a selected issue closes
before publication, the publisher creates a new issue. The automation never
closes issues. New issues are assigned to `Soulike` and receive the
`automated-verification` label.

Every created issue and comment carries a stable marker for its workflow run
and review unit. On a retry, the publisher accepts only markers authored by
`github-actions[bot]`, skips results already published to open issues, and
continues with the remaining results. The run attempt is deliberately excluded
from marker identity.

The optional repository variables `CONTENT_VERIFICATION_MODEL` and
`CONTENT_VERIFICATION_REASONING_EFFORT` select the Copilot model and reasoning
effort. Both default to `auto`.
