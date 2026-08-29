# Visual requirements

Use these decision lenses to discover what would materially change the desired
image. They are an open set of examples, not a questionnaire, a required schema,
or a limit on the visual decisions an unfamiliar request may require. Ask the
user only about unresolved high-impact choices; infer low-impact details that
can be made coherent with the settled intent.

## Find the controlling visual idea

Identify the image's focal idea and what makes the requested frame worth
showing. Determine which subjects carry that idea, what they are visibly doing,
where the viewer encounters them, and which visual medium best expresses the
request. Intended use, orientation, aspect ratio, cropping tolerance, and
negative space matter when they change composition, but they need not become
questions when the request already settles them or they have no material
effect.

Separate hard constraints from preferences and open choices. A hard constraint
must survive aesthetic improvement. A preference may be adapted to preserve a
more important relationship. An open choice may be filled by the Agent when it
does not conceal a meaningful fork from the user.

## Resolve people and relationships

For each visually distinct person, establish enough stable attributes to keep
the cast legible. Relevant choices may include appearance, silhouette, body
proportions, hair, wardrobe, accessories, expression, gaze, posture, and visual
prominence. Use only the dimensions that affect this image, and introduce
other dimensions when the request calls for them.

For multiple people, resolve who performs each action, who or what receives it,
where each person stands in depth and across the frame, how their gazes relate,
and where bodies or props make contact. Prefer stable labels while reasoning so
that appearance, clothing, limbs, and actions do not migrate between people.

## Freeze action into one visible instant

A still image may contain forceful motion, but it cannot contain a sequence.
Choose the instant whose pose and visible consequences communicate the action
most clearly. Ground it in observable features such as body orientation,
balance, limb placement, contact points, facial tension, hair and fabric
response, displaced water or dust, and the relationship between the pose and
camera.

Translate narrative premises into current visual evidence. For example, “she
has just escaped a chase in the rain” might become wet hair against her face, a
forward-leaning stance, one hand braced on a knee, a backward glance, rain-dark
fabric, and reflected lights on wet pavement. This example illustrates the
translation; it does not prescribe those details for other scenes. Omit
backstory that has no visible consequence in the chosen frame.

## Extract and adapt visual references

For an analysis-only image, inspect the aspect the user selected and the
minimum coupled details that make it intelligible. A pose reference may require
body orientation, balance, gaze, interaction, or camera relationship while
leaving identity, clothing, setting, and style untouched. A style reference may
call for line quality, edge treatment, value structure, palette relationships,
texture, rendering density, or characteristic proportions without copying its
subject matter. Add other observable dimensions when they better explain the
requested reference.

When transferring an action or composition onto a model-input character,
preserve the reference's controlling visual idea and recognizable spatial
relationships. Adapt joint range, stance, spacing, silhouette, clothing
response, prop placement, or framing when the target character and scene need
it. Ask before an adaptation changes the meaning the user wanted from the
reference.

## Choose medium-specific decisions

Use a shared subject, action, setting, and composition core, then inspect the
decisions specific to the selected medium.

For a photograph, useful considerations can include photographic genre,
staging versus candid observation, camera height and angle, focal-length feel,
perspective, depth of field, motion cues, available and artificial light,
exposure character, and the physical texture of skin, hair, fabric, and the
environment.

For an illustration, useful considerations can include character-design
proportions, silhouette exaggeration, line weight and closure, flat color,
cel shading, painterly rendering, gradient treatment, edge hierarchy,
background density, effects, and whether the image should feel like a character
sheet, animation frame, comic panel, or finished narrative illustration.

These are prompts for attention rather than closed vocabularies. Replace,
extend, or omit them when another medium has different controlling properties.

## Bound an edit

For an edit, identify the edit target, the requested final state, the region or
concept allowed to change, and the invariants that define everything else.
Consider composition, crop, identity, pose, wardrobe, lighting, style, text,
edges, reflections, shadows, and perspective when they are relevant. Do not
invent a preservation requirement merely because it appears in this example
list.

Use operation language such as replace, remove, add, or adjust to establish the
edit boundary. Describe the resulting image as a single static state, and make
integration requirements visible: matching perspective, contact, scale,
lighting, shadows, texture, and edge treatment where the edit needs them.

## Diagnose an unsatisfactory result

Compare the available evidence among the intended frame, earlier prompt,
generated result, and user's critique. Ask for a missing artifact only when its
absence materially blocks diagnosis. Look for missing visual decisions,
ambiguous attachment roles, misassigned people or actions, narrative language
that failed to specify a frame, conflicting requirements, invisible
abstractions, or too much competing detail. Treat this list as diagnostic
starting points rather than an exhaustive failure taxonomy.

Identify the smallest set of underlying decisions that explains the mismatch.
Finish the diagnosis when those material causes and the decisions that need to
change are explicit.

## Decide whether research is complete

The requirements are ready when the Agent can describe the intended result as
one coherent visible frame, route every image correctly, assign every important
action and constraint, and distinguish settled requirements from delegated
choices. Continue the interview only while an unresolved answer could
materially change that frame or its required inputs.
