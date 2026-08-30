---
name: improve-image-generation-prompts
description: Improve a people-focused still-image generation attempt. Use when the user wants to review, diagnose, or improve an existing image-generation prompt, an unsatisfactory generated image, or both.
---

# Improve image-generation prompts

Evaluate an existing people-focused still-image generation attempt from its
prompt, generated result, or paired iterations. Deliver a professional visual
diagnosis and one complete, model-independent replacement prompt package for a
new whole-image generation. Leave image generation, image editing, model
selection, provider parameters, provider acceptance, and provider-specific input
controls to the caller.

Own the professional review and redesign work that an illustrator, art director,
or photographer would perform after an unsatisfactory attempt. Diagnose the
image as an image, not merely as text produced from a prompt, and do not reduce
the task to wording changes.

## Establish the attempt and intended result

Require at least one existing prompt or generated result. When neither is
available, identify the missing existing attempt and stop because this workflow
has no artifact to evaluate.

Confirm that the intended result is a newly generated, people-focused still
image rather than a video or an edit that preserves or modifies part of an
existing image. When the intended outcome requires editing, replacing,
extending, or preserving any part of an existing image, explain that it falls
outside this workflow and stop without producing a replacement package.

Inventory every available prompt, generated result, declared image input, user
criticism, intended result, hard constraint, and settled decision. Use available
information regardless of how it was obtained, and do not repeat settled
research or questions.

When several attempts are available, give each iteration a stable label and
pair its prompt, input-image contract, result, and feedback. Preserve their
order so that later diagnosis can distinguish recurring failures, changes that
improved or worsened the result, stochastic outliers, and requirements lost
during revision.

Inspect every accessible generated result instead of asking the user to report
visible facts. When a required result cannot be inspected, ask the user to
reattach it or describe only the part needed for the diagnosis.

