---
name: handbook-chromium
description: Use when developing, maintaining, reviewing, diagnosing, or understanding Chromium or a Chromium-derived browser.
---

# Chromium handbook

This platform Handbook routes the curated Chromium guidance currently
available in this plugin. Its coverage is intentionally non-exhaustive. It owns
required-reading selection, not the procedure or completion of the user's task.
Resolve every packaged link relative to this `SKILL.md`, and apply selected
Knowledge as supplemental guidance under the instructions, requirements,
Skills, and project-specific decisions in the active working directory.

## Read the required material

Evaluate every condition below. Every match is required and cumulative with
any other matching package added to this Handbook later.

- When developing or reviewing a Chromium iOS user-interface feature, or
  performing the same work in a Chromium-derived iOS browser, read all three
  Chromium iOS UI documents in full:
  - [Chromium iOS UI architecture](../../knowledge/chromium/ios-ui-architecture.md)
  - [Chromium iOS feature and shared-library layout](../../knowledge/chromium/ios-feature-layout.md)
  - [Chromium iOS UIKit, SwiftUI, and UI synchronization](../../knowledge/chromium/ios-ui-frameworks-and-sync.md)
- For focused study, review, or single-concern questions without broader iOS
  UI feature work, read every matching document in full:
  - Coordinator–Mediator–Model–UI roles, application context lifetimes, or
    command dispatch:
    [Chromium iOS UI architecture](../../knowledge/chromium/ios-ui-architecture.md)
  - Feature or shared-library directory placement, `ui_bundled/` migration, or
    `BUILD.gn` and `DEPS` layout boundaries:
    [Chromium iOS feature and shared-library layout](../../knowledge/chromium/ios-feature-layout.md)
  - Objective-C++ vs Swift UIKit rules, SwiftUI adoption and observable UI
    state, or fullscreen `ChromeBroadcaster` synchronization:
    [Chromium iOS UIKit, SwiftUI, and UI synchronization](../../knowledge/chromium/ios-ui-frameworks-and-sync.md)

If no current package matches, the Handbook's reading selection is validly
complete with no package to read. Continue the task without applying unrelated
narrow material, inventing guidance, or implying that this Handbook documents
all of Chromium. Do not copy or infer rules in place of reading the linked
canonical material.
