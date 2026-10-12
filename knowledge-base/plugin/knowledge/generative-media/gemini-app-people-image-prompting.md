# Gemini App people-image prompting

## Scope

This document defines time-sensitive prompt adaptation and diagnosis guidance
for people-focused still images generated through the Gemini App. It owns the
product-surface-specific checks that should be considered whenever the Gemini
App is the execution target and translates each applicable mitigation into
portable natural language; the currently evidenced check concerns recurring
omission of fingernails or toenails when visible hands or feet should show them.

## When to update

Update this document when Google changes image generation in the Gemini App,
its available image modes or models, its product interaction or
prompt-following behavior, or when representative repeated generations
establish, invalidate, or change an App-specific prompting risk or mitigation
for people-focused images.

## Treat the Gemini App as the execution target

Google's
[Gemini Apps image-generation guidance](https://support.google.com/gemini/answer/14286560)
describes generating and editing images through the App with Nano Banana
models. The Gemini App product surface is enough to select this guidance even
when it does not expose the exact underlying image model. Record an App-visible
mode or model name when available, but do not require an API model identifier
or infer one that the surface does not reveal.

Do not select this document merely because a caller directly invokes a Gemini
image model through an API or another development surface. Those callers can
expose different model identities, controls, and execution evidence; they need
guidance whose reading trigger names that surface explicitly.

## Evaluate the fingernail and toenail risk conditionally

Apply the fingernail and toenail guidance below as an operational heuristic for
the Gemini App, not as a claim that every available model or every generation
omits nails.

Use the mitigation only when all of these conditions hold:

- the intended image will be generated through the Gemini App;
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

The App-specific observation decides when to include this sentence; the
sentence itself should describe only the intended visible image. Do not mention
Gemini, Nano Banana, product controls, or unavailable model details inside the
copyable prompt. This keeps the prompt semantically complete and usable by
another image model even though an App-specific risk caused the detail to be
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
another generation through the same Gemini App surface and App-visible mode
when one is shown. If the detail remains important and repeatedly fails,
improve its visual opportunity by increasing the figure or extremity scale,
reducing competing detail, choosing a clearer pose, or using the App's supported
image-editing flow. Do not promise that text alone can force the generator to
render a low-resolution or occluded detail.

## Sources

- [Google Gemini Apps Help: Generate and edit images](https://support.google.com/gemini/answer/14286560)
- [Google: Nano Banana image editing in the Gemini App](https://blog.google/products-and-platforms/products/gemini/updated-image-editing-model/)
