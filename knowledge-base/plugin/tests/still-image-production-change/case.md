# Re-evaluate still-image reading across Workflow stages

## Identity

- ID: still-image-production-change
- Kind: journey

## Covered objects

- [Still-image creation Handbook](../../skills/handbook-still-image-creation/SKILL.md)
- [Still-image prompt design Workflow](../../skills/workflow-design-image-generation-prompts/SKILL.md)
- [Still-image prompt improvement Workflow](../../skills/workflow-improve-image-generation-prompts/SKILL.md)
- [Prompt execution target reference](../../references/generative-media/prompt-execution-target.md)

## Protected behavior

Focused still-image learning must not force people, medium, or product-specific
reading. When the task becomes people-focused prompt design and later prompt
improvement, the applicable Workflows must read general and matching canonical
Knowledge directly without consulting the maintenance Catalog, clarify an ambiguous Gemini
target, distinguish direct API use from the Gemini App, and re-evaluate medium,
target, and task-stage conditions while reusing current reading.

## Task

Work through these messages in one task, receiving the next only after the
previous response and observations are recorded:

1. `Explain how to write a useful AI-generation prompt for an empty misty landscape with no people.`
2. `Now prepare a new photorealistic portrait prompt for a ceramic artist. I plan to use Gemini.`
3. When asked which Gemini execution path will receive the prompt: `Use a Gemini image model directly through its API, not the Gemini App.`
4. `A separate photorealistic portrait prompt was used in the Gemini App and did not preserve the intended observational composition. Diagnose that existing prompt and prepare an improved replacement.`

Do not invoke an image-generation service.

## Starting state

Supply the first natural request and the current 35-candidate Handbook and
Workflow metadata without bodies or expected choices. After the focused-learning
selection, package choice, read, and explanation are captured, reveal message 2.
Record the later Workflow choice before opening its body. Reveal message 3 only
after the executor identifies the execution-path ambiguity. After the design
result is captured, supply message 4 with a concise existing prompt, its intended
composition, and the user's criticism; then record the improvement-Workflow
choice before body access.

Make `knowledge/index.md` unavailable as a runtime input to the executor. Permit read-only access to the
selected current Skill bodies, the prompt-target reference, and their direct
packaged routes. No source image is required; the last phase evaluates an
existing prompt rather than claiming visual findings from an unavailable result.

Use a fresh supported lower-capability model with the expanded executor guard
and a bounded read-only allowance. Keep the case and evaluator materials
private. Record source identity, blind choices, files actually read, the
clarification exchange, each result, and observation limits.

## Expected behavior

- I1 (critical): initially select `handbook-collaboration` and
  `handbook-still-image-creation` before body access.
- I2 (critical): for the focused non-people learning request, read still-image
  prompting without forcing people-focused, photographic, anime, or Gemini App
  guidance.
- I3: apply the prompting reading in the explanation rather than relying on a
  generic list of visual adjectives.
- I4 (critical): for message 2, select
  `workflow-design-image-generation-prompts`, read people-focused still-image
  design, still-image prompting, and photographic-image design through its
  direct routes, and ask which Gemini execution path applies before using
  product-specific guidance.
- I5 (critical): after message 3, exclude Gemini App people-image prompting and
  produce a portable, photorealistic, people-focused prompt package without the
  maintenance Catalog or a Handbook body being necessary to supply the Workflow's
  required reading.
- I6 (critical): for message 4, select
  `workflow-improve-image-generation-prompts`, reuse current general and
  photographic reading when available, add Gemini App people-image prompting,
  and apply it to the diagnosis and replacement prompt.
- I7: exclude anime-illustration guidance throughout, preserve the distinction
  between prompt-only evidence and a visible generated result, and do not claim
  that any image was generated.

## Verification

Capture each blind selection before body access and each reading choice before
showing expected routes. Inspect observable reads and application separately.
Confirm that the maintenance Catalog remained unavailable as a runtime route and that
the required Workflow reads followed direct links from the current bodies. Give
the capable reviewer this contract and raw observations without the
coordinator's verdict. Judge every phase, the ambiguity stop, direct reading,
application, and re-evaluation separately, and retain every attempt.

## Source

[GitHub issue #242](https://github.com/Soulike/knowledge-base/issues/242)
requires focused learning, cumulative reading, and re-evaluation after
production changes. [GitHub issue
#247](https://github.com/Soulike/knowledge-base/issues/247) establishes the
still-image Handbook routes. [GitHub issue
#249](https://github.com/Soulike/knowledge-base/issues/249) requires both
still-image Workflows and the shared prompt-target reference to operate through
direct canonical reads without the Catalog. The prompt-only and Gemini routing
boundaries are historical controls recovered from pull requests #48 and #51.
