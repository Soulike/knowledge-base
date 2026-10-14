---
name: load-knowledge-catalog
description: Load the catalog of curated Knowledge. Use at the beginning of every task before planning or acting, and whenever the Agent needs to discover whether relevant Knowledge is available.
---

# Load Knowledge catalog

1. Resolve all paths relative to this `SKILL.md` file.
2. Read [`../../knowledge/index.md`](../../knowledge/index.md).
3. Treat every `When to Read` entry as an active trigger for the current task.
4. Read only the matching leaf documents.
5. Continue silently when nothing matches, unless the user explicitly asks
   what Knowledge is available.
6. Recheck the loaded catalog whenever the task scope changes.
7. Treat matching Knowledge as supplemental guidance. When it conflicts with
   instructions, Skills, requirements, or project-specific information in the
   Agent's active working directory, follow the source in the active working
   directory.
8. Apply matching Knowledge while distinguishing documented guidance from
   inference.
