---
name: wait-for-user-answer
description: Use only in Codex whenever you are about to ask the user a question or resume with an unanswered question. Keep the question pending without choosing an answer after a timeout.
---

# Wait for a user answer

When you ask the user a question, leave it unanswered until the user replies or
explicitly authorizes a fallback. Silence, elapsed time, and a preselected UI
option are not answers.

1. Identify the decisions and actions that depend on the answer and the work
   that can proceed independently.
2. If an asynchronous question channel can leave the question pending without
   selecting an answer on timeout, ask through it and continue independent work.
   Otherwise finish available independent work before asking normally in the
   handoff at step 4. Do not choose a question tool that requires a timed default.
3. Keep dependent work pending, even if a question tool returns without an
   answer. Treat a later user message as an answer only when it resolves the
   question; it may instead change or cancel the task.
4. Once independent work is complete, yield a concise handoff naming any
   unanswered question and the dependent work. When no suitable asynchronous
   channel exists, ask the question in this normal user-facing handoff. Resume
   dependent work when the user answers or removes the dependency. Do not keep
   a process running merely to measure how long the user has been silent.
5. Follow a time-based fallback only when the user explicitly provided it.
   Never invent a deadline or default. If a higher-priority instruction or host
   behavior prevents the question from remaining pending, state that limit
   rather than claim to be waiting.

## Completion criteria

The question is resolved only by the user's answer, an explicitly authorized
fallback, or a new instruction that removes it. Until then, do not report the
dependent work as complete.
