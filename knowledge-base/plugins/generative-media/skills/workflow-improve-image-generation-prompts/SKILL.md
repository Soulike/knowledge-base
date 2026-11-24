---
name: workflow-improve-image-generation-prompts
description: Improve a people-focused still-image generation attempt. Use when the user wants to review, diagnose, or improve an existing image-generation prompt, an unsatisfactory generated image, or both.
---

# Improve image-generation prompts

Evaluate an existing people-focused still-image generation attempt from its
prompt, generated result, or paired iterations. Deliver a professional visual
diagnosis and one complete, model-independent replacement prompt package for a
new whole-image generation. Leave image generation, image editing, model
selection, provider parameters, provider acceptance, and provider-specific input
controls to the caller. Diagnose the image as an image rather than reducing the
task to wording changes.

## Establish the attempt and intended result

Require at least one existing prompt or generated result; if neither is
available, identify the missing attempt and stop. Confirm that the intended
result is a newly generated, people-focused still image rather than a video or
an edit targeting an existing image (modifying, replacing, or extending a
region, or keeping regions of that image unchanged); explain and stop without a
replacement package if it is outside scope, while keeping references that
constrain a new whole image in scope.

Inventory every available prompt, generated result, declared image input, user
criticism, intended result, hard constraint, and settled decision without
repeating settled research or questions. When several attempts exist, assign
each iteration a stable label and pair its prompt, input contract, result, and
feedback in order.

Inspect every accessible generated result yourself; if a required result cannot
be inspected, ask the user to reattach it or describe only the needed part. When
an image is available, read
[Establish every image's contract](../../references/generative-media/still-image-prompt-contract.md#establish-every-images-contract):
a generated result supplied for critique is immediately usable as analysis
evidence, while reusing it as a model input requires a separate user decision.

Establish enough of the intended result to judge the attempt. When missing
intent permits materially different improvements, recommend one professional
direction and ask the user to accept or change it (or make and surface
explicitly delegated decisions). Do not ask for preferences that cannot change
the diagnosis or next handoff.

## Establish the prompt execution target

Read
[Establish the prompt execution target](../../references/generative-media/prompt-execution-target.md)
before target-specific Knowledge. Use an established target as evidence for
applicable Knowledge and bounded execution diagnosis; do not choose or configure
an image model.

## Critique and diagnose the attempt

Read [People-focused still-image
design](../../knowledge/generative-media/people-focused-still-image-design.md)
and [Natural-language prompting for generated still
images](../../knowledge/generative-media/still-image-prompting.md) in full before
critique and dependent decisions. When the intended medium is known, read every
matching medium-specific document before dependent critique or redesign:

- for a photographic or photorealistic image, read [People-focused
  photographic-image
  design](../../knowledge/generative-media/people-focused-photographic-image-design.md);
- for an anime- or manga-influenced illustration, read [People-focused anime
  illustration
  design](../../knowledge/generative-media/people-focused-anime-illustration-design.md).

After establishing the execution target, read [Gemini App people-image
prompting](../../knowledge/generative-media/gemini-app-people-image-prompting.md)
only when the attempt was generated in the Gemini App or the replacement will be
used there (direct Gemini model or API use does not match; establish the path
when evidence says only "Gemini"). Re-evaluate these reading conditions when
the medium, execution target, artifact, or task stage changes, reusing current
available readings. Treat packaged Knowledge as supplemental to instructions,
requirements, Skills, and project context in the active working directory.

Read
[Diagnose along the six axes](references/diagnosis-and-checklist.md#diagnose-along-the-six-axes)
to critique any generated result as a complete image, evaluate the six axes
(intent fit, visual design, research, prompt specification, input contract, and
generator execution), identify the smallest causal set with explicit
confidence and evidence limits, and separate observable visual requirements
from provider-specific controls.

## Design the improved handoff

Protect confirmed user intent and effective visual decisions rather than the
original wording; rebuild any canvas, direction, visible frame, or material
plan whose design caused the failure. Read
[Research and reference sourcing](../../references/generative-media/research-and-reference-sourcing.md)
to resolve newly exposed factual or visual-reference gaps, source candidate
references, and handle unavailable material (wait on hard requirements; continue
on optional material).

When the correction changes the macro medium, visual language, atmosphere,
subject relationship, central composition, or another high-impact direction,
recommend one direction and ask the user to accept or change it; proceed without
extra confirmation when the settled direction holds or changes are delegated.

Critique the improved proposal using matching visual-design Knowledge and
revise every identified issue before presenting or delivering it. Preflight
model-independent generation risks using still-image prompting Knowledge without
silently changing hard constraints (ask if mitigation changes intent; otherwise
disclose material residual risk).

## Construct and deliver the replacement

Read
[Render the prompt package](../../references/generative-media/still-image-prompt-contract.md#render-the-prompt-package),
the
[natural-language prompt format](../../references/generative-media/natural-language-prompt-format.md),
and the
[Pre-delivery verification checklist](references/diagnosis-and-checklist.md#pre-delivery-verification-checklist),
then render one canonical, complete replacement prompt rather than a
conversational patch or appended keywords. When the available prompt already
expresses a coherent visual design, do not manufacture an improvement for
stochastic variation, reference-fidelity limits, or generator failure; apply an
honest mitigation only when it improves the handoff, or else return the
complete canonical prompt without ceremonial changes and state residual risk and
confidence outside it.

**Completion criteria:** Finish only when the checklist is verified: at least
one prompt or result was evaluated, attempts were paired, and intended result
and high-impact direction changes were settled or confirmed; the diagnosis
separates the six axes with explicit smallest causal set, confidence, required
vs optional fixes, and evidence bounds; retained/redesigned choices passed
visual critique and preflight; image contracts, user-decided destinations,
analysis-only translations, and execution-target rules were honored without
exceeding causal evidence; the final prompt is continuous prose in the user's
language without positive/negative splits, keyword strings, or ceremonial edits;
and every applicable package section is delivered without empty sections or
invoking an image-generation tool.
