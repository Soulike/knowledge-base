# Engineering accomplishment reports

## Scope

This document explains how to describe engineering accomplishments to
decision-makers through concise, attributable claims about the work enabled or
sustained and the change that can be verified. It covers reader relevance,
beneficiary context, evidence strength, and shared ownership without requiring
a fixed report format.

## When to update

Update this document when representative report reviews or stronger evidence
change how engineering contributions, capability availability, observed use,
outcomes, or shared ownership should be distinguished for decision-makers.

## Start with the beneficiary's work or risk

Identify the judgment the reader needs to make and the beneficiary's work,
goal, or risk that makes the contribution relevant. Describe an initial obstacle
only when it is known. Preventive work may instead sustain a capability or
address a credible risk without a prior incident or a measured outcome.

Connect that context to the contributor's own intervention and the change
actually observed. Group infrastructure, reliability, testing, and
documentation work by the capability it enables or sustains. Include
implementation details when they explain the contribution or support a claim,
not as a substitute for what the work made possible. When use or benefit has
not been observed, state the implemented or available capability at its verified
scope rather than inventing an outcome.

## Match each claim to its evidence

| Claim                                           | Evidence that can support it                                                                               | Boundary                                                                                                  |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| A change entered the codebase                   | Merged change records and the changes themselves                                                           | Check the contributor's actual part; a merge does not establish release, use, or benefit.                 |
| A capability is available within a stated scope | Release or deployment records, a live catalog entry, or access checks that establish the relevant exposure | A catalog entry shows discoverability there; it does not by itself establish successful execution or use. |
| A capability was used                           | Run records or attributable feedback describing a concrete use                                             | Observed cases do not establish broad adoption or an improved outcome.                                    |
| A measured outcome improved                     | Comparable baseline and follow-up measurements for the stated population, period, and measure              | A measured difference alone does not attribute the change to one contribution.                            |

Give each metric its unit, population or scope, time window, and comparison
basis. Investigate other changes that could explain a difference before making
a causal claim; otherwise describe the observed change without assigning its
cause. Activity counts and rankings reflect only what their counting rule
captures. They do not establish beneficiary value. Similarly, an absence of
further bug reports does not by itself prove that a defect was resolved.

## Attribute shared work

Separate the infrastructure a contributor built from the content or features
collaborators built with it. Describe joint work and dependencies at the level
the records support. Making other work possible is a meaningful contribution,
but it does not transfer authorship of that work or prove that it was used.

For example, change history may show that one engineer built a shared
integration registry while colleagues authored its integrations. Registry
entries can support a statement that the engineer built the registry listing
their integrations. A claim that the engineer built every integration, that
teams used them, or that delivery became faster needs separate evidence for
each assertion.
