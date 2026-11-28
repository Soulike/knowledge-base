# Avoiding unnecessary React Effects

## Scope

This document defines project-independent React practices for deciding whether
logic belongs in a React Effect (`useEffect` or `useLayoutEffect`) or in an
idiomatic React alternative, covering render-time data derivation and caching,
state reset and adjustment on prop changes, event-driven side effects and state
transitions, parent–child data flow, once-per-app initialization, external-store
subscriptions, and race-safe Effect data fetching. Isolating non-reactive
callbacks inside an already warranted Effect, linter rule configuration, and
selecting specific state-management or data-fetching libraries are outside its
scope.

## When to update

Update this document when React changes Effect, rendering, state-preservation,
`useMemo`, React Compiler, `useSyncExternalStore`, Strict Mode, or built-in
data-fetching semantics in ways that alter when Effects are warranted or which
built-in alternatives replace them.

## Decide whether an Effect is needed

React Effects (`useEffect`, `useLayoutEffect`) are an escape hatch for
synchronizing a component with an **external system**—such as a non-React UI
widget, network endpoint, or browser API—while the component is displayed. When
no external system is involved, an Effect is usually unnecessary.

Two common categories of component logic do **not** belong in Effects:

- **Transforming data for rendering.** Updating React state inside an Effect
  after props or state change forces React to render and commit stale output to
  the DOM first, run the Effect, and then restart the render-and-commit cycle
  from scratch. Compute derived values directly during render so React produces
  consistent output in a single pass.
- **Handling user interactions.** Event handlers know _which_ specific action
  the user performed. By the time an Effect runs, it only observes rendered
  state and cannot reliably distinguish a fresh user action from an initial
  mount, page reload, or state restoration.

When unsure whether code belongs in an Effect or an event handler, ask **why
the code needs to run from the user's perspective**:

- If it runs **because the component was displayed** (or must stay synchronized
  with an external system while displayed), keep it in an Effect.
- If it runs **because of a specific user interaction**, keep it in an event
  handler.

| Situation                                                      | Preferred React mechanism                                                                        |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Value derivable from existing props or state                   | Compute directly during render                                                                   |
| Expensive pure calculation repeated on unrelated updates       | Isolate unrelated state into a child component, or cache with `useMemo` / React Compiler         |
| Resetting all state of a subtree when an identity prop changes | Pass a `key` to an inner component                                                               |
| Adjusting partial state when a prop changes                    | Derive from a stored ID during render; only as a last resort, adjust guarded state during render |
| Side effects or mutations caused by user actions               | Run in event handlers (extracting shared helpers when multiple handlers share logic)             |
| Multi-step state transitions triggered by one event            | Derive what you can during render and compute all next state updates in the event handler        |
| Keeping parent and child state synchronized                    | Update both in the same event handler (batched) or lift state up to a controlled component       |
| One-time initialization per browser application load           | Guard with a module-level flag inside root setup or run at entry-point module load               |
| Subscribing to mutable external or browser state               | Use `useSyncExternalStore` (React 18+) in a custom Hook                                          |
| Fetching view data synchronized with reactive inputs           | Use framework/library data loading, or an Effect with stale-response cleanup in a custom Hook    |

## Derive values and cache expensive calculations during render

Do not store values that can be computed from existing props or state in a
separate `useState` synchronized by `useEffect`. Redundant state creates stale
intermediate renders, extra commit passes, and state-desynchronization bugs:

```tsx
// Avoid: redundant state and cascading Effect re-render
const [fullName, setFullName] = useState("");
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// Preferred: compute directly during render
const fullName = `${firstName} ${lastName}`;
```

Apply the same rule to filtered lists, formatted values, and derived JSX.

Do not pre-emptively wrap every derived calculation in `useMemo` or store it in
an Effect. Most computations—unless iterating over or allocating thousands of
objects—are fast enough to run directly during render. Before optimizing a
**pure** render calculation, measure the interaction in a **production build**
under realistic or CPU-throttled conditions (development builds with Strict Mode
intentionally double-render components and skew timings; a total calculation
time around `1ms` or higher during an interaction is a practical threshold for
checking whether caching helps).

When measurement confirms that unrelated state updates repeatedly re-run an
expensive pure calculation, choose between two Effect-free remedies:

- **Isolate unrelated fast-changing state:** Move state that does not affect the
  calculation (such as a draft input value) into a child component so updating
  it no longer re-renders the parent performing the calculation.
- **Memoize with `useMemo`:** Wrap the pure calculation in
  `useMemo(() => compute(a, b), [a, b])` so React reuses the cached result while
  dependencies remain unchanged by `Object.is`. `useMemo` skips recalculation on
  updates rather than speeding up the initial render, and only works for pure
  functions without side effects. In codebases using React Compiler, automatic
  memoization eliminates the need for manual `useMemo` in many pure-calculation
  cases.

