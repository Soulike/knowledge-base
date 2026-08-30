---
name: design-image-generation-prompts
description: Use when the user wants a new, detailed, model-independent natural-language prompt for generating a people-focused still image from an idea, visual brief, or zero or more image references.
---

# Design image-generation prompts

Produce a prompt package that another image model can use to generate one new
still image centered on one or more people. Finish with the prompt package;
leave image generation, model selection, provider parameters, provider
acceptance, and provider-specific input controls to the caller.

## Validate the generation request

Confirm that the requested artifact is a newly generated, people-focused still
image. It may use no images or several images as identity, pose, composition,
setting, wardrobe, style, or other references, but it does not preserve or
modify an existing image as an edit target. Treat photographic, anime,
painterly, comic, 3D, and other visual media as open possibilities rather than
an exhaustive style taxonomy.

When the requested outcome is a video or requires editing, replacing,
extending, or preserving any part of an existing image, explain that it falls
outside this workflow and stop without producing a prompt package for that
request.

Inventory the user's intent, constraints, references, and every settled
decision already available in the conversation or supplied artifacts. Use that
information regardless of how it was obtained. Do not repeat research or ask
the user to reconfirm a decision merely because another process collected it.

## Establish image inputs

When any image is available, read
[Establish every image's contract](../../references/generative-media/still-image-prompt-contract.md#establish-every-images-contract)
and complete it before treating the image as a requirement. Inspect visible
facts yourself, but do not infer what an image should control or whether the
image model will receive it.

## Research the image

Read the [Knowledge index](../../knowledge/index.md), apply every `When to Read`
condition to the current task, and read only the matching Knowledge documents.
Treat them as supplemental guidance; follow instructions, requirements,
Skills, and project-specific information from the Agent's active working
directory when they conflict.

Use the matching Knowledge to identify what is already settled and what remains
to be researched. Separate two kinds of missing information:

- investigate facts and visible evidence that can be established from images,
  current sources, direct observation, or subject-matter authorities; and
- ask the user only for unresolved creative choices, priorities, permissions,
  or trade-offs that materially change the image.

Give a recommended answer when asking the user to choose. Fill low-impact gaps
coherently when they do not conceal a meaningful creative fork. Do not turn the
Knowledge documents into a form, ask about every possible design dimension, or
repeat information already present. When hard constraints conflict, explain the
visible consequence and ask which constraint controls.

Perform external research when the matching Knowledge identifies an unfamiliar
or accuracy-sensitive subject, medium, visual reference, physical interaction,
place, period, culture, object, or technique. Prefer primary records,
subject-matter institutions, official technical material, and creator-owned
visual sources. Translate a named work, creator, or style reference into the
observable properties relevant to this image rather than using its name as a
substitute for art direction.

Proceed directly when the available evidence already resolves the necessary
design. Before prompt construction, present the current visible design for
confirmation only when unresolved complexity, several image contracts, exact
interactions, or material assumptions make silent commitment risky.

## Construct and deliver the prompt

After the image design is coherent, read
[Render the prompt package](../../references/generative-media/still-image-prompt-contract.md#render-the-prompt-package)
and the
[natural-language prompt format](../../references/generative-media/natural-language-prompt-format.md),
then apply the matching still-image prompting Knowledge to express the result.

Before finishing, verify that:

- the image has one controlling visible proposition and one coherent instant;
- every important person, attribute, action, interaction, position, and contact
  has an unambiguous owner;
- medium, composition, environment, light, color, and material decisions support
  the same intended frame;
- every material factual or visual research gap is resolved or disclosed;
- every image has an explicitly user-decided role and destination;
- every analysis-only image has been translated into relevant textual
  instructions and is absent as an external dependency from the final prompt;
- every model-input image appears in the image-handling output and has a clear
  semantic role;
- the prompt is coherent, self-contained, model-independent, and free of
  provider-specific syntax or parameters; and
- the response contains the prompt package without invoking an image-generation
  tool.
