# Gemini Nano Banana people-image prompting

## Scope

This document defines time-sensitive prompt adaptation and diagnosis guidance
for people-focused still images generated with Gemini native image generation,
also known as the Nano Banana family. It owns the generator-specific checks
that should be considered whenever this family is the execution target and
translates each applicable mitigation into portable natural language; the
currently evidenced check concerns recurring omission of fingernails or
toenails when visible hands or feet should show them.

## When to update

Update this document when Google changes the Nano Banana family, its supported
model names, model identifiers, generation surfaces, or prompt-following
behavior, or when representative repeated generations establish, invalidate,
or change a family-specific prompting risk or mitigation for people-focused
images.

## Recognize the current family

Google currently documents these equivalent Nano Banana family identities in
its
[Gemini API image-generation guide](https://ai.google.dev/gemini-api/docs/image-generation):

| Family name        | Official Gemini model name  | API model ID                  |
| ------------------ | --------------------------- | ----------------------------- |
| Nano Banana 2 Lite | Gemini 3.1 Flash Lite Image | `gemini-3.1-flash-lite-image` |
| Nano Banana 2      | Gemini 3.1 Flash Image      | `gemini-3.1-flash-image`      |
| Nano Banana Pro    | Gemini 3 Pro Image          | `gemini-3-pro-image`          |
| Nano Banana        | Gemini 2.5 Flash Image      | `gemini-2.5-flash-image`      |

Treat a family name, its corresponding official Gemini name, and its API model
ID as the same execution-target identity for Knowledge routing. A Gemini
product surface that exposes native image generation without identifying the
underlying model still selects this family profile, but supports only
surface-level conclusions until the exact model is established.

## Evaluate the fingernail and toenail risk conditionally

Nano Banana names a family of Gemini image-generation models rather than one
permanent implementation. Record the exact model or product surface when
evaluating results because versions can behave differently. Read this guidance
whenever the family is the execution target, but apply the fingernail and
toenail mitigation below only as an operational heuristic for an image that
meets its conditions, not as a claim that every version or every generation
omits nails.

Use the mitigation only when all of these conditions hold:

- the intended generator matches a current family identity above or a Gemini
  product surface using native image generation;
- one or more hands or feet are inside the frame and large enough for individual
  digits to resolve; and
- ordinary anatomy, grooming, character design, or the requested styling makes
  fingernails or toenails visibly relevant.

Do not spend prompt attention on fingernails hidden by gloves, toenails hidden
by closed footwear, fully occluded digits, or figures too small for nails to be
meaningful. A viewing angle may expose only some nails; require anatomically
present nails rendered where the angle permits rather than demanding that every
nail face the viewer.

## Add one positive, locally bound visual requirement

State the intended anatomy rather than listing defects to avoid. Bind the
requirement to the named person and to the exposed hands or feet so it cannot
drift to another figure. Keep it near that person's pose, action, or appearance
description, and specify manicure, polish, length, color, or stylization only
when the image actually needs those choices.

For example, adapt the relevant part of the prompt to say:

> Her exposed hands have anatomically complete fingers, with naturally formed
> fingernails rendered wherever the viewing angle reveals them. Her bare feet
> have anatomically complete toes, with naturally formed toenails visible where
> the pose and angle permit.

Rewrite this example for the actual subject, visibility, medium, and desired
grooming. Do not append a generic defect list such as "no missing nails," rely
on vague phrases such as "perfect hands and feet," or require bare feet merely
to make toenails visible.

The generator-specific observation decides when to include this sentence; the
sentence itself should describe only the intended visible image. Do not mention
Gemini, Nano Banana, model identifiers, provider controls, or API syntax inside
the copyable prompt. This keeps the prompt semantically complete and usable by
another image model even though a model-specific risk caused the detail to be
made explicit.

## Diagnose the next result from the evidence

Use the distinction among specification and generator execution in
[Natural-language prompting for generated still images](still-image-prompting.md#separate-the-picture-its-specification-and-its-execution).
When visibly relevant nails were absent from the prompt, treat their omission as
a specification gap and add the complete positive requirement. When the prompt
already states the requirement clearly but the result still omits the nails,
treat that result as generator-execution evidence rather than repeatedly
inflating the wording.

For a recurring execution failure, preserve the coherent prompt and compare
another generation under the recorded model and surface. If the detail remains
important and repeatedly fails, improve its visual opportunity by increasing
the figure or extremity scale, reducing competing detail, choosing a clearer
pose, or using a supported localized correction workflow. Do not promise that
text alone can force the model to render a low-resolution or occluded detail.

## Sources

- [Google AI for Developers: Gemini API image generation](https://ai.google.dev/gemini-api/docs/image-generation)
- [Google: Nano Banana Pro image generation prompting tips](https://blog.google/products-and-platforms/products/gemini/prompting-tips-nano-banana-pro/)
