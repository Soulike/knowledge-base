# Knowledge index

## Scope

This index is the only routing catalog for Knowledge stored in the primary `knowledge-base` plugin and lists every leaf document directly with its Knowledge Type and reading trigger; subdirectories organize files by domain, while detailed subject matter belongs in the linked documents rather than here.

## When to update

Update this index when a leaf Knowledge document is added, removed, renamed, or assigned a different canonical responsibility, Knowledge Type, or `When to Read` condition.

## Documents

| File Path                                                                                                  | Knowledge Type | When to Read                                                                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [knowledge/agents/knowledge-and-skills.md](agents/knowledge-and-skills.md)                                 | evergreen      | Read when deciding whether reusable Agent material should be represented as Knowledge, a Skill, or a split of both.                                                                   |
| [knowledge/codex/github-copilot-enterprise-provider.md](codex/github-copilot-enterprise-provider.md)       | time-sensitive | Read when configuring or troubleshooting Codex to use a GitHub Copilot Enterprise subscription as a custom model provider.                                                            |
| [knowledge/filesystems/pathnames-and-resource-identity.md](filesystems/pathnames-and-resource-identity.md) | evergreen      | Read when designing or reviewing a multi-step filesystem operation whose pathname may be rebound between validation, use, mutation, placement, cleanup, or rollback.                  |
| [knowledge/github-actions/version-selection.md](github-actions/version-selection.md)                       | evergreen      | Read when creating, editing, or reviewing a GitHub Actions workflow that declares a third-party action, runtime, or tool version.                                                     |
| [knowledge/nodejs/filesystem-identity-primitives.md](nodejs/filesystem-identity-primitives.md)             | time-sensitive | Read when implementing filesystem identity safeguards with Node.js `node:fs`, including `FileHandle` use, open flags, resource ownership, error handling, or parent-directory limits. |
