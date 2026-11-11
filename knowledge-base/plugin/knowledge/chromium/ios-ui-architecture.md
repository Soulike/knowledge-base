# Chromium iOS UI architecture

## Scope

This document explains how Chromium iOS UI features divide model access, rendering, state adaptation, composition, and communication across UIKit and SwiftUI implementations. It supports day-to-day feature development in Chromium and Chromium-derived iOS browsers, assuming familiarity with iOS UI development and protocol-based interfaces. It presents upstream design guidance and durable architectural principles, with version-bounded examples of existing code.

## When to update

Update this document when Chromium changes its architectural guidance, Swift or SwiftUI adoption rules, the model-to-UI boundary, the application object model, or the feature and shared-library layouts. Changes to fullscreen ownership, broadcaster availability and cleanup, or representative features' message direction and composition patterns can also invalidate the explanations and examples.

## Shared architecture

### Core objects and interfaces

A feature separates the objects that render UI, work with model data, and assemble the feature. A **protocol** describes how one object may call another; it is not an extra object between them. The coordinator creates the feature's objects and supplies their dependencies, so each object can depend on a narrow interface rather than discover or construct its collaborators.

| Object           | Responsibility                                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Model or service | Owns domain state, rules, persistence, and behavior that does not require UI.                                                        |
| UI objects       | Render display-ready state and own local presentation behavior, accessibility, and user interaction through UIKit or SwiftUI.        |
| Mediator         | Observes model state, converts it into values the UI can display, and translates model-dependent user actions into model operations. |
| Coordinator      | Creates and connects feature objects, presents or embeds UI, and manages the feature and its child flows through `start` and `stop`. |

The model-to-UI boundary separates state delivery from user actions:

- A **consumer protocol** describes imperative UI updates. In UIKit, the view controller normally implements it; the mediator calls it with display-ready values, such as titles and stable item identifiers, rather than exposing model objects. In SwiftUI, an **observable UI state object** serves the state-delivery role: the mediator updates its properties and views observe them.
- A **mutator protocol** describes user actions that depend on the model. The mediator implements it; UI code calls it to request a model change or obtain model data needed for a UI request. Changing how views observe state does not move model operations into the UI.

A **command protocol** requests UI work, such as presenting or dismissing a flow. Its **handler** is the object supplied to receive those calls. A local command handler is the feature's own coordinator, injected directly. A shared command handler routes through `CommandDispatcher` to a registered target for work across feature boundaries. The [communication rules](#communication-and-choosing-a-path) explain when to use each path.

These roles apply three principles together:

- **Strong decoupling:** objects interact through narrow protocols rather than concrete peers, allowing collaborators to be replaced.
- **Strong encapsulation:** objects hide implementation details and keep public interfaces small, so replacement does not leak changes to callers.
- **Layer separation:** model, coordination, and UI objects have distinct responsibilities and cross layer boundaries only through defined interfaces.

A feature that applies only one principle does not gain the intended flexibility. For example, a view controller or SwiftUI view that calls a model service through a protocol still owns model access that belongs outside the UI layer.

### Application context and lifetimes

Before choosing a dependency, identify how long its state must live. Chromium iOS supplies several enclosing contexts:

| Context              | State and lifetime                                                                                                                                 |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ApplicationContext` | Process-wide singleton for global objects and device-local settings.                                                                               |
| `ProfileIOS`         | Browsing-session context that owns profile-scoped state and keyed services. Regular and off-the-record profiles have distinct state and lifetimes. |
| `SceneState`         | Context for an application scene, corresponding to a window.                                                                                       |
| `Browser`            | UI-facing container for a set of tabs. A window can have several browsers, such as regular, incognito, inactive, or temporary browsers.            |
| `WebState`           | One tab, wrapping its web view and tab helpers.                                                                                                    |

A `Browser` owns its ordered tabs through `WebStateList`, which owns and observes the individual `WebState` objects. A coordinator owns the `Browser` instance used by its UI. `BrowserList` is a profile-keyed service that tracks registered browsers through weak pointers rather than owning them; a regular profile and its off-the-record counterpart share one list.

Process-wide behavior belongs under `ApplicationContext`; profile behavior belongs in profile-keyed services; per-browser UI state follows `Browser`; tab state follows `WebState`. Request the narrowest dependency whose lifetime and responsibility match the work. A mediator that needs one profile service should receive that service, rather than a `Browser` through which it can find it.

### Communication and choosing a path

State changes, model-dependent intent, and UI requests have different paths. In this table, the sender and receiver are objects; the protocol is the interface used for the call.

| Sender              | Receiver                            | Interface or mechanism                             | Purpose                                                              |
| ------------------- | ----------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------- |
| Model or service    | Mediator                            | Model observer                                     | Report model changes.                                                |
| Mediator            | UI layer                            | UIKit consumer or SwiftUI observable state         | Deliver UI-ready state.                                              |
| UI code             | Mediator                            | Mutator protocol                                   | Apply model-dependent intent or resolve model data for a UI request. |
| UI code or mediator | Its own coordinator                 | Injected local command handler                     | Request UI work within the feature.                                  |
| UI code or mediator | Another feature's registered target | Shared command handler through `CommandDispatcher` | Request cross-feature or application-level UI work.                  |

The coordinator's creation, dependency injection, and teardown are separate from these runtime message paths. It connects the objects, then leaves ongoing model interaction and state updates to the mediator and UI objects.

#### Decide from the action

For a user action, first ask whether carrying it out requires model knowledge. A model change or a UI request needing model data goes through a mutator to the mediator. A UI request that the UI can fully specify goes directly to a command handler. Then choose the command path by its destination: the feature's own coordinator uses a local command; work across a feature boundary uses a shared command.

For example, consider a bookmark list that displays titles and item identifiers:

| Event or action                                                                                   | Path and reason                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A bookmark title changes in the model.                                                            | The mediator observes the change and delivers display-ready values through the UIKit consumer or SwiftUI observable state object.                                       |
| The user asks to delete a bookmark.                                                               | UI code sends the item's identifier through a mutator; the mediator calls the model service. The UI does not perform the model operation.                               |
| The user closes the current panel.                                                                | The UI can specify the request without consulting the model, so it calls its local command handler. Its own coordinator manages dismissal.                              |
| The user opens application settings.                                                              | The request crosses the bookmark feature boundary, so it uses a shared command handler routed through `CommandDispatcher`.                                              |
| The user opens a detail flow that needs a model record resolved from a displayed item identifier. | UI code sends intent through a mutator. The mediator looks up the record, then issues the appropriate local or shared command. The coordinator still owns presentation. |

These are illustrative choices, not a description of Bookmarks' exact implementation. The last case differs from closing the panel because the UI cannot yet supply the information needed for the command; needing model data changes the first step, not who presents the resulting flow.

#### Connect command handlers

For **local commands**, define the protocol in the feature's `ui/` directory and inject the owning coordinator directly as an `id<Protocol>` handler. Do not register it with `CommandDispatcher` or obtain it with `HandlerForProtocol`.

For **shared commands**, coordinators register targets with the browser's dispatcher for selectors or required protocol methods. Callers receive an `id<Protocol>` obtained with `HandlerForProtocol`, which supplies compile-time protocol typing and checks at runtime that the dispatcher currently handles that protocol. Regular, incognito, and inactive browsers own a dispatcher; temporary browsers do not.

Commands request UI work. Do not use the Dispatcher for state observation, data binding, arbitrary notifications, or feature-local mutations.

Existing Omnibox and Manual Fill code contains mediator delegates for composition events. Upstream guidance warns that existing code can predate or deviate from its design intent. For new requests from a feature's view controller or mediator to its own coordinator, use a local command protocol rather than introducing a generic mediator delegate or global dispatcher registration.

### Implementing the roles and lifecycle

#### Mediators

A mediator observes explicitly supplied services and converts model state into UI-ready values. Neither consumer methods nor observable UI state properties may expose model objects whose identity, lifetime, threading, or representation would leak across the boundary. Deliver UI updates on the main sequence, consolidating callbacks there if a model can notify elsewhere.

Inject each required service, browser agent, consumer, or command handler explicitly. A browser agent is a helper associated with one `Browser`; pass the particular helper needed by the feature. Do not make a mediator discover dependencies through global singletons or retain an aggregate `Browser` merely to reach a few capabilities. A mediator may resolve data and issue a command, but it does not take over UIKit composition, presentation, navigation, or child-flow lifecycle.

Disconnect observations and clear weak relationships when the coordinator stops the feature.

#### Coordinators

`ChromeCoordinator` is the common coordinator base. It supplies access to a base view controller and its `Browser`, `ProfileIOS`, and `SceneState` context. A coordinator has `start` and `stop` lifecycle methods and may own child coordinators.

During `start`, a feature coordinator typically:

1. creates the UI objects and mediator;
2. obtains specific services from the profile or browser;
3. obtains shared command handlers from the browser's dispatcher and supplies itself directly as the handler for its feature's local commands;
4. wires the consumer or observable UI state, mutator, and command-handler relationships, plus delegates required by an existing implementation; and
5. starts child coordinators and presents or embeds the resulting UI.

During `stop`, it stops children, disconnects observers and mediators, clears delegates or handlers as required, releases the graph, and removes UI it owns. Any command targets registered for the feature must also be unregistered.

A coordinator handles composition: creating, starting, stopping, presenting, dismissing, or replacing flows. Domain rules and ongoing model manipulation belong in a mediator or model service. Passing dependencies through a coordinator does not make it a service locator for the rest of the feature.

### Mapping roles to directories

Directory names help locate responsibilities; each feature's `BUILD.gn` and `DEPS` files determine its actual build-target and dependency boundaries. Existing features are at different migration stages, so inspect the target feature before placing or moving code. Follow a legacy feature's current structure unless the task includes a deliberate migration; do not combine an unrelated behavior change with a partial directory reorganization.

#### Current feature layout

Current Chromium refactors replace the aggregate `ui_bundled/` directory with directories that expose ownership at the feature root, under `ios/chrome/browser/<feature>/`:

| Directory      | Responsibility and representative example                                                                                                                                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `model/`       | Non-UI state, services, factories, persistence, rules, and model-facing utilities. In Manual Fill, this includes feature value and adapter types such as `manual_fill_address.*` and helpers such as `manual_fill_injection_handler.*`.                    |
| `coordinator/` | Coordinators, mediators, and private protocols or bridges: composition, presentation lifecycle, model observation, and model/UI adaptation. Manual Fill places `address_coordinator.*` and `manual_fill_*_mediator.*` here.                                |
| `ui/`          | UIKit or SwiftUI presentation code, observable UI state, and UI-facing protocols such as consumers and mutators. Their interfaces use UI-ready values. Manual Fill's `address_view_controller.*` and consumer protocols illustrate the UIKit variant.      |
| `public/`      | The deliberately exposed API needed outside a private implementation directory or across feature boundaries. Manual Fill exposes a small surface including `manual_fill_content_injector.h`; implementation convenience alone does not justify public API. |
| `test/`        | Integration or end-to-end tests and test-only support outside production API. Manual Fill includes EarlGrey feature tests and matchers here. Unit tests may remain beside the code they cover, and some features retain `eg_tests/`.                       |

A mediator belongs in `coordinator/` because it adapts between model and UI, even though its consumer and mutator protocols belong in `ui/` so UI code can use them without importing the mediator implementation. These names do not establish one global dependency graph; consult the local build and dependency declarations.

#### Reading a legacy layout

A legacy feature commonly separates `model/` from an aggregate `ui_bundled/`. The latter can contain coordinators, mediators, view controllers, views, UI-facing protocols, resources, and tests together. Bookmarks illustrates this: its model factories and observers live in `model/`, while its home coordinator, mediator, view controller, and consumer protocol live under `ui_bundled/home/`.

This coarse layout does not change the roles. A view controller in `ui_bundled/` still should not fetch model services, and sharing a directory does not transfer composition or adaptation responsibilities between objects. Legacy features can also have additional feature-specific directories; this is a convention, not an exhaustive directory inventory.

#### Cross-feature shared code

`ios/chrome/browser/shared/` holds libraries used by several features. Its boundary is separate from either feature layout, and it classifies code by its consumers:

| Directory             | Consumers and representative libraries                                                                                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared/model/`       | Model objects only; examples include `application_context/`, `browser/`, `profile/`, `prefs/`, and `web_state_list/`.                                                                                                           |
| `shared/coordinator/` | Coordinators or mediators only; examples include `chrome_coordinator/`, `root_coordinator/`, `scene/`, `alert/`, and `layout_guide/`.                                                                                           |
| `shared/ui/`          | UI elements, including UI-related code also used by coordinators or mediators; examples include `elements/`, `table_view/`, `symbols/`, `resources/`, and `util/`. Such code belongs here rather than in `shared/coordinator/`. |
| `shared/public/`      | API shared across all architectural audiences, including `commands/`, `features/`, `metrics/`, and `snackbar/`.                                                                                                                 |