## Reset or adjust state when props change

Resetting or adjusting component state inside `useEffect` when a prop changes
renders the component and its children with stale state first and then triggers
a second render pass. Choose from these alternatives in order of preference:

1. **Derive from a stable identifier during render (best for partial state).**
   Instead of storing a selected item object and clearing it in an Effect when
   `items` changes, store `selectedId` and derive the active object during
   render:

   ```tsx
   const [selectedId, setSelectedId] = useState<string | null>(null);
   const selection = items.find((item) => item.id === selectedId) ?? null;
   ```

   No adjustment logic is needed: the selection stays valid when the matching
   item remains in `items` and automatically becomes `null` when it disappears.

2. **Reset an entire subtree with `key`.** When a changing identity prop (such
   as `userId` or `savedContact.id`) represents a conceptually different entity
   whose local and nested state should all clear, split the component into an
   exported outer wrapper and an inner component keyed by that identity:

   ```tsx
   export function ProfilePage({ userId }: { userId: string }) {
     return <Profile userId={userId} key={userId} />;
   }

   function Profile({ userId }: { userId: string }) {
     const [comment, setComment] = useState("");
     // All state in Profile and its descendants resets cleanly when userId changes.
   }
   ```

   React treats distinct keys as distinct component instances, recreating the
   DOM and resetting all descendant state in one pass while keeping `key` an
   implementation detail hidden from callers of `ProfilePage`.

3. **Adjust partial state during render (last resort).** Only when neither
   deriving nor resetting the subtree with `key` can express the requirement,
   store the previous prop in `useState` (not in a `useRef`, because reading or
   mutating `ref.current` during render violates component purity) and update
   the affected state conditionally during render:

   ```tsx
   const [prevItems, setPrevItems] = useState(items);
   const [selection, setSelection] = useState<Item | null>(null);
   if (items !== prevItems) {
     setPrevItems(items);
     setSelection(null);
   }
   ```

   When state is updated during render, React discards the returned JSX and
   immediately retries rendering the component before rendering its children or
   updating the DOM, so children never render with the stale value. Follow
   React's constraints strictly: update only the **same** component's state
   (updating another component during render throws an error), guard the update
   with a convergence condition such as `items !== prevItems` to prevent
   infinite render retries, and keep render pure (no DOM mutations, timers, or
   other side effects).

## Keep interaction logic and transitions in event handlers

Do not route user-triggered actions through state flags and `useEffect`.

- **Share logic with plain functions, not Effects.** When multiple interactions
  (such as "Buy" and "Checkout" buttons) share side effects like adding to a
  cart and showing a notification, extract a helper function and call it from
  each event handler. Moving the notification into an Effect watching
  `product.isInCart` causes bugs such as re-showing the notification on every
  page reload when persisted cart state already has `isInCart === true`.
- **Separate display Effects from interaction logic.** Sending a page-view
  analytics event belongs in an Effect because it runs when the component is
  displayed; sending interaction analytics (such as tracking a button click) or
  a `POST` request to submit a form or purchase an item belongs in the
  submit/click handler, never in an Effect watching a `jsonToSubmit` or
  `!showForm` state flag:

  ```tsx
  function RegistrationForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    // Runs because the form was displayed
    useEffect(() => {
      post("/analytics/event", { eventName: "visit_form" });
    }, []);

    function handleSubmit(event: FormEvent) {
      event.preventDefault();
      // Runs because the user submitted the form
      post("/api/register", { firstName, lastName });
    }
  }
  ```

- **Replace Effect chains with render derivation and single-event transitions.**
  Chaining multiple Effects where each updates state solely to trigger the next
  causes an extra full re-render per link and breaks non-linear state changes
  (such as restoring historical state snapshots, which inadvertently re-fire the
  chain). Compute derivable state (such as `const isGameOver = round > 5`)
  during render and calculate all coupled next state updates directly inside the
  triggering event handler. Remember that React state behaves like a
  **snapshot** within an event handler: after calling `setRound(round + 1)`, the
  `round` variable still holds the current render's value, so store
  `const nextRound = round + 1` in a local variable when later lines in the same
  handler depend on the updated value.
- **Distinguish genuine external-system chains.** Chaining asynchronous steps
  remains appropriate only when later inputs genuinely require synchronizing
  with an external system—for example, fetching options for a dependent dropdown
  after the user selects a value in an upstream dropdown.

## Keep parent–child data flow unidirectional and batched

Do not use `useEffect` to push local state changes or fetched data upward to a
parent component:

