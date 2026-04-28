# CoPaw：3分钟部署你的AI个人助理，本地云端都能跑！

你有没有想过拥有一个属于自己的 AI 个人助理？

一个可以帮你整理邮件、推送热帖摘要、定时执行任务的智能助手？

今天给大家介绍 **CoPaw** —— 一个开源的 AI 个人助理，安装极简，本地和云端都能部署！

---

## CoPaw 是什么？

CoPaw 是一个由阿里开源的 AI 个人助理框架，核心特点：

- **全域触达**：支持钉钉、飞书、QQ、Discord、iMessage 等多平台
- **由你掌控**：记忆与个性化完全由你控制，本地或云端均可部署
- **Skills 扩展**：内置定时任务，自定义技能目录，自动加载

---

## 你可以用 CoPaw 做什么？

### 社交媒体
- 每日热帖摘要（小红书、知乎、Reddit）
- B站/YouTube 新视频摘要

### 生产力
- 邮件与 Newsletter 精华推送到钉钉/飞书/QQ
- 邮件与日历整理联系人

### 创意与构建
- 睡前说明目标，自动执行，次日获得雏形
- 从选题到成片全流程

### 研究与学习
- 追踪科技与 AI 资讯
- 个人知识库检索复用

### 桌面与文件
- 整理与搜索本地文件
- 阅读与摘要文档

---

## 安装教程

### 方法一：pip 安装（推荐）

如果你习惯自行管理 Python 环境，这是最简单的方式：

```bash
# 安装 CoPaw
pip install copaw

# 初始化配置
copaw init --defaults

# 启动应用
copaw app
```

启动后，在浏览器打开 **http://127.0.0.1:8088/** 即可使用控制台！

---

### 方法二：一键安装（无需预装 Python）

不想折腾 Python 环境？一键安装脚本帮你搞定一切！

**macOS / Linux：**

```bash
curl -fsSL https://copaw.agentscope.io/install.sh | bash
```

**Windows（PowerShell）：**

```powershell
irm https://copaw.agentscope.io/install.ps1 | iex
```

安装完成后，打开新终端运行：

```bash
copaw init --defaults
copaw app
```

---

### 方法三：Docker 部署

喜欢用 Docker？一条命令跑起来：

```bash
# 拉取镜像
docker pull agentscope/copaw:latest

# 启动容器
docker run -p 8088:8088 -v copaw-data:/app/working agentscope/copaw:latest
```

然后在浏览器打开 **http://127.0.0.1:8088/** 即可！

配置、记忆与 Skills 会保存在 `copaw-data` 卷中。

---

### 方法四：魔搭创空间（云端部署）

不想本地安装？可以使用 **魔搭创空间** 一键云端配置！

> ⚠️ 注意：请将创空间设为 **非公开**，否则他人可能操纵你的 CoPaw。

---

### 方法五：阿里云 ECS 一键部署

如果你有阿里云 ECS，可以使用一键部署功能，3 分钟即可完成！

---

## 配置 API Key

使用云端大模型（如 DashScope、ModelScope）需要配置 API Key。

### 配置方式

**方式一：命令行初始化**

```bash
copaw init
```

运行时会引导你配置 LLM 提供商与 API Key。

**方式二：控制台配置**

打开 http://127.0.0.1:8088/ → 设置 → 模型，选择提供商并填写 API Key。

**方式三：环境变量**

```bash
# 使用 DashScope
export DASHSCOPE_API_KEY=your_api_key
```

---

## 使用本地模型（无需 API Key）

CoPaw 支持完全本地运行大模型，无需任何 API Key！

### llama.cpp（跨平台）

```bash
pip install 'copaw[llamacpp]'
```

### MLX（Apple Silicon M1/M2/M3/M4）

```bash
pip install 'copaw[mlx]'
```

---

## 接入多平台频道

CoPaw 支持多平台接入，你可以在以下平台与 AI 助手对话：

- 钉钉
- 飞书
- QQ
- Discord
- iMessage

详细配置方法请参考官方文档。

---

## 常用命令

```bash
# 初始化（交互式）
copaw init

# 初始化（使用默认配置）
copaw init --defaults

# 启动应用
copaw app

# 卸载（保留配置和数据）
copaw uninstall

# 卸载（删除所有内容）
copaw uninstall --purge
```

---

## 项目地址

- **GitHub**：https://github.com/agentscope-ai/CoPaw
- **文档**：https://github.com/agentscope-ai/CoPaw/blob/main/README_zh.md

---

## 总结

CoPaw 是一个强大且灵活的 AI 个人助理框架：

- ✅ 安装简单，3 分钟即可运行
- ✅ 支持本地和云端部署
- ✅ 支持多平台接入
- ✅ 支持本地模型，无需 API Key
- ✅ Skills 扩展，功能无限

如果你想要一个属于自己的 AI 助手，CoPaw 绝对值得一试！

---

**推荐指数**：⭐⭐⭐⭐⭐

**项目地址**：https://github.com/agentscope-ai/CoPaw

快去试试吧！
