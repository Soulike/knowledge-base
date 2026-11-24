---
name: workflow-design-image-generation-prompts
description: Design a new image-generation prompt for a people-focused still image. Use when the user wants to create a drawing or image-generation prompt and no existing prompt or generated result is being evaluated.
---

# Design image-generation prompts

Produce a prompt package that another image model can use to generate one new
still image centered on one or more people. Finish with the prompt package;
leave image generation, model selection, provider parameters, provider
acceptance, and provider-specific input controls to the caller. Own the
professional visual-development work of an illustrator, art director, or
photographer rather than formatting the user's first description.

## Validate the generation request

Confirm that the requested artifact is a newly generated, people-focused still
image (with no input images or with reference images constraining a new whole
image, never editing or preserving regions of an existing image). Treat
photographic, anime, painterly, comic, 3D, and other visual media as open
possibilities rather than an exhaustive taxonomy.

Stop without producing a prompt package and explain that the request falls
outside this workflow when the user asks to:

- review, diagnose, or improve an existing prompt or generated result; or
- produce a video or an edit targeting an existing image (modifying,
  replacing, or extending a region, or keeping regions of that image unchanged).

Inventory the user's intent, constraints, references, and settled decisions
already available in conversation or supplied artifacts without repeating
research or asking to reconfirm settled choices.

## Establish target and image inputs

Read
[Establish the prompt execution target](../../references/generative-media/prompt-execution-target.md)
before target-specific Knowledge. Use a known target only to route applicable
Knowledge and portable mitigations; do not choose or configure a model.

When the user supplies an image, read
[Establish every image's contract](../../references/generative-media/still-image-prompt-contract.md#establish-every-images-contract)
before treating it as a requirement. Inspect visible facts yourself without
inferring what an image should control or whether the model will receive it.

## Research the image

Read [People-focused still-image
design](../../knowledge/generative-media/people-focused-still-image-design.md)
and [Natural-language prompting for generated still
images](../../knowledge/generative-media/still-image-prompting.md) in full before
research and dependent decisions. When the intended medium is known, read every
matching medium-specific document before dependent research or design:

- for a photographic or photorealistic image, read [People-focused
  photographic-image
  design](../../knowledge/generative-media/people-focused-photographic-image-design.md);
- for an anime- or manga-influenced illustration, read [People-focused anime
  illustration
  design](../../knowledge/generative-media/people-focused-anime-illustration-design.md).

After establishing the execution target, read [Gemini App people-image
prompting](../../knowledge/generative-media/gemini-app-people-image-prompting.md)
only when generating in the Gemini App (direct Gemini model or API use does not
match; establish the path when the user says only "Gemini"). Re-evaluate these
reading conditions when the medium, execution target, artifact, or task stage
changes, reusing current available readings. Treat packaged Knowledge as
supplemental to instructions, requirements, Skills, and project context in the
active working directory.

Separate investigable facts from user-owned creative choices (recommend an
answer, fill low-impact gaps coherently, avoid questionnaires, and ask which
hard constraint controls when constraints conflict), and read
[Research and reference sourcing](../../references/generative-media/research-and-reference-sourcing.md)
for external research, candidate reference handling, and unavailable material.

## Settle direction, develop frame, and preflight

Always establish target orientation and an explicit aspect ratio, plus intended
use, cropping tolerance, required negative space, and whether a reference image
controls composition or crop when relevant. Never inherit a reference image's
canvas passively; recommend a missing canvas with a brief composition reason or
surface delegated choices in the visual brief.

Read
[Settle macro direction and visible frame](references/frame-design-and-checklist.md#settle-macro-direction-and-visible-frame)
to settle macro creative direction (medium/artifact, visual language, mood,
value/palette/lighting, rendering character, and background role/density) and
develop the complete visible frame with deliberate visual richness or restraint.

Critique the complete proposal using matching visual-design Knowledge and
revise every identified issue before presenting it or writing the prompt. Apply
the still-image prompting Knowledge to preflight model-independent generation
risks without silently changing hard constraints (ask if mitigation alters
intent; otherwise disclose material residual risks).

**Pre-construction gate:** Do not begin prompt construction until target canvas,
macro direction, visible frame, material plan, critique, preflight, required
materials (or accepted alternatives), and high-impact user choices are settled.
Proceed if already settled; make and surface choices if explicitly delegated;
otherwise present one combined proposal (visual brief, material plan, and
material risk or trade-off) for confirmation and wait.

## Construct and deliver the prompt

Read
[Render the prompt package](../../references/generative-media/still-image-prompt-contract.md#render-the-prompt-package),
the
[natural-language prompt format](../../references/generative-media/natural-language-prompt-format.md),
and the
[Pre-delivery verification checklist](references/frame-design-and-checklist.md#pre-delivery-verification-checklist),
then apply matching still-image prompting Knowledge to express the prompt
package.

**Completion criteria:** Finish only when the checklist is verified: target
orientation and aspect ratio are explicit and compatible with crop/scale; one
visible proposition and instant has unambiguous person, action, and contact
bindings; medium, hierarchy, and detail density are explicit; professional
critique, preflight, and research gaps are resolved or disclosed; execution
target and conditional target Knowledge rules were honored; every model-input
image has an explicitly user-decided role/destination and analysis-only
references are translated to text with sources cited when material; the prompt
is coherent, self-contained, model-independent continuous prose in the user's
language without positive/negative splits, keyword strings, or provider syntax;
and the response includes every applicable package component with no empty
sections and without invoking an image-generation tool.
