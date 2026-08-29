---
name: design-image-generation-prompts
description: Use when the user wants to design or revise a detailed, model-independent natural-language prompt for a people-focused still image. Applies to textual briefs of any specificity, character or other images supplied to the image model, visual references available only for analysis, edits to an existing image, and unsatisfactory prompts or generated results.
---

# Design image-generation prompts

Produce a prompt package that another image model can use to create or edit one
still image centered on one or more people. Finish with the prompt package;
leave image generation, model selection, provider parameters, and provider
acceptance to the caller.

## Establish the request

1. For a request that does not revise an earlier attempt, classify the intended
   result as one of these closed cases:
   - **Generate:** describe a new image, with or without image inputs.
   - **Edit:** change an existing image while preserving identified invariants.
2. When the user supplies an earlier prompt, an unsatisfactory result, or both,
   record the available artifacts as revision evidence. Defer both diagnosis
   and classification of the replacement prompt until every supplied image has
   been routed.
3. Confirm that the requested artifact is a people-focused still image. Treat
   photographic, anime, painterly, comic, 3D, and other visual media as open
   possibilities rather than an exhaustive style taxonomy.

## Route every input image

For each image available to the Agent, establish two independent properties:

- **Role:** what the image contributes. Examples include character identity,
  an edit target, pose, interaction, camera angle, composition, setting,
  wardrobe, prop design, or visual style. One image may have several roles, and
  this list does not limit other roles relevant to the request.
- **Destination:** either **model input**, meaning the user will supply the
  image to the image model with the final prompt, or **analysis only**, meaning
  only the Agent can inspect it and the final prompt must translate its
  relevant information into words.

Record a stable label, role, destination, required invariants, allowed
adaptations, and intentionally ignored content for each image when those
details matter. Use the user's explicit delivery statement first. Treat “use
the character from this image” as model input and “edit this image” as a
model-input edit target when the surrounding request does not contradict that
reading. Wording such as “use this image's pose, camera angle, composition, or
style as reference” establishes a role but not, by itself, a destination. Ask
when the request does not establish whether the image will accompany the final
prompt, or when wording such as “refer to this image” or “combine these images”
also leaves its role unclear.

Inspect accessible images instead of asking the user to report visible facts.
When an image cannot be inspected, identify the missing evidence and ask the
user to reattach it or describe the relevant part. If exact character identity
matters but the only character image is analysis only, ask the user to choose
between supplying it to the image model and accepting a textual approximation.

## Diagnose a prior attempt

When the request includes an earlier prompt or unsatisfactory result, read
[Diagnose an unsatisfactory result](references/visual-requirements.md#diagnose-an-unsatisfactory-result),
identify the material causes of the mismatch from the available evidence, and
request only missing evidence that materially blocks the diagnosis. Then
classify the replacement prompt as generate or edit from the user's intended
next action. Keep that intent independent from every image's destination: a
prior result may be analysis only or may accompany either kind of replacement
prompt in an explicitly assigned model-input role.

## Research the visual requirements

Read the shared lenses for the
[controlling visual idea](references/visual-requirements.md#find-the-controlling-visual-idea),
[people and relationships](references/visual-requirements.md#resolve-people-and-relationships),
[one visible instant](references/visual-requirements.md#freeze-action-into-one-visible-instant),
[medium-specific decisions](references/visual-requirements.md#choose-medium-specific-decisions),
and [research readiness](references/visual-requirements.md#decide-whether-research-is-complete).
Read every additional branch that applies to the request:

- for analysis-only images or transfers between images, read
  [Extract and adapt visual references](references/visual-requirements.md#extract-and-adapt-visual-references);
- for an edit, read
  [Bound an edit](references/visual-requirements.md#bound-an-edit).

Treat enumerations in these sections as examples unless they explicitly mark a
closed distinction.

Build a decision frontier from the information already available. In each
round, ask all currently answerable questions whose unresolved answers would
materially change the image. Give a recommended answer for each question. Do
not ask a question whose answer depends on another open decision, repeat a
settled question, or turn the reference's decision lenses into a form the user
must fill out. Resolve visible facts from the supplied evidence yourself.

The user may delegate a decision to the Agent. Make a coherent choice and
surface any material assumption in the requirement summary. Fill low-impact
gaps without blocking. When hard constraints conflict, identify the conflict
and ask which constraint controls.

For a simple, low-ambiguity request, proceed without a separate confirmation
turn. Before composing any materially complex prompt, such as one involving
multiple people, several image roles, exact interactions, or tightly bounded
edits, present the current understanding and wait for confirmation unless the
user delegated the remaining choices. These cases illustrate complexity rather
than defining its limits.

## Construct and deliver the prompt

Read [Prompt construction](references/prompt-construction.md) after the visual
requirements are settled. Use it to translate the final design into a
self-contained, static, natural-language prompt and to render the prompt
package.

Before finishing, verify that:

- every high-impact decision is settled or explicitly delegated;
- every input image has an unambiguous role and destination;
- every analysis-only image has been translated into relevant textual
  instructions and is absent as an external dependency from the final prompt;
- every model-input image is accounted for by the
  [Image handling output component](references/prompt-construction.md#render-the-prompt-package)
  and has a clear role in the prompt;
- the prompt describes one visible instant, even when the pose implies motion;
- multiple people have unambiguous identities, actions, interactions, and
  spatial relationships;
- user constraints remain authoritative over inferred aesthetic improvements;
- the copyable prompt is continuous multi-paragraph prose rather than headings,
  labeled fields, a list, a data structure, or a keyword string;
- the prompt is coherent, self-contained, model-independent, and free of
  provider-specific syntax or parameters; and
- the response contains the prompt package without invoking an image-generation
  tool.
