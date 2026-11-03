# Chromium iOS UI architecture

## Scope

This document explains Chromium's iOS UI architecture for day-to-day feature development in Chromium and Chromium-derived iOS browsers: its model, view-controller, mediator, coordinator, command, and observation roles; the intended dependency and message directions between them; and the application-level objects that provide their context. It covers current upstream design guidance and the durable principles from Chromium's foundational architecture document, with version-bounded examples of existing code, but excludes Chromium's non-UI architecture, general UIKit guidance, and feature-specific behavior.

## When to update

Update this document when Chromium changes its architectural guidance, the responsibilities or interfaces of `ChromeCoordinator`, `Browser`, `CommandDispatcher`, `ChromeBroadcaster`, consumer, mutator, or command protocols, the fullscreen ownership or broadcasting paths, the legacy or current feature layouts, the shared-library layout, or the documented iOS application object model. Also update it when representative upstream features adopt a different message direction or composition pattern.

## Design principles

Chromium iOS organizes UI features around three mutually reinforcing principles:

- **Strong decoupling:** components interact through narrow protocols instead of concrete peers.
- **Strong encapsulation:** components reveal little implementation detail or state and keep public interfaces small.
- **Layer separation:** model, coordination, and UI objects have distinct responsibilities and cross layer boundaries only through defined interfaces.

Decoupling makes components replaceable; encapsulation keeps replacement from leaking implementation details; layer separation makes permitted dependencies explicit. A feature that applies only one of these principles does not gain the intended flexibility.

## Feature roles

| Role                           | Owns                                                                                                                 | Does not own                                                                       |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Model or service               | Domain state, rules, persistence, and non-UI behavior                                                                | View state, presentation, or navigation                                            |
| View controller                | Rendering, local UIKit behavior, accessibility, and user interaction for one UI region                               | Model access, feature orchestration, or creation of concrete peer view controllers |
| Consumer protocol              | UI-facing updates that a mediator can push into a view controller                                                    | User intent or model types                                                         |
| Mutator protocol               | Model-dependent user intent sent to a mediator, including UI requests that need model data                           | Pure UI requests that the view controller can fully specify                        |
| Mediator                       | Adapting model and service state into UI-ready values, observing model changes, and applying feature-local mutations | UIKit composition, navigation ownership, or child-flow lifecycle                   |
| Coordinator                    | Object creation and wiring, presentation, start/stop lifecycle, and child coordinators                               | Domain rules or sustained model manipulation                                       |
| Shared commands and dispatcher | Cross-feature or application-level UI requests routed to registered handlers                                         | State observation, data binding, or arbitrary notifications                        |
| Local command protocol         | Feature-internal UI requests sent directly to the owning coordinator through an injected handler                     | Dispatcher registration or cross-feature routing                                   |
| Broadcaster                    | Lightweight synchronization of selected UI-object properties without exposing the observed object's identity         | Commands, general-purpose observation, or model events                             |

The view controller remains the UIKit composition primitive, but the coordinator is the composition root for the feature. A container view controller may place supplied children, while a coordinator chooses the concrete children, wires them, and owns their lifecycle.

## Message directions

Current upstream guidance distinguishes state updates, model-dependent intent, feature-internal UI requests, and cross-feature UI requests:

```text
model or service -> mediator -> consumer protocol -> view controller
view controller -> mutator protocol -> mediator -> model or service
view controller -> mutator protocol -> mediator -> command handler, when model data is needed
view controller or mediator -> local command handler -> owning coordinator
view controller or mediator -> shared command handler -> dispatcher -> target coordinator
coordinator -> constructs, injects, starts, stops, and disconnects the graph
```

The distinctions are semantic:

- A **consumer** receives UI state. It does not expose the model to the view controller.
- A **mutator** accepts model-dependent intent. The mediator changes model state or resolves model data needed to issue a UI command.
- A **local command** requests UI work within the same feature. The coordinator implements the protocol and is injected directly as its handler.
- A **shared command** requests UI work across a feature boundary through the `CommandDispatcher`.

Existing Omnibox and Manual Fill implementations contain mediator delegates for composition events. Those are descriptions of the inspected code, not the default for new work. The upstream architecture overview explicitly warns that existing code can predate or deviate from its design guidance. Use a local command protocol for a feature's view controller or mediator to request UI work from its own coordinator; do not introduce a generic mediator delegate or global dispatcher registration for that path.

## Layer responsibilities

### View controllers and UI code

A view controller should render UI-ready values, own local interaction behavior, and translate user gestures into calls on a protocol-typed collaborator. It should not import model types, locate services, or directly create and coordinate feature peers.

