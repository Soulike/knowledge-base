# Maintain Knowledge

All content paths in this workflow are relative to the
[knowledge-base plugin](../../../../knowledge-base/plugin/), except commands
explicitly run from the repository root.

1. Read [`knowledge/index.md`](../../../../knowledge-base/plugin/knowledge/index.md),
   [Design selection triggers](../../../../knowledge-base/plugin/references/agents/selection-triggers.md),
   and the installed Handbook and Workflow entrypoints under
   [`knowledge-base/plugin/skills/`](../../../../knowledge-base/plugin/skills/)
   that can route the affected user work. When assessing or maintaining Knowledge
   about user interfaces, also read [Maintain UI Knowledge](ui-knowledge.md).
   Search the existing `knowledge/` tree and compare affected responsibilities
   with existing document Scopes, actual Handbook and Workflow reading routes
   and consumers, and reading scenes without treating those bundles as
   Knowledge ownership.
2. Work only from the Knowledge parts identified during classification; return
   remaining material to the parent workflow.
3. Reapply the boundary tests in
   [Classifying Knowledge and Skill material](../../../../knowledge-base/plugin/references/agents/knowledge-and-skills.md)
   and the downstream-project-independence gate in
   [`AGENTS.md`](../../../../AGENTS.md#repository-architecture) before editing
   `knowledge/`. Return material that belongs in a Workflow, Handbook, or
   Skill reference, or whose meaning depends on a source project, to the parent
   workflow.
4. Apply
   [Assess contribution scope](../../../../knowledge-base/plugin/references/agents/contribution-scope-assessment.md)
   and complete the
   [ownership and retrieval assessment](#ownership-and-generalization) before
   selecting a destination or operation. When a contribution, maintenance
   proposal, or review finding would change an existing leaf from `evergreen`
   to `time-sensitive` (including correcting an existing label), complete
   [Review an evergreen-to-time-sensitive transition](review-knowledge-type-transition.md)
   within that assessment. Return evidence and proposed disposition to the
   parent for assessment-only work; resume below only when edits are
   authorized.
5. Apply the parent-selected disposition to each affected responsibility unit in
   `knowledge/`, delegating revision coherence, in-place replacement, and
   reader-facing clarity one-way to
   [Maintained document quality](../../../../knowledge-base/plugin/knowledge/documentation/maintained-document-quality.md#keep-revisions-coherent).
6. Give every Markdown document under `knowledge/`, including
   [`knowledge/index.md`](../../../../knowledge-base/plugin/knowledge/index.md),
   the preface defined in [Knowledge document preface](#knowledge-document-preface).
7. Keep [`knowledge/index.md`](../../../../knowledge-base/plugin/knowledge/index.md)
   as the complete maintenance inventory in domain subdirectories without
   nested catalogs or leaf-level `Related Knowledge` / `See also` appendices
   ([Knowledge](../../../../knowledge-base/AGENTS.md#knowledge)). Before adding
   or retaining an inline link between Knowledge leaves, pass the
   [inline-dependency test](#admit-inline-knowledge-dependencies).
8. Apply [Catalog fields](#catalog-fields) and
   [Handbook routes](#handbook-routes). Check Skill descriptions and package
   selections against natural requests using
   [Design selection triggers](../../../../knowledge-base/plugin/references/agents/selection-triggers.md#check-selection-from-requests),
   returning a justified new Handbook responsibility to the Skill branch when
   needed, and repair every route and inline dependency affected by a move,
   merge, split, rename, or removal.
9. Verify repository Knowledge and Catalog invariants—every remaining leaf is
   listed once with a valid Knowledge Type, is reachable from an installed
   Workflow or Handbook through the package-local graph via direct
   complete-file or context-sufficient-section links without hidden Handbook
   dependencies, passes `#admit-inline-knowledge-dependencies` for leaf-to-leaf
   links, resolves all relative links, and leaves no removed leaves or obsolete
   routes—while applying
   [Validate the result](../../../../knowledge-base/plugin/knowledge/documentation/maintained-document-quality.md#validate-the-result).
10. Run `pnpm knowledge:check` from the repository root.

## Admit inline Knowledge dependencies

An inline link between Knowledge leaves records that a source claim depends on
the target's canonical responsibility; it does not make the target prerequisite
reading or replace a Handbook's direct route. The source must still state enough
context to serve its independent responsibility. Apply this deletion test
before adding or retaining a link:

First fix the comparison boundary for both leaves. For an existing leaf, use
its trusted pre-edit Scope, responsibility, installed reading routes, and
consumers. For a new leaf, use the responsibility, reading need, consumers, and
maintenance lifecycle established by classification before its content or
links are drafted; its proposed Scope must express rather than widen that
boundary.

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
   on the target's independent Handbook or Workflow route.

Keep the link only when all three checks establish a dependency within the
source responsibility. Related reading, optional techniques, and independently
retrievable specializations remain separate Knowledge routes.

## Ownership and generalization

Use the supported claim scopes, applicability conditions, and reader needs
established by
[Assess contribution scope](../../../../knowledge-base/plugin/references/agents/contribution-scope-assessment.md)
to determine canonical Knowledge ownership in `knowledge/` separately from
installed Handbook and Workflow reading routes:

1. State the concrete reader tasks, subject-specific decisions, and explanatory
   model the material must support, together with the context available before
   reading it, and locate candidate owners in `knowledge/`. Compare each
   candidate's existing question with the question the proposed material must
   answer, framed around the choice the reader must make and its conditions.
2. Read each candidate's pre-edit content alongside its `Scope`, `When to update`
   trigger, and installed Handbook/Workflow routes and consumers. Confirm they
   express one coherent subject responsibility, then map each required reader
   decision or explanation to its pre-edit location: already satisfied, needs a
   correction or clarification within the same responsibility, or introduces an
   independently needed responsibility (for example, assessing access control as
   a backend-selection cost vs explaining how to grant, expire, and revoke
   permissions after a backend is chosen). Do not infer ownership from shared
   vocabulary, broad `Scope` labels, or shared Handbook/Workflow bundles.
3. Form natural requests and run blind selection checks against real installed
   Skill descriptions and Handbook packages using
   [Check selection from requests](../../../../knowledge-base/plugin/references/agents/selection-triggers.md#check-selection-from-requests).
   Distinguish a route defect (retain the Knowledge owner and fix the route)
   from a distinct subject responsibility (separate Knowledge owner when
   independent reading and maintenance needs justify it).

Keep a reviewable ownership and retrieval account in the work record: reader
questions, candidate coverage and gaps with pre-edit source locations, rationale
for retaining or separating responsibilities, requests and expected vs observed
Workflow, Handbook, and package selections, and resulting ownership and route
dispositions. Missing selection observations or unexamined required decisions
leave fit unresolved (supporting at most an explicitly provisional proposal, not
a settled owner or no-route-change conclusion).

Use trusted pre-edit `Scope`, reading routes, and body as the comparison
baseline (reassessing per
[Maintained document quality](../../../../knowledge-base/plugin/knowledge/documentation/maintained-document-quality.md#keep-revisions-coherent)
when requirements change):

- Split a general principle from a domain-, product-, or platform-specific
  mapping only when each has a distinct canonical responsibility, an
  independently useful reading need, an independent `When to update` trigger,
  and enough substance to stand alone (linking rather than restating the
  principle).
- Merge Knowledge documents when their pre-edit `Scope`s and reading needs
  express the same responsibility and keeping both preserves competing
  authority; preserve separate documents when responsibilities, reading needs, or
  maintenance lifecycles remain distinct even when co-selected by one Handbook.

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

The Catalog owns file identity and Knowledge Type as maintenance metadata. It
does not own runtime selection or reading conditions.

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

## Handbook routes

After choosing the Knowledge owner, choose reading bundles independently. Use
the user work and reader decisions to compare existing Handbook scenes. Route
the Knowledge from every applicable existing Handbook through a direct link to
the complete file or a complete context-sufficient section. Place it in the
foundation only when it is required for the Handbook's primary artifact work;
otherwise select it from an observable conditional package.

The same Knowledge may appear in several Handbooks when distinct scenes need it.
That reuse does not merge owners. Return a proposed new Handbook to the Skill
branch when a distinct task family, technical domain, or stable
platform/framework context needs its own recognizable native entry rather than
belonging to an existing Handbook's owned scene—including when a broader
language or general engineering Handbook co-selects on the same code without
owning that self-contained domain. A new domain or platform Handbook may start
sparsely with one curated Knowledge leaf, provided its native trigger owns the
broader scene rather than wrapping that single leaf's narrow topic. Apply
[Agent Skill authoring](../../../../knowledge-base/plugin/references/agents/skill-authoring.md)
and do not create a per-leaf narrow wrapper Handbook, hide the route through
another Handbook, or copy the Knowledge into the entrypoint.
