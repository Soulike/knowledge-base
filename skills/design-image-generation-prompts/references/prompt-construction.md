# Prompt construction

Turn the settled requirements into a visual contract written in natural
language. The prompt should control the image through visible subjects,
relationships, composition, rendering, and constraints rather than through
model names, provider parameters, keyword piles, or an assumed conversation
history.

## Compose the visible frame

Lead with the requested artifact and the frame's controlling visual idea, then
move through the information that matters for this image. A useful order may
include the subject, character inputs, appearance, action, interaction, setting,
medium, composition, camera, lighting, color, texture, invariants, and specific
exclusions. This order is scaffolding, not a required set of fields: combine,
reorder, extend, or omit parts whenever the resulting prompt is clearer.

Prefer concrete sentences that say what is visible and how visual elements
relate. Translate abstract mood into observable choices such as posture,
expression, spacing, color temperature, contrast, weather, light direction,
surface treatment, or environmental detail. Retain an abstract term when it
adds useful emphasis, but do not let it substitute for the visible decisions
that carry the effect.

Describe one frozen instant. Express movement through pose and visible physical
consequences rather than a before-and-after sequence, story progression, or
moving camera. A prompt can depict a runner in mid-stride; it cannot ask a still
image to show the runner beginning, accelerating, turning a corner, and then
stopping.

## Represent image inputs truthfully

List every model-input image outside the prompt with a stable semantic label,
its role, and its upload order when order matters. In the prompt, identify what
the image controls and what may change. For example, a supplied character sheet
may control identity, face, hair, proportions, and signature accessories while
allowing pose, expression, clothing response, and lighting to adapt to the new
frame. Select only the invariants and adaptations relevant to the request.

Do not mention an analysis-only image in the final prompt. Replace it with the
visual description derived from the requested aspect. If a mixed request uses
an analysis-only pose reference and a model-input character image, describe the
adapted pose directly and separately tell the image model how the supplied
character should remain recognizable.

Avoid fully transcribing a model-input character image when the image itself is
the authoritative appearance source. Use text to establish its role, protect
important invariants, resolve ambiguity, and describe intentional changes.

## Keep people and interactions unambiguous

Give each person a stable description or label before assigning actions. Name
the actor, object, direction, depth, and contact point whenever pronouns could
attach an action to the wrong person. Use spatial relationships that can coexist
in one frame. Add targeted separation or preservation constraints when crowded
poses create a realistic risk of merged limbs, exchanged clothing, or misplaced
props; do not append generic defect lists unrelated to the composition.

## Use the selected medium's visual language

For photography, express the intended photographic result through framing,
camera position, perspective, focal-length feel, depth of field, exposure,
light quality, physical materials, and the desired degree of candidness or
staging. Use exact equipment only when the user actually cares about it and it
adds control beyond the observable photographic effect.

For illustration, express the result through character proportions, shape
language, line behavior, value grouping, color application, edge treatment,
rendering density, effects, and the relationship between figure and background.
Introduce other medium-specific language when it controls the requested image;
these examples do not limit the available vocabulary.

## State constraints economically

Describe the desired state positively where that is clearer, then add explicit
preservation or exclusion language for hard boundaries and likely
request-specific failures. Every retained phrase should control visible
content, spatial arrangement, rendering, or an important invariant. Remove
redundant adjectives, conflicting directions, invisible exposition, generic
quality incantations, and exclusions with no bearing on the requested frame.

For an edit, state the operation and its boundary, describe the static final
state, and name the invariants that must survive. For a revised generation,
write a complete replacement prompt rather than a conversational patch such as
“make it more dramatic.”

## Render the prompt package

Follow the user's language unless they request another language. Include only
the sections that carry information for the current request:

1. **Requirement summary:** use for a complex result or material assumptions.
2. **Image handling:** use when images are involved. Distinguish model inputs
   from analysis-only sources, give model inputs stable labels, and state upload
   order when needed.
3. **Revision diagnosis:** use when an earlier prompt or generated result is
   evidence for the revision. Explain the material cause briefly outside the
   prompt.
4. **Final prompt:** always include one canonical, complete prompt in a
   plain-text fenced block. It must stand on its own with only the declared
   model-input images. Add complete alternative prompts only when the user asks
   for variants or confirms that a materially different visual direction should
   remain open; do not generate variants mechanically.

The numbered sections describe the available output components, not a form that
must always contain four headings. Add a short, task-specific note outside the
prompt when it materially helps the user apply the package; keep analysis and
explanation out of the copyable prompt itself.

Review the final prompt as if the image model receives only that text and the
declared model-input images. It is complete when the intended still frame,
people, relationships, rendering, and constraints remain understandable
without the earlier conversation or any analysis-only reference.
