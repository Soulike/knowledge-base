# Defensive scope and boundary ownership

## Scope

This document defines how modules divide external translation from domain policy at integration seams, when defensive behavior is justified by a reachable owned effect, how staged and migration obligations establish or retire code, and why tests follow established production ownership. It supplies decision criteria and boundary cases for admitting, moving, deferring, or removing proposed guards, fallbacks, compatibility branches, validations, and adapters.

## When to update

Update this document when evidence from external integrations, validation boundaries, defensive failures, staged or migration changes, or test-ownership disputes changes the relationship among current scope, reachable runtime states, external contract reliance, domain-policy ownership, and production-behavior ownership.

## Keep translation and policy with their owners

At an external integration seam—a chosen boundary where an external technology or contract meets local code—start from the current local and upstream contracts. An adapter at that seam translates between the local interface and the external technology or contract: it may invoke the external interface, translate representations, decode unchecked output, map relevant failures, and handle protocol details required by its local callers. It owns only the translation its interface promises; this list is not a mandatory checklist for every adapter.

### Expose the capability local callers need

A provider's interface can serve many uses beyond the application's current
need. Exposing the whole interface to local callers makes them carry its types,
configuration, and capabilities even when they only need one operation. For
example, returning a live mutable collection to a caller that only needs lookup
can also give that caller a way to clear the collection. Constraining the element
type does not remove its deletion operations.

Use a local interface, suitable restricted view, or other supported mechanism
when it isolates a real mismatch in capability or contract. Check the actual
operations and effects callers can reach when prevention matters. Passing a
provider object through several modules can spread representation conversion
and vendor assumptions; concentrate that translation at the established seam.
An extra wrapper is not justified for every container or dependency. A stable
standard representation or intentionally public record may already be the
appropriate caller contract.

### Rely on the supported contract and establish uncertain assumptions

Compare validation ownership constraint by constraint on each supported execution path. Rely on a dependency to enforce a constraint when its configured, supported behavior satisfies the local requirement on that path before any interpretation or effect that would violate the local contract. Retain local checks for stricter requirements, different coercion or normalization rules, or paths that bypass that enforcement. When the original input's type or value matters, enforce that rule before the dependency can coerce or normalize it. A stricter local contract does not justify reimplementing every upstream check.

Translate recognized dependency validation failures into the caller's required result when that mapping satisfies the local failure contract; a different response format alone does not require duplicate validation beforehand. Reproducing an upstream accepted-input language creates a second authority that can reject supported inputs, accept unsupported inputs, or drift as the dependency evolves. Keep local validation where dependency enforcement and failure translation cannot satisfy an owned requirement.

Do not model missing methods or version states merely because a dynamic language could express them; establish that the supported runtime, loading path, or compatibility contract can actually produce the state.

When documentation leaves a relevant dependency behavior uncertain, a focused
experiment can separate learning the API from integrating it into production
code. Exercise the operation and observable result the application needs under
an identified version, configuration, and initial state. This learning evidence
can reveal required setup, defaults, or an incorrect interpretation; a successful
probe establishes only the behavior it actually exercised under those conditions.
It does not prove the dependency's entire contract or every supported deployment.

