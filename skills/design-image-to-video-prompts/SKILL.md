---
name: design-image-to-video-prompts
description: Use when the user wants to design a detailed, model-independent natural-language prompt for a people-focused continuous video generated from one required first-frame image, either from a new motion idea or by replacing an earlier prompt after describing how its generated result failed, with optional integrated audio.
---

# Design image-to-video prompts

Produce a prompt package that another video model can use with one supplied
first-frame image to generate one continuous, people-focused shot. Finish with
the prompt package; leave video generation, model selection, provider
parameters, provider acceptance, and first-frame repair to the caller.

## Validate the request and first frame

1. Require exactly one first-frame image that the user will supply to the video
   model with the final prompt. This Skill does not own text-only video
   generation, multiple model-input images, shot lists, edits to the first
   frame, or multi-shot sequences.
2. Inspect the accessible first frame instead of asking the user to report
   visible facts. When it cannot be inspected, ask the user to reattach it and
   stop prompt design until it is available.
3. Confirm that one or more people are the video's visual focus and that the
   requested result can remain one continuous shot. Treat photorealistic,
   anime, painterly, 3D, and other visual media as open possibilities rather
   than an exhaustive style taxonomy.

## Establish the generation contract

1. Record whether the request is a new prompt or a revision of an earlier
   attempt. For a revision, require the earlier prompt and the user's textual
   description of the failure; the failed video itself is not an available
   input. Read [Prompt-revision diagnosis](references/prompt-revision.md) before
   planning the replacement prompt.
2. Require a target duration. Use an already supplied duration; otherwise ask
   the user how many seconds the video should last. Do not substitute a current
   provider's supported duration range for the user's decision.
3. Ask whether the target model should generate video only or generate video
   and audio together when the request does not already say. For integrated
   audio, read
   [Integrated-audio requirements](references/integrated-audio.md). Skip audio
   research entirely for a video-only request.

## Research the motion plan

Read [Motion requirements](references/motion-requirements.md) after the first
frame, duration, and audio mode are known. Apply its decision lenses as an open
attention set rather than a questionnaire or exhaustive motion taxonomy.

Build a decision frontier from the request and visible first-frame evidence. In
each round, ask every currently answerable question whose unresolved answer
would materially change the motion, timing, camera, continuity, end state, or
integrated audio. Give a recommended answer for each question. Do not repeat a
settled question, ask the user for visible facts you can inspect, or turn the
reference's examples into required fields.

Evaluate whether the requested actions fit the confirmed duration. When they do
not, explain the conflict and recommend concrete choices such as extending the
duration, simplifying or prioritizing actions, converting an event into
supporting motion, or moving separate events into separate clips. Wait for the
user's choice instead of silently accelerating, deleting, or combining primary
events.

Recommend a camera behavior from the first-frame composition, subject motion,
duration, continuity risk, and desired effect. Ask the user to accept it or
choose another plan. When the user already selected a camera behavior, verify
its compatibility instead of asking again. When the user explicitly delegates
the choice, make the quality-oriented decision and surface it in the
requirement summary.

Fill low-impact gaps coherently. Surface material assumptions, and ask when
hard constraints conflict. After camera behavior is settled as required above,
proceed with a simple, low-ambiguity motion plan without a separate whole-plan
confirmation turn. Before composing a materially complex plan, present the
current understanding and wait for confirmation unless the user delegated the
remaining choices.

## Construct and deliver the prompt

Read
[Natural-language prompt format](../../references/generative-media/natural-language-prompt-format.md)
and [Prompt construction](references/prompt-construction.md) after the motion,
camera, continuity, end state, and applicable audio requirements are settled.
Apply the shared format while using the local reference to express temporal
structure and render the video prompt package.

Before finishing, verify that:

- the response identifies the one first-frame image as a required model input;
- the confirmed duration appears in both the requirement summary and the final
  prompt;
- the primary action and any supporting motion fit that duration;
- every important action has an unambiguous actor, direction, speed, magnitude,
  temporal relationship, and end state when those properties matter;
- camera behavior was accepted, supplied by the user, or explicitly delegated;
- the prompt begins from the visible first-frame state without redundantly
  redescribing it;
- continuity requirements protect only the identity, design, setting, style,
  or physical relationships that materially need protection;
- the prompt describes one continuous shot without cuts, time jumps, or hidden
  additional scenes;
- continuity and exclusion needs are expressed as positive target states
  without a dedicated negative-prompt field or list;
- integrated audio appears only when selected and has a coherent relationship
  to the visual timing;
- the copyable prompt follows the
  [shared natural-language prompt format](../../references/generative-media/natural-language-prompt-format.md);
- the prompt is self-contained, model-independent, and free of provider-specific
  syntax or parameters; and
- the response contains the prompt package without invoking a video-generation
  tool.
