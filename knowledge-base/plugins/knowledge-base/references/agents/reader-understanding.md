# Verify reader understanding

## Scope

Use this reference as the shared risk-based standard for deciding when a
maintained Knowledge document, Skill, or supporting reference needs a
weak-model or blind reader probe to expose author blind spots—implicit
prerequisites, silent reasoning jumps, ambiguous boundaries, or confusing
selection triggers—and how to run and interpret that probe.

Low-risk edits need no probe. Probes test whether the text supplies enough
context for an unfamiliar or weaker reader; they do not turn every edit into an
end-to-end compliance exam or demand that weaker models overcome genuine
capability limits on already explicit instructions.

## When to update

Update this reference when authoring or review experience shows that a probe
trigger criterion, lightweight probe format, or blind-spot attribution rule
needs adjustment.

## Assess probe risk

Both authors and reviewers apply the same standard to decide whether a probe is
warranted:

- **Blind selection or routing probe:** Warranted when adding a Skill, or
  substantively changing a Skill `description` or internal conditional routing
  rule where overlap, false positives, or missed triggers among real candidates
  are plausible.
- **Weak-model reading probe (Knowledge and Skill references):** Warranted when
  adding or substantively revising Knowledge or supporting references that
  introduce or reshape abstract distinctions, easily confused boundaries, dense
  causal reasoning, or implicit domain prerequisites where a strong author may
  silently bridge unstated steps.
- **Weak-model behavior probe (Skills):** Warranted when adding or substantively
  revising Workflow or guidance Skills with complex procedures, non-obvious
  preconditions, multi-state stopping or recovery paths, or subtle branching
  rules where weaker readers tend to skip checks or guess missing preconditions.
- **Low risk (skip probing by default):** Mechanical or editorial cleanups,
  link or route repairs, version or metadata updates, pure deletions or
  simplifications that introduce no new concepts or boundaries, direct factual
  or API updates, and self-contained rules whose conditions, actions, and
  exceptions are already explicit.

## Run lightweight probes

Follow [Agent behavioral evaluation](behavioral-evaluation.md) to run each
probe in a fresh context without leaking expected answers, target names (for
selection), or author conclusions.

- **Selection or routing probe:** Apply
  [Check selection from requests](selection-triggers.md#check-selection-from-requests)
  using real candidate metadata or current body conditions in a fresh context.
- **Knowledge or reference reading probe (single-turn preferred):** Give a
  fresh, materially weaker model (such as a fast or lightweight tier model
  available in the environment that still supports any needed tools, rather than
  merely rewording with the authoring model) the complete target document and
  ask it to:
  1. paraphrase the core rules, applicability boundaries, and prerequisites in
     its own words (catches silent misinterpretation when a model feels
     confident yet misreads the boundary); and
  2. report any unexplained terms, causal jumps, missing prerequisites, or
     exceptions it had to guess.
     Include 1–2 brief, realistic boundary cases only when the edit specifically
     distinguishes two easily confused cases and paraphrase alone may not show
     whether that distinction landed. Do not force open-ended engineering tasks on
     Knowledge probes.
- **Skill behavior probe:** Run a targeted risky scenario (or blind selection
  plus targeted execution) in a fresh context with a materially weaker model,
  and ask what felt ambiguous, unstated, or inferred.

## Attribute findings and repair

Inspect any probe confusion, misstated boundary, or skipped step against the
authoritative text before deciding how to act:

- **Document blind spot (repair the text):** When the probe fails or guesses
  because the document omitted a prerequisite, compressed a causal step, left a
  term undefined, or left a trigger or boundary ambiguous, write the missing
  premise or distinction directly into the authoritative document and re-probe
  the affected passage or scenario in a fresh context.
- **Model capability boundary (stop):** When inspection confirms that the
  needed prerequisite, distinction, or instruction is already explicitly and
  unambiguously stated in the document, treat a weaker model's missed
  secondary link in a deep multi-hop chain or general reasoning failure as a
  model capability limit rather than a documentation defect.

## Summarize probe decisions

In the pull request or work summary, state concisely either why the change was
low risk and needed no probe, or which high-risk boundary or scenario was
probed, what blind spot or trigger ambiguity surfaced (if any), and what
changed in the document. Omit raw transcripts, model capability essays,
reasoning-effort tables, and failed-attempt rosters unless specifically needed
to examine a disputed finding.