Inputs normally arrive through one or more consumer protocols. Outputs use a mutator when the action depends on model state, or a command handler when the view controller can fully specify the UI request. The command handler may be local or shared. Keep these interfaces narrow: methods should express UI state or user intent, not expose the mediator's internal API.

UIKit work and consumer updates belong on the main thread. If a model callback can occur elsewhere, the mediator must consolidate and deliver the corresponding UI update on the main thread.

### Mediators

A mediator is the boundary between model semantics and UI semantics. It observes explicitly supplied services, converts their state into values the consumer can render, and implements feature-local mutations without making the view controller understand the model.

Inject each required service or handler explicitly. Do not make a mediator discover dependencies through global singletons or retain an aggregate `Browser` merely to reach a small subset of its capabilities. Pass the specific model service, browser agent, consumer, or command handler required by the feature. When UI work needs model data, the view controller sends intent through a mutator; the mediator resolves that data and issues the appropriate command without taking over presentation or navigation ownership.

Consumer methods should carry UI-ready values rather than model objects whose identity, lifetime, threading, or representation would leak across the boundary. Disconnect observations and clear weak relationships when the coordinator stops the feature.

### Coordinators

`ChromeCoordinator` is the common coordinator base. A coordinator has `start` and `stop` lifecycle methods, may own child coordinators, and has access to the base view controller and its `Browser`, `ProfileIOS`, and `SceneState` context.

During `start`, a feature coordinator typically:

1. creates the view controller and mediator;
2. obtains specific services from the profile or browser;
3. obtains shared command handlers from the browser's dispatcher and supplies itself directly as the handler for its feature's local commands;
4. wires the consumer, mutator, and command-handler relationships, plus delegates required by an existing implementation; and
5. starts any child coordinator and presents or embeds the resulting UI.

During `stop`, it stops children, disconnects observers and mediators, clears delegates or handlers as required, releases the graph, and removes UI it owns.

A coordinator handles behavior that is primarily composition: creating, starting, stopping, presenting, dismissing, or replacing flows. Domain work and ongoing model interaction belong in a mediator or model service. Passing dependencies through a coordinator does not make it a service locator for the rest of the graph.

### Commands and the Dispatcher

Commands express UI requests through narrow protocol-typed handlers. Their wiring depends on whether the request stays within one feature or crosses a feature boundary:

- **Shared commands:** Regular, incognito, and inactive browsers own a `CommandDispatcher`; temporary browsers are created without one. Coordinators register targets for selectors or required protocol methods. Callers receive an `id<Protocol>` obtained with `HandlerForProtocol`, which provides compile-time protocol typing and checks at runtime that the dispatcher currently handles that protocol. Use this path for presenting settings, starting another feature's flow, or commands between coordinators.
- **Local commands:** Define the protocol in the feature's `ui/` directory and inject the owning coordinator directly as an `id<Protocol>` handler. Do not register it with `CommandDispatcher` or obtain it with `HandlerForProtocol`. Use this path for feature-internal dismissal or navigation that the view controller or mediator requests from its own coordinator.

A UI-only request that the view controller can fully specify goes directly to its command handler. A request that needs model data first goes through a mutator to the mediator, which resolves that data and invokes the command. Do not use the Dispatcher to emulate state observation, data binding, or notifications.

### Broadcaster and observation

`ChromeBroadcaster` synchronizes a defined set of UI-layer properties while hiding the identity of the object producing each value. Its observer protocol limits which properties can participate; it is not a general-purpose observation or notification bus. Model changes belong to model observers, consumer updates belong to mediators, and user intent belongs to mutators or commands.

`FullscreenControllerImpl` creates and strongly owns the broadcaster used by fullscreen. Its `FullscreenController` interface is attached to a `Browser` as `BrowserUserData`: obtain the installed controller with `FullscreenController::FromBrowser(browser)`, then use its `broadcaster()` accessor. `Browser` does not expose a broadcaster accessor. The normal browser-agent setup installs this controller for regular and incognito browsers, not inactive or temporary browsers, so a broadcaster is not available on every `Browser`.

The controller is browser-scoped and is destroyed when its user data is removed or its browser is destroyed. Stopping a feature's UI does not itself destroy that controller: UI participants must stop their broadcasts and remove their observations when they disconnect. In current `BrowserViewController` code, enabling fullscreen refactoring bypasses broadcasting and uses `FullscreenBrowserAgent` instead. Follow the target feature's active fullscreen path before choosing this mechanism; do not make broadcaster-based synchronization the default for new UI state.

## Application context

The UI architecture sits within Chromium iOS's application object model:

