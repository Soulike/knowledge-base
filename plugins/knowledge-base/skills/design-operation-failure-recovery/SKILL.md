---
name: design-operation-failure-recovery
description: Use when designing, implementing, substantively changing, or reviewing an operation or workflow whose outcome an external consumer can observe, including background work. Establish non-success outcomes and recovery even when the request only describes success.
---

# Design operation failure and recovery

Apply this workflow within the requested design, implementation, change, or
review. Resolve bundled paths relative to this `SKILL.md`. Follow instructions,
requirements, and project-specific contracts in the active working directory;
use packaged Knowledge as supplemental guidance.

1. Read the [Knowledge index](../../knowledge/index.md) and its matching leaves.
   For this workflow, read [Failure and recovery in externally observable
   operations](../../knowledge/software-design/operation-failure-and-recovery.md),
   [User-facing failure
   communication](../../knowledge/software-design/user-facing-failure-communication.md),
   and [Test
   effectiveness](../../knowledge/software-testing/test-effectiveness.md).
   Read [Interaction clarity](../../knowledge/user-interface/interaction-clarity.md)
   and [User goodwill](../../knowledge/user-interface/user-goodwill.md) when a
   person interacts with the flow. Read the matching platform-specific
   Knowledge when an interface exists. If inspection shows no externally
   observable outcome, continue the original task at its responsible internal
   boundary without a full consumer recovery map.
2. Establish the consumer's goal, the operation's actual or proposed effects,
   prerequisites, roles, and completion signal. For existing behavior, inspect
   the producing model and the path to each affected consumer rather than
   inferring it from a screen, error string, or response schema alone. For a
   proposed flow, distinguish established constraints from assumptions that
   need a product or contract decision.
3. Identify reachable non-success outcomes across the operation's transitions.
   Group faults only when the consumer's result, effect certainty, and safe
   continuation are the same. Include partial, pending, and unconfirmed effects
   when reachable. Note preventable errors, work that should remain available,
   and material states whose reachability or effects are unresolved.
4. For each outcome, design the operation-level continuation and the
   consumer-facing result together. Confirm who can perform the next action,
   what condition must change, whether repetition is safe, and how the consumer
   will know recovery completed. Trace facts, uncertainty, and recovery
   conditions through every mapping and presentation boundary. For an
   interactive consumer, choose feedback location, persistence, interruption,
   and accessible status from the actual consequence; keep essential result
   and next-action information in the primary presentation.
5. When the required continuation lacks a product capability, record the
   missing query, repair, resume, rollback, or safe retry as a design gap and
   propose feasible choices. Obtain a decision from the responsible person for
   data loss, duplicate effects, permission changes, irreversible outcomes, or
   product promises before treating the affected contract as settled. An
   honest limitation or real escalation path can be an interim or terminal
   result when its conditions are established; wording alone does not close a
   missing recovery capability.
6. Leave a concise mapping in the requested design, change description, or
   review: each material outcome, its known and uncertain effects, the path to
   each consumer, the observable result and feasible next action, and its
   verification disposition. At design time, specify testable contracts and
   planned checks without claiming they ran. For implementation or review,
   inspect the actual path and verify the affected behavior: detailed branches
   at their owning seams and a representative user-observable composed case
   when cross-boundary loss is a risk. For consequential interactive recovery,
   use a representative task after the path is operable and distinguish
   observed usability from automated contract protection. Report any
   unavailable check or unresolved state explicitly.

Finish a design or review with each material external outcome mapped to a
truthful, supported continuation or an explicit design gap and decision owner.
For implementation, complete the requested flow only when its required
recovery paths work and have stage-appropriate evidence; report a material gap
or unresolved consequential decision as an incomplete part of that flow. Do not
count a planned test as passed, a displayed message as proof of an effect, or a
suggested action as recovery until the required capability and conditions are
established.
