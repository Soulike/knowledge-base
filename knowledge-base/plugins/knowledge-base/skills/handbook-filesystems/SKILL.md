---
name: handbook-filesystems
description: Use when designing, implementing, reviewing, diagnosing, testing, or understanding software or workflow behavior that operates on files, directories, or pathname-based resources.
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
   closest match. A direct learning or explanation request about a conditional
   package's subject matches that package without automatically loading the
   general filesystem foundation unless the package specifies otherwise.

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

### Node.js asynchronous and synchronous filesystem APIs

When designing, implementing, reviewing, or diagnosing Node.js code that
performs any filesystem operation (whether single-step or multi-step, such as
reads, writes, directory scans, initialization, or cleanup), or when directly
learning or explaining when to choose `node:fs/promises` versus synchronous
`*Sync` APIs, read
[Asynchronous Node.js filesystem APIs](../../knowledge/nodejs/asynchronous-filesystem-apis.md)
in full. Selecting this package does not replace
[Multi-step Node.js filesystem operations](#multi-step-nodejs-filesystem-operations);
evaluate both packages independently and read every match cumulatively.

### Multi-step Node.js filesystem operations

When designing, implementing, reviewing, or directly learning about a
multi-step Node.js filesystem operation, read
[Node.js filesystem identity primitives](../../knowledge/nodejs/filesystem-identity-primitives.md)
in full together with the complete filesystem foundation.

### Node.js `file:` URLs and filesystem paths

When designing, implementing, reviewing, or diagnosing Node.js code that
converts between `file:` URLs and operating-system filesystem paths or passes
`file:` URLs to filesystem, module, or child-process interfaces, or when
directly learning or explaining those Node.js conversions, read
[Node.js file URLs and filesystem paths](../../knowledge/nodejs/file-urls-and-filesystem-paths.md)
in full.
