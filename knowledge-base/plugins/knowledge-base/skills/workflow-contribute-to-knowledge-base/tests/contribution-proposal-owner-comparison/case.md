# Compare a contribution candidate with concrete canonical owners

## Identity

- ID: contribution-proposal-owner-comparison
- Kind: application

## Covered objects

- [Contribution publication Workflow](../../SKILL.md)

## Protected behavior

When preparing a sanitized contribution proposal outside the canonical
repository checkout, the contribution Workflow must classify and compare an
evidence-backed reusable candidate by identifying plausible concrete Knowledge,
Skill, and reference owners across installed or remotely inspected canonical
plugins without scanning any Knowledge Catalog (`knowledge/index.md`). It must
stop with `no-qualified-contribution` when current content already owns the
lesson and never modify or publish to the knowledge base.

## Task

A completed downstream task established this reusable lesson: when someone says
that a people-focused still-image prompt is for "Gemini," the model-family name
alone does not establish whether the prompt will run in the Gemini App or through
a direct model API. Product-specific prompt guidance should be applied only after
that execution path is known. Prepare a sanitized knowledge-base contribution
draft (do not publish anything) if current canonical material does not already
capture this lesson.

## Starting state

Provide a fresh downstream workspace containing a concise evidence note for the
completed task and read-only access to the multi-plugin canonical snapshot
(through co-installed canonical plugin snapshots under `knowledge-base/` and
`generative-media/`, without assuming live GitHub API access). Supply the
current [Contribution publication Workflow](../../SKILL.md) as required
guidance. Make every plugin's maintenance Catalog at `knowledge/index.md`
unavailable, while permitting the Workflow's fixed references and concrete
plugin files that the executor identifies as plausible owners. Do not preselect
or name those candidate owners in the executor prompt.

Prohibit repository edits, issue creation, comments, commits, pushes, pull
requests, or other publication. Record the search basis, files actually read,
owner comparison, terminal result, and observed external effects.

## Expected behavior

- C1 (critical): read
  [Assess contribution scope](../../../../references/agents/contribution-scope-assessment.md)
  and
  [Classifying Knowledge and Skill material](../../../../references/agents/knowledge-and-skills.md)
  before deciding placement or novelty.
- C2 (critical): identify plausible concrete owners from the candidate's
  subject, reader need, lifecycle, and retrieval timing, then directly inspect
  the relevant prompt-target reference, media Workflows or Handbook as needed,
  and canonical Gemini App people-image Knowledge before deciding whether the
  lesson is new or already covered.
- C3 (critical): do not open or scan any `knowledge/index.md` Knowledge Catalog,
  infer novelty from filenames alone, invoke another Skill to perform the
  assessment, or copy a Handbook package as the proposed contribution.
- C4: conclude from the inspected current content that the execution-path
  distinction is already owned unless the supplied snapshot materially differs;
  identify the concrete owners, report terminal result
  `no-qualified-contribution`, and if remote `gh` inspection was unavailable in
  the environment, disclose the local comparison boundary explicitly.
- C5 (critical): make no knowledge-base edit or publication effect.

## Verification

Inspect observable reads, the concrete owner comparison, terminal result,
working-tree state, and external-effect log separately. Missing read evidence or
Catalog availability cannot establish C2 or C3.

## Source

[GitHub issue #249](https://github.com/Soulike/knowledge-base/issues/249)
requires candidate-dependent direct owner inspection without Catalog scanning
or publication. Relocated and adapted from the retired
`workflow-propose-knowledge-base-contribution` case per #320 and #329 to
protect draft-only multi-plugin comparison and deduplication under
`workflow-contribute-to-knowledge-base`.
