# Knowledge index

## Scope

This index is the only routing catalog for Knowledge stored in the primary `knowledge-base` plugin and lists every leaf document directly with its Knowledge Type and reading trigger; subdirectories organize files by domain, while detailed subject matter belongs in the linked documents rather than here.

## When to update

Update this index when a leaf Knowledge document is added, removed, renamed, or assigned a different canonical responsibility, Knowledge Type, or `When to Read` condition.

## Documents

| File Path                                                                                                  | Knowledge Type | When to Read                                                                                                                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [knowledge/agents/knowledge-and-skills.md](agents/knowledge-and-skills.md)                                 | evergreen      | Read when deciding whether reusable Agent material should be represented as Knowledge, a Skill, or a split of both.                                                                                                                 |
| [knowledge/chromium/ios-ui-architecture.md](chromium/ios-ui-architecture.md)                               | time-sensitive | Read when designing, implementing, maintaining, or reviewing UI features in Chromium or Chromium-derived iOS browsers and deciding their layer, owner, dependency, or communication.                                                |
| [knowledge/codex/github-copilot-enterprise-provider.md](codex/github-copilot-enterprise-provider.md)       | time-sensitive | Read when configuring or troubleshooting Codex to use a GitHub Copilot Enterprise subscription as a custom model provider.                                                                                                          |
| [knowledge/documentation/authoritative-guidance.md](documentation/authoritative-guidance.md)               | evergreen      | Read when deciding whether durable engineering guidance is needed, choosing its authoritative artifact or stable owner, designing routing or Agent instruction structure, or assessing documentation impact from a changed meaning. |
| [knowledge/filesystems/pathnames-and-resource-identity.md](filesystems/pathnames-and-resource-identity.md) | evergreen      | Read when designing or reviewing a multi-step filesystem operation whose pathname may be rebound between validation, use, mutation, placement, cleanup, or rollback.                                                                |
| [knowledge/github-actions/version-selection.md](github-actions/version-selection.md)                       | evergreen      | Read when creating, editing, or reviewing a GitHub Actions workflow that declares a third-party action, runtime, or tool version.                                                                                                   |
| [knowledge/nodejs/filesystem-identity-primitives.md](nodejs/filesystem-identity-primitives.md)             | time-sensitive | Read when implementing filesystem identity safeguards with Node.js `node:fs`, including `FileHandle` use, open flags, resource ownership, error handling, or parent-directory limits.                                               |
| [knowledge/software-engineering/source-comments.md](software-engineering/source-comments.md)               | evergreen      | Read when writing, changing, or reviewing source comments or docstrings, or when a code change may make existing explanatory prose stale.                                                                                           |
