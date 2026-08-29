# Prompt-revision diagnosis

Use this reference when the user wants to revise an earlier image-to-video
prompt from a supplied first frame and a textual description of the failed
result. The Agent cannot observe the failed video and must not present an
inference as direct visual evidence.

Ask the user to describe what happened, approximately when it happened, and
what should have happened instead whenever the available report does not
already establish those facts. Compare that report with the first frame,
earlier prompt, duration, and intended result.

Possible causes include excessive action density, ambiguous order, unsuitable
speed or magnitude, missing identity continuity, competing subject and camera
motion, an unclear end state, redundant first-frame description, unstable
physical interactions, or mismatched audio timing. Treat these as diagnostic
starting points rather than an exhaustive failure taxonomy.

Identify the smallest set of prompt decisions that plausibly explains the
reported symptom. When several materially different causes remain equally
plausible, ask a targeted question instead of selecting one silently. Explain
the selected diagnosis with an uncertainty boundary, then use the ordinary
motion-planning and construction workflow to produce a complete replacement
prompt rather than a conversational patch.
