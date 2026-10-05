# JavaScript date and time handling

## Scope

This document defines project-independent guidance for choosing JavaScript date and time representations, preferring `Temporal` when the target runtime supports it, containing legacy `Date` behavior at compatibility boundaries, and selecting tests for the calendar, time-zone, parsing, arithmetic, and serialization faults that the code can actually encounter.

## When to update

Update this document when ECMAScript changes relevant `Date` or `Temporal` semantics, target runtimes materially change native `Temporal` availability, or recurring production defects expose a missing representation, boundary, arithmetic, serialization, or test principle.

## Model the value before choosing an API

Date and time values do not all represent an instant on one timeline. Establish the domain meaning before parsing, storing, comparing, or calculating:

| Meaning                                                                             | Prefer                   |
| ----------------------------------------------------------------------------------- | ------------------------ |
| An exact point in time, such as when an event occurred                              | `Temporal.Instant`       |
| A calendar date without a time or time zone, such as a birthday                     | `Temporal.PlainDate`     |
| A wall-clock date and time whose time zone is deliberately absent or supplied later | `Temporal.PlainDateTime` |
| An exact time together with the named time zone whose calendar rules matter         | `Temporal.ZonedDateTime` |
| A length used in date or time arithmetic                                            | `Temporal.Duration`      |

A numeric UTC offset describes one relationship to UTC at one instant. It does not preserve the rules of a named time zone for daylight-saving or historical offset changes. Keep the named time-zone identifier when local calendar meaning, future scheduling, or zone-aware arithmetic must survive storage or transport.

## Prefer Temporal when the runtime supports it

Use `Temporal` for new date and time domain logic when every target runtime implements the required types and methods. Check runtime capability independently from TypeScript declarations or successful compilation. When native support is absent, follow the project's established compatibility decision and keep any legacy or library-specific representation behind a narrow boundary.

Temporal makes the value's meaning explicit and keeps its objects immutable. It also makes important policy choices visible. Use `overflow: "reject"` when out-of-range object fields must fail instead of being constrained, and choose a `disambiguation` policy when a local time can be repeated or skipped by an offset transition. Do not assume that adopting Temporal removes the need to define these behaviors.

Keep `Date` at an integration boundary when a platform or dependency requires it, then convert after validating the value:

```js
function dateToInstant(date) {
  const epochMilliseconds = date.getTime();

  if (!Number.isFinite(epochMilliseconds)) {
    throw new RangeError("Invalid Date");
  }

  return Temporal.Instant.fromEpochMilliseconds(epochMilliseconds);
}

function instantToDate(instant) {
  return new Date(instant.epochMilliseconds);
}
```

The finiteness check establishes only that an existing `Date` contains a representable instant; it does not validate the calendar input from which that `Date` was constructed. The conversion preserves the millisecond instant. Converting to `Date` loses sub-millisecond precision and does not preserve a named time zone, calendar, or wall-clock interpretation. Supply the intended time zone explicitly before deriving calendar fields from an instant.

## Contain legacy Date semantics

A valid `Date` represents an epoch-millisecond instant. It does not retain the input's original time zone, UTC offset, string form, or date-only meaning. Treat these behaviors as boundary hazards:

- The standardized date-only string `YYYY-MM-DD` is interpreted at UTC midnight. Displaying that instant with local getters in a zone west of UTC can produce the preceding calendar date. A date-only domain value should remain a date-only string or become `Temporal.PlainDate`, rather than being routed through `Date`.
- Numeric construction uses the host's local time zone and zero-based months. For example, `new Date(2026, 7, 21)` represents a local time in August, not July.
- An `Invalid Date` has a numeric value of `NaN`, but a finite value does not prove that the original calendar input was valid. Component constructors and setters normalize overflowing fields, and implementation-dependent string parsing can accept unintended forms. Validate both the input syntax and the calendar-field combination before constructing a `Date`, or use the appropriate Temporal parser with rejecting behavior.
- Setter methods mutate the instance and normalize overflowing fields. Shared references can therefore change unexpectedly, and operations such as incrementing the month can cross more than one calendar boundary. Clone before an unavoidable mutation and validate the result.
- Local getters and UTC getters project the same instant through different time-zone assumptions. Choose one family deliberately and do not mix them within one calculation.
- Adding a fixed millisecond count answers an elapsed-time question. It does not reliably express a calendar operation such as "the same local time tomorrow" or "one month later" because local days can be 23 or 25 hours and months have different lengths.
- `toJSON()` and `toISOString()` serialize a valid `Date` as a UTC instant. That representation cannot recover the original numeric offset, named time zone, or wall-clock intent.

Parse only formats owned by the input contract. Include an explicit `Z` or numeric offset when a string represents an instant, and reject strings that omit information the contract requires. Validate the grammar and calendar values before legacy `Date` parsing. When a boundary must construct a `Date` from separate fields, compare the resulting fields with the input in the same local or UTC basis so normalization cannot silently change the value. Avoid implementation-dependent date strings. At persistence and API boundaries, distinguish date-only values, offset-bearing instants, local date-times, and zoned schedules in the schema rather than relying on one generic "date" field.

For occurred events, a UTC instant is usually the durable value. For future or recurring local schedules, retain the local calendar fields and named time zone needed to recompute the applicable instant, together with an explicit policy for repeated or skipped local times. Derive presentation values at the boundary that knows the viewer's time zone.

## Select targeted behavioral tests

Apply [Test effectiveness](../software-testing/test-effectiveness.md) to name the live contract and realistic date/time fault before adding coverage. Exercise only the dimensions that can change the owning code's result. Relevant cases commonly include:

- the same date-only or instant input under UTC and at least one materially different time zone;
- a daylight-saving gap or overlap in a named zone when the code converts or calculates local times;
- month-end, year-end, and leap-day arithmetic when calendar units are involved;
- invalid, impossible-but-normalized, missing-offset, or out-of-range input at a parsing boundary;
- a serialization round trip that proves the contract preserves the required instant, date-only meaning, or named-zone context;
- mutation or aliasing when legacy `Date` setters remain in use; and
- the chosen Temporal overflow, offset-conflict, or disambiguation behavior when the default would also produce a plausible result.

Control the time zone and clock through the test environment's supported seam instead of relying on the developer machine. A fake clock controls the current instant but does not by itself exercise time-zone rules or daylight-saving transitions. Use explicit expected values and a positive control so a broken fixture cannot satisfy a negative assertion accidentally. Avoid a broad matrix when one representative boundary case exposes the named fault.

## References

- [Your JS Date Is Lying to You](https://blog.gaborkoos.com/posts/2026-07-21-Your-JS-Date-Is-Lying-to-You/)
- [TC39 Temporal documentation](https://tc39.es/proposal-temporal/docs/)
- [TC39 Temporal `Instant` documentation](https://tc39.es/proposal-temporal/docs/instant.html)
- [TC39 Temporal `ZonedDateTime` documentation](https://tc39.es/proposal-temporal/docs/zoneddatetime.html)
- [ECMAScript Date Time String Format](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format)
