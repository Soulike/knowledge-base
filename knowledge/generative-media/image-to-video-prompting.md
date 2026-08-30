# Natural-language prompting for image-to-video generation

## Scope

This document explains how to specify and evaluate a generated video that
develops from a supplied image, independently of a particular model or
provider. It owns the distinction among shot design, prompt expression,
invocation controls, and model execution; the relationship between image
conditions and temporal text; model-independent generation risks; and
evidence-bounded diagnosis of unsatisfactory results.

## When to update

Update this document when image-to-video capabilities, evaluation evidence, or
cross-model prompting practice changes the durable relationship among image
conditions, natural-language motion specification, external generation
controls, temporal quality, and failure diagnosis.

## Separate the shot, its specification, and its execution

Evaluate four different objects before deciding that a prompt is good or bad:

1. **Shot design:** Is the intended performance, motion, staging, camera,
   timing, continuity, and end state coherent?
2. **Prompt specification:** Does the text express every material temporal
   decision without ambiguity or contradiction?
3. **Invocation contract:** Will the model receive the intended images in
   supported roles, together with matching duration, aspect ratio, audio mode,
   and other necessary external controls?
4. **Model execution:** Did the selected generator honor those conditions
   within its capabilities and stochastic variation?

A coherent prompt can be executed poorly. A generator can also follow an
incoherent shot faithfully, or receive the wrong inputs despite correct prose.
One failed result establishes an observation, not its cause.

An existing attempt may provide a prompt, generated video, or both. A prompt
without a result supports prospective review but not observed execution
findings. A video without its prompt supports professional critique and design
of the next shot but not a claim about the original wording. Pair multiple
prompts, input contracts, results, controls, and feedback by iteration before
using a change between attempts as causal evidence.

## Understand image conditions before prompting

An image-to-video system may distinguish an initial frame, final frame,
identity or asset reference, style reference, and other image roles. Support
and combinations vary, so file type alone does not establish what an image
means or whether a target model can receive it.

Prompt design therefore depends on an explicit source-material plan that
distinguishes analysis evidence from actual model inputs and states what each
declared image contributes. The plan must also account for capability
differences: an intended final frame, identity reference, or style image does
not establish that a selected model can accept that role or combine it with the
initial image.

The required initial image is authoritative for the visible state at the start
of the video, subject to an explicitly chosen crop or reframing. It does not
imply that every visible property must remain frozen. Describe a transformation
when a person, object, environment, light, weather condition, or visual state
should change over time.

Use the image rather than routinely transcribing it. Restate a visible property
when it participates in motion or interaction, distinguishes one actor from
another, conflicts with the requested development, or must remain stable
through a high-risk change. A blanket prohibition on visual description can
omit essential binding and continuity; a full recap wastes attention and can
introduce contradictions.

Reference-video support is neither universal nor one coherent capability. A
portable image-to-video prompt cannot depend on the target model receiving a
failed video, performance reference, or camera reference. Relevant timing,
trajectory, performance, composition, and camera behavior must remain
expressible in text even when a specialized provider workflow can consume the
video directly.

## Write a temporal visible contract

Describe one observable progression from the supplied initial state to a clear
end state. Include the dimensions that materially control this video:

- the target duration, orientation, aspect ratio, and intended continuous-shot
  relationship to the initial image;
- the controlling action, change, or emotional development;
- every important actor and affected person or object;
- direction, trajectory, speed, magnitude, acceleration, pause, and
  follow-through when changing them would alter the result;
- temporal order and synchronization among primary and supporting motion;
- performance, expression, gaze, contact, environmental response, and other
  moving layers that carry the intended shot;
- camera behavior and its evolving relationship to the subject;
- continuity requirements and intentional transformations;
- the observable state of the subject, camera, environment, and applicable
  sound at the end; and
- dialogue, effects, ambience, or music only when generated audio belongs to
  the intended artifact.

This is an attention set rather than a fixed schema. Omit properties that do
not change the result, combine related information, and introduce other
temporal dimensions when the requested shot needs them.

Translate abstract intentions into visible development. "She becomes
confident" may require a changing posture, steadier gaze, controlled breath,
deliberate pace, and a completed pose. Retain an abstract mood or theme only
after the performance, motion, camera, light, and environment that carry it are
defined.

## Use duration and canvas as real constraints

Duration is an action budget as well as an external generation control. Fit one
controlling event and only the supporting changes that can remain legible in
the available time. Do not conceal overload by compressing every event into
abrupt motion, omitting an ending, or asking the model to perform several
unrelated actions simultaneously.

For a simple action, describe its development and end state without inventing
time segments. For several ordered actions, use natural phases such as "at the
start," "then," and "by the end." Add approximate seconds only when tighter
allocation materially clarifies the result. Describe simultaneous supporting
motion with the event it supports rather than turning every layer into a
separate step.

State the intended orientation and aspect ratio in visible terms even when the
caller must also configure them through a provider control. The initial image's
shape does not universally determine the output canvas. Resolve how a crop,
extension, or reframing affects the people, action path, look room, protected
areas, and ending composition.

Resolution, frame rate, shutter character, slow motion, time lapse, and similar
technical properties belong in the semantic contract only when they change the
visible motion or a real delivery requirement. Provider-specific value ranges
and field names belong to the invocation layer.

