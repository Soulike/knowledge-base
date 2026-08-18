# Add a Skill

1. Choose the Skill audience before choosing its path:
   - Put repository-authoring workflows in `.agents/skills/`. These Skills
     maintain, organize, or validate the knowledge-base source repository.
   - Put primary-plugin usage workflows in `skills/`. These Skills are used
     after the `knowledge-base` plugin is installed.
   - Put an independent plugin's usage workflows inside that plugin's own
     `skills/` directory.
2. Read
   [Agent Skill authoring](../../../../references/agents/skill-authoring.md) and
   apply its portability, invocation, disclosure, and behavioral-validation
   principles to every Skill.
3. Test every usage workflow against an unknown downstream project. Discover
   project paths, layouts, domain rules, organization policies, and
   infrastructure from the Agent's active working directory rather than
   hard-coding a particular project. Product, platform, protocol, and
   engineering-domain specificity are valid. Return workflows that cannot be
   made independent of their source project to the parent as neither.
4. Before adding or changing a repository-authoring or primary-plugin Skill,
   read [`knowledge/index.md`](../../../../knowledge/index.md). Compare the
   workflow's decisions and required inputs with every `When to Read`
   condition, read every matching leaf not already loaded, and search
   `knowledge/` for concepts the Skill would otherwise explain. Reference
   applicable canonical Knowledge rather than reproducing it. Keep explanation
   whose only consumer and maintenance lifecycle are this workflow in the
   Skill body or a Skill reference. Return missing material to the parent
   workflow as mixed only when its reading trigger precedes workflow selection
   and survives removal of every consuming Skill, then complete the Knowledge
   branch first.
5. Search the selected Skill scope for an existing workflow with the same
   responsibility. Extend the existing Skill when it already owns the task.
6. For a new Skill, use a lowercase hyphenated, verb-led directory name that
   matches its frontmatter `name`.
7. Apply the Skill-reference placement and routing rules in
   [`AGENTS.md`](../../../../AGENTS.md#repository-architecture). Confirm the
   complete consumer set and package boundary before placing each reference.
8. For every usage Skill that applies Knowledge, encode working-directory
   precedence: treat shared Knowledge as supplemental guidance and follow
   instructions, Skills, requirements, and project-specific information from
   the Agent's active working directory when they conflict with shared
   Knowledge.
9. Keep ordinary usage Skills valid after installation: reference only files
   inside their plugin package and avoid dependencies on `.agents/`, repository
   tooling, or Skill-to-Skill invocation. A contribution Skill may use the
   primary manifest's canonical repository URL to create an isolated source
   checkout and read authoring instructions from `.agents/` inside that
   checkout; it must not treat the installed plugin's `.agents/` or files as
   the authoring target. Keep independent plugins fully self-contained and do
   not reference root Knowledge or root references.
10. Run repository formatting and relevant tests. Confirm that the Skill is in
    the scope selected in step 1, preserves downstream-project independence
    when user-facing, resolves every installed-package reference, and has no
    duplicated source of truth.
