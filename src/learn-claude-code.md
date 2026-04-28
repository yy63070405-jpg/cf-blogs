# GitHub 狂揽 18K Stars! 教你从零复刻 Claude Code

去年刚用 Claude Code 时，确实被惊艳到了。

没上手前，以为它只是个命令行里的模型外壳，用过才发现，这分明是个通用的 Agent。

LLM 的文本处理属性与 TUI 的指令交互天然契合，加之命令行环境自带的系统级权限，让 Claude 的编程思维和 Agent 能力发挥到了极致。

像是 Claude 这种编程、Agentic 能力特别强的模型，和 Claude Code 组合简直是降维打击。

你应该也好奇：这个黑盒子里到底装了什么？

想要彻底掌握 Claude Code 的精髓，最好的办法就是亲手复刻一套类似的逻辑。

推荐你看一下最近杀疯了的一个开源项目：**learn-claude-code**。

没过几天，它的 Star 数就直接冲到了 **18K**。

它不仅是在教你写代码，更是在教你如何构建一个能理解系统上下文、能自主执行任务的数字生命。

相信我，自己撸一遍后的收获，比单纯用它写一百个需求都要大。

---

## 01 开源项目简介

这是一个 **0→1 教学型项目**，带你从不到 200 行代码的最小 Agent 循序渐进搭出一个迷你 Claude Code。

具备工具调用、规划、子 Agent、任务系统、异步后台任务、多 Agent 协作、任务隔离等能力。

**开源地址**：https://github.com/shareAI-lab/learn-claude-code

它的理念是：**模型本身就是 Agent，我们只需要给它合适的工具、状态与协议，然后尽量少打扰它。**

项目不是生产级 Claude Code 克隆，而是教学用的内核实现：故意简化很多工程细节，把真正的 Agent 思维模型讲清楚，再用一套递进的 Python+文档+可视化 Web 平台帮你理解。

---

## 02 12 步，循序渐进

这个开源项目非常有结构化的学习路线：s01–s12。每一节只引入一个核心机制，并配套：Python 实现、对应文档。

### 第一节：The Agent Loop

> Motto："Bash is all you need" — one tool + one loop = an agent

最小 Agent 循环，教你基础 LLM 调用 + 工具调用 bash + 循环执行

### 第二节：Tool Use

> Motto："The loop didn't change" — adding tools means adding handlers, not logic

多工具扩展，在保持 agent_loop 结构几乎不变的情况下，扩展多个工具与对应 handler。核心循环稳定，扩展只在工具层。

### 第三节：Todo Write / Structured Planning

> Motto："Plan before you act" — visible plans improve task completion

显式规划：引入 Todo / 任务列表工具，类似 Claude Code 中的 todo。让模型先生成计划，再据此调度工具，增强长任务 / 多步骤任务的可靠性

### 第四节：Subagent

> Motto："Process isolation = context isolation" — fresh messages[] per subagent

子 Agent：可以生成新的子会话/子 Agent 执行子任务，每个子 Agent 拥有独立的 messages []，避免上下文互相污染。类似拆分大任务给不同的角色或子线程。

### 第五节：Skill Loading

> Motto："Load on demand, not upfront" — inject knowledge via tool_result, not system prompt

按需加载技能文件，使用 skills/ 目录中的 JSON/配置文件作为技能包。Agent 可以通过工具按需加载技能内容，并以 tool_result 的形式注入模型上下文。避免将一堆说明塞进 system prompt，提升上下文利用效率

### 第六节：Context Compact

> Motto："Strategic forgetting" — forget old context to enable infinite sessions

上下文压缩与遗忘：对长会话进行摘要或裁剪，保留关键任务状态和知识，而丢弃冗余聊天细节。让 Agent 可以无限持续工作，而不会撞上上下文长度上限

### 第七节：Task System

> Motto："State survives /compact" — file-based state outlives context compression

任务系统与持久化状态：引入任务（task）概念及文件级持久化，通常以 JSONL 或文件形式。把关键任务信息写入磁盘，这些状态不依赖上下文，即便进行了上下文压缩，任务状态仍然存在于文件系统中

### 第八节：Background Tasks

> Motto："Fire and forget" — non-blocking threads + notification queue

后台任务与非阻塞执行：使用线程或后台进程执行长耗时任务。主 Agent 不阻塞，依靠某种通知队列或轮询查看任务结果。模仿"我先去跑测试，跑完再通知你"这种行为

### 第九节：Agent Teams

> Motto："Append to send, drain to read" — async mailboxes for persistent teammates

多 Agent 团队协作：每个 Agent 有一个类似邮箱 / 队列的消息收发机制。通过写入/读取队列实现 Agent 间异步通信，支持长时间存在的虚拟队友，可以随时被唤醒参与协作

### 第 10 节：Team Protocols

> Motto："Same request_id, two protocols" — one FSM pattern powers shutdown + plan approval

通信协议与有限状态机（FSM）：在多 Agent 协作之上，引入更严格的协议，比如：任务审批、关机流程。使用 request_id + 状态机模式管理一次请求的生命周期，统一处理类似计划确认 / 中止等流程

### 第 11 节：Autonomous Agents

> Motto："Poll, claim, work, repeat" — no coordinator needed, agents self-organize

自组织的自治 Agent：通过轮询任务队列 → 认领任务 → 执行 → 写回结果的模式让一群 Agent 在没有中心协调者的情况下协同工作，类似任务池 + 工人自抢任务的模式

### 第 12 节：Worktree Task Isolation

> Motto："Isolate by directory, coordinate by task ID" — task board + optional worktree lanes

工作目录隔离 + 任务看板：不同任务使用不同 git worktree / 目录，从物理上隔离代码与环境。引入任务看板概念，用 Task ID 将工作与目录状态关联起来。模拟 Claude Code 中多 worktree、多分支并行开发的体验

每一节在 docs 中都有一篇文档，用问题 → 方案 → ASCII 图 → 少量代码片段的方式解释该特性背后的心智模型。

---

## 03 如何开始？

这个 0 到 1 的学习型项目，为保证学习路径清晰，有意简化或省略了部分机制。你可以通过下面的方式学习起来：

```bash
git clone https://github.com/shareAI-lab/learn-claude-code
cd learn-claude-code
pip install -r requirements.txt
cp .env.example .env

# 然后在 .env 里填写你的 ANTHROPIC_API_KEY、MODEL_ID 等

# 从最小 Agent Loop 开始
python agents/s01_agent_loop.py

# 想看完全体自治 Agent 团队：
python agents/s11_autonomous_agents.py

# 想体验带 worktree 任务隔离：
python agents/s12_worktree_task_isolation.py
```

.env.example 里会列出了所有需要配置的环境变量，比如模型 ID、Anthropic API 相关变量等。

运行 Web 学习平台：

```bash
cd web
npm install
npm run dev

# 浏览器访问
http://localhost:3000
```

适合在上手前先「扫一遍概念和可视化」，或者边看 front-end 页面边对照 agents 代码。

---

## 04 核心哲学

项目作者说：

> "Modern agents work not because of clever engineering, but because the model is trained to be an agent. Our job is to give it tools and stay out of the way."

（现代 Agent 之所以强大，不是因为工程技巧有多巧妙，而是因为模型本身就是被训练成 Agent 的。我们的工作只是给它工具，然后别挡路。）

这套教程的核心哲学就一句话：**The model is 80%. Code is 20%.**

---

**推荐指数**：⭐⭐⭐⭐⭐

**学习建议**：别急着直接跑 v8！作者强烈建议按顺序学习，先读 v0 理解核心循环，这是根基。
