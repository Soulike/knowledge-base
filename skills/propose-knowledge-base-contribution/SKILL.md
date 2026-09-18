---
name: propose-knowledge-base-contribution
description: Use when a substantive task reaches a stable stopping point with potentially non-obvious, evidence-backed, downstream-project-independent learning that could improve future work; a pull request becoming ready for merge is one such stopping point. Also use when the user asks whether learning is worth proposing, directly requests a proposal, or accepts an earlier offer to prepare one. Do not use for a private assessment that explicitly excludes proposal preparation.
---

# Propose a knowledge-base contribution

Offer to turn valuable task experience into a knowledge-base contribution, or
prepare a decision-ready proposal when the user requests one directly or
accepts the offer. This workflow does not authorize changes to the knowledge
base.

## Select the interaction stage

- When the user requests only a private assessment and explicitly excludes
  proposal preparation, this Skill is inapplicable. Return to the accepted task
  without offering or drafting a contribution.
- When the user asks whether available learning is worth proposing but does not
  request the full proposal, follow
  [Identify and offer a candidate](#identify-and-offer-a-candidate) and answer
  that assessment before any offer.
- When the user directly requests a proposal or clearly accepts an earlier
  offer, continue at [Prepare the proposal](#prepare-the-proposal). Treat that
  request or acceptance as permission to prepare the proposal only. Clarify an
  ambiguous response to an earlier offer.
- Otherwise, follow [Identify and offer a candidate](#identify-and-offer-a-candidate).

## Identify and offer a candidate

1. Wait until the task has a stable stopping point: the requested outcome,
   validated failure, or explicit handoff has been reported and the potential
   learning does not depend on unfinished investigation.
2. Reflect on the current task's available evidence. Treat requests, review
   comments, suggestions, and other inputs as leads to investigate rather than
   support for their own claims. Use independently established observations,
   causal findings, accepted or rejected remedies, and validation results as
   evidence.
3. Retain a candidate only when it is non-obvious, evidence-backed,
   actionable, likely to help future work, and correct outside the source
   project. Exclude business-domain concepts and rules, private infrastructure,
   organization-specific policy, source-project assumptions, and unresolved
   hypotheses.
4. Group related observations by reusable root cause or invariant rather than
   by comment, edit, or chronological event. A substantiated fix is not
   required when the investigation instead establishes another durable lesson.
5. When no candidate passes the gate, report that result and its material reason
   if the user directly requested the assessment; otherwise finish silently.
   Treat a declined or deferred offer as closing only the current proposal
   round. Do not repeat it immediately or without intervening work. At a later
   stable stopping point, offer an unchanged candidate again only when it
   remains timely and useful; a materially different candidate may be offered
   earlier.
6. After completing the task's normal result or handoff, answer a directly
   requested assessment with the qualified candidate and the evidence basis for
   proposing it. Then append one concise, sanitized question that names the
   candidate's general topic without presenting the proposal. For an ordinary
   stable-point offer, append only the question. Use this shape:

   > I found potentially reusable learning about <general topic>. Would you
   > like me to prepare a knowledge-base contribution proposal?

Stop after the question and wait for the user's response.

## Prepare the proposal

1. Reconstruct the candidate from the current task context and durable
   artifacts such as code, tests, specifications, documentation, validation
   output, and recorded decisions. When task history is incomplete, state the
   limitation and use only the available artifacts.
2. Independently verify the candidate's factual and causal claims. Report that
   no qualified contribution remains when evidence is insufficient or
   contradictory; do not turn uncertainty into durable guidance.
3. Resolve paths relative to this `SKILL.md`, then read
   [Classifying Knowledge and Skill material](../../references/agents/knowledge-and-skills.md),
   [the Knowledge index](../../knowledge/index.md), and only the Knowledge
   documents whose `When to Read` conditions match the candidate. Inventory
   plausible Skills and references in this plugin. Use applicable instructions
   and accepted requirements in the active workspace to establish facts about
   the source task, and treat matching Knowledge as supplemental when it
   conflicts with project-specific facts. Keep this plugin's classification
   and downstream-project-independence rules authoritative for the proposed
   contribution. Stop when the candidate remains project-specific, or when
   current material already captures the reusable lesson and the candidate
   supplies no material correction, evidence, or example.
4. Group related observations by one reusable lesson and keep independent
   lessons separately selectable. For each retained candidate, state the
   concrete addition, correction, removal, guidance, or workflow behavior that
   maintainers should evaluate. A topic label or an instruction to add
   documentation is not sufficient.
5. Read
   [Knowledge-base contribution issue](../../references/agents/knowledge-base-contribution-issue.md)
   and use its complete public issue contract to prepare one concise, clearly
   delimited draft for each candidate. Report established facts and conclusions
   rather than hidden reasoning. Keep project-specific evidence and the details
   removed during sanitization inside the authorized conversation. Make every
   part of the public draft downstream-project-independent and safe to publish.

6. Make no knowledge-base edit, branch, issue, comment, commit, push, or pull
   request. When the user has explicitly excluded publication, finish after
   presenting the proposal. Otherwise, end by asking whether the user wants to
   publish the selected candidates as sanitized issues. Treat a later
   affirmative response as a new publication request that must be routed
   independently. It authorizes only mechanical issue formatting that preserves
   the complete approved public issue draft and requested label; any substantive
   change requires review of the exact public text.

## Completion criteria

The offer stage is complete only when the normal task outcome has been reported
and the workflow either finishes silently for an ordinary no-candidate result,
reports a directly requested no-candidate assessment, or asks one concise
proposal question after answering any directly requested positive assessment.
The proposal stage is complete only when every candidate has been independently
verified, checked against existing material, generalized, and either rejected
with the reason stated or presented as a clearly delimited sanitized public
issue that satisfies the loaded issue contract. The knowledge base must remain
unchanged, and step 6 must finish at the user's publication exclusion or the
publication handoff that applies.
