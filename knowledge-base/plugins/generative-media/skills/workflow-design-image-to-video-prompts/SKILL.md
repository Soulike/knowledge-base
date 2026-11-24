---
name: workflow-design-image-to-video-prompts
description: Design a new image-to-video prompt for a people-focused continuous shot. Use when the user wants to generate a video from an image and no existing prompt or generated video is being evaluated.
---

# Design image-to-video prompts

Produce a prompt package that another video model can use with one required
initial image and any supported additional image inputs to generate one new,
continuous, people-focused shot. Finish with the prompt package; leave video
generation, model selection, provider parameters, provider acceptance, and
creation or repair of the initial image to the caller. Own the professional
shot-development work of a director, cinematographer, or animation director
rather than formatting the user's first motion description.

## Validate the generation request

Confirm that the requested artifact is a newly generated, people-focused
continuous shot starting from an image supplied to the video model (optional
images may control final frame, identity, design, wardrobe, composition,
setting, style, or material; user videos are analysis evidence only). Treat
photographic, anime, painterly, comic, 3D, and other visual media as open
possibilities.

Stop without producing a prompt package and explain that the request falls
outside this workflow when the user asks to review, diagnose, or improve an
existing attempt, or produce text-only video, video-to-video transformation,
edits or repairs to the initial image, or a multi-shot sequence (continuous
changes after the initial frame remain in scope). Inventory intent,
constraints, materials, and settled decisions already available without
repeating research or reconfirming settled choices.

## Establish source materials

Read
[Establish the source-material contract](../../references/generative-media/image-to-video-prompt-contract.md#establish-the-source-material-contract)
for every supplied or proposed image and video. Inspect visible facts yourself
without inferring optional control roles or model delivery. One accessible,
user-approved initial-frame image is required before finishing the final prompt
package; while missing, clarify intent and frame criteria, but stop before
final shot design and prompt construction.

## Research the shot

Read [People-focused continuous-shot
design](../../knowledge/generative-media/people-focused-continuous-shot-design.md)
and [Natural-language prompting for image-to-video
generation](../../knowledge/generative-media/image-to-video-prompting.md) in
full before research and dependent decisions. When the production medium is
known, read every matching medium-specific document before dependent work:

- live-action or photorealistic shot: [People-focused photographic video
  design](../../knowledge/generative-media/people-focused-photographic-video-design.md);
- anime- or manga-influenced shot: [People-focused anime animation
  design](../../knowledge/generative-media/people-focused-anime-animation-design.md).

Re-evaluate these conditions when the production method, medium, source
material, artifact, or task stage changes, reusing current available readings.
Treat packaged Knowledge as supplemental to instructions, Skills, requirements,
and project context in the active working directory.

Separate investigable facts from user-owned creative choices (recommend an
answer, fill low-impact gaps coherently, avoid questionnaires, and ask which
hard constraint controls when constraints conflict), and read
[Research and reference sourcing](../../references/generative-media/research-and-reference-sourcing.md)
for external research, candidate reference handling, and unavailable material.

## Settle the production contract

Establish target duration, orientation, and aspect ratio, plus intended use,
crop or extension tolerance, protected regions, viewing context, and looping
when relevant. Never inherit the initial image's ratio passively; recommend a
missing duration or canvas with a brief reason and ask to accept or change it
(or make and surface explicitly delegated choices).

Decide whether the shot is silent or includes synchronized generated audio.
When audio is selected, settle dialogue, sounds, ambience, or music feasible
within the duration; do not research or add audio for silent requests. Treat
resolution, frame rate, shutter character, slow motion, or time lapse as
creative requirements only when they alter visible motion or real delivery
needs, without substituting provider values.

## Develop the continuous shot

Read
[Develop temporal shot dimensions](references/shot-design-and-checklist.md#develop-temporal-shot-dimensions)
to expand the settled intent, production contract, source materials, and
matching Knowledge into one complete temporal design with deliberate motion
richness or restraint. Use duration as an action budget: when requested events
cannot remain legible, explain the conflict, recommend concrete alternatives,
and wait instead of silently accelerating, deleting, or combining primary
events (stop if the user chooses a multi-shot result).

## Critique and preflight the handoff

Critique the complete proposal using matching shot and medium Knowledge and
revise every identified issue before presenting it or writing the prompt. Apply
image-to-video prompting Knowledge to preflight model-independent generation
risks without silently changing hard constraints (ask if mitigation alters
intent or image roles; otherwise disclose material residual risks).

**Pre-construction gate:** Do not begin prompt construction until the
source-material contract, duration, canvas, audio mode, complete shot design,
critique, preflight, required materials (or accepted alternatives), and
high-impact user choices are settled. Proceed without repeating settled
decisions; make and surface explicitly delegated choices; otherwise present one
combined proposal (shot brief, material plan, and material risk or trade-off)
for confirmation and wait. Do not bypass this gate by labeling the shot simple.

## Construct and deliver the prompt

Read
[Render the prompt package](../../references/generative-media/image-to-video-prompt-contract.md#render-the-prompt-package),
the
[natural-language prompt format](../../references/generative-media/natural-language-prompt-format.md),
and the
[Pre-delivery verification checklist](references/shot-design-and-checklist.md#pre-delivery-verification-checklist),
then apply matching image-to-video prompting Knowledge to express the package.

**Completion criteria:** Finish only when the checklist is verified: one
accessible initial-frame input and all optional model-input roles are declared;
analysis-only images/videos are translated to text without undeclared prompt
dependencies; confirmed duration, orientation, aspect ratio, canvas adaptation,
protected regions, and movement-space impact are recorded; one continuous shot
and controlling development fit the duration to a clear end state with explicit
camera, motion layers, continuity, medium treatment, and optional capability-dependent
audio; critique, preflight, and research gaps are resolved or disclosed; the
copyable prompt is self-contained, model-independent continuous prose in the
user's language without positive/negative splits, timelines, shot lists,
screenplays, keyword strings, or provider syntax; and the response includes
every applicable package component with no empty sections and without invoking a
video-generation tool.
