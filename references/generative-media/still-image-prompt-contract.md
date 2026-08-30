# Still-image prompt contract

Use this reference when a workflow prepares a model-independent prompt package
for generating a new still image from text and optional image inputs.

## Establish every image's contract

Inspect each accessible image instead of asking the user to report visible
facts. When an image cannot be inspected, identify the missing evidence and ask
the user to reattach it or describe only the relevant part.

The user must explicitly decide every image's semantic role and destination.
Do not infer either from vague wording such as "use this image," "refer to
this," or "combine these." Record:

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
to choose between supplying the image to the model and accepting that
approximation.

Every requested output is a newly generated whole image. A composition or pose
reference may strongly constrain the new frame, but no image is an edit target
and no region, pixel set, or undeclared source state is preserved by this
contract.

## Render the prompt package

Include only the components that carry information for the current task:

1. **Requirement summary:** include for a complex result, material assumptions,
   or decisions the user should be able to verify.
2. **Research findings:** include only externally verified facts or visual
   conclusions that materially changed the design, with their sources. Keep
   creative judgment distinct from sourced fact.
3. **Image handling:** include when images are involved. List model inputs by
   stable label, role, and upload order when the caller established that order.
   Separately identify analysis-only evidence and the properties translated
   from it.
4. **Diagnosis:** include only when the owning workflow evaluates an existing
   prompt. State the material cause and confidence without turning every
   wording preference into a defect.
5. **Final prompt:** always include one canonical, complete prompt. Add complete
   alternatives only when the user requests variants or keeps a materially
   different visual direction open.

This contract defines the package components and image declarations, not the
prompt's prose serialization. Leave actual generation, provider acceptance,
and mapping the semantic image contracts onto a provider's supported input
controls to the caller.
