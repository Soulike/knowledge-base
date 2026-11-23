---
name: handbook-frontend-dev
description: Use when engineering, maintaining, reviewing, diagnosing, or understanding frontend web applications, UI frameworks, or client-side components and Hooks.
---

# Frontend-development Handbook

This Handbook routes the curated frontend-development guidance currently
available in this plugin. Its coverage is intentionally non-exhaustive, with an
empty foundation because no current Knowledge applies across all frontend work.
It owns required-reading selection, not the procedure or completion of the
user's task. Resolve every packaged link relative to this `SKILL.md`, and apply
selected Knowledge as supplemental guidance under the instructions,
requirements, Skills, and project-specific decisions in the active working
directory.

## Read the required material

Evaluate every condition below. Every match is required and cumulative with
any other matching package added to this Handbook later.

- When writing, reviewing, diagnosing, or testing React components or custom
  Hooks that invoke callbacks or non-reactive logic inside React Effects
  (`useEffect`, `useLayoutEffect`), or when directly learning or explaining how
  to isolate non-reactive callbacks from React Effect dependencies across
  React versions, read
  [Isolating non-reactive callbacks in React Effects](../../knowledge/react/effect-callback-isolation.md)
  in full.

If no current package matches, the Handbook's reading selection is validly
complete with no package to read. Continue the task without applying unrelated
narrow material, inventing guidance, or implying that this Handbook documents
all of React or frontend development. Do not copy or infer rules in place of
reading the linked canonical material.
