# Apply video guidance as production decisions change

## Identity

- ID: video-production-change
- Kind: journey

## Covered objects

- [Video creation Handbook](../../handbook-video-creation/SKILL.md)
- [Image-to-video prompt design Workflow](../../workflow-design-image-to-video-prompts/SKILL.md)
- [Image-to-video prompt improvement Workflow](../../workflow-improve-image-to-video-prompts/SKILL.md)

## Protected behavior

One people-focused continuous shot moves from medium-undecided non-AI
preproduction to anime image-to-video design and then improvement of an existing
prompt. Protect the medium-appropriate packages, direct Workflow routes,
creative confirmation, and evidence limits required by each phase. The
collaboration owner separately protects the generic reading lifecycle,
including reuse, rereading, interruption, and recovery behavior.

## Task

Work through these messages in one task, receiving the next only after the
previous response and observations are recorded:

1. `Plan one continuous shot centered on a dancer as a non-AI preproduction concept. We have not decided whether it will be filmed or animated, and the visual style is undecided.`
2. `Use the supplied opening-frame image to prepare an anime-influenced image-to-video version of the same action.`
3. After the executor presents its proposed canvas and creative direction:
   `I accept the proposed canvas and creative direction. Complete the image-to-video prompt package.`
4. `An existing anime image-to-video prompt for this opening frame leaves the dancer's turn and the camera move ambiguously ordered. Diagnose that prompt and prepare an improved replacement.`

Do not invoke a video-generation service.

## Starting state

Use the exact final installed Skill candidate metadata and current covered
guidance from the tested source. Begin with only message 1 and no expected
selection. Record applicable Skill choices before opening a new body, then
record every selected and excluded package before opening newly required
Knowledge. Permit read-only access to direct canonical routes and no external
effects.

After the phase 1 choices, reads, and shot plan are recorded, supply the
[anime dancer opening frame](fixtures/anime-dancer-opening-frame.png) with
message 2. Reveal message 3 only after the executor presents a concrete canvas,
material use, and creative direction for confirmation. After the completed
design prompt package is recorded, reveal message 4 with this existing prompt:
`Start on this dancer, turn quickly and glide right as the camera slides left,
reach up, spin back, keep everything smooth, freeze the pose, then return, one
continuous shot.` The opening frame remains available for the improvement
phase; no generated video is supplied.

Make the maintenance Catalog unavailable as a runtime route. Record the
candidate set, each phase message, choices, file and section reads, each result,
and observation limits.

This case observes the video guidance and Workflow behavior required by each
phase. Do not score generic reading reuse, rereading, guidance-change,
interruption, or recovery behavior here.

## Expected behavior

- V1 (critical): phase 1 selects the Video creation Handbook and the general
  people-focused continuous-shot package without selecting either image-to-video
  Workflow.
- V2 (critical): phase 1 reads people-focused continuous-shot design without
  assigning image-to-video, photographic-video, or anime-animation guidance
  while production medium and style remain undecided.
- V3: apply the general shot reading to continuity, motion, staging, and
  evaluable intent without prematurely choosing a medium or style.
- V4 (critical): phase 2 selects the image-to-video prompt design Workflow,
  follows its direct continuous-shot, image-to-video, and anime routes, inspects
  the supplied frame, and presents its concrete canvas, material use, and
  creative direction before phase 3 supplies confirmation. Complete the prompt
  package only after that confirmation.
- V5 (critical): phase 4 selects the image-to-video prompt improvement
  Workflow, follows its direct continuous-shot, image-to-video, and anime
  routes, and applies them to a supported diagnosis and replacement.
- V6: exclude photographic or live-action guidance from the anime phases,
  preserve the source-frame contract and prompt-only evidence limits, do not
  claim a generated-video observation, and do not use the maintenance Catalog.

## Verification

Preserve the natural message sequence. Inspect phase-by-phase Skill and package
choices, direct route reads, domain application, confirmation boundary, and
results as separate evidence.

Controlled faulty observations that load anime or photographic guidance during
phase 1, construct the design prompt before confirmation, treat the existing
prompt as generated-video evidence, or route through the maintenance Catalog
must fail the corresponding criterion.

Do not judge generic reassessment, reading reuse, rereading, interruption, or
route-restoration behavior in this case; those assertions belong to the
[collaboration lifecycle case](../../../tests/collaboration-guidance-recovery/case.md).

## Source

GitHub issues #242, #247, and #249 establish video package conditions, stage
changes, and direct Workflow reading. Design and improvement boundaries are
recovered from pull request #53. This case retains that accepted video journey
while leaving shared reading-lifecycle assertions at their collaboration owner.
