# Knowledge-base contribution issue

Use this contract when preparing a public issue that proposes a reusable change
to the knowledge base. Prepare one issue for each contribution that maintainers
can evaluate independently.

Write a concise, project-independent title without a contribution prefix or
hidden identifier. Follow the canonical repository's language convention when
it is clear; otherwise use the user's language. Request the `needs-triage`
label.

Give the body exactly these semantic sections:

- `Proposed content`: state the reusable addition, correction, removal, rule,
  or workflow behavior in enough detail for maintainer evaluation without
  drafting the final maintained artifact.
- `Suggested category`: suggest Knowledge, Skill, Skill reference, or maintained
  Agent instruction or prompt, explain why it fits, and name the plausible
  categories when the distinction remains uncertain.
- `Evidence`: report established observations, sources or validation method,
  causal basis, material limits, and unresolved uncertainty.
- `Example`: give one sanitized, generalized scenario showing the problem and
  how the proposed content changes the relevant decision or result.

Write every section as sanitized, downstream-project-independent public text.
State concrete content rather than only a topic or an instruction to add
documentation. Keep sanitization choices private unless an omitted detail
materially limits the public evidence; describe that limit without exposing or
implying the removed value. Maintainer triage determines exact ownership,
artifact paths, repository operations, routing, and validation after
publication.
