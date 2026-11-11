---
name: handbook-filesystems
description: Use when designing, implementing, reviewing, diagnosing, testing, or understanding software or workflow behavior that opens, reads, writes, inspects, moves, deletes, or identifies files or directories, or depends on pathnames.
---

# Filesystems Handbook

This Handbook supplies required understanding for filesystem operations and
pathname-based resources. It selects reading rather than owning the user's task.
Treat the guidance as supplemental to instructions, requirements, Skills, and
project-specific decisions in the active working directory.

## Select the required reading

1. Resolve every link relative to this `SKILL.md`.
2. For filesystem operation work, read the complete foundation before making
   dependent design, implementation, diagnosis, test, or review decisions.
   Direct learning or explanation about general filesystem operations also uses
   this foundation because the three documents form one general package.
3. Evaluate every conditional package from the observable work and current
   materials. Read every matching package cumulatively; do not choose only the
   closest match.

This Handbook has no dependency on another Handbook. Continue the user's task
under the applicable Workflow or active-project process after loading and
applying the required understanding.

## Filesystem foundation

For designing, implementing, reviewing, diagnosing, testing, or understanding
filesystem operations and pathname-based resources, read these complete
documents:

- [Filesystem path-length compatibility](../../knowledge/filesystems/path-length-compatibility.md)
- [Pathnames and filesystem resource identity](../../knowledge/filesystems/pathnames-and-resource-identity.md)
- [Runtime filesystem APIs and native commands](../../knowledge/filesystems/runtime-apis-and-native-commands.md)

## Conditional required-reading packages

### Multi-step Node.js filesystem operations

When designing, implementing, reviewing, or directly learning about a
multi-step Node.js filesystem operation, read
[Node.js filesystem identity primitives](../../knowledge/nodejs/filesystem-identity-primitives.md)
in full together with the complete filesystem foundation.
