# Still-image prompt contract

Use this reference when a workflow prepares a model-independent prompt package
for generating a new still image from text and optional image inputs.

## Establish every image's contract

Inspect each user-supplied image instead of asking the user to report visible
facts. When such an image cannot be inspected, identify the missing evidence
and ask the user to reattach it or describe only the relevant part.

The user must explicitly decide the semantic role and destination of every
image they supply or that is proposed as a model input. Do not infer either
from vague wording such as "use this image," "refer to this," or "combine
these." Record:

- a stable semantic label;
- whether the image will be supplied to the image model or is available only
  for analysis;
- what it should control, such as identity, character design, wardrobe, pose,
  interaction, composition, setting, color, line, rendering style, or material;
- what must remain recognizable;
- what may adapt to the new frame; and
- what visible content should be ignored.

When the user already stated these decisions clearly, record them without
asking again. Otherwise inspect the image, recommend one concise contract, and
ask the user to accept or change it. For several images, one image with several
roles, or mappings that can transfer attributes between people, present the
complete mapping for confirmation before prompt construction.

An analysis-only image must be translated into the relevant visible properties
and must not appear as an external dependency in the final prompt. A model-input
image remains authoritative for its declared role; do not needlessly transcribe
everything visible in it. Use text to identify its role, protect important
invariants, permit intended adaptations, and prevent unrelated content from
controlling the result.

When exact character or person identity matters but the only identity image is
analysis only, explain that text can provide only an approximation. Ask the user
to choose among supplying the image to the model, relaxing the exact-identity
requirement, and accepting that approximation.

When the user supplies a generated result for critique, its role as analysis
evidence is established by that request. Inspect it without asking permission to
analyze it. Whether the same image will also be supplied to the next generation
is a separate decision; do not assign it a model-input role unless the user
explicitly chooses that destination and defines what it should control.

Treat visual references found by the Agent during research as analysis only by
default. The Agent may inspect them, cite their sources, and translate their
relevant properties without asking the user to approve that research use. Do
not declare or package one as a model input unless the user explicitly chooses
that destination; if proposed for model input, establish its complete contract
before prompt construction.

Every requested output is a newly generated whole image. A composition or pose
reference may strongly constrain the new frame, but no image is an edit target
and no region, pixel set, or undeclared source state is preserved by this
contract.

## Render the prompt package

Include only the components that carry information for the current task:

1. **Professional diagnosis:** include when the owning workflow evaluates an
   existing prompt, generated result, or paired attempt. State the high-impact
   visual findings, smallest supported causal set, required versus optional
   improvements, and diagnosis confidence without turning every aesthetic
   preference into a defect.
2. **Final visual brief:** include when the workflow made nontrivial visual
   decisions or the user should be able to verify the handoff. Summarize the
   canvas, controlling idea, creative direction, visible frame, and intended
   detail density without repeating the complete prompt.
3. **Material plan and image handling:** include when images are involved or the
   workflow identified useful or required visual material. State what each
   material solves, the visible evidence it must contain, whether it is already
   available, and whether it is analysis only or a user-approved model input.
   List model inputs by stable label, role, and upload order when the caller
   established that order. For missing optional material, give concrete search
   or preparation criteria rather than an empty placeholder.
4. **Research findings:** include only externally verified facts or visual
   conclusions that materially changed the design, with their sources. Keep
   creative judgment distinct from sourced fact.
5. **Generation risks:** include only material model-independent risks that
   remain after mitigation, together with the requirement at risk and the
   chosen or recommended response. Do not emit a generic warning list.
6. **Final prompt:** always include one canonical, complete prompt. Add complete
   alternatives only when the user requests variants or keeps a materially
   different visual direction open.

This contract defines the package components and image declarations, not the
prompt's prose serialization. Leave actual generation, provider acceptance,
and mapping the semantic image contracts onto a provider's supported input
controls to the caller.