These are representative libraries, not a template for a feature's business-code directories. Keep a helper in its owning feature until several features need the same abstraction. Do not move code into `shared/public/` merely to bypass a dependency boundary.

## UIKit implementation

### Language and view-controller boundary

Swift is a language; UIKit and SwiftUI are UI frameworks. A UIKit view controller written in Swift keeps the same architectural role as one written in Objective-C++.

Chromium's default language for UIKit UI, coordinators, mediators, and inter-layer protocols is Objective-C++ (`.mm`). Swift may replace Objective-C++ for isolated `UIView` and `UIViewController` subclasses where C++ interoperability permits. Coordinate with Chromium's iOS owners before introducing Swift into a new target because it affects build time and binary size. These are upstream adoption rules, not a requirement for every Chromium-derived browser to use the same approval process.

A view controller renders UI-ready values and translates gestures into calls on its protocol-typed collaborators. It should not import model types, locate services, or create and coordinate concrete feature peers. Keep consumer, mutator, and command interfaces narrow: their methods express UI state or user intent rather than exposing a mediator's internal API.

The view controller remains the UIKit composition primitive: a container view controller may place children supplied to it. The coordinator is the feature's **composition root**, meaning the object that chooses the concrete children, connects their dependencies, and owns their lifecycle. UIKit work and consumer updates belong on the main thread.

