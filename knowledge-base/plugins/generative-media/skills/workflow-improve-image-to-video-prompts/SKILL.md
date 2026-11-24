---
name: workflow-improve-image-to-video-prompts
description: Improve an image-to-video generation attempt for a people-focused continuous shot. Use when the user wants to review, diagnose, or improve an existing image-to-video prompt, generated video, or both.
---

# Improve image-to-video prompts

Evaluate an existing people-focused image-to-video attempt from its prompt,
generated video, or paired iterations. Deliver a professional diagnosis and,
when evidence supports a shot-semantic or prompt-specification change, one
complete model-independent replacement prompt package for a new continuous-shot
generation. Leave video generation, source-image editing, model selection,
provider parameters, and provider acceptance to the caller. Diagnose the result
as a moving-image shot rather than manufacturing wording changes when evidence
points to model variance or capability limits.

## Establish the attempt and intended result

Require at least one existing image-to-video prompt or generated video; if
neither is available, identify the missing attempt and stop. Confirm that the
intended result is a people-focused continuous video generated from an image
(text-only video, video-to-video transformation, source-image editing, and
multi-shot sequences fall outside this workflow—explain and stop without a
replacement package; continuous transformations after the initial image remain in
scope). Treat photographic, anime, painterly, comic, 3D, and other visual media
as open possibilities.

Inventory every available prompt, generated video, declared model input,
provider control, user criticism, intended result, hard constraint, and settled
decision without repeating settled research or questions. Pair multiple
attempts in order with stable labels so diagnosis can distinguish recurring
failures, regressions, improvements, and stochastic outliers.

Inspect every accessible generated video end-to-end and localize material
evidence in time; if a required video cannot be inspected, ask to reattach it
or request only the relevant timestamped description or keyframes and state the
evidence limit. Establish enough intended result to judge the attempt; when
missing intent permits materially different improvements, recommend one
direction and ask to accept or change it (or make and surface explicitly
delegated decisions).

## Establish source materials

Read
[Establish the source-material contract](../../references/generative-media/image-to-video-prompt-contract.md#establish-the-source-material-contract).
A generated video supplied for critique is immediately usable as analysis
evidence and can never be a model input. Establish the complete contract for
every supplied or proposed image. One accessible, user-approved initial-frame
image is required before finishing a replacement prompt package; if missing,
complete only the supported diagnosis and give criteria for the next initial
frame. Treat performance, motion, or camera-reference videos as analysis only
and translate their relevant properties into text.

## Critique and diagnose the attempt

Read [People-focused continuous-shot
design](../../knowledge/generative-media/people-focused-continuous-shot-design.md)
and [Natural-language prompting for image-to-video
generation](../../knowledge/generative-media/image-to-video-prompting.md) in
full before critique and dependent decisions. When the production medium is
known, read every matching medium-specific document before dependent critique or
redesign:

- for a live-action or photorealistic shot, read [People-focused photographic
  video
  design](../../knowledge/generative-media/people-focused-photographic-video-design.md);
- for an anime- or manga-influenced shot, read [People-focused anime animation
  design](../../knowledge/generative-media/people-focused-anime-animation-design.md).

Re-evaluate these reading conditions when the production method, visual medium,
source material, artifact, or task stage changes, reusing current available
readings. Treat packaged Knowledge as supplemental to instructions, Skills,
requirements, and project context in the active working directory.

Read
[Diagnose the moving-image shot](references/diagnosis-and-checklist.md#diagnose-the-moving-image-shot)
to critique each video temporally, evaluate the seven axes (intent fit, shot
design, medium quality, research, prompt specification, source/invocation
contract, and model execution), identify the smallest causal set with explicit
confidence and evidence limits, and separate observable temporal requirements
from provider-specific controls.

## Design the improved handoff

Protect confirmed user intent and effective shot decisions rather than original
wording. Read
[Research and reference sourcing](../../references/generative-media/research-and-reference-sourcing.md)
to resolve newly exposed gaps, then reconstruct the smallest coherent shot
design (never append conversational patches or defect lists to the old prompt).
Critique the improved shot with matching Knowledge and preflight
model-independent risks, asking before changing any hard constraint or creative
priority.

When the existing shot and prompt already express the intended result
coherently and evidence supports only model variance, unsupported inputs, or
capability limits, report that finding and recommend an evidence-matched
execution response instead of manufacturing a rewrite. Produce a replacement
only when an accessible initial image exists and the selected response changes
the shot's semantic contract or fixes a demonstrated specification gap.

**Pre-construction gate:** Before constructing a replacement, confirm one actual
initial image is available and every image role, duration, canvas, audio mode,
high-impact choice, required material, and residual risk is settled, delegated,
or accepted; otherwise present one combined shot and material proposal for
confirmation and wait.

## Construct and deliver the result

Read
[Render the prompt package](../../references/generative-media/image-to-video-prompt-contract.md#render-the-prompt-package),
the
[Pre-delivery verification checklist](references/diagnosis-and-checklist.md#pre-delivery-verification-checklist),
and (when a replacement is warranted) the
[natural-language prompt format](../../references/generative-media/natural-language-prompt-format.md),
then apply image-to-video prompting Knowledge to render only components
supported by the diagnosis and selected response.

**Completion criteria:** Finish only when the checklist is verified: every
finding is grounded in available evidence with accessible videos inspected in
full, findings localized in time, attempts paired, the seven diagnostic axes
separated, and confidence/limits explicit; source images have explicit roles and
analysis-only media are translated to text; a replacement is emitted only with
an accessible initial image and warranted semantic/specification change, with
confirmed duration, canvas, crop/movement-space plan, continuous progression,
clear end state, and mitigated/disclosed risks; any replacement prompt is
continuous prose in the user's language without positive/negative splits,
timelines, shot lists, screenplays, keyword strings, provider syntax, or
ceremonial changes; and every applicable package section is delivered without
empty sections or invoking a video-generation tool.
