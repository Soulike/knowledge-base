# Route and apply React Effect callback isolation

## Identity

- ID: react-effect-callback-routing
- Kind: journey

## Covered objects

- [React Handbook](../../skills/handbook-react/SKILL.md)
- [React Effect callback isolation](../../knowledge/react/effect-callback-isolation.md)

## Protected behavior

React Effect callback-isolation tasks and focused-learning requests must
select the React Handbook, match its Effect callback-isolation package, and
apply the reactive-versus-callback distinction, React version tradeoff
(`useEffectEvent` versus Effect-synchronized `useRef`), and Hook verification
invariants without recommending render-time `ref.current` mutation, while
non-Effect React requests must result in a valid sparse no-match inside the
React Handbook.

## Task

Handle these four independent requests:

1. Review a custom React Hook `useIndexedRecords(records, onSuccess)` that
   calls `setRecordsMap` and `onSuccess?.(map)` inside `useEffect`. Callers
   pass inline arrow functions for `onSuccess`, and the library declares
   `peerDependencies: { "react": ">=18.0.0" }`. Explain the bug risk, recommend
   a fix compatible with the declared React support, and specify the Hook
   tests needed to verify it.
2. Explain when to use React's `useEffectEvent` versus a `useRef` to avoid
   stale closures or infinite re-render loops from callbacks inside
   `useEffect`, including React's constraints on both approaches.
3. Our React 19.2 app component passes an inline `onConnected` callback into a
   `useEffect` that manages a chat connection for `roomId`. Update the pattern
   so changing `onConnected` does not reconnect the room while always invoking
   the latest callback.
4. Explain how React Context avoids prop drilling across deeply nested layout
   components. No `useEffect`, `useLayoutEffect`, or Hook callbacks are
   involved.

## Starting state

Construct the candidate selection set from the frontmatter of every direct
installed Skill entrypoint under `knowledge-base/plugins/knowledge-base/skills/*/SKILL.md` in
the tested snapshot. Supply only registered names, descriptions, and paths for
the initial selection step before opening any Skill body. Record the Skill
choices for all four requests before permitting read-only access to the
complete chosen Skill bodies and their direct canonical Knowledge routes. Keep
the four requests independent and do not modify repository files.

## Expected behavior

- R1 (critical): select `handbook-react` natively for all four React requests
  (co-selection of `handbook-javascript-typescript`,
  `handbook-software-engineering`, `workflow-write-effective-tests`, or
  `workflow-review-and-improve-tests` where applicable is allowed).
- R2 (critical): inside `handbook-react`, match and read the Effect
  callback-isolation package for requests 1, 2, and 3, and validly match no
  package (excluding the Effect callback-isolation file) for request 4 without
  inventing React Context guidance from the Handbook or claiming the Handbook
  covers all of React.
- R3 (critical): for request 1, identify the inline-callback identity +
  `setState` re-render loop risk (and note render-time derivation if `Map` is
  merely derived state), respect `peerDependencies.react >= 18.0.0` by choosing
  the `useLayoutEffect`-synchronized `useRef` pattern, explicitly avoid
  mutating `ref.current` during render, and specify Hook tests for both
  post-settlement inline callback identity changes and pre-settlement async
  callback updates.
- R4 (critical): for request 2, explain reactive inputs versus non-reactive
  callbacks, the React 19.2 boundary for `useEffectEvent` (top-level only,
  Effect-only call sites, not hiding reactive dependencies, non-stable
  identity), and the Effect-synchronized `useRef` alternative for pre-19.2
  compatibility without writing `ref.current` during render.
- R5 (critical): for request 3, keep `roomId` as a reactive dependency, wrap
  `onConnected` with `useEffectEvent` (since the app targets React 19.2), call
  the Effect Event inside `useEffect`, and omit the Effect Event from the
  dependency array.

## Verification

Inspect native Skill selection, post-body `handbook-react` package choices,
read-file evidence, and the final response for each of the four requests
separately. A faulty observation that misses `handbook-react`, loads the Effect
callback-isolation file for request 4, recommends writing `callbackRef.current =
callback` during render in request 1 or 2, or recommends `useEffectEvent`
without addressing the `>=18.0.0` peer dependency in request 1 must fail the
corresponding critical criterion.

## Source

Reconstructed from GitHub issue #278 (which supplies the `useIndexedRecords`
custom Hook and `useEffectEvent` versus `useRef` scenarios) together with React
`useEffectEvent` and Context scenarios to test sparse-Handbook routing and
callback-isolation application against the completed Handbook and Knowledge.
