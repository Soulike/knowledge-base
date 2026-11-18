# Verify reader understanding

## Scope

Use this procedure to verify reader understanding for new or substantively
changed documentation, Knowledge, Skills, and Skill references when a consuming
workflow, project policy, or risk assessment calls for independent or
cross-model reader validation. Purely mechanical edits require only confirmation
that meaning, structure, and required reader actions are unchanged.
Assessment-only work retains the consuming workflow's read-only boundary; this
verification procedure does not by itself authorize edits.

## When to update

Update this reference when verification outcomes reveal missing prerequisites,
model-comparison rules, observation requirements, or resolution steps for
testing whether intended readers can understand and apply maintained content.

## Prepare independent observations

1. **State the reader task and foundation.** Identify the reader's recurring
   task and necessary subject foundation, covering humans who know the stated
   prerequisites without authoring history and Agents with different
   background knowledge and comprehension abilities. Identify the final
   artifacts and permitted reading routes; keep authoring history out of the
   prerequisites.
2. **Select the comparison and reader models.** Identify the comparison model
   for the evaluated task: when one or more models materially authored the
   behavior or explanation, use the most capable of them for that task; for
   human-only authorship, use the most capable supported model available to the
   authoring environment. Record the comparison model, the basis for selecting
   it, and exposed capability-relevant configuration such as reasoning effort.
   Run cross-model reader verification with a different supported model that is
   materially less capable for the task while retaining the tools, modalities,
   and context the task requires. Justify that baseline from task-relevant
   capability evidence rather than model name or price; a lower reasoning
   setting on the same model is insufficient. Unavailable required cross-model
   evidence leaves cross-model verification incomplete.
3. **Reuse capable review and sufficient runs.** Reuse an independent capable
   reviewer (such as a consuming workflow's suitability and semantic reviewer)
   for the capable explanation examination below when it can perform it. A
   lower-capability behavioral run on the same final content may also supply
   reader-understanding evidence when it contains every observation required
   below; obtain missing observations through a neutral follow-up rather than
   repeating an otherwise sufficient run.

## Examine the explanation

4. **Examine prerequisites, abstractions, and reasoning.** Have the capable
   reviewer actively look for hidden prerequisites, unexplained abstractions,
   and omitted reasoning. Trace who acts, what they act on, why the action
   follows, and what decision or result it supports. Check whether terms are
   explained before use, related or recurring terms are introduced early
   enough, and definitions avoid relying on other unexplained abstractions.
5. **Check examples from starting knowledge.** Verify that examples supply the
   situational context and unfamiliar domain terms needed to understand each
   choice or result, resolve plausible ambiguity, and preserve intended
   meaning when clearer wording or organization is proposed.
6. **Observe a fresh lower-capability reader.** Using the fresh-context
   isolation, inherited-boundary recording, evaluator-only withholding,
   canonical executor instructions guard, and application dispatch mechanics in
   [Agent behavioral evaluation](behavioral-evaluation.md), give the materially
   less capable reader model the active instructions, reader task, final
   artifacts (with exact source snapshot identity), and permitted reading
   routes without author conclusions, review findings, or expected answers.
   Require the reader to provide all three observations:
   - **Paraphrase:** explain the central rules and their reasoning in its own
     words;
   - **Application:** apply the content to a realistic situation requiring a
     consequential distinction, stating concrete application decisions; and
   - **Confusion report:** identify unclear terms, missing premises, ambiguity,
     uncertainty, or guessed meaning.
     A statement or claim that the document is understandable is insufficient
     evidence.
7. **Record and compare observations.** Record the actual reader paraphrase,
   concrete application decisions, and reported confusion or ambiguity tied to
   the passages they concern. Compare them with the artifact's intended meaning
   and task requirements. Keep reader understanding, semantic correctness, and
   overall suitability as distinct conclusions. Agent observations provide
   evidence about these tasks, not proof that all human readers will succeed.

## Resolve and repeat

8. **Investigate before attributing cause.** Investigate incorrect, incomplete,
   or hesitant responses before assigning cause. Locate the relevant passage
   and assess whether it supplies the necessary premises to a reader with the
   stated foundation, verifying that assumed prerequisites follow from the
   reader's task. Use targeted, neutral follow-up prompts or another
   independent observation when one failure cannot distinguish a document gap
   from task demands beyond the reader model's capabilities.
9. **Repair authoritative reader-facing content.** Write confirmed document
   gaps into the authoritative reader-facing content within the authorized
   scope by adding prerequisites, causal explanations, definitions, or
   contextual examples, or by reorganizing scattered conditions. An explanation
   supplied only in a review reply or work note does not repair the document
   for later readers. Report out-of-scope repairs as a limitation without
   silently expanding scope or claiming the issue resolved.
10. **Repeat affected checks and retain attempts.** After repairs, repeat
    affected observations against the revised artifacts in a fresh context
    without earlier answers or corrective coaching, retaining all attempts per
    [Agent behavioral evaluation](behavioral-evaluation.md). Finish cross-model
    verification only when required cross-model evidence exists and confirmed
    document gaps are resolved; report unresolved material uncertainty or
    missing cross-model evidence as incomplete. Retain legitimate explicit
    capability and stopping paths as robustness observations; those stops do not
    substitute for missing paraphrase, application, or confusion observations.

## Required evidence

Record and preserve the complete observation set in the handoff or pull-request
evidence without collapsing it into topic-only notes or aggregate pass claims:

- the reader task, stated prerequisites, permitted reading routes, and final
  source snapshot;
- the comparison model and lower-capability reader model identities, exposed
  provider and capability-relevant configuration (such as reasoning effort),
  inherited context limits, and task-relevant capability-comparison basis;
- the actual reader paraphrase, concrete application decisions, and reported
  confusion or ambiguity observations tied to the relevant passages, with the
  producing executor identity and configuration adjacent to each observation;
- the capable explanation-review findings and distinct understanding,
  suitability, and semantic correctness conclusions; and
- all material failed, contaminated, superseded, or incomplete attempts with
  their adjacent executor identities, configurations, dispositions, and
  remaining limitations.
