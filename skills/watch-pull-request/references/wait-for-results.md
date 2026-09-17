# Wait for results

Enter only when the main workflow selects waiting after complete observation
and classification. Human-owned items and frozen mutations remain recorded;
wait for the independently progressing automatic results selected by that
classification.

## Select the next interval

When an observation first enters waiting in the current execution, select a
five-minute polling interval. When an observation returns to waiting after a
completed waiting round, select five minutes if a semantic change affects an
active item's identity, status, content, or disposition. Passage of time and
provider metadata that does not affect classification do not reset the
interval.

When the observation returns to waiting with unchanged state, determine the
next interval as follows:

1. For each awaited automatic result, use recent completed samples already
   available through the normal watch when they represent the same result under
   materially comparable conditions. Estimate the typical total time to that
   result and subtract the current elapsed time measured from the corresponding
   boundary. Choose the completion unit from the awaited result rather than a
   fixed provider object: when one complete review is the result, its internal
   jobs or checks are stages of that sample rather than separate completion
   samples.
2. When an item's estimate has passed, give it a five-minute candidate. When
   estimated time remains, use
   `clamp(estimated remaining time / 2, 5 minutes, 10 minutes)`.
3. When no credible estimate is available for an item, give it a candidate five
   minutes longer than the previous polling interval, capped at ten minutes.
4. Select the shortest candidate across all awaited automatic results.

This produces a deterministic fallback of five minutes and then ten minutes
while allowing applicable duration patterns observed during the watch to
shorten a later interval. Do not create a separate mandatory history-retrieval
loop.

After an ended waiting round's resulting observation and classification select
waiting again, a user-facing status update may report the completed round's
result and the selected next interval even when no autonomous work was found.
Send any such boundary update before beginning the next waiting round. Do not
post a GitHub comment solely to record waiting or unchanged state.

## Run one waiting round

After any allowed boundary update, record the awaited results, selected polling
interval, start time, and absolute deadline. That record begins one waiting
round. The round ends only when its deadline arrives or an available relevant
event wakes it. Within one persistent execution, retain the complete round
until it ends. A runtime yield, tool return, or execution continuation does not
end the round or resume a checkpointed watch.

Prefer a runtime mechanism that can deliver a relevant event without
periodically retrieving provider state. Treat a monitor that refreshes provider
state periodically as polling and apply the selected polling interval; repeated
provider requests are not an event mechanism. When no non-polling event
mechanism is available, wait for the deadline alone. Race an available relevant
event against the scheduled deadline.

Treat the complete interval as one passive wait. Request the complete remaining
duration in one waiting operation when the runtime supports it. Do not
voluntarily divide the interval into shorter waits or create a short
wake-and-check loop. If the runtime forces a return before the deadline without
a relevant event, compare the current time with the retained deadline and
immediately continue waiting for the remaining duration.

Before the round ends, do not retrieve provider state, reclassify the PR,
recalculate the interval, or send a user-facing status update. A message that
the current waiting round has not ended is not a valid update.

When the deadline or a relevant event ends the round, cancel any remaining
wait, retrieve one complete current PR state, and begin a new observation
cycle. The event is only a wake-up signal; the newly retrieved complete state
remains authoritative. Complete observation and classification before sending
the optional boundary update described above or taking another cycle action.

## Interrupt unavailable waiting

When the runtime cannot preserve the round and its deadline across forced
returns, persistent waiting is unavailable. Return that condition, or execution
stopping before the deadline, as an interruption to the main workflow. Preserve
the checkpoint owned by
[Establish the watch contract](establish-watch-contract.md#preserve-and-resume-the-watch)
so a later execution can resume without claiming that this watch completed.

An interrupted round's deadline does not remain an active schedule after
execution stops. Checkpoint resume enters complete observation immediately. If
that new execution then selects waiting, treat it as the first waiting round of
the current execution and select five minutes.
