# Generalizing source material into reusable Knowledge

## Scope

This document defines how to choose an evidence-supported claim scope and document boundary when extracting reusable Knowledge from a concrete case. It owns the distinction between observed context, transferable invariants, and product- or platform-specific mappings, plus the choice to combine or split general and specific material; classification between Knowledge and Skills belongs in [Knowledge and Skills](knowledge-and-skills.md), while repository authoring steps and the correctness of particular source evidence are outside this document's scope.

## When to update

Update this document when a real extraction case exposes an unsupported generalization, an ambiguous boundary between a general principle and a specific mapping, or an incomplete split or merge criterion, or when the available kinds of evidence change how a reusable claim can be supported.

## Let evidence set the claim scope

Generalization seeks the narrowest stable abstraction that preserves the useful lesson, not the largest possible audience. Separate what the source directly establishes from the invariant that explains it and the conditions that the invariant requires. Remove repository names, paths, domain objects, and other incidental context only when they do not affect that invariant. Retain product, platform, protocol, runtime, or environmental qualifiers that the evidence has not displaced.

Evidence for a broader claim can come from an authoritative standard or contract, documented semantics, mechanism-level reasoning, or representative observations within the intended scope. A similar mechanism outside the observed scope can motivate a hypothesis, but analogy alone does not establish that the claim is portable. State a cross-platform principle only when its invariant is supported across that scope; otherwise keep the claim at the narrower level the evidence supports.

## Choose the representation after the scope

Use the resulting claim scope to choose among these representations:

| Evidence and responsibility                                                                                                   | Representation                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| The lesson still depends on the source project's domain model, policy, private infrastructure, or other non-transferable fact | Keep it with the source rather than presenting it as reusable Knowledge.                             |
| The evidence supports only one product, platform, runtime, or protocol                                                        | Write specific Knowledge and preserve that qualifier.                                                |
| A general invariant is supported and the specific details only demonstrate or translate it                                    | Keep one general document and use the specific material as an example.                               |
| The general invariant and a specific mapping are both independently useful and maintained                                     | Use paired documents; make the specific mapping reference rather than restate the general principle. |

## Split only on independent responsibility

Give a general principle and a specific mapping separate documents only when each has a distinct canonical responsibility, an independently useful `When to Read` condition, an independent `When to update` trigger, and enough substance to stand alone. If any of those conditions is missing, keep the material together. A specific mapping usually earns its own document when it owns API choices, runtime behavior, limitations, or maintenance triggers that readers need without rereading the general explanation.
