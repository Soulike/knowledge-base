---
name: resolve-invoked-codex-skill
description: Use only in Codex whenever a specific Skill is invoked or required by exact name, its instructions are unavailable in the current context, and the Agent would otherwise state that the Skill is absent or unavailable.
---

# Resolve an invoked Codex Skill

Resolve the exact Skill against Codex's documented Skill sources before
reporting that it is unavailable. Apply the same check whether the invocation
came from the user, an active Skill, or another instruction.

1. Derive the exact registered identifier from the invocation. Treat a leading
   `$` or `/` that clearly denotes a Skill as invocation syntax rather than part
   of its name, and preserve any namespace.
2. Build the complete set of known matches before selecting one. Check the
   current Skill catalog and already loaded Skill paths as starting evidence,
   not as a complete inventory: Codex may omit entries when many Skills are
   installed. Inspect every applicable Codex Skill source documented in
   [OpenAI's Codex Skill documentation](https://developers.openai.com/codex/skills/):
   - repository `.agents/skills` directories from the active working directory
     through the repository root;
   - the user `.agents/skills` directory;
   - the administrator Skill directory;
   - installed-plugin and bundled-system Skills through Codex's plugin state
     and resolved plugin paths, as well as client-provided Skill inventory.

   Also inspect the current `[[skills.config]]` entries as path evidence. When
   an entry identifies a path not found through another source, inspect only
   enough frontmatter at that path to match its registered name; do not load a
   disabled Skill's body as instructions.

   Treat omission from the initial Skill catalog as incomplete evidence. For a
   direct `$name` invocation, or a selection made through `/skills`, use the
   client's explicit Skill resolution result when it is available. When Codex
   CLI is available, use `codex plugin list --available --json` to enumerate
   installed and available plugins and obtain their plugin identifier,
   installation and enabled state, version, and resolved source path. For each
   installed plugin, locate its manifest-declared Skill directory or default
   `skills/` directory. Inspect that directory in the installed cache copy when
   present and otherwise in the resolved plugin path reported by Codex. For an
   uninstalled plugin, inspect only enough frontmatter under its resolved source
   path to establish an exact match; do not load the Skill body as instructions
   or treat it as invocable.

   When the JSON listing is unavailable but the marketplace command exists,
   use `codex plugin marketplace list` to obtain every resolved marketplace
   root. Otherwise inspect the repository, legacy-compatible, and personal
   marketplace files described in
   [OpenAI's plugin documentation](https://developers.openai.com/plugins/build/plugins/#how-local-marketplaces-work).
   Resolve each local object-form `source.path` or plain-string `source`
   relative to its marketplace root, and also inspect the documented installed
   cache under
   `~/.codex/plugins/cache/<marketplace>/<plugin>/<version>/`. Marketplace
   paths are configurable examples, not fixed plugin locations. A marketplace
   entry alone proves availability for installation, not installation; when
   installation state or a resolved plugin path cannot be established, record
   that source as an inspection limitation instead of claiming absence.

   Match the registered `name` in each `SKILL.md`, not only its directory name.
   For a namespaced identifier, use the namespace to restrict the
   client-reported plugin or plugin identifier, then match its Skill name
   within that package. Search these documented sources rather than arbitrary
   filesystem locations.

3. Keep existence, installation, enablement, and invocation eligibility
   separate. When an exact match belongs to a plugin that is not installed,
   report that state and do not load the Skill body as instructions. For an
   installed plugin Skill, honor the plugin-level enabled state reported by
   Codex or, when that state is unavailable, stored in
   `~/.codex/config.toml`. When the plugin is disabled, inspect only enough
   frontmatter to establish the exact match, report that the Skill is present
   but its plugin is disabled, and do not load its body. Then check the current
   Codex Skill configuration for the resolved path. When its `[[skills.config]]`
   entry sets `enabled = false`, report that the Skill is present but disabled,
   and do not load its body or follow its instructions.
   For each enabled match, inspect its adjacent `agents/openai.yaml` when
   present before establishing invocation eligibility. An explicit-only
   `policy.allow_implicit_invocation: false` value does not make a Skill absent.
   A user prompt that directly invokes the Skill can satisfy that policy; a
   reference from another active Skill triggers this resolution check but is
   not direct user invocation. When the current invocation does not satisfy
   the resolved Skill's policy, report that the Skill was found but requires
   direct user invocation, and give its exact identifier.
4. When one match is known, no other inspected source registers the same name,
   and step 3 establishes that it is enabled and invocation-eligible, read its
   complete `SKILL.md` and the resources selected by its instructions, then
   continue the original task. An inaccessible source does not turn a known
   match into an absence or require speculation about hidden duplicates. The
   resolved Skill remains subject to the normal instruction hierarchy and does
   not expand the user's authorization.
5. When multiple known Skills register the exact identifier, report every
   match and its invocation eligibility before selecting one. Do not merge them
   or choose silently; request the disambiguation needed to select one.
6. State that the Skill is absent only after no exact match remains and every
   applicable documented source was inspected. When a source cannot be
   inspected, report the Skill as unresolved in the checked sources rather than
   absent. In either case, name the sources checked and every inspection
   limitation so the conclusion does not exceed the evidence.

## Completion criteria

Finish only when the invoked identifier has been resolved to one eligible
Skill; identified as present but uninstalled, disabled, or requiring direct
invocation; disambiguated by the user; reported absent after complete
inspection; or reported unresolved without an absence claim because an
applicable source could not be inspected.