- **Batch parent notifications in the event handler.** Calling `onChange(isOn)`
  inside an Effect after `setIsOn(nextIsOn)` forces the child to render and
  commit before notifying the parent, triggering a second render pass. Update
  both in the same event handler instead; React batches state updates across
  components into a single render pass:

  ```tsx
  function updateToggle(nextIsOn: boolean) {
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }
  ```

- **Lift state up to avoid dual-state synchronization.** Whenever you are trying
  to keep state in two components synchronized, prefer making the child
  controlled by passing both the value (`isOn`) and updater (`onChange`) from
  the parent so there is one source of truth.
- **Fetch in the parent and pass data down.** Never fetch data inside a child
  component and pass it up through `useEffect(() => { if (data) onFetched(data); })`.
  Let the common parent (or shared data owner) fetch the data and pass it down
  through props so React's top-down data flow remains traceable.

## Separate once-per-app initialization from component mounts

An Effect with an empty dependency array (`useEffect(..., [])`) runs on every
component **mount**, not once per application lifetime. React's development
Strict Mode intentionally mounts, cleans up, and remounts components to verify
resilience, and production code can also remount top-level trees. Non-idempotent
startup work (such as consuming or validating a one-time authentication token)
breaks when placed in an unguarded mount Effect.

Keep every component—including `App`—resilient to remounting. For logic that
must run **once per browser application load** rather than once per mount:

- guard the startup logic inside the root Effect with a module-level flag
  declared outside the component (`let didInit = false;`) so it runs on the
  client at most once per module load; or
- execute it at module top level inside the application entry point or root
  module, guarded with `if (typeof window !== "undefined")` so server-side
  rendering does not run browser-only initialization.

Do not place top-level initialization side effects in arbitrary reusable
component modules, because top-level code runs whenever a module is imported
even if the component is never rendered. Keep in mind that module-level flags
persist across remounts within the same JavaScript module instance (including
across tests unless explicitly reset).

## Subscribe to external stores with `useSyncExternalStore`

When a component must read mutable data outside React—such as a browser API
(`navigator.onLine`, `matchMedia`) or a third-party external store—prefer
React's built-in `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)`
Hook (available since React 18) wrapped in a reusable custom Hook instead of
manually wiring `useState` and `useEffect` event listeners:

```tsx
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
}
```

Satisfy `useSyncExternalStore`'s contract to avoid redundant subscriptions,
infinite re-renders, or SSR failures:

- **Stable `subscribe` reference:** Declare `subscribe` outside the component
  (or memoize it) and return an unsubscribe cleanup function; passing a new
  `subscribe` function on re-render causes React to re-subscribe each time.
- **Immutable or cached snapshots:** While the store has not changed, repeated
  calls to `getSnapshot` must return the same value by `Object.is`; returning a
  fresh object or array on every call triggers repeated re-renders.
- **Server snapshot for SSR/hydration:** Provide `getServerSnapshot` whenever
  the component may render on the server, returning a value consistent between
  server rendering and initial client hydration (omitting it throws during
  server rendering).

## Handle genuine data-fetching Effects safely and at the right boundary

Fetching view data driven by reactive inputs (such as search `query` and `page`)
_is_ external-system synchronization: the results must stay synchronized with
the network while the component is displayed regardless of whether inputs came
from typing, initial URL parameters, or Back/Forward navigation.

However, a naive fetch inside `useEffect` suffers from **out-of-order response
race conditions**: an earlier request (such as `"hell"`) can resolve after a
later request (`"hello"`) and overwrite the newer results. Always pair an Effect
fetch with cleanup that ignores stale responses—for example, a closure-scoped
`let ignore = false` flag flipped to `true` in cleanup, which works for any
Promise-based fetch. When the transport supports cancellation (such as `fetch`
with `AbortController`), you can also pass `controller.signal` and call
`controller.abort()` in cleanup to stop avoidable in-flight work while ignoring
aborted or stale completions:

```tsx
function useData<T>(url: string): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then((response) => response.json())
      .then((json: T) => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);

  return data;
}
```

Recognize the architectural limits of fetching directly in Effects. Raw Effect
fetching does not by itself provide response caching across Back/Forward
navigation, server-side data loading for initial HTML, network-waterfall
avoidance, or unified loading/error state management. Prefer the active
framework's built-in data-fetching mechanism or an established data-fetching
library when available. When fetching with Effects directly, extract the fetch
and cleanup logic into a declarative custom Hook so components avoid raw
`useEffect` calls and can migrate to a stronger fetching layer later.

## References

- [React guide: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React guide: Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [React reference: `useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore)
- [React reference: `useMemo`](https://react.dev/reference/react/useMemo)
