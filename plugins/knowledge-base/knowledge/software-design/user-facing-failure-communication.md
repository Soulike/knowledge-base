# User-facing failure communication

## Scope

This document defines how software projects turn an observed failure state into accurate, decision-relevant communication for users across graphical interfaces, command-line tools, developer-facing APIs, notifications, and agent output. It covers the facts and effect certainty a message may claim, preservation through the delivery path, separation of primary and diagnostic information, supported recovery and retry guidance, and validation of the final observable result; product terminology, tone, visual treatment, and specific support routes remain with the consuming product.

## When to update

Update when evidence changes the durable relationship among observed failure facts, result certainty, effect safety, user capability, delivery-path preservation, diagnostic disclosure, supported recovery, and final presentation within this scope.

## Start from the user's decision

Determine what the user must understand or decide after the failure:

- which attempted action or result did not complete as expected;
- which object, request, or output is affected;
- which effects definitely occurred, definitely did not occur, or remain uncertain; and
- which action, limitation, or escalation path matters next.

Include the smallest complete context that supports that decision. Do not reproduce the implementation sequence or every available diagnostic field merely because it exists. A user-facing failure is an interface result, so select its information from the user's task rather than from the shape of an exception or backend response.

## Trace the delivered failure

Review the affected path from the failure producer to every user-facing consumer. Include protocol conversion, serialization, typed-result mapping, fallback selection, notification construction, and final presentation. At each boundary, identify which observations, effect states, recovery conditions, and uncertainties are preserved, transformed, dropped, or synthesized.

User-visible behavior can change without changing a message string. A generic fallback can replace a specific failure, a mapping can lose a retry condition, serialization can omit a diagnostic identifier, or an internal message can reach a new audience. Complete the trace when every affected consumer has a known presentation or evidence establishes that the failure remains internal.

## Separate the primary message from supporting details

The primary message supports the immediate decision. Identify the failed action or affected result and include any cause, uncertainty, consequence, next action, or recovery limitation that the user needs at that point. Do not force every message into the same field sequence. A simple validation error can be complete in one layer, while an ambiguous state-changing operation may need its result uncertainty in the primary message.

Supporting details provide evidence for diagnosis or escalation, such as relevant paths, error codes, declared and observed values, or a correlation identifier. Put long diagnostic output in a secondary disclosure or log view when the user can reach it without losing information required for safe action. Apple similarly recommends that alerts contain only essential information and useful actions, with additional text only when it adds value in that presentation context ([Apple Human Interface Guidelines: Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts)).

Select details for the receiving audience and disclosure boundary. Do not expose secrets, personal data, internal topology, or exploit-relevant implementation details merely because they could help diagnose the failure. Exclude secrets and unnecessary personal data from both user-facing and operational records, route only necessary diagnostics to an authorized and appropriately protected operational channel, and provide a safe correlation identifier when it lets the user support escalation. HTTP problem details apply the same separation between interface-level problem information and internal debugging data ([RFC 9457, Security Considerations](https://www.rfc-editor.org/rfc/rfc9457.html#section-5)).

For automatically detected input errors, identify the affected input and describe the error in text. Suggest a correction when one is known and providing it does not compromise security or the purpose of the content ([WCAG 2.2 Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html), [WCAG 2.2 Error Suggestion](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html)).

## Bind explanations to established facts

Separate observations from explanations. A comparison can establish that two values differ without establishing which value is wrong or why it changed. A timeout can establish that no response arrived within the expected interval without establishing whether remote work failed, stopped, or completed after the caller gave up.

State a cause only when the implementation establishes it. Mark decision-relevant uncertainty explicitly, and omit speculation that does not help the user act. When the available failure data cannot support a useful message, treat the missing information as an implementation or observability gap rather than filling it with a guessed explanation.

## Offer recovery that the user can perform safely

Recovery guidance must follow the current user's role, permissions, available controls, and the operation's effect contract. Prefer an action available in the current context. When another role owns the repair, identify that role when known and provide the information the current user can safely pass to it. Do not assume that every consumer is also the package maintainer, service operator, or administrator.

Make diagnostic actions concrete by identifying what to inspect and where the relevant control or information exists. Viewing logs is an investigation step unless those logs supply a defined recovery procedure. When no reliable self-service action exists, state the known result and recovery limitation. Do not invent a support channel, corrective action, or likely cause merely to complete an error-message formula.

## Treat retry advice as a behavioral promise

Retry advice consumes the operation's effect contract; it does not define that contract. Recommend another attempt only when evidence indicates that it may help and repeating the operation is safe. Guidance for transient faults likewise distinguishes retryable failures from fatal or invalid requests and requires the effects of repeated execution to be understood ([Microsoft Azure transient-fault guidance](https://learn.microsoft.com/en-us/azure/well-architected/design-guides/handle-transient-faults)).

For a state-changing operation, establish from its effect contract that the earlier attempt definitely produced no effect, repeating the same intent is inherently idempotent, a durable idempotency identity is enforced at every covered effect boundary, a conditional mutation is tied to the expected state, or an ambiguous outcome can be reconciled before another attempt. A lost response can otherwise make a successful first mutation look like a failed request and turn an automatic retry into a duplicate effect ([AWS Builders' Library: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)). Apply [Overlapping mutation admission](overlapping-mutation-admission.md) when another invocation can begin before the earlier operation and its owned finalization settle.

If the result remains uncertain, tell the user how to inspect or reconcile it before repeating the action. A retry button or instruction is misleading when the same request could create a duplicate or repeat another irreversible effect. When a known condition must change first, state that condition, such as waiting for conflicting work to finish or restoring connectivity.

## Validate the final presentation

Validate the observable communication rather than only its source string. Apply [Test effectiveness](../software-testing/test-effectiveness.md) to protect branch-specific failure behavior at its owner and add a composed check when the relevant defect is loss or distortion between the producer and presentation. Use the narrowest boundary that can expose the named fault while retaining a representative user-visible case for cross-boundary wiring.

Useful scenarios include:

- a known cause with a safe local correction;
- a failure requiring another role;
- a result that remains uncertain after a timeout or disconnect;
- a useful producer message replaced by a generic fallback;
- a simple validation error that needs no supporting disclosure; and
- an internal diagnostic that never reaches users.

Validation should establish that users receive accurate, decision-relevant information and that every offered action is available and safe. Do not freeze incidental wording when several formulations satisfy the same observable contract.
