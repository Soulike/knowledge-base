# Domain documents

This repository uses one domain context.

Before designing or implementing a change, read the root
[`CONTEXT.md`](../../CONTEXT.md) and the applicable records under
[`docs/adr/`](../adr/). Proceed silently when no glossary entry or decision
applies.

Use the glossary's canonical terms in issues, specifications, tests, code, and
documentation. When a required concept is absent or existing terms conflict,
use domain modeling to resolve the vocabulary before extending it.

Treat an architectural decision record as the historical owner of why a
hard-to-reverse tradeoff was selected. Surface a conflict with an accepted ADR
instead of silently overriding it. Current implementation and operational
documentation still own the coherent present behavior.
