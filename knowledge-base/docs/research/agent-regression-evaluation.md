# Agent 行为回归验证实践调查

本调查支持知识库维护者判断：如何保存现有独立验证的案例，并在后续修改时重放，检查历史行为是否退化。已有一手实践可借鉴；起步不必引入完整评测服务或另建真实客户端执行器。现有作者标准仍由 [Agent Skill authoring](../../plugin/references/agents/skill-authoring.md) 维护，本文只保存外部研究发现、适用边界和未决问题，不定义测试格式或工程规格。

核对日期：2026-11-07。术语沿用 [产品 glossary](../../GLOSSARY.md)：Skill 拥有任务执行，Knowledge 拥有独立可读取的理解。这里的“选择证据”说明 Agent 在自然任务中选择或排除了什么；实际加载或读取需要相应观察，不能由选择结论推定。“执行证据”说明作出了哪些决定、产生了什么结果；“回归”需要与既有行为契约或同条件的旧版结果比较。三者不能由一条最终答复同时证明。

## 最贴近本项目的实际实践

### OpenAI：从真实失败积累小型 Skill eval

[Testing Agent Skills Systematically with Evals](https://developers.openai.com/blog/eval-skills) 是 2026-01-22 发布的官方实作指南。它用 CSV 保存请求和 `should_trigger`，案例包括直接点名、自然隐式请求、带额外上下文的请求和相邻负例；建议由开发或使用中发现的失败逐步增长覆盖。它提出的 10–20 个起始请求是单个示例 Skill 的经验建议，不是每项内容的统一门槛。

实际执行使用 `codex exec --json` 保存轨迹，Node 示例检查命令的终态、退出码和磁盘产物，再用独立的只读 Codex 调用及 `--output-schema` 做结构化质量判断。较重的构建、启动和运行检查按风险追加。可直接借鉴“请求 → 实际运行及产物 → 少量明确判定 → 留存供以后比较”，而不必采用整个工具栈。[官方指南](https://developers.openai.com/blog/eval-skills)

边界：文章讨论触发率，但公开 Node 示例只实现安装命令和文件存在检查，没有实现 Skill 选择判定器。命令出现、文件存在和结构化 judge 输出，也分别只支持其检查的事实。文章部分命令选项和安装路径来自发布时的版本；本机当前 CLI 帮助已与其中示例不同，不能原样复制为当前运行契约。

### Anthropic：触发优化、执行对照和盲评分开

官方 [skill-creator](https://github.com/anthropics/skills/blob/2c5958ecac7cee2b583967a2c4981d0f4a75c579/skills/skill-creator/SKILL.md) 将 description 优化单列。执行实验对同一请求运行带 Skill 与基线：新建 Skill 时基线没有 Skill，改进已有 Skill 时基线为旧版；留存结果、token、时长、断言通过率和差值，分析两组都通过的无区分力断言及高方差案例。另有可选盲评，评分者不知道两份输出各属于哪一版。

这些做法能帮助区分“当前满足任务契约”“比旧版更好”和“模型原本就能完成”。对本项目的价值是案例、对照和证据留存；Claude Code 客户端兼容不在本仓库范围，本文不建议为它增加执行器。

读取官方代码后发现不能直接照搬其触发脚本：[run_eval.py](https://github.com/anthropics/skills/blob/2c5958ecac7cee2b583967a2c4981d0f4a75c579/skills/skill-creator/scripts/run_eval.py) 创建带随机名称的临时命令，正文只有 description；遇到第一个其他工具就返回未触发，异常也被累计为 `False`。这是早期路由探测，改变了候选集，并可能把启动故障或较晚触发算成负例。截断能减少执行成本，但判定边界必须能支持待验证的事实。

[run_loop.py](https://github.com/anthropics/skills/blob/2c5958ecac7cee2b583967a2c4981d0f4a75c579/skills/skill-creator/scripts/run_loop.py) 按正负例分层划分训练与测试请求，向改写模型隐藏测试反馈。不过它每轮都运行测试集，最后按测试得分选最佳版本；推论是这组测试数据参与了版本选择，不能同时当作完全未接触的最终泛化证明。

### OpenAI Cookbook：轨迹和反馈转为可重跑案例

[Build an Agent Improvement Loop with Traces, Evals, and Codex](https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop) 是 2026-05-12 的官方可运行示例：Agents SDK 执行虚构公司的分析任务，记录轨迹，结合人类和模型反馈生成 Promptfoo eval，再做验证及改进建议。

它证明反馈可以转成可重复执行的验证资产；不是自然 Skill 选择框架，也不证明自动生成的预期正确。示例默认五条轨迹，说明完整运行约需 20 分钟，多阶段都有新模型调用；这是示例预算，不是本项目测量。对于保存历史案例的起步目标，可借鉴反馈到案例的转化，而不用引入自动优化链。

## 证据应该说明什么

[OpenAI evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices) 建议使用专家标注、真实使用与历史记录，采用明确 rubric，并将模型 judge 与人类标签校准。其讨论了判断位置和输出长度造成的偏差，以及对照或通过/失败判断的价值。[Trace grading](https://developers.openai.com/api/docs/guides/trace-grading) 将评价对象扩展为包含决定和工具调用的完整执行轨迹，便于定位过程故障。

对本项目的推论是：案例预期应在待测正文之外建立；结果评价要看其支持的证据。可以确定性观察的动作、目标、终态或副作用，用相应事实判定；专业质量、约束理解等语义问题再交给独立评价者。语义评价者认为结果很好，不能补足缺失的动作证据。收到错误、超时或不完整轨迹时，也不能据此推导“应当不触发”。

无需规定唯一工具调用序列，除非任务契约本来就要求那个序列。例如，保护“修改前确认当前对象”的案例需要能证明确认发生在修改前；只匹配一句声称已经确认的文字，不支持这个事实。同样，选择了 Skill 后正确停止，可以是预期结果，而不是一律要求生成产物。

## 真实客户端的读取可观测性

本机只核对了 CLI 版本与帮助，没有执行付费 Agent 验证：`codex-cli 0.166.0`、`GitHub Copilot CLI 1.0.105`。这些是本机快照，不代表本仓库 scheduled workflow 的部署版本。

| 客户端                  | 已核对能力                                                                                                                                                                                                                   | 能支持的事实与限制                                                                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Codex CLI 0.166.0       | 本机 `exec --help` 支持 `--json`、`--output-schema`、`--ephemeral`；同版本 [exec_events.rs](https://github.com/openai/codex/blob/rust-v0.166.0/codex-rs/exec/src/exec_events.rs) 定义命令、文件变更、MCP、错误及 token usage | JSONL 能保留已暴露的动作和用量；枚举没有独立 Skill 调用项，不能仅凭 `--json` 假设获得完整读取审计。                                                          |
| Codex 的内部 Skill 记录 | 同版本 [core/src/skills.rs](https://github.com/openai/codex/blob/rust-v0.166.0/codex-rs/core/src/skills.rs) 为显式及隐式调用发射 `SkillInvocationEvent`，并记录 OTel/analytics                                               | 不能说 Codex 完全没有调用事件；但内部发射不等于当前重放环境已经导出、捕获了它。本调查未运行对应导出器。                                                      |
| GitHub Copilot          | 本机帮助支持 JSONL、`--usage-output-file` 和本地 OTel 导出；[SDK streaming events](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/streaming-events) 定义 `skill.invoked`                                    | 该 SDK 事件包含 name、path、实际注入的 content 及插件身份，是比最终自述更强的加载证据。仍需确认具体 CLI/SDK 版本、实际捕获路径及事件是否完整；未做真实运行。 |

[Copilot SDK skills](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/skills) 支持配置候选目录、禁用指定 Skill，并将 catalog 列举和按需加载分开。这些能力有助于控制实验输入，但若实验只提供目标 Skill，不能据其通过证明在实际竞争候选集中也会正确选择。

Codex 的 [catalog rendering](https://github.com/openai/codex/blob/rust-v0.166.0/codex-rs/ext/skills/src/render.rs) 会根据上下文预算截短 description 或省略条目。因此客户端、候选集和上下文条件是选择结果的一部分；把 description 单独发送给模型要求分类，测试的是另一个任务。本项目保存独立验证案例时，仍须说明重放所验证的读取层级，不能把定向加载后的执行结论扩展为自然选择结论。

## 成熟工具作为以后可选的扩展

以下只核对文档、源码和 registry 元数据，没有安装、试跑或选定依赖。版本是 2026-11-07 的快照，不是采用建议。

| 选项                     | 一手能力与元数据                                                                                                                                                                                                                                                                                                                                                                                                                    | 接入成本及适用边界                                                                                                                                                                                                                                                   |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Promptfoo                | [custom JS/TS provider](https://www.promptfoo.dev/docs/providers/custom-api/) 可返回 output、error、tokenUsage、cost、metadata；[tracing](https://www.promptfoo.dev/docs/tracing/) 支持工具轨迹和 trace-aware assertions。[npm 元数据](https://registry.npmjs.org/promptfoo/0.125.1)：0.125.1、MIT、Node ≥22.22.0。                                                                                                                 | 与本仓库 Node/TypeScript 环境相容。通用比较、评分、报告可交给库；真实 CLI 调用、环境、读取证据和结果归一化仍需项目适配。文档证明可扩展接口，不证明已存在适配本插件选择语义的完整 provider。                                                                          |
| Inspect AI + Inspect SWE | [Inspect agents](https://inspect.aisi.org.uk/agents.html) 支持外部 Agent；[Inspect SWE](https://meridianlabs-ai.github.io/inspect_swe/) 已有 `codex_cli()`，通过 sandbox agent bridge 运行真实客户端并把模型请求代理回 Inspect。[PyPI Inspect AI](https://pypi.org/pypi/inspect-ai/0.3.287/json)：0.3.287、MIT、Python ≥3.11；[Inspect SWE](https://pypi.org/pypi/inspect-swe/0.2.72/json)：0.2.72、MIT，依赖 Inspect AI ≥0.3.261。 | 已有 Codex 适配，能复用限额、日志和评分；本仓库需要额外 Python 环境及相应 sandbox。SWE 自身声明 Python ≥3.10，但采用最新 Inspect AI 的组合需 ≥3.11。代理方式和任务配置是否保留本项目所需原生发现行为仍待验证；没有找到现成 Copilot Skill 选择 adapter 的已核实证据。 |

这些库承担通用评测机制，不能替维护者决定何时应该读某内容，也不能从最终答复还原没有捕获的动作。对目前“保存案例、由维护 Agent 重放”的目标，使用新库可能不是必要条件。只有案例数量、运行频率、自动报告或环境隔离出现实际需求时，以上能力才构成进一步比较的依据。

## 样本、成本和重跑的限制

[Inspect metrics](https://inspect.aisi.org.uk/metrics.html) 提供重复 epoch、聚合器、标准误、bootstrap、二元比例的 Wilson 区间和 clustered standard error。重复运行可以揭示同一案例的不稳定性；同一任务的许多相近改写或重跑，不等于覆盖了许多独立任务。均值和“最好的一次成功”也回答不同的问题，不宜混为稳定通过。

成本可先从已有独立验证中观察，而不用假设 token 单价或规定完整矩阵。一次重放的资源包括执行 Agent、评价 Agent、必要工具和环境准备；采用旧新版对照时，两组执行都要计入。示意预算可写成：

```text
预计 token = Σ(案例重复数 × 每次执行 token)
           + Σ(需要语义评价的结果数 × 每次评价 token)
```

这是预算拆解，不是计费公式。若要估算成本，可分别观察缓存输入、普通输入、输出等实际用量及壁钟时间；不能由总 token 直接推出订阅扣费。较便宜的模型也不能仅凭价格承担既有标准要求的独立验证角色。

[Promptfoo caching](https://www.promptfoo.dev/docs/configuration/caching/) 明确：repeat 的不同 index 有不同缓存，但再次执行同一套 eval 可以重放各 index 的旧响应；需要新模型调用时使用 `--no-cache`。重放旧轨迹做新评分，可以验证判定器；不能证明新正文、新客户端或新模型再次执行仍然通过。对于案例资产，保留失败诊断和历史结果很有价值，但它们不能充当“已经重跑”的证据。

如何安排常规历史案例、改动直接影响的案例以及较重的完整任务，应由案例价值、观察到的成本和维护者决策确定。本调查没有测量本项目案例成本，因此没有证据支持固定 token 上限、通过率阈值、PR 强制全量或周期矩阵。

客户端身份和配置需要可回溯，但不能因此改变既有 scheduled workflow 的升级政策。[ADR 0006](../../../docs/adr/0006-let-gh-aw-select-copilot-cli.md) 已决定由固定 gh-aw compiler 选择 reviewed default；另一个本机或独立验证环境的版本记录，不授权改写该政策。

## 仍需在案例重放设计中回答的问题

- 现有独立验证中，哪些请求、起始素材、候选集条件和判定证据必须保存，后来的维护 Agent 才能重放同一个有意义的任务？
- 自然选择、定向加载后的执行和少量完整路径，各自能取得什么证据；读取通道不可见时应如何表明限制？
- 哪些历史案例与本次改动有实质关系，哪些共享读取入口使局部改动需要扩大重放范围？
- 什么样的真实重复结果足以支持稳定性结论，什么情况需要增加样本或人工复核？
- 何时现有 Agent 重放流程的实际成本和规模，才值得增加 library 或真实 CLI adapter？

本文没有确定最终案例 schema、执行器、自动排程或依赖。框架讨论可以先从保存已有有效案例及其独立预期开始，避免把一次没有执行的工具能力调查当作完整回归验证。

## 获取与验证边界

没有可调用的 Tavily 工具。实际先使用官方域 web 搜索；web 页面打开遇到 DNS 错误后，执行了 Shell 原页抓取。OpenAI 页面直接返回 403，使用已通过同源协议探测的本地 HTTP 代理完成抓取；其他来源取得文档或原代码。相关实质页面均已读取，不只依据搜索摘要。未触发网页浏览器兜底，因为 Shell 已取得正文。

Anthropic 代码与 workflow 已复核固定 commit `2c5958ecac7cee2b583967a2c4981d0f4a75c579`；Codex 源码对应本机 `rust-v0.166.0`。文档及 registry 信息随版本变化，本记录应在实际采用或执行时重新核对。本次没有运行外部示例、真实 Skill 选择实验、CLI adapter、计费测量或统计实验，也没有增加依赖、Issue 或 PR。
