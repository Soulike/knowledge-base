# Issue tracker: GitHub

Issues, specs, and implementation tickets for this repository live in GitHub
Issues. Use the authenticated `gh` CLI from a checkout whose `origin` identifies
the intended repository. Pull requests are not a request or triage surface.

## Operations

- Create, read, comment on, label, and close issues with the corresponding
  `gh issue` commands.
- Read an issue together with all comments and labels before treating it as an
  implementation input.
- Use GitHub's shared issue and pull-request number space carefully: establish
  whether a number identifies an issue or a pull request before mutating it.
- When publishing tracer-bullet tickets, use GitHub's native issue-dependency
  relationship for blocking edges. If that API is unavailable, preserve the
  relationship in a `Blocked by` section in each ticket.

When an engineering Skill says to publish to the issue tracker, create a GitHub
issue in this repository. When it says to fetch a ticket, retrieve the complete
issue body, comments, labels, state, and dependency information.
