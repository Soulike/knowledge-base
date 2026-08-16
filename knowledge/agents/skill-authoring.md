# Agent Skill authoring

## Scope

This document defines project-independent principles for writing and reviewing reusable Agent Skills that are portable, reliably invoked, focused, and behaviorally correct.

## When to update

Update this document when a real authoring or review case exposes a missing rule for Skill portability, invocation, disclosure, or behavioral validation.

## Keep references portable

Refer to another Skill by its registered name rather than an installation path. Read shared packaged files directly unless the client explicitly guarantees Skill orchestration.

Resolve bundled resources relative to the current Skill. Discover project files and external authorities from the active working directory rather than embedding one source project's layout.

## Make invocation and disclosure complete

Put every distinct trigger branch in the frontmatter description. State the capability and task conditions there, and keep execution details in the body.

Write task-facing instructions in imperative form. Keep the primary workflow and completion criteria in the main file. Load branch-specific references only from the decisions that require them, and keep one authoritative copy of each rule.

## Verify behavior, not only structure

Validate frontmatter, references, formatting, and metadata. When static checks cannot establish decision behavior, forward-test representative branches in a fresh or isolated context without disclosing the intended answer or author's conclusions.
