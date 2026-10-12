---
name: design-image-to-video-prompts
description: Design a new image-to-video prompt for a people-focused continuous shot. Use when the user wants to generate a video from an image and no existing prompt or generated video is being evaluated.
---

# Design image-to-video prompts

Produce a prompt package that another video model can use with one required
initial image and any supported additional image inputs to generate one new,
continuous, people-focused shot. Finish with the prompt package; leave video
generation, model selection, provider parameters, provider acceptance, and
creation or repair of the initial image to the caller.

Own the professional shot-development work that a director, cinematographer, or
animation director would perform before production: research the need, design
performance and motion through time, make quality-oriented camera and medium
decisions, critique the resulting shot, and hand off the prompt and material
plan. Do not act as a formatter for the user's first motion description.

## Validate the generation request

Confirm that the requested artifact is a newly generated, people-focused video
that can remain one continuous shot and will begin from an image supplied to the
video model. It may use other images as final-frame, identity, design, wardrobe,
composition, setting, style, or material references. User-supplied videos may
inform analysis but are not model inputs in this workflow. Treat photographic,
anime, painterly, comic, 3D, and other visual media as open possibilities rather
than an exhaustive style taxonomy.

When the user asks to review, diagnose, or improve an existing prompt or
generated video, explain that evaluating an existing attempt falls outside this
workflow and stop without producing a prompt package for that request.

When the requested result is text-only video, video-to-video transformation,
editing or repairing the initial image, or a sequence containing several shots,
explain that it falls outside this workflow and stop without producing a prompt
package. A continuous change occurring after the initial frame, including a
transformation of a person, object, environment, light, or visual state, remains
within scope.

Inventory the user's intent, constraints, materials, and every settled decision
already available in the conversation or supplied artifacts. Use that
information regardless of how it was obtained. Do not repeat research or ask
the user to reconfirm a settled decision merely because another process
collected it.

## Establish source materials

