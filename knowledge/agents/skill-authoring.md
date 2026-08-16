# Agent Skill authoring

## Scope

This document defines project-independent principles for authoring and reviewing reusable Agent Skills. It owns portable references, invocation completeness, progressive disclosure, structural validation, and representative forward testing; Knowledge-versus-Skill classification, repository layouts, client-specific metadata, and the workflow for maintaining a particular Skill collection belong elsewhere.

## When to update

Update this document when a Skill fails to trigger for a legitimate task, loads irrelevant material, embeds a downstream project's layout, passes structural checks while making the wrong decision, or otherwise exposes a gap in reusable Skill authoring or review.

## Apply the selected Skill responsibility

Use [Knowledge and Skills](knowledge-and-skills.md) to classify material and select the Skill's responsibility before applying the authoring rules below. That document remains the authority for whether supporting material belongs inside the workflow or in independently readable Knowledge.

When referring to another available Skill as a capability, use its registered name rather than an assumed installation path. This naming rule does not make Skill-to-Skill invocation a portable contract; unless the client contract guarantees that orchestration, read shared packaged files directly. Resolve bundled resource paths relative to the current Skill, and discover project files and external authorities from the active working directory rather than embedding one source project's layout in a reusable Skill.

## Make invocation and disclosure complete

Put every distinct branch that should trigger the Skill in its frontmatter description. State the capability and task conditions there; keep branch details in the body. A trigger must be evaluable before the Skill is opened and must not merely inventory its contents.

Keep the primary workflow and completion criteria in the main file. Disclose a branch-specific reference only when that branch needs it, and point to it from the decision that selects the branch. Keep one authoritative copy of each rule.

## Verify behavior, not only structure

Validate frontmatter, bundled paths, formatting, and any client metadata after a change. When static checks cannot establish the Skill's decisions, forward-test representative trigger branches with a fresh Agent or isolated context. Give it the raw task and artifacts needed to perform the workflow without the intended answer, suspected defect, proposed fix, or author's conclusions.
