---
name: improve-image-to-video-prompts
description: Improve an image-to-video generation attempt for a people-focused continuous shot. Use when the user wants to review, diagnose, or improve an existing image-to-video prompt, generated video, or both.
---

# Improve image-to-video prompts

Evaluate an existing people-focused image-to-video attempt from its prompt,
generated video, or paired iterations. Deliver a professional diagnosis and,
when the evidence supports a shot-semantic or prompt-specification change, one
complete model-independent replacement prompt package for a new continuous-shot
generation. Leave video generation, source-image editing, model selection,
provider parameters, and provider acceptance to the caller.

Own the professional review and redesign work that a director,
cinematographer, or animation director would perform after an unsatisfactory
attempt. Diagnose the result as a moving-image shot, not merely as text produced
from a prompt, and do not manufacture wording changes when the evidence points
to model variance or capability limits.

## Establish the attempt and intended result

Require at least one existing image-to-video prompt or generated video. When
neither is available, identify the missing attempt and stop because this
workflow has no artifact to evaluate.

Confirm that the intended result is a people-focused, continuous video
generated from an image. When the intended result is text-only video,
video-to-video transformation, source-image editing, or a multi-shot sequence,
explain that it falls outside this workflow and stop without producing a
replacement package. A continuous transformation occurring after the initial
image remains within scope. Treat photographic, anime, painterly, comic, 3D,
and other visual media as open possibilities rather than an exhaustive style
taxonomy.

Inventory every available prompt, generated video, declared model input,
provider control, user criticism, intended result, hard constraint, and settled
decision. Use available information regardless of how it was obtained, and do
not repeat settled research or questions.

When several attempts are available, give each iteration a stable label and
pair its initial image, optional image-input contract, prompt, relevant provider
controls, generated video, and feedback. Preserve their order so later
diagnosis can distinguish recurring failures, changes that improved or worsened
the result, stochastic outliers, and requirements lost during revision.

Inspect every accessible generated video from beginning to end instead of
asking the user to report visible facts. Localize material evidence in time and
observe its preceding and following state. When a required video cannot be
inspected, ask the user to reattach it; when direct access remains impossible,
request only the relevant timestamped description or keyframes and state the
resulting evidence limit.

Establish enough of the intended result to judge the attempt: what the shot
should make the viewer notice, understand, or feel; which decisions must remain;
which outcome matters most; and what the user considers unsuccessful. When the
missing intent permits materially different improvements, use the available
evidence to recommend one professional direction and ask the user to accept or
change it. When the user explicitly delegates the direction, make and surface
the decision.

## Establish source materials

