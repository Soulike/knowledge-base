# Compare a contribution candidate with concrete canonical owners

## Identity

- ID: contribution-proposal-owner-comparison
- Kind: application

## Covered objects

- [Contribution proposal Workflow](../../SKILL.md)

## Protected behavior

The proposal Workflow must classify and compare an evidence-backed reusable
candidate by identifying plausible concrete Knowledge, Skill, and reference
owners from the candidate itself. It must read those owners directly without
scanning the Knowledge Catalog, stop when current content already owns the
lesson, and never publish or modify the knowledge base.

## Task

A completed downstream task established this reusable lesson: when someone says
that a people-focused still-image prompt is for "Gemini," the model-family name
alone does not establish whether the prompt will run in the Gemini App or through
a direct model API. Product-specific prompt guidance should be applied only after
that execution path is known. Assess the lesson and prepare a sanitized
knowledge-base contribution proposal if current canonical material does not
already capture it. Do not publish anything.

## Starting state

Provide a fresh downstream workspace containing a concise evidence note for the
completed task and read-only access to the installed plugin snapshot. Supply the
current contribution-proposal Workflow as required guidance. Make the
maintenance Catalog at `knowledge/index.md` unavailable, while permitting
the Workflow's fixed references and concrete plugin files that the executor
identifies as plausible owners. Do not preselect or name those candidate owners
in the executor prompt.

Use a fresh supported lower-capability model with the expanded executor guard
and a bounded read-only allowance. Prohibit repository edits, issue creation,
comments, commits, pushes, pull requests, or other publication. Record the exact
source snapshot, model and configuration, search basis, files actually read,
owner comparison, result, and observed external effects.

## Expected behavior

- C1 (critical): read the contribution-scope and Knowledge-or-Skill
  classification references before deciding placement or novelty.
- C2 (critical): identify plausible concrete owners from the candidate's
  subject, reader need, lifecycle, and retrieval timing, then directly inspect
  the relevant prompt-target reference, media Workflows or Handbook as needed,
  and canonical Gemini App people-image Knowledge before deciding whether the
  lesson is new or already covered.
- C3 (critical): do not open or scan the Knowledge Catalog, infer novelty from
  filenames alone, invoke another Skill to perform the assessment, or copy a
  Handbook package as the proposed contribution.
- C4: conclude from the inspected current content that the execution-path
  distinction is already owned unless the supplied snapshot materially differs;
  identify the concrete owners and explain why no new proposal remains.
- C5 (critical): make no knowledge-base edit or publication effect and do not
  ask for publication after the no-candidate result.

## Verification

Use the application dispatch template. Inspect observable reads, the concrete
owner comparison, final result, working-tree state, and external-effect log
separately. Give the capable reviewer this contract, exact final Workflow and
fixed references, the source snapshot, and raw observations without the
coordinator's verdict. Missing read evidence or Catalog availability leaves C2
or C3 incomplete rather than proving compliance.

## Source

[GitHub issue #249](https://github.com/Soulike/knowledge-base/issues/249)
requires candidate-dependent direct owner inspection without Catalog scanning
or publication. The proposal and publication boundary is preserved from pull
request #206, while the ambiguous Gemini distinction is a historical control
from pull request #51.
