# Maintain a Skill

1. Apply the dependency-boundary rule in
   [`AGENTS.md`](../../../../AGENTS.md#repository-architecture) before choosing
   a path:
   - Keep generalizable Workflow and Handbook Skills in the owning plugin's
     flat `skills/` directory. The primary package is
     [`knowledge-base/plugin/skills/`](../../../../knowledge-base/plugin/skills/);
     auxiliary plugins use `plugins/<plugin-name>/skills/`.
   - Keep only repository-coupled
     [repository-maintenance workflows](../../../../GLOSSARY.md#repository-maintenance-workflow)
     in [`.agents/skills/`](../..), delegating one-way to `knowledge-base/plugin/`
     without restating, paraphrasing, splitting, or overriding product-owned
     rules.
2. Read
   [Agent Skill authoring](../../../../knowledge-base/plugin/references/agents/skill-authoring.md)
   and
   [Design selection triggers](../../../../knowledge-base/plugin/references/agents/selection-triggers.md),
   and delegate all general Skill responsibility, task and reading-scene
   modeling, downstream-project independence, description and body authoring,
   bundle organization, composed-bundle review, and behavioral-proof rules to
   those authorities without restating them here.
3. Inspect the primary product's
   [Knowledge Catalog](../../../../knowledge-base/plugin/knowledge/index.md) and
   [Knowledge tree](../../../../knowledge-base/plugin/knowledge/) (or the
   applicable plugin's Knowledge) alongside existing Skills in the target scope.
   Return missing independently retrievable subject understanding to the parent
   workflow's Knowledge branch first, and return step-selected support to its
   Skill-reference branch. Confirm downstream-project independence for
   installed Skills per
   [`AGENTS.md`](../../../../AGENTS.md#repository-architecture), returning
   non-generalizable content to the parent as neither.
4. Apply the parent-selected operation to each complete affected responsibility
   unit and enforce repository layout and packaging rules:
   - For primary-product installed Skills under `knowledge-base/plugin/skills/`,
     follow
     [Skills and references](../../../../knowledge-base/AGENTS.md#skills-and-references):
     place each entrypoint in an immediate child directory with one `SKILL.md`
     and matching frontmatter `name` prefixed with `workflow-` or `handbook-`,
     without custom kind metadata, aliases, wrapper Skills, or a prefix-kind
     checker.
   - Keep `knowledge-base/plugin/skills/**` inside its package boundary and free
     of `.agents/`, source-checkout tooling (`knowledge-base/lib/`,
     `knowledge-base/tools/`), and sibling plugins, applying only the explicit
     contribution-Skill manifest exception in
     [`AGENTS.md`](../../../../AGENTS.md#repository-architecture) when it
     governs the Skill under change.
   - For repository-maintenance workflows under `.agents/skills/`, use a
     task-appropriate verb-led directory and frontmatter `name`.
5. When adding, renaming, splitting, merging, moving, or removing a Skill under
   an authorized change, reconcile every affected repository consumer—invocation
   pointers, marketplace and manifest routes
   ([`.claude-plugin/marketplace.json`](../../../../.claude-plugin/marketplace.json),
   `plugin.json`), regression cases, `.github/` prompts and verification
   workflows, and repository docs—then remove obsolete routes and wrappers.
6. Verify Knowledge Catalog reachability (`pnpm knowledge:check`) when primary
   plugin Skills or routes change so every leaf in `knowledge/index.md` remains
   reachable through the package-local graph
   ([Knowledge](../../../../knowledge-base/AGENTS.md#knowledge)).
7. Run `pnpm check` and `git diff --check`. Produce the behavioral proof and
   pull-request or handoff summary required by
   [Prove the behavior](../../../../knowledge-base/plugin/references/agents/skill-authoring.md#prove-the-behavior)
   and
   [Prepare pull-request and handoff evidence](../../../../knowledge-base/plugin/references/agents/skill-authoring.md#prepare-pull-request-and-handoff-evidence),
   and return it to the parent workflow for unified assembly and single-reviewer
   [final validation](../SKILL.md#final-validation).

Finish only when the Skill lives at the boundary required by its dependencies,
satisfies repository layout, package-isolation, and Catalog-reachability
contracts, has all repository consumers reconciled, and returns complete
evidence for parent validation and delivery.
