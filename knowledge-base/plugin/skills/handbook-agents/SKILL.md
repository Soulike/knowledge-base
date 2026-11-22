---
name: handbook-agents
description: Use when designing, implementing, reviewing, diagnosing, or understanding AI agent architectures, LLM tool calling, or Model Context Protocol (MCP) server development, excluding client-host configuration.
---

# Agents handbook

This domain Handbook routes the curated AI agent engineering guidance currently
available in this plugin. Its coverage is intentionally non-exhaustive. It owns
required-reading selection, not the procedure or completion of the user's task.
Resolve every packaged link relative to this `SKILL.md`, and apply selected
Knowledge as supplemental guidance under the instructions, requirements,
Skills, and project-specific decisions in the active working directory.

## Select required reading

This Handbook currently has no common foundation. Evaluate every condition
below from the observable work, protocol, artifacts, and requested result. Every
matching package is required and cumulative; do not choose only the closest
match. A focused learning or explanation request about a package's subject
matches that package directly.

If no current package matches, the Handbook's reading selection is validly
complete with no package to read. Continue the task without applying unrelated
narrow material, inventing guidance, or implying that this Handbook documents
all of AI agent engineering. Do not copy or infer rules in place of reading the
linked canonical material.

## Conditional required-reading packages

### Model-invoked tool interfaces

When designing, implementing, reviewing, evaluating, diagnosing, or explaining
tools invoked by a language model (across function calling, agent SDKs, or
MCP), read
[Tool interface design for AI agents](../../knowledge/agents/tool-interface-design.md)
in full.

### Model Context Protocol (MCP) tool contracts

When defining, implementing, reviewing, diagnosing, or explaining Model Context
Protocol (MCP) tool wire contracts—discovery metadata, JSON Schema contracts,
`ToolAnnotations`, structured results, stateful handles, or
protocol-versus-execution error channels—read
[Model Context Protocol tool contracts](../../knowledge/mcp/tool-contracts.md)
in full.

### Model Context Protocol (MCP) server architecture

When structuring, implementing, reviewing, diagnosing, or testing an MCP
server's startup entry point, transport wiring, server-factory lifecycle,
module boundaries, or protocol and boundary test seams, read
[Model Context Protocol server architecture](../../knowledge/mcp/server-architecture.md)
in full.