- `ApplicationContext` is the process-wide singleton for global objects and device-local settings.
- `ProfileIOS` represents a browsing session and owns profile-scoped state and keyed services. Regular and off-the-record profiles have distinct state and lifetimes.
- `BrowserList` is a profile-keyed service that tracks registered `Browser`
  instances through weak pointers; it does not own their lifetime. A regular
  profile and its off-the-record counterpart share one list.
- `Browser` models a UI-facing container of tabs. A window can have several browsers, such as regular, incognito, inactive, or temporary browsers.
- `Browser` owns a `WebStateList`; regular, incognito, and inactive browsers also own a `CommandDispatcher`, while temporary browsers do not. A coordinator owns the `Browser` instance used by its UI. Fullscreen's broadcaster belongs to the browser-attached controller, with the availability and lifetime described under [Broadcaster and observation](#broadcaster-and-observation).
- `WebStateList` owns and observes the ordered tabs; each `WebState` represents a tab and wraps its web view and tab helpers.

This context determines dependency lifetime. Process-wide behavior belongs under `ApplicationContext`; profile behavior belongs in profile-keyed services; per-browser UI state follows `Browser`; tab state follows `WebState`. A feature should request the narrowest object whose lifetime and responsibility match the work.

## Legacy feature architecture

The conventional legacy skeleton under `ios/chrome/browser/<feature>/` centers on two coarse responsibility buckets. The table describes that architectural convention, not an exhaustive inventory of every directory found in an existing feature. Current Chromium changes explicitly describe `ui_bundled/` as legacy.

| Directory     | Responsibility                                                                                                                                                                                                                                       |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `model/`      | Non-UI feature state, services, factories, persistence, rules, and model-facing utilities. Unit tests normally remain beside the implementation they cover.                                                                                          |
| `ui_bundled/` | The feature's aggregate UI and integration code. A legacy directory can contain coordinators, mediators, view controllers, views, UI-facing protocols, resources, and tests together rather than expressing those responsibilities in its top level. |

Bookmarks provides a representative legacy example:

| Directory     | Representative Bookmarks contents                                                                                                                                                                                                                                                            |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `model/`      | Service and model factories such as `bookmark_model_factory.*` and `account_bookmark_sync_service_factory.*`; model observers and bridges such as `bookmark_model_bridge_observer.*`; `bookmarks_utils.*`; and co-located `*_unittest.*` files.                                              |
| `ui_bundled/` | Top-level files such as `bookmark_mediator.*` and `bookmark_navigation_controller.*`; `home/` containing `bookmarks_coordinator.*`, `bookmarks_home_mediator.*`, `bookmarks_home_view_controller.*`, and its consumer protocol; plus `cells/`, `resources/`, unit tests, and EarlGrey tests. |

The coarse directory boundary does not collapse the architectural roles described above. A view controller in `ui_bundled/` still should not fetch model services, and a coordinator or mediator that happens to share the directory with it retains its own composition or adaptation responsibility. Treat the layout as the organization of existing code, not as a reason to add new coupling.

Features can contain additional feature-specific directories, and local `BUILD.gn` and `DEPS` files remain the executable source of truth for permitted dependencies. When changing a legacy feature, follow its current structure unless the task includes a deliberate migration; do not mix an unrelated behavior change with a partial directory reorganization.

## Current feature architecture

Current Chromium refactors replace the aggregate `ui_bundled/` directory with directories that expose architectural ownership at the feature root:

| Directory      | Responsibility                                                                                                                                                                                                              |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `model/`       | Non-UI feature state, services, factories, persistence, rules, and model-facing utilities.                                                                                                                                  |
| `coordinator/` | Coordinators, mediators, and their private protocols or bridges. This directory owns feature composition, presentation lifecycle, model observation, and adaptation between model and UI semantics.                         |
| `ui/`          | View controllers, views, cells, other UIKit elements, and UI-facing protocols such as consumers and mutators. Its interfaces use UI-ready values rather than exposing model objects.                                        |
| `public/`      | The deliberately exposed feature API needed outside a private implementation directory or across a feature boundary. Keep this surface narrow; implementation convenience alone does not make a declaration public.         |
| `test/`        | Integration or end-to-end tests and test-only support that should not form part of a production API. Unit tests may remain beside the implementation they cover, and some features retain a separate `eg_tests/` directory. |

Manual Fill provides a complete example of this layout:

