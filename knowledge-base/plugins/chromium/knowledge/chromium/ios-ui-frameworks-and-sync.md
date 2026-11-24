# Chromium iOS UIKit, SwiftUI, and UI synchronization

## Scope

This document explains Chromium's iOS rules for choosing Objective-C++, Swift, UIKit, or SwiftUI, implementing UIKit view-controller and SwiftUI observable-state boundaries, and using `ChromeBroadcaster` for specialized fullscreen UI-property synchronization. It supports implementing or reviewing the UI-framework layer of Chromium and Chromium-derived iOS browsers, assuming familiarity with iOS UI development and Chromium's coordinator–mediator role separation.

## When to update

Update this document when Chromium changes its iOS Swift or SwiftUI adoption rules, language best practices, SwiftUI observable-state mediator guidance, or `ChromeBroadcaster`, `FullscreenController`, and `FullscreenBrowserAgent` ownership, availability, and cleanup behavior.

## UIKit implementation

### Language and view-controller boundary

Swift is a language; UIKit and SwiftUI are UI frameworks. A UIKit view controller written in Swift keeps the same architectural role as one written in Objective-C++.

Chromium's default language for UIKit UI, coordinators, mediators, and inter-layer protocols is Objective-C++ (`.mm`). Swift may replace Objective-C++ for isolated `UIView` and `UIViewController` subclasses where C++ interoperability permits. Coordinate with Chromium's iOS owners before introducing Swift into a new target because it affects build time and binary size. These are upstream adoption rules, not a requirement for every Chromium-derived browser to use the same approval process.

A view controller renders UI-ready values and translates gestures into calls on its protocol-typed collaborators. It must not import model types, locate services, or create and coordinate concrete feature peers. Keep consumer, mutator, and command interfaces narrow: their methods express UI state or user intent rather than exposing a mediator's internal API.

The view controller remains the UIKit composition primitive: a container view controller may place children supplied to it. The coordinator is the feature's **composition root**, meaning the object that chooses the concrete children, connects their dependencies, and owns their lifecycle. UIKit work and consumer updates belong on the main thread.

### Specialized UI-property synchronization

Ordinary model observation and UI updates travel from the mediator through a consumer protocol or observable UI state. `ChromeBroadcaster` serves a narrower role: synchronizing a defined set of UI-layer properties while hiding the identity of the object producing each value. Its observer protocol restricts participating properties; it is not a general-purpose observation or notification bus, and it does not carry commands or model events.

#### Fullscreen availability and access

`FullscreenControllerImpl` creates and strongly owns fullscreen's broadcaster. Its `FullscreenController` interface is attached to a `Browser` as `BrowserUserData`, which associates an object and its lifetime with that browser. Obtain the installed controller with `FullscreenController::FromBrowser(browser)`, then use `broadcaster()`. `Browser` itself has no broadcaster accessor.

Normal browser-agent setup installs the controller for regular and incognito browsers, not inactive or temporary browsers. A broadcaster is therefore not available on every `Browser`.

#### Cleanup and alternate paths

The controller is browser-scoped and is destroyed when its user data is removed or its browser is destroyed. Stopping a feature's UI does not itself destroy it: UI participants must stop broadcasts and remove observations when they disconnect.

In the inspected `BrowserViewController` implementation, enabling fullscreen refactoring bypasses broadcasting and uses `FullscreenBrowserAgent` instead. Check the target feature's active fullscreen path before choosing this mechanism; broadcaster-based synchronization is not the default for new UI state.

## SwiftUI implementation

### Supported scope

Chromium uses SwiftUI where system frameworks require it, such as WidgetKit. Within the main app, upstream permits simple, self-contained UI surfaces without complex cross-feature interactions and requires coordination with iOS owners before starting. Its best-practices guide also timeboxes an intractable SwiftUI framework bug: after 1–2 engineer-days without a resolution, rebuild that view in UIKit. These upstream constraints bound adoption; using SwiftUI does not replace the coordinator–mediator architecture.

### Observable UI state

SwiftUI views observe a UI-layer state object, using `ObservableObject` or `@Observable`, defined in the feature's `ui/` directory. The mediator holds a reference to that object and updates its properties on the main sequence as model events arrive. This replaces imperative consumer-method calls for state delivery:

