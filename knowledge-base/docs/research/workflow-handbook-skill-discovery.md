# Workflow Skills 与 Handbook Skills 的发现机制调查

将独立 Knowledge 的入口包装为原生 Skill，在格式和按需加载机制上可行；目前证据不足以认定它比研究基线的 Catalog 更可靠。原生 Skill 仍把描述目录交给模型判断，Codex 还会截短描述或省略条目。值得比较的是：在相同任务和竞争候选集下，适用知识能否及时读到、实际运用，以及进入测试、排错、审查阶段后能否补读，同时减少无关加载。触发率只解释其中一个环节。[Codex Skills](https://developers.openai.com/codex/skills)、[Agent Skills 客户端实现指南](https://agentskills.io/client-implementation/adding-skills-support)、[OpenAI Skill 评测指南](https://developers.openai.com/blog/eval-skills)

本记录保存 2026-11-08 研究阶段的一手资料和待验证假设，支持后续设计与迁移；不定义最终工程规格，也没有报告真实客户端对照结果。调查的仓库基线为 [4309f3936a3666ef1acb6265179f3a27f2cf2e1d](https://github.com/Soulike/knowledge-base/tree/4309f3936a3666ef1acb6265179f3a27f2cf2e1d)。下文的旧分类、路由和源码数字均指该快照，固定版本链接用于保留历史证据；了解维护中的当前定义，应从[产品作者规则](../../AGENTS.md)和[产品术语表](../../GLOSSARY.md)进入。

## 被比较的两种职责

调查基线中的产品把 **Knowledge** 定义为任务、主题或当前材料独立产生阅读需要的理解；**Skill** 定义为拥有任务决策、步骤和完成条件的工作流。该版本的 Catalog 是每个 Knowledge leaf 的统一路由表。这是当时产品选择的职责模型，不是 Agent Skills 文件格式强制的分类。[基线术语表](https://github.com/Soulike/knowledge-base/blob/4309f3936a3666ef1acb6265179f3a27f2cf2e1d/knowledge-base/GLOSSARY.md)、[基线分类参考](https://github.com/Soulike/knowledge-base/blob/4309f3936a3666ef1acb6265179f3a27f2cf2e1d/knowledge-base/plugin/references/agents/knowledge-and-skills.md)

本次讨论所选的职责边界是：**Workflow Skill** 拥有任务决策、步骤和完成条件；**Handbook Skill** 提供原则、约束、判断标准与条件式查阅。拟议 Handbook 的 description 表达哪些任务或材料需要某组理解，正文再指向相应 Knowledge。这里的 Handbook 是本产品的设计名称，不是 Codex、Copilot 或标准中已存在的 Skill 类型；具体分组与路由方案也不能由格式支持直接推出。

二者可复用相同知识正文，但包装可用性与内容职责是两件事。若保留独立 Knowledge 的生命周期，Handbook 入口应路由到一个权威知识源；把同一理解复制进多个工作流，会增加另一种同步责任。这个判断来自调查基线中的检索来源和生命周期测试，而非客户端要求。[基线分类边界](https://github.com/Soulike/knowledge-base/blob/4309f3936a3666ef1acb6265179f3a27f2cf2e1d/knowledge-base/plugin/references/agents/knowledge-and-skills.md#boundary)、[基线仓库包边界](https://github.com/Soulike/knowledge-base/blob/4309f3936a3666ef1acb6265179f3a27f2cf2e1d/AGENTS.md#repository-architecture)

## 原生机制已经证明什么

| 问题               | 已核实的机制                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 对候选设计的含义                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 模型最初看到什么   | Codex 最初披露 name、description 和文件路径；Copilot 按 prompt 与 description 决定使用 Skill。标准客户端指南把初始元数据称为 catalog。[Codex](https://developers.openai.com/codex/skills)、[Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)、[实现指南](https://agentskills.io/client-implementation/adding-skills-support#step-3-disclose-available-skills-to-the-model)                                                                                   | Handbook description 能成为首轮选择信号，但仍是模型要使用的描述目录。                             |
| 正文什么时候加载   | Codex 决定使用后读取完整 SKILL.md；Copilot 选择后将 SKILL.md 注入上下文。把详细知识放在正文或支持文件中，能推迟它们进入上下文。[Codex](https://developers.openai.com/codex/skills)、[Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills#using-agent-skills)                                                                                                                                                                                                     | 这是入口与正文分层的能力，没有证明特定入口会被正确选择。                                          |
| 支持文件如何加载   | 标准允许 references、scripts、assets 及其他目录。Copilot 调用时发现 Skill 目录内的文件并使其可用；SDK 文档进一步明确相关文件列表与普通文件工具读取是不同动作，列出不等于读取正文。[标准](https://agentskills.io/specification#optional-directories)、[Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills#enabling-a-skill-to-run-a-script)、[Copilot SDK](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/skills#supporting-files-experimental) | Handbook 可以条件式选读，但选中入口后仍有选择 leaf、读取和运用三步。                              |
| 隐式调用能否关闭   | Codex 的 agents/openai.yaml 中 allow_implicit_invocation 默认 true；false 禁止按用户请求隐式调用，显式调用仍有效。Copilot SDK 的实验性 provider 元数据有 disableModelInvocation，并映射 frontmatter 的 disable-model-invocation；这不是同一个跨客户端字段。[Codex](https://developers.openai.com/codex/skills#optional-metadata)、[Copilot SDK](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/skills#serving-existing-skillmd-files)                                                        | 实验必须确认候选处于可隐式调用状态，不能把格式存在当作调用资格；不应把客户端扩展当作标准保证。    |
| 元数据规模是否无限 | Codex 默认初始列表预算是模型上下文的 2%，未知窗口时为 8,000 字符；先缩短 description，大量安装时可能省略 Skill 并显示警告，可通过 skills.max_context_tokens 调整预算，最高 10,000 tokens。[Codex](https://developers.openai.com/codex/skills)                                                                                                                                                                                                                                                                 | 将 leaf 逐个转成 Skill 或增加大量 Handbook 会占用同一个有限选择面；覆盖面和描述前部信息需要实测。 |
| 文件修改如何生效   | Codex 自动检测 Skill 变更，未出现时可重启；配置变化要求重启。Copilot CLI 提供 /skills reload；SDK 明确自定义目录中的文件变化不会在后续轮次自动刷新 catalog，需 skills.reload RPC 或改变配置目录。[Codex](https://developers.openai.com/codex/skills)、[Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills#skills-commands-in-the-cli)、[Copilot SDK](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/skills#built-in-skills-and-mode-empty)     | 每次对照都要确认实际加载了哪版候选描述，不能只检查磁盘内容。                                      |

这些机制支持“以任务描述为入口，正文再渐进披露知识”。[Agent Skills 标准](https://agentskills.io/specification#body-content)对 Markdown body 没有结构限制；[标准首页](https://agentskills.io/home)明确涵盖专门知识和工作流。因此没有找到排斥 Handbook 内容形态的格式规则。不过 [OpenAI 插件作者指南](https://developers.openai.com/plugins/build/skills#define-the-workflow-boundary)要求围绕可识别用户目标，明确输入、步骤、结果和所需支持材料。把一组文章列成主题索引虽然符合文件格式，仍可能缺少足以指导选读和应用的任务条件。

### 多个 Skill、相互调用和长任务

原生列表可以包含多个 Skill；Copilot SDK 也支持给 custom agent 显式预加载多个 Skill，并讨论多个 Skill 的指令冲突。这证明多个正文可以共存，不能证明自然请求总能同时选中全部适用入口，更不能证明加载顺序、冲突解决或重新选择的完成条件。已读取的 Codex 和 Copilot 页面没有为自动共激活给出这样的保证。[Codex](https://developers.openai.com/codex/skills)、[Copilot SDK](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/skills#skills--custom-agents)

Handbook 可直接链接同一安装包内的知识文件。它不必让 Workflow Skill 再调用 Handbook Skill，也不必把知识目录改成另一套 Skill 目录。调查基线中的产品规则明确要求直接读取共享文件，并指出 Skill-to-Skill invocation 不是可移植执行契约；标准的渐进披露也只建立了文件和资源的加载形态，没有规定跨 Skill 的调度返回语义。[基线作者规则](https://github.com/Soulike/knowledge-base/blob/4309f3936a3666ef1acb6265179f3a27f2cf2e1d/knowledge-base/AGENTS.md#skills-and-references)、[Agent Skills 标准](https://agentskills.io/specification#file-references)

对压缩上下文，必须区分建议与已说明的产品行为。标准客户端指南建议保护已加载 Skill 内容、避免重复注入；不能据此认定所有客户端都这样实现。Copilot SDK 对支持文件明确说明：压缩后保留 Skill 指令，file-based Skill 保留路径；实验性 provider 的目录路径不会保留，再调用可恢复。这里的证据适用于该 SDK/runtime 说明，不能直接推广到 Copilot 所有界面。此轮没有核实 Codex 压缩后对元数据、正文和已读 leaf 的完整保留策略。[实现指南](https://agentskills.io/client-implementation/adding-skills-support#step-5-manage-skill-context-over-time)、[Copilot SDK](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/skills#rules-and-limits)

即使 Skill 指令保留下来，仍不能推出实现结束后一定会加载测试知识，或发现故障后一定会补读诊断知识。**发现元数据、选择入口、保留旧指令、发现新的阅读需要**是不同环节。是否在自然阶段变化时完成后两者，是本项目需要观察的行为。

### 安装目录与命名的可移植边界

Agent Skills 定义单个 Skill 的格式；本仓库选择的 Agent Plugins v1 另行定义包内发现位置。其 §7.1 要求在固定 skills/ 下发现直接子目录中的 SKILL.md，禁止递归寻找更深后代中的额外 Skill。因此 `skills/workflows/<task>/SKILL.md` 与 `skills/handbooks/<subject>/SKILL.md` 不能作为该规范保证的安装布局。v1 manifest schema 也没有可配置多个 Skill 根目录的可移植字段；extensions 中的客户端专有设置不具有标准赋予的通用语义。[Agent Plugins v1 §7.1](https://agent-plugins.org/specification#71-skills)、[v1.0.0 manifest schema](https://agent-plugins.org/schemas/1.0.0/plugin.schema.json)

这个边界不表示所有原生 Skill 根目录都不能递归。Codex `rust-v0.167.0` 的实现区分 Recursive 与 DirectChildren，并根据根目录上下文选择扫描方式；这说明不能把一般原生根目录的递归能力直接推广为插件包契约。该源码观察也不代表已经测试了所有客户端或安装路径。[Codex discovery.rs](https://github.com/openai/codex/blob/rust-v0.167.0/codex-rs/ext/skills/src/loader/discovery.rs)、[Codex host.rs](https://github.com/openai/codex/blob/rust-v0.167.0/codex-rs/ext/skills/src/loader/host.rs)

可移植的候选命名是把两类都放在 skills/ 的直接子目录，以 workflow-<task> 与 handbook-<subject> 前缀表达职责。以下只是布局示例，具体名字和分组仍由产品设计确定：

```text
skills/
├── workflow-review-tests/
│   └── SKILL.md
└── handbook-engineering/
    └── SKILL.md
```

目录名与 frontmatter name 应一致；前缀也计入标准的 64 字符名称限制。可另外用 metadata.kind 的字符串值供仓库验证两类职责，因为标准允许自定义 metadata；它不是客户端识别 Handbook 的原生开关，也不会替代 description 的任务条件。[Agent Skills 名称与 metadata](https://agentskills.io/specification#frontmatter)

## “原生更可靠”的证据边界

已读取的一手文档说明的是元数据进入上下文、模型判断相关性和加载指令，没有提供“Codex 或 Copilot 经特定 Skill 选择训练，因此比本插件 Catalog 更准确”的训练细节或对照结果。[标准客户端指南](https://agentskills.io/client-implementation/adding-skills-support#model-driven-activation)更直接说明，多数实现依赖模型自己的判断，而非 harness 侧的关键词触发器。因此原生接口和训练优势是不同命题；前者可核实，后者目前没有足以用于本设计决策的证据。

官方经验也不支持单调改善的假设。OpenAI 的 [Shell + Skills + Compaction](https://developers.openai.com/blog/skills-shell-tips)转述 Glean：采用 Skill 后，针对性评测中的触发曾下降约 20%，添加负例和边界覆盖后恢复；另一 Salesforce 工作流报告准确率由 73% 到 85%、首 token 时间下降 18.1%。这是官方发布的生产经验，未在该文给出可用于本项目复现的完整数据和消融对照，场景也不是本插件的独立知识检索，不能当作迁移收益预测。

[OpenAI 关于 Skill 描述的指南](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra)指出，过长、互相冲突或过分强调调用的 description 会使模型加载无助于任务的指令，并建议多分支 Skill 用最小 router 渐进披露。对 Handbook 的推论是：描述需要覆盖真实阅读任务，同时区别邻近入口；宽泛的“开发软件时使用”可能大量加载无关知识，过窄的术语触发又可能错过尚未诊断出问题的任务。哪种边界有效，需要沿用[先保存既有覆盖再写触发条件](../../plugin/references/agents/selection-triggers.md#establish-coverage-before-drafting)的方法检验。

Catalog 的长期使用困难可以作为待检验现象，但目前不能直接归因为“注意力随时间衰减”。[Lost in the Middle](https://arxiv.org/abs/2307.03172)在 2023 年研究的多文档问答与键值检索中发现相关信息位置影响表现，尤其长上下文中部；它不是当前 Codex/Copilot 的 Skill 选择或跨阶段知识实验。它支持观察上下文位置和长度，不能证明本产品的原因或 Handbook 能修复它。模型遗漏阅读需要、描述竞争、知识内容本身难以应用、压缩丢失信息，以及没有明确阶段重检，都应作为可区分的解释。

## 调查快照中的比较基线

团队对上述 commit 使用该版本的 Markdown AST 解析器观察 Catalog，并检查 Skill 元数据与文件；以下是基线源码规模，不是后续版本现状，也不是实际 token、加载次数或延迟。Catalog 的路径、类型和条件由[基线解析器](https://github.com/Soulike/knowledge-base/blob/4309f3936a3666ef1acb6265179f3a27f2cf2e1d/knowledge-base/lib/knowledge-catalog-validation/parse.ts)读取，Knowledge 完整性由[基线格式检查器](https://github.com/Soulike/knowledge-base/blob/4309f3936a3666ef1acb6265179f3a27f2cf2e1d/knowledge-base/tools/check-knowledge-format/check.ts)检查。

| 项目                                                                                                                                             | 本轮源码快照                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 应如何解释                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Knowledge                                                                                                                                        | 63 leaves，19 个领域目录；41 evergreen、22 time-sensitive                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 是需要保留的责任和维护分类，不等于 63 个 Handbook 的适当边界。                                                                          |
| [基线 Catalog](https://github.com/Soulike/knowledge-base/blob/4309f3936a3666ef1acb6265179f3a27f2cf2e1d/knowledge-base/plugin/knowledge/index.md) | 23,491 bytes，77 行；相同已解析 path/type/trigger 以紧凑制表记录表达为 11,068 bytes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 格式填充占用可观；与原生方案比较前，应设语义相同的紧凑 Catalog 对照。                                                                   |
| 安装包内[基线 Skills](https://github.com/Soulike/knowledge-base/tree/4309f3936a3666ef1acb6265179f3a27f2cf2e1d/knowledge-base/plugin/skills)      | 22 个；name + description 为 5,655 bytes；全部 Skill 文件合计 161,428 bytes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 正文并非启动全部加载；原生选择面还会包含用户、系统、其他插件或项目 Skill。                                                              |
| 全部 Knowledge 正文                                                                                                                              | 606,520 bytes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 现有方案已经选择性读取 leaves，不能把这个总量算成当前启动成本。                                                                         |
| 基线的两个任务初始入口                                                                                                                           | [基线 Catalog loader](https://github.com/Soulike/knowledge-base/blob/4309f3936a3666ef1acb6265179f3a27f2cf2e1d/knowledge-base/plugin/skills/load-knowledge-catalog/SKILL.md) 1,004 bytes；[基线协作 loader](https://github.com/Soulike/knowledge-base/blob/4309f3936a3666ef1acb6265179f3a27f2cf2e1d/knowledge-base/plugin/skills/load-collaboration-guidance/SKILL.md) 1,571 bytes，另读[基线协作原则](https://github.com/Soulike/knowledge-base/blob/4309f3936a3666ef1acb6265179f3a27f2cf2e1d/knowledge-base/plugin/references/agents/independent-collaboration.md) 5,958 bytes | 基线 Catalog loader 要读全部 Catalog、持续应用所有 When to Read、范围变化时重检；协作入口是另一独立责任，不能把其删除收益归给知识发现。 |

基线路由并非全部只能从总 Catalog 到正文。该版本 Skill 入口中的静态链接包含 7 个 Skill 的 7 次 Catalog 引用，也有 10 个 Skill 的 31 次直接 Knowledge 引用，涉及 14 个 leaves；这个链接计数不能代表运行次数。[基线生成图像工作流](https://github.com/Soulike/knowledge-base/blob/4309f3936a3666ef1acb6265179f3a27f2cf2e1d/knowledge-base/plugin/skills/design-image-generation-prompts/SKILL.md)有先 Catalog 后匹配正文的路径，[基线测试审查工作流](https://github.com/Soulike/knowledge-base/blob/4309f3936a3666ef1acb6265179f3a27f2cf2e1d/knowledge-base/plugin/skills/review-and-improve-tests/SKILL.md)、[基线文档编写工作流](https://github.com/Soulike/knowledge-base/blob/4309f3936a3666ef1acb6265179f3a27f2cf2e1d/knowledge-base/plugin/skills/write-dev-documentation/SKILL.md)则直接读部分知识。因此直接绑定工作流的知识加载在调查基线中已经存在，比较应检查 Handbook 增加了哪些独立覆盖，而不是把基线描绘为毫无任务路由。

`pnpm agent-tests:list` 在调查基线上确认 5 个历史案例均保护仓库作者维护或案例重放行为，没有覆盖安装后 Catalog/native Skill 的自动加载和应用。[历史 PR #144](https://github.com/Soulike/knowledge-base/pull/144)的真实候选集元数据选择试验明确没有执行客户端 invocation harness；[基线中的 Agent 回归评测研究](https://github.com/Soulike/knowledge-base/blob/4309f3936a3666ef1acb6265179f3a27f2cf2e1d/knowledge-base/docs/research/agent-regression-evaluation.md)也区分了元数据选择、定向加载后的执行和完整客户端路径。这些资产可支持案例设计，不能充当本次架构改进的运行结果。

若只改变运行时发现入口，可以保留 Catalog 的权威元数据角色，避免同时改动检查和定期验证目标。若改变基线中的唯一 Catalog 模型，则需处理该版本的[作者规则](https://github.com/Soulike/knowledge-base/blob/4309f3936a3666ef1acb6265179f3a27f2cf2e1d/knowledge-base/AGENTS.md#knowledge)、[术语表](https://github.com/Soulike/knowledge-base/blob/4309f3936a3666ef1acb6265179f3a27f2cf2e1d/knowledge-base/GLOSSARY.md)、[分类参考](https://github.com/Soulike/knowledge-base/blob/4309f3936a3666ef1acb6265179f3a27f2cf2e1d/knowledge-base/plugin/references/agents/knowledge-and-skills.md)、[格式检查](https://github.com/Soulike/knowledge-base/blob/4309f3936a3666ef1acb6265179f3a27f2cf2e1d/knowledge-base/tools/check-knowledge-format/check.ts)、[Catalog 解析](https://github.com/Soulike/knowledge-base/blob/4309f3936a3666ef1acb6265179f3a27f2cf2e1d/knowledge-base/lib/knowledge-catalog-validation/parse.ts)和[定期验证目标 adapter](https://github.com/Soulike/knowledge-base/blob/4309f3936a3666ef1acb6265179f3a27f2cf2e1d/.github/scripts/content-verification-contract/adapters/knowledge-base-targets.ts)的责任关系。尤其 evergreen/time-sensitive 分类仍需一个权威来源。这里只记录基线的影响面；后续维护应回到[当前作者规则](../../AGENTS.md)、[当前 Catalog 解析器](../../lib/knowledge-catalog-validation/parse.ts)和[当前定期验证目标 adapter](../../../.github/scripts/content-verification-contract/adapters/knowledge-base-targets.ts)，按届时实现核对。

## 有区分力的下一步比较

首先固定“成功”的共同含义：自然任务中读到当时适用知识，在代码、测试、诊断或审查结果中正确应用，任务阶段变化后补读新增适用知识；同时观察无关读取、token 和时间。显式点名目标只用于确认安装和正文可用，不能用来证明自然发现改善。[OpenAI Skill 评测指南](https://developers.openai.com/blog/eval-skills)、[现有回归评测研究](agent-regression-evaluation.md)

可以先比较三条路径，知识内容和既有覆盖保持一致，入口划分仍是候选而非已定方案：

| 路径                   | 改变什么                                                      | 能区分什么                                                                              |
| ---------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| A：调查基线            | 上述 commit 的 Catalog 和加载要求                             | 提供固定的迁移前对照。                                                                  |
| B：紧凑 Catalog        | 保留相同 leaf、类型和阅读条件，只减去显示填充等格式成本       | A 与 B 的差值检验目录表达成本，避免将压缩收益归给原生选择。                             |
| C：任务或领域 Handbook | 通过原生 description 选择入口，正文再条件式指向同一 Knowledge | 与 B 比较原生入口及分组的综合效果；若两者都改变，不能仅凭结果归因于模型训练或原生调用。 |

若 C 改变了理解内容、任务条件或分组，可用同一分组的 Catalog 路由作为追加对照。另一个可讨论的选择是保留小型独立 Catalog，同时让少量高度内聚 Handbook 覆盖需要多 leaf 联合应用的任务。这些方案都应先接受覆盖与责任评估，不必一开始就全量迁移。[选择条件评估](../../plugin/references/agents/selection-triggers.md#check-selection-from-requests)

有价值的案例应包括：

- 不命名知识概念的宽泛真实任务，例如实现文件上传，预期在设计重试和失败处理前发现相关理解；直接表达主题的请求用于检查明确覆盖，相邻负例用于检查无关加载。
- 同一任务从实现进入测试、出现故障后排错、再审查修改；分别观察首次读取、新增适用知识的补读和实际应用。用户的自然阶段请求不应包含“现在读取某 Handbook”一类提示。
- 一个需要多个独立责任的任务，例如文件操作同时涉及路径身份、失败处理和测试保护；检查多个入口是否都被选中，以及顺序和重叠指令有没有实际影响。
- 足够长的上下文、实际压缩前后、候选集扩张和相似 description；同时包含软件之外的现有生成媒体或报告任务，以防新的划分悄悄缩窄旧覆盖。

实际执行前应记录客户端与模型版本、安装包版本、全部竞争候选、有效 invocation policy、配置预算、任务材料和是否恢复旧会话。候选内容的最终渲染结果比源码 description 更接近模型实际输入；若不能捕获，就明确这个观察缺口。相同任务应在隔离的新上下文中做配对和重复观察，保留所有结果，避免只报告最好的一次。这是实验设计建议，本轮未规定样本门槛或稳定通过率。[Codex 元数据预算](https://developers.openai.com/codex/skills)、[OpenAI Skill 评测指南](https://developers.openai.com/blog/eval-skills)

证据需要分层留存：安装与元数据可见性、Skill 激活、leaf 的实际读取、最终产物中的运用、阶段变化后的补读，以及真实运行用量。Copilot SDK 的 [skill.invoked 事件](https://docs.github.com/en/copilot/how-tos/copilot-sdk/features/streaming-events)可提供调用证据，但仍需确认当前执行方式能够捕获；一个调用事件不证明支持文件已读或知识正确使用。Codex 的公开 JSONL 能记录已暴露动作和产物，不能未经验证就当作完整读取审计。[OpenAI 评测指南](https://developers.openai.com/blog/eval-skills)、[现有客户端观察边界](agent-regression-evaluation.md)

若 A/B/C 都漏掉相同知识，或已读取却应用错误，下一步应检查共同的任务条件和知识正文；若 C 只提高触发却增加无关读取或降低成果质量，它尚未实现目标；若 C 在自然阶段变化和长任务中持续改善结果，且覆盖无损、资源成本可接受，才形成进一步设计和局部迁移的行为依据。这个判别逻辑不要求事先接受“原生一定更好”的原因解释。

## 资料获取和验证范围

研究时没有可调用的 Tavily；先搜索官方 OpenAI/GitHub/标准资料，并实际尝试打开页面。web 打开遇到 DNS 错误后，Shell 直取 Codex Skills 返回 403；按[基线本地代理回退流程](https://github.com/Soulike/knowledge-base/blob/4309f3936a3666ef1acb6265179f3a27f2cf2e1d/knowledge-base/plugin/skills/retry-via-local-proxy/SKILL.md)进行同源 HEAD 探测验证 HTTP 代理，再保持原网址读取成功。引用的机制文档、官方经验文章及论文摘要均取得并阅读正文，未仅用搜索摘要。Shell 已获得材料，没有继续调用浏览器兜底，也没有更改持久网络配置。

文档快照随客户端变化；SDK 的实验性 provider 行为应在采用时重核。论文只核实摘要及版本记录，没有用于推导本项目的因果或性能结论。研究阶段没有训练内部资料、真实客户端选择运行、跨阶段/压缩实验、收费或延迟测量，也没有新增依赖或修改产品文件、Git ref、Issue、PR。本文提供证据与比较设计，不代表后续迁移已经取得这些运行验证。
