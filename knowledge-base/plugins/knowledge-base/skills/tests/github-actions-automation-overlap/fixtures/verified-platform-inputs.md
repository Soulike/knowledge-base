# Controlled GitHub Actions inputs

These facts form a deterministic replay fixture. They stand in for the current
authoritative source checks required by the selected Knowledge; they are not
general recommendations or claims about a live GitHub environment.

- The active repository policy requires third-party Actions to use the exact
  verified commit for a compatible release and retain the readable release
  label in a comment.
- The verified compatible checkout release is `v4.2.2` at
  `11bd71901bbe5b1630ceea73d27597364c9af683`.
- The verified compatible runtime-setup release is `v4.4.0` at
  `49933ea5288caeca8642d1e84afbd3f7d6820020`, and the repository supports
  Node.js `24`.
- The read-only Agent job performs only repository checkout and inspection.
  Its token contract is `contents: read`.
- A separate trusted publisher creates the pull-request comment after result
  validation. The supplied operation contract accepts `pull-requests: write`;
  the publisher needs no repository-content write access.
- No other GitHub API operation or third-party Action is part of the task.
