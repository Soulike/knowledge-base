# Chromium iOS UI architecture

## Scope

This document explains Chromium's iOS UI architecture for day-to-day feature development in Chromium and Chromium-derived iOS browsers: its model, view-controller, mediator, coordinator, command, and observation roles; the intended dependency and message directions between them; and the application-level objects that provide their context. It covers the durable design principles from Chromium's foundational architecture document together with the patterns present in current upstream code, but excludes Chromium's non-UI architecture, general UIKit guidance, and feature-specific behavior.

## When to update

Update this document when Chromium changes the responsibilities or interfaces of `ChromeCoordinator`, `Browser`, `CommandDispatcher`, `ChromeBroadcaster`, consumer or mutator protocols, the shared layer layout, or the documented iOS application object model. Also update it when representative upstream features adopt a different message direction or composition pattern.

## Design principles

Chromium iOS organizes UI features around three mutually reinforcing principles:

- **Strong decoupling:** components interact through narrow protocols instead of concrete peers.
- **Strong encapsulation:** components reveal little implementation detail or state and keep public interfaces small.
- **Layer separation:** model, coordination, and UI objects have distinct responsibilities and cross layer boundaries only through defined interfaces.

Decoupling makes components replaceable; encapsulation keeps replacement from leaking implementation details; layer separation makes permitted dependencies explicit. A feature that applies only one of these principles does not gain the intended flexibility.

## Feature roles

| Role                            | Owns                                                                                                                 | Does not own                                                                       |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Model or service                | Domain state, rules, persistence, and non-UI behavior                                                                | View state, presentation, or navigation                                            |
| View controller                 | Rendering, local UIKit behavior, accessibility, and user interaction for one UI region                               | Model access, feature orchestration, or creation of concrete peer view controllers |
| Consumer protocol               | UI-facing updates that a mediator can push into a view controller                                                    | User intent or model types                                                         |
| Mutator protocol                | Feature-local user intent that a view controller sends to a mediator                                                 | Cross-feature presentation or application-wide routing                             |
| Mediator                        | Adapting model and service state into UI-ready values, observing model changes, and applying feature-local mutations | UIKit composition, navigation ownership, or child-flow lifecycle                   |
| Coordinator                     | Object creation and wiring, presentation, start/stop lifecycle, and child coordinators                               | Domain rules or sustained model manipulation                                       |
| Command protocol and dispatcher | Cross-feature or application-level UI requests routed to registered handlers                                         | State observation, data binding, or arbitrary notifications                        |
| Broadcaster                     | Lightweight synchronization of selected UI-object properties without exposing the observed object's identity         | Commands, general-purpose observation, or model events                             |

The view controller remains the UIKit composition primitive, but the coordinator is the composition root for the feature. A container view controller may place supplied children, while a coordinator chooses the concrete children, wires them, and owns their lifecycle.

## Message directions

Current Chromium features use different protocols for state, feature-local intent, and application-level commands:

```text
model or service -> mediator -> consumer protocol -> view controller
view controller -> mutator protocol -> mediator -> model or service
view controller or mediator -> command protocol -> dispatcher -> coordinator
mediator -> delegate -> coordinator, for events that require composition
coordinator -> constructs, injects, starts, stops, and disconnects the graph
```

The distinctions are semantic:

- A **consumer** receives UI state. It does not expose the model to the view controller.
- A **mutator** accepts feature-local intent whose implementation belongs with the mediator's model adaptation.
- A **command** asks the application to perform a coordinated UI action, often across a feature boundary.
- A **mediator delegate** reports an event whose consequence belongs to the coordinator, such as updating composition or presentation.

The foundational design routed view-controller output only through commands. Current upstream code also uses mutators and mediator delegates, so new work should choose the narrow protocol matching the interaction rather than treating the Dispatcher as the only output channel.

## Layer responsibilities

### View controllers and UI code

A view controller should render UI-ready values, own local interaction behavior, and translate user gestures into calls on a protocol-typed collaborator. It should not import model types, locate services, or directly create and coordinate feature peers.

Inputs normally arrive through one or more consumer protocols. Outputs use a mutator for feature-local changes or a command handler for cross-feature UI work. Keep both interfaces narrow: methods should express UI state or user intent, not expose the mediator's internal API.

UIKit work and consumer updates belong on the main thread. If a model callback can occur elsewhere, the mediator must consolidate and deliver the corresponding UI update on the main thread.

