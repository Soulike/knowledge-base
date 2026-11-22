# Select base human-facing Handbooks from natural work

## Identity

- ID: base-handbook-native-selection
- Kind: selection

## Covered objects

- [Collaboration Handbook](../../handbook-collaboration/SKILL.md)
- [Documentation Handbook](../../handbook-documentation/SKILL.md)
- [Product-experience Handbook](../../handbook-product-experience/SKILL.md)

## Protected behavior

The installed base-plugin candidate descriptions must select collaboration,
documentation, and product-experience reading for one natural Chinese
mobile-Web documentation and evaluation task without requiring the request to
name internal content terms. Independently applicable Workflows and other
Handbooks are permitted.

## Task

Choose guidance from the current metadata for this natural request. Do not
open Skill bodies or perform the substantive task.

我们正在修改手机浏览器里的结账流程。请实现页面和交互，更新给维护者看的操作说明，并评估用户能否顺利完成付款。

## Starting state

Supply the real installed Skill identifiers and descriptions from the current
`knowledge-base` base-plugin snapshot, together with a realistic competing set
from that package. Do not expose candidate bodies before the metadata choice,
and stop after that choice is recorded.

Record the candidate set, rendered metadata when observable, inherited
instructions, and any client truncation or automatic-loading evidence. Do not
describe a metadata choice as a client invocation.

## Expected behavior

- S1 (critical): select `handbook-collaboration`,
  `handbook-documentation`, and `handbook-product-experience` from the natural
  Chinese request before seeing their bodies.
- S2: base every Handbook choice on the observable work rather than requiring
  the request to name maintained-document quality, interface foundations, or
  another internal package term.
- S3: permit additional Skills only when their independent current metadata
  applies to the requested implementation, documentation, or evaluation work;
  do not treat these three Handbooks as a complete candidate set.

## Verification

Inspect the returned identifiers and reasons. Missing or truncated candidate
metadata cannot establish a description failure.

## Source

Derived from the retired `human-handbook-native-selection` case (originally
from GitHub issues #242 and #247) per #303 and #308: drops the redundant
landscape and video requests already protected by `still-image-production-change`
and `video-production-change`, drops the artificial non-media negative assertion,
and retains focused base-plugin natural-language selection coverage. Requires
fresh evidence against the final content.
