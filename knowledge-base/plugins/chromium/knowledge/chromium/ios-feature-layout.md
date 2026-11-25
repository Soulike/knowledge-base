# Chromium iOS feature and shared-library layout

## Scope

This document explains how Chromium iOS organizes feature directories (`model/`, `coordinator/`, `ui/`, `public/`, `test/`, and legacy `ui_bundled/`) and cross-feature shared libraries (`ios/chrome/browser/shared/`) alongside `BUILD.gn` and `DEPS` dependency rules. It supports placing, moving, reviewing, and navigating code in Chromium and Chromium-derived iOS browsers without confusing directory conventions with build boundaries or architectural role rules.

## When to update

Update this document when Chromium changes `ios/chrome/browser/` feature directory conventions, retires `ui_bundled/` layouts, reorganizes `ios/chrome/browser/shared/` consumer-based directories, or changes the representative Manual Fill, Bookmarks, or shared-library examples at their recorded commit.

## Build boundaries before directory names

Directory names help locate responsibilities, but each feature's `BUILD.gn` and `DEPS` files determine its actual build-target and dependency boundaries. Existing features sit at different migration stages, so inspect the target feature before placing or moving code. Follow a legacy feature's current structure unless the task includes a deliberate migration; do not combine an unrelated behavior change with a partial directory reorganization.

## Current feature layout

Current Chromium refactors replace the aggregate `ui_bundled/` directory with directories that expose ownership at the feature root, under `ios/chrome/browser/<feature>/`:

| Directory      | Responsibility and representative example                                                                                                                                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `model/`       | Non-UI state, services, factories, persistence, rules, and model-facing utilities. In Manual Fill, this includes feature value and adapter types such as `manual_fill_address.*` and helpers such as `manual_fill_injection_handler.*`.                    |
| `coordinator/` | Coordinators, mediators, and private protocols or bridges: composition, presentation lifecycle, model observation, and model/UI adaptation. Manual Fill places `address_coordinator.*` and `manual_fill_*_mediator.*` here.                                |
| `ui/`          | UIKit or SwiftUI presentation code, observable UI state, and UI-facing protocols such as consumers and mutators. Their interfaces use UI-ready values. Manual Fill's `address_view_controller.*` and consumer protocols illustrate the UIKit variant.      |
| `public/`      | The deliberately exposed API needed outside a private implementation directory or across feature boundaries. Manual Fill exposes a small surface including `manual_fill_content_injector.h`; implementation convenience alone does not justify public API. |
| `test/`        | Integration or end-to-end tests and test-only support outside production API. Manual Fill includes EarlGrey feature tests and matchers here. Unit tests may remain beside the code they cover, and some features retain `eg_tests/`.                       |

A mediator belongs in `coordinator/` because it adapts between model and UI, even though its consumer and mutator protocols belong in `ui/` so UI code can use them without importing the mediator implementation. These directory names do not establish one global dependency graph; consult the local `BUILD.gn` and `DEPS` declarations.

## Reading a legacy layout

A legacy feature commonly separates `model/` from an aggregate `ui_bundled/`. The latter can contain coordinators, mediators, view controllers, views, UI-facing protocols, resources, and tests together. Bookmarks illustrates this: its model factories and observers live in `model/`, while its home coordinator, mediator, view controller, and consumer protocol live under `ui_bundled/home/`.

This coarse layout does not change object roles. A view controller in `ui_bundled/` still must not fetch model services, and sharing a directory does not transfer composition or adaptation responsibilities between objects. Legacy features can also have additional feature-specific directories; this is a convention, not an exhaustive directory inventory.

## Cross-feature shared code

`ios/chrome/browser/shared/` holds libraries used by several features. Its boundary is separate from either feature layout and classifies code by its consumers:

| Directory             | Consumers and representative libraries                                                                                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shared/model/`       | Model objects only; examples include `application_context/`, `browser/`, `profile/`, `prefs/`, and `web_state_list/`.                                                                                                           |
| `shared/coordinator/` | Coordinators or mediators only; examples include `chrome_coordinator/`, `root_coordinator/`, `scene/`, `alert/`, and `layout_guide/`.                                                                                           |
| `shared/ui/`          | UI elements, including UI-related code also used by coordinators or mediators; examples include `elements/`, `table_view/`, `symbols/`, `resources/`, and `util/`. Such code belongs here rather than in `shared/coordinator/`. |
| `shared/public/`      | API shared across all architectural audiences, including `commands/`, `features/`, `metrics/`, and `snackbar/`.                                                                                                                 |

These are representative libraries, not a template for a feature's business-code directories. Keep a helper in its owning feature until several features need the same abstraction. Do not move code into `shared/public/` merely to bypass a dependency boundary.

## Layout failure signals

Reconsider a placement change when:

- code is moved into `shared/public/` only to bypass a `DEPS` boundary;
- a feature helper is extracted into `shared/` before multiple features share the abstraction;
- an unrelated behavior change is bundled with a partial `ui_bundled/` migration; or
- a view controller placed inside `ui_bundled/` imports model types or locates services on the assumption that a shared directory relaxes layer boundaries.

## Sources and version boundaries

Existing feature directories can reflect intermediate migration stages; inspect the target feature's `BUILD.gn` and `DEPS` before assuming a layout is complete. The following examples at Chromium commit `1b33fac5` illustrate the feature layouts and shared-library contract:

- [Manual Fill](https://chromium.googlesource.com/chromium/src/+/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/autofill/manual_fill/): current feature layout.
- [Bookmarks model](https://chromium.googlesource.com/chromium/src/+/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/bookmarks/model/) and [bundled UI](https://chromium.googlesource.com/chromium/src/+/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/bookmarks/ui_bundled/): legacy feature layout.
- [Shared-library README](https://chromium.googlesource.com/chromium/src/+show/1b33fac500b1e2524813c1ccd5dbaee342e1af9d/ios/chrome/browser/shared/README.md): classification by library consumers.
