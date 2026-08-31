---
name: evaluate-library-adoption
description: Evaluate established solutions before creating or extending reusable, domain-independent functionality. Use when planning or implementing a general technical capability that may already be provided by an installed package, standard or platform library, official SDK, or mature third-party package.
---

# Evaluate library adoption

## Recognize the reusable capability

1. Discover and follow instructions, Skills, requirements, dependency policy,
   supported environments, architectural decisions, and project-specific
   information from the active working directory. Treat this plugin's packaged
   Knowledge as supplemental guidance and follow the active-working-directory
   source when they conflict.
2. Identify any reusable technical mechanism in the requested work before
   implementing it. When implementation reveals such a mechanism, pause custom
   work at that boundary.
3. Separate the reusable mechanism from product- or domain-specific behavior.
   Keep business rules under project ownership while evaluating established
   solutions for the reusable part.
4. Record the required behavior and the constraints that can distinguish a
   suitable solution, including compatibility, performance, security, and
   operational limits that matter to the task.

Finish this step when the reusable capability and its project-specific
constraints are explicit.

## Investigate established solutions in order

Complete this investigation before implementing the reusable mechanism:

1. Inspect the active project's dependency manifests and imports for a mature
   package that the consuming package or application declares directly and
   that provides the capability. Use resolved dependency metadata to establish
   the installed version of a directly declared candidate, not to promote a
   transitive-only package into this fast path. Evaluate each credible directly
   declared candidate against the evidence and fit criteria below before
   broadening the search. When one fits, select its supported interface and
   skip the broader search.
2. Treat existing custom implementations and adapters as migration and
   integration context. Use them to discover requirements and consumers, not
   as evidence that continued custom implementation is the right choice.
3. When no installed mature package fits, check the language standard library,
   platform APIs, and official SDKs, then search the current ecosystem for
   mature third-party packages that fit the required behavior and supported
   environment. A package present only as a transitive dependency is a new
   dependency candidate: take it through this broader comparison and the
   applicable dependency-admission process, then declare it directly before
   using it.
4. For each credible candidate, inspect its current
   authoritative upstream sources before comparing or recommending it.
   Establish the installed or proposed version and the latest stable version
   from official release or package-registry metadata. Verify the supported API
   for the version the project would use from source code or versioned official
   API documentation. Use model memory only to identify sources to inspect;
   support every factual claim and recommendation with current source evidence.
5. For each credible candidate, assess API and standards coverage, real-world
   adoption, maintainership and release health, documentation and type support,
   compatibility, performance and footprint, licensing, migration cost, and
   the effort to replace it. When a new third-party dependency is a candidate,
   read [Dependency and supply-chain security](../../references/security/dependency-supply-chain-security.md)
   and apply its admission criteria.

Treat broad adoption and sustained maintenance as evidence of exercised edge
cases and shared maintenance, not as proof that a library fits the project.
Finish this step when either a suitable installed mature package has been
selected, or every credible option has current upstream evidence for its
version, API, fit, and costs.

## Decide before continuing implementation

If no installed mature package fits, compare the credible options with a local
implementation on total ownership cost: correctness, standards and edge cases,
ongoing maintenance, security and supply-chain exposure, integration
complexity, performance, and exit cost. Prefer an established solution when it
satisfies the project's constraints and offers lower total ownership cost than
custom code.

Present this broader comparison to the user with the material options,
evidence, tradeoffs, and a recommendation before adding a dependency or
implementing a local substitute.
When neither the user nor the active project's governing policy has already
selected the approach, ask the user to choose and stop at that boundary. A
request for the capability itself does not implicitly choose custom
implementation. Choose custom implementation only when the investigated
established options do not fit, or the user explicitly selects it after seeing
the comparison.

When a stronger established option appears after implementation has begun,
pause at the reusable boundary and reopen this decision using current evidence,
independent of work already spent.

## Continue with the selected approach

After selecting a suitable installed package or reaching an explicit choice,
read
[Module responsibility and defensive scope](../../knowledge/software-design/module-responsibility-and-defensive-scope.md)
when the selected approach uses or proposes an adapter, requires deciding
whether one is justified, or must place validation, compatibility, migration,
trust, presentation, or other policy between an external solution and project
code. Then return the approach and its evidence to the original task:

- When an established solution is selected, use its supported interface and
  apply the loaded module-responsibility guidance to the adapter decision and
  any resulting adapter or surrounding project policy.
- When custom implementation is selected, record why the investigated options
  did not meet the constraints or record the user's explicit choice, then keep
  the owned surface limited to the required capability.

Finish when the selected approach, supporting evidence, selection basis, and
any maintenance responsibility accepted by the choice are explicit.
