---
name: contribute-to-knowledge-base
description: Contribute changes to the canonical knowledge base from outside its source checkout. Use when the user wants to add, correct, reorganize, or remove Knowledge or Skills through the installed plugin.
---

# Contribute to knowledge base

When this Skill proceeds past the source-checkout guard, work in an isolated
source checkout and treat installed plugin files as read-only runtime artifacts.

## Workflow

1. Resolve paths relative to this `SKILL.md`. Read
   [`../../plugin.json`](../../plugin.json) and use its `repository` field as
   the canonical upstream repository. If the active workspace is already
   within a source checkout of that repository, stop this Skill.
2. Create a uniquely named temporary directory and clone the upstream default
   branch into it. Use this fresh checkout unless the user explicitly requests
   an existing source checkout.
3. Create a descriptive contribution branch before editing files.
4. In the cloned repository, read every applicable `AGENTS.md`, then read
   `.agents/skills/add-to-knowledge-base/SKILL.md` directly and follow the
   authoring workflow and references it selects.
5. Implement the requested change and run the repository's documented
   validation. Review the complete diff for scope and consistency.
6. Commit the intended changes. Use an available authenticated GitHub
   integration or CLI to push the branch and open a draft pull request against
   the canonical repository's default branch. Push directly when permitted;
   otherwise, create or reuse an authenticated fork and open a cross-fork pull
   request.
7. Report the pull-request URL, changed paths, and validation results. Remove
   the temporary checkout only after the branch is available remotely and the
   pull request exists. If publishing fails, preserve the checkout and report
   its path and the exact blocker.

## Completion criteria

When this Skill proceeds past the source-checkout guard, finish only when the
requested change follows the cloned repository's authoring rules, validation
has been run, and a draft pull request exists or a publishing blocker has been
reported with a recoverable checkout path.
