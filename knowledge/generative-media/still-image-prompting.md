# Natural-language prompting for generated still images

## Scope

This document explains model-independent principles for expressing and
evaluating a generated still image as a natural-language prompt. It owns the
distinctions among visual-design quality, prompt-specification quality, and
generator execution; semantic completeness and prioritization; multi-subject
binding; image-reference semantics; constraints; and diagnosis of common
prompt-alignment failures, without prescribing provider syntax or one universal
prompt length or serialization.

## When to update

Update this document when image-model capabilities, provider guidance,
reference-image mechanisms, prompt-alignment research, or repeated practical
failures change the model-independent advice for specifying or evaluating a
generated still image.

## Separate the picture, its specification, and its execution

Evaluate three different questions:

1. **Visual-design quality:** Would the intended frame work as an image,
   independent of a generator?
2. **Prompt-specification quality:** Does the prompt express that design
   completely, coherently, and without material ambiguity?
3. **Generator execution:** Did the selected model honor the text and image
   conditions within its own capabilities and stochastic variation?

A visually attractive output can depict the wrong scene. A complete prompt can
still be executed poorly. A generator can also follow a weak visual design
faithfully. Do not assume that adding words improves all three axes or that one
failed output proves a prompt defect.

When reviewing an existing prompt, compare the intended image, prompt, declared
image inputs, generated result, and user criticism when those artifacts are
available. Locate the smallest causal set of mismatches before changing the
prompt. Preserve sound decisions and state uncertainty when one stochastic
output cannot establish the cause.

## Write a visible contract

Describe the final visible image rather than the conversation or sequence of
instructions that produced it. Translate abstract intentions and backstory into
observable subjects, actions, relationships, setting, composition, light,
color, materials, and expression. Retain an abstract mood or theme only when it
adds useful emphasis after its visible carriers are defined.

Include the responsibilities that materially control this image:

- the artifact and controlling visible idea;
- the target orientation, aspect ratio, crop, and required negative space;
- every important person and the attributes that belong to that person;
- the chosen action instant and visible interactions;
- spatial arrangement, viewpoint, depth, and visual hierarchy;
- environment and contextual evidence;
- medium-specific shape, line, value, color, rendering, optics, light, motion,
  and material behavior; and
- hard invariants and request-specific exclusions.

This is an attention set, not a fixed schema. Omit dimensions that do not
change the result, combine related information, and introduce unfamiliar
dimensions when the image needs them.

State the target canvas in visible terms, such as a vertical 2:3 composition or
a wide 16:9 frame, even when the caller may also configure the ratio through a
provider parameter. When image references are involved, make clear whether a
reference controls composition and crop; otherwise its relevant content should
adapt to the stated target canvas.

## Prefer sufficient specificity over length

No prompt length, paragraph count, field order, or serialization is universally
best across image models. Provider guidance ranges from short, direct phrases
to detailed descriptive captions. Use the shortest expression that preserves
every material visual decision and binding.

Add a detail when it distinguishes the desired image from a plausible wrong
one. Remove it when it merely repeats another phrase, conflicts with a stronger
decision, adds invisible exposition, or competes with the focal idea without
changing anything important.

Organize information for human and semantic clarity. Establish the whole frame
and its controlling idea, then keep a person's identity and attributes near
that person's action, relationship, and position. Group medium, environment,
and constraint details coherently. Do not claim that early word position has a
universal weighting effect unless the consuming model documents it.

Use concrete, observable language instead of generic quality incantations.
Terms such as "masterpiece," "best quality," "4K," a camera brand, or an
arbitrary lens value are provider-sensitive and cannot replace composition,
light, material, line, color, or focus decisions.

## Bind multiple people and relationships explicitly

Text-to-image systems have repeatedly shown difficulty with counts, attribute
binding, spatial relationships, and complex compositions. Reduce avoidable
ambiguity even though wording cannot eliminate model limitations.

Give each person a stable, visually meaningful label. Attach appearance,
clothing, accessories, expression, pose, props, and actions to the correct
label. Name the actor, receiver, object, direction, depth, and contact point
when a pronoun or loose clause could attach them to the wrong person.

Make spatial statements mutually compatible. Resolve left and right from one
viewpoint; distinguish foreground, middle ground, and background; and verify
that gazes, hands, held objects, and body contact can coexist in one frame.
Repeat a critical binding locally when separation would make ownership
ambiguous, but do not duplicate the whole character description mechanically.

When the prompt accumulates more people, references, props, interactions, and
layout constraints than the image can prioritize, simplify or ask which
requirements control. More explicit prose does not remove the generator's
finite compositional capacity.

## Preflight generation feasibility

Before handing off a prompt, inspect the design for model-independent generation
risks. Relevant risks include several separately identified people, exact
counts, per-person attribute or wardrobe binding, complex physical contact,
strict left-right or depth relationships, exact text or layout, and several
reference images that simultaneously control identity, pose, composition, and
style.

Also inspect the prompt's attention budget. A frame can be visually coherent
for a human artist yet ask a generator to preserve too many equally important
people, props, effects, environmental details, and exclusions at once. Identify
which requirements control and which can adapt before the model makes that
choice implicitly.

