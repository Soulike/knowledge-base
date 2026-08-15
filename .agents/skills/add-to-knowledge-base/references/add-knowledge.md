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
5. Update every affected index with concise descriptions and relative links.
6. Verify that each added document is reachable from
   `knowledge/index.md`, every changed relative link resolves, and no second
   source of truth was introduced.
