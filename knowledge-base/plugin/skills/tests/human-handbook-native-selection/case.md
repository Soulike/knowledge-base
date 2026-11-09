# Select human-facing Handbooks from natural work

## Identity

- ID: human-handbook-native-selection
- Kind: selection

## Covered objects

- [Collaboration Handbook](../../handbook-collaboration/SKILL.md)
- [Documentation Handbook](../../handbook-documentation/SKILL.md)
- [Product-experience Handbook](../../handbook-product-experience/SKILL.md)
- [Still-image Handbook](../../handbook-still-image-creation/SKILL.md)
- [Video Handbook](../../handbook-video-creation/SKILL.md)

## Protected behavior

The installed candidate descriptions must select collaboration, documentation,
and product-experience reading for one natural mobile-Web documentation and
evaluation task without requiring the request to name internal content terms.
They must keep still-image and video reading out when those production scenes
are absent, while tolerating selection of independently applicable Workflows or
other Handbooks.

## Task

我们正在修改手机浏览器里的结账流程。请先实现页面和交互，再更新给维护者看的操作说明，并评估用户能否顺利完成付款。当前没有图片或视频创作任务。请先从当前可用的 Skill 元数据中选择开始这项工作所需的指南，不要打开 Skill 正文，也不要执行任务。

## Starting state

Supply the real installed Skill identifiers and descriptions from the current
plugin snapshot, together with a realistic competing set from the same package.
Do not disclose candidate bodies, expected selections, this case, or prior
results. Use a fresh supported lower-capability model with the expanded executor
guard and stop after it records the metadata choice.

Record the exact source snapshot, model, configuration, candidate set, rendered
metadata when observable, inherited instructions, and any client truncation or
automatic-loading evidence. Do not describe a metadata choice as a client
invocation.

## Expected behavior

- S1 (critical): select `handbook-collaboration`,
  `handbook-documentation`, and `handbook-product-experience` from the natural
  request before seeing their bodies.
- S2 (critical): exclude `handbook-still-image-creation` and
  `handbook-video-creation` because the task does not create, generate, review,
  diagnose, or study either medium.
- S3: base every Handbook choice on the observable work rather than requiring
  the request to name maintained-document quality, interface foundations, or
  another internal package term.
- S4: permit additional Skills only when their independent current metadata
  applies to the requested implementation, documentation, or evaluation work;
  do not treat these five Handbooks as a complete candidate set.

## Verification

Use the selection dispatch template with the current real candidate metadata.
Inspect the returned identifiers and reasons, then give the capable reviewer
this contract, the exact candidate set, and the raw observation without the
coordinator's verdict. Judge every criterion separately. Missing or truncated
candidate metadata leaves the affected criterion incomplete rather than proving
a description failure.

## Source

[GitHub issue #242](https://github.com/Soulike/knowledge-base/issues/242) defines
native semantic Handbook selection, overlap and adjacent-negative evidence, and
the distinction between selection and loading. [GitHub issue
#247](https://github.com/Soulike/knowledge-base/issues/247) accepts these five
Handbooks and requires natural selection coverage. This case reconstructs that
accepted overlap and requires fresh evidence against the final content.
