# GitHub Actions permission sources

## Scope

This document routes GitHub Actions `GITHUB_TOKEN` permission decisions to the current GitHub-owned sources that define workflow configuration, operation-specific access, and authorization diagnostics.

## When to update

Update this document when GitHub moves or replaces an authoritative source, introduces another permission system that GitHub Actions workflows must consider, or changes how its documentation exposes operation-specific permission requirements.

## Verify permissions from current sources

Before writing, retaining, or recommending a workflow `permissions` configuration, open the current official documentation during the task. Do not derive a permission from memory, an SDK method name, a REST path category, or an existing workflow.

Use the source that owns each part of the decision:

| Question                                                                                                               | Authoritative source                                                                                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Which permission keys and access levels can a workflow or job declare, and how does GitHub calculate effective access? | [Workflow syntax for `permissions`](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#permissions)                                                                                                                                                       |
| Which permission and access level does a REST operation accept?                                                        | The operation's current page in the [GitHub REST API reference](https://docs.github.com/en/rest), together with [Permissions required for GitHub Apps](https://docs.github.com/en/rest/authentication/permissions-required-for-github-apps) when the operation page refers to that matrix |
| What token access does a third-party action require?                                                                   | The action publisher's current documentation, checked against the GitHub documentation for every GitHub operation the action performs                                                                                                                                                     |
| Why did GitHub reject an authenticated REST request?                                                                   | [Troubleshooting the REST API: Resource not accessible](https://docs.github.com/en/rest/using-the-rest-api/troubleshooting-the-rest-api#resource-not-accessible) and the failed response metadata                                                                                         |

Identify every GitHub operation a job can perform, verify each one against its owning source, and grant only the combined access those operations require. If the authoritative sources cannot establish a permission, do not guess or broaden the token until the request succeeds; report the unresolved requirement instead.
