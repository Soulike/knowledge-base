---
name: PROTOTYPE gh-aw verify evergreen Knowledge

on:
  schedule:
    - cron: "43 3 8 1,4,7,10 *"
  workflow_dispatch:

engine:
  id: copilot
  version: latest
  model: ${{ vars.CONTENT_VERIFICATION_MODEL || 'auto' }}
  args:
    - --reasoning-effort
    - ${{ vars.CONTENT_VERIFICATION_REASONING_EFFORT || 'auto' }}

imports:
  - prototype-gh-aw/shared-runtime.md

permissions:
  contents: read
  copilot-requests: write
  issues: read

concurrency:
  group: prototype-gh-aw-content-verification-evergreen
  cancel-in-progress: false

safe-outputs:
  create-issue:
    max: 100
    labels: [automated-verification]
    assignees: [Soulike]
---

# Verify evergreen Knowledge

Review every Knowledge target indexed as `evergreen` at the checked-out
revision. Use the installed review Skills only as references. Search both open
and closed issue history before deciding that an affected target needs a new
issue.

For each target that needs a substantive correction, call `create_issue`
exactly once with the target path in the title and the evidence, required
change, and acceptance criteria in the body. If every target is current, call
`noop` exactly once. If any required target or evidence cannot be verified,
call `report_incomplete`; do not call `noop` or claim a complete result.
