# Prompt construction

Turn the settled motion plan into a model-independent natural-language prompt
for one continuous video generated from the supplied first frame.

## Let the first frame describe appearance

Use the first frame as the visual source of truth. Focus the prompt on what
changes over time instead of routinely restating people, clothing, setting,
composition, lighting, or style that the model can already see. Restate a
visible element only when it moves, transforms, participates in an interaction,
conflicts with the desired motion, or needs explicit continuity protection.

Open by naming the confirmed duration and the continuous relationship to the
input, such as “Generate a continuous six-second video beginning exactly from
the supplied first frame.” Express provider controls as ordinary visual or
temporal intent rather than parameter names or command syntax.

## Express time in prose

For one simple action, state its direction, speed, magnitude, development, and
end state without inventing time segments. For several ordered actions, use
natural phases such as “at the start,” “then,” and “by the end,” or embed
approximate seconds in complete sentences when the confirmed duration benefits
from tighter allocation.

Describe simultaneous supporting motion beside the primary action it supports.
Do not turn hair, clothing, weather, reflections, or other secondary movement
into separate sequential events unless they genuinely change at different
times.

## Organize the continuous video prompt

A useful video-specific progression may establish the first-frame relationship
and duration, develop the primary action, coordinate camera and supporting
motion, define continuity and the end state, and describe integrated audio when
selected.

Keep timing inside the prose. Do not turn the prompt into a timeline, shot list,
or multi-shot screenplay.

## Control camera and continuity positively

Describe the selected camera behavior explicitly. Omitting camera direction is
not a reliable way to request a fixed camera. State the desired result
positively, such as a stable locked camera, one uninterrupted tracking move, or
a continuous shot that keeps the subject centered.

Protect only the continuity that materially risks drifting during the planned
motion. Express the desired stable state directly: the same character identity,
unchanged clothing, consistent line art and cel shading, stable background
geometry, continuous lighting, or another request-specific invariant. Do not
append a generic negative-prompt list or a provider-specific negative field.

## Render the prompt package

Include only the output components that carry information for the request:

1. **Requirement summary:** always record the first-frame input, duration,
   primary action, selected camera behavior, audio mode, and material
   assumptions.
2. **Duration and action assessment:** use only when the requested events did
   not fit and the user selected a revised plan.
3. **Revision diagnosis:** use only when an earlier prompt and text-described
   failure informed the replacement.
4. **Final prompt:** always include one canonical, complete prompt using the
   required natural-language format.
5. **Usage note:** always remind the user to supply the first frame and, when
   the target model exposes a duration control, set it to the confirmed
   duration.

The requirement summary, final prompt, and usage note are required. Include the
duration assessment and revision diagnosis only when their conditions apply;
do not render unused headings. When integrated audio was selected, include its
settled sound and synchronization requirements in a distinct prose paragraph
inside the same prompt.

The video prompt is complete when the declared first frame, final prompt, and
matching duration setting let the model identify one continuous progression,
the motion and camera remain feasible within the duration, and the end state
and material continuity requirements are explicit.
