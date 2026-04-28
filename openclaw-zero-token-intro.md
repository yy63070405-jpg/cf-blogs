# OpenClaw Zero Token：免API Token免费使用ChatGPT、Claude、Gemini等大模型！

你是否厌倦了为 AI 模型的 API 调用付费？

今天给大家介绍一个开源项目 —— **OpenClaw Zero Token**，让你完全免费使用 ChatGPT、Claude、Gemini、DeepSeek 等主流 AI 模型！

---

## 项目简介

OpenClaw Zero Token 是 OpenClaw 的分支版本，核心目标是**免除 API Token 费用**，通过模拟浏览器登录捕获会话凭证，实现对各大 AI 平台的免费访问。

### 传统方式 vs Zero Token 方式

| 对比项 | 传统方式 | Zero Token 方式 |
|--------|---------|----------------|
| 费用 | 需要购买 API Token | 完全免费 |
| 计费 | 按调用次数计费 | 无使用限制 |
| 支付 | 需要绑定信用卡 | 仅需网页登录 |
| 安全 | Token 可能泄露 | 凭证本地存储 |

---

## 支持的 AI 平台

### 已测试平台

| 平台 | 状态 | 支持模型 |
|------|------|---------|
| **DeepSeek** | ✅ 已测试 | deepseek-chat, deepseek-reasoner |
| **千问国际版** | ✅ 已测试 | Qwen 3.5 Plus, Qwen 3.5 Turbo |
| **千问国内版** | ✅ 新增 | Qwen 3.5 Plus, Qwen 3.5 Turbo |
| **Kimi** | ✅ 已测试 | Moonshot v1 8K, 32K, 128K |
| **Claude Web** | ✅ 已测试 | claude-3-5-sonnet, claude-3-opus, claude-3-haiku |
| **豆包 (Doubao)** | ✅ 已测试 | doubao-seed-2.0, doubao-pro |
| **ChatGPT Web** | ✅ 已测试 | GPT-4, GPT-4 Turbo |
| **Gemini Web** | ✅ 已测试 | Gemini Pro, Gemini Ultra |
| **Grok Web** | ✅ 已测试 | Grok 1, Grok 2 |
| **智谱清言 (GLM)** | ✅ 已测试 | glm-4-Plus, glm-4-Think |
| **GLM 国际版** | ✅ 新增 | GLM-4 Plus, GLM-4 Think |
| **Manus API** | ✅ 已测试 | Manus 1.6, Manus 1.6 Lite |

### 千问国内版 vs 国际版

- **千问国际版 (chat.qwen.ai)**：面向全球用户
- **千问国内版 (qianwen.com)**：面向中国用户，功能更完整（深度搜索、代码助手、图片生成等）

---

## 核心功能

### 1. 工具调用支持

所有支持的模型均可调用本地工具：

- **exec**：执行命令
- **read_file**：读取文件
- **list_dir**：列出目录
- **browser**：网页自动化
- **apply_patch**：应用补丁

### 2. 多种使用方式

- **Web UI**：基于 Lit 3.x 的网页界面
- **CLI/TUI**：命令行界面
- **Gateway**：API 网关（端口转发）
- **Channels**：Telegram 等频道接入

### 3. Agent 能力

- 文件访问受工作区目录限制
- 支持多轮对话上下文
- 支持流式响应

---

## 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                      OpenClaw Zero Token                     │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  Web UI  │  │ CLI/TUI  │  │ Gateway  │  │ Channels │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       └─────────────┴─────────────┴─────────────┘          │
│                          │                                   │
│                 ┌────────▼────────┐                        │
│                 │   Agent Core    │                        │
│                 │  (PI-AI Engine) │                        │
│                 └────────┬────────┘                        │
│                          │                                   │
│  ┌───────────────────────┼───────────────────────┐         │
│  │                       │                       │         │
│  ▼                       ▼                       ▼         │
│ DeepSeek            ChatGPT Web              Claude Web    │
│ 千问/Kimi           Gemini Web               豆包/GLM      │
└─────────────────────────────────────────────────────────────┘
```

---

## 快速开始

### 环境要求

- Node.js 18+
- Python 3.10+（用于浏览器自动化）
- Playwright

### 安装步骤

**1. 克隆项目**

```bash
git clone https://github.com/linuxhsj/openclaw-zero-token.git
cd openclaw-zero-token
```

**2. 安装依赖**

```bash
# 安装 Node.js 依赖
npm install

# 安装 Python 依赖
pip install playwright
playwright install
```

**3. 配置提供商**

编辑配置文件，添加你的 AI 平台账号：

```yaml
providers:
  - name: deepseek
    type: web
    enabled: true
    
  - name: chatgpt
    type: web
    enabled: true
```

**4. 启动服务**

```bash
# 启动 Web UI
npm run web

# 或启动 CLI
npm run cli
```

**5. 登录认证**

首次使用需要通过浏览器登录各个 AI 平台，系统会自动捕获会话凭证并本地存储。

---

## 使用方式

### Web UI

访问 http://localhost:3000，选择要使用的 AI 模型，开始对话。

### CLI 模式

```bash
# 启动交互式 CLI
npm run cli

# 指定模型
npm run cli -- --model deepseek-chat
```

### API 网关

启动 Gateway 后，可以通过 OpenAI 兼容的 API 调用：

```bash
curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

---

## 安全说明

### 凭证存储

- 所有会话凭证存储在本地
- 不会上传到任何服务器
- 支持加密存储

### 使用建议

1. **定期更新凭证**：长时间未使用可能需要重新登录
2. **不要分享凭证文件**：凭证文件包含你的登录信息
3. **遵守平台规则**：合理使用，避免滥用

---

## 注意事项

### 法律声明

本项目仅供学习和研究使用，请遵守各 AI 平台的使用条款。使用本项目所产生的一切后果由用户自行承担。

### 使用限制

- 部分平台可能有频率限制
- 长时间大量使用可能触发风控
- 建议合理使用，避免账号被封

---

## 常见问题

### Q: 真的完全免费吗？

是的，通过模拟浏览器登录使用各平台的免费额度，无需购买 API Token。

### Q: 会封号吗？

合理使用一般不会有问题，但不建议频繁大量调用。

### Q: 支持 Agent 功能吗？

支持，所有模型都可以调用本地工具，执行命令、读写文件等。

### Q: 凭证会过期吗？

会的，长时间未使用可能需要重新登录刷新凭证。

---

## 项目地址

- **GitHub**：https://github.com/linuxhsj/openclaw-zero-token
- **文档**：https://github.com/linuxhsj/openclaw-zero-token/blob/main/README_zh-CN.md

---

## 总结

OpenClaw Zero Token 是一个非常有价值的开源项目：

- ✅ 完全免费使用主流 AI 模型
- ✅ 支持 ChatGPT、Claude、Gemini、DeepSeek 等
- ✅ 支持 Agent 工具调用
- ✅ 多种使用方式（Web/CLI/API）
- ✅ 凭证本地存储，安全可靠

如果你想要免费使用各种 AI 模型，这个项目绝对值得一试！

---

**推荐指数**：⭐⭐⭐⭐⭐

**项目地址**：https://github.com/linuxhsj/openclaw-zero-token

快去试试吧！
