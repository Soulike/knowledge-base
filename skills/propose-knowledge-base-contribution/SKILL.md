---
name: propose-knowledge-base-contribution
description: Use when a substantive task reaches a stable stopping point with potentially non-obvious, evidence-backed, downstream-project-independent learning that could improve future work; a pull request becoming ready for merge is one such stopping point. Also use when the user directly requests or accepts an earlier offer to prepare a knowledge-base contribution proposal.
---

# Propose a knowledge-base contribution

Offer to turn valuable task experience into a knowledge-base contribution, or
prepare a decision-ready proposal when the user requests one directly or
accepts the offer. This workflow does not authorize changes to the knowledge
base.

## Select the interaction stage

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
5. Finish silently when no candidate passes the gate. Treat a declined or
   deferred offer as closing only the current proposal round. Do not repeat it
   immediately or without intervening work. At a later stable stopping point,
   offer an unchanged candidate again only when it remains timely and useful;
   a materially different candidate may be offered earlier.
6. After completing the task's normal result or handoff, append one concise,
   sanitized question that names the candidate's general topic without
   presenting the proposal. Use this shape:

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
   relevant Skills and references in this plugin. Use applicable instructions
   and accepted requirements in the active workspace to establish facts about
   the source task, and treat matching Knowledge as supplemental when it
   conflicts with project-specific facts. Keep this plugin's classification
   and downstream-project-independence rules authoritative for the proposed
   contribution; record project-specific conflicts as details to strip.
4. Compare each candidate's responsibility, consumers, retrieval or invocation
   trigger, and maintenance lifecycle with existing material. Compare making no
   contribution, deleting, rewriting, adding, merging, splitting, and moving
   the affected material, and complete this comparison before proposing any
   content addition. Prefer maintaining an existing owner; propose a new
   Knowledge document, Skill, or Skill reference only when no existing artifact
   owns the responsibility.
5. Merge candidates that share one reusable cause and discard weak or
   redundant candidates. Keep independent candidates separately selectable.
6. Present a decision-ready proposal for every retained candidate:
   - the established experience and supporting evidence;
   - the generalized lesson and why it should improve future work;
   - the proposed classification, the complete responsibility affected, and the
     operation: delete, rewrite, add, merge, split, move, or create an artifact;
   - a concrete title, reading or invocation trigger when applicable, and the
     proposed final reusable content and structure in draft form rather than
     only an outline;
   - the project-specific details removed from the reusable content; and
   - uncertainties, exclusions, or limits that the contribution must preserve.
7. Separate that private authoring evidence and removal record from a clearly
   delimited sanitized public proposal. Give the public proposal its exact
   public title, evidence, complete reusable content and structure, possible
   ownership and operation, limits and uncertainty, and requested maintainer
   outcome, together with the requested `needs-triage` label. Report evidence
   and conclusions rather than hidden reasoning. Keep project-specific evidence
   inside the authorized conversation; make every part of the delimited public
   proposal downstream-project-independent and safe to publish.
8. Make no knowledge-base edit, branch, issue, comment, commit, push, or pull
   request. End by asking whether the user wants to publish the selected
   candidates as sanitized issues. Treat a later affirmative response as a new
   publication request that must be routed independently. It authorizes only
   mechanical issue formatting that preserves the delimited public proposal's
   claims, disclosures, links, evidence, exclusions, and uncertainty, together
   with its requested `needs-triage` label; any substantive change requires
   review of the exact public text.

## Completion criteria

The offer stage is complete only when the normal task outcome has been reported
and the workflow either remains silent because no candidate qualifies or asks
one concise proposal question. The proposal stage is complete only when every
candidate has been independently verified, compared with existing material and
non-additive alternatives, classified, generalized, assigned a concrete
operation, and either rejected with the reason stated or presented with its
separate private authoring evidence and clearly delimited sanitized public
proposal. Every retained public proposal must satisfy steps 6 and 7, and the
publication handoff in step 8 must be made while the knowledge base remains
unchanged.
