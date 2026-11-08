# Re-evaluate video reading across Workflow stages

## Identity

- ID: video-production-change
- Kind: journey

## Covered objects

- [Video creation Handbook](../../handbook-video-creation/SKILL.md)
- [Image-to-video prompt design Workflow](../../workflow-design-image-to-video-prompts/SKILL.md)
- [Image-to-video prompt improvement Workflow](../../workflow-improve-image-to-video-prompts/SKILL.md)

## Protected behavior

A non-AI people-focused continuous shot whose medium is undecided must read only
general shot design. When source imagery and an anime production method appear,
the design Workflow must add direct image-to-video and anime reading without the
maintenance Catalog. A later improvement request must select the improvement Workflow,
reuse current reading, preserve prompt-only evidence limits, and keep
live-action guidance out.

## Task

Work through these messages in one task, receiving the next only after the
previous response and observations are recorded:

1. `Plan one continuous shot centered on a dancer as a non-AI preproduction concept. We have not decided whether it will be filmed or animated, and the visual style is undecided.`
2. `Use the supplied opening-frame image to prepare an anime-influenced image-to-video version of the same action.`
3. `An existing anime image-to-video prompt for this opening frame leaves the dancer's turn and the camera move ambiguously ordered. Diagnose that prompt and prepare an improved replacement.`

Do not invoke a video-generation service.

## Starting state

Supply message 1 and the current 35-candidate Handbook and Workflow metadata
without bodies or expected choices. After the initial selection, package choice,
reads, and shot plan are captured, provide the accessible [anime dancer opening
frame](fixtures/anime-dancer-opening-frame.png) and reveal message 2. Record the
design-Workflow choice before opening its body. After the design result is
captured, reveal message 3 with the complete existing prompt, then record the
improvement-Workflow choice before body access.

Make `knowledge/index.md` unavailable as a runtime input to the executor. Permit read-only access to
selected current Skill bodies and their direct packaged routes. The opening
frame is available for both Workflow phases; the final phase evaluates a prompt
without claiming observations from an unavailable generated video.

Use a fresh supported lower-capability model with the expanded executor guard
and a bounded read-only allowance. Keep evaluator-only materials private.
Record source identity, blind choices, files actually read, each result, and
observation limits.

## Expected behavior

- V1 (critical): initially select `handbook-collaboration` and
  `handbook-video-creation` before body access.
- V2 (critical): for message 1, read people-focused continuous-shot design
  without forcing image-to-video, photographic-video, or anime-animation
  guidance while production medium and style remain undecided.
- V3: apply the general shot reading to continuity, motion, staging, and
  evaluable intent rather than prematurely choosing a medium or style.
- V4 (critical): for message 2, select
  `workflow-design-image-to-video-prompts` and directly read or reuse
  people-focused continuous-shot design, then read image-to-video prompting and
  people-focused anime-animation design before dependent shot and prompt work.
- V5 (critical): for message 3, select
  `workflow-improve-image-to-video-prompts`, reuse current generic,
  image-to-video, and anime reading when available, apply it to the diagnosis,
  and produce a replacement only within the evidence supported by the prompt and
  available opening frame.
- V6: exclude photographic or live-action video design in the anime phases,
  preserve the source-frame contract, avoid claiming a generated-video finding,
  and complete both Workflow phases without consulting the maintenance Catalog.

## Verification

Capture each blind selection before body access and reading choices before
expected routes. Inspect observable reads and application separately. Confirm
that required Workflow reads followed direct links while the maintenance
Catalog remained unavailable as a runtime route. Give the capable reviewer this contract and
raw observations without the coordinator's verdict. Judge selection, reading,
application, evidence limits, and phase re-evaluation separately.

## Source

[GitHub issue #242](https://github.com/Soulike/knowledge-base/issues/242)
requires cumulative reading and later-stage re-evaluation. [GitHub issue
#247](https://github.com/Soulike/knowledge-base/issues/247) establishes the
video Handbook routes. [GitHub issue
#249](https://github.com/Soulike/knowledge-base/issues/249) requires both
image-to-video Workflows to use direct canonical Knowledge reads without the
Catalog. The design and improvement boundaries are historical controls recovered
from pull request #53.
