---
name: route-task-execution
description: Route substantial Agent tasks between inline execution and subagents, selecting a cost-aware model tier and review path when delegation could preserve the main context or shorten independent work without excessive latency.
---

# Route task execution

Treat this workflow as decision guidance. Follow the user's directions and the
active project's instructions, permissions, and runtime constraints when they
provide a better route.

First preserve the task's required quality. Among routes likely to meet that
quality, avoid one that materially lengthens the critical path; then minimize
total model cost and main-thread context use.

## Establish the available tiers

On the first matching task in a session, inspect the models and subagent
controls exposed by the current runtime. Identify one available model for each
tier, then reuse that mapping until availability or configuration changes:

| Tier          | Use when                                                                                                    | Illustrative families       |
| ------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------- |
| `powerful`    | The work is ambiguous, unusually difficult, high-risk, cross-cutting, or dependent on substantial judgment. | OpenAI Sol, Claude Opus     |
| `versatile`   | The work is an ordinary multi-step implementation, investigation, or review.                                | OpenAI Terra, Claude Sonnet |
| `lightweight` | The work is clear, bounded, repeatable, mechanical, or high-volume.                                         | OpenAI Luna, Claude Haiku   |

Treat the family names as analogies, not fixed model identifiers or a current
inventory. Resolve tiers from the models the runtime actually makes available.
When fewer than three suitable choices exist, collapse adjacent tiers instead
of inventing unavailable choices.

Choose model tier and reasoning effort independently. Start with the cheapest
tier and lowest effort that can reliably complete the work; increase either
only when task difficulty, uncertainty, or consequence requires it.

## Choose inline execution or delegation

Keep work inline when it is small, tightly coupled to the main thread,
interactive, still requires user decisions, or cheaper to perform than to
describe and review.

Delegate a bounded task when at least one benefit clearly exceeds handoff,
coordination, waiting, and review overhead:

- isolating exploration, logs, test output, or other context-heavy work keeps
  the main thread focused on requirements and decisions;
- independent branches can run concurrently and shorten the critical path; or
- a specialized worker can complete the task more efficiently.

Keep the main Agent responsible for user interaction, shared requirements,
cross-task decisions, integration, and the final result. Give each worker a
bounded objective, relevant constraints, permitted side effects, completion
criteria, and the evidence or summary it must return.

Use the smallest useful fan-out, normally one worker. Parallelize independent
read-only tasks when doing so is useful. Prefer sequential ownership for all
writes and other shared-state mutations.

## Select and review workers

Match the worker to the task using the established tiers. Use `versatile` as
the ordinary delegated default, move to `lightweight` for well-specified
mechanical work, and move to `powerful` when ambiguity, risk, or difficulty
demands it.

Review a delegated result when it changes files or external state, supports a
material claim or decision, carries meaningful uncertainty, or otherwise has
significant consequences. Low-risk extraction and mechanical work may instead
use deterministic validation or a focused parent check.

For a separate review:

1. Select a reviewer one tier above the worker. When the worker already uses
   the `powerful` tier, use an independent `powerful` reviewer at higher
   reasoning effort.
2. Give the reviewer the original objective and constraints plus the actual
   artifact or diff. Treat the worker's summary as navigation rather than
   evidence.
3. Ask for a concise accept-or-revise verdict, concrete defects, and required
   corrections.
4. Send a local defect back to the original worker for a focused correction.
   Escalate the worker tier when the failure indicates insufficient capability.
   Complete the work inline when another handoff would cost more than it saves.

Use executable checks in addition to model review whenever the task provides
them. The main Agent integrates the accepted result and confirms that the
task's completion criteria are met.

## Degrade gracefully

When model overrides are unavailable, use the best suitable model the runtime
can select. When subagents are unavailable or their overhead no longer pays
off, continue inline. Treat optimized routing as an opportunity, not a
prerequisite for completing the user's task.

Keep an inline decision silent. Briefly report delegation or escalation when
it materially affects timing, cost, permissions, or task structure.
