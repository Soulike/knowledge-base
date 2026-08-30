# Establish the prompt execution target

Use this reference when a people-focused still-image prompt workflow must
establish enough execution context to select model- or product-specific
Knowledge without taking responsibility for model selection or provider
configuration.

Inventory any image model, model family, product surface, or provider workflow
already named by the user or recorded with an existing generation attempt. Do
not ask the user to repeat information that is already available. Preserve the
most specific identity the evidence supports, but do not invent an exact model
identifier when the user knows only a family or product surface.

When no execution target is known, ask whether the prompt is intended for a
specific image model or product surface. Explain that the answer is used only
to apply matching prompt guidance. If the user has not chosen a target or does
not want target-specific adaptation, recommend continuing with a portable
prompt and do not select a model for them.

Carry an established target into the root Knowledge index's `When to Read`
evaluation. Apply target-specific Knowledge only when its stated conditions
match the known target and image. A product surface that may route among
several models supports only surface-level conclusions unless the exact model
can be established.

Translate an applicable target-specific mitigation into the observable visual
state needed in the image. Keep the copyable prompt in ordinary natural
language and omit model names, provider syntax, API parameters, and dedicated
control fields. Leave actual generation, model selection, provider acceptance,
and provider-specific configuration to the caller.

For an existing generated result, use the recorded target as execution
evidence, not as proof of causation. When the target is unknown, the workflow
may still critique the image and prompt, but it must not attribute an observed
failure to a particular model or apply a model-specific mitigation as though
the target were established.
