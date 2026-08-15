# Add knowledge

1. Read [`knowledge/index.md`](../../../../knowledge/index.md), then search the
   existing `knowledge/` tree. Compare the candidate material with existing
   document Scopes and `When to Read` conditions for overlapping ownership.
2. Work only from the Knowledge parts identified during classification; return
   the remaining material to the parent workflow.
3. Confirm that each Knowledge part remains correct without access to its
   source project. Remove dependencies on named downstream repositories, fixed
   project paths or layouts, project domain models, organization policies, and
   private infrastructure. Product, platform, protocol, and engineering-domain
   specificity are valid. Return material whose meaning depends on its source
   project to the parent workflow as neither.
4. Update an existing document when it already owns the concept. Create a new
   document only for a distinct responsibility, placing it in a clear domain
   under `knowledge/` with the smallest useful document structure.
5. Give every Markdown document under `knowledge/`, including the root index,
   the required preface described below.
6. Keep `knowledge/index.md` as the only index. Organize leaf documents in
   domain directories, but list every leaf directly in the root index and do
   not create nested `index.md` files.
7. Add or update exactly one root-index row for every affected leaf document
   using the fields below.
8. Verify that every leaf document is listed exactly once, every changed
   relative link resolves, and each concept has one canonical owner.
9. Run `pnpm knowledge:check` from the repository root.

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
relative Markdown link from `knowledge/index.md` as its target. Point directly
to a leaf Knowledge document, list it exactly once, and confirm that the target
exists.

**When to Read.** Write a compact trigger beginning with `Read when` and name
the concrete tasks, decisions, or artifacts that require this material. Cover
each distinct trigger branch while avoiding topic summaries or vague phrases
such as “when relevant.” Make a single-responsibility request select one
canonical document, and compare the condition with every other row. Multiple
conditions may match a compound task only when their documents contribute
distinct, non-duplicated Knowledge. If two conditions route the same
responsibility, merge the documents or redraw their Scopes and conditions
before indexing them.
