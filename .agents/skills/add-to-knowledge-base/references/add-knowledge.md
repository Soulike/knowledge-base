# Add knowledge

1. Read [`knowledge/index.md`](../../../../knowledge/index.md), then search the
   existing `knowledge/` tree for overlapping concepts.
2. Work only from the Knowledge parts identified during classification; return
   the remaining material to the parent workflow.
3. Update an existing document when it already owns the concept. Otherwise,
   choose a clear domain under `knowledge/` and create the smallest useful
   document structure.
4. Give every Markdown document under `knowledge/`, including indexes, the
   required preface described below.
5. Keep the root index as the domain catalog. Use a domain `index.md` to route
   to documents when the domain contains multiple files.
6. Add or update a row in every affected index using the fields below.
7. Verify that each added document is reachable from
   `knowledge/index.md`, every changed relative link resolves, and no second
   source of truth was introduced.
8. Run `pnpm knowledge:check` from the repository root.

## Knowledge document preface

Begin every `knowledge/**/*.md` file with this structure:

```markdown
# Descriptive title

## Scope

One cohesive prose paragraph.

## When to update

One cohesive prose paragraph.
```

**Scope.** Define the document's ownership boundary and purpose, including its
intended level of detail. When neighboring documents could plausibly own the
same material, state what this document excludes. Write one cohesive paragraph
that explains the boundary; do not enumerate headings, topics, or table-of-
contents entries.

**When to update.** Name observable changes that would make the document stale
or incomplete, such as changes to its source material, supported behavior,
policy, or coverage boundary. These are maintenance triggers, distinct from the
tasks and decisions that cause an Agent to read the document. Write one
cohesive paragraph; avoid vague phrases such as “update as needed” and avoid
lists of editing steps.

## Index fields

**File Path.** Use the repository-root-relative path as the link text and a
relative Markdown link from the containing index as its target. Point to the
most specific stable entry document, list it once in the appropriate index,
and confirm that the target exists.

**When to Read.** Write a compact trigger beginning with `Read when` and name
the concrete tasks, decisions, or artifacts that require this material. Cover
each distinct trigger branch while avoiding topic summaries or vague phrases
such as “when relevant.”