Read
[Establish the source-material contract](../../references/generative-media/image-to-video-prompt-contract.md#establish-the-source-material-contract)
and complete it for every supplied or proposed image and video. Inspect visible
facts yourself, but do not infer what an optional image should control or
whether the target model will receive it.

One accessible, user-approved initial-frame image is required before the final
prompt package can be completed. While it is missing, the workflow may clarify
intent and give concrete criteria for preparing the frame, but it must stop
before final shot design and prompt construction.

## Research the shot

Read the [Knowledge index](../../knowledge/index.md), apply every `When to Read`
condition to the current task, and read only the matching Knowledge documents.
Treat them as supplemental guidance; follow instructions, Skills, requirements,
project-specific information, and documentation standards from the Agent's
active working directory when they conflict.

Use the matching Knowledge to identify what is already settled and what remains
to be researched. Separate two kinds of missing information:

- investigate facts and observable evidence that can be established from
  images, analysis-only videos, current sources, direct observation, or
  subject-matter authorities; and
- ask the user only for unresolved creative choices, priorities, permissions,
  or trade-offs that materially change the shot.

Give a recommended answer when asking the user to choose. Fill low-impact gaps
coherently when they do not conceal a meaningful creative fork. Do not turn the
Knowledge documents into a questionnaire, ask about every possible dimension,
or repeat information already present. When hard constraints conflict, explain
the visible consequence and ask which constraint controls.

Perform external research when the matching Knowledge identifies an unfamiliar
or accuracy-sensitive performance, interaction, physical process, movement,
place, period, culture, object, photographic treatment, animation language, or
production technique. Prefer direct evidence, primary records, professional and
scientific authorities, official technical material, and creator-owned visual
sources. Translate a named work, creator, genre, or style into the observable
properties relevant to this shot rather than using its name as a substitute for
direction.

Identify material that would resolve a hard requirement or materially improve
the design. When tools permit, search for and inspect candidate references;
otherwise provide concrete search, recording, or preparation criteria. Treat
Agent-found material as analysis only unless the user explicitly approves an
image as a model input. Do not automatically download or redistribute external
media.

When a hard requirement depends on unavailable material, present the supported
alternatives and wait for the user's resolution. Continue without nonessential
material when the shot can remain coherent, and state what the optional material
could improve. Route every newly supplied or approved image through the source-
material contract before using it.

## Settle the production contract

Always establish a concrete target duration, orientation, and aspect ratio.
Also settle intended use, crop or extension tolerance, protected regions,
viewing context, and looping when they affect the performance or composition.
Never inherit the initial image's ratio merely because it will be supplied to
the video model.

When duration or canvas is missing, recommend one with a brief action- or
composition-based reason and ask the user to accept or change it. When the user
explicitly delegates a decision, make it and surface it in the final shot
brief.

Establish whether the intended artifact is silent video or includes
synchronized generated audio. When audio is selected, settle the dialogue,
action sounds, ambience, off-screen sources, or music that materially affect
the shot and keep them feasible within its duration. Do not research or add
audio for a silent-video request.

Treat resolution, frame rate, shutter character, slow motion, time lapse, or
other technical properties as creative requirements only when they change the
visible movement or real delivery need. Do not substitute a provider's current
supported values for the user's intended result.

## Develop the continuous shot

Use the settled intent, production contract, source materials, and matching
Knowledge to expand a simple idea into one complete temporal design. Resolve:

- the controlling visible or emotional development;
- the initial state and intended end state;
- each person's performance, gaze, expression, action, reaction, and recovery;
- blocking, paths, contacts, prop ownership, and multi-person relationships;
- the timing, order, speed, magnitude, pauses, impacts, holds, and settling of
  primary and supporting motion;
- the evolving composition, visibility, foreground-middle-ground-background
  structure, and attention hierarchy;
- a fixed or moving camera plan compatible with the visible space and subject
  paths;
- causal motion in hair, clothing, props, materials, weather, particles, light,
  reflections, and background layers;
- photographic or animation-specific movement and continuity treatment; and
- the source, timing, delivery, and synchronization of sound when selected.

Choose motion richness deliberately. Add performance nuance, environmental
response, layered movement, light change, effects, and camera development when
they reinforce the controlling idea; remove them when stillness, restraint,
isolation, or graphic simplicity is the intended character. A quiet shot and a
dense kinetic shot are both valid only when their motion density is designed
rather than omitted or maximized by default.

Use duration as an action budget. When the requested events cannot remain
legible, explain the conflict and recommend concrete alternatives such as
extending the duration, simplifying the controlling action, removing or
subordinating other events, or selecting a different single shot. Wait for the
user's choice instead of silently accelerating, deleting, or combining primary
events. When the user chooses a multi-shot result, stop until one continuous
shot is selected for this workflow.

## Critique and preflight the handoff

Apply the matching professional shot and medium Knowledge to critique the
complete proposal before presenting it or writing the prompt. Revise every
issue the Knowledge identifies, and present the corrected proposal rather than
the first draft or internal critique.

Apply the image-to-video prompting Knowledge to preflight model-independent
generation risks. Mitigate risks without changing hard constraints silently.
When mitigation changes creative intent, an image's role, or another user-owned
decision, ask which requirement controls; otherwise disclose only residual
risks that materially affect the handoff.

Do not begin prompt construction until the source-material contract, duration,
canvas, audio mode, complete shot design, professional critique, and generation
preflight are complete; every required material is available or the user has
accepted an alternative; and every unresolved high-impact user-owned choice has
been settled.

When the conversation already contains those decisions, proceed without
repeating them. When the user explicitly delegated them, make and surface the
decisions. Otherwise present one combined proposal containing the applicable
shot brief, material plan, and material risk or trade-off for confirmation, then
wait before constructing the prompt. Do not bypass this gate by labeling the
shot simple.

## Construct and deliver the prompt

After the shot is coherent, read
[Render the prompt package](../../references/generative-media/image-to-video-prompt-contract.md#render-the-prompt-package)
and the
[natural-language prompt format](../../references/generative-media/natural-language-prompt-format.md),
then apply the matching image-to-video prompting Knowledge to express the
result.

Before finishing, verify that:

- the response identifies one accessible initial-frame image as a required
  model input and declares every optional model-input image by stable role;
- every analysis-only image or video has been translated into relevant text and
  is absent as an undeclared dependency from the final prompt;
- the confirmed duration, orientation, and aspect ratio appear in the shot
  brief and final prompt, with compatible crop, movement space, and ending
  composition;
- the material plan records how the initial image fits the target canvas, which
  content remains protected, and how that adaptation affects the action and end
  state;
- the prompt describes one controlling development and one continuous shot;
- every important action, transformation, interaction, and sound has an
  unambiguous owner and temporal relationship;
- the primary action and supporting motion fit the duration and reach a clear
  end state;
- camera behavior is explicit and compatible with subject motion, visible
  space, composition, and continuity;
- photographic or animation-specific performance, movement, layers, light, and
  material treatment carry the intended visual language;
- continuity protects the necessary identities, designs, objects, setting,
  relationships, and medium without freezing intentional change;
- generated audio appears only when selected and remains synchronized and
  capability-dependent;
- model-independent generation risks have been mitigated, accepted, or
  disclosed without promising execution;
- every material factual or visual research gap is resolved or disclosed;
- the copyable prompt follows the user's language and continuous-prose
  requirements and does not split into positive and negative prompts, a
  timeline, shot list, screenplay, or keyword string;
- the prompt is coherent, self-contained with only its declared image inputs,
  model-independent, and free of provider-specific syntax or parameters; and
- the response includes every applicable shot brief, material plan, research
  finding, generation risk, final prompt, and usage note without empty sections
  or invoking a video-generation tool.
