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
4. Apply the ownership and generalization rules below before choosing a
   destination. Use the resulting claim scopes and document boundaries
   throughout the remaining steps.
5. Compare the candidate material with each existing candidate document's
   pre-edit Scope, root-index `When to Read` condition, and `When to update`
   trigger. Select that document only when all three describe the same
   responsibility; otherwise select a separate owner.
6. Update an existing document when it already owns the concept. Create a new
   document only for a distinct responsibility, placing it in a clear domain
   under `knowledge/` with the smallest useful document structure.
7. Give every Markdown document under `knowledge/`, including the root index,
   the required preface described below.
8. Keep `knowledge/index.md` as the only index. Organize leaf documents in
   domain directories, but list every leaf directly in the root index and do
   not create nested `index.md` files.
9. Add or update exactly one root-index row for every affected leaf document
   using the fields below, including its Knowledge Type.
10. Verify that every leaf document is listed exactly once with one valid
    Knowledge Type, every changed relative link resolves, and each concept has
    one canonical owner. Compare every changed Scope and routing trigger with
    its pre-edit form; keep additions that express the same responsibility and
    route independent responsibilities separately.
11. Run `pnpm knowledge:check` from the repository root.

## Ownership and generalization

Generalize source material to the narrowest stable abstraction supported by the evidence. Separate direct observations from the invariant that explains them and the conditions it requires. Remove source-project details only when they do not affect that invariant, and retain product, platform, protocol, runtime, or environmental qualifiers that the evidence has not displaced. Authoritative contracts, documented semantics, mechanism-level reasoning, and representative observations can support a broader claim; analogy alone supports only a hypothesis.

Test ownership against the pre-edit boundary. Topical overlap makes a document a candidate, while canonical ownership requires the same responsibility. Using a newly widened Scope or routing condition as proof of fit is circular. Revise a boundary when it states the same pre-edit responsibility more accurately; select a separate owner when the material introduces an independent responsibility, read trigger, or maintenance trigger. Compare the old and new routing conditions after drafting to catch a boundary widened to admit the material.

Split a general principle from a product- or platform-specific mapping only when each has a distinct canonical responsibility, an independently useful `When to Read` condition, an independent `When to update` trigger, and enough substance to stand alone. Keep specific material with the general principle when it only demonstrates or translates it. Use paired documents when the mapping owns independently needed API choices, runtime behavior, limitations, or maintenance triggers, and make the mapping reference rather than restate the principle.

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

**Knowledge Type.** Classify each leaf document as `time-sensitive` or
`evergreen` according to the correctness of its substantive claims within its
declared Scope:

- **Time-sensitive Knowledge** depends on external state that is expected to
  evolve, so changes outside the document can make its substantive claims no
  longer correct. External state includes implementations, rules, policies,
  standards, data, capabilities, environments, and professional consensus.
- **Evergreen Knowledge** remains correct across ordinary changes to external
  state within its declared Scope. It may still require revision when its
  underlying principles, mechanisms, evidence, or Scope change.

Ask: while the declared Scope stays fixed, could ordinary evolution of the
external state make the document's substantive claims no longer correct even
if the document itself does not change? Classify `time-sensitive` when the
answer is yes and `evergreen` when the answer is no. Classify the claims the
document makes, not the subject it discusses: a method for finding a current
version can be evergreen even though version availability changes frequently.

**When to Read.** Write a compact trigger beginning with `Read when` and name
the concrete tasks, decisions, or artifacts that require this material. Cover
each distinct trigger branch while avoiding topic summaries or vague phrases
such as “when relevant.” Make a single-responsibility request select one
canonical document, and compare the condition with every other row. Multiple
conditions may match a compound task only when their documents contribute
distinct, non-duplicated Knowledge. If two conditions route the same
responsibility, merge the documents or redraw their Scopes and conditions
before indexing them.
