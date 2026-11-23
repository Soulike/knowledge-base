# Write or update from a known need or software change

Use this procedure when selected by
[Select the maintenance path](../SKILL.md#select-the-maintenance-path) for a
known documentation or Skill need or for software-change impact.

## Account for documentation impact

1. For a change-driven task, inventory every changed file. Identify the meaning
   changed by each file, or record that it has no documentation impact.
2. For every changed meaning or identified information need:
   - record the current meaning and the recurring tasks that depend on it;
   - locate the source that defines or enforces it;
   - trace it into every affected document, comment, example, index, prompt,
     Agent instruction, Skill, enforcement mechanism, and item of evidence; and
   - record the required update or a concrete no-impact conclusion.
3. Maintain the complete set of affected artifacts. Whenever the set expands,
   load the active project's matching instructions and standards for each new
   artifact, then repeat the impact trace from that artifact's perspective.
4. Finish the impact account only when every changed file, changed meaning, and
   identified information need has a disposition. The absence of a
   documentation diff is not a disposition.

## Decide the response and structure

1. Apply the loaded documentation guidance to choose one response for each
   information need: make no documentation change, update an existing document,
   create the lightest fitting form, or report a required project decision that
   remains unresolved. Determine whether reader confusion needs information or
   exposes a design problem; report design findings within the authorized scope
   while retaining explanations of necessary complexity.
2. Establish the basis and scope of reader obligations, recommendations, and
   example-specific choices. Identify the project decisions required by the
   chosen response, including any promise to keep artifacts synchronized.
   Record unresolved decisions for an assessment; resolve those required by an
   authorized delivery before drafting.
3. Assess the complete proposed result for the selected responses, including
   its reader tasks and routes. State the structural judgment in a work update
   using
   [Keep revisions coherent](../../../knowledge/documentation/maintained-document-quality.md#keep-revisions-coherent)
   for the complete affected content. Resolve whether to retain or reshape its
   organization before selecting insertion points. For purely mechanical edits,
   confirm that meaning and structure are unchanged without a full structural
   assessment.
4. Branch by task authority:
   - For an assessment-only request, report each impact disposition and
     selected response with its supporting evidence, proposed action, fitting
     form and destination when applicable, and unresolved decisions, plus the
     structural judgment and investigation/validation limits, then stop at
     [Report and complete](../SKILL.md#report-and-complete) without editing or
     claiming remediation.
   - When delivery is authorized and its required project decisions are
     resolved, proceed to **Write and reconcile** and **Verify the result**
     below.

## Write and reconcile

1. Apply the selected structure and matching project standards to write each
   resolved target as one clear current account. Complete the necessary rewrite
   within the authorized responsibility boundary regardless of diff size, while
   preserving meaning outside the accepted semantic change.
2. Apply the loaded documentation guidance's boundary between authoring
   evidence and reader-facing content. Treat research, source collection,
   review evidence, rejected alternatives, drafts, and task history as working
   inputs; carry them into a maintained target only when they serve its
   reader-facing responsibility.
3. Reconcile every affected document, comment, example, index, prompt, Agent
   instruction, Skill, link, and navigation entry. When a documented invariant
   changes, reconcile its enforcement and evidence as well.
4. When the composed result, new requirements, or feedback invalidate the
   structural judgment under the loaded documentation guidance's criteria,
   return to [Decide the response and structure](#decide-the-response-and-structure)
   and assess the cumulative revision before further editing.

## Verify the result

1. Account for every changed file, changed meaning, information need, impact
   finding, and affected artifact. Confirm that each has the recorded
   disposition.
2. For every new or changed claim, record the assertion, its owning source and
   location, and the meaning and scope that source establishes in the work
   record. Distinguish intended contract, observed implementation behavior, and
   inference; for an inference, identify the evidence and reasoning that
   support its substance. Names or observed value propagation alone do not
   establish undeclared behavior or intent. Declarations and passing examples
   establish only the facets they actually define or exercise. Compare the
   final wording, including what it teaches a reader to do or expect, with that
   source-based account. Retain a claim only when evidence supports its
   substance and scope; qualifiers may express supported uncertainty but cannot
   supply missing evidence or turn an unsupported assertion into a valid
   interpretation. Omit unsupported factual or instructional claims and report
   the evidence gap, validation limit, or required project decision. Do not
   invent meaning to make the document appear complete. Leave delivery
   incomplete when the remaining gap prevents the promised reader result.
   Confirm that every described claim agrees with its authority in meaning and
   scope, every mandatory mechanism has a basis beyond its desired outcome, and
   examples preserve choices the underlying contract permits.
3. Apply the loaded documentation guidance's
   [suitability review](../../../knowledge/documentation/maintained-document-quality.md#validate-the-result)
   and risk-proportionate reader validation to the complete final content and
   required routes. When active project policy, an applicable Skill contract,
   or document risk requires independent or cross-model reader-understanding
   verification on new or substantively changed content, follow
   [Verify reader understanding](../../../references/agents/reader-understanding.md)
   and record its required observations and any remaining limits; do not force
   cross-model runs for low-risk edits when active project rules do not require
   them. Record the reader task, relevant locations, and outcome separately
   from semantic correctness. Return an unsuitable result to
   [Decide the response and structure](#decide-the-response-and-structure)
   before claiming delivery complete. Confirm that no unexplained competing copy
   or authoring-only material remains.
4. Check every changed route from the reader's starting point. Confirm its label
   or condition lets the reader choose the destination before opening it.
   Search for stale terminology, paths, headings, examples, prompts, and
   superseded prose.
5. Run the project's formatter, link or anchor checks, Skill validation, and
   other applicable checks. Treat a failed or unavailable required check as an
   incomplete result.

Return the final impact and affected-artifact account, suitability review,
reader-understanding observations when required, reconciled routes, and check
results to [Report and complete](../SKILL.md#report-and-complete).
