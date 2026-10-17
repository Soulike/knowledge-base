# Diagrams in Azure DevOps pull request descriptions

## Scope

This document describes diagram rendering in Azure DevOps pull request
descriptions, the observed limits of fenced Mermaid blocks, and PNG attachments
as a fallback whose visible result can be checked by reviewers.

## When to update

Update this document when Azure DevOps changes diagram rendering in pull request
descriptions, attachment upload or download behavior, or Markdown image
embedding, or when new evidence changes the tested syntax or environment scope.

## Establish support on the PR description surface

Markdown capabilities belong to the surface that renders them. Microsoft's
[Sprint 274 release notes](https://learn.microsoft.com/en-us/azure/devops/release-notes/2026/wiki/sprint-274-update)
announced support for standard fenced `mermaid` code blocks in Azure DevOps
Markdown editors, explicitly mentioning pull requests and work items alongside
Wiki pages. This documents native support; it does not verify rendering in a
particular PR description. The
[Mermaid guidance](https://learn.microsoft.com/en-us/azure/devops/project/wiki/markdown-guidance?view=azure-devops#work-with-mermaid-diagrams)
describes Wiki behavior and is not by itself evidence for the PR surface.

A [contribution report verified on 2026-10-16](https://github.com/Soulike/knowledge-base/issues/186)
records fenced `mermaid` code blocks appearing as source code in a PR
description. The report does not identify Azure DevOps Services versus Server
or a product version, and other Mermaid syntaxes were not tested. This is a
dated observation in the reported environment, not evidence that every Azure
DevOps PR description rejects every Mermaid syntax.

When choosing a diagram format, establish that it renders in the target PR
description. A successful Wiki rendering or a saved Markdown fence is not that
evidence. PNG attachments offer a demonstrated fallback when Mermaid rendering
is unavailable or has not been established there.

## Embed a PNG attached to the target PR

Microsoft's [image guidance](https://learn.microsoft.com/en-us/azure/devops/project/wiki/markdown-guidance?view=azure-devops#images)
includes pull requests among the surfaces that support Markdown images. The
[PR attachment creation API](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/pull-request-attachments/create?view=azure-devops-rest-7.1)
accepts a binary upload with media type `application/octet-stream` and returns
an attachment object whose `url` downloads the attachment.

Render the diagram locally to PNG and inspect it before uploading it as an
attachment to the target PR. Embed the returned download URL with Markdown image
syntax, such as `![Architecture before the change](ATTACHMENT_DOWNLOAD_URL)`.
Replace the placeholder with the URL returned by the upload; a local PNG path
does not give reviewers access to the image.

The 2026-10-16 report exercised this route: the generated PNGs were visually
inspected, uploaded as PR attachments, downloaded and compared with the
originals, and embedded in the description. Subsequent reader feedback
confirmed that the diagrams were visible. This supports the attachment route
in that environment without establishing universal behavior across product
versions or deployments.

## Verify the description reviewers see

Check the displayed PR description after saving it. Confirm that the intended
diagrams are visible and readable in the reviewer's access context. If direct
inspection is unavailable, distinguish a reader's confirmation from an outcome
that has not yet been observed.

Keep the evidence at each boundary separate: local visual inspection checks
the generated diagram, downloading and comparing an attachment checks its
content, and reading back the description checks stored Markdown. None of
those alone proves that the PR page rendered the image for its readers.
