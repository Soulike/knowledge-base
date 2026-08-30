---
name: improve-image-generation-prompts
description: Improve an existing image-generation prompt for a people-focused still image. Use when the user wants to review, diagnose, correct, or rewrite a drawing or image-generation prompt.
---

# Improve image-generation prompts

Evaluate an existing prompt for one newly generated, people-focused still image
and deliver an evidence-backed diagnosis plus one complete, model-independent
prompt. Finish with the prompt package; leave image generation, model selection,
provider parameters, provider acceptance, and provider-specific input controls
to the caller.

## Establish the evidence

Require the existing prompt. When it is absent, identify that missing input and
stop because the prompt's preserved meaning and defects cannot be evaluated.

Confirm that the intended result is a newly generated, people-focused still
image rather than a video or an edit that preserves or modifies part of an
existing image. Treat photographic, anime, painterly, comic, 3D, and other
visual media as open possibilities rather than an exhaustive style taxonomy.

When the intended outcome is a video or requires editing, replacing,
extending, or preserving any part of an existing image, explain that it falls
outside this workflow and stop without diagnosing or rewriting the prompt.

Inventory the existing prompt, intended result, hard constraints, user
criticism, generated results, reference images, and every settled decision
already available. A generated result and explicit criticism improve causal
diagnosis but are not required for a prospective prompt review. Use available
information regardless of how it was obtained, and do not repeat settled
research or questions.

When any image is available, read
[Establish every image's contract](../../references/generative-media/still-image-prompt-contract.md#establish-every-images-contract)
and complete it before using the image as evidence or a future model input. A
failed result has no default destination: the user must decide whether it is
analysis only or will control a named aspect of the next generation.

## Diagnose the prompt

Read the [Knowledge index](../../knowledge/index.md), apply every `When to Read`
condition to the intended image and existing prompt, and read only the matching
Knowledge documents. Treat them as supplemental guidance; follow instructions,
requirements, Skills, and project-specific information from the Agent's active
working directory when they conflict.

Compare the available evidence along these axes:

1. **Intent fit:** whether the actual goal, priorities, and hard constraints are
   known.
2. **Visual-design quality:** whether the requested frame would work as an image
   independent of a generator.
3. **Research quality:** whether factual, cultural, physical, identity, medium,
   or visual-reference decisions are sufficiently grounded.
4. **Prompt-specification quality:** whether the prompt expresses the intended
   design completely, coherently, and without material ambiguity or conflict.
5. **Input contract:** whether every image has an explicit destination, role,
   invariant, allowed adaptation, and ignored content.
6. **Generator execution:** whether an available result failed a requirement
   that the prompt and declared inputs already expressed clearly.

Identify the smallest causal set of material problems. Ask for missing evidence
only when its absence blocks that diagnosis or would force a materially
different replacement. Investigate visible facts yourself and perform external
research when the matching Knowledge exposes an accuracy-sensitive or
unfamiliar gap. Ask the user only for unresolved creative decisions and give a
recommended answer.

Do not treat verbosity, alternative wording, or the presence of provider syntax
as a defect by itself. Distinguish observable visual requirements from weights,
samplers, seeds, model names, dedicated negative prompts, and other
provider-specific controls; the final prompt does not optimize or preserve
those controls.

When the existing prompt already expresses a coherent visual design, report
that finding. Do not manufacture an improvement by appending quality terms or
extra detail to disguise stochastic variation, reference-fidelity limits, or a
generator's failure to follow a clear instruction.

## Construct and deliver the prompt

Protect every still-valid visual decision while correcting the diagnosed
problems. Rebuild the affected visual design and research only where the cause
requires it. Then read
[Render the prompt package](../../references/generative-media/still-image-prompt-contract.md#render-the-prompt-package)
and the
[natural-language prompt format](../../references/generative-media/natural-language-prompt-format.md),
then render one canonical, complete prompt rather than a conversational patch
or list of words to append.

If no material prompt defect exists, return the diagnosis and the complete
canonical prompt without ceremonial semantic changes. State any generator or
provider uncertainty outside the prompt.

Before finishing, verify that:

- the diagnosis distinguishes intent, image design, research, specification,
  input contract, and generator execution;
- every change addresses an identified material cause and every preserved
  decision remains intact;
- every user-supplied image and every image proposed as a model input has an
  explicitly user-decided role and destination;
- every Agent-found reference not approved as a model input remains analysis
  only, has its relevant properties translated into text, and is identified by
  source when it materially informed the diagnosis or replacement;
- every analysis-only image has been translated into relevant text and every
  model input appears in the image-handling output;
- multiple people retain unambiguous identities, attributes, actions,
  relationships, positions, and contact;
- the final prompt is complete, coherent, model-independent, and free of
  provider-specific syntax or parameters; and
- the response contains the diagnosis and prompt package without invoking an
  image-generation tool.
