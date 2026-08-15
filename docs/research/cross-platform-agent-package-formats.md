# Codex 与 GitHub Copilot 的跨平台插件格式

调研日期：2026-08-15

## 结论

当前最稳妥的组合是：

1. 用 `.claude-plugin/marketplace.json` 作为仓库级插件目录。
2. 每个插件用根目录 `plugin.json`，并声明 Agent Plugins v1 的 `$schema`。
3. 可移植内容只放在 `skills/<name>/SKILL.md`，需要 MCP 时再增加根目录 `mcp.json`。

这不是一个完整的“跨平台 marketplace 标准”：Agent Plugins v1 只规范插件包及其组件，不规范 marketplace 的发现、发布或安装协议。`.claude-plugin/marketplace.json` 是 Codex 与 Copilot 当前共同识别的目录格式，而根目录 `plugin.json` 才是两者共同支持的可移植包格式。[Agent Plugins 规范](https://agent-plugins.org/specification)将状态标为 **Working Draft**，采用时应固定到 `1.0.0` 并持续关注变更。

## 为什么是这个组合

| 层次 | 推荐格式 | Codex | GitHub Copilot | 兼容性质 |
| --- | --- | --- | --- | --- |
| Marketplace 目录 | `.claude-plugin/marketplace.json` | OpenAI 文档明确列为 `legacy-compatible marketplace` | Copilot CLI 文档明确列为可搜索位置 | 两端产品兼容，不属于 Agent Plugins 标准 |
| 插件清单 | `<plugin>/plugin.json` + Agent Plugins v1 `$schema` | Agent Plugins 兼容客户端列表包含 ChatGPT & Codex；Codex 实现识别该 schema | Copilot 文档明确支持 Open Plugin Spec / Agent Plugins v1 | 正式的可移植包契约 |
| Skill | `skills/<name>/SKILL.md` | 支持 | 支持 | Agent Skills 标准 |
| MCP | `<plugin>/mcp.json` | `stdio`、`streamable-http` | `stdio`、`streamable-http`、`sse` | 两端交集为 `stdio` 与 `streamable-http` |

目录层的依据：OpenAI 的插件文档明确说明 ChatGPT/Codex 可读取仓库中的 [`.claude-plugin/marketplace.json`](https://developers.openai.com/plugins/build/plugins#how-local-marketplaces-work)，并把它称为 legacy-compatible；Copilot CLI 也明确说明会在 [`.claude-plugin/` 中查找 `marketplace.json`](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference#marketplacejson)。

包格式的依据：Agent Plugins v1 要求插件根目录存在 [`plugin.json`](https://agent-plugins.org/specification#51-location-and-loading)，固定发现 `skills/` 与 `mcp.json`；其当前[兼容客户端清单](https://agent-plugins.org/compatible-clients)包含 GitHub Copilot 和 ChatGPT & Codex。Copilot 文档说明在根目录 `plugin.json` 中声明 canonical `$schema` 即启用 [Agent Plugins v1 语义](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference#open-plugin-spec-support)。Codex 在当前实现中也显式识别根目录 `plugin.json` 及 `1.0.0` schema；这是实现证据，不应替代产品文档承诺（[固定版本源码](https://github.com/openai/codex/blob/2ca575026cef066a58c70f6bdee4feafa6e63d3a/codex-rs/utils/plugins/src/plugin_namespace.rs#L9-L15)）。

## 推荐目录

```text
.
├── .claude-plugin/
│   └── marketplace.json
└── plugins/
    └── example-plugin/
        ├── plugin.json
        ├── skills/
        │   └── example-skill/
        │       └── SKILL.md
        └── mcp.json                 # 可选
```

Marketplace 使用最小、保守的字段交集：

```json
{
  "name": "knowledge-base",
  "owner": {
    "name": "Soulike"
  },
  "plugins": [
    {
      "name": "example-plugin",
      "description": "An example knowledge plugin",
      "source": "./plugins/example-plugin"
    }
  ]
}
```

相对路径统一保留 `./` 前缀。Copilot 接受字符串或对象形式的 `source`；Codex 当前 marketplace 解析器也接受字符串路径，并在未提供 `policy` 时使用默认策略（[固定版本源码](https://github.com/openai/codex/blob/2ca575026cef066a58c70f6bdee4feafa6e63d3a/codex-rs/core-plugins/src/marketplace.rs#L968-L1015)）。后者属于实现兼容细节，因此目录中不应依赖 Codex 专有的 `policy` 字段来表达跨端核心行为。

每个插件使用 Agent Plugins v1 清单：

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "example-plugin",
  "version": "0.1.0",
  "description": "An example knowledge plugin"
}
```

`$schema` 与 `name` 都是 v1 必填字段；其余允许字段及命名约束见[清单规范](https://agent-plugins.org/specification#52-manifest-object)。

## 可移植边界

Agent Plugins v1 只定义两类组件：

- `skills/<name>/SKILL.md`，内容应遵循 [Agent Skills 规范](https://agentskills.io/specification)。
- `mcp.json`，使用 Agent Plugins 的封闭配置格式，而不是任一客户端原生的 `.mcp.json` 形状。

规范明确把 commands、hooks、agents、rules 和 LSP servers 排除在 v1 之外，因为它们仍然依赖客户端语义（[设计说明](https://agent-plugins.org/specification#why-only-agent-skills-and-mcp-in-v1)）。因此这些能力不应放进跨端核心；确有需要时，应通过客户端扩展或额外清单维护，并接受双端行为不同。

对于 MCP，Codex 与 Copilot 的共同传输类型是 `stdio` 和 `streamable-http`；`sse` 只在当前兼容清单中标为 Copilot 支持。精确支持矩阵可在 Agent Plugins 站点的[固定版本客户端数据](https://github.com/agentplugins/agent-plugins-site/blob/b946d6f331055fe83bc675f213e49b53d9371d20/lib/compatible-clients.ts#L69-L103)中核对。

## 若仍需兼容 Claude Code

`.claude-plugin/marketplace.json` 本身是 Claude Code 的原生 marketplace 格式，但 Agent Plugins 当前兼容客户端列表没有列出 Claude Code。Claude Code 的原生插件清单是 [`.claude-plugin/plugin.json`](https://code.claude.com/docs/en/plugins-reference#plugin-manifest-schema)，而非 Agent Plugins 根目录清单。因此三端可以共享 marketplace 目录和 `skills/` 内容，却没有一个由三端共同正式承诺的插件清单格式；若恢复三端目标，应为 Claude Code 增加最小 `.claude-plugin/plugin.json`，并把 Agent Skills 作为唯一可靠的共享核心。
