# Maintain a Skill reference

1. Work only from the Skill-reference parts identified during classification.
   Return independently retrievable understanding, required-reading routing, or
   task execution to the parent as Knowledge, Handbook, or Workflow content.
2. Identify the complete repository consumer set, the exact Skill step that
   selects the material for each consumer, its maintenance lifecycle, and the
   package boundary shared by those consumers. Read the entire reference and
   every consumer needed to judge those relationships.
3. Read
   [Agent Skill authoring](../../../../knowledge-base/plugins/knowledge-base/references/agents/skill-authoring.md)
   and
   [Design selection triggers](../../../../knowledge-base/plugins/knowledge-base/references/agents/selection-triggers.md),
   and delegate all general bundle-organization, cohesive-support,
   selection-timing, progressive-disclosure, and split-or-merge decisions to
   those authorities without restating them here. Apply
   [Assign Knowledge, references, and bundle ownership](maintain-skill.md#assign-knowledge-references-and-bundle-ownership)
   for Knowledge-plugin Knowledge, Workflow Skill, Handbook Skill, and reference
   boundary separation.
4. Apply the dependency-boundary, domain-model-neutrality,
   product-interface-isolation, and package-placement rules in
   [`AGENTS.md`](../../../../AGENTS.md#repository-architecture):
   - Keep generalizable Skill references in `knowledge-base/plugins/<plugin-name>/`
     (using `knowledge-base/plugins/knowledge-base/` for cross-domain shared
     references), inside the owning Skill's `references/`
     directory when used by one Skill or `references/<domain>/` when shared
     across Skills in the same plugin, preserving symmetric
     downstream-project independence and domain-model neutrality and avoiding
     dependencies on or routes to product-interface contracts.
   - Keep only repository-coupled or product-architecture-specific references
     under `.agents/` (inside the consuming workflow's `references/` directory
     or `.agents/references/` when shared across repository-maintenance
     workflows), delegating one-way to `knowledge-base/plugins/knowledge-base/`.
   - Record the complete consumer set and chosen boundary; reconsider package
     ownership instead of creating cross-package or repository-global routing.
5. Apply the parent-selected disposition to each affected responsibility unit.
   For references under `knowledge-base/plugins/*/`, verify
   package isolation
   ([knowledge-base/AGENTS.md](../../../../knowledge-base/AGENTS.md)) and
   Knowledge Catalog
   reachability (`pnpm knowledge:check`), noting that only step-selected
   eligible packaged references participate in reachability.
6. After adding, rewriting, splitting, merging, moving, or removing a
   reference, reconcile every affected repository consumer—Skills, manifests,
   `.github/` prompts and workflows, and documentation—and delete obsolete
   routes, files, and unreferenced copies.
7. Run `pnpm check` and `git diff --check`, and handle any risk-based probe
   checks per
   [Verify reader understanding](../../../../knowledge-base/plugins/knowledge-base/references/agents/reader-understanding.md)
   through the parent workflow.

Finish only when the reference has one authoritative home at the smallest valid
package boundary, a complete and reconciled repository consumer set, resolved
links, passing repository checks, and any warranted probe findings resolved.
