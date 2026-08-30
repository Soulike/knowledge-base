---
name: design-image-generation-prompts
description: Design a new image-generation prompt for a people-focused still image. Use when the user wants help writing a drawing or image-generation prompt.
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

## Settle the canvas and creative direction

Always establish the target orientation and explicit aspect ratio. Also settle
intended use, cropping tolerance, and required negative space when they affect
the composition. When an image reference is involved, establish whether its
composition, crop, or aspect ratio should control the new frame. Never inherit
the reference image's canvas merely because the image will be supplied to the
model.

When the target canvas is missing, recommend one with a brief composition-based
reason and ask the user to accept or change it. When the user explicitly
delegates the choice, make it and surface it in the visible-design summary.

Settle the macro creative direction before developing details:

- the intended medium and artifact, such as an anime key visual, light-novel
  cover, environmental photograph, or another form;
- the overall visual language and degree of stylization or realism;
- mood, atmosphere, emotional temperature, and intended visual impression;
- value, palette, contrast, and lighting character;
- rendering or photographic character; and
- the background's narrative role and intended detail density.

Treat these as high-impact decisions, not low-impact gaps. When they are absent
and the user has not delegated them, use the matching Knowledge and research to
propose one coherent creative direction, explain the most important trade-off,
and ask the user to accept or change the proposal. Do not make the user invent
technical art direction that the Agent can recommend.

## Develop the visible frame

Use the settled intent, canvas, creative direction, and matching Knowledge to
expand a simple idea into a complete visual design. Resolve the focal hierarchy,
cast and interaction, selected action instant, viewpoint, composition,
foreground-middle-ground-background structure, motivated light, environment,
props, material response, and secondary visual accents that make the intended
image specific and visually engaging.

Choose richness deliberately. Add environmental storytelling, depth, lighting,
color relationships, effects, and supporting details when they reinforce the
intent; remove them when restraint or negative space is the intended visual
character. A sparse background and a richly layered scene are both valid only
when their density is an explicit design choice rather than an omitted decision.

Do not begin prompt construction until the target canvas, macro creative
direction, and visible-frame development are explicit or deliberately
delegated, and every unresolved high-impact user-owned choice has been settled.
When the conversation already contains those decisions, proceed without
repeating them. Otherwise present one combined visible-design proposal and wait
for the user's confirmation before constructing the prompt.

## Construct and deliver the prompt

After the image design is coherent, read
[Render the prompt package](../../references/generative-media/still-image-prompt-contract.md#render-the-prompt-package)
and the
[natural-language prompt format](../../references/generative-media/natural-language-prompt-format.md),
then apply the matching still-image prompting Knowledge to express the result.

Before finishing, verify that:

- the final prompt explicitly states the target orientation and aspect ratio,
  and its crop, figure scale, and negative space are compatible with that
  canvas;
- the image has one controlling visible proposition and one coherent instant;
- every important person, attribute, action, interaction, position, and contact
  has an unambiguous owner;
- the medium, artifact, visual language, atmosphere, palette, and background
  role are explicit rather than left to model defaults;
- composition, spatial layers, environment, motivated light, material response,
  and supporting details create the intended degree of richness without
  competing with the focal idea;
- every material factual or visual research gap is resolved or disclosed;
- every image has an explicitly user-decided role and destination;
- every analysis-only image has been translated into relevant textual
  instructions and is absent as an external dependency from the final prompt;
- every model-input image appears in the image-handling output and has a clear
  semantic role;
- the prompt satisfies the selected natural-language format, including its
  user-language and continuous-prose requirements, and does not split the
  result into positive and negative prompts or a keyword string;
- the prompt is coherent, self-contained, model-independent, and free of
  provider-specific syntax or parameters; and
- the response contains the prompt package without invoking an image-generation
  tool.
