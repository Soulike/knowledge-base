# Wait for results

Enter only when the main workflow selects waiting after complete observation
and classification. Human-owned items and frozen mutations remain recorded;
wait for the independently progressing automatic results selected by that
classification. Within one persistent execution, retain this waiting state and
its scheduled polling interval until the next observation classifies the state.

Prefer a runtime mechanism that can wake on a relevant event without
periodically retrieving provider state. Treat a monitor that refreshes provider
state periodically as polling and apply the polling cadence below. Race a
relevant event against the scheduled poll. When either wakes the watch, cancel
any remaining scheduled poll, retrieve one complete current PR state, and begin
a new observation cycle. The event is only a wake-up signal; the newly
retrieved complete state remains authoritative.

Treat each scheduled interval as one passive wait. Continue that same wait
through runtime yields, tool returns, or execution continuations that occur
before the deadline without a relevant event. They do not trigger a provider
read, interval recalculation, or progress update.

When an observation enters or returns to waiting, schedule a five-minute poll
if no preceding waiting state is retained from the current execution. When a
preceding state exists, restart with a five-minute interval if a semantic change
affects an active item's identity, status, content, or disposition. Passage of
time and provider metadata that does not affect classification do not reset the
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
4. Schedule the shortest candidate across all awaited automatic results.

This produces a deterministic fallback of five minutes and then ten minutes
while allowing applicable duration patterns observed during the watch to
shorten a later interval. Do not create a separate mandatory history-retrieval
loop or post periodic or no-op status comments.

When persistent waiting is unavailable or execution stops before the deadline,
return an interruption to the main workflow. Preserve the checkpoint owned by
[Establish the watch contract](establish-watch-contract.md#preserve-and-resume-the-watch)
so a later execution can resume without claiming that this watch completed.
