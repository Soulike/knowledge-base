# Domain documents

This repository has separate maintenance and plugin contexts. Before designing
or implementing a change, read the [glossary map](../../GLOSSARY-MAP.md), then
the glossary and applicable architectural decisions for each affected context.

Root [architectural decisions](../adr/) govern repository-wide development,
automation, distribution, and package boundaries. Each plugin owns its domain
vocabulary and any plugin-specific design documents or ADRs within its own
package. Create those documents only when terms or decisions need an owner.

Use canonical terms in issues, specifications, tests, code, and documentation.
Use domain modeling when required terms are missing or conflict. Keep glossary
entries about domain concepts rather than implementation details.

An ADR records why a consequential tradeoff was selected. Surface a conflict
with an accepted decision rather than silently overriding it. Current
implementation and operational documentation own present behavior.
