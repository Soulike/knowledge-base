# Preserve Skill evidence in the pull-request summary

## Identity

- ID: skill-pr-evidence-summary
- Kind: application

## Covered objects

- [Repository authoring rules](../../AGENTS.md)
- [Content-maintenance Skill](../../.agents/skills/maintain-knowledge-base/SKILL.md)
- [Skill-maintenance workflow](../../.agents/skills/maintain-knowledge-base/references/maintain-skill.md)
- [Skill-authoring reference](../../knowledge-base/plugin/references/agents/skill-authoring.md)

## Protected behavior

The final pull-request or handoff summary for a material Skill change must
remain concise without dropping the evidence a reviewer needs to judge the
change. Protect the transfer of source identity, model and configuration
identity, task-relevant comparison basis, scenario observations, attempt
outcomes, independent judgments, and limitations from the completed maintenance
record into the reviewable summary.

## Task

内容维护及最终审查已经完成。根据给定的最终证据记录，准备可直接放进 pull
request 描述的 Skill 设计与行为证据摘要，并判断当前维护是否可以交付。不要重新
执行案例、修改内容或发起 pull request。把结果写入指定 JSON 文件。

## Starting state

Supply [the final evidence record](fixtures/evidence-record.json) as normal task
data together with the complete current covered guidance. The record's stable
scenario and attempt IDs are part of the review identity and must remain
traceable in the prepared summary. Its private transcript marker represents raw
authoring history that the pull-request description does not need.

The task is read-only except for the designated JSON result. Capture
`pr_evidence` as a Markdown string, `maintenance_status` as `complete` or
`incomplete`, and `attempts` as the retained attempt records. These fields are
neutral capture mechanics rather than their expected contents. `pr_evidence`
is the exact text that a pull-request or handoff reviewer will receive.
`attempts` is separate archival capture and does not become part of that text
unless the required attempt evidence also appears in `pr_evidence`.

## Expected behavior

- R1 (critical): produce a directly publishable summary that identifies the
  user work, starting state, responsibility boundary, owner comparison,
  research basis, authoritative placement, and final source snapshot.
- R2 (critical): retain the author, comparison model, lower-capability executor,
  and capable reviewer identities together with exposed provider,
  reasoning effort, inherited-context configuration, and the task-relevant
  capability basis for the lower-capability comparison.
- R3 (critical): retain every stable scenario's expected behavior, actual
  observation, conclusion, and the executor identity that produced each
  observation, including the reader model's identity, configuration,
  paraphrase, application, and confusion observation. Retain required guidance
  reading and application observations, or the supported reason an evidence
  kind does not apply. Do not replace them with an aggregate statement that
  behavioral or cross-model checks passed.
- R4: retain every attempt and its disposition, including the contaminated
  attempt followed by the trusted final attempt, and identify the executor for
  each. Preserve the final independent judgments and remaining evidence limits
  without treating the earlier attempt as a current failure.
- R5: keep the summary concise and reviewable. Exclude the private raw transcript
  marker and repeated procedure, and do not move lasting rules into the pull
  request or claim native client loading that the evidence did not observe.
- R6 (critical): mark maintenance complete only when the prepared summary
  retains the required final evidence and its completion basis. Distinguish
  preparation of the summary from actually publishing a pull request.

## Verification

Use the application template and capture the actual JSON result. Give the
complete supplied evidence record, actual `pr_evidence`, retained attempts, and
criteria to the independent capable reviewer. Judge whether the summary
preserves the evidence needed for review while remaining concise; equivalent
organization, wording, and language are allowed.

A controlled faulty observation that replaces the model and scenario record
with “cross-model validation passed,” drops the contaminated attempt, relies on
the sibling `attempts` field instead of the publishable summary, or includes the
private transcript marker must fail the corresponding criterion.

## Source

Reconstructed from repeated review-only evidence findings in pull requests
#143, #237, #240, #241, #265, and #269. In each case the substantive change had
already been evaluated, but the pull-request description omitted model,
configuration, comparison-basis, scenario, or reader-observation evidence that
the authoring standard required.
