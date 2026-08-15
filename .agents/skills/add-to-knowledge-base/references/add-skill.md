# Add a Skill

1. Choose the Skill audience before choosing its path:
   - Put repository-authoring workflows in `.agents/skills/`. These Skills
     maintain, organize, or validate the knowledge-base source repository.
   - Put primary-plugin usage workflows in `skills/`. These Skills are used
     after the `knowledge-base` plugin is installed.
   - Put an independent plugin's usage workflows inside that plugin's own
     `skills/` directory.
2. Search the selected Skill scope for an existing workflow with the same
   responsibility. Extend the existing Skill when it already owns the task.
3. For a new Skill, use a lowercase hyphenated, verb-led directory name that
   matches its frontmatter `name`. Write a `description` that states both the
   capability and the concrete trigger branches.
4. Keep the body procedural and imperative. Reference the canonical Knowledge
   selected during classification instead of copying it into the Skill. Move
   branch-specific detail into `references/` when progressive disclosure keeps
   the main workflow focused.
5. Keep usage Skills valid after installation: reference only files inside
   their plugin package and avoid dependencies on `.agents/`, repository
   tooling, or Skill-to-Skill invocation. Keep independent plugins fully
   self-contained.
6. Validate the Skill frontmatter, referenced paths, repository formatting,
   and relevant tests. Confirm that the Skill is in the scope selected in step
   1 and has no duplicated source of truth.
