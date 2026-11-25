# Audit and improve existing documentation

Use this procedure when selected by
[Select the maintenance path](../SKILL.md#select-the-maintenance-path) for an
open-ended audit or quality improvement.

## Set the review scope

1. Use the user's requested scope, actions, and order when specified. Otherwise
   inspect the whole target and use the default sequence below.
2. Review coherent units of meaning. Keep a rule together with the rationale or
   example needed to understand and apply it.
3. Establish whether the requested result is an assessment or an authorized
   revision. Keep assessment-only work read-only.
4. When edits are authorized, use the agreed findings as the scope. Report
   newly discovered problems and unresolved project choices before expanding it.

## Assess the content and structure

Unless the user requested a different order, assess deletion, correction, and
placement in that order before deciding whether to edit:

1. **Delete.** Evaluate complete removal first. Retain the document or an
   individual unit only when current evidence supports an ongoing need. Select
   the rest for removal. Defer a decision only when correctness or form must be
   established before necessity can be judged, and resolve it in the relevant
   later stage. Apply the loaded documentation guidance's boundary between
   authoring evidence and reader-facing content; material that only records how
   the document was produced belongs in its owning work record unless the
   maintained document explicitly owns that traceability.
2. **Correct.** Check every surviving factual claim and reader obligation
   against its authority, intended scope, and reader need. Evaluate the basis
   of existing requirements before preserving them, including promises that
   examples or other artifacts stay synchronized. Distinguish interface
   obligations from recommendations and recipe-specific choices. Classify each
   claim as **Keep**, **Correct**, **Delete**, or **Unverified**, and establish
   the intended meaning of each correction or deletion. Keep uncertain claims
   unresolved. When confusion exposes a design problem, report it within scope;
   retain explanations of necessary complexity. When the retained content's
   useful role is routing readers to scattered authorities, select a focused
   source index to replace copied explanations.
3. **Structure.** Assess the complete proposed result after the selected
   deletions and corrections, including its reader tasks and routes. State the
   structural judgment in a work update using
   [Keep revisions coherent](../../../knowledge/documentation/maintained-document-quality.md#keep-revisions-coherent).
   Determine which resulting responsibilities belong together and the fitting
   destinations and navigation. Record unresolved choices for an assessment;
   resolve choices required by an authorized revision before editing. For
   purely mechanical edits, confirm that meaning and structure are unchanged
   without a full structural assessment.
4. Branch by task authority:
   - For an assessment-only request, report every finding with its supporting
     evidence, disposition, reader impact, proposed action, structural
     judgment, proposed destinations or routes, unresolved decisions, and
     investigation/validation limits, identifying unverified claims and
     incomplete investigation rather than presenting them as established
     findings or completed repairs, then stop at
     [Report and complete](../SKILL.md#report-and-complete) without applying
     revisions or claiming remediation.
   - When revision is authorized and its required choices are resolved, proceed
     to **Apply and reconcile** and **Verify the result** below within the
     agreed scope. Apply the existing scope boundary to newly discovered
     problems and unresolved project choices.

## Apply and reconcile

1. Apply the selected deletions, corrections, rewrites, splits, and moves as one
   coherent revision of the complete affected content. Complete the necessary
   rewrite within the agreed scope regardless of diff size, while preserving
   meaning outside the accepted semantic change.
2. Update the affected-artifact set (loading matching active-project
   instructions and standards for any newly added artifact) and reconcile every
   affected heading, link, index, prompt, example, comment, document, Agent
   instruction, Skill, and navigation entry.
3. When the composed result, new requirements, or feedback invalidate the
   structural judgment, return to
   [Assess the content and structure](#assess-the-content-and-structure) and
   reconsider the cumulative revision before further editing.

## Verify the result

1. Compare the original target with the final affected artifacts. Account for
   every agreed finding and verify there is no unintended change in meaning,
   strength, scope, conditions, rationale, or exceptions, and that moves and
   source indexes preserve access from each original reader starting point.
2. Perform a thorough self-check of the final content and required routes
   against
   [Maintained document quality](../../../knowledge/documentation/maintained-document-quality.md#validate-the-result)
   and, when covering software behavior, interfaces, operations, decisions, or
   source commentary,
   [Software-development documentation](../../../knowledge/documentation/software-development-documentation.md).
   Check factual pointers against their authoritative sources and search for
   stale terminology, competing explanations, broken routes, and authoring-only
   material. When a revision meets the high-risk criteria in
   [Verify reader understanding](../../../references/agents/reader-understanding.md#assess-probe-risk),
   run a lightweight probe to uncover hidden prerequisites or trigger
   ambiguities and repair confirmed gaps in the text. Return an unsuitable
   result to
   [Assess the content and structure](#assess-the-content-and-structure)
   before finishing.
3. Run the project's applicable deterministic checks (such as formatter, link
   or anchor checks, and documentation validation). Treat a failed or
   unavailable required check as an incomplete result.

Return the reconciled findings, affected-artifact account, self-check summary,
any probe findings and repairs, and check results to
[Report and complete](../SKILL.md#report-and-complete), leaving any downstream
review to the active environment's workflow.