### Specialized UI-property synchronization

The ordinary paths above cover model observation and consumer updates. `ChromeBroadcaster` serves a narrower role: synchronizing a defined set of UI-layer properties while hiding the identity of the object producing each value. Its observer protocol restricts participating properties; it is not a general-purpose observation or notification bus, and it does not carry commands or model events.

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

Apply the [shared action decision](#decide-from-the-action) to SwiftUI interactions as well. Model-dependent actions go through the UI-facing mutator contract to the mediator; a fully specified UI request goes to its local or shared command handler. Keep those action relationships separate from the observable data object, which does not know the mediator.

For example, a SwiftUI bookmark list can observe an array of display items containing identifiers and titles. On Delete, the view sends the selected identifier through the mutator. The mediator asks the bookmark service to delete it, observes the resulting model change, and updates the observable display items on the main sequence; SwiftUI then redraws the list. Closing the panel needs no bookmark lookup, so the view instead invokes its injected local command handler and the coordinator dismisses it. These are illustrative paths, not a description of Bookmarks' existing implementation.

## Daily design decisions

| Need                                                                       | Preferred owner or mechanism                                       |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Render state or handle local UI behavior                                   | UIKit view controller or SwiftUI view                              |
| Transform model state into display state                                   | Mediator to UIKit consumer or SwiftUI observable UI state          |
| Apply model-dependent intent or obtain model data for a UI request         | Mutator protocol implemented by mediator, then command when needed |
| Present, dismiss, replace, or compose a flow                               | Coordinator or child coordinator                                   |
| Request UI work from the feature's own coordinator                         | Directly injected local command handler                            |
| Request a UI action across feature boundaries                              | Shared command handler through `CommandDispatcher`                 |
| Synchronize UI properties on an existing broadcaster-based fullscreen path | `ChromeBroadcaster` from the attached fullscreen controller        |
| Observe domain state                                                       | Model observer owned or adapted by the mediator                    |
| Hold process, profile, browser, or tab state                               | Object matching that lifetime in the application model             |

When two choices seem plausible, follow ownership and lifetime. If the behavior survives without UI, it belongs below the UI layer. If it changes how objects are assembled or presented, it belongs to a coordinator. If it translates state across the model/UI boundary, it belongs to a mediator.

## Failure signals

Reconsider a design when:

- a view controller or SwiftUI view imports model types, fetches services, or creates concrete feature peers;
- a coordinator accumulates domain decisions or becomes the permanent conduit for model changes;
- a mediator depends on an aggregate context instead of its actual services;
- a consumer protocol or observable UI state object exposes model objects instead of UI-ready values;
- a SwiftUI observable state object takes over service access or depends on its mediator;
- the Dispatcher carries observations, callbacks, feature-local mutations, or UI requests intended only for the feature's own coordinator;
- a new feature uses a generic mediator delegate for local UI requests;
- a mutator merely forwards a UI-only request that the view controller can fully specify, or a mediator takes over presentation instead of issuing a command;
- observers survive `stop` or a coordinator leaves command targets registered; or
- code is moved into `shared/public/` only to bypass a `DEPS` boundary.

Each signal breaks a dependency, lifetime, or message-direction boundary that keeps Chromium iOS features replaceable and testable.

## Sources and version boundaries

The architecture documents describe design intent; existing implementations can predate or deviate from that guidance. Use implementation samples to understand a named version, rather than treating every observed pattern as a recommendation for new work.

### Architecture guidance

The foundational [iOS architecture document](https://chromium.googlesource.com/chromium/src/+show/bdfa2db95bf15d76d2ebb4ec13fe437a5c75e7c9/ios/clean/README.md) supplies the durable decoupling, encapsulation, and layer-separation principles. Upstream has since removed that document; the link preserves its final snapshot.

The following documents at Chromium commit `a53841c0` supply the design guidance used here:

- [Architecture overview](https://chromium.googlesource.com/chromium/src/+/a53841c09ccfc5acb903bf002dd201f64a845ee0/ios/architecture/README.md): roles, application scopes, object ownership, and communication boundaries.
- [Coordinators](https://chromium.googlesource.com/chromium/src/+/a53841c09ccfc5acb903bf002dd201f64a845ee0/ios/architecture/coordinators.md): feature assembly, lifecycle, and local commands.
- [Mediators](https://chromium.googlesource.com/chromium/src/+/a53841c09ccfc5acb903bf002dd201f64a845ee0/ios/architecture/mediators.md): consumer and mutator protocols, model observation, and model-dependent intent.
- [Commands](https://chromium.googlesource.com/chromium/src/+/a53841c09ccfc5acb903bf002dd201f64a845ee0/ios/architecture/commands.md): shared versus local command protocols and dispatcher wiring.

### UIKit, Swift, and SwiftUI guidance

The UI-framework mapping and language-adoption rules use Chromium's iOS repository at commit `c6fc20a5`:

- [Best practices: language choice](https://chromium.googlesource.com/chromium/src/ios/+/c6fc20a5949f63b1577d3c0b0d386a2717083f0c/best_practices.md#language-choice): Objective-C++ defaults, isolated Swift UIKit classes, SwiftUI adoption limits, and debugging timebox.
- [Mediators for unusual UI implementations](https://chromium.googlesource.com/chromium/src/ios/+/c6fc20a5949f63b1577d3c0b0d386a2717083f0c/architecture/mediators.md#mediators-for-unusual-ui-implementations): observable UI state in `ui/`, mediator-driven updates on the main sequence, and the unchanged model/UI separation.

### Application objects and implementation samples

Application and common infrastructure references use commit `1b33fac5`, except browser attachment and fullscreen ownership, availability, and cleanup, which use `341a2ce6`:

- [iOS application objects](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/docs/ios/objects.md): process, profile, and tab context.
- [`Browser` interface](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/shared/model/browser/browser.h), [`BrowserImpl` ownership and teardown](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/main/model/browser_impl.mm), and weak-tracking [`BrowserList`](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/shared/model/browser/browser_list.h): browser ownership and tracking.
- [`ChromeCoordinator`](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/shared/coordinator/chrome_coordinator/chrome_coordinator.h): common coordinator interface.
- [`CommandDispatcher`](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/shared/public/commands/command_dispatcher.h): shared-command routing interface.
- [`ChromeBroadcaster`](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/broadcaster/ui_bundled/chrome_broadcaster.h): UI-property synchronization contract.
- [`FullscreenController`](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/fullscreen/ui_bundled/fullscreen_controller.h) and [`FullscreenControllerImpl`](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/fullscreen/ui_bundled/fullscreen_controller_impl.mm): access path and broadcaster ownership.
- [`BrowserUserData`](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/shared/model/browser/browser_user_data.h), [browser-agent setup](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/main/model/browser_agent_util.mm), and [`BrowserViewController`](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/browser_view/ui_bundled/browser_view_controller.mm): controller lifetime, attachment conditions, and broadcasting or alternate fullscreen paths.
- [Omnibox coordinator](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/omnibox/coordinator/omnibox_coordinator.mm), [consumer](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/omnibox/ui/omnibox_consumer.h), and [mutator](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/omnibox/ui/omnibox_mutator.h): concrete wiring and protocol examples.

### Directory examples

The following examples at commit `1b33fac5` illustrate the feature layouts and shared-library contract:

- [Manual Fill](https://chromium.googlesource.com/chromium/src/+/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/autofill/manual_fill/): current feature layout.
- [Bookmarks model](https://chromium.googlesource.com/chromium/src/+/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/bookmarks/model/) and [bundled UI](https://chromium.googlesource.com/chromium/src/+/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/bookmarks/ui_bundled/): legacy feature layout.
- [Shared-library README](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/shared/README.md): classification by library consumers.
