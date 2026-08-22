# Agent run state and reruns in GitHub Actions

## Scope

This document defines state and handoff invariants for GitHub Actions workflows that ask an Agent to inspect a selected subject and then validate or publish the Agent's result in later steps, jobs, or rerun attempts. It owns the relationships among subject identity, declared capabilities, target coverage, structured results, artifacts, execution attempts, and publication identity across those boundaries.

## When to update

Update this document when a real multi-stage or rerun failure exposes an unhandled subject substitution, prompt/runtime mismatch, incomplete result, artifact mix-up, repeated publication, or partial-publication recovery case within this scope, or when stronger evidence changes one of these invariants.

## Define one run contract

Treat the Agent invocation and every consumer of its result as participants in one run contract. Before launching the Agent, the workflow establishes:

- the immutable identity of the subject being inspected;
- the complete set of targets the Agent must account for;
- the repository, network, history, and remote-service capabilities available to it;
- the result states and structured output accepted downstream; and
- the later operation that will consume each accepted state.

Render the prompt from this contract and give its other consumers the same values. Do not let the prompt, launcher, validator, artifact producer, and publisher independently reconstruct the subject or target set from a moving branch, ambient workspace, or current remote state. Agreement by convention is weaker than carrying and checking the same identity at each boundary.

## Keep the prompt and runtime truthful

The prompt must describe the environment the runner actually provides. State which revision is visible, whether repository history exists, which local and remote operations are available, and whether the Agent may cause side effects. Configure the launcher to expose that same capability set.

A prompt that requires unavailable evidence makes a complete result impossible. A runtime capability that the prompt does not account for makes the Agent's operating boundary ambiguous. Change the prompt and launcher together when the capability contract changes; current command flags and tool names remain executable configuration rather than facts to copy into this document.

## Validate one complete result

Make the result identify its subject and scope, then compare both with the run contract. Require exactly one result for every target and reject missing, duplicate, or unknown targets. Define the allowed fields for each result state so that a success, required change, inconclusive review, and execution failure cannot be mistaken for one another.

Use one canonical validator whenever model output or a transferred artifact is deserialized. Recheck the subject, scope, complete target coverage, exact shape, and state invariants rather than transferring trust from an earlier process. Within one validation boundary, downstream consumers should receive the validated representation instead of reinterpreting raw model text or applying a second, weaker version of the contract.

These checks establish only that the result satisfies those properties. Before causing a side effect, the component that owns it must independently authorize both the operation and its destination at that sink.

## Carry producer-selected state across jobs

The job that selects and inspects the subject owns the resulting subject identity. Export that identity together with the artifact identity, and embed the subject and scope inside the artifact itself. A consuming job retrieves the named artifact, establishes which subject it is operating on, and compares the artifact metadata with the producer-selected values before using the result.

When the producer cannot supply a validated result, route the consumer through an explicit execution-failure path. A fallback checkout may provide trusted tooling for reporting that failure, but it must not turn a missing producer identity or artifact into a result attributed to a different subject.

## Give each identity one purpose

Several identifiers can coexist in a rerunnable workflow, but they answer different questions:

| Identity             | Question it answers                                             |
| -------------------- | --------------------------------------------------------------- |
| Subject identity     | Which immutable content or change did the Agent inspect?        |
| Execution identity   | Which concrete invocation or rerun attempt produced evidence?   |
| Artifact identity    | Which attempt-local handoff object should a consumer retrieve?  |
| Publication identity | Which external effect should a retry recognize as already done? |

Choose publication identity from the semantics of the effect. Some effects belong to one concrete attempt and should include its execution identity. Others represent one logical result for a subject, scope, and target and should remain stable when the same run is retried. Do not reuse an attempt-local artifact name as a publication key unless the external effect is intentionally attempt-specific.

## Make partial publication resumable

A workflow can fail after publishing some units but before publishing the rest. Give each independently publishable unit a durable publication identity, include that identity in the owned external effect, and check the current destination before retrying it. A rerun can then skip effects already completed for the same identity and continue with the unpublished units.

Keep this replay check separate from semantic deduplication. Semantic deduplication decides whether a current external item already represents the same finding; replay detection decides whether this workflow already performed the selected create or update. Both decisions may inspect the same destination, but they answer different questions and need not use the same identity.
