# Diagrams in Azure DevOps pull request descriptions

## Scope

This document explains PNG publication guidance for diagrams in Azure DevOps
pull request descriptions, the attachment and image-embedding contracts that
support it, and how to verify that reviewers can see the intended diagrams.

## When to update

Update this document when Azure DevOps changes diagram rendering in pull request
descriptions, attachment upload or download behavior, or Markdown image
embedding, or when new evidence changes the tested syntax or environment scope.

## Publish PNG attachments

Publish diagrams in Azure DevOps PR descriptions as PNG attachments. Keep
Mermaid as the editable source, render it locally to PNG, and inspect the image
before uploading it to the target PR. Embed the PNG in the description so the
published diagram does not depend on native Mermaid rendering.

Microsoft's [image guidance](https://learn.microsoft.com/en-us/azure/devops/project/wiki/markdown-guidance?view=azure-devops#images)
includes pull requests among the surfaces that support Markdown images. The
[PR attachment creation API](https://learn.microsoft.com/en-us/rest/api/azure/devops/git/pull-request-attachments/create?view=azure-devops-rest-7.1)
accepts a binary upload with media type `application/octet-stream` and returns
an attachment object whose `url` downloads the attachment.

Use the returned download URL in Markdown image syntax, such as
`![Architecture before the change](ATTACHMENT_DOWNLOAD_URL)`. Replace the
placeholder with the URL returned by the upload; a local PNG path does not give
reviewers access to the image.

## Verify the description reviewers see

Check the displayed PR description after saving it. Confirm that the intended
diagrams are visible and readable in the reviewer's access context. If direct
inspection is unavailable, distinguish a reader's confirmation from an outcome
that has not yet been observed.

Keep the evidence at each boundary separate: local visual inspection checks
the generated diagram, downloading and comparing an attachment checks its
content, and reading back the description checks stored Markdown. None of
those alone proves that the PR page rendered the image for its readers.

## Basis for the PNG recommendation

A [contribution report verified on 2026-10-16](https://github.com/Soulike/knowledge-base/issues/186)
records fenced `mermaid` blocks appearing as source code in a PR description.
Locally inspected PNGs were uploaded as PR attachments, downloaded and compared
with the originals, and embedded in the description; reader feedback confirmed
that the diagrams were visible. The report does not identify Azure DevOps
Services versus Server or a product version, and other Mermaid syntaxes were
not tested.

Microsoft's [Sprint 274 release notes](https://learn.microsoft.com/en-us/azure/devops/release-notes/2026/wiki/sprint-274-update)
also announced standard fenced Mermaid support for Markdown editors, explicitly
mentioning PRs. The guidance above chooses PNG for publication; it does not
claim that every Azure DevOps deployment lacks native Mermaid support.
