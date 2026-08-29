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
   apply its portability, invocation, bundle-structure, disclosure, and
   behavioral-validation principles to every affected Skill.
3. Work only from the Skill parts identified during classification. Return
   separately classified Skill-reference material to the parent workflow so
   its consumer set and package boundary are handled by the reference branch.
4. Test every usage workflow against an unknown downstream project. Discover
   project paths, layouts, domain rules, organization policies, and
   infrastructure from the Agent's active working directory rather than
   hard-coding a particular project. Product, platform, protocol, and
   engineering-domain specificity are valid. Return workflows that cannot be
   made independent of their source project to the parent as neither.
5. Before adding or changing a repository-authoring or primary-plugin Skill,
   read [`knowledge/index.md`](../../../../knowledge/index.md). Compare the
   workflow's decisions and required inputs with every `When to Read`
   condition, read every matching leaf not already loaded, and search
   `knowledge/` for concepts the Skill would otherwise explain. Reference
   applicable canonical Knowledge rather than reproducing it. Return missing
   material to the parent workflow as mixed only when its reading trigger
   precedes workflow selection and survives removal of every consuming Skill,
   then complete the Knowledge branch first.
6. Search the selected Skill scope for existing workflows with the same or
   overlapping responsibility. Compare their pre-edit invocation conditions,
   user-visible outcomes, decisions, privileged effects, failure and completion
   states, consumers, and maintenance lifecycles. Extend an existing Skill only
   when it already owns the complete affected responsibility.
7. Read every file in the affected Skill bundle and every route or consumer
   needed to understand it. Apply the shared reference's bundle-structure,
   placement, and progressive-disclosure tests before editing. Return
   separately selected supporting material to the parent as Skill-reference
   content, and keep only independently invocable responsibilities as Skills.
8. Apply the parent-selected disposition to every affected responsibility unit.
   Rewrite the complete unit and remove superseded steps, exceptions, or
   completion conditions when behavior changes. Delete no-op or obsolete
   instructions. Do not preserve old and new behavior as layered qualifications
   when one current path can express the accepted contract.
9. Apply the shared reference's split and merge tests when the final design
   changes the bundle boundary. Do not use file length, step count, or reference
   count as a structural rule.
10. For a new Skill, use a lowercase hyphenated, verb-led directory name that
    matches its frontmatter `name`. When renaming, splitting, merging, moving,
    or removing a Skill, update every invocation pointer, consumer, manifest or
    marketplace route, test, prompt, and documentation reference, then remove
    the obsolete route and file.
11. Apply the Skill-reference placement and routing rules in
    [`AGENTS.md`](../../../../AGENTS.md#repository-architecture). Confirm the
    complete consumer set and package boundary before placing each reference.
12. For every usage Skill that applies Knowledge, encode working-directory
    precedence: treat shared Knowledge as supplemental guidance and follow
    instructions, Skills, requirements, and project-specific information from
    the Agent's active working directory when they conflict with shared
    Knowledge.
13. Keep ordinary usage Skills valid after installation: reference only files
    inside their plugin package and avoid dependencies on `.agents/`, repository
    tooling, or Skill-to-Skill invocation. A contribution Skill may use the
    primary manifest's canonical repository URL to create an isolated source
    checkout and read authoring instructions from `.agents/` inside that
    checkout; it must not treat the installed plugin's `.agents/` or files as
    the authoring target. Keep independent plugins fully self-contained and do
    not reference root Knowledge or root references.
14. Run repository formatting and relevant tests. Forward-test representative
    invocation, decision, reference-selection, failure, and completion paths in
    a fresh or isolated context when static validation cannot establish them.
    Compare the original and final bundle so every semantic change is intended
    and every removed or moved route remains reachable where required.

Finish only when the Skill remains in the correct audience scope, preserves
downstream-project independence when user-facing, and has one task-facing
entrypoint for each independently invocable responsibility. Its main file must
contain the complete primary workflow and completion criteria; every reference
must be selected by an explicit step; every rule must have one authoritative
copy; every installed-package reference must resolve; and no obsolete route,
orphan reference, hidden Skill-to-Skill dependency, duplicated workflow, or
edit-history structure may remain.
