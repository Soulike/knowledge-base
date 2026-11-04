# Evidence for investigating check findings and failures

## Scope

This document explains how to design checks and failure handling so the
information they leave behind helps someone locate the problem and take a
useful step toward fixing it. It covers the selection, timely capture, bounded
collection, and final availability of diagnostic evidence after a check reports
a finding or an operation fails, including information used only by internal
operators.

## When to update

Update when evidence changes how investigation needs, transient context,
collection limits, diagnostic failures, and final access determine whether a
finding or failure can be investigated.

## Design failure information with the check

When a check rejects work or fails a workflow, someone needs to work out what
must change before the work can proceed. Design the information they will need
at the same time as the check. Waiting for a real failure can be too late to
collect it, leaving the person responsible with a failure they cannot
investigate or fix.

Diagnostic evidence is the recorded information used to investigate what
happened, such as an event record, a trace, or an identifier that locates related
records. A check can work correctly while reporting a finding: a guard that
blocks forbidden traffic has enforced its policy, even if the workflow then
fails. Evidence that the guard detected traffic does not by itself identify
the affected connections or explain their origin.

Identify who will respond and what they need to fix the problem or begin
troubleshooting. They may need to locate a particular execution, distinguish
affected objects, compare expected and observed behavior, or choose the next
inspection. Select the smallest set of facts that supports that step. An exit
status or total count can establish that a check found a problem while leaving
that next step impossible. The needed context depends on the check and
available records; there is no universal field list.

Inspect existing logs, traces, and correlation identifiers before adding
collection. A correlation identifier links an event to other records. It is
sufficient when those records contain the needed facts and the investigator
can still access them when the investigation begins. A printed identifier
alone does not establish that its supporting records exist, remain available,
or are accessible to that investigator.

## Capture facts while they exist

For each necessary fact, establish where it exists and what can destroy it.
Process exit can remove in-memory context, cleanup can delete temporary files,
and teardown can remove the environment that holds execution or connection
state. Capture necessary transient context before that boundary and retain it
somewhere that survives until the intended investigation. A failure handler
that runs after the context disappears cannot recover it merely by adding
more logging.

For example, a network guard may retain only a rejected-connection count before
destroying its temporary environment. If the investigator needs to identify
the affected execution and destinations, the design must retain sufficient
safe connection and execution context before teardown. Existing retained
traces can supply it; otherwise bounded metadata collection may be needed.
The count proves detection. The additional context supports investigation;
neither alone proves why the traffic occurred.

## Keep collection bounded and appropriate for its audience

Set limits for collection volume, duration, and resource use that fit the
investigation. Keep total findings distinct from retained samples, and make
sampling, truncation, unavailable fields, and collection failures visible.
An incomplete sample must not appear to be a complete account. Choose the
limits from the expected use and operational constraints rather than treating
unlimited output as the definition of useful diagnostics.

Collect only necessary information that the receiving channel is authorized
to hold. Exclude secrets, unnecessary personal data, and payload contents that
the investigation does not require; protect access to retained operational
details. Treat values originating in the checked work as untrusted when
recording or rendering them. If details also reach a user-facing result,
apply the [separation between primary messages and supporting
details](user-facing-failure-communication.md#separate-the-primary-message-from-supporting-details)
so the user receives the result and safe next action without unnecessary
internal disclosure.

## Preserve the finding when diagnostics fail

Treat evidence collection, retention, and delivery as operations that can fail.
If the check already rejected work or the operation already failed, a later
diagnostic or cleanup error must not erase that primary outcome. Keep the
original finding or failure visible, and report which evidence could not be
obtained or delivered. Successful cleanup or artifact publication does not
turn the original result into success.

A partial diagnostic record can still support a useful next step. State what
it establishes and what remains unknown rather than substituting a guessed
cause. A later run that does not reproduce an intermittent finding can verify
parts of the collection mechanism, but does not establish the original cause
or prove that it was fixed.

## Verify the evidence the investigator can actually use

Inspect a representative finding or failure at the final accessible log,
record store, or artifact. Follow it through command wrappers, output capture,
serialization, cleanup, and publication as applicable. A collector producing
the right local output does not establish that the retained artifact contains
it or that its referenced records survive teardown.

Check that the intended investigator can find the affected operation and take
the selected next step using the delivered evidence. Include supported limits,
missing evidence, and diagnostic failure paths when they can change that
decision or conceal the primary result. Where automated protection is useful,
apply [test effectiveness](../software-testing/test-effectiveness.md) to protect
the necessary information and delivery behavior while allowing incidental
wording and formatting to change.

Completion means the available evidence supports the intended investigation
step and makes material gaps explicit. It does not require a known root cause
for every finding or failure.