Mitigate a material risk by simplifying the frame, strengthening local subject
bindings, reducing competing reference roles, relaxing exactness, prioritizing
one interaction or focal relationship, or separating incompatible goals into
different images. When mitigation would change a hard constraint or creative
intent, present the trade-off to the user rather than silently weakening it.

This preflight does not predict a particular model or guarantee execution.
Disclose residual risk when a coherent prompt still depends on a capability
that text alone cannot ensure, such as several exact identities, intricate
contact, dense text, or rigid layout.

## Treat every image input as an explicit semantic contract

Image-generation systems expose different mechanisms for general image
conditioning, subject or identity reference, style reference, and structural
controls such as pose, depth, edges, or composition. A portable prompt cannot
infer that every supplied image has the same meaning or that every model can
honor the intended role.

For every available image, establish whether the image model will actually
receive it and what it should control. Relevant roles can include identity,
character design, wardrobe, pose, interaction, composition, setting, color,
line, rendering style, material, or another named property. Also establish what
must remain recognizable, what may adapt to the new frame, and what visible
content should be ignored.

An image available only for analysis must be translated into the relevant
observable properties; the final prompt cannot depend on an undeclared image.
A model-input image should not be needlessly transcribed when it is the
authoritative source for identity or style. Text should establish its role,
protect material invariants, resolve ambiguity, and describe intended changes.

Reference-image fidelity is provider- and model-dependent. Exact identity,
several separate identities, subject-plus-style combinations, or exact
structural control may exceed a model's supported inputs or reliable capacity.
State the intended contract and disclose uncertainty rather than promising
fidelity.

## Express constraints economically

State the desired positive configuration first. Add explicit exclusions when
they protect a hard boundary or a likely request-specific failure. Provider
support for dedicated negative prompts, weights, and negation differs, so a
model-independent natural-language prompt should not depend on one provider's
negative syntax.

Check exclusions against positive requirements. "No background detail" can
conflict with an environmental portrait; "no overlap" can conflict with an
embrace; "no motion blur" can conflict with a photographic effect intended to
show speed. Replace generic defect lists with a clear target state or a narrow
constraint tied to the actual composition.

When exact text must appear, quote the required wording and specify its visible
placement and treatment. Text-rendering capability varies by model; keep the
required text as short as the artifact permits and do not promise perfect
rendering where the consuming model cannot establish it.

## Diagnose before rewriting

Classify mismatches before revising a prompt:

- **Intent gap:** the desired result or priority was never established.
- **Visual-design gap:** the requested frame, pose, relationship, hierarchy, or
  medium treatment is weak or internally incompatible.
- **Research gap:** a factual, cultural, physical, identity, or visual-reference
  decision was guessed or left unresolved.
- **Specification gap:** the prompt omits, contradicts, misbinds, or obscures a
  material decision.
- **Input-contract gap:** an image's destination, role, invariant, or allowed
  adaptation is absent or ambiguous.
- **Execution gap:** the prompt states the requirement clearly, but the model
  omits, swaps, deforms, or misplaces it.

Common observable failures include missing or miscounted people, migrated
clothing or props, wrong left-right or depth relationships, implausible contact,
lost low-priority requirements, identity mixing, exact-layout failure, and text
errors. Use these as diagnostic categories, not as proof that prompt wording
caused the failure.

Rewrite the complete prompt when its semantic contract changes. Do not return a
conversational patch such as "make it more dramatic" or mechanically append
keywords. When the existing prompt already expresses a coherent design, report
that finding; do not manufacture an improvement to disguise model variance or
capability limits.

## Sources

- [Google Cloud: Image prompt and attribute guide](https://cloud.google.com/vertex-ai/generative-ai/docs/image/img-gen-prompt-guide)
- [Adobe Firefly: Writing effective text prompts](https://helpx.adobe.com/firefly/web/work-with-images/generate-images/writing-effective-text-prompts.html)
- [Midjourney: Prompt basics](https://docs.midjourney.com/hc/en-us/articles/32023408776205-Prompt-Basics)
- [Midjourney: Image prompts](https://docs.midjourney.com/hc/en-us/articles/32040250122381-Image-Prompts)
- [Google Cloud: Subject customization](https://cloud.google.com/vertex-ai/generative-ai/docs/image/subject-customization)
- [Adobe Firefly: Composition reference](https://helpx.adobe.com/firefly/web/work-with-images/generate-images/match-image-composition-to-reference-image.html)
- [T2I-CompBench++](https://arxiv.org/abs/2307.06350)
- [GenEval](https://proceedings.neurips.cc/paper_files/paper/2023/hash/a3bf71c7c63f0c3bcb7ff67c67b1e7b1-Abstract-Datasets_and_Benchmarks.html)
- [TIFA](https://arxiv.org/abs/2303.11897)
- [ConceptMix](https://arxiv.org/abs/2408.14339)
- [IP-Adapter](https://arxiv.org/abs/2308.06721)
- [ControlNet](https://arxiv.org/abs/2302.05543)
