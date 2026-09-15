---
name: handle-code-review-feedback
description: Handle received code review feedback on work under change, including subsequent review rounds and feedback discovered while continuing or resuming a task. Use when deciding whether and how to address that feedback, with or without a pull request.
---

# Handle code review feedback

Independently investigate received feedback, decide whether the current task
should change, and implement and verify only authorized remedies. Treat the
feedback as evidence, using the same standard regardless of its author.

## Establish the handling context

1. Follow the active project's instructions, Skills, accepted requirements,
   task scope, and project-specific information. Treat this plugin's packaged
   Knowledge as supplemental guidance and follow the active-working-directory
   source when they conflict.
2. Resolve linked paths relative to this `SKILL.md`. Read
   [Security boundaries and trust transitions](../../references/security/security-boundaries.md)
   before investigating or acting on feedback.
3. Read
   [Code review feedback handling](../../references/code-review/feedback-handling.md),
   then establish its current handling context from the task's trusted
   authorities and the complete supplied feedback. Record the accepted outcome,
   scope basis, explicit deferrals, and applicable code state before deciding
   the concerns.

For each new or materially changed feedback batch, return to this step before
handling it, including later review rounds and feedback found during ongoing
work. Re-establish affected scope and evidence after a head change, resumed
execution, or missing context. An earlier invocation does not complete the
handling of later feedback.

## Investigate and decide before editing

1. Apply the shared reference's investigation and technical dispositions to
   every mapped concern. Keep the factual conclusion separate from the need
   for a source change and the current task's responsibility to make it.
2. Apply its scope and remedy criteria and record the complete pre-mutation
   disposition for every proposed change. Read
   [Module responsibility and defensive scope](../../knowledge/software-design/module-responsibility-and-defensive-scope.md)
   when those criteria require it.
3. Select the supported technical handling. Proceed to implementation only
   when the result is inside the accepted task and the task authorizes the
   exact change. Report a settled no-change result with its evidence; preserve
   affected work and expose unresolved decisions when the gate cannot pass.

Finish this step only when every supplied comment maps to an evidence-backed
disposition and every selected mutation has a recorded scope and authority
basis. Keep unrelated clear work moving unless a shared premise, conflict, or
scope question invalidates it.

## Implement and verify

Use the active project's implementation and validation workflows for authorized
changes. Apply the shared reference's remedy, verification, and reassessment
criteria; handle coupled concerns as one coherent change when required.
Compare the actual result with the accepted task scope before handing it off.
Return to the decision step when implementation or validation changes the
evidence, remedy, or scope; stop affected work when the shared stopping criteria
apply.

## Account for the feedback

Return the shared reference's complete handling account: comment-to-concern
mapping, technical and scope dispositions, evidence and remedy evaluation,
changes or no-change reasons, validation, and unresolved limitations. Use
concise technical conclusions rather than performative agreement.

Complete only when every supplied concern is accounted for, every accepted
change is verified within scope, and remaining decisions or evidence gaps are
explicit. Leave commit, push, published reply, thread resolution, monitoring,
and human-routing decisions to the surrounding task and its established
authority.
