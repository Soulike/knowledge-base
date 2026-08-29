# Image-editing requirements

Use this reference when the requested prompt will direct an image model to edit
an existing image.

Identify the edit target, the requested final state, the region or concept
allowed to change, and the invariants that define everything else. Consider
composition, crop, identity, pose, wardrobe, lighting, style, text, edges,
reflections, shadows, and perspective when they are relevant. Do not invent a
preservation requirement merely because it appears in this example list.

Use operation language such as replace, remove, add, or adjust to establish the
edit boundary. Describe the resulting image as a single static state, and make
integration requirements visible: matching perspective, contact, scale,
lighting, shadows, texture, and edge treatment where the edit needs them.
