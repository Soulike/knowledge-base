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

A requested side effect that an Agent declares without holding the credential
that can perform it. A separate trusted boundary validates and applies the
request with only the permissions required for that operation.

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

An explicit decision from a trusted maintainer about a previously reported
finding. It constrains later Agents when the same finding and premises recur,
but it does not override materially changed evidence or repository behavior.

### Subject identity

The immutable revision, pull-request head, or other exact artifact that an
Agent inspected. Later publication and gate decisions compare their current
subject with this identity instead of reconstructing it from mutable state.
