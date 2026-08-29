# Update the primary plugin version

Treat one pull request as one primary-plugin release. Changes within the pull
request do not create additional releases.

Apply this workflow when the final diff changes root `knowledge/**`,
`references/**`, or `skills/**`. Independent content under `plugins/**`,
repository-authoring Skills and references under `.agents/**`, and repository
documentation do not belong to the primary plugin version.

1. Stabilize the pull request's intended content and integrate the latest PR
   base before generating the version.
2. Refresh the base ref, then run `pnpm plugin-version:update`. The command
   reads `origin/main` by default; pass another base ref as its only argument
   when the pull request targets a different ref.
3. Treat the generated [`plugin.json`](../../../../plugin.json) version as the
   pull request's single release version. Repeated runs against the same base on
   the same day are idempotent.
4. Rerun the command after rebasing, merging the base, resolving a conflict, or
   crossing a calendar date before the final commit. CI derives the date from
   the PR head commit's committer timestamp in `Asia/Shanghai`.
5. Run the repository validation after the generated manifest is final.

When [`plugin.json`](../../../../plugin.json) conflicts, first produce valid JSON
that preserves the intended non-version fields from both sides. Treat either
conflicting version as temporary, then run the update command and use its
result. The sequence is derived from the current PR base, never from either side
of the conflict or from the working tree's existing version.
