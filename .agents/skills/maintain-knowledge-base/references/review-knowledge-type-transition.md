# Review an evergreen-to-time-sensitive transition

Use this procedure when a contribution, maintenance proposal, or review finding
would change an existing Knowledge leaf from `evergreen` to `time-sensitive`,
including correction of an existing misclassification. It supplies evidence for
[Maintain Knowledge](maintain-knowledge.md); that workflow owns the disposition,
authorized edits, and validation.

## Establish what would become stale

1. Keep the trusted pre-edit Scope, body, Catalog type, reading routes, and
   consumers as the comparison baseline. Read them alongside the complete
   proposed claims or correction, supporting evidence, and concrete reader
   tasks. A proposed Scope expansion cannot establish its own ownership or
   justify the type change.
2. Apply the canonical [Knowledge Type definitions](maintain-knowledge.md#catalog-fields)
   to each affected substantive claim with all necessary conditions intact.
   Name the externally maintained fact and an ordinary external change that
   could make the claim false while its maintained Scope stays fixed. Tie that
   possibility to evidence about the asserted contract or dependency; the
   presence of a platform, runtime, version, or condition alone is insufficient.
3. Distinguish a condition ceasing to hold from the conclusion becoming false
   while the condition still holds. For example, “if a launch interface joins
   array elements into command-line text, the array shape alone does not
   establish the child's argument boundaries” remains correct when an interface
   changes to another transport. That interface then falls outside the
   condition. By contrast, “Launcher L's current release joins array elements”
   asserts current external behavior that a later release can invalidate.
   Inspect asserted facts inside qualifiers too: qualifying a claim does not
   automatically make it evergreen.

If no evolving dependency is established, the proposed transition is unsupported.
Retain a justified evergreen classification, or report the missing premise and
investigate before settling the type. Uncertainty is not evidence for either
label and does not freeze unrelated work.

## Reassess the owner before changing metadata

When an evolving dependency is established, reopen the
[ownership and retrieval assessment](maintain-knowledge.md#ownership-and-generalization)
before selecting a destination or operation. Compare the old explanation and
reader decision with the complete proposed result. A correct type for a mixed
leaf does not establish that its contents belong together.

Use that assessment to distinguish these dispositions:

- **Retain evergreen:** the supported complete claims remain durable; the
  conditions determine applicability without asserting evolving external facts.
- **Separate responsibilities:** a durable principle and an evolving mapping
  each satisfy the independent responsibility, reading-need, maintenance-trigger,
  and standalone-substance tests. Retain the principle's evergreen owner and
  give the mapping an appropriate time-sensitive owner. Assess direct reading
  routes separately; arrival through one Handbook does not merge ownership.
- **Correct the existing owner to time-sensitive:** the evolving facts already
  serve the same coherent responsibility and reader question. Preserve that
  owner and correct its type, including when its old label was mistaken.

These are supported outcomes, not a preference for keeping evergreen or for
splitting. A platform example may belong with a general principle when the
ownership tests support that result; classify the resulting leaf's actual
claims. Preserve supported reader needs and necessary conditions in every
disposition. Do not defend evergreen by deleting useful facts, weakening claims,
removing qualifiers, widening Scope, or manufacturing another owner. Abstract
illustrative detail only when the supported reader need remains satisfied.

## Return a reviewable conclusion

Return the before/proposed types, complete qualified claims, evidence and
invalidation scenario (or why only applicability changes), ownership comparison,
retained claims, proposed owners and reading routes, and remaining uncertainty.
Identify evidence that is missing rather than claiming settled ownership,
observed selection, or runtime behavior from a plausible plan.

Carry this account into the parent workflow's work record and final review.
Resume that workflow with the supported disposition; this procedure does not
create separate edit authority or a new approval gate.
