---
name: design-image-generation-prompts
description: Design a new image-generation prompt for a people-focused still image. Use when the user wants to create a drawing or image-generation prompt and no existing prompt or generated result is being evaluated.
---

# Design image-generation prompts

Produce a prompt package that another image model can use to generate one new
still image centered on one or more people. Finish with the prompt package;
leave image generation, model selection, provider parameters, provider
acceptance, and provider-specific input controls to the caller.

Own the professional visual-development work that an illustrator, art director,
or photographer would perform before production: research the need, make
quality-oriented visual decisions, critique the resulting design, and hand off
the prompt and material plan. Do not act as a formatter for the user's first
description.

## Validate the generation request

Confirm that the requested artifact is a newly generated, people-focused still
image. It may use no images or several images as identity, pose, composition,
setting, wardrobe, style, or other references, but it does not preserve or
modify an existing image as an edit target. Treat photographic, anime,
painterly, comic, 3D, and other visual media as open possibilities rather than
an exhaustive style taxonomy.

When the user asks to review, diagnose, or improve an existing prompt or
generated result, explain that evaluating an existing attempt falls outside
this workflow and stop without producing a prompt package for that request.

When the requested outcome is a video or an edit whose target is an existing
image, such as modifying, replacing, or extending a region or requiring regions
of that same image to remain unchanged, explain that it falls outside this
workflow and stop without producing a prompt package. Do not apply this stop to
references that constrain a newly generated whole image.

Inventory the user's intent, constraints, references, and every settled
decision already available in the conversation or supplied artifacts. Use that
information regardless of how it was obtained. Do not repeat research or ask
the user to reconfirm a decision merely because another process collected it.

## Establish the prompt execution target

Read
[Establish the prompt execution target](../../references/generative-media/prompt-execution-target.md)
and complete it before evaluating the Knowledge index. Use an already selected
target only to route matching Knowledge and portable prompt mitigations; do not
choose or configure an image model as part of this workflow.

## Establish image inputs

When the user supplies an image, read
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

Apply the matching visual-design Knowledge to identify material that would
resolve a hard requirement or materially improve the design, then record the
result in the material plan. When tools permit, search for and inspect candidate
references; otherwise provide concrete search, photography, or preparation
criteria. Treat Agent-found references as analysis only unless the user
explicitly approves one as a model input. Do not automatically download or
redistribute external images.

When a hard requirement depends on unavailable material, present the supported
alternatives identified by the Knowledge and wait for the user's resolution.
Continue without nonessential material when the design can remain coherent, and
state what the optional material could improve. Route every newly supplied or
newly approved model-input image through the image contract before using it.

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
form one coherent recommended direction. Ask immediately only when a genuine
creative fork or hard constraint prevents a responsible recommendation;
otherwise carry that direction into the complete visible-frame proposal. Do not
make the user invent technical art direction that the Agent can recommend.

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

## Critique and preflight the handoff

Apply the matching visual-design Knowledge to critique the complete proposal
before presenting it or constructing the prompt. Revise every issue the
Knowledge identifies, and present the corrected proposal rather than the first
draft or the internal critique.

Apply the still-image prompting Knowledge to preflight model-independent
generation risks and apply its mitigations without changing hard constraints
silently. When a mitigation changes intent, ask the user which requirement
controls; otherwise disclose only the residual risks that materially affect the
handoff.

Do not begin prompt construction until the target canvas, macro creative
direction, visible-frame development, material plan, visual critique, and
generation preflight are complete; every required material is available or the
user accepted an alternative; and every unresolved high-impact user-owned
choice has been settled. When the conversation already contains those
decisions, proceed without repeating them. When the user explicitly delegated
them, make and surface the decisions. Otherwise present one combined proposal
containing the applicable visual brief, material plan, and material risk or
trade-off for confirmation, then wait before constructing the prompt.

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
- every useful or required visual material has a defined purpose and evidence
  requirement, and each unavailable hard requirement has a user-accepted
  resolution;
- the complete visual design has passed a professional critique rather than
  preserving the first plausible proposal;
- model-independent generation risks have been mitigated, accepted, or
  disclosed without promising a particular model's execution;
- every material factual or visual research gap is resolved or disclosed;
- the prompt's execution target is recorded when known, or the user chose the
  portable path after the workflow asked about an unspecified target;
- target-specific Knowledge was applied only when its routing conditions
  matched established execution context, and every resulting prompt
  instruction remains observable, natural-language, and portable;
- every user-supplied image and every image proposed as a model input has an
  explicitly user-decided role and destination;
- every Agent-found reference not approved as a model input remains analysis
  only, has its relevant properties translated into text, and is identified by
  source when it materially informed the design;
- every analysis-only image has been translated into relevant textual
  instructions and is absent as an external dependency from the final prompt;
- every model-input image appears in the image-handling output and has a clear
  semantic role;
- the prompt satisfies the selected natural-language format, including its
  user-language and continuous-prose requirements, and does not split the
  result into positive and negative prompts or a keyword string;
- the prompt is coherent, self-contained, model-independent, and free of
  provider-specific syntax or parameters; and
- the response includes every applicable final visual brief, material plan,
  research finding, generation risk, and final-prompt component without empty
  sections or invoking an image-generation tool.
