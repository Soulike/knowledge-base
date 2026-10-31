# Maintain Knowledge

All content paths in this workflow are relative to the
[knowledge-base plugin](../../../../knowledge-base/plugin/), except commands
explicitly run from the repository root.

1. Read [`knowledge/index.md`](../../../../knowledge-base/plugin/knowledge/index.md) and
   [Design selection triggers](../../../../knowledge-base/plugin/references/agents/selection-triggers.md),
   then search the existing `knowledge/` tree. Compare every affected
   responsibility with existing document Scopes and `When to Read` conditions
   for overlapping ownership.
2. Work only from the Knowledge parts identified during classification; return
   the remaining material to the parent workflow.
3. Reapply every boundary test in
   [Classifying Knowledge and Skill material](../../../../knowledge-base/plugin/references/agents/knowledge-and-skills.md)
   before editing `knowledge/`. Return material that does not qualify as
   Knowledge to the parent as Skill or Skill-reference content.
4. Confirm that each remaining Knowledge part remains correct without access
   to its source project. Remove dependencies on named downstream repositories,
   fixed project paths or layouts, project domain models, organization policies,
   and private infrastructure. Product, platform, protocol, and engineering-
   domain specificity are valid. Return material whose meaning depends on its
   source project to the parent workflow as neither.
5. Apply the ownership and generalization rules below before choosing a
   destination or operation. Use the resulting claim scopes and document
   boundaries throughout the remaining steps.
