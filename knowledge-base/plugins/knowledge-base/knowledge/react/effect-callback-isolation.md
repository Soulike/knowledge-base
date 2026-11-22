# Isolating non-reactive callbacks in React Effects

## Scope

This document defines project-independent React practices for calling non-reactive callbacks inside `useEffect` and `useLayoutEffect` without introducing infinite re-render loops or stale closures. It covers distinguishing reactive inputs from event-like callbacks, choosing between `useEffectEvent` and Effect-synchronized `useRef` by React version and package `peerDependencies`, and testing callback-bearing Hooks; general React state architecture, component rendering design, `useInsertionEffect`, and linter configuration are outside its scope.

## When to update

Update this document when React changes Effect, `useEffectEvent`, `useRef`, or component-purity semantics, introduces a replacement Effect-event primitive, or changes the React version boundary where `useEffectEvent` is available.

## Separate reactive inputs from non-reactive callbacks

React re-runs an Effect whenever any value in its dependency array changes by `Object.is`. Callers frequently pass inline arrow functions or un-memoized callbacks such as `onSuccess`, `onError`, or completion handlers, whose function identity changes on every render.

When an Effect also triggers a state update (such as `setState`) and lists a caller callback in its dependency array—for example, to satisfy a mechanical dependency-completeness rule—the Hook can enter an infinite loop or repeatedly re-fire side effects:

1. The Effect completes and calls `setState` (and possibly the callback).
2. The state update schedules a re-render of the component or parent.
3. The caller creates a new inline callback reference on the new render.
4. React sees a changed function dependency and re-runs the Effect, repeating the cycle.

Separate values inside an Effect into two roles before choosing its dependencies:

- **Reactive inputs** define _what_ the Effect synchronizes with (such as a `roomId`, query parameter, or fetched record input). Keep them in the dependency array so changing them re-synchronizes the Effect.
- **Non-reactive callbacks** react _when_ an Effect event or async settlement occurs (such as `onSuccess(result)` or `onError(error)`). They need to see the latest render values when called, without causing the Effect itself to re-run when only the caller's function identity changes.

Before isolating a callback inside `useEffect`, check whether the Effect is needed at all. If an Effect only transforms existing reactive props or state into derived state, compute the derived value directly during render (or with `useMemo` when caching expensive work) instead of pairing `useState` with `useEffect`. When work starts from a user event or imperative handler rather than a synchronization lifecycle, invoke completion callbacks directly from that handler or operation owner instead of routing them through `useState` and `useEffect`.

For example, consider a custom Hook `useIndexedRecords(records, onSuccess)` that indexes fetched `records` into a `Map`, stores it in state inside `useEffect`, and calls `onSuccess?.(map)`. Putting `[records, onSuccess]` in the dependency array causes any caller passing `useIndexedRecords(records, (map) => logCount(map.size))` to re-trigger the Effect on every state-driven re-render. Deriving the `Map` during render eliminates the `setState` cycle; where a genuine Effect still notifies `onSuccess` on settlement, isolate `onSuccess` from the Effect's reactive dependencies using the version-appropriate pattern below.

## Choose the isolation mechanism by React version

Select the callback-isolation mechanism according to the lowest React runtime version the code must support, including any library `peerDependencies` range.

### React 19.2 and newer: `useEffectEvent`

React 19.2 introduced `useEffectEvent` as a stable Hook for separating non-reactive event logic from Effects. Wrap the notification callback with `useEffectEvent` at the top level of the component or custom Hook and invoke the resulting Effect Event inside `useEffect`:

```tsx
import { useEffect, useEffectEvent } from "react";

function useSubscription(
  channelId: string,
  onMessage?: (payload: Message) => void,
) {
  const handleMessage = useEffectEvent((payload: Message) => {
    onMessage?.(payload);
  });

  useEffect(() => {
    const subscription = subscribe(channelId, (payload) => {
      handleMessage(payload);
    });
    return () => subscription.unsubscribe();
  }, [channelId]);
}
```