Read
[Establish the source-material contract](../../references/generative-media/image-to-video-prompt-contract.md#establish-the-source-material-contract).
A generated video supplied for critique is immediately usable as analysis
evidence and can never be a model input under this contract.

Establish the complete contract for the initial image and every other supplied
or proposed image. The workflow may diagnose an attempt from a prompt or video
alone, but one accessible, user-approved initial-frame image is required before
it can finish a replacement prompt package. If that image is unavailable,
complete only the supported diagnosis and give concrete requirements for the
next initial frame.

Treat every performance, motion, or camera-reference video as analysis only.
Translate its relevant poses, timing, trajectories, contacts, composition, or
camera behavior into text; do not package it as a target-model input.

## Critique and diagnose the attempt

Read the [Knowledge index](../../knowledge/index.md), apply every `When to Read`
condition to the intended shot and available artifacts, and read only the
matching Knowledge documents. Treat them as supplemental guidance; follow
instructions, Skills, requirements, project-specific information, and
documentation standards from the Agent's active working directory when they
conflict.

Apply the matching professional shot and medium Knowledge to critique each
generated video as a complete temporal work. Distinguish explainable design or
medium problems from valid aesthetic directions that do not match the user's
preference. Report the smallest set of high-impact findings by default; expand
to a complete critique only when the user asks.

Compare the available evidence along these axes:

1. **Intent fit:** whether the attempt realizes the actual goal, priorities,
   hard constraints, and desired audience response.
2. **Shot-design quality:** whether the controlling development, performance,
   blocking, action budget, timing, temporal composition, camera, motion layers,
   sound, and end state form an effective continuous shot.
3. **Medium quality:** whether photographic mechanics, focus, light, materials,
   or anime poses, cadence, layers, line, and color behave coherently for the
   intended visual language.
4. **Research quality:** whether factual, cultural, physical, performance,
   photographic, animation, or visual-reference decisions are sufficiently
   grounded.
5. **Prompt-specification quality:** when a prompt is available, whether it
   expresses every material actor, action, order, transition, camera behavior,
   continuity requirement, and end state without ambiguity or conflict.
6. **Source and invocation contract:** whether the intended images were
   supplied in supported roles and the duration, aspect ratio, audio mode, and
   other material provider controls matched the semantic contract.
7. **Model execution:** when the relevant conditions are available, whether
   the result failed a requirement that the shot, prompt, images, and invocation
   already expressed coherently.

Inspect the generated result through time for initial-image fidelity,
actor-action and interaction binding, order and transition completion, subject
and background continuity, unintended flicker or deformation, motion
smoothness, intended dynamic degree, frame-wise visual quality, and applicable
audio synchronization. Preserve intentional stillness, stepped animation,
roughness, deformation, or camera imperfection when it serves the confirmed
direction.

Identify the smallest causal set that explains the important mismatch, state
diagnosis confidence, and separate required corrections from optional
refinements. A prompt without a generated result cannot support observed
execution findings. A generated result without the prompt or invocation
contract cannot establish which wording or control caused it. Use paired
iterations to strengthen or weaken each causal hypothesis.

Do not treat verbosity, alternative wording, or provider syntax as a defect by
itself. Distinguish observable temporal requirements from model names, seeds,
presets, dedicated negative prompts, and other provider-specific controls; a
portable replacement prompt does not optimize or preserve those controls.

## Design the improved handoff

Protect confirmed user intent and every shot decision that remains effective,
not the wording or structure of the original prompt. Research any newly exposed
gap using the same distinction between investigable facts and user-owned
creative choices, then reconstruct the smallest complete shot design that
resolves the supported diagnosis.

When a semantic change is warranted, resolve the production contract,
performance, blocking, timing, camera, motion layers, medium treatment,
continuity, optional audio, and end state as a coherent whole. Do not append a
conversational patch such as "move more slowly" or a generic list of prohibited
defects to the old prompt.

Apply the matching professional Knowledge to critique the improved shot, then
apply the image-to-video prompting Knowledge to preflight model-independent
generation risks. Simplify overloaded action, strengthen local bindings,
clarify transformations, prepare a better initial frame, reduce competing
image roles, or relax unnecessary exactness when those responses preserve the
intended result. Ask the user before changing a hard constraint or creative
priority.

When the existing shot and prompt already express the intended result
coherently and the evidence supports only model variance, unsupported inputs,
or capability limits, report that finding instead of manufacturing a rewrite.
Recommend an evidence-matched execution response such as regenerating,
selecting a supported input configuration, improving the initial frame,
reducing motion or interaction complexity, or relaxing precision. Do not
produce a replacement prompt unless the selected response changes the shot's
semantic contract or corrects a demonstrated specification gap.

Before constructing a replacement, ensure that one actual initial image is
available; every image role, duration, canvas, audio mode, high-impact design
choice, required material, and residual risk is resolved, explicitly delegated,
or accepted. Present one combined improved shot and material proposal for
confirmation when the user has not already settled or delegated those choices.

## Construct and deliver the result

Read
[Render the prompt package](../../references/generative-media/image-to-video-prompt-contract.md#render-the-prompt-package)
and, when a replacement is warranted, the
[natural-language prompt format](../../references/generative-media/natural-language-prompt-format.md).
Apply the image-to-video prompting Knowledge to render only the components
supported by the diagnosis and selected response.

Before finishing, verify that:

- every reported problem is grounded in an available prompt, image, video,
  invocation fact, user requirement, or clearly labeled inference;
- every accessible generated video was inspected across its complete duration
  and material findings are localized in time;
- multiple attempts remain correctly paired and no successful requirement is
  lost during revision;
- the diagnosis distinguishes intent, professional shot design, medium,
  research, prompt specification, source or invocation contract, and model
  execution;
- required corrections, optional refinements, diagnosis confidence, and
  evidence limits are explicit;
- every source image has an explicit role and every analysis-only image or video
  has been translated into relevant text without becoming a model-input
  dependency;
- when a replacement package is produced, its material plan records the target
  canvas, initial-image crop, extension, or reframing, protected content, and
  the adaptation's effect on movement space and the ending composition;
- a replacement is produced only when an accessible initial image exists and a
  supported semantic or specification change warrants it;
- every replacement states the confirmed duration, orientation, and aspect
  ratio and describes one feasible continuous progression with a clear camera
  plan and end state;
- every replacement's performance, blocking, action binding, motion layers,
  medium treatment, continuity, and selected audio address the supported causes
  rather than every conceivable defect;
- model-independent generation risks for any replacement have been mitigated,
  accepted, or disclosed without promising execution;
- every replacement prompt follows the user's language and continuous-prose
  requirements and is not split into positive and negative prompts, a timeline,
  shot list, screenplay, keyword string, or provider syntax;
- no prompt change exists only to make the response appear more active; and
- the response includes every applicable professional diagnosis, shot brief,
  material plan, research finding, generation risk, final prompt, and usage note
  without empty sections or invoking a video-generation tool.