6. Complete the [ownership and retrieval assessment](#ownership-and-generalization)
   for each affected responsibility before selecting its destination or
   operation. Return its evidence and proposed disposition to the parent for
   assessment-only work; resume below only when edits are authorized.
7. Apply the parent-selected disposition to each affected responsibility unit.
   When an existing document owns the concept, rewrite the complete affected
   block in place, remove superseded wording, and leave one coherent current
   model rather than layering new qualifications onto the old one. Merge or
   split documents only when the ownership tests below require it. Create a new
   document only for a distinct responsibility, placing it in a clear domain
   under `knowledge/` with the smallest useful document structure.
8. Give every Markdown document under `knowledge/`, including the Knowledge
   catalog, the required preface described below.
9. Keep [`knowledge/index.md`](../../../../knowledge-base/plugin/knowledge/index.md) as the only
   routing catalog. Organize leaf documents in domain directories, but list
   every remaining leaf directly in the catalog and do not create nested
   catalogs or leaf-level `Related Knowledge`, `See also`, or similar routing
   appendices. Before linking one leaf from another, apply the
   [inline-dependency test](#admit-inline-knowledge-dependencies). Link a
   retained dependency where it is applied and include the local context needed
   to use the current document.
10. Apply the assessed routing disposition to
    [`knowledge/index.md`](../../../../knowledge-base/plugin/knowledge/index.md)
    using the fields below, including its Knowledge Type. Check the final
    selections against the requests established during ownership assessment,
    including any retained route. Repair every route
    and inline dependency affected by a move, merge, split, rename, or removal.
11. Verify that every remaining leaf document is listed exactly once with one
    valid Knowledge Type, serves its `When to Read` condition without requiring
    another leaf as a prerequisite, contains no routing appendix, and resolves
    every changed relative link. Confirm that every added or materially changed
    inline link between Knowledge leaves passes the inline-dependency test and
    that its target fits the scope of the source claim. Confirm that each
    concept has one canonical owner and each revised document presents one
    coherent current model. Compare every changed Scope and routing trigger
    with its pre-edit form; keep additions that express the same responsibility
    and route independent responsibilities separately. Confirm that removed
    leaves and obsolete routes no longer remain.
12. Run `pnpm knowledge:check` from the repository root.

## Admit inline Knowledge dependencies

An inline link between Knowledge leaves records that a source claim depends on
the target's canonical responsibility; it does not make the target prerequisite
reading. The source must still state enough context to serve its own catalog
route. Apply this deletion test before adding or retaining a link:

First fix the comparison boundary for both leaves. For an existing leaf, use
its trusted pre-edit Scope, Knowledge catalog `When to Read` condition, and
responsibility. For a new leaf, use the responsibility, retrieval condition,
consumers, and maintenance lifecycle established by classification before its
content or links are drafted; its proposed Scope must express rather than widen
that boundary.

1. Remove the link and its asserted dependency while preserving the source's
   local explanation. Name the exact claim whose correctness, authority, or
   application would change. If no source claim depends on the target, omit the
   link.
2. Confirm that the target's comparison boundary owns the premise, decision,
   or mapping on which that source claim relies. State the context needed to
   apply the dependency locally without duplicating the target's responsibility.
3. Confirm that the dependency belongs to the source's comparison boundary. A
   sentence or branch whose only contribution is related reading, an optional
   technique, or an independently retrievable language-, platform-, product-,
   or implementation-specific specialization fails this check and should rely
   on the target's `When to Read` condition in the Knowledge catalog.

Keep the link only when all three checks establish a dependency within the
source responsibility. Related reading, optional techniques, and independently
retrievable specializations remain separate Knowledge routes.

## Ownership and generalization

Generalize source material to the narrowest stable abstraction supported by the evidence. Separate direct observations from the invariant that explains them and the conditions it requires. Remove source-project details only when they do not affect that invariant, and retain product, platform, protocol, runtime, or environmental qualifiers that the evidence has not displaced. Authoritative contracts, documented semantics, mechanism-level reasoning, and representative observations can support a broader claim; analogy alone supports only a hypothesis.

Assess ownership and retrieval before choosing an existing or new owner,
including during read-only contribution triage:

1. State the concrete reader tasks, subject-specific decisions, and explanatory
   model the material must support, together with the context available before
   reading it. Use these needs to find candidate owners rather than reducing
   the material to a shared principle.
2. Read each candidate's actual pre-edit content alongside its Scope, catalog
   `When to Read` condition, and `When to update` trigger. Confirm that the
   content and these boundaries describe the same responsibility. For each
   required decision or explanation, identify the supporting body-content
   location and how it supports the need, a gap to correct within that established responsibility, or an independently needed
   responsibility the candidate does not own. Justify a same-owner correction
   by the subject decision model already present, not by broad Scope or route
   labels alone. Topical overlap, a shared premise, and loading by a consuming
   Skill identify candidates; they do not establish ownership of a different
   decision model. An uncovered detail alone also does not justify a new owner.
3. Form natural requests and expected selections using
   [Design selection triggers](../../../../knowledge-base/plugin/references/agents/selection-triggers.md#check-selection-from-requests).
   Run selection against the real candidate catalog. Record each request and
   the actual selected candidates, including no selection, separately from the
   expected choices. Compare the observed selections with the content coverage
   established above. A condition mentioning the subject or an assertion that
   it covers the request is not a recorded selection observation.
4. Distinguish a route that inadequately expresses an existing responsibility
   from material that introduces a distinct subject responsibility. For the
   former, retain the owner and propose a trigger correction; for the latter,
   select a separate owner when the independent reading and maintenance needs
   justify it. A missed selection alone does not justify another document.

Keep a reviewable ownership and retrieval account in the work record: the
reader needs, candidate coverage and gaps with pre-edit source locations,
requests and expected versus observed selections, and the resulting ownership
and route dispositions. Conclude fit only from that account. Missing selection
observations or unexamined required decisions leave fit unresolved; report the
missing evidence rather than claiming established fit.
Incomplete evidence may support an explicitly provisional proposal, but not a
settled canonical owner or no-route-change conclusion.

For example, verifying identity before acting can be a shared premise in
storage access and approval handling. A storage example exercising an already
explained identity check can stay with that rule. A proposal explaining
approval generations and revocation requires comparison of those decisions;
the common identity premise does not establish that the rule owns their model.

Use the pre-edit boundary throughout this comparison. A proposed Scope or
trigger must express the established responsibility rather than widen it to
admit the material. After drafting, compare the old and final boundaries and
selections to verify the assessed disposition.

Split a general principle from a product- or platform-specific mapping only when each has a distinct canonical responsibility, an independently useful `When to Read` condition, an independent `When to update` trigger, and enough substance to stand alone. Keep specific material with the general principle when it only demonstrates or translates it. Use paired documents when the mapping owns independently needed API choices, runtime behavior, limitations, or maintenance triggers, and make the mapping reference rather than restate the principle.

Merge Knowledge documents when their pre-edit Scopes and reading triggers route
the same responsibility and retaining both would preserve competing or
duplicated authority. Preserve separate documents when their responsibilities,
reading triggers, or maintenance lifecycles remain independently useful even
when their subjects overlap.

## Knowledge document preface

Begin every `knowledge/**/*.md` file with this structure:

```markdown
# Descriptive title

## Scope

One cohesive prose paragraph.

## When to update

One cohesive prose paragraph.
```

**Scope.** Define the document's ownership boundary, purpose, and intended
level of detail through a positive statement of the responsibility it owns.
Add only the smallest qualification needed to resolve a real ownership
ambiguity that the positive boundary cannot resolve. Write one cohesive
paragraph; do not inventory neighboring documents, headings, topics, or
table-of-contents entries.

**When to update.** Name observable changes that would make the document stale
or incomplete, such as changes to its source material, supported behavior,
policy, or coverage boundary. These are maintenance triggers, distinct from the
tasks and decisions that cause an Agent to read the document. Write one
cohesive paragraph; avoid vague phrases such as “update as needed” and avoid
lists of editing steps.

## Catalog fields

**File Path.** Use the plugin-root-relative path as the link text and a
relative Markdown link from
[`knowledge/index.md`](../../../../knowledge-base/plugin/knowledge/index.md) as its target. Point
directly to a leaf Knowledge document, list it exactly once, and confirm that
the target exists.

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

For a source index, treat each question-to-source mapping, including its link,
as a substantive claim. Classify the index as `time-sensitive` when ordinary
external changes can move, replace, or invalidate those sources, even if the
method of consulting current authoritative sources is durable.

**When to Read.** Write a compact catalog trigger beginning with `Read when`
for the leaf's independently useful reading responsibility. A request about one
specific responsibility should select its canonical document; a broad user
task can select several documents when each contributes distinct,
non-duplicated Knowledge. Compare the condition with every other row. If two
conditions route the same responsibility, merge the documents or redraw their
Scopes and conditions before adding them to the catalog.