| Implementation | State-update path                                                                      |
| -------------- | -------------------------------------------------------------------------------------- |
| UIKit          | Model event → mediator → consumer method → view controller renders values.             |
| SwiftUI        | Model event → mediator → observable UI state properties → SwiftUI views render values. |

The observable object is presentation state, such as titles, item identifiers, or whether a button is enabled. Although SwiftUI terminology may call it a model, it is distinct from Chromium's domain model and services. It contains only UI-ready data and has no knowledge of the mediator or model services. Model observation, service access, and model-dependent decisions remain in the mediator; assembly, presentation, and feature teardown remain with the coordinator.

### Actions and a concrete state cycle

Apply the [shared action decision](ios-ui-architecture.md#decide-from-the-action) to SwiftUI interactions as well:

- If carrying out the action mutates model state or needs model data resolved before acting (such as looking up a record from a displayed identifier), send it through the UI-facing mutator contract to the mediator.
- If the UI can specify the entire UI request without consulting the model, call a command handler directly—the feature's own injected coordinator for local UI work, or a shared command via `CommandDispatcher` across feature boundaries.

Keep those action relationships separate from the observable data object, which does not know the mediator.

For example, a SwiftUI bookmark list can observe an array of display items containing identifiers and titles. On Delete, the view sends the selected identifier through the mutator. The mediator asks the bookmark service to delete it, observes the resulting model change, and updates the observable display items on the main sequence; SwiftUI then redraws the list. Closing the panel needs no bookmark lookup, so the view instead invokes its injected local command handler and the coordinator dismisses it. These are illustrative paths, not a description of Bookmarks' existing implementation.

## Implementation decision and failure signals

Use `ChromeBroadcaster` from the attached `FullscreenController` only to synchronize UI properties on an existing broadcaster-based fullscreen path; otherwise deliver state from the mediator to a UIKit consumer or SwiftUI observable UI state object.

Reconsider an implementation when:

- a view controller or SwiftUI view imports model types, fetches services, or creates concrete feature peers;
- a SwiftUI observable state object exposes domain model objects, takes over service access, or holds a reference to its mediator;
- `ChromeBroadcaster` is used for model events, commands, or arbitrary notifications, or UI participants fail to stop broadcasts and remove observations on disconnect; or
- code assumes `FullscreenController::FromBrowser(browser)` provides a broadcaster on inactive or temporary browsers, or ignores an active `FullscreenBrowserAgent` path.

## Sources and version boundaries

Design guidance describes intended boundaries; existing implementations can predate or deviate from it. Use samples to understand a named version rather than treating every observed pattern as a recommendation for new work.

### UIKit, Swift, and SwiftUI guidance

The UI-framework mapping and language-adoption rules use Chromium's iOS repository at commit `c6fc20a5`:

- [Best practices: language choice](https://chromium.googlesource.com/chromium/src/ios/+/c6fc20a5949f63b1577d3c0b0d386a2717083f0c/best_practices.md#language-choice): Objective-C++ defaults, isolated Swift UIKit classes, SwiftUI adoption limits, and debugging timebox.
- [Mediators for unusual UI implementations](https://chromium.googlesource.com/chromium/src/ios/+/c6fc20a5949f63b1577d3c0b0d386a2717083f0c/architecture/mediators.md#mediators-for-unusual-ui-implementations): observable UI state in `ui/`, mediator-driven updates on the main sequence, and the unchanged model/UI separation.

### Synchronization and fullscreen samples

The `ChromeBroadcaster` and fullscreen samples use Chromium commit `341a2ce6`:

- [`ChromeBroadcaster`](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/broadcaster/ui_bundled/chrome_broadcaster.h): UI-property synchronization contract.
- [`FullscreenController`](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/fullscreen/ui_bundled/fullscreen_controller.h) and [`FullscreenControllerImpl`](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/fullscreen/ui_bundled/fullscreen_controller_impl.mm): access path and broadcaster ownership.
- [`BrowserUserData`](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/shared/model/browser/browser_user_data.h), [browser-agent setup](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/main/model/browser_agent_util.mm), and [`BrowserViewController`](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/browser_view/ui_bundled/browser_view_controller.mm): controller lifetime, attachment conditions, and broadcasting or alternate fullscreen paths.
