# Domain context

## Glossary

### Agentic workflow runtime

The shared execution substrate that runs an Agent in GitHub Actions. It owns
engine lifecycle, sandboxing, network and tool access, retry boundaries, and
the transport from Agent decisions to authorized side effects. It does not own
the meaning of a particular review or maintenance task.

### Task contract

The task-specific agreement among a workflow trigger, the subject the Agent
must inspect, the evidence it may use, its accepted completion states, and the
effect of each state. Content verification and pull-request review have
different task contracts even when they use the same Agentic workflow runtime.

### Safe output

A typed result or requested side effect that an Agent declares without holding
the credential that can publish it. A separate trusted boundary validates the
result and applies any authorized operation with only the required permissions.

### Publication gate

A trusted deterministic check that authenticates a published effect against
the task contract and current subject before converting it into repository
state or a required status conclusion. A successful transport does not by
itself satisfy a publication gate.

### Review knowledge

Trusted criteria and repository understanding loaded for an Agent to apply
during a review. Review knowledge may intentionally follow its current source,
while the runtime that executes it remains fixed and reviewable.

### Historical disposition

An explicit decision recorded by a trusted repository collaborator in a closed
issue about a previously reported finding. It constrains later Agents when the
same finding and premises recur, but it does not override materially changed
evidence or repository behavior. An open issue, closure alone, or a reply from
an untrusted author is not a historical disposition. A usable disposition
states that no content modification is needed, explains the basis for treating
the information as valid, and identifies when it must be verified again; that
trigger may be a time or another observable event. A maintainer who resolves
the issue by modifying or deleting the current content changes the next
verification subject instead of creating a historical disposition.

### Verification inconclusive

A successful content-verification result in which the Agent completed the
required analysis but the available evidence cannot confirm or invalidate a
finding. When it remains after issue-history comparison, it creates a
human-owned issue without making the workflow fail. It is distinct from
incomplete execution, where the Agent could not perform the required analysis.

### Verification target

One canonical maintained-content responsibility reviewed at an exact subject
identity. A workflow selects its primary review targets from a repository-wide
catalog at that identity; another catalog target is related only when the same
coherent remediation affects that responsibility too.

### Verification finding

One current content defect or unresolved verification question whose evidence,
affected targets, and acceptance outcome form a coherent remediation decision.
One finding may affect several verification targets, but it is not split merely
to produce one issue per target.

### Subject identity

The immutable revision, pull-request head, or other exact artifact that an
Agent inspected. Later publication and gate decisions compare their current
subject with this identity instead of reconstructing it from mutable state.
