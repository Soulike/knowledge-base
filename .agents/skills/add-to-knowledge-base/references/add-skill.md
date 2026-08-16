# Add a Skill

1. Choose the Skill audience before choosing its path:
   - Put repository-authoring workflows in `.agents/skills/`. These Skills
     maintain, organize, or validate the knowledge-base source repository.
   - Put primary-plugin usage workflows in `skills/`. These Skills are used
     after the `knowledge-base` plugin is installed.
   - Put an independent plugin's usage workflows inside that plugin's own
     `skills/` directory.
2. Test every usage workflow against an unknown downstream project. Discover
   project paths, layouts, domain rules, organization policies, and
   infrastructure from the Agent's active working directory rather than
   hard-coding a particular project. Product, platform, protocol, and
   engineering-domain specificity are valid. Return workflows that cannot be
   made independent of their source project to the parent as neither.
3. Before adding or changing a repository-authoring or primary-plugin Skill,
   read [`knowledge/index.md`](../../../../knowledge/index.md). Compare the
   workflow's decisions and required inputs with every `When to Read`
   condition, read every matching leaf document, and search `knowledge/` for
   concepts the Skill would otherwise explain. Reference applicable canonical
   Knowledge rather than reproducing it. Keep explanation whose only consumer
   and maintenance lifecycle are this workflow in the Skill body or its
   `references/`. Return missing material to the parent workflow as mixed only
   when it has an independent direct-reading responsibility outside the
   workflow, then complete the Knowledge branch first.
4. Search the selected Skill scope for an existing workflow with the same
   responsibility. Extend the existing Skill when it already owns the task.
5. For a new Skill, use a lowercase hyphenated, verb-led directory name that
   matches its frontmatter `name`. Write a `description` that states both the
   capability and the concrete trigger branches.
6. Keep the body procedural and imperative. Move branch-specific detail into
   `references/` when progressive disclosure keeps the main workflow focused.
7. For every usage Skill that applies Knowledge, encode working-directory
   precedence: treat shared Knowledge as supplemental guidance and follow
   instructions, Skills, requirements, and project-specific information from
   the Agent's active working directory when they conflict with shared
   Knowledge.
8. Keep ordinary usage Skills valid after installation: reference only files
   inside their plugin package and avoid dependencies on `.agents/`, repository
   tooling, or Skill-to-Skill invocation. A contribution Skill may use the
   primary manifest's canonical repository URL to create an isolated source
   checkout and read authoring instructions from `.agents/` inside that
   checkout; it must not treat the installed plugin's `.agents/` or files as
   the authoring target. Keep independent plugins fully self-contained and do
   not reference root Knowledge.
9. Validate the Skill frontmatter, referenced paths, repository formatting,
   and relevant tests. Confirm that the Skill is in the scope selected in step
   1, preserves downstream-project independence when user-facing, and has no
   duplicated source of truth.
10. When static checks cannot establish a changed Skill's decision behavior,
    forward-test its representative trigger branches. Give the evaluator the
    raw task and artifacts with only the context needed to perform it; do not
    disclose the intended answer, suspected defect, proposed fix, or author's
    conclusions unless the evaluation specifically requires them.
