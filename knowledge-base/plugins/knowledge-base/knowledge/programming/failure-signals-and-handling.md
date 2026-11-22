# Failure signals and handling in code

## Scope

This document explains how code represents, propagates, translates, and handles failures without obscuring its normal task or losing the caller's required distinctions. It treats the operation's promised outcomes, effects, and resource lifetimes as constraints on these implementation choices.

## When to update

Update this document when evidence from failure handling, API use, or resource lifetimes changes how signal choices, propagation, translation, absence handling, or cleanup preserve a caller's contract and make code understandable.

## Preserve meaning before choosing a signal

A failure signal is the mechanism through which code tells its caller that
the requested operation did not produce its promised result. An exception,
an explicit result value, or another language-supported mechanism can carry
that meaning. The mechanism does not decide which outcomes are meaningful.
For externally observable work, the [operation's outcome and recovery
contract](../software-design/operation-failure-and-recovery.md#distinguish-outcomes-by-consequence)
establishes which results, partial effects, uncertainties, and safe next actions
must remain distinct. Carry those distinctions through the code.

For example, a configuration lookup can have no configured value, an unreadable
store, or an invalid stored value. A missing optional value can permit an agreed
default. Failure to read the store does not establish that the value is absent.
Returning the default for all three states would silently choose a new policy.

Choose a signal that fits the language, the established API, and the caller's
use. Exceptions can keep a normal sequence separate from failure handling and
propagate through callers that cannot recover locally. Explicit results can
make expected alternatives visible in ordinary control flow and, with suitable
types and tooling, require callers to consider them. Neither guarantees that
callers handle failures correctly: a result can be ignored and an exception can
be swallowed. Avoid ambiguous sentinel values whose ordinary and failure
meanings cannot be distinguished reliably.

If the language declares failures in a signature, treat that declaration as
part of the real interface. Evaluate the caller obligations and change costs;
neither a blanket preference for unchecked exceptions nor a mandatory checked
mechanism establishes a sound failure contract. Keep vendor-specific details
out of unrelated caller interfaces when callers need only a stable local
distinction.

## Handle a failure where a meaningful response is owned

Keep the successful task recognizable. Give substantial translation, recovery,
or reporting behavior its own coherent implementation when that improves
understanding; placing every statement inside a large `try` is not itself a
design improvement.

Catch or inspect a failure where the code can perform an owned response:
recover under an established policy, translate into the caller's contract,
release owned resources, or report an honest terminal outcome. Otherwise
propagate it to the boundary that can do so. Logging alone does not satisfy a
contract that still requires the caller to know the work failed. A process or
API boundary may need broad failure handling, but it must preserve failure
rather than resume as if the requested work succeeded.

Group underlying failures when callers should respond in the same way, while
preserving causes and relevant details for investigation. Keep separate signals
when the safe response differs. For instance, a caller that can correct an
invalid input needs that distinction from a dependency outage; several vendor
outage codes can share one local failure when they require the same response.
[Module responsibility](../software-design/module-responsibility-and-defensive-scope.md#keep-translation-and-policy-with-their-owners)
places external translation at its seam and domain policy at the module whose
contract owns that policy. A cleaner error type does not grant an adapter the
right to invent retries or business defaults.

Carry enough context to investigate the failed operation without making every
caller parse vendor messages. Preserve the original cause when translating;
include the operation and relevant identifiers when they supply necessary
context. A stack trace alone need not explain the intended work.
[Diagnostic evidence](../software-design/failure-diagnostic-evidence.md)
determines which facts an investigator needs, when transient facts must be
captured, and which retained channel can safely hold them. The error object
need not duplicate facts already available through a usable retained record.

## Make absence and defaults explicit

Use absence only when it is part of the input or result contract. An optional
value can legitimately be absent; a required value that cannot be obtained is
a different condition. Enforce required inputs at the boundary that owns their
interpretation. An assertion that can be disabled does not replace necessary
runtime validation of admitted external data.

An empty collection is a useful result when it means a completed query found
no items. It cannot stand for a failed query unless that loss of distinction
is explicitly part of the contract. Likewise, a special-case object can provide
normal behavior for an agreed alternative, such as an established default
configuration. It must preserve that alternative's meaning, not conceal a
failure merely to remove a conditional.

Judge the contract rather than imposing a universal prohibition on `null` or
requiring a new class for every absence. Make the admitted absence recognizable
through the language's optional types, documented values, or other supported
API conventions, and keep its handling at the relevant owner.

## Preserve resource lifetime on failure paths

Establish who owns each acquired resource and when that ownership ends. Put
cleanup with that lifetime so normal return, early exit, and failure take the
required release path. Use the language's resource scopes, context managers,
or cleanup constructs where their guarantees match the contract. Do not close
a caller-owned handle merely because the current function used it.

An exception boundary or `finally` block is not a transaction. Releasing a
handle does not undo a write already made through it, and catching a failure
does not restore an earlier state. Rollback or compensation requires an actual
supported mechanism and the operation's effect contract. Preserve any partial
or unconfirmed result when reporting what happened.

Cleanup can also fail. Keep that failure distinct from the primary operation
failure and preserve the information needed to understand both; do not let a
cleanup return or replacement exception silently erase the original failure.
When the work succeeded but required cleanup failed, report the result according
to the resource and operation contracts rather than assuming complete success.
Check the relevant language construct's propagation behavior when more than
one failure is involved.

## Sources

- Michael Feathers, “Error Handling,” chapter 7 in _Clean Code: A Handbook of Agile Software Craftsmanship_, ISBN 978-0-13-235088-4. Chinese edition: _代码整洁之道_, translated by 韩磊, 人民邮电出版社, 2010, ISBN 978-7-115-21687-8.
- [Python tutorial: defining clean-up actions](https://docs.python.org/3/tutorial/errors.html#defining-clean-up-actions) and [predefined clean-up actions](https://docs.python.org/3/tutorial/errors.html#predefined-clean-up-actions): concrete cleanup and exception-propagation semantics that must be checked for the selected language mechanism.