| Directory      | Representative Manual Fill contents                                                                                                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `model/`       | Feature value and adapter types such as `manual_fill_address.*`, `manual_fill_credential.*`, and `manual_fill_credit_card.*`; model-facing helpers such as `manual_fill_injection_handler.*`; and co-located unit tests. |
| `coordinator/` | Flow coordinators such as `address_coordinator.*` and `card_coordinator.*`; `manual_fill_*_mediator.*`; coordinator delegates and bridges; and coordinator or mediator unit tests.                                       |
| `ui/`          | `address_view_controller.*`, `card_view_controller.*`, consumer and list-delegate protocols, reusable cells and buttons, and co-located view or component unit tests.                                                    |
| `public/`      | The small externally consumed surface: `manual_fill_constants.*` and `manual_fill_content_injector.h`.                                                                                                                   |
| `test/`        | EarlGrey feature tests such as `address_view_controller_egtest.mm` and `fallback_coordinator_egtest.mm`, together with test-only matchers in `manual_fill_matchers.*`.                                                   |

This split makes the model, composition, and UI boundaries visible in the source tree, but the directory names do not define one global dependency graph. Apply the architectural responsibilities in this document and use each feature's `BUILD.gn` and `DEPS` files for its actual target boundaries. Existing features are at different migration stages, so inspect the local feature before placing or moving code.

### Cross-feature shared code

`ios/chrome/browser/shared/` is a library boundary orthogonal to both feature layouts. Its upstream README reserves it for code shared by several features and classifies that reusable code by its consumers:

| Directory             | Responsibility                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `shared/model/`       | Code shared only by model objects.                                                                                                    |
| `shared/coordinator/` | Code shared only by coordinators or mediators.                                                                                        |
| `shared/ui/`          | Code shared by UI elements; UI-related code also used by coordinators or mediators belongs here rather than in `shared/coordinator/`. |
| `shared/public/`      | API shared across all architectural audiences.                                                                                        |

Current `shared/` contains these representative libraries:

