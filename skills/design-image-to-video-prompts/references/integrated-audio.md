# Integrated-audio requirements

Use this reference only when the user intends the target video model to generate
the video's audio together with its visuals. Keep audio absent from a
video-only prompt.

Determine which sounds materially belong to the continuous shot. Relevant
possibilities include dialogue, action sound effects, ambient sound, music,
off-screen sources, spatial placement, and synchronization with visible events.
This is an open attention set rather than a required audio schema.

For dialogue, establish the speaker, exact words, language, delivery, and timing
when they matter. Quote exact spoken text verbatim in the final prompt. Keep the
amount of speech compatible with the confirmed duration and the visible mouth
movement; ask the user to shorten dialogue or extend the shot when it cannot fit
naturally.

Connect action sounds to their visible causes and timing. Describe ambient
sound and music only to the degree that they shape this shot, and distinguish
sound originating inside the scene from off-screen or non-diegetic sound when
that relationship matters. Avoid provider-specific audio syntax or assumptions
about separate tracks.

The audio plan is ready when every important sound has a clear source, timing,
and relationship to the visible motion, and the combined visual and audio event
density remains feasible within the confirmed duration.
