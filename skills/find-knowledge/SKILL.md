---
name: find-knowledge
description: Use when a task requires finding or applying knowledge stored in this plugin, or when the user asks what knowledge the plugin contains.
---

# Find knowledge

Use the repository knowledge index to retrieve only the material relevant to
the current task.

## Workflow

1. Resolve all paths in this skill relative to this `SKILL.md` file.
2. Read [`../../knowledge/index.md`](../../knowledge/index.md).
3. Compare the request with every `When to Read` condition and follow each
   matching leaf-document link.
4. Read only the selected documents; do not load the entire knowledge tree by
   default.
5. If the index contains no matching material, say so instead of inventing a
   knowledge-base answer.
6. Apply the selected knowledge to the task. Distinguish documented knowledge
   from your own inference.
7. Report the repository-relative paths of the documents used.

Read the shared index and documents directly. Do not depend on another skill
being invoked to retrieve them.
