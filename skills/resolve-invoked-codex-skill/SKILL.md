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
   of its name, and preserve any namespace. Check the current Skill catalog and
   already loaded Skill paths first. Do not infer absence from the bounded
   initial catalog because Codex may omit entries when many Skills are
   installed.
2. If the exact identifier is not available there, inspect every applicable
   Codex Skill source documented in
   [OpenAI's Codex Skill documentation](https://developers.openai.com/codex/skills/):
   - repository `.agents/skills` directories from the active working directory
     through the repository root;
   - the user `.agents/skills` directory;
   - the administrator Skill directory;
   - installed-plugin and bundled-system Skills through client-provided Skill
     inventory when they are not represented by a documented filesystem path.

   Match the registered `name` in each `SKILL.md`, not only its directory name.
   For a namespaced identifier, use the namespace to restrict the plugin and
   match its Skill name within that package. Search these documented sources
   rather than arbitrary filesystem locations.

3. Keep existence separate from invocation eligibility. An explicit-only
   policy does not make a Skill absent. A user prompt that directly invokes the
   Skill can satisfy that policy; a reference from another active Skill triggers
   this resolution check but is not direct user invocation. When the current
   invocation does not satisfy the resolved Skill's policy, report that the
   Skill was found but requires direct user invocation, and give its exact
   identifier.
4. When one match is known and no other inspected source registers the same
   name, read its complete `SKILL.md` and the resources selected by its
   instructions, then continue the original task if its invocation policy
   permits. An inaccessible source does not turn a known match into an absence
   or require speculation about hidden duplicates. The resolved Skill remains
   subject to the normal instruction hierarchy and does not expand the user's
   authorization.
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
Skill, identified as present but requiring direct invocation, disambiguated by
the user, reported absent after complete inspection, or reported unresolved
without an absence claim because an applicable source could not be inspected.
