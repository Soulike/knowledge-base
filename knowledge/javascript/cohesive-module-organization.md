# Cohesive JavaScript and TypeScript module organization

## Scope

This document defines a default organization for JavaScript and TypeScript
modules whose operations share mutable state and one semantic responsibility.
It covers the structure that owns their implementation, the named interface
callers use, instance lifetime, and explicit testing extensions to that
interface.

## When to update

Update this document when JavaScript or TypeScript module, class, closure, or
access-control semantics change, or when module and test maintenance provides
evidence that changes the conditions for aggregation, helper extraction,
instance sharing, or testing access.

## Make the functional unit visible

For a cohesive stateful functional unit, prefer a class or a factory function
that keeps its state, production operations, and private implementation
together. Give callers a named class to instantiate or an object on which they
call methods, such as `taskQueue.enqueue(...)`. This makes the unit recognizable
both where it is defined and where it is used. Avoid representing it only as
separately exported operations spread among file-level helpers and mutable
variables.

Establish the unit using
[Module responsibility and defensive scope](../software-design/module-responsibility-and-defensive-scope.md):
one responsibility means one owned semantic decision, not one method or verb.
Enqueueing, taking, and cancelling tasks can belong to one queue. An
independently changing product rule can belong to another module even when the
queue is its only caller. Calling that other module does not transfer ownership
of its rule to the queue.

This is a code-organization recommendation for that kind of functional unit,
not a requirement to turn independent stateless utilities into classes. A
class or factory still needs responsibility review as it grows; its shape does
not guarantee cohesion or establish that an Agent will preserve it.

An ES module already gives unexported declarations
[module-local scope](https://www.typescriptlang.org/docs/handbook/2/modules.html).
Moving those declarations into a class does not create external privacy for
the first time. Likewise, `import * as taskQueue` can group calls at the
consumer, but does not organize the implementation inside the imported file.

## Keep the implementation inside its aggregate

A class gives the unit a name and places its state and operations among its
members. In TypeScript, use `public` and `private` to make the intended roles
explicit. TypeScript `private` is primarily a type-checking restriction;
JavaScript `#` private elements provide runtime privacy. Choose the mechanism
appropriate to the project's language and access requirements, rather than
assuming the two provide the same guarantee.
[TypeScript's access-control documentation](https://www.typescriptlang.org/docs/handbook/2/classes.html#caveats)
describes that distinction.

For example, this queue owns pending task IDs and the rule that IDs are
trimmed. Its tests additionally need to inspect and seed normalized pending
IDs; those specific needs account for the two `ForTesting` extensions:

```ts
export class TaskQueue {
  private pending: string[] = [];

  public enqueue(taskId: string): void {
    this.pending.push(this.normalizeTaskId(taskId));
  }

  public take(): string | undefined {
    return this.pending.shift();
  }

  private normalizeTaskId(taskId: string): string {
    return taskId.trim();
  }

  public getPendingTaskIdsForTesting(): readonly string[] {
    return [...this.pending];
  }

  public setPendingTaskIdsForTesting(taskIds: readonly string[]): void {
    this.pending = taskIds.map((taskId) => this.normalizeTaskId(taskId));
  }
}
```

A factory is also a valid aggregate. Its closure owns the state and helpers,
and its returned object defines the operations callers receive. The same
queue's production operations can be organized this way:

```ts
export function createTaskQueue() {
  const pending: string[] = [];

  function normalizeTaskId(taskId: string): string {
    return taskId.trim();
  }

  function enqueue(taskId: string): void {
    pending.push(normalizeTaskId(taskId));
  }

  function take(): string | undefined {
    return pending.shift();
  }

  return { enqueue, take };
}
```

Keep a helper that implements the unit's own rules inside the class or factory
by default. Being pure, lacking state, or not accessing `this` does not make it
an independently reusable abstraction. Moving it outside can make a private
implementation choice look available for unrelated code to adopt.

Extract when a distinct responsibility needs its own owner, or when a confirmed
sharing need justifies designing a shared interface. Verify that consumers
share the meaning and contract, not just similar code. Refactoring a large
method into private methods within the aggregate remains available without
creating a new module. The queue's normalization helper stays internal because
it expresses that queue's ID rule, regardless of how short or stateless it is.

## Choose instance lifetime separately

Choose a class or factory to express ownership, then decide who creates and
holds its instances. Separate tasks, sessions, or tests that require independent
state should receive separate instances. Exporting a class or factory allows
the caller that owns that lifetime to construct the instance.

When consumers intentionally share one state and lifetime, exporting an
instance, such as `export const taskQueue = new TaskQueue()`, is appropriate.
Moving file-level state into an eagerly created exported instance does not by
itself change its sharing or lifetime. It also does not guarantee process-wide
uniqueness: for example, Node.js caches ES modules by resolved URL, and distinct
query strings or fragments can produce separate module instances.
[Node.js documents the caching rule](https://nodejs.org/api/esm.html#urls).

## Add explicit testing extensions when needed

Start with the supported behavior and observation that the test needs.
[Test effectiveness](../software-testing/test-effectiveness.md) owns that
judgment: a test should expose a realistic contract violation while tolerating
changes the contract permits. Prefer normal production interfaces when they
can construct and observe the scenario effectively. Add a testing extension
when a concrete test needs observation, state setup, or process access that
those interfaces do not adequately provide; do not generate an extension for
every private member.

Keep the original methods and state private. Add separate public methods whose
names end in `ForTesting`; use the same suffix for testing operations returned
by a factory. These are newly added testing capabilities, not production
features. Production callers and the module's own normal execution paths must
not call or depend on them. The extensions may access private state and invoke
real private implementations; they must not duplicate business logic or switch
the production operation to a separate implementation for tests.

The suffix makes the exceptional purpose visible at the call site, as in the
[ForTesting methods pattern](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/patterns/fortesting-methods.md).
That source describes a C++ project convention; the naming rule here is a
JS/TS design convention, not a language-enforced restriction. A public method
remains callable by production code unless a separate check prevents it.

Design the capability for the particular need:

- **Observation:** return the necessary values or a suitably isolated snapshot.
  The example's getter copies an array of strings, so mutating the returned
  array cannot change the queue. Returning the internal array or map would
  expose a mutation route. A `Readonly<T>` annotation does not create runtime
  isolation, and a shallow copy still shares nested mutable objects.
  [TypeScript's readonly-property documentation](https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties)
  explains the type-system limit.
- **State setup:** provide a named, bounded setter or setup operation for the
  required scenario. The example copies and normalizes input through the real
  helper, establishing a state reachable by enqueueing the same IDs without
  retaining the caller's mutable array. A testing setter does not make an
  otherwise unsupported state part of the production contract.
- **Process access:** add a forwarding method that calls the existing private
  process when that access is necessary for the test. Keep the original process
  private and keep normal execution calling it directly. The forwarding method
  need not add logic; its separate name records the testing purpose.

Keep assertions tied to the required behavior or invariant rather than
incidental field layout. When implementation changes, adapt or remove testing
extensions with their owning tests as needed. An explicit testing interface
permits controlled access; it does not make every detail it can reveal a
production guarantee.
