# Image-to-video prompt contract

Use this reference when a workflow prepares a model-independent prompt package
for generating one continuous video from an initial image and optional
additional image inputs.

## Establish the source-material contract

Require one accessible initial-frame image that the user intends to supply to
the video model before treating a final prompt package as complete. The workflow
may discuss an idea or describe requirements for a suitable frame while it is
missing, but it cannot inspect the starting state or finish the handoff without
the actual image.

Inspect every accessible image and video instead of asking the user to report
visible facts. When required evidence cannot be inspected, identify the missing
part and ask the user to reattach it or describe only the evidence needed for a
bounded diagnosis.

The initial frame is a required model input. For every other image the user
supplies or the workflow proposes, the user must explicitly decide its
destination and semantic role. Record:

- a stable label;
- whether it is a user-approved model input or analysis evidence;
- its role, such as final frame, identity, character design, wardrobe,
  composition, setting, color, line, rendering style, or material;
- what it should control;
- what must remain recognizable;
- what may change or adapt during the shot; and
- what visible content should not influence the result.

For the initial frame, also record the target orientation and aspect ratio; how
the source should be cropped, extended, or reframed to fit that canvas; which
people, objects, contacts, or safe areas must remain protected; and how the
adaptation affects movement space and the ending composition.

When those decisions are already clear, record them without asking again.
Otherwise inspect the material, recommend one concise contract, and ask the
user to accept or change it. Present the complete mapping for confirmation when
several images, overlapping roles, or attribute transfers could make ownership
ambiguous.

An analysis-only image must be translated into the relevant observable
properties and must not remain an undeclared dependency of the final prompt. A
model-input image remains authoritative for its declared role; use text to name
that role, protect important invariants, permit intended changes, and prevent
unrelated content from controlling the result rather than transcribing the
whole image.

Additional image roles are capability-dependent. A final frame, separate
identity reference, style image, or other declared role does not guarantee that
the caller's target model accepts it or can combine it with the initial frame.
When an unsupported role controls a hard requirement, ask the user to choose
among a supported target, translating the relevant properties into text,
preparing a new initial image that carries them, relaxing exactness, or
accepting the residual uncertainty.

A failed generated video, acting reference, motion reference, or camera
reference is analysis evidence only in this contract. Inspect it when available
and translate the relevant timing, trajectory, pose sequence, performance,
composition, or camera behavior into text. Do not declare a video as a model
input or make the final prompt depend on the target system receiving it.

When a generated result is supplied for critique, permission to analyze it
follows from that request. A still frame extracted or recreated from that video
does not become the next initial image automatically; it needs to be supplied
or approved as an image with its own input role.

Treat visual material found during research as analysis only by default. The
workflow may inspect it, identify its source when it materially informs the
user-facing result, and translate its relevant properties without asking the
user to approve that research use. Do not package an Agent-found image as a
model input unless the user explicitly approves that destination and its full
contract.

## Render the prompt package

Include only components that carry information for the current task:

1. **Professional diagnosis:** include when the owning workflow evaluates an
   existing prompt, generated video, or paired attempt. State the smallest
   supported high-impact causal set, visible time-localized evidence, required
   versus optional improvements, diagnosis confidence, and evidence boundary.
2. **Final shot brief:** include when the workflow made nontrivial decisions or
   the user should verify the handoff. Summarize the canvas, duration, intended
   use, controlling development, performance and blocking, temporal structure,
   camera, medium treatment, motion density, optional audio, and end state
   without repeating the complete prompt.
3. **Material plan and image handling:** always identify the initial frame and
   include every other useful or required material. State what each item solves,
   which evidence it must contain, whether it is available, and whether it is
   analysis only or a user-approved image input. For the initial frame, record
   the target orientation and aspect ratio, crop, extension, or reframing plan,
   protected content, and the adaptation's effect on movement space and the
   ending composition. List model-input images by stable label, role, and upload
   order only when the caller established an order.
4. **Research findings:** include only externally verified facts or visual
   conclusions that materially changed the design or diagnosis, with enough
   provenance for the user to judge or act on them. Keep creative judgment and
   the research process out of this section.
5. **Generation risks:** include only material model-independent risks that
   remain after mitigation, together with the requirement at risk and the
   selected or recommended response. Do not emit a generic defect list.
6. **Final prompt:** always include one canonical, complete prompt for a
   completed new design. In an improvement workflow, include it only when a
   supported shot-semantic or prompt-specification change warrants a
   replacement. Add complete alternatives only when the user requests variants
   or keeps a materially different direction open.
7. **Usage note:** identify every model-input image and remind the caller to set
   the confirmed duration, aspect ratio, and audio mode through provider
   controls when those controls exist. State any capability-dependent image role
   that the caller still needs to verify.

The final shot brief, material plan, final prompt, and usage note are required
for a completed new design or replacement. Diagnosis, research findings, and
generation risks appear only when their conditions apply. An improvement
workflow that finds no supported prompt change may finish with the diagnosis,
retained shot and material contract, and appropriate execution response rather
than rendering an unchanged prompt as a new result.

This contract defines package components and material declarations, not prompt
serialization or provider fields. Leave actual generation, provider acceptance,
model selection, and mapping semantic roles onto supported controls to the
caller.
