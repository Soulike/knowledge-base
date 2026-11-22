# Update plugin versions

Treat one pull request as at most one release per changed plugin. Changes
within the pull request do not create additional releases.

Apply this workflow when the final diff changes any marketplace-registered
plugin's `knowledge/**`, `references/**`, or `skills/**`. Repository-maintenance
workflows and references under `.agents/**` and development documentation do
not belong to any plugin's version. The
[marketplace](../../../../.claude-plugin/marketplace.json) identifies every
registered plugin's package location independently at the comparison base,
target revision, and current revision.

The comparison base is the common ancestor of the PR's target revision and
head. The version checker uses it to decide which installed content and version
field changes belong to the PR for each plugin independently, and the local
update command generates from its plugin version. The checker separately reads
the current target revision to verify that each generated version is still the
next available release. This keeps local generation stable while allowing CI to
detect a version allocated after the PR diverged.

1. Stabilize the pull request's intended content and identify its target ref or
   revision. Refresh that ref when using a remote-tracking branch.
2. Run `pnpm knowledge-base-version:update <target-revision>` with that explicit
   target. The command resolves its common ancestor with `HEAD` and updates
   only plugins whose `knowledge/`, `references/`, or `skills/` changed; it
   does not select a target branch by default. CI passes the PR event's target
   and head SHAs to the checker, which resolves the same comparison base and
   reads the current target version separately.
3. Treat each generated `plugin.json` (such as the base plugin's
   [`plugin.json`](../../../../knowledge-base/plugins/knowledge-base/plugin.json))
   version as the pull request's single release version for that plugin.
   Repeated runs against the same comparison base on the same day are
   idempotent, including when only the target advances.
4. If validation reports that the current target has allocated the generated
   version, integrate the target, resolve any conflict, and rerun the command
   from the new comparison base. Also rerun it after another integration or
   after crossing a calendar date before the final commit. CI derives the date
   from the PR head commit's committer timestamp in `Asia/Shanghai`.
5. Run the repository validation after the generated manifests are final.

When any plugin's `plugin.json` (such as the base plugin's
[`plugin.json`](../../../../knowledge-base/plugins/knowledge-base/plugin.json))
conflicts, first produce valid JSON that preserves the intended non-version
fields from both sides. Treat either conflicting version as temporary, then
run the update command with the PR's target revision and use its result. The
sequence is derived from the resolved comparison base after integration, never
from either side of the conflict or from the working tree's existing version.
