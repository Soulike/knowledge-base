# Chromium iOS UI architecture

## Scope

This document explains Chromium's shared Coordinator–Mediator–Model–UI architecture on iOS: how features separate model access, UI rendering, mediator adaptation, and coordinator composition; how application contexts govern dependency lifetimes; how messages cross consumer, observable-state, mutator, and command boundaries; and how mediators and coordinators manage feature lifecycle. It supports feature design, code review, and architectural study in Chromium and Chromium-derived iOS browsers, assuming familiarity with iOS UI development and protocol-based interfaces.

## When to update

Update this document when Chromium changes its iOS architectural guidance, the model-to-UI boundary, the application object model (`ApplicationContext`, `ProfileIOS`, `SceneState`, `Browser`, `WebState`), `ChromeCoordinator` or `CommandDispatcher` lifecycle contracts, or the representative architecture and Omnibox wiring samples at their recorded commits.

## Core objects and interfaces

A feature separates UI rendering, model access, and feature assembly. A **protocol** specifies how one object calls another rather than adding an extra object between them. The coordinator creates the feature's objects and injects dependencies through narrow interfaces so objects never discover or construct collaborators.

| Object           | Responsibility                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| Model or service | Owns domain state, rules, persistence, and non-UI behavior.                                       |
| UI objects       | Render display-ready state and own local presentation, accessibility, and interaction.            |
| Mediator         | Observes model state, adapts it to UI-ready values, and maps model-dependent intent to model ops. |
| Coordinator      | Creates and wires feature objects, presents or embeds UI, and manages lifecycle (`start`/`stop`). |

The model-to-UI boundary separates state delivery from user actions:

- A **consumer protocol** defines imperative UI updates. In UIKit, the view controller normally implements it; the mediator passes display-ready values (such as titles and stable item identifiers) without exposing model objects. In SwiftUI, an **observable UI state object** serves this role: the mediator updates its properties and views observe them.
- A **mutator protocol** defines model-dependent user actions. The mediator implements it; UI code calls it to request model changes or resolve model data for a UI request. Changing how views observe state does not move model operations into the UI.

A **command protocol** requests UI work such as presenting or dismissing a flow; its **handler** receives those calls. A local command handler is the feature's own coordinator, injected directly; a shared command handler routes cross-feature work via `CommandDispatcher` to a registered target (see [communication rules](#communication-and-choosing-a-path)).

These roles enforce three principles together:

- **Strong decoupling:** objects interact through narrow protocols rather than concrete peers, enabling replacement.
- **Strong encapsulation:** objects hide implementation details behind small public interfaces so changes do not leak to callers.
- **Layer separation:** model, coordination, and UI objects keep distinct responsibilities and cross boundaries only via defined interfaces.

Applying only one principle fails to deliver the intended flexibility: for example, a view controller or SwiftUI view calling a model service through a protocol still owns model access that belongs outside the UI layer.

## Application context and lifetimes

Identify how long state must live before choosing a dependency. Chromium iOS defines five enclosing contexts:

| Context              | State and lifetime                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| `ApplicationContext` | Process-wide singleton for global objects and device-local settings.                                   |
| `ProfileIOS`         | Browsing-session context owning profile state and keyed services (regular and OTR lifetimes separate). |
| `SceneState`         | Application scene context corresponding to one window.                                                 |
| `Browser`            | UI-facing tab container; one window can hold regular, incognito, inactive, and temporary browsers.     |
| `WebState`           | Single tab wrapping its web view and tab helpers.                                                      |

A `Browser` owns its ordered tabs via `WebStateList`, which owns and observes individual `WebState` instances. A coordinator owns the `Browser` used by its UI. `BrowserList` is a profile-keyed service weak-tracking registered browsers rather than owning them; a regular profile and its off-the-record (OTR) counterpart share one list.

Place process-wide behavior under `ApplicationContext`, profile behavior in profile-keyed services, per-browser UI state on `Browser`, and tab state on `WebState`. Request the narrowest dependency matching the needed lifetime and responsibility: a mediator needing one profile service should receive that service rather than a `Browser` to look it up.

## Communication and choosing a path

State changes, model-dependent intent, and UI requests follow distinct runtime paths. In this table, sender and receiver are objects and the protocol is the call interface.

