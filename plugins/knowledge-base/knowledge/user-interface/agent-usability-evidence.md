# Evidence from Agent usability risk probes

## Scope

This document explains what AI Agents attempting interface tasks can reveal about usability risk and where their evidence stops. It covers task validity, model and browser observation channels, result verification, and the interpretation of Agent behavior when planning or assessing a web interface.

## When to update

Update when evidence about Agent-to-human behavioral correspondence, available model or browser capabilities, or methods for validating Agent task observations changes the conclusions that a probe can support.

## Treat an Agent run as a probe

An Agent's action trace can show that a particular interface state gave that model, task context, and observation channel a plausible route, an ambiguous choice, or a barrier. It can nominate a design risk for investigation. Completion does not establish that people will find the route, and failure does not by itself establish that people will fail. The [UXAgent study](https://arxiv.org/abs/2504.09407) frames simulated runs as preparation for human research; a separate [comparison with real shopping sessions](https://aclanthology.org/2026.acl-long.2034/) found substantial gaps in step-by-step human-action imitation. That comparison measures behavior imitation in one domain, not the sensitivity of Agent probes to usability defects.

Use tasks grounded in user goals, requirements, or use evidence. Mark an Agent-proposed task without such support as a hypothesis. Give the tester only the goal and minimum relevant background, including domain familiarity, device, necessary prerequisites, and test credentials. Design rationale, source code, and a prescribed click path would turn an interface-discovery probe into a check of the designer's instructions.

## Separate observation channels and model effects

A visual run chooses from rendered screens. A semantic run can use accessible names and roles; [Playwright's ARIA snapshots](https://playwright.dev/docs/aria-snapshots), for example, expose an accessibility-tree representation. A control found through that representation has not thereby been shown easy to notice visually. Clicking an accessible node does not establish that keyboard navigation works, either. Report the screen, semantic, and keyboard operations actually used. A semantic or keyboard run can identify an accessibility risk, but it is not a substitute for evaluation with disabled people using their own assistive technologies; the [W3C guidance on involving users](https://www.w3.org/WAI/test-evaluate/involving-users/) describes the distinct value of that evidence.

Use a browser-capable reliable model as a baseline and a less capable model with the required tools and modalities as a stress condition. Compare runs with equivalent tasks and starting states. A failure isolated to the less capable model is a model or tool lead until a visible or semantic interface condition corroborates it. Do not call the weaker model an ordinary user or infer a human problem rate from the number of Agent failures.

## Check the result independently

Define observable completion evidence before the run. An evaluator should inspect the resulting page or system state and relevant action trace against that evidence rather than accept the tester's declaration of success. A confirmation message may be evidence of the displayed feedback while a persisted booking, sent message, or saved record requires a separately checkable result. Keep a short pre-action prediction distinct from the action and observed response; generated explanations are not direct evidence of a person's thoughts.

Attribute a suspected problem only as far as the record permits. Preserve tool errors, missing permissions, model misunderstandings, and unsupported observation channels as separate limitations. Rank credible risks by task impact, error consequence, recovery cost, and evidence quality. When consequences or unresolved uncertainty warrant it, seek real-user evidence; the Agent probe itself does not set a universal release threshold.