### Mediators

A mediator is the boundary between model semantics and UI semantics. It observes explicitly supplied services, converts their state into values the consumer can render, and implements feature-local mutations without making the view controller understand the model.

Inject each required service or handler explicitly. Do not make a mediator discover dependencies through global singletons or retain an aggregate `Browser` merely to reach a small subset of its capabilities. Pass the specific model service, browser agent, consumer, mutator, command handler, or delegate required by the feature.

Consumer methods should carry UI-ready values rather than model objects whose identity, lifetime, threading, or representation would leak across the boundary. Disconnect observations and clear weak relationships when the coordinator stops the feature.

### Coordinators

`ChromeCoordinator` is the common coordinator base. A coordinator has `start` and `stop` lifecycle methods, may own child coordinators, and has access to the base view controller and its `Browser`, `ProfileIOS`, and `SceneState` context.

During `start`, a feature coordinator typically:

1. creates the view controller and mediator;
2. obtains specific services from the profile or browser;
3. obtains protocol-typed command handlers from the browser's dispatcher;
4. wires the consumer, mutator, delegate, and command-handler relationships; and
5. starts any child coordinator and presents or embeds the resulting UI.

During `stop`, it stops children, disconnects observers and mediators, clears delegates or handlers as required, releases the graph, and removes UI it owns.

A coordinator handles behavior that is primarily composition: creating, starting, stopping, presenting, dismissing, or replacing flows. Domain work and ongoing model interaction belong in a mediator or model service. Passing dependencies through a coordinator does not make it a service locator for the rest of the graph.

### Commands and the Dispatcher

Each `Browser` owns a `CommandDispatcher`. Coordinators register targets for selectors or required protocol methods. Callers that need to issue commands receive only an `id<Protocol>` obtained with `HandlerForProtocol`, which provides compile-time protocol typing and checks at runtime that the dispatcher currently handles that protocol.

Use commands for requests such as presenting settings, starting another browser flow, or otherwise crossing a UI ownership boundary. Do not use the Dispatcher to emulate delegation, state observation, or notifications. Those interactions have different lifetime and data-flow semantics.

### Broadcaster and observation

Each `Browser` also owns a `ChromeBroadcaster`. It synchronizes a defined set of UI-layer properties while hiding the identity of the object producing each value. Use it only when multiple UI participants need that lightweight property synchronization. Model changes belong to model observers, consumer updates belong to mediators, and user intent belongs to mutators or commands.

## Application context

The UI architecture sits within Chromium iOS's application object model:

- `ApplicationContext` is the process-wide singleton for global objects and device-local settings.
- `ProfileIOS` represents a browsing session and owns profile-scoped state and keyed services. Regular and off-the-record profiles have distinct state and lifetimes.
- `BrowserList` is a profile-keyed service that tracks registered `Browser`
  instances through weak pointers; it does not own their lifetime. A regular
  profile and its off-the-record counterpart share one list.
- `Browser` models a UI-facing container of tabs. A window can have several browsers, such as regular, incognito, inactive, or temporary browsers.
- `Browser` owns a `WebStateList`, `CommandDispatcher`, and `ChromeBroadcaster`, while a coordinator owns the `Browser` instance used by its UI.
- `WebStateList` owns and observes the ordered tabs; each `WebState` represents a tab and wraps its web view and tab helpers.

This context determines dependency lifetime. Process-wide behavior belongs under `ApplicationContext`; profile behavior belongs in profile-keyed services; per-browser UI state follows `Browser`; tab state follows `WebState`. A feature should request the narrowest object whose lifetime and responsibility match the work.

## Source layout and dependency boundaries

Current shared code under `ios/chrome/browser/shared/` is divided by architectural audience:

- `model/` is shared model code;
- `ui/` is shared UI code;
- `coordinator/` is code shared by coordinators and mediators;
- `public/` is API used across layers, including command protocols.

Place code according to who may depend on it, not merely who first needs it. A helper used only by coordinators does not become general public API; a command protocol is public because other layers need the UI capability without depending on its implementation. Chromium's `DEPS` rules make these boundaries enforceable, so a dependency violation is usually an architectural signal rather than a path inconvenience.

## Daily design decisions