`handleMessage` always reads the latest `onMessage` from the most recent committed render without appearing in the `useEffect` dependency array. Effect Event functions intentionally change identity on every render so they cannot be treated as stable dependencies.

Follow React's `useEffectEvent` constraints strictly:

- **Top-level declaration:** Call `useEffectEvent` only at the top level of your component or custom Hook, never inside loops, conditions, or nested functions.
- **Effect-only call sites:** Call the returned Effect Event only from inside Effects (`useEffect`, `useLayoutEffect`, `useInsertionEffect`) or other Effect Events in the same component or Hook. Never call it during rendering or pass it to child components or other Hooks.
- **Do not hide reactive inputs:** Keep every value that should re-synchronize the Effect (such as `channelId`) in the dependency array rather than reading it through `useEffectEvent` to bypass dependency rules.
- **Package compatibility:** In a published library that declares `peerDependencies`, adopting `useEffectEvent` requires setting the minimum `react` peer version to `>=19.2.0` (or providing a compatible fallback), because React releases prior to `19.2.0` do not export stable `useEffectEvent`.

### Before React 19.2: `useLayoutEffect`-synchronized `useRef`

When targeting React versions older than `19.2.0`—or maintaining a library whose `peerDependencies.react` still permits `<19.2.0`—store the latest callback in a `useRef` object (whose identity is stable across renders) and update its `.current` property inside `useLayoutEffect`:

```tsx
import { useEffect, useLayoutEffect, useRef } from "react";

function useSubscription(
  channelId: string,
  onMessage?: (payload: Message) => void,
) {
  const onMessageRef = useRef(onMessage);

  useLayoutEffect(() => {
    onMessageRef.current = onMessage;
  });

  useEffect(() => {
    const subscription = subscribe(channelId, (payload) => {
      onMessageRef.current?.(payload);
    });
    return () => subscription.unsubscribe();
  }, [channelId]);
}
```

Keep both `onMessage` and `onMessageRef` out of the consuming `useEffect` dependency array. Because `onMessageRef` is created by `useRef`, its object identity stays constant while `useLayoutEffect` updates `onMessageRef.current` synchronously after DOM mutations and before any `useEffect` runs, ensuring the ref points to the latest committed callback without re-triggering the consuming Effect.

Do **not** write `onMessageRef.current = onMessage` directly in the render body. As React's [`useRef` documentation](https://react.dev/reference/react/useRef#caveats) warns, reading or writing `ref.current` during rendering (except lazy one-time initialization) violates component purity and makes behavior unpredictable: React expects rendering with the same props, state, and context to be pure and side-effect-free across repeated or interleaved calls (such as Strict Mode double-rendering or Concurrent renders that are discarded or replayed before commit), so mutating `ref.current` during render can leak an uncommitted callback into committed effects or other renders. Instead, perform ref updates in event handlers or Effects as React recommends.

Once the project's minimum supported React version reaches `19.2.0`, prefer `useEffectEvent` because React provides the latest committed values inside the Effect Event directly—without manual ref synchronization—and rejects render-time calls at runtime (with static checks covering the remaining call-site and dependency rules).

## Verify callback isolation with Hook tests

Verify callback-bearing custom Hooks with focused Hook tests (for example using `renderHook` or a minimal host component) covering both failure modes:

1. **Inline callback stability after settlement:** Pass a fresh inline callback on a subsequent rerender while keeping reactive inputs unchanged, and assert that the Effect does not re-run and the callback is not invoked again.
2. **Latest callback delivery before async settlement:** Hold an asynchronous operation pending (for example with a controlled Promise barrier), rerender the Hook with a replacement callback before the operation settles, then resolve the operation and assert that only the replacement callback—not the stale initial callback—is invoked.

## References

- [React 19.2 release notes: `useEffectEvent`](https://react.dev/blog/2025/10/01/react-19-2#use-effect-event)
- [React reference: `useEffectEvent`](https://react.dev/reference/react/useEffectEvent)
- [React reference: `useRef`](https://react.dev/reference/react/useRef)
- [React guide: Separating Events from Effects](https://react.dev/learn/separating-events-from-effects)