## Bind motion and interaction explicitly

Give each important person or object a stable, visible label. Attach actions,
expressions, gaze, props, trajectories, transformations, and ending states to
the correct label. Name the actor, receiver, shared object, direction, contact
point, and temporal relationship when a loose pronoun or clause could bind them
incorrectly.

For multiple people, distinguish simultaneous from sequential action and keep
left-right, foreground-background, gaze, overlap, and contact relationships
compatible as they change. More prose cannot guarantee correct binding, but an
ambiguous contract makes a wrong assignment acceptable.

Describe camera and subject motion together. State a stable camera positively
when no movement is intended. For a moving camera, specify its direction,
energy or speed, framing relationship, and stopping state when they matter.
Check that the camera path, subject path, visible space, duration, and desired
ending can coexist; clear wording cannot rescue an impossible geometry.

## Protect continuity selectively

Protect the invariants that matter during the planned change, such as character
identity, anatomy, wardrobe, held objects, line and color treatment, environment
geometry, light direction, or physical contact. Express the desired stable
state directly rather than appending a generic defect or negative-prompt list.

Continuity is not the same as stillness. Hair, clothing, reflections, shadows,
particles, weather, background layers, and handheld motion may all change while
the intended identity and world remain coherent. Likewise, an intentional
transformation should be specified as a controlled transition rather than
blocked by an overbroad request to preserve everything.

Always define the end state when the shot includes an action, transition, camera
move, or loop. State whether the motion completes, settles, holds, exits the
frame, reaches a target composition, or returns near the initial state. Beginning
a requested change without reaching its intended result is a failed temporal
contract.

## Make generated audio conditional

Native synchronized audio is not a common capability across image-to-video
systems. Establish whether audio belongs to the intended artifact before
researching or specifying it, and condition the usage contract on target-model
support.

When audio is included, bind dialogue, action sounds, ambience, off-screen
sources, and music to the same temporal progression as the visuals. Exact
dialogue needs a speaker, verbatim wording, language, delivery, and feasible
timing. Visible causes and their sounds should agree, and speech density must
fit both the duration and intended mouth movement.

## Preflight generation feasibility

Inspect the settled shot for model-independent risks before handing it off.
Material risks include:

- several separately identified people or exact action assignments;
- intricate touch, occlusion, object transfer, or changing physical contact;
- large pose, viewpoint, wardrobe, identity, or environment transformations;
- fast or high-magnitude motion that leaves little temporal evidence between
  states;
- competing camera and subject movement;
- strict paths, counts, spatial relationships, text, or final composition;
- several image inputs that attempt to control overlapping properties; and
- dense visual and audio events within a short duration.

Mitigate a risk by simplifying the action budget, strengthening local bindings,
reducing competing material roles, choosing a more suitable initial image,
relaxing unnecessary exactness, or prioritizing one interaction or transition.
When mitigation changes creative intent or a hard constraint, expose the
trade-off rather than weakening it silently.

This preflight does not predict a particular model. Disclose residual risk when
a coherent contract still depends on behavior that prose and declared images
cannot ensure.

## Diagnose the observed video before rewriting

Inspect the complete accessible video and localize important evidence in time.
Evaluate:

1. **Initial-condition fidelity:** whether the video begins from the intended
   people, pose, composition, setting, and style after any approved reframing.
2. **Intent and prompt alignment:** whether the requested action, performance,
   camera, visual treatment, and applicable sound occur.
3. **Actor and interaction binding:** whether each action, property, and contact
   belongs to the correct person or object.
4. **Order and transition completion:** whether events occur in the intended
   relationship and reach the required end state.
5. **Subject and environment continuity:** whether identity, anatomy, clothing,
   objects, geometry, light, and other intended invariants remain coherent.
6. **Temporal quality:** whether trajectories, local details, and motion remain
   smooth and free of unintended flicker, jumps, or deformation.
7. **Dynamic fit:** whether the amount of meaningful motion matches the shot,
   without treating intentional stillness as a defect or static output as
   success for a dynamic request.
8. **Frame-wise quality:** whether individual frames retain the required visual
   clarity and medium treatment.
9. **Audio and synchronization:** whether selected sound is intelligible,
   correctly assigned, and timed with visible events.

Classify the smallest supported cause:

- **Intent gap:** the intended result or priority was never established.
- **Shot-design gap:** the performance, action budget, staging, timing, camera,
  or end state is weak or internally incompatible.
- **Research gap:** a factual, cultural, physical, performance, photographic,
  animation, or reference decision was guessed or left unresolved.
- **Source-material gap:** the initial image or another declared input conflicts
  with the intended motion, crop, identity, interaction, or continuity.
- **Specification gap:** the prompt omits, contradicts, misbinds, or obscures a
  material temporal decision.
- **Invocation gap:** model inputs or external controls do not match the
  intended semantic contract.
- **Execution gap:** the design, inputs, prompt, and invocation are coherent,
  but the generator still fails a requested behavior or quality threshold.

State diagnosis confidence and distinguish required corrections from optional
refinements. Rewrite the complete prompt when its semantic contract changes;
do not return a conversational patch or mechanically append prohibitions. When
the available evidence points only to model variance or capability limits,
report that boundary and recommend an execution response instead of inventing
a textual defect.