An exploratory probe does not automatically earn permanent suite membership.
Retained boundary protection should exercise the application's actual invocation
and the outputs, failures, or effects its local contract relies on.
[Test effectiveness](../software-testing/test-effectiveness.md#test-at-the-owning-seam)
keeps the protected behavior real and selects representative integration cases
for distinct faults; mocking the provider cannot prove that the real provider
accepts the application's call. A retained relevant case can expose an
incompatible dependency update, while a green result still covers only its
observed contract. Learning and retained protection both have maintenance and
execution costs.

### Keep domain policy at its semantic owner

Keep product eligibility, trust classification, migration normalization, presentation, and other domain policy with the modules whose contracts make those decisions. The [semantic owner](module-responsibility-and-interfaces.md#organize-a-module-around-owned-meaning) is the module whose contract must state the decision and whose consumers depend on it, rather than whichever module already handles a related domain noun or integration. An adapter should carry such policy only when translation into or out of the external system is itself the current owned decision. Sharing a domain object or anticipating a future caller does not transfer ownership.

## Admit defensive behavior through a reachable owned effect

Defensive behavior is justified when a realistic value admitted by the actual interface can reach an interpretation or side effect the module owns. Before adding a guard, fallback, normalization, compatibility branch, or error state, trace:

1. the producer of the value or condition;
2. the interface that admits it;
3. the supported execution path that makes it reachable;
4. the incorrect interpretation or effect that would occur without handling; and
5. the module that owns preventing or defining that result.

Keep the behavior when that trace reaches the module's current contract. Unchecked network, file, database, deserialized, or human-authored values can require runtime decoding even when a type declaration describes their expected shape. A module that interprets a pathname and performs a privileged filesystem effect, for example, owns the validation needed to keep that effect within its contract.

Defer the behavior when the producer is hypothetical, the interface cannot admit the value, the supported execution path excludes it, an upstream contract already owns the decision, or another domain module would have to choose the policy. A test that can construct an impossible value does not make the value part of the production interface.

## Justify responsibilities throughout staged changes

A current requirement need not already have a production caller. An explicitly approved stage can establish a module, interface, or compatibility path before a later stage switches consumers. The current stage must define the responsibility being established, the intended consumer or cutover, and the contract that this work must leave ready.

A merely possible future consumer supplies none of those constraints. Do not pre-implement its presumed validation, migration, trust, presentation, or compatibility policy. Revisit the design when an accepted requirement identifies the real consumer and decision owner.

When the local need is established but an external API is not yet available,
the local interface can express that need while the eventual adapter remains
unfinished. A test substitute can exercise local behavior against this agreed
contract. It cannot establish that the eventual provider supports the interface;
that translation and real integration still need verification when available.

As a stage changes or ends an obligation, reassess whether the related code belongs in the supported target system. Ask: given current business requirements and supported operating conditions, if the system had started with the migrated design, what requirement would justify this code existing? Establish the requirement independently of the implementation, its callers, and its tests. Semantic compatibility preserves current commitments; an inherited arrangement needs its own continuing justification.

Include related active code and unchanged support artifacts in that assessment. A wrapper can still execute because a comparison fixture reconstructs an obsolete entry path, or a selection layer can still have callers after the system has committed to one implementation. References establish usage, but a chain whose members only sustain one another does not establish a current capability. Trace the chain to a supported consumer or explicit obligation before deciding what remains necessary.

Remove behavior and support whose only obligation has ended. When the capability remains required but its inherited arrangement does not, simplify or collapse that arrangement while preserving the current contract. Retain a module or seam when it still isolates a live decision or external contract; one current implementation does not by itself make an adapter unnecessary.

The diagnostic question does not prove that an obligation has ended. Supported older clients, persisted formats, security, reliability, and operational commitments remain requirements. Rollback and approved intermediate stages can require transitional behavior while those obligations remain live. Preserve affected code when a potentially real obligation is unresolved, and identify the missing evidence or decision. Bound the assessment by the changed obligation and its affected dependencies rather than unrelated opportunities to redesign the system.

## Let tests follow production ownership

Tests protect behavior whose production contract and owner have already been established. A proposed test, an easily constructed fixture, or a passing assertion is evidence about an implementation; it cannot grant a module a new production responsibility.

First decide whether the behavior is required, reachable, and owned at the tested seam. Then apply [Test effectiveness](../software-testing/test-effectiveness.md) to decide whether new automated protection is owed and which seam, oracle, layer, and doubles make that protection meaningful. Large setup or several unrelated test groups can reveal a misplaced or missing production seam, but they are reasons to inspect the design rather than automatic commands to split it.

## Decide where proposed behavior belongs

For each proposed branch, type, export, validation, fallback, compatibility rule, or test, answer:

1. What current requirement, concrete consumer, or explicitly approved delivery stage needs it?
2. What semantic decision does it make visible to callers?
3. Which module owns that decision and the contract that expresses it?
4. What independent event or policy change would require this behavior to change?
5. Does an upstream dependency or another domain module already own the behavior?
6. Can the state occur through the real interface and supported execution path?
7. If this module disappeared, would required complexity spread to callers, remain with another owner, or disappear because no current capability needs it? Evaluating [caller leverage](module-responsibility-and-interfaces.md#measure-depth-by-caller-leverage)—whether the module concentrates real complexity rather than passing calls through or adding caller burden—still permits a deliberately thin adapter when it isolates an external contract, translates representations and failures, or keeps technology volatility out of a domain module.

Keep the behavior in the proposed module only when the answers identify one coherent current responsibility there. Otherwise move it to its semantic owner, rely on the authoritative upstream contract, include it in a defined staged responsibility, or defer it until a real requirement establishes the missing decision.

## Compare boundary cases

| Situation                                                                                                                                                                       | Owning decision                                                                                                                              | Result                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A typed SDK adapter calls supported methods and decodes unchecked responses, while a hypothetical future consumer might want trust scoring or migration normalization.          | The adapter owns current contract translation; future product policy has no current owner in the adapter.                                    | Keep invocation, decoding, and relevant failure translation. Defer the speculative trust and migration rules and do not reproduce the SDK's accepted-input grammar.                      |
| An API requires numeric integer date fields. Complete dates pass through a parser that checks calendar validity but permits coercion and truncation; partial queries bypass it. | The API owns strict field acceptance and validity on each supported path; the parser supplies calendar validation on the complete-date path. | Check types and integers before parsing, translate calendar failures for complete dates, and keep month bounds on the partial-query path. Do not duplicate the parser's calendar checks. |
| A filesystem module accepts a pathname and performs a privileged mutation. A realistic admitted pathname can escape the intended resource set without a sink-side check.        | The module interprets the value and owns the privileged effect.                                                                              | Validate at the effect-owning boundary even if a caller also checks earlier for feedback.                                                                                                |
| An approved staged change establishes an interface in one delivery and switches a named consumer in the next.                                                                   | The accepted stage owns leaving the defined interface ready for that cutover.                                                                | Implement the scoped interface before the production consumer changes; omit unrelated behavior imagined for other possible consumers.                                                    |
| A small external adapter translates one remote operation, while the consuming domain module owns eligibility, retries, and product decisions.                                   | The adapter owns technology translation; the domain module owns product semantics.                                                           | Retain the legitimately thin adapter and evaluate the domain module's depth separately. Do not move policy into the adapter merely to make it larger.                                    |

## References

- James Grenning, “Boundaries,” chapter 8 in _Clean Code: A Handbook of Agile Software Craftsmanship_, ISBN 978-0-13-235088-4. Chinese edition: _代码整洁之道_, translated by 韩磊, 人民邮电出版社, 2010, ISBN 978-7-115-21687-8.
- [Alistair Cockburn, “Hexagonal Architecture: The Original 2005 Article”](https://alistair.cockburn.us/hexagonal-architecture)
- [Martin Fowler, “Yagni”](https://martinfowler.com/bliki/Yagni.html)
- [Danilo Sato, “Parallel Change”](https://martinfowler.com/bliki/ParallelChange.html)
- [Ian Cartwright, Rob Horn, and James Lewis, “Transitional Architecture”](https://martinfowler.com/articles/patterns-legacy-displacement/transitional-architecture.html)
