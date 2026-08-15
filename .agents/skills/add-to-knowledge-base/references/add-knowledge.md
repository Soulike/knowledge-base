# Add knowledge

1. Read [`knowledge/index.md`](../../../../knowledge/index.md), then search the
   existing `knowledge/` tree for overlapping concepts.
2. Extract the reusable facts, principles, explanations, and references from
   the input. Keep execution steps and Agent behavior in the Skill branch.
3. Update an existing document when it already owns the concept. Otherwise,
   choose a clear domain under `knowledge/` and create the smallest useful
   document structure.
4. Keep the root index as the domain catalog. Use a domain `index.md` to route
   to documents when the domain contains multiple files.
5. Add or update a row in every affected index using the fields below.
6. Verify that each added document is reachable from
   `knowledge/index.md`, every changed relative link resolves, and no second
   source of truth was introduced.

## Index fields

**File Path.** Use the repository-root-relative path as the link text and a
relative Markdown link from the containing index as its target. Point to the
most specific stable entry document, list it once in the appropriate index,
and confirm that the target exists.

**When to Read.** Write a compact trigger beginning with `Read when` and name
the concrete tasks, decisions, or artifacts that require this material. Cover
each distinct trigger branch while avoiding topic summaries or vague phrases
such as “when relevant.”
