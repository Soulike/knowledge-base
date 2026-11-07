# Application composition

## Scope

This document explains how application components are constructed and connected so that their established contracts hold on the application's actual execution paths.

## When to update

Update this document when evidence from application assembly, resource lifetimes, or intercepted execution changes the relationship between component contracts, construction choices, and behavior of the assembled application.

## Make assembly decisions explicit

Application composition selects concrete components, supplies their dependencies,
and connects the entry points through which work reaches them. A component's
contract describes what it provides and requires; composition determines which
instances and execution mechanisms fulfill those requirements in this application.
Good components can still form an incorrect application when the wrong instance,
configuration, lifetime, or call path is selected.

Keep assembly choices at an identifiable boundary, such as startup code or a
framework's supported configuration boundary, rather than scattering them through
business operations. Business code can then use a supplied capability without
also choosing a storage implementation or searching global configuration. This
does not forbid constructing an owned value, such as a calculation result, inside
the operation that needs it.

Dependency injection means supplying a dependency to the component that uses it.
Ordinary constructor or function arguments can do this; a container is optional.
With a service locator, the component asks a registry to find a dependency during
execution, so that lookup remains part of its runtime requirements. Choose a
supported arrangement with visible requirements rather than assuming a container,
annotation, or global registry establishes separation by itself.

## Separate construction choices from creation timing

An application can select an implementation at startup while creating individual
instances later. A factory is a supplied operation for producing those instances.
The consumer can choose when to request one and provide per-call inputs while the
factory owns the construction details assigned to it. A reporting operation might
request an output session for a particular destination; the supplied factory knows
how that session acquires its storage connection.

Use this separation when creation timing or construction dependencies matter to
the contract. A factory around every `new` expression adds coordination without
necessarily isolating a real choice. Lazy initialization likewise needs a reason:
deferring an expensive owned resource can be useful, while quietly selecting a
concrete external service on its first business call hides an assembly decision.
When initialization can overlap, its implementation must preserve the promised
sharing and valid state; moving it behind a getter does not supply that guarantee.

Choose lifetime and ownership together. A dependency may live for the application,
one request, or one operation. A long-lived consumer must not keep using a resource
after that resource's lifetime ends. State shared across calls needs the sharing
and concurrency behavior its consumers require. Identify who acquires and releases
resources, including resources acquired before a later startup step fails.

Separating startup does not make startup infallible. Establish what must be ready
before the application accepts work and what may legitimately initialize later.
Check required configuration and dependencies at the stage their contracts demand;
do not announce readiness merely because component constructors returned.

## Connect shared mechanisms to the required paths

A mechanism such as transaction management or authentication can apply to several
operations. A wrapper, middleware, interceptor, or aspect can place that mechanism
around selected calls. These arrangements change how execution reaches a component;
they do not make the mechanism's effects disappear from the application's contract.

Keep the governing decision at its
[semantic owner](module-responsibility-and-defensive-scope.md#organize-a-module-around-owned-meaning):
the module whose contract and consumers determine the rule. Composition attaches
the chosen implementation where that rule must hold. Centralizing a mechanism does
not establish that all operations need the same policy or that a rule may move into
an unrelated infrastructure component.

Trace each supported entry point to the effect it can reach. A mechanism runs only
where the chosen implementation actually applies it. A call to an undecorated
instance, an internal call that bypasses a wrapper, or a background entry point may
follow a different path. Check the mechanism's supported behavior rather than
assuming every annotation or method call has the same interception semantics.
When mechanisms nest, their order can matter: authorizing before opening a
transaction and authorizing inside it have different resource and failure behavior.
Choose order from the required contract.

For example, an HTTP handler and a background importer both update inventory. If
each update must be transactional, placing a transaction wrapper only around the
HTTP handler leaves the importer outside that arrangement. Connect both required
paths to an appropriate transaction boundary, and check successful updates and
failure effects through those paths. A wrapper's presence in configuration is
insufficient evidence that the importer uses it.

## Verify the assembled application at its boundary

Tests with supplied substitutes can exercise a component's own rules without
starting the entire application. They cannot establish that startup supplies the
right production dependency or that entry points reach required mechanisms.
Protect meaningful assembly faults through the actual relevant configuration and
call path, with observable results that distinguish incorrect wiring. Apply
[test effectiveness](../software-testing/test-effectiveness.md#test-at-the-owning-seam)
to choose the cases and evidence; registering a component or asserting that a mock
was called does not itself establish the required effect.

An assembly check need not start every external service for every component test.
Choose the real connections needed to expose the fault being protected against,
and keep the evidence's scope explicit. Recheck affected paths when changing
instance selection, lifetime, entry points, or mechanism order. Local component
tests and assembly checks answer different questions, and a passing case proves
only the behavior it exercises.

## Sources

- Kevin Dean Wampler, “Systems,” chapter 11 in _Clean Code: A Handbook of Agile Software Craftsmanship_, ISBN 978-0-13-235088-4. Chinese edition: _代码整洁之道_, translated by 韩磊, 人民邮电出版社, 2010, ISBN 978-7-115-21687-8. Its construction and cross-cutting examples inform this account; its historical EJB, Spring, and AspectJ configurations are not current framework guidance.
- [Martin Fowler, “Inversion of Control Containers and the Dependency Injection pattern”](https://martinfowler.com/articles/injection.html): separating configuration from use and distinguishing supplied dependencies from locator lookup.
