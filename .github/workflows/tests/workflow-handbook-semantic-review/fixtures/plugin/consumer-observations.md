# Consumer observations

## Workflow run

- Request: update a maintained software guide and deliver the approved revision.
- Selection event: `workflow-write-dev-documentation` was selected.
- Read events: the Agent opened `maintained-document-quality.md`, then the
  Workflow-selected `references/deliver-documentation.md`, then only
  `delivery-evidence.md#acceptance`.
- Result: the Agent reported delivery complete by repeating the acceptance
  sentence. No observation shows that it read `Required premises` or applied
  the three-part basis defined there.

## Handbook run

- Request: review a maintained guide whose route and current Acme renderer
  advice are both in scope.
- Selection event: `handbook-documentation` was selected.
- Package event: `Maintained document quality`, `Route review`, and `Current
renderer behavior` were all selected before their decisions.
- Read events: the Agent opened `maintained-document-quality.md`, the complete
  `route-review.md#complete-route-assessment` section including `Exception`, and
  `current-renderer.md` in full.
- Result: the Agent separated static paths from read events in its route map and
  marked the renderer fact for current-source verification before reuse.
