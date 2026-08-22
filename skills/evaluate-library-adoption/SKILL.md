---
name: evaluate-library-adoption
description: Evaluate established libraries before implementing reusable, domain-independent functionality. Use when planning, investigating, or implementing that functionality and choosing among existing project code, standard or platform libraries, official SDKs, third-party packages, and custom code.
---

# Evaluate library adoption

## Establish the capability boundary

1. Follow the active project's requirements, dependency policy, supported
   environments, and existing architectural decisions.
2. Separate the reusable technical mechanism from product- or domain-specific
   behavior. Keep business rules under project ownership while evaluating
   established solutions for the reusable part.
3. Record the required behavior and the constraints that can distinguish a
   suitable solution, including compatibility, performance, security, and
   operational limits that matter to the task.

Finish this step when the reusable capability and its project-specific
constraints are explicit.

## Investigate existing solutions

Complete this investigation before implementing the reusable mechanism:

1. Inspect the active project for an existing implementation, dependency, or
   adapter that already owns the capability.
2. Check the language standard library, platform APIs, and official SDKs.
3. Search the current ecosystem for established third-party libraries that fit
   the required behavior and supported environment.
4. For each credible library or SDK candidate, inspect its current
   authoritative upstream sources before comparing or recommending it.
   Determine the latest stable version from official release or package-registry
   metadata, and verify the API provided by that version from its source code or
   versioned official API documentation. Use model memory only to identify
   sources to inspect; support every factual claim and recommendation with
   current source evidence.
5. For each credible candidate, assess API and standards coverage, real-world
   adoption, maintainership and release health, documentation and type support,
   compatibility, performance and footprint, licensing, migration cost, and
   the effort to replace it. When a new third-party dependency is a candidate,
   read [Dependency and supply-chain security](../../references/security/dependency-supply-chain-security.md)
   and apply its admission criteria.

Treat broad adoption and sustained maintenance as evidence of exercised edge
cases and shared maintenance, not as proof that a library fits the project.
Finish this step when every credible option has current upstream evidence for
its version, API, fit, and costs.

## Decide before implementation

Compare the credible options with a local implementation on total ownership
cost: correctness, standards and edge cases, ongoing maintenance, security and
supply-chain exposure, integration complexity, performance, and exit cost.
Prefer an established solution when it satisfies the project's constraints and
offers lower total ownership cost than custom code.

Present the user with the material options, evidence, tradeoffs, and a
recommendation. When neither the user nor the active project's governing policy
has already selected the approach, ask the user to choose and stop before
adding a dependency or implementing a local substitute. A request for the
capability itself does not implicitly choose custom implementation.

## Continue with the selected approach

After the choice is explicit, return it and its evidence to the original task:

- When an established solution is selected, use its supported interface and
  keep project-specific policy outside it. Add an adapter only when it creates
  a meaningful project boundary.
- When custom implementation is selected, record why the investigated options
  do not meet the constraints and keep the owned surface limited to the
  required capability.

Finish when the selected approach, supporting evidence, user or policy
authority, and any maintenance responsibility accepted by the choice are
explicit.
