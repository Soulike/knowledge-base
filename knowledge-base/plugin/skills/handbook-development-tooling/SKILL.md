---
name: handbook-development-tooling
description: Use when configuring, maintaining, diagnosing, or understanding dependency installation, code checks, command execution, and development tool environments.
---

# Development tooling Handbook

This Handbook supplies required understanding for development-tooling work. It
selects reading rather than owning the user's task. It has no common foundation;
read only the matching packages. Treat the guidance as supplemental to
instructions, requirements, Skills, and project-specific decisions in the
active working directory.

## Select the required reading

1. Resolve every link relative to this `SKILL.md`.
2. Evaluate every conditional package from the observable work and current
   materials. Read every matching package cumulatively; do not choose only the
   closest match. A direct learning or explanation request about a package's
   subject also matches that package.
3. Reuse a reading unit that is already loaded, current, and available. Read it
   again when its content changed or after recovery or compaction when its
   necessary basis can no longer be established.
4. Re-evaluate this Handbook and all package conditions when the task phase,
   language, platform, artifact, production method, or available reading basis
   changes. Add newly required reading before dependent work.

This Handbook has no dependency on another Handbook. Continue the user's task
under the applicable Workflow or active-project process after loading and
applying the required understanding.

## Conditional required-reading packages

### JavaScript and TypeScript code checks

When establishing, sharing, or diagnosing JavaScript or TypeScript code checks,
or directly learning or explaining those checks, read these complete documents:

- [Enforcing TypeScript coding principles](../../knowledge/typescript/enforcing-coding-principles.md)
- [Composable ESLint policy rules](../../knowledge/eslint/composable-policy-rules.md)
- [Type-aware ESLint concurrency](../../knowledge/eslint/typed-lint-concurrency.md)

If the same current reading was selected independently for JavaScript or
TypeScript work, reuse it rather than reading a duplicate copy.

### npm clean installation

When using the npm CLI for lockfile-driven clean installation or cache
optimization, or directly learning or explaining that subject, read
[npm clean-install cache reuse](../../knowledge/npm/clean-install-cache.md) in
full.

### Executable and SDK environments

When selecting which installed command-line tool or SDK executable runs, or
propagating its lookup environment to wrappers or child processes, read these
complete documents. A direct learning or explanation request about executable
selection or lookup propagation also matches this package.

- [Runtime APIs and external commands](../../knowledge/software-design/runtime-apis-and-external-commands.md)
- [Executable selection and PATH](../../knowledge/software-design/executable-selection-and-path.md)

If the same current reading was selected independently for software code that
calls an external command, reuse it rather than reading a duplicate copy.