| Sender              | Receiver                 | Interface or mechanism                       | Purpose                                                   |
| ------------------- | ------------------------ | -------------------------------------------- | --------------------------------------------------------- |
| Model or service    | Mediator                 | Model observer                               | Report model changes.                                     |
| Mediator            | UI layer                 | UIKit consumer or SwiftUI observable state   | Deliver UI-ready state.                                   |
| UI code             | Mediator                 | Mutator protocol                             | Apply model-dependent intent or resolve data for UI work. |
| UI code or mediator | Own coordinator          | Injected local command handler               | Request UI work within the feature.                       |
| UI code or mediator | Another feature's target | Shared command handler (`CommandDispatcher`) | Request cross-feature or application-level UI work.       |

Coordinator creation, dependency injection, and teardown stay separate from these runtime paths: the coordinator wires the objects, then leaves ongoing model interaction and state updates to the mediator and UI objects.

### Decide from the action

For a user action, first ask whether carrying it out requires model knowledge. Model changes and UI requests needing model data go through a mutator to the mediator; UI requests the UI can fully specify go directly to a command handler (local for the feature's own coordinator, shared across feature boundaries).

For example, consider a bookmark list displaying titles and item identifiers:

| Event or action                                         | Path and reason                                                                                      |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Bookmark title changes in the model.                    | Mediator observes the change and pushes display-ready values to the consumer or observable UI state. |
| User deletes a bookmark.                                | UI sends the item identifier via mutator; mediator calls the model service instead of UI doing it.   |
| User closes the current panel.                          | UI can specify dismissal without model lookup, so it calls its local command handler (coordinator).  |
| User opens application settings.                        | Crosses the bookmark feature boundary, so UI invokes a shared command via `CommandDispatcher`.       |
| User opens a detail flow needing a resolved model item. | UI sends intent via mutator; mediator resolves the record and issues the local or shared command.    |

These are illustrative choices rather than Bookmarks' exact implementation. The last case differs from closing the panel because the UI cannot yet supply the data needed for the command; needing model data changes the first step, not who presents the resulting flow.

### Connect command handlers

For **local commands**, define the protocol in the feature's `ui/` directory and inject the owning coordinator directly as an `id<Protocol>` handler. Do not register it with `CommandDispatcher` or obtain it with `HandlerForProtocol`.

For **shared commands**, coordinators register targets with the browser's dispatcher for selectors or required protocol methods. Callers receive an `id<Protocol>` obtained with `HandlerForProtocol`, which supplies compile-time protocol typing and verifies at runtime that the dispatcher handles that protocol. Regular, incognito, and inactive browsers own a dispatcher; temporary browsers do not.

Commands request UI work only. Do not use the Dispatcher for state observation, data binding, arbitrary notifications, or feature-local mutations.

Existing Omnibox and Manual Fill code contains mediator delegates for composition events; upstream guidance warns that existing code can predate or deviate from design intent. For new requests from a feature's view controller or mediator to its own coordinator, use a local command protocol rather than a generic mediator delegate or global dispatcher registration.

## Implementing the roles and lifecycle

### Mediators

A mediator observes explicitly supplied services and converts model state into UI-ready values. Neither consumer methods nor observable UI state properties may expose model objects whose identity, lifetime, threading, or representation would leak across the boundary. Deliver UI updates on the main sequence, consolidating callbacks there if a model can notify elsewhere.

Inject each required service, browser agent (a helper associated with one `Browser`), consumer, or command handler explicitly—never discover dependencies via global singletons or retain an aggregate `Browser` merely to reach capabilities. A mediator may resolve data and issue a command, but does not take over presentation, navigation, or child-flow lifecycle. Disconnect observations and clear weak relationships when the coordinator stops the feature.

### Coordinators

`ChromeCoordinator` is the common coordinator base, exposing a base view controller and `Browser`, `ProfileIOS`, and `SceneState` context, `start`/`stop` lifecycle methods, and child-coordinator ownership.

During `start`, a feature coordinator typically:

1. creates UI objects and the mediator;
2. obtains specific services from the profile or browser;
3. obtains shared command handlers from the browser's dispatcher and injects itself directly as the local command handler;
4. wires consumer or observable UI state, mutator, command-handler relationships, and any legacy-required delegates; and
5. starts child coordinators and presents or embeds the UI.

During `stop`, it stops children, disconnects observers and mediators, clears delegates or handlers, releases the object graph, removes owned UI, and unregisters any command targets registered for the feature.

A coordinator owns composition (creating, starting, stopping, presenting, dismissing, and replacing flows). Domain rules and ongoing model manipulation belong in a mediator or model service; passing dependencies through a coordinator does not make it a service locator for the feature.

## Daily design decisions

| Need                                                       | Preferred owner or mechanism                                       |
| ---------------------------------------------------------- | ------------------------------------------------------------------ |
| Render state or handle local UI behavior                   | UIKit view controller or SwiftUI view                              |
| Transform model state into display state                   | Mediator to UIKit consumer or SwiftUI observable UI state          |
| Apply model-dependent intent or resolve data for a UI call | Mutator protocol implemented by mediator, then command when needed |
| Present, dismiss, replace, or compose a flow               | Coordinator or child coordinator                                   |
| Request UI work from the feature's own coordinator         | Directly injected local command handler                            |
| Request a UI action across feature boundaries              | Shared command handler through `CommandDispatcher`                 |
| Observe domain state                                       | Model observer owned or adapted by the mediator                    |
| Hold process, profile, browser, or tab state               | Context object matching that lifetime                              |

When two choices seem plausible, follow ownership and lifetime: behavior surviving without UI belongs below the UI layer; assembly or presentation belongs to a coordinator; state translation across the model/UI boundary belongs to a mediator.

## Failure signals

Reconsider a design when:

- a view controller or SwiftUI view imports model types, fetches services, or creates concrete feature peers;
- a coordinator accumulates domain decisions or acts as a permanent conduit for model changes;
- a mediator depends on an aggregate context instead of its actual services;
- a consumer protocol or observable UI state object exposes model objects instead of UI-ready values;
- the Dispatcher carries observations, callbacks, feature-local mutations, or UI requests meant for the feature's own coordinator;
- a new feature introduces a generic mediator delegate for local UI requests;
- a mutator forwards a UI-only request that the UI can fully specify, or a mediator takes over presentation instead of issuing a command; or
- observers survive `stop` or a coordinator leaves command targets registered.

Each signal breaks a dependency, lifetime, or message-direction boundary that keeps Chromium iOS features replaceable and testable.

## Sources and version boundaries

Architecture documents describe design intent; existing implementations can predate or deviate from that guidance. Use samples to understand a named version rather than treating every observed pattern as a recommendation for new work.

### Architecture guidance

The foundational [iOS architecture document](https://chromium.googlesource.com/chromium/src/+show/bdfa2db95bf15d76d2ebb4ec13fe437a5c75e7c9/ios/clean/README.md) supplies the durable decoupling, encapsulation, and layer-separation principles; upstream later removed it, and this link preserves its final snapshot.

The following documents at Chromium commit `a53841c0` supply the design guidance used here:

- [Architecture overview](https://chromium.googlesource.com/chromium/src/+/a53841c09ccfc5acb903bf002dd201f64a845ee0/ios/architecture/README.md): roles, application scopes, object ownership, and communication boundaries.
- [Coordinators](https://chromium.googlesource.com/chromium/src/+/a53841c09ccfc5acb903bf002dd201f64a845ee0/ios/architecture/coordinators.md): feature assembly, lifecycle, and local commands.
- [Mediators](https://chromium.googlesource.com/chromium/src/+/a53841c09ccfc5acb903bf002dd201f64a845ee0/ios/architecture/mediators.md): consumer and mutator protocols, model observation, and model-dependent intent.
- [Commands](https://chromium.googlesource.com/chromium/src/+/a53841c09ccfc5acb903bf002dd201f64a845ee0/ios/architecture/commands.md): shared versus local command protocols and dispatcher wiring.

### Application objects and implementation samples

Application and common infrastructure references use commit `1b33fac5`, except `Browser` and `BrowserImpl` ownership/teardown, which use `341a2ce6`:

- [iOS application objects](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/docs/ios/objects.md): process, profile, and tab context.
- [`Browser` interface](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/shared/model/browser/browser.h), [`BrowserImpl` ownership and teardown](https://chromium.googlesource.com/chromium/src/+show/341a2ce649d7971be32a549389dee5f24d3c2755/ios/chrome/browser/main/model/browser_impl.mm), and weak-tracking [`BrowserList`](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/shared/model/browser/browser_list.h): browser ownership and tracking.
- [`ChromeCoordinator`](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/shared/coordinator/chrome_coordinator/chrome_coordinator.h): common coordinator interface.
- [`CommandDispatcher`](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/shared/public/commands/command_dispatcher.h): shared-command routing interface.
- [Omnibox coordinator](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/omnibox/coordinator/omnibox_coordinator.mm), [consumer](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/omnibox/ui/omnibox_consumer.h), and [mutator](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/omnibox/ui/omnibox_mutator.h): concrete wiring and protocol examples.
