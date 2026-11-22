# Preserve generative-media Workflow negative boundaries

## Identity

- ID: generative-media-workflow-negative-boundaries
- Kind: selection

## Covered objects

- [Still-image prompt design Workflow](../../workflow-design-image-generation-prompts/SKILL.md)
- [Still-image prompt improvement Workflow](../../workflow-improve-image-generation-prompts/SKILL.md)
- [Image-to-video prompt design Workflow](../../workflow-design-image-to-video-prompts/SKILL.md)
- [Image-to-video prompt improvement Workflow](../../workflow-improve-image-to-video-prompts/SKILL.md)

## Protected behavior

The four generative-media Workflow descriptions must exclude non-people still
images, existing-image pixel edits, text-only videos, and multi-shot sequences
while still selecting each Workflow for its own people-focused design or
improvement task from metadata alone. Protect those unguarded negative
selection boundaries and minimal positive controls without duplicating the full
`still-image-production-change` and `video-production-change` production
journeys.

## Task

For each independent request below, choose the applicable installed guidance
from the current candidate metadata, or choose none:

1. Design a new people-focused photorealistic still-image prompt. There is no
   existing prompt or generated result to evaluate.
2. Diagnose why an existing people-focused still-image prompt and generated
   result missed the requested composition, then produce an improved prompt.
3. Design a generated still-image prompt for an empty landscape with no people.
4. Edit the supplied portrait so that its background changes while the person
   remains pixel-identical.
5. Design a new people-focused continuous image-to-video shot from the supplied
   opening frame. There is no existing prompt or generated video to evaluate.
6. Diagnose and improve an existing people-focused image-to-video prompt and
   generated continuous shot.
7. Design a text-only generated video with no source image.
8. Turn the supplied source image into a three-shot sequence with two cuts.

Return the chosen identifiers and a short reason for each request. Do not open
candidate bodies or perform the substantive tasks.

## Starting state

Build the target-model candidate set from the installed `generative-media`
plugin Skill entrypoints (`handbook-still-image-creation`,
`handbook-video-creation`, `workflow-design-image-generation-prompts`,
`workflow-improve-image-generation-prompts`,
`workflow-design-image-to-video-prompts`, and
`workflow-improve-image-to-video-prompts`) together with the installed
`knowledge-base` base-plugin Skills. Supply all eight requests and candidate
names and descriptions without opening candidate bodies. A request that
receives only this task and the exact candidate metadata is a supported
selection boundary; when repository access is available instead, keep it
read-only and do not open candidate bodies.

Record the complete candidate metadata and every choice before any candidate
body is opened. Treat each numbered request independently; a choice for one
request must not teach later requests the expected route.

## Expected behavior

- R1 (critical): exclude both `workflow-design-image-generation-prompts` and
  `workflow-improve-image-generation-prompts` for the non-people still-image
  request (3) and existing-image pixel-edit request (4).
- R2 (critical): exclude both `workflow-design-image-to-video-prompts` and
  `workflow-improve-image-to-video-prompts` for the text-only video request (7)
  and multi-shot sequence request (8).
- R3 (critical): as positive controls, select
  `workflow-design-image-generation-prompts` (and exclude
  `workflow-improve-image-generation-prompts`) for request 1, and select
  `workflow-improve-image-generation-prompts` (and exclude
  `workflow-design-image-generation-prompts`) for request 2.
- R4 (critical): as positive controls, select
  `workflow-design-image-to-video-prompts` (and exclude
  `workflow-improve-image-to-video-prompts`) for request 5, and select
  `workflow-improve-image-to-video-prompts` (and exclude
  `workflow-design-image-to-video-prompts`) for request 6.
- R5: preserve independently applicable Handbooks (such as
  `handbook-still-image-creation` or `handbook-video-creation` where metadata
  applies), without selecting a target generative-media Workflow merely because
  an image or video noun appears in requests 3, 4, 7, or 8.
- R6: report metadata choices only, without claiming that a client loaded or
  read a selected Skill or that any substantive task was completed.

## Verification

Capture one identifier list and reason per numbered request. Compare every
request with the trusted pre-rename descriptions from integration commits
`e008e1a` and `d60172e` and with the final candidate metadata.

Controlled faulty observations that select a people-focused image Workflow for
an empty landscape or pixel-preserving portrait edit, select an image-to-video
Workflow for a text-only video or multi-shot sequence, or fail to select the
matching positive control must fail the corresponding critical criterion.

## Source

Split from `workflow-description-routing` per #303 and #308 so the
`generative-media` plugin owns its four non-redundant negative Workflow
selection boundaries alongside minimal positive controls, without duplicating
the `still-image-production-change` and `video-production-change` journeys
(originally established in GitHub issues #242, #248, and #249).