| Need                                                           | Preferred owner or mechanism                           |
| -------------------------------------------------------------- | ------------------------------------------------------ |
| Render state or handle local UIKit behavior                    | View controller                                        |
| Transform model state into display state                       | Mediator to consumer protocol                          |
| Apply feature-local user intent to model-facing behavior       | Mutator protocol implemented by mediator               |
| Present, dismiss, replace, or compose a flow                   | Coordinator or child coordinator                       |
| Request a UI action across feature boundaries                  | Command protocol through `CommandDispatcher`           |
| Synchronize a defined UI property without knowing its producer | `ChromeBroadcaster`                                    |
| Observe domain state                                           | Model observer owned or adapted by the mediator        |
| Hold process, profile, browser, or tab state                   | Object matching that lifetime in the application model |

When two choices seem plausible, follow ownership and lifetime. If the behavior survives without UI, it belongs below the UI layer. If it changes how objects are assembled or presented, it belongs to a coordinator. If it translates state across the model/UI boundary, it belongs to a mediator.

## Failure signals

Reconsider a design when:

- a view controller imports model types, fetches services, or creates concrete feature peers;
- a coordinator accumulates domain decisions or becomes the permanent conduit for model changes;
- a mediator depends on an aggregate context instead of its actual services;
- a consumer protocol exposes model objects instead of UI-ready values;
- the Dispatcher carries observations, callbacks, or feature-local mutations;
- a mutator starts unrelated presentation flows instead of issuing a command;
- observers survive `stop` or a coordinator leaves command targets registered; or
- code is moved into `shared/public` only to bypass a `DEPS` boundary.

These are not merely style issues. Each one collapses a dependency, lifetime, or message-direction boundary that keeps Chromium iOS features replaceable and testable.

## Sources

The principles originate in Chromium's final foundational [iOS architecture document](https://chromium.googlesource.com/chromium/src/+show/bdfa2db95bf15d76d2ebb4ec13fe437a5c75e7c9/ios/clean/README.md). Its final snapshot is identical to Chromium tag `63.0.3239.59`; upstream later removed the document, so current behavior was verified against Chromium `main` at commit [`23403358`](https://chromium.googlesource.com/chromium/src/+/23403358d6d8ecc3dcd3d4b20f080e00415a2ac2):

- [iOS application objects](https://chromium.googlesource.com/chromium/src/+show/23403358d6d8ecc3dcd3d4b20f080e00415a2ac2/docs/ios/objects.md)
- [`Browser` and its UI context](https://chromium.googlesource.com/chromium/src/+show/23403358d6d8ecc3dcd3d4b20f080e00415a2ac2/ios/chrome/browser/shared/model/browser/browser.h) and the current weak-tracking [`BrowserList`](https://chromium.googlesource.com/chromium/src/+show/23403358d6d8ecc3dcd3d4b20f080e00415a2ac2/ios/chrome/browser/shared/model/browser/browser_list.h)
- [shared layer layout](https://chromium.googlesource.com/chromium/src/+show/23403358d6d8ecc3dcd3d4b20f080e00415a2ac2/ios/chrome/browser/shared/README.md)
- [`ChromeCoordinator`](https://chromium.googlesource.com/chromium/src/+show/23403358d6d8ecc3dcd3d4b20f080e00415a2ac2/ios/chrome/browser/shared/coordinator/chrome_coordinator/chrome_coordinator.h)
- [`CommandDispatcher`](https://chromium.googlesource.com/chromium/src/+show/23403358d6d8ecc3dcd3d4b20f080e00415a2ac2/ios/chrome/browser/shared/public/commands/command_dispatcher.h)
- [`ChromeBroadcaster`](https://chromium.googlesource.com/chromium/src/+show/23403358d6d8ecc3dcd3d4b20f080e00415a2ac2/ios/chrome/browser/broadcaster/ui_bundled/chrome_broadcaster.h)
- [Omnibox coordinator wiring](https://chromium.googlesource.com/chromium/src/+show/23403358d6d8ecc3dcd3d4b20f080e00415a2ac2/ios/chrome/browser/omnibox/coordinator/omnibox_coordinator.mm) and its [consumer](https://chromium.googlesource.com/chromium/src/+show/23403358d6d8ecc3dcd3d4b20f080e00415a2ac2/ios/chrome/browser/omnibox/ui/omnibox_consumer.h) and [mutator](https://chromium.googlesource.com/chromium/src/+show/23403358d6d8ecc3dcd3d4b20f080e00415a2ac2/ios/chrome/browser/omnibox/ui/omnibox_mutator.h) protocols
