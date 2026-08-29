# Maintain a Skill reference

1. Work only from the Skill-reference parts identified during classification.
   Return independently retrievable understanding or executable workflow
   responsibility to the parent as Knowledge or Skill content.
2. Identify the complete consumer set, the exact workflow step that selects
   the material for each consumer, its maintenance lifecycle, and the package
   boundary shared by those consumers. Read the entire reference and every
   consumer needed to judge those relationships.
3. Read
   [Agent Skill authoring](../../../../references/agents/skill-authoring.md) and
   apply its bundle-structure, selection, and split-or-merge tests. Confirm that
   a separate reference still earns its retrieval and maintenance cost. Delete
   or inline a reference that no longer has a distinct selection point or
   cohesive supporting responsibility.
4. Apply the Skill-reference package placement rules in
   [`AGENTS.md`](../../../../AGENTS.md#repository-architecture). Record the
   complete consumer set and chosen boundary, and reconsider package ownership
   instead of creating cross-package or repository-global routing.
5. Apply the parent-selected disposition to every affected responsibility unit.
   Rewrite the complete unit and remove superseded or duplicated rules. Apply
   the shared Skill-authoring tests when the final design changes a reference
   boundary.
6. Keep each reference focused on one cohesive supporting responsibility. Do
   not create a reference index. Route the file directly from the consuming
   workflow steps, and avoid reference chains that hide the selection decision
   from the Skill that owns it.
7. After adding, rewriting, splitting, merging, moving, or removing a
   reference, inspect every consumer, update only affected routes or semantics,
   and delete obsolete routes and files. Confirm that no consumer relies on the
   old location, copied wording, or an implicit filesystem convention.
8. Run repository formatting, link validation, and every relevant Skill or
   behavioral check. Forward-test representative consumers when static checks
   cannot establish that each workflow selects the right material at the right
   time.

Finish only when the reference has a justified selection point, one
authoritative supporting responsibility, a complete and current consumer set,
and the smallest valid package boundary. Every consumer must route to it
explicitly, every changed route must resolve, and no duplicate, orphaned,
superseded, cross-package, or edit-history artifact may remain.
