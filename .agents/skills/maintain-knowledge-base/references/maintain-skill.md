# Maintain a Skill

1. Choose the Skill audience before choosing its path:
   - Put repository-authoring workflows in `.agents/skills/`. These Skills
     maintain, organize, or validate the knowledge-base source repository.
   - Put primary-plugin usage workflows in `skills/`. These Skills are used
     after the `knowledge-base` plugin is installed.
   - Put an independent plugin's usage workflows inside that plugin's own
     `skills/` directory.
2. Read
   [Agent Skill authoring](../../../../references/agents/skill-authoring.md) and
   use its four stages as the authoring path: define the real task, assign
   knowledge and execution responsibilities, write the executable workflow, and
   prove the behavior. Determine whether the change is material under that
   reference before selecting the amount of research and evidence.
3. Establish the real task before preserving or changing the current Skill
   boundary. Record the professional questions that require research, but do not
   treat the repository's current contents as a complete domain model.
4. Test every usage workflow against an unknown downstream project. Discover
   project paths, layouts, domain rules, organization policies, and
   infrastructure from the Agent's active working directory rather than
   hard-coding a particular project. Product, platform, protocol, and
   engineering-domain specificity are valid. Return workflows that cannot be
   made independent of their source project to the parent as neither.
5. Read [`knowledge/index.md`](../../../../knowledge/index.md). Compare the task
   model with every `When to Read` condition, read every matching leaf not
   already loaded, and search `knowledge/` for subject understanding the Skill
   would otherwise explain. Then complete the authoring standard's professional
   research using the loaded Knowledge and any necessary current authoritative
   sources. Repository-authoring and primary-plugin Skills reference applicable
   canonical root Knowledge rather than reproducing it. For an independent
   plugin, use the comparison only to identify root-owned or out-of-package
   material: do not reference root files, and return that material to the parent
   for reclassification or package-ownership reconsideration.
6. Search the selected Skill scope for workflows with the same or overlapping
   task. Compare their invocation conditions, accepted input states,
   user-visible results, decisions, privileged effects, failure and completion
   states, consumers, and maintenance lifecycles. Keep one Skill only when it
   owns one complete task; split or retain separate Skills when those task
   boundaries differ even if they use the same Knowledge.
7. Read every file in the affected bundle and every route or consumer needed to
   understand it. Assign execution to the Skill and separately classified
   supporting material to the parent Skill-reference branch. Apply the authoring
   standard's bundle, placement, portability, progressive-disclosure, and
   split-or-merge rules before editing.
8. Apply the parent-selected operation to each complete affected responsibility
   unit. Rewrite the current workflow and remove superseded steps, exceptions,
   completion conditions, no-op instructions, obsolete routes, and orphaned
   references. Do not preserve old and new behavior as layered qualifications.
9. For a new Skill, use a lowercase hyphenated, verb-led directory name that
   matches its frontmatter `name`. When renaming, splitting, merging, moving, or
   removing a Skill, update every invocation pointer, consumer, manifest or
   marketplace route, test, prompt, and documentation reference, then remove the
   obsolete route and file.
10. Apply the Skill-reference placement and routing rules in
    [`AGENTS.md`](../../../../AGENTS.md#repository-architecture). For every usage
    Skill that applies Knowledge, encode working-directory precedence. Keep
    ordinary installed workflows inside their package boundary and free of
    dependencies on source-checkout tooling, `.agents/`, private infrastructure,
    or unguaranteed Skill-to-Skill invocation. A contribution Skill may create
    an isolated checkout of the canonical source and read `.agents/` there, but
    must not use the installed plugin as its authoring target.
11. Run `pnpm check`, `git diff --check`, and every additional validator or
    focused test selected by the changed artifacts. Produce the authoring
    standard's required behavioral evidence in a fresh or isolated context. The
    parent workflow owns the single independent semantic comparison; do not run
    a duplicate here or disclose the author's conclusions to its evaluator.
12. Report the authoring standard's design and behavioral evidence. Identify a
    mechanical change explicitly when the reduced evidence path applies, and
    disclose unresolved limitations.

Finish only when the Skill owns a complete real task in the correct audience
scope, preserves downstream-project independence when user-facing, and has one
task-facing entrypoint for each independently invocable responsibility. Its
professional task model must be sufficient for the promised result; its main
file must contain the complete primary workflow and completion criteria; every
reference must be selected explicitly; every rule must have one authoritative
copy; and no obsolete route, orphan reference, hidden Skill dependency,
duplicated workflow, patch-layered qualification, or edit-history structure may
remain. New and material behavior must have reviewable design and behavioral
evidence.