When an image is available, read
[Establish every image's contract](../../references/generative-media/still-image-prompt-contract.md#establish-every-images-contract).
A generated result supplied for critique is immediately usable as analysis
evidence. Treat whether it will also become an input to the next generation as
a separate user decision. Establish the complete contract for every other
user-supplied image and every image proposed as a model input.

Establish enough of the user's intended result to judge the attempt. When the
missing intent permits materially different improvements, use the available
evidence to recommend one professional direction and ask the user to accept or
change it. When the user explicitly delegates the direction, make and surface
the decision. Do not ask for preferences that cannot change the diagnosis or
next handoff.

## Critique and diagnose the attempt

Read the [Knowledge index](../../knowledge/index.md), apply every `When to Read`
condition to the intended image and available attempt artifacts, and read only
the matching Knowledge documents. Treat them as supplemental guidance; follow
instructions, requirements, Skills, and project-specific information from the
Agent's active working directory when they conflict.

When a generated result is available, apply the matching people-focused and
medium-specific visual-design Knowledge to critique it as a complete image.
Distinguish explainable visual-design problems from aesthetic directions that
are valid but do not match the user's preference. Report the smallest set of
high-impact findings by default; expand to a complete critique only when the
user asks.

Compare the available evidence along these axes:

1. **Intent fit:** whether the attempt satisfies the actual goal, priorities,
   and hard constraints.
2. **Visual-design quality:** whether the canvas, visible proposition, people,
   relationships, action, composition, depth, environment, medium, atmosphere,
   light, color, materials, and detail density form an effective image.
3. **Research quality:** whether factual, cultural, physical, identity, medium,
   or visual-reference decisions are sufficiently grounded.
4. **Prompt-specification quality:** when a prompt is available, whether it
   expresses the intended design completely, coherently, and without material
   ambiguity or conflict.
5. **Input contract:** whether every supplied image has the intended
   destination, role, invariant, allowed adaptation, and ignored content.
6. **Generator execution:** when both prompt and result are available, whether
   the result failed a requirement that the prompt and declared inputs already
   expressed clearly.

Identify the smallest causal set that explains the important mismatch, state
the diagnosis confidence, and separate required corrections from optional
refinements. A result without its prompt supports visual critique and next-frame
design but not a claim about the original wording. A prompt without a result
supports prospective review but not observed execution findings. Use paired
iterations to strengthen or weaken each causal hypothesis.

Do not treat verbosity, alternative wording, or provider syntax as a defect by
itself. Distinguish observable visual requirements from weights, samplers,
seeds, model names, dedicated negative prompts, and other provider-specific
controls; the final prompt does not optimize or preserve those controls.

## Design the improved handoff

Protect confirmed user intent and every visual decision that remains effective,
not the wording or structure of the original prompt. Rebuild any canvas,
creative direction, visible frame, or material plan whose design caused the
failure. Apply the matching visual-design Knowledge instead of patching each
surface symptom independently.

Perform external factual or visual research when the diagnosis exposes an
unfamiliar or accuracy-sensitive gap. Apply the matching visual-design Knowledge
to identify useful or required material. When tools permit, search for and
inspect candidate references; otherwise provide concrete search, photography,
or preparation criteria. Treat Agent-found references as analysis only unless
the user explicitly approves one as a model input, and do not automatically
download or redistribute external images.

When a hard requirement depends on unavailable material, present the supported
alternatives and wait for the user's resolution. Continue without nonessential
material when the improved design can remain coherent, and state what the
optional material could improve.

When the correction changes the macro medium, visual language, atmosphere,
subject relationship, central composition, or another high-impact direction,
form one professional recommendation and ask the user to accept or change it.
Proceed without another confirmation when the correction preserves the settled
direction or the user explicitly delegated the improvement choices.

Apply the matching visual-design Knowledge to critique the complete improved
proposal. Revise every issue it identifies before presenting or delivering the
proposal. Then apply the still-image prompting Knowledge to preflight
model-independent generation risks and mitigate them without silently changing
hard constraints. Ask when a mitigation changes intent; otherwise disclose only
material residual risk.

## Construct and deliver the replacement

After the improved visual brief, material plan, professional critique, and
generation preflight are complete, read
[Render the prompt package](../../references/generative-media/still-image-prompt-contract.md#render-the-prompt-package)
and the
[natural-language prompt format](../../references/generative-media/natural-language-prompt-format.md),
then render one canonical, complete replacement prompt rather than a
conversational patch or list of words to append.

When the available prompt already expresses a coherent visual design, do not
manufacture an improvement to disguise stochastic variation,
reference-fidelity limits, or generator-execution failure. Apply an honest
mitigation only when it improves the handoff; otherwise return the complete
canonical prompt without ceremonial semantic changes and state the residual
risk and confidence outside it.

Before finishing, verify that:

- at least one existing prompt or generated result was actually evaluated;
- the intended result and every high-impact improvement direction are settled,
  explicitly delegated, or confirmed;
- every available result was professionally critiqued and every available
  iteration was paired with its prompt, inputs, and feedback when possible;
- the diagnosis distinguishes intent, visual design, research, specification,
  input contract, and generator execution without claiming evidence that the
  available artifacts cannot provide;
- the smallest high-impact causes, required corrections, optional refinements,
  and diagnosis confidence are explicit;
- every retained decision remains effective and every material redesign has
  passed another professional critique;
- every useful or required material has a defined purpose, and each unavailable
  hard requirement has a user-accepted resolution;
- every user-supplied reference and every image proposed as a model input has an
  explicitly user-decided role and destination;
- every generated result used only for critique remains analysis only unless the
  user separately approved it as a model input;
- every Agent-found reference not approved as a model input remains analysis
  only, has its relevant properties translated into text, and is identified by
  source when it materially informed the diagnosis or replacement;
- every analysis-only image has been translated into relevant text and every
  model input appears in the material-plan and image-handling output;
- the improved design has passed the model-independent generation preflight and
  all material residual risks are mitigated, accepted, or disclosed;
- the final prompt satisfies the selected natural-language format, follows the
  user's language, and is not split into positive and negative prompts or a
  keyword string;
- no prompt change exists only to make the response appear more active; and
- the response includes every applicable professional diagnosis, final visual
  brief, material plan, research finding, generation risk, and final-prompt
  component without empty sections or invoking an image-generation tool.