| Directory             | Representative contents                                                                                                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared/model/`       | `application_context/`, `browser/` with `Browser` and `BrowserList`, `profile/`, `prefs/`, and `web_state_list/`.                                                                                     |
| `shared/coordinator/` | `chrome_coordinator/` with the common coordinator base, plus reusable `root_coordinator/`, `scene/`, `alert/`, and `layout_guide/` coordination code.                                                 |
| `shared/ui/`          | Reusable UI libraries such as `elements/`, `table_view/`, `symbols/`, `resources/`, and `util/`; `elements/`, for example, contains shared views, view controllers, buttons, labels, and their tests. |
| `shared/public/`      | `commands/` with `CommandDispatcher` and cross-feature command protocols, plus shared `features/`, `metrics/`, and `snackbar/` APIs.                                                                  |

These examples are representative rather than a required or exhaustive inventory. The directory names classify reusable library code; they are not a template for a feature's business-code directories. Keep a helper in its owning feature until several features genuinely need the same abstraction, and do not move code into `shared/public/` merely to bypass a dependency boundary.

## Daily design decisions

| Need                                                                       | Preferred owner or mechanism                                       |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Render state or handle local UIKit behavior                                | View controller                                                    |
| Transform model state into display state                                   | Mediator to consumer protocol                                      |
| Apply model-dependent intent or obtain model data for a UI request         | Mutator protocol implemented by mediator, then command when needed |
| Present, dismiss, replace, or compose a flow                               | Coordinator or child coordinator                                   |
| Request UI work from the feature's own coordinator                         | Local command protocol with directly injected coordinator          |
| Request a UI action across feature boundaries                              | Command protocol through `CommandDispatcher`                       |
| Synchronize UI properties on an existing broadcaster-based fullscreen path | `ChromeBroadcaster` from the attached fullscreen controller        |
| Observe domain state                                                       | Model observer owned or adapted by the mediator                    |
| Hold process, profile, browser, or tab state                               | Object matching that lifetime in the application model             |

When two choices seem plausible, follow ownership and lifetime. If the behavior survives without UI, it belongs below the UI layer. If it changes how objects are assembled or presented, it belongs to a coordinator. If it translates state across the model/UI boundary, it belongs to a mediator.

## Failure signals

Reconsider a design when:

- a view controller imports model types, fetches services, or creates concrete feature peers;
- a coordinator accumulates domain decisions or becomes the permanent conduit for model changes;
- a mediator depends on an aggregate context instead of its actual services;
- a consumer protocol exposes model objects instead of UI-ready values;
- the Dispatcher carries observations, callbacks, feature-local mutations, or UI requests intended only for the feature's own coordinator;
- a new feature uses a generic mediator delegate for local UI requests;
- a mutator merely forwards a UI-only request that the view controller can fully specify, or a mediator takes over presentation instead of issuing a command;
- observers survive `stop` or a coordinator leaves command targets registered; or
- code is moved into `shared/public` only to bypass a `DEPS` boundary.

These are not merely style issues. Each one collapses a dependency, lifetime, or message-direction boundary that keeps Chromium iOS features replaceable and testable.

## Sources

The principles originate in Chromium's final foundational [iOS architecture document](https://chromium.googlesource.com/chromium/src/+show/bdfa2db95bf15d76d2ebb4ec13fe437a5c75e7c9/ios/clean/README.md). Its final snapshot is identical to Chromium tag `63.0.3239.59`; upstream later removed the document. Current message-direction guidance follows the [architecture overview](https://chromium.googlesource.com/chromium/src/+/a53841c09ccfc5acb903bf002dd201f64a845ee0/ios/architecture/README.md), [coordinator and local-command guidance](https://chromium.googlesource.com/chromium/src/+/a53841c09ccfc5acb903bf002dd201f64a845ee0/ios/architecture/coordinators.md#local-commands), [shared and local command protocols](https://chromium.googlesource.com/chromium/src/+/a53841c09ccfc5acb903bf002dd201f64a845ee0/ios/architecture/commands.md#shared-vs-local-command-protocols), and [model-dependent intent through mutators](https://chromium.googlesource.com/chromium/src/+/a53841c09ccfc5acb903bf002dd201f64a845ee0/ios/architecture/mediators.md#model-updates-through-the-mediator), all at commit `a53841c0`. The earlier implementation references use Chromium commit [`1b33fac5`](https://chromium.googlesource.com/chromium/src/+/1b33fac500b1e2524813c1ccd5dbaee342e1af9d), and the directory examples were checked at [`df717de0`](https://chromium.googlesource.com/chromium/src/+/df717de0896b2f65a2043e54652bae0a9b827371). Browser attachment, broadcaster ownership and lifetime, and fullscreen integration were verified at [`341a2ce6`](https://chromium.googlesource.com/chromium/src/+/341a2ce649d7971be32a549389dee5f24d3c2755):

- [iOS application objects](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/docs/ios/objects.md) for process, profile, and tab context; browser-related ownership follows the implementation references here.
- [`Browser` interface](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/shared/model/browser/browser.h), [`BrowserImpl` ownership and teardown](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/main/model/browser_impl.mm), and the weak-tracking [`BrowserList`](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/shared/model/browser/browser_list.h)
- [shared-library layout](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/shared/README.md)
- [`ChromeCoordinator`](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/shared/coordinator/chrome_coordinator/chrome_coordinator.h)
- [`CommandDispatcher`](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/shared/public/commands/command_dispatcher.h)
- [`ChromeBroadcaster` property-synchronization contract](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/broadcaster/ui_bundled/chrome_broadcaster.h)
- [`FullscreenController` access path](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/fullscreen/ui_bundled/fullscreen_controller.h) and [`FullscreenControllerImpl` broadcaster ownership](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/fullscreen/ui_bundled/fullscreen_controller_impl.mm)
- [`BrowserUserData` lifetime](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/shared/model/browser/browser_user_data.h) and [browser-agent attachment conditions](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/main/model/browser_agent_util.mm)
- [`BrowserViewController` broadcasting, cleanup, and fullscreen-refactoring paths](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/browser_view/ui_bundled/browser_view_controller.mm)
- [legacy Bookmarks `model/`](https://chromium.googlesource.com/chromium/src/+/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/bookmarks/model/) and [`ui_bundled/`](https://chromium.googlesource.com/chromium/src/+/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/bookmarks/ui_bundled/) directories
- [current Manual Fill feature layout](https://chromium.googlesource.com/chromium/src/+/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/autofill/manual_fill/) and its one-step migration from legacy `ui_bundled/` to the [`coordinator/model/public/test/ui` layout](https://chromium.googlesource.com/chromium/src/+/aae8da9d99eeddc95c6d560d3dde0824f98dd05b)
- [Omnibox coordinator wiring](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/omnibox/coordinator/omnibox_coordinator.mm), its [consumer](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/omnibox/ui/omnibox_consumer.h) and [mutator](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/omnibox/ui/omnibox_mutator.h) protocols, and its earlier phased moves of [coordinator and mediator](https://chromium.googlesource.com/chromium/src/+/d8c2d322ddbd), [public](https://chromium.googlesource.com/chromium/src/+/5138f6aa23cd), and [`eg_tests`](https://chromium.googlesource.com/chromium/src/+/1fb2c48b1889) code before the final [`ui_bundled/` to `ui/` rename](https://chromium.googlesource.com/chromium/src/+/446193f4287a)
